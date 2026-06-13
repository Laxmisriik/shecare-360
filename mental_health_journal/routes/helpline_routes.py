from flask import Blueprint, request, jsonify
from database.db import SessionLocal
from database.models import Helpline

helpline_bp = Blueprint(
    "helpline",
    __name__,
    url_prefix="/api/helpline"
)

# --------------------------------
# GET HELPLINES BY REGION
# --------------------------------
@helpline_bp.route("", methods=["GET"])
def get_helplines():
    region = request.args.get("region")

    db = SessionLocal()

    if region:
        helplines = (
            db.query(Helpline)
            .filter(
                (Helpline.region == region) |
                (Helpline.is_national == True)
            )
            .all()
        )
    else:
        # Return all helplines if no region specified (for emergency SOS)
        helplines = db.query(Helpline).all()

    db.close()

    return jsonify([
        {
            "name": h.name,
            "phone": h.phone,
            "category": h.category,
            "region": h.region
        } for h in helplines
    ])


# --------------------------------
# SOS TRIGGER
# --------------------------------
@helpline_bp.route("/sos", methods=["POST"])
def sos():
    data = request.json

    return jsonify({
        "message": "SOS triggered",
        "action": "Call helpline immediately",
        "recommended_helpline": "Kiran Mental Health Helpline - 1800-599-0019"
    })
