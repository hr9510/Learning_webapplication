from flask import request, jsonify, Blueprint, redirect , url_for
from .models import Courses, Questions, CreateUser
from .extensions import db, jwt, create_refresh_token, create_access_token, get_jwt_identity, jwt_required
# from flask_dance.contrib.google import google, make_google_blueprint
main_bp = Blueprint("main_bp", __name__)

# google_bp = make_google_blueprint(
#     client_id="25815495030-9g8l9i9jafbmv4siksc1888dj42hlp7b.apps.googleusercontent.com",
#     client_secret="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",
#     scope=[
#         "https://www.googleapis.com/auth/userinfo.email",
#         "https://www.googleapis.com/auth/userinfo.profile",
#         "openid"
#     ],
#     redirect_to="main_bp.google_login"
# )

# @main_bp.route("/")
# def home():
#     return '<a href="/login/google">Login with Google</a>'


# @main_bp.route("/google_login")
# def google_login():
#     if not google.authorized:
#         return redirect(url_for("google.login"))
#     resp = google.get("/oauth2/v2/userinfo")
#     user_info = resp.json()
#     email = user_info["email"]
#     name = user_info["name"]
#     return f"Hello, {name} ({email})"

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    t = jwt_payload.get("type")
    if t == "access":
        return jsonify({"message": "ACCESS_TOKEN_EXPIRED"}), 401
    if t == "refresh":
        return jsonify({"message": "REFRESH_TOKEN_EXPIRED"}), 401
    return jsonify({"message": "TOKEN_EXPIRED"}), 401

# Agar token missing ho
@jwt.unauthorized_loader
def missing_token_callback(err):
    return jsonify({"message": "Missing Authorization Header"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(err):
    return jsonify({"message": "Invalid Token"}), 422

# ✅ Add Course
@main_bp.route("/setCourses", methods=["POST"], endpoint="setting_course")
@jwt_required()
def setCourses():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Send some data to post in database"}), 400
    
    add_course = Courses(
        title=data.get("title"),
        imgLink=data.get("imgLink"),
        vedioLink=data.get("vedioLink"),
        description=data.get("description"),
        completed=data.get("completed")
    )
    db.session.add(add_course)
    db.session.commit()
    return jsonify({"message": "New course added", "course" : {
        "title": data.get("title"),
    }}), 201


# ✅ Get all Courses
@main_bp.route("/getCourses", methods=["GET"], endpoint="getting_course")
@jwt_required()
def getCourses():
    courses = Courses.query.all()
    if not courses:
        return jsonify({"message": "No course Found"}), 404

    course_list = [
        {
            "id": course.id,
            "title": course.title,
            "imgLink": course.imgLink,
            "vedioLink": course.vedioLink,
            "description": course.description,
            "completed": course.completed
        }
        for course in courses
    ]
    return jsonify({"course_list" : course_list, "message" : "Course got successfully"}), 200


# ✅ Update Course
@main_bp.route("/updateCourses", methods=["POST"], endpoint="update_course")
@jwt_required()
def updateCourses():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Send some data to update in database"}), 400
    
    getId = data.get("id")
    if not getId:
        return jsonify({"message": "Course ID is required"}), 400

    course_to_update = Courses.query.filter_by(id=getId).first()
    if not course_to_update:
        return jsonify({"message": "Course not found"}), 404

    course_to_update.title = data.get("title", course_to_update.title)
    course_to_update.imgLink = data.get("imgLink", course_to_update.imgLink)
    course_to_update.vedioLink = data.get("vedioLink", course_to_update.vedioLink)
    course_to_update.description = data.get("description", course_to_update.description)
    course_to_update.completed = data.get("completed", course_to_update.completed)

    db.session.commit()
    return jsonify({"message": f"Course {getId} updated successfully"}), 200


# ✅ Delete Course
@main_bp.route("/deleteCourse/<int:id>", methods=["DELETE"], endpoint="deleting_courses")
@jwt_required()
def deleteCourse(id):
    course = Courses.query.get(id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": f"Course {course} deleted successfully!"}), 200


# ✅ Send Question
@main_bp.route("/sendQuestion", methods=["POST"], endpoint="sending_question")
@jwt_required()
def sendQuestions():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Send Question first"}), 400
    
    newQuestion = Questions(email=data.get("email"), question=data.get("question"))
    db.session.add(newQuestion)
    db.session.commit()
    return jsonify({"message": "New question added"}), 201


# ✅ Get Questions
@main_bp.route("/getQuestions", methods=["GET"], endpoint="getting_question")
@jwt_required()
def getQuestions():
    allQuestion = Questions.query.all()
    if not allQuestion:
        return jsonify({"message": "No questions found"}), 404
    
    question_List = [
        {
            "id": ques.id,
            "email": ques.email,
            "question": ques.question,
            "answer": ques.answer or ""
        }
        for ques in allQuestion
    ]
    return jsonify(question_List), 200


# ✅ Delete Question
@main_bp.route("/deleteQuestion/<int:id>", methods=["DELETE"], endpoint="deletingQuestion")
@jwt_required()
def deleteQuestion(id):
    ques = Questions.query.get(id)
    if not ques:
        return jsonify({"error": "Question not found"}), 404

    db.session.delete(ques)
    db.session.commit()
    return jsonify({"message": f"Question {ques} deleted successfully!"}), 200


# ✅ Register User
@main_bp.route('/register', methods=["POST"], endpoint="created_user")
def registerUser():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Send data first"}), 400

    if CreateUser.query.filter_by(email=data.get("email")).first():
        return jsonify({"message":"Email already exists"}), 400
    newUser = CreateUser(
        name=data.get("name"),
        email=data.get("email")  # TODO: Password ko hash karna chahiye
    )

    newUser.set_password(data.get("password"))
    db.session.add(newUser)
    db.session.commit()
    return jsonify({
        "message" : "User registered successfully",
        "user" : {
            "name" : data.get("name"),
            "email" : data.get("email")
        }
    })


# ✅ Get Users
@main_bp.route("/getCreatedUser", methods=["GET"])
@jwt_required()
def getUsers():
    getusers = CreateUser.query.all()
    if not getusers:
        return jsonify({"message": "No users found"}), 404
    
    usersList = [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email
        } for user in getusers
    ]
    return jsonify(usersList), 200

@main_bp.route("/deleteCreatedUser/<string:email>", methods=["DELETE"], endpoint="deletingCreatedUser")
@jwt_required()
def deleteUser(email):
    user = CreateUser.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": f"Create account using '{email}' this email first"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {email} deleted successfully!"}), 200

# ✅ Login User
@main_bp.route("/login", methods=["POST"], endpoint="login_user")
def loginUser():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and Password are required"}), 400
    
    user = CreateUser.query.filter_by(email = email).first()

    if not user:
        return jsonify({"message" : "Create Account First"})

    if user and user.check_password(password):
        accessToken = create_access_token(
        identity=data.get("email")
        )
        refreshToken = create_refresh_token(identity=data.get("email"))
        return jsonify({
            "message" : "User registered successfully",
            "token" : {"accessToken" : accessToken, "refreshToken" : refreshToken},
            "user" : {
                "name" : user.name,
                "email" : user.email
            }
        })
    else:
        return jsonify({"message" : "INVALID CREDENTIALS"})
    
@main_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refreshToken():
    identity = get_jwt_identity()
    new_access = create_access_token(identity=identity)
    return jsonify({"access" : new_access}), 200