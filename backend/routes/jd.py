from flask import Blueprint, request, jsonify
from backend.utils.db import get_collection
from backend.utils.gemini_jd import analyze_job_description_gemini
import fitz  # PyMuPDF library for handling PDF files

jd_api = Blueprint("jd_api", __name__)
jd_col = get_collection("job_descriptions")
jd_outputs_col = get_collection("jd_outputs")

@jd_api.route("/upload-jd", methods=["POST"])
def upload_jd():
    data = request.get_json()
    #jd_text = data["jd_text"]
    session_id = data.get("session_id")

    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if not file.filename.lower().endswith('.txt'):
            return jsonify({"error": "Only text files are supported"}), 400

        jd_text = extract_text(file)
        if not jd_text or not session_id:
            return jsonify({"error": "Missing job description text or session_id"}), 400
    
        jd_col.insert_one({
            "session_id": session_id,
            "jd_text": jd_text
        })

        return jsonify({"status": "uploaded", "filename": file.filename,"session_id": session_id})

    except Exception as e:
        print(f"🔥 Upload Resume Error: {e}")
        return jsonify({"error": str(e)}), 500

@jd_api.route("/analyze-jd", methods=["POST"])
def analyze_jd_api():
    try:
        data = request.get_json()
        # jd_text = data.get("jd_text")
        session_id = data.get("session_id")
        user_id = data.get("user_id", "spartan@sjsu.edu")

        # if not jd_text or not session_id:
        #     return jsonify({"error": "Missing JD text or session ID"}), 400

        jd_doc = jd_col.find_one({"session_id": session_id})
        if not jd_doc:
            return jsonify({"error": "JD not found"}), 404

        result = analyze_job_description_gemini(jd_doc["jd_text"])
        jd_outputs_col.insert_one({
            "user_id": user_id,
            "session_id": session_id,
            "analysis": result
        })
        return jsonify({"status": "analyzed", "session_id": session_id, "analysis": result})
    except Exception as e:
        print(f"🔥 Error in analyze_jd_api: {e}")
        return jsonify({"error": str(e)}), 500

def extract_text(file):
    doc = fitz.open(stream=file.read(), filetype="txt")
    return "".join([page.get_text() for page in doc])