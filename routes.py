from flask import Blueprint, request, jsonify
from models import Project, Contact
from app import db

api_bp = Blueprint("api", __name__)

@api_bp.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return jsonify([p.to_dict() for p in projects])

@api_bp.route("/projects", methods=["POST"])
def add_project():
    data = request.get_json() or {}
    title = data.get("title")
    description = data.get("description")
    link = data.get("link", "")
    if not title or not description:
        return jsonify({"error": "title and description required"}), 400
    p = Project(title=title, description=description, link=link)
    db.session.add(p)
    db.session.commit()
    return jsonify(p.to_dict()), 201

@api_bp.route("/contact", methods=["POST"])
def contact():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")
    if not message or not email:
        return jsonify({"error": "email and message required"}), 400
    c = Contact(name=name, email=email, message=message)
    db.session.add(c)
    db.session.commit()
    return jsonify({"msg": "Message saved"}), 201
