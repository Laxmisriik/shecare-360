import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///journal.db")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBVugTbKrFihx14Juq1hj8e_A6K_iOX-UI")
