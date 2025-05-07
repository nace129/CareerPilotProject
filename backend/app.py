from flask import Flask
from backend.routes.resume import resume_api
from backend.routes.jd import jd_api
from backend.routes.questions import questions_api

def create_app():
    app = Flask(__name__)
    app.secret_key = "supersecretkey"
    app.register_blueprint(resume_api)
    app.register_blueprint(jd_api)
    app.register_blueprint(questions_api)
    return app
