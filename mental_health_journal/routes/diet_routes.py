from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from database.db import engine
from database.models import DietLog
import json

diet_bp = Blueprint("diet", __name__, url_prefix="/api/diet")


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
def log_diet():
    data = request.get_json()

    user_id = data.get("user_id")
    meal_type = data.get("meal_type")
    food_item = data.get("food_item")

    if not all([user_id, meal_type, food_item]):
        return jsonify({"error": "Missing required fields"}), 400

    # AI Analysis
    nutrition = analyze_food_with_ai(food_item)

    with Session(engine) as db:
        entry = DietLog(
            user_id=user_id,
            meal_type=meal_type,
            food_item=food_item,
            carbs=nutrition["carbs"],
            protein=nutrition["protein"],
            fats=nutrition["fats"],
            vitamins=",".join(nutrition["vitamins"]),
            minerals=",".join(nutrition["minerals"])
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
