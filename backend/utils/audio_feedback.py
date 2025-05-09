import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# choose the same “flash” model you used elsewhere
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_answer(question_id: str, transcript: str, session_id: str) -> dict:
    """
    Given a question ID, the text transcript of a user's audio answer,
    and the session ID, return structured feedback as JSON:
      - strengths: list of positive points
      - improvements: list of suggestions
      - score: integer percent
    """
    prompt = f"""
You are an expert interview coach.  A user in interview session "{session_id}" just answered question "{question_id}".  
Here is their transcript:

\"\"\"{transcript}\"\"\"

Please return ONLY valid JSON with:
- strengths: a list of 2–3 things they did well
- improvements: a list of 2–3 concrete suggestions
- score: a single integer percent (0–100)

Example output:
{{
  "strengths": ["Clear structure", "Good detail on technical points"],
  "improvements": ["Slow down your pacing", "Give more quantifiable metrics"],
  "score": 78
}}
"""
    response = model.generate_content(prompt)
    text = response.text.strip()

    # strip code fences if present
    if text.startswith("```"):
        text = text.strip("```").replace("json", "", 1).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "error": "Failed to parse JSON",
            "raw": text
        }

# import os
# import cohere
# from backend.utils.db import get_collection

# # Initialize Cohere client
# co = cohere.Client(os.getenv("COHERE_API_KEY"))

# # Collection storing interview sessions with questions
# sessions_col = get_collection("interview_sessions")


# def analyze_answer(question_id: str, transcript: str, session_id: str) -> dict:
#     """
#     Given a session_id, question_id, and the candidate's transcript of their audio response,
#     fetches the original question text from MongoDB and uses Cohere Command R+ to generate
#     detailed feedback on the answer.
#     """
#     # Fetch session document
#     session = sessions_col.find_one({"session_id": session_id})
#     if not session:
#         raise ValueError(f"No interview session found with id '{session_id}'")

#     # Locate the question object
#     questions = session.get("questions", [])
#     question_obj = next((q for q in questions if q.get("id") == question_id), None)
#     if not question_obj:
#         raise ValueError(f"Question with id '{question_id}' not found in session '{session_id}'")

#     question_text = question_obj.get("text", "")

#     # Build prompt for feedback
#     prompt = (
#         f"You are an interview coach. Evaluate the following candidate response and provide constructive feedback.\n"
#         f"Question: {question_text}\n"
#         f"Candidate's Answer Transcript: {transcript}\n\n"
#         f"Your feedback should cover:\n"
#         f"- Clarity and coherence of the response\n"
#         f"- Depth and relevance to the question\n"
#         f"- Communication style and professionalism\n"
#         f"- Specific suggestions to improve future answers\n"
#         f"Return your feedback as a concise paragraph."
#     )

#     # Call Cohere Command R+ model
#     response = co.chat(
#         model="command-r-plus",  # ensure your API key has access to this model
#         message=prompt,
#         # max_tokens=200,
#         temperature=0.7
#     )

#     feedback = response.generations[0].text.strip()
#     return feedback
