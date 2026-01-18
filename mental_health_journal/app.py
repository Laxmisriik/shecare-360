from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy.orm import Session

from database.db import engine
from database.models import Base, User

from routes.chat_routes import chat_bp
from routes.journal_routes import journal_bp
from routes.sentiment_routes import sentiment_bp
from routes.period_routes import period_bp
from routes.diet_routes import diet_bp

import logging
import os

# ---------------------------
# APP SETUP
# ---------------------------
app = Flask(__name__)

# 🔑 REQUIRED for session-based memory
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-key")

CORS(app, supports_credentials=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------
# DATABASE INIT
# ---------------------------
# ✅ This now works because Base is correctly defined in db.py
Base.metadata.create_all(bind=engine)

# ---------------------------
# AUTH ROUTES
# ---------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "Missing JSON"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    with Session(engine) as session:
        existing_user = session.query(User).filter_by(username=username).first()
        if existing_user:
            return jsonify({"success": False, "message": "User already exists"}), 409

        user = User(username=username, password=password)
        session.add(user)
        session.commit()

    return jsonify({"success": True, "message": "Registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "Missing JSON"}), 400

    username = data.get("username")
    password = data.get("password")

    with Session(engine) as session:
        user = session.query(User).filter_by(
            username=username,
            password=password
        ).first()

        if not user:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

    return jsonify({
        "success": True,
        "message": "Login successful",
        "user": username
    }), 200


# ---------------------------
# REGISTER BLUEPRINTS
# ---------------------------
# 🧠 Chat + Journal
app.register_blueprint(chat_bp)
app.register_blueprint(journal_bp)
app.register_blueprint(sentiment_bp)

# 🩸 Period + 🥗 Diet (PCOS)
app.register_blueprint(period_bp)
app.register_blueprint(diet_bp)

# ---------------------------
# HEALTH CHECK
# ---------------------------
@app.route("/")
def home():
    return "🧠 Mental Health + PCOS Backend Running ✔️"


# ---------------------------
# RUN SERVER
# ---------------------------
if __name__ == "__main__":
    app.run(port=8001, debug=True)
