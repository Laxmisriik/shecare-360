from dotenv import load_dotenv
load_dotenv()  # load .env before config/db import reads environment variables

from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token

from database.db import engine
from database.models import Base, User

from routes.chat_routes import chat_bp
from routes.journal_routes import journal_bp
from routes.sentiment_routes import sentiment_bp
from routes.period_routes import period_bp
from routes.diet_routes import diet_bp
from routes.pregnancy_routes import pregnancy_bp
from routes.helpline_routes import helpline_bp


import logging
import os

# ---------------------------
# APP SETUP
# ---------------------------
app = Flask(__name__)

# 🔑 REQUIRED for session-based memory
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-key")

CORS(app, supports_credentials=True)

# ---------------------------
# JWT SETUP (secret from environment only — no insecure fallback)
# ---------------------------
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY is not set. Add it to mental_health_journal/.env "
        "(or the environment) before starting the server."
    )
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt_manager = JWTManager(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _is_hashed(value: str) -> bool:
    """werkzeug hashes are prefixed with their method (pbkdf2:/scrypt:)."""
    return bool(value) and value.startswith(("pbkdf2:", "scrypt:"))

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

        user = User(username=username, password=generate_password_hash(password))
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
        user = session.query(User).filter_by(username=username).first()

        if not user:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        stored = user.password or ""
        if _is_hashed(stored):
            valid = check_password_hash(stored, password)
        else:
            # Legacy plaintext row: verify directly, then upgrade to a hash.
            valid = (stored == password)
            if valid:
                user.password = generate_password_hash(password)
                session.commit()

        if not valid:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        user_id = user.id  # capture before the session closes

    access_token = create_access_token(identity=str(user_id))
    return jsonify({
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "user_id": user_id,
        "username": username,
    }), 200


# ---------------------------
# REGISTER BLUEPRINTS
# ---------------------------
# 🧠 Chat + Journal
app.register_blueprint(chat_bp)
app.register_blueprint(journal_bp)
app.register_blueprint(sentiment_bp)

app.register_blueprint(pregnancy_bp, url_prefix="/api/pregnancy")


# 🩸 Period + 🥗 Diet (PCOS)
app.register_blueprint(period_bp)
# diet_bp already has url_prefix="/api/diet" so do not add extra prefix
app.register_blueprint(diet_bp)
app.register_blueprint(helpline_bp)


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
