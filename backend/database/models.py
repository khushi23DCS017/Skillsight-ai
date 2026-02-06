from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'student' or 'faculty'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    student = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    branch = db.Column(db.String(50), nullable=False)
    cgpa = db.Column(db.Float, nullable=False)
    tenth_marks = db.Column(db.Float, nullable=False)
    twelfth_marks = db.Column(db.Float, nullable=False)
    internships = db.Column(db.Integer, default=0)
    projects = db.Column(db.Integer, default=0)
    placed = db.Column(db.Boolean, default=False)
    salary = db.Column(db.Float, nullable=True)
    
    # Relationships
    skills = db.relationship('StudentSkill', backref='student', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'branch': self.branch,
            'cgpa': self.cgpa,
            'tenth_marks': self.tenth_marks,
            'twelfth_marks': self.twelfth_marks,
            'internships': self.internships,
            'projects': self.projects,
            'placed': self.placed,
            'salary': self.salary,
            'skills': [s.skill_name for s in self.skills]
        }

class StudentSkill(db.Model):
    __tablename__ = 'student_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)

class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    min_cgpa = db.Column(db.Float, nullable=False)
    salary = db.Column(db.Float, nullable=False)
    
    # Relationships
    skills = db.relationship('CompanySkill', backref='company', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'min_cgpa': self.min_cgpa,
            'salary': self.salary,
            'skills': [s.skill_name for s in self.skills]
        }

class CompanySkill(db.Model):
    __tablename__ = 'company_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)
