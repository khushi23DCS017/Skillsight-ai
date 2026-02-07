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
    
    # Relationships
    student = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    faculty = db.relationship('Faculty', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Faculty(db.Model):
    __tablename__ = 'faculty'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(100), nullable=True)
    experience_years = db.Column(db.Integer, nullable=True)
    qualification = db.Column(db.String(200), nullable=True)
    subjects = db.Column(db.Text, nullable=True)  # JSON string of subjects
    specialization = db.Column(db.String(100), nullable=True)
    skills = db.Column(db.Text, nullable=True)  # JSON string of skills
    profile_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        import json
        subjects_list = []
        if self.subjects:
            try:
                subjects_list = json.loads(self.subjects)
            except:
                subjects_list = [self.subjects]
        
        skills_list = []
        if self.skills:
            try:
                skills_list = json.loads(self.skills)
            except:
                skills_list = [self.skills]
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'department': self.department,
            'designation': self.designation,
            'experience_years': self.experience_years,
            'qualification': self.qualification,
            'subjects': subjects_list,
            'specialization': self.specialization,
            'skills': skills_list,
            'profile_completed': self.profile_completed,
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
    profile_data = db.Column(db.Text, nullable=True)  # JSON string for extended profile
    
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
            'skills': [s.skill_name for s in self.skills],
            'profile_data': self.profile_data
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
