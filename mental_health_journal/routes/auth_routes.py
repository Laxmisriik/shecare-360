from flask import Blueprint, request, jsonify
from database.db import get_db
from database.models import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth_bp", __name__, url_prefix="/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    db = get_db()

    # check if user exists
    existing = db.query(User).filter(User.username == username).first()
    if existing:
        return jsonify({"error": "User already exists"}), 409

    hashed_pw = generate_password_hash(password)

    new_user = User(username=username, password=hashed_pw)
    db.add(new_user)
    db.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    db = get_db()

    user = db.query(User).filter(User.username == username).first()
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({"message": "Login successful"}), 200
