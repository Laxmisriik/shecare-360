# routes/chat_routes.py

from flask import Blueprint, request, jsonify, session
from nlp.sentiment import detect_emotion
from nlp.chatbot import get_reply

chat_bp = Blueprint("chat", __name__)

# Ensure session memory exists
def get_memory():
    if "memory" not in session:
        session["memory"] = []
    return session["memory"]


@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json or {}
    text = data.get("message", "").strip()

    if not text:
        return jsonify({"error": "message field is required"}), 400

    # 🔹 Sentiment detection
    mood, confidence = detect_emotion(text)

    # 🔹 Get per-user memory
    memory = get_memory()

    # 🔹 Get Gemini reply WITH memory
    reply = get_reply(text, mood, memory)

    # 🔹 Update memory (max 5)
    memory.append({
        "user": text,
        "mood": mood
    })
    session["memory"] = memory[-5:]

    return jsonify({
        "message": text,
        "mood": mood,
        "confidence": round(float(confidence), 3),
        "bot_reply": reply
    }), 200


@chat_bp.route("/history", methods=["GET"])
def chat_history():
    return jsonify({
        "memory": session.get("memory", [])
    }), 200
