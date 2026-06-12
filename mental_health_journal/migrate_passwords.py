"""
One-shot migration: hash any plaintext user passwords in place.

Phase 0 introduced werkzeug password hashing in app.py. Existing rows in
journal.db were stored as plaintext. Run this once to convert them all:

    cd mental_health_journal
    python migrate_passwords.py

It is idempotent: rows already stored as a werkzeug hash (pbkdf2:/scrypt:)
are skipped, so re-running is safe.

IMPORTANT: back up journal.db before running (a backup was created at
backups/phase0-2026-06-12/journal.db.bak during Phase 0).
"""

from werkzeug.security import generate_password_hash

from database.db import SessionLocal
from database.models import User


def _is_hashed(value: str) -> bool:
    return bool(value) and value.startswith(("pbkdf2:", "scrypt:"))


def migrate() -> None:
    db = SessionLocal()
    try:
        users = db.query(User).all()
        converted = skipped = 0

        for user in users:
            if _is_hashed(user.password or ""):
                skipped += 1
                continue
            user.password = generate_password_hash(user.password or "")
            converted += 1

        db.commit()
        print(f"[OK] Migration complete: {converted} converted, {skipped} already hashed.")
    except Exception as exc:  # pragma: no cover - operational script
        db.rollback()
        print(f"[FAILED] Migration rolled back: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    migrate()
