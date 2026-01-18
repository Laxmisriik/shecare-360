from flask import Blueprint, request, jsonify
from database.queries import save_entry, list_entries


journal_bp = Blueprint("journal", __name__)




@journal_bp.route("/save", methods=["POST"])
def save():
    data = request.json or {}
    message = data.get("message")
    mood = data.get("mood")
    confidence = data.get("confidence")


    if not message:
        return jsonify({"error": "message is required"}), 400


    entry = save_entry(message=message, mood=mood, confidence=confidence or 0)
    return jsonify({"id": entry.id, "created_at": entry.created_at.isoformat()})




@journal_bp.route("/entries", methods=["GET"])
def entries():
    limit = int(request.args.get("limit", 100))
    results = list_entries(limit=limit)
    return jsonify(results)
