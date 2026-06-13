# Phase 2 — Final Plan (APPROVED, not yet applied)

Status: **approved direction, code not yet written.** This note reflects the sign-off decisions.
Implementation begins only after this contract review is acknowledged.

Approved decisions:
1. **Journal migration** — add `user_id`; backfill existing rows to a **dedicated migration/dev user**; **never delete** historical data.
2. **Diet recommendations** — static `NUTRIENT_FOODS` lookup; deterministic, dependency-free.
3. **Diet history** — most recent **100** records; no pagination this phase.
4. **Identity** — use `get_jwt_identity()`, **no `<id>` route params** (prevents IDOR).

---

## 1. Diet endpoints — final contracts

Both live in `routes/diet_routes.py` (blueprint `diet_bp`, prefix `/api/diet`), use `SessionLocal()`
(Phase 0 standard), and take **no path parameter** — the user is the token bearer.

### 1a. `GET /api/diet/history`
- **Auth:** `@jwt_required()`; `user_id = int(get_jwt_identity())`.
- **Behavior:** the caller's own `DietLog` rows, `order_by(logged_at DESC)`, `limit(100)`.
- **200 response** — JSON array (matches the `DietLog` TS interface in `DietTracker.tsx`):
```json
[
  {
    "meal_type": "breakfast",
    "food_item": "oats",
    "nutrients": { "carbs": "moderate", "protein": "moderate", "missing_nutrients": ["Fiber"] },
    "logged_at": "2026-06-13T08:00:00"
  }
]
```
- **No logs:** `[]`.
- **401:** missing/invalid/expired token (flask-jwt-extended default JSON).

### 1b. `GET /api/diet/recommendations`
- **Auth:** `@jwt_required()`; `user_id = int(get_jwt_identity())`.
- **Behavior:** scan the caller's most recent 100 `DietLog` rows; dedupe every
  `nutrients["missing_nutrients"]` into `missing_nutrients`; map each via the static
  `NUTRIENT_FOODS` table.
- **200 response** — (matches the `Recommendations` TS interface):
```json
{
  "missing_nutrients": ["Fiber", "Vitamin C"],
  "food_recommendations": {
    "Fiber": ["Spinach", "Carrot", "Beans", "Oats"],
    "Vitamin C": ["Orange", "Guava", "Lemon", "Amla"]
  }
}
```
- **No logs:** `{ "missing_nutrients": [], "food_recommendations": {} }`.
- **Unknown nutrient** (missing but absent from `NUTRIENT_FOODS`): listed in `missing_nutrients`,
  **omitted** from `food_recommendations` (deterministic; no guessing).
- **401:** as above.

Static lookup (deterministic, no external deps):
```python
NUTRIENT_FOODS = {
    "Fiber":     ["Spinach", "Carrot", "Beans", "Oats"],
    "Vitamin C": ["Orange", "Guava", "Lemon", "Amla"],
    "Iron":      ["Spinach", "Lentils", "Jaggery", "Dates"],
    "Calcium":   ["Yogurt", "Ragi", "Sesame seeds", "Milk"],
}
```

### 1c. Required frontend change (consequence of dropping `<id>`)
`src/pages/DietTracker.tsx` currently calls `/api/diet/history/${userId}` and
`/api/diet/recommendations/${userId}`. With identity from the token, these become:
```ts
const r = await authedFetch(`/api/diet/history`);
const r = await authedFetch(`/api/diet/recommendations`);
```
The `if (userId == null) return;` guards may stay (avoid firing before auth hydrates) but are now
optional. No other UI change. This is the only frontend edit in Phase 2.

---

## 2. JournalEntry migration — final plan

### 2a. Model change — `database/models.py`
```python
class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,          # safe after backfill; create_all() honors it on fresh DBs
        index=True,
    )
    message = Column(Text, nullable=False)
    mood = Column(String(64))
    confidence = Column(String(16))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="journals")
```
On `User` (mirrors `periods`/`diets`/`pregnancies`):
```python
journals = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")
```

### 2b. Dedicated migration user
- A reserved account owns all pre-existing (ownerless) entries — **no real user, no data loss**.
- Username: **`__legacy_journal__`**, created with an unusable random password hash
  (`generate_password_hash(secrets.token_urlsafe(32))`).
- Created by the migration script only if absent; its id is the backfill target.

### 2c. Migration script — `mental_health_journal/migrate_journal_userid.py`
Mirrors the existing `migrate_passwords.py` pattern; **idempotent**; **no deletes**.
1. **Back up** `journal.db` → `backups/phase2-<date>/journal.db.bak` (and abort if the source DB is missing).
2. `PRAGMA table_info(journal_entries)` → does `user_id` exist?
3. If missing: `ALTER TABLE journal_entries ADD COLUMN user_id INTEGER REFERENCES users(id);`
   (SQLite adds it nullable — the intended intermediate state).
4. Ensure the dedicated user exists; capture `legacy_id`.
5. **Backfill:** `UPDATE journal_entries SET user_id = :legacy_id WHERE user_id IS NULL;`
6. Print counts (`column_added`, `rows_backfilled`, `legacy_user_id`).
7. Re-run safe: column already present + zero NULL rows → 0 changes.

### 2d. Scoped queries — `database/queries.py` + `routes/journal_routes.py`
```python
# queries.py
def save_entry(user_id: int, message: str, mood: str, confidence: float): ...
def list_entries(user_id: int, limit: int = 100):
    q = (db.query(JournalEntry)
           .filter(JournalEntry.user_id == user_id)
           .order_by(JournalEntry.created_at.desc())
           .limit(limit))

# journal_routes.py — identity from token, never the client
@journal_bp.route("/save", methods=["POST"])
@jwt_required()
def save():
    user_id = int(get_jwt_identity())
    ...
    save_entry(user_id=user_id, message=message, mood=mood, confidence=confidence or 0)

@journal_bp.route("/entries", methods=["GET"])
@jwt_required()
def entries():
    user_id = int(get_jwt_identity())
    return jsonify(list_entries(user_id=user_id, limit=int(request.args.get("limit", 100))))
```

### 2e. Order of operations (important)
`Base.metadata.create_all()` does **not** ALTER existing tables, so the column must be added by the
script before the new query code runs against the old DB:
1. Apply the code changes (model + queries + routes).
2. Run `python migrate_journal_userid.py` **once** (adds column + backfills the existing `journal.db`).
3. Restart the server.
- Fresh DB: `create_all()` already builds `journal_entries` **with** `user_id`; the script's ALTER
  is skipped and there are no rows to backfill — still safe to run.

### 2f. Notes / residual risk
- SQLite FK enforcement is off by default → the FK is declarative (acceptable for dev; revisit on Postgres).
- No frontend page calls `/save` or `/entries` yet, so journal isolation lands without UI impact.

---

## Suggested implementation order
1. **Diet endpoints** (`/history`, `/recommendations`) + the one `DietTracker.tsx` URL edit — no schema change; closes the `TODO.md` Diet Tracker API items.
2. **Journal isolation** — model + queries + routes, then run `migrate_journal_userid.py` (with DB backup).

All open questions from the prior draft are now resolved by the approved decisions above.
