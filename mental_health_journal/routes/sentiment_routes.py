# sentiment_routes.py
from flask import Blueprint, request, jsonify
from nlp.sentiment import analyze_sentiment, detect_emotion

sentiment_bp = Blueprint("sentiment_bp", __name__, url_prefix="/api/sentiment")


@sentiment_bp.route("/", methods=["GET","POST"])
def get_sentiment():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Text is required"}), 400

    text = data["text"]

    # Use Hugging Face model to detect emotion
    mood, confidence = detect_emotion(text)

    return jsonify({
        "text": text,
        "sentiment": {
            "mood": mood,
            "confidence": round(float(confidence), 3)
        }
    }), 200
