"""
Database initialization script
Run this to create tables and populate initial data
"""
import os
import sys
import pandas as pd

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from database.models import db, User, Student, StudentSkill, Company, CompanySkill
from auth.auth_service import AuthService

def init_database(app):
    """Initialize database with tables"""
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✓ Database tables created")

def create_default_faculty(app):
    """Create default faculty account"""
    with app.app_context():
        # Check if faculty exists
        faculty = User.query.filter_by(email='faculty@college.edu').first()
        if not faculty:
            user, error = AuthService.register_user(
                email='faculty@college.edu',
                password='faculty123',
                role='faculty'
            )
            if user:
                print("✓ Default faculty account created: faculty@college.edu / faculty123")
            else:
                print(f"✗ Error creating faculty: {error}")
        else:
            print("✓ Faculty account already exists")

def migrate_csv_data(app):
    """Migrate data from CSV files to database"""
    with app.app_context():
        # Check if data already migrated
        if Student.query.count() > 0:
            print("✓ Data already migrated")
            return
        
        # Migrate students
        students_csv = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'students.csv')
        if os.path.exists(students_csv):
            df = pd.read_csv(students_csv)
            print(f"Migrating {len(df)} students...")
            
            for idx, row in df.iterrows():
                # Create user account for each student
                email = f"student{idx+1}@college.edu"
                user, error = AuthService.register_user(
                    email=email,
                    password='student123',  # Default password
                    role='student'
                )
                
                if user:
                    # Parse skills
                    skills = []
                    if pd.notna(row.get('Skills')):
                        skills_str = str(row['Skills'])
                        if '|' in skills_str:
                            skills = skills_str.split('|')
                        elif ',' in skills_str:
                            skills = skills_str.split(',')
                        else:
                            skills = [skills_str]
                    
                    # Create student record
                    student = Student(
                        user_id=user.id,
                        name=row.get('Name', f'Student {idx+1}'),
                        branch=row.get('Branch', 'CSE'),
                        cgpa=float(row.get('CGPA', 0)),
                        tenth_marks=float(row.get('10th_Marks', 0)),
                        twelfth_marks=float(row.get('12th_Marks', 0)),
                        internships=int(row.get('Internships', 0)),
                        projects=int(row.get('Projects', 0)),
                        placed=bool(row.get('Placed', 0)),
                        salary=float(row.get('Salary', 0)) if pd.notna(row.get('Salary')) and row.get('Salary') > 0 else None
                    )
                    db.session.add(student)
                    db.session.flush()
                    
                    # Add skills
                    for skill in skills:
                        if skill.strip():
                            student_skill = StudentSkill(
                                student_id=student.id,
                                skill_name=skill.strip()
                            )
                            db.session.add(student_skill)
            
            db.session.commit()
            print(f"✓ Migrated {len(df)} students")
        else:
            print("✗ students.csv not found")
        
        # Migrate companies
        companies_csv = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'companies.csv')
        if os.path.exists(companies_csv):
            df = pd.read_csv(companies_csv)
            print(f"Migrating {len(df)} companies...")
            
            for idx, row in df.iterrows():
                company = Company(
                    name=row['name'],
                    min_cgpa=float(row['min_cgpa']),
                    salary=float(row['salary'])
                )
                db.session.add(company)
                db.session.flush()
                
                # Parse skills
                skills_str = row['skills']
                # Remove brackets and quotes
                skills_str = skills_str.replace("['", "").replace("']", "").replace("'", "")
                skills = [s.strip() for s in skills_str.split(',')]
                
                for skill in skills:
                    if skill:
                        company_skill = CompanySkill(
                            company_id=company.id,
                            skill_name=skill
                        )
                        db.session.add(company_skill)
            
            db.session.commit()
            print(f"✓ Migrated {len(df)} companies")
        else:
            print("✗ companies.csv not found")

if __name__ == '__main__':
    # Create Flask app
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillsight.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    print("Initializing SkillSight Database...")
    print("=" * 50)
    
    init_database(app)
    create_default_faculty(app)
    migrate_csv_data(app)
    
    print("=" * 50)
    print("✓ Database initialization complete!")
    print("\nDefault Credentials:")
    print("  Faculty: faculty@college.edu / faculty123")
    print("  Students: student1@college.edu / student123 (and so on)")
