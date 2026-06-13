"""
One-shot migration: give journal_entries an owner (user_id) and backfill
pre-existing, ownerless rows to a dedicated legacy user.

Phase 1 gated the journal routes behind JWT, but JournalEntry had no user_id,
so every authenticated user shared one global feed. Phase 2 adds the column and
isolates entries per user. Existing rows have no real owner, so they are
reassigned to a reserved account (NEVER deleted).

Run once, from the mental_health_journal/ directory:

    cd mental_health_journal
    python migrate_journal_userid.py

It is idempotent:
- the user_id column is added only if missing,
- the legacy user is created only if absent,
- only rows still NULL are backfilled.
Re-running reports 0 changes.

A timestamped backup of the SQLite DB is written under backups/ before any
schema change.
"""

import os
import shutil
import secrets
from datetime import datetime

from sqlalchemy import text

from database.db import engine, SessionLocal
from database.models import User
from werkzeug.security import generate_password_hash

LEGACY_USERNAME = "__legacy_journal__"


def _backup_sqlite_db() -> None:
    """Copy the SQLite file to backups/phase2-<timestamp>/ before altering it."""
    db_path = engine.url.database
    if not db_path or engine.url.get_backend_name() != "sqlite":
        print("[skip] Non-SQLite or in-memory DB; no file backup taken.")
        return

    db_path = os.path.abspath(db_path)
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file not found: {db_path}")

    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_dir = os.path.join("backups", f"phase2-{stamp}")
    os.makedirs(backup_dir, exist_ok=True)
    dest = os.path.join(backup_dir, os.path.basename(db_path) + ".bak")
    shutil.copy2(db_path, dest)
    print(f"[OK] Backed up DB -> {dest}")


def _user_id_column_exists() -> bool:
    with engine.connect() as conn:
        rows = conn.execute(text("PRAGMA table_info(journal_entries)")).fetchall()
    return any(row[1] == "user_id" for row in rows)


def _add_user_id_column() -> bool:
    """Add the nullable column if missing. Returns True if it was added."""
    if _user_id_column_exists():
        print("[skip] journal_entries.user_id already exists.")
        return False
    with engine.begin() as conn:
        # SQLite adds the column nullable; backfill then enforces non-null at the app layer.
        conn.execute(text(
            "ALTER TABLE journal_entries "
            "ADD COLUMN user_id INTEGER REFERENCES users(id)"
        ))
    print("[OK] Added column journal_entries.user_id")
    return True


def _ensure_legacy_user() -> int:
    """Return the id of the dedicated legacy user, creating it if needed."""
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(username=LEGACY_USERNAME).first()
        if user:
            print(f"[skip] Legacy user '{LEGACY_USERNAME}' already exists (id={user.id}).")
            return user.id
        # Unusable password: random secret, hashed, never shared.
        user = User(
            username=LEGACY_USERNAME,
            password=generate_password_hash(secrets.token_urlsafe(32)),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"[OK] Created legacy user '{LEGACY_USERNAME}' (id={user.id}).")
        return user.id
    finally:
        db.close()


def _backfill(legacy_id: int) -> int:
    """Assign ownerless rows to the legacy user. Returns rows updated."""
    with engine.begin() as conn:
        result = conn.execute(
            text("UPDATE journal_entries SET user_id = :uid WHERE user_id IS NULL"),
            {"uid": legacy_id},
        )
    count = result.rowcount or 0
    print(f"[OK] Backfilled {count} ownerless journal row(s) to user_id={legacy_id}.")
    return count


def migrate() -> None:
    print("=== Journal user_id migration ===")
    _backup_sqlite_db()
    column_added = _add_user_id_column()
    legacy_id = _ensure_legacy_user()
    rows_backfilled = _backfill(legacy_id)
    print("--- Summary ---")
    print(f"column_added={column_added} legacy_user_id={legacy_id} rows_backfilled={rows_backfilled}")
    print("[DONE] Migration complete.")


if __name__ == "__main__":
    migrate()
