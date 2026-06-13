from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from database.db import engine, SessionLocal
from database.models import DietLog
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

diet_bp = Blueprint("diet", __name__, url_prefix="/api/diet")

# Static, deterministic nutrient -> food lookup for recommendations (no external deps).
NUTRIENT_FOODS = {
    "Fiber":     ["Spinach", "Carrot", "Beans", "Oats"],
    "Vitamin C": ["Orange", "Guava", "Lemon", "Amla"],
    "Iron":      ["Spinach", "Lentils", "Jaggery", "Dates"],
    "Calcium":   ["Yogurt", "Ragi", "Sesame seeds", "Milk"],
}

# Most-recent records returned by history / scanned for recommendations.
HISTORY_LIMIT = 100


# -------------------------------
# AI-BASED FOOD ANALYSIS (SIMULATED LLM)
# -------------------------------
def analyze_food_with_ai(food_text: str):
    """
    This simulates an LLM response.
    Later you can replace this with HuggingFace / OpenAI API.
    """

    prompt = f"""
    Analyze the Indian food: {food_text}
    Give nutrient levels and missing nutrients.
    """

    # Simulated AI reasoning (LLM-like)
    analysis = {
        "carbs": "high" if "rice" in food_text or "biryani" in food_text else "moderate",
        "protein": "moderate",
        "fats": "high" if "fried" in food_text or "biryani" in food_text else "low",
        "vitamins": ["B-complex"],
        "minerals": ["Iron"],
        "missing_nutrients": ["Fiber", "Vitamin C"]
    }

    return analysis


# -------------------------------
# LOG DIET WITH AI ANALYSIS
# -------------------------------
@diet_bp.route("/log", methods=["POST"])
@jwt_required()
def log_diet():
    data = request.get_json()

    user_id = int(get_jwt_identity())   # identity from JWT, not client input
    meal_type = data.get("meal_type")
    food_item = data.get("food_item")

    if not all([meal_type, food_item]):
        return jsonify({"error": "Missing required fields"}), 400

    # AI Analysis
    nutrition = analyze_food_with_ai(food_item)

    with Session(engine) as db:
        entry = DietLog(
            user_id=user_id,
            meal_type=meal_type,
            food_item=food_item,
            nutrients=nutrition,  # JSON column already defined on DietLog
        )
        db.add(entry)
        db.commit()

    # Suggestions
    suggestions = []
    if "Fiber" in nutrition["missing_nutrients"]:
        suggestions.append("Add vegetables like spinach, carrot, beans")
    if "Vitamin C" in nutrition["missing_nutrients"]:
        suggestions.append("Add fruits like orange, guava, lemon")

    return jsonify({
        "success": True,
        "food": food_item,
        "nutrition_analysis": nutrition,
        "suggestions": suggestions
    }), 201


# -------------------------------
# DIET HISTORY (most recent 100, owner = token bearer)
# -------------------------------
@diet_bp.route("/history", methods=["GET"])
@jwt_required()
def diet_history():
    user_id = int(get_jwt_identity())   # identity from JWT, never the client

    db = SessionLocal()
    try:
        logs = (
            db.query(DietLog)
            .filter(DietLog.user_id == user_id)
            .order_by(DietLog.logged_at.desc())
            .limit(HISTORY_LIMIT)
            .all()
        )

        return jsonify([
            {
                "meal_type": log.meal_type,
                "food_item": log.food_item,
                "nutrients": log.nutrients or {},
                "logged_at": log.logged_at.isoformat() if log.logged_at else None,
            }
            for log in logs
        ]), 200
    finally:
        db.close()


# -------------------------------
# DIET RECOMMENDATIONS (from the token bearer's own logs)
# -------------------------------
@diet_bp.route("/recommendations", methods=["GET"])
@jwt_required()
def diet_recommendations():
    user_id = int(get_jwt_identity())   # identity from JWT, never the client

    db = SessionLocal()
    try:
        logs = (
            db.query(DietLog)
            .filter(DietLog.user_id == user_id)
            .order_by(DietLog.logged_at.desc())
            .limit(HISTORY_LIMIT)
            .all()
        )
    finally:
        db.close()

    # Dedupe missing nutrients across the user's recent logs, preserving order.
    missing_nutrients = []
    for log in logs:
        for nutrient in (log.nutrients or {}).get("missing_nutrients", []):
            if nutrient not in missing_nutrients:
                missing_nutrients.append(nutrient)

    # Map each missing nutrient to foods; nutrients absent from the table are
    # reported as missing but omitted from food_recommendations (deterministic).
    food_recommendations = {
        nutrient: NUTRIENT_FOODS[nutrient]
        for nutrient in missing_nutrients
        if nutrient in NUTRIENT_FOODS
    }

    return jsonify({
        "missing_nutrients": missing_nutrients,
        "food_recommendations": food_recommendations,
    }), 200
