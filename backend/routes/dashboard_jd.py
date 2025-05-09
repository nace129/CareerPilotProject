import uuid
from flask import Blueprint, request, jsonify
from backend.utils.db import get_collection
from backend.utils.gemini_jd import analyze_job_description_gemini

dashboard_jd_api = Blueprint("dashboard_jd_api", __name__)
jd_col = get_collection("jds")
jd_outputs_col = get_collection("jd_outputs")

@dashboard_jd_api.route("/dashboard-upload-jd", methods=["POST"])
def upload_and_analyze_jd():
    payload = request.get_json() or {}
    session_id = payload.get("session_id")
    jd_text    = payload.get("jd_text","").strip()
    if not session_id or not jd_text:
        return jsonify(error="Missing session_id or jd_text"), 400

    jd_col.insert_one({"session_id": session_id, "jd_text": jd_text})
    analysis = analyze_job_description_gemini(jd_text)
    jd_outputs_col.insert_one({"session_id": session_id, "analysis": analysis})

    return jsonify(status="ok", session_id=session_id)
