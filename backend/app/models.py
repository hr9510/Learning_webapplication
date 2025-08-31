from .extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class Courses(db.Model):
    __tablename__ = "learningCourse"
    id = db.Column(db.Integer, unique=True , primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    imgLink = db.Column(db.String(200), nullable=False)
    vedioLink = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)

    def __repr__(self):
        return f"<Courses {self.title}/>"
 

class Questions(db.Model):
    __tablename__ = "Questions"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    email = db.Column(db.String(200),  nullable=False)  # email string hona chahiye
    question = db.Column(db.String(1000), nullable=False)
    answer = db.Column(
        db.String(1000) , default = "soon", nullable=True
    )

    def __repr__(self):
        return f"<Question {self.email}/>"

class CreateUser(db.Model):
    __tablename__ = "CreatedUserData"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f"<CreatedUser {self.name}/>"
    
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
  