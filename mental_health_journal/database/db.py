# database/db.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import DATABASE_URL

if DATABASE_URL is None:
    raise RuntimeError("DATABASE_URL is not set in .env")

# SQLAlchemy Base
Base = declarative_base()

# Engine
engine = create_engine(DATABASE_URL, echo=False)

# Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
