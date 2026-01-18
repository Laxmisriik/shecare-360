# database/models.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    DateTime,
    ForeignKey,
    JSON
)
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base


# ---------------------------
# USER MODEL
# ---------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

    # Relationships
    periods = relationship(
        "PeriodCycle",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    symptoms = relationship(
        "SymptomLog",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    diets = relationship(
        "DietLog",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# ---------------------------
# JOURNAL MODEL
# ---------------------------
class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    mood = Column(String(64))
    confidence = Column(String(16))
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "mood": self.mood,
            "confidence": self.confidence,
            "created_at": self.created_at.isoformat(),
        }


# ---------------------------
# CHAT HISTORY MODEL
# ---------------------------
class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    mood = Column(String(64))
    confidence = Column(String(16))
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_message": self.user_message,
            "ai_response": self.ai_response,
            "mood": self.mood,
            "confidence": self.confidence,
            "timestamp": self.created_at.isoformat(),
        }


# ---------------------------
# PERIOD CYCLE MODEL
# ---------------------------
class PeriodCycle(Base):
    __tablename__ = "period_cycles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    start_date = Column(Date, nullable=False)
    cycle_length = Column(Integer, nullable=False)
    period_length = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="periods")


# ---------------------------
# SYMPTOM LOG MODEL
# ---------------------------
class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    date = Column(Date, nullable=False)
    symptom = Column(String(64), nullable=False)
    severity = Column(Integer)  # 1–5 scale
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="symptoms")


# ---------------------------
# DIET LOG MODEL (AI READY)
# ---------------------------
class DietLog(Base):
    __tablename__ = "diet_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    meal_type = Column(String(32), nullable=False)   # breakfast / lunch / dinner
    food_item = Column(String(255), nullable=False)  # ANY Indian food
    category = Column(String(64))                    # optional tag

    # AI-generated nutrition breakdown
    nutrients = Column(JSON)  
    # Example:
    # {
    #   "carbohydrates": "45g",
    #   "protein": "12g",
    #   "fats": "10g",
    #   "vitamins": ["B6", "C"],
    #   "minerals": ["Iron", "Magnesium"],
    #   "missing": ["Calcium"]
    # }

    logged_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="diets")
