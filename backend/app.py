from flask import Flask
from backend.routes.resume import resume_api
from backend.routes.jd import jd_api
from backend.routes.questions import questions_api
from backend.routes.history import history_api
from backend.routes.dashboard_resume import dashboard_resume_api
from backend.routes.dashboard_jd import dashboard_jd_api
from backend.routes.interview import interview_api
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    app.secret_key = "supersecretkey"
    app.register_blueprint(resume_api)
    app.register_blueprint(jd_api)
    app.register_blueprint(questions_api)
    app.register_blueprint(history_api)
    app.register_blueprint(dashboard_resume_api)
    app.register_blueprint(dashboard_jd_api)
    app.register_blueprint(interview_api)
    return app
