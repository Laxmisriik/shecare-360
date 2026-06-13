from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from database.db import SessionLocal
from database.models import PeriodCycle
from flask_jwt_extended import jwt_required, get_jwt_identity

period_bp = Blueprint("period", __name__, url_prefix="/api/period")


@period_bp.route("/log", methods=["POST"])
@jwt_required()
def log_period():
    data = request.get_json()

    user_id = int(get_jwt_identity())   # identity from JWT, not client input
    start_date = data.get("start_date")
    cycle_length = data.get("cycle_length")
    period_length = data.get("period_length")

    if not all([start_date, cycle_length, period_length]):
        return jsonify({
            "error": "start_date, cycle_length, and period_length are required"
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


# -------------------------------
# CYCLE INSIGHTS (Phase 3) — JWT-only, derived from the caller's PeriodCycle rows
# -------------------------------
@period_bp.route("/insights", methods=["GET"])
@jwt_required()
def cycle_insights():
    user_id = int(get_jwt_identity())   # identity from JWT, never the client

    db = SessionLocal()
    try:
        cycles = (
            db.query(PeriodCycle)
            .filter(PeriodCycle.user_id == user_id)
            .order_by(PeriodCycle.start_date.asc())
            .all()
        )
        # Snapshot the fields we need before the session closes.
        rows = [
            {
                "start_date": c.start_date,
                "cycle_length": c.cycle_length,
                "period_length": c.period_length,
            }
            for c in cycles
        ]
    finally:
        db.close()

    if not rows:
        return jsonify({"has_data": False}), 200

    last = rows[-1]
    last_start = last["start_date"]

    # Average cycle length: prefer observed gaps between consecutive starts;
    # fall back to the logged cycle_length values when only one cycle exists.
    if len(rows) >= 2:
        gaps = [
            (rows[i + 1]["start_date"] - rows[i]["start_date"]).days
            for i in range(len(rows) - 1)
        ]
        gaps = [g for g in gaps if g > 0]
        avg_cycle = round(sum(gaps) / len(gaps)) if gaps else last["cycle_length"]
    else:
        avg_cycle = last["cycle_length"]

    avg_cycle = int(avg_cycle or 28)
    period_length = int(last["period_length"] or 5)

    next_start = last_start + timedelta(days=avg_cycle)
    next_end = next_start + timedelta(days=period_length - 1)
    ovulation = next_start - timedelta(days=14)
    fertile_start = ovulation - timedelta(days=5)
    fertile_end = ovulation + timedelta(days=1)

    return jsonify({
        "has_data": True,
        "cycles_logged": len(rows),
        "average_cycle_length": avg_cycle,
        "period_length": period_length,
        "last_period_start": last_start.isoformat(),
        "next_period_start": next_start.isoformat(),
        "next_period_end": next_end.isoformat(),
        "ovulation_day": ovulation.isoformat(),
        "fertile_window_start": fertile_start.isoformat(),
        "fertile_window_end": fertile_end.isoformat(),
    }), 200
