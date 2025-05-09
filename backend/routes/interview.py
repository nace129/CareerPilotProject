from flask import Blueprint, request, jsonify
from backend.utils.speech_to_text import transcribe_audio_bytes
from backend.utils.audio_feedback import analyze_answer  # your LLM wrapper

interview_api = Blueprint("interview_api", __name__)

@interview_api.route("/submit-answer", methods=["POST"])
def submit_answer():
    session_id = request.form.get("session_id")
    question_id = request.form.get("question_id")
    file = request.files.get("file")

    if not (session_id and question_id and file):
        return jsonify({"error": "Missing fields"}), 400

    # 1️⃣ Read raw audio
    audio_bytes = file.read()

    # 2️⃣ Transcribe
    try:
        transcript = transcribe_audio_bytes(audio_bytes)
    except Exception as e:
        return jsonify({"error": f"Transcription failed: {e}"}), 500

    # 3️⃣ Run your LLM feedback on the transcript + question
    feedback = analyze_answer(question_id, transcript, session_id)

    # 4️⃣ (Optional) save transcript and feedback to MongoDB here...

    return jsonify({"feedback": feedback})

# # backend/routes/interview.py
# from flask import Blueprint, request, jsonify
# from backend.utils.db import get_collection
# from backend.utils.audio_feedback import transcribe_and_feedback  # see below

# interview_api = Blueprint("interview_api", __name__)

# # Persist user answers + feedback
# answers_col = get_collection("answers")

# @interview_api.route("/submit-answer", methods=["POST"])
# def submit_answer():
#     session_id  = request.form.get("session_id")
#     question_id = request.form.get("question_id")
#     audio_file  = request.files.get("file")

#     if not (session_id and question_id and audio_file):
#         return jsonify({"error": "Missing session_id, question_id or file"}), 400

#     # 1) Transcribe + generate feedback
#     feedback = transcribe_and_feedback(session_id, question_id, audio_file)

#     # 2) Save it
#     answers_col.insert_one({
#         "session_id":  session_id,
#         "question_id": question_id,
#         "feedback":    feedback
#     })

#     return jsonify({"feedback": feedback})
