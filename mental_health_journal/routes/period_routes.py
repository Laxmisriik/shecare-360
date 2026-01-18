from flask import Blueprint, request, jsonify
from datetime import datetime
from database.db import SessionLocal
from database.models import PeriodCycle

period_bp = Blueprint("period", __name__, url_prefix="/api/period")


@period_bp.route("/log", methods=["POST"])
def log_period():
    data = request.get_json()

    user_id = data.get("user_id")
    start_date = data.get("start_date")
    cycle_length = data.get("cycle_length")
    period_length = data.get("period_length")

    if not all([user_id, start_date, cycle_length, period_length]):
        return jsonify({
            "error": "user_id, start_date, cycle_length, and period_length are required"
        }), 400

    # ✅ Convert string → date
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    db = SessionLocal()
    try:
        period = PeriodCycle(
            user_id=user_id,
            start_date=start_date,
            cycle_length=cycle_length,
            period_length=period_length
        )
        db.add(period)
        db.commit()
        db.refresh(period)
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

    return jsonify({
        "success": True,
        "message": "Period logged successfully",
        "period_id": period.id
    }), 201
