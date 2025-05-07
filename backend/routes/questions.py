from flask import Blueprint, request, jsonify
from backend.utils.db import get_collection
from backend.utils.cohere_utils import generate_questions, calculate_match_score

questions_api = Blueprint("questions_api", __name__)
resume_outputs_col = get_collection("resume_outputs")
jd_outputs_col = get_collection("jd_outputs")

@questions_api.route("/generate-questions", methods=["POST"])
def generate_interview_questions():
    try:
        data = request.get_json()
        session_id = data.get("session_id")

        if not session_id:
            return jsonify({"error": "Missing session ID"}), 400

        resume_doc = resume_outputs_col.find_one({"session_id": session_id})
        jd_doc = jd_outputs_col.find_one({"session_id": session_id})

        if not (resume_doc and jd_doc):
            return jsonify({"error": "Documents missing"}), 404

        resume_analysis = resume_doc["analysis"]
        jd_analysis = jd_doc["analysis"]

        questions = generate_questions(resume_analysis, jd_analysis)

        return jsonify({"session_id": session_id, "questions": questions})
    except Exception as e:
        print(f"🔥 Error in /generate-questions: {e}")
        return jsonify({"error": str(e)}), 500

@questions_api.route("/match-score", methods=["POST"])
def match_score():
    try:
        data = request.get_json()
        session_id = data.get("session_id")

        if not session_id:
            return jsonify({"error": "Missing session ID"}), 400
        
        resume_doc = resume_outputs_col.find_one({"session_id": session_id})
        jd_doc = jd_outputs_col.find_one({"session_id": session_id})

        if not resume_doc or not jd_doc:
            return jsonify({"error": "Missing resume or JD analysis for this session ID"}), 404

        resume_analysis = resume_doc["analysis"]
        jd_analysis = jd_doc["analysis"]

        score = calculate_match_score(resume_analysis, jd_analysis)

        return jsonify({"session_id": session_id, "match_score": score})
    except Exception as e:
        print(f"🔥 Error in /match-score: {e}")
        return jsonify({"error": str(e)}), 500
