import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///journal.db")
# Read from environment only — never hardcode secrets in source.
# The key lives in mental_health_journal/.env (and must be rotated, since the
# previous literal was committed to git history).
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
