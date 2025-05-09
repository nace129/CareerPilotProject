import uuid
from flask import Blueprint, request, jsonify
import fitz
from backend.utils.db import get_collection
from backend.utils.gemini_resume import analyze_resume

dashboard_resume_api = Blueprint("dashboard_resume_api", __name__)
resumes_col = get_collection("resumes")
resume_outputs_col = get_collection("resume_outputs")

@dashboard_resume_api.route("/dashboard-upload-resume", methods=["POST"])
def upload_and_analyze_resume():
    # 1️⃣ save the file text + session_id
    file = request.files.get("file")
    if not file or not file.filename.lower().endswith(".pdf"):
        return jsonify(error="Please upload a PDF"), 400

    text = extract_text(file)
    session_id = str(uuid.uuid4())

    resumes_col.insert_one({
        "session_id": session_id,
        "filename": file.filename,
        "resume_text": text
    })

    # 2️⃣ analyze immediately
    analysis = analyze_resume(text)
    resume_outputs_col.insert_one({
        "session_id": session_id,
        "analysis": analysis
    })

    return jsonify(status="ok", session_id=session_id)

def extract_text(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    return "".join([page.get_text() for page in doc])