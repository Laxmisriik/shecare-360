from flask import Blueprint, request, jsonify
from datetime import datetime, date
from database.db import SessionLocal
from database.models import SymptomLog
from flask_jwt_extended import jwt_required, get_jwt_identity

symptom_bp = Blueprint("symptom", __name__, url_prefix="/api/symptom")

HISTORY_LIMIT = 100


# -------------------------------
# LOG A SYMPTOM (owner = token bearer)
# -------------------------------
@symptom_bp.route("/log", methods=["POST"])
@jwt_required()
def log_symptom():
    user_id = int(get_jwt_identity())   # identity from JWT, never the client
    data = request.get_json() or {}

    symptom = (data.get("symptom") or "").strip()
    if not symptom:
        return jsonify({"error": "symptom is required"}), 400

    severity = data.get("severity")
    if severity is not None:
        try:
            severity = int(severity)
        except (TypeError, ValueError):
            return jsonify({"error": "severity must be an integer 1-5"}), 400
        if not 1 <= severity <= 5:
            return jsonify({"error": "severity must be between 1 and 5"}), 400

    # Optional date (YYYY-MM-DD); defaults to today.
    log_date = date.today()
    if data.get("date"):
        try:
            log_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    db = SessionLocal()
    try:
        entry = SymptomLog(
            user_id=user_id,
            date=log_date,
            symptom=symptom,
            severity=severity,
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        entry_id = entry.id
    finally:
        db.close()

    return jsonify({
        "success": True,
        "id": entry_id,
        "symptom": symptom,
        "severity": severity,
        "date": log_date.isoformat(),
    }), 201


# -------------------------------
# SYMPTOM HISTORY (most recent 100, owner = token bearer)
# -------------------------------
@symptom_bp.route("/history", methods=["GET"])
@jwt_required()
def symptom_history():
    user_id = int(get_jwt_identity())   # identity from JWT, never the client

    db = SessionLocal()
    try:
        logs = (
            db.query(SymptomLog)
            .filter(SymptomLog.user_id == user_id)
            .order_by(SymptomLog.created_at.desc())
            .limit(HISTORY_LIMIT)
            .all()
        )

        return jsonify([
            {
                "id": log.id,
                "symptom": log.symptom,
                "severity": log.severity,
                "date": log.date.isoformat() if log.date else None,
                "created_at": log.created_at.isoformat() if log.created_at else None,
            }
            for log in logs
        ]), 200
    finally:
        db.close()
