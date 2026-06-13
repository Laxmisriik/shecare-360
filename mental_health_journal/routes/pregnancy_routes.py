from flask import Blueprint, request, jsonify
from datetime import datetime, date
from database.db import SessionLocal
from database.models import PregnancyLog
from datetime import timedelta
from flask_jwt_extended import jwt_required, get_jwt_identity


pregnancy_bp = Blueprint("pregnancy", __name__)


def calculate_pregnancy_week(lmp_date: date):
    today = date.today()
    days_pregnant = (today - lmp_date).days
    week = days_pregnant // 7
    return max(week, 0)


@pregnancy_bp.route("/add", methods=["POST"])
@jwt_required()
def add_pregnancy_log():

    db = SessionLocal()
    data = request.json

    user_id = int(get_jwt_identity())   # identity from JWT, not client input

    lmp = datetime.strptime(
        data["last_menstrual_period"], "%Y-%m-%d"
    ).date()

    current_week = calculate_pregnancy_week(lmp)
    due_date = lmp + timedelta(days=280)

    pregnancy = PregnancyLog(
        user_id=user_id,
        last_menstrual_period=lmp,
        expected_due_date=due_date,
        current_week=current_week,
        symptoms=data.get("symptoms", {}),
        notes=data.get("notes", "")
    )
   

    db.add(pregnancy)
    db.commit()
    db.refresh(pregnancy)
    db.close()

    return jsonify({
        "message": "Pregnancy log created",
        "current_week": current_week
    })


def _trimester(week: int) -> str:
    if week <= 12:
        return "First"
    if week <= 27:
        return "Second"
    return "Third"


# Phase 3: JWT-only status (no user_id in URL). Returns the caller's latest
# pregnancy with week/trimester recomputed live from LMP so it stays current.
@pregnancy_bp.route("/status", methods=["GET"])
@jwt_required()
def get_my_pregnancy_status():
    user_id = int(get_jwt_identity())   # identity from JWT, never the client

    db = SessionLocal()
    try:
        pregnancy = (
            db.query(PregnancyLog)
            .filter(PregnancyLog.user_id == user_id)
            .order_by(PregnancyLog.created_at.desc())
            .first()
        )
    finally:
        db.close()

    if not pregnancy:
        return jsonify({"has_pregnancy": False}), 200

    current_week = calculate_pregnancy_week(pregnancy.last_menstrual_period)
    return jsonify({
        "has_pregnancy": True,
        "last_menstrual_period": pregnancy.last_menstrual_period.isoformat(),
        "expected_due_date": (
            pregnancy.expected_due_date.isoformat()
            if pregnancy.expected_due_date else None
        ),
        "current_week": current_week,
        "trimester": _trimester(current_week),
        "weeks_remaining": max(0, 40 - current_week),
    }), 200


@pregnancy_bp.route("/status/<int:user_id>", methods=["GET"])
@jwt_required()
def get_pregnancy_status(user_id):
    if int(get_jwt_identity()) != user_id:
        return jsonify({"error": "Forbidden"}), 403
    db = SessionLocal()

    pregnancy = (
        db.query(PregnancyLog)
        .filter(PregnancyLog.user_id == user_id)
        .order_by(PregnancyLog.created_at.desc())
        .first()
    )

    db.close()

    if not pregnancy:
        return jsonify({"message": "No pregnancy data found"}), 404

    return jsonify({
        "current_week": pregnancy.current_week,
        "trimester": (
            "First" if pregnancy.current_week <= 12
            else "Second" if pregnancy.current_week <= 27
            else "Third"
        ),
        "symptoms": pregnancy.symptoms,
        "notes": pregnancy.notes
    })
@pregnancy_bp.route("/guidance/<int:week>", methods=["GET"])
def pregnancy_guidance(week):
    guidance = {
        "nutrition": "",
        "exercise": "",
        "alerts": []
    }

    if week <= 12:
        guidance["nutrition"] = "Iron-rich foods, folic acid, hydration"
        guidance["exercise"] = "Light walking, prenatal yoga"
        guidance["alerts"].append("Avoid heavy lifting")

    elif week <= 27:
        guidance["nutrition"] = "Protein-rich meals, calcium"
        guidance["exercise"] = "Stretching, breathing exercises"

    else:
        guidance["nutrition"] = "Small frequent meals, omega-3"
        guidance["exercise"] = "Pelvic exercises, slow walks"
        guidance["alerts"].append("Watch for swelling or dizziness")

    return jsonify({
        "week": week,
        "guidance": guidance
    })

@pregnancy_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_pregnancy_log(user_id):
    if int(get_jwt_identity()) != user_id:
        return {"error": "Forbidden"}, 403
    db = SessionLocal()

    try:
        log = (
            db.query(PregnancyLog)
            .filter(PregnancyLog.user_id == user_id)
            .order_by(PregnancyLog.created_at.desc())
            .first()
        )

        if not log:
            return {"message": "No pregnancy data found"}, 404

        return {
            "id": log.id,
            "user_id": log.user_id,
            "last_menstrual_period": log.last_menstrual_period.isoformat(),
            "expected_due_date": log.expected_due_date.isoformat() if log.expected_due_date else None,
            "current_week": log.current_week,
            "symptoms": log.symptoms,
            "notes": log.notes,
            "created_at": log.created_at.isoformat()
        }, 200

    finally:
        db.close()