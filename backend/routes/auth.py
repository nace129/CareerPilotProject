from flask import Blueprint, request, jsonify
from backend.utils.db import get_collection
from backend.utils.db import db
from backend.utils.db import get_collection


auth_api = Blueprint("auth_api", __name__)
users_col = get_collection("user_sample")

@auth_api.route("/test-mongo")
def test_mongo():
    try:
        db.command("ping")
        return jsonify({"status": "Connected to MongoDB"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_api.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = users_col.find_one({"email": email, "password": password})
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # Simulated session (replace with JWT/session in prod)
    return jsonify({
        "user": {
            "name": user.get("name"),
            "email": user.get("email")
        }
    }), 200


# users_col = get_collection("user_sample")

@auth_api.route("/users", methods=["GET"])
def get_users():
    users = list(users_col.find({}, {"_id": 0}))  # omit _id for clarity
    return jsonify(users)


@auth_api.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not name or not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if email or username already exists
    if users_col.find_one({"email": email}) or users_col.find_one({"username": username}):
        return jsonify({"error": "User already exists"}), 409

    # Insert user with all fields
    users_col.insert_one({
        "name": name,
        "username": username,
        "email": email,
        "password": password  # 🔐 hash in production
    })

    return jsonify({"message": "Registration successful"}), 201

