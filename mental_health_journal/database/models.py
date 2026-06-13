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
from sqlalchemy import Boolean, Float


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

    pregnancies = relationship(
        "PregnancyLog",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    journals = relationship(
        "JournalEntry",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# ---------------------------
# JOURNAL MODEL
# ---------------------------
class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    message = Column(Text, nullable=False)
    mood = Column(String(64))
    confidence = Column(String(16))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="journals")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
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
# ---------------------------
# PREGNANCY TRACKING MODEL
# ---------------------------

class PregnancyLog(Base):
    __tablename__ = "pregnancy_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    last_menstrual_period = Column(Date, nullable=False)
    expected_due_date = Column(Date)
    current_week = Column(Integer)

    symptoms = Column(JSON)  # nausea, fatigue, cravings etc
    notes = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="pregnancies")

class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    heart_rate = Column(Integer)
    sleep_hours = Column(Float)
    steps = Column(Integer)
    calories_burned = Column(Integer)
    hrv = Column(Float)  # stress indicator

    recorded_at = Column(DateTime, default=datetime.utcnow)

# database/models.py


# ---------------------------
# EMERGENCY HELPLINE MODEL
# ---------------------------
class Helpline(Base):
    __tablename__ = "helplines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)

    region = Column(String(100))          # Tamil Nadu, Kerala, India
    category = Column(String(50))          # mental, suicide, women
    is_national = Column(Boolean, default=False)
