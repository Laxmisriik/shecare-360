from flask import Blueprint, request, jsonify
from database.queries import save_entry, list_entries
from flask_jwt_extended import jwt_required, get_jwt_identity


journal_bp = Blueprint("journal", __name__)




@journal_bp.route("/save", methods=["POST"])
@jwt_required()
def save():
    user_id = int(get_jwt_identity())   # identity from JWT, never the client
    data = request.json or {}
    message = data.get("message")
    mood = data.get("mood")
    confidence = data.get("confidence")


    if not message:
        return jsonify({"error": "message is required"}), 400


    entry = save_entry(user_id=user_id, message=message, mood=mood, confidence=confidence or 0)
    return jsonify({"id": entry.id, "created_at": entry.created_at.isoformat()})




@journal_bp.route("/entries", methods=["GET"])
@jwt_required()
def entries():
    user_id = int(get_jwt_identity())   # identity from JWT, never the client
    limit = int(request.args.get("limit", 100))
    results = list_entries(user_id=user_id, limit=limit)
    return jsonify(results)
