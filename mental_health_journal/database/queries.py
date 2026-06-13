from .db import SessionLocal
from .models import JournalEntry




def save_entry(user_id: int, message: str, mood: str, confidence: float):
    db = SessionLocal()
    try:
        entry = JournalEntry(
            user_id=user_id,
            message=message,
            mood=mood,
            confidence=str(round(float(confidence), 3)),
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry
    finally:
        db.close()




def list_entries(user_id: int, limit: int = 100):
    db = SessionLocal()
    try:
        q = (
            db.query(JournalEntry)
            .filter(JournalEntry.user_id == user_id)
            .order_by(JournalEntry.created_at.desc())
            .limit(limit)
        )
        return [e.to_dict() for e in q]
    finally:
        db.close()
