from database.models import db, User, Student, StudentSkill, Company, CompanySkill

class DatabaseService:
    
    @staticmethod
    def get_all_students():
        """Get all students with their skills"""
        students = Student.query.all()
        return [s.to_dict() for s in students]
    
    @staticmethod
    def get_student_by_user_id(user_id):
        """Get student by user ID"""
        # Ensure user_id is an integer
        try:
            uid = int(user_id)
        except (ValueError, TypeError):
            return None
            
        student = Student.query.filter_by(user_id=uid).first()
        return student.to_dict() if student else None
    
    @staticmethod
    def get_student_by_id(student_id):
        """Get student by student ID"""
        student = Student.query.get(student_id)
        return student.to_dict() if student else None
    
    @staticmethod
    def create_student(user_id, name, branch, cgpa, tenth_marks, twelfth_marks, 
                      internships=0, projects=0, skills=None):
        """Create a new student record"""
        student = Student(
            user_id=user_id,
            name=name,
            branch=branch,
            cgpa=cgpa,
            tenth_marks=tenth_marks,
            twelfth_marks=twelfth_marks,
            internships=internships,
            projects=projects
        )
        db.session.add(student)
        db.session.flush()  # Get student ID
        
        # Add skills
        if skills:
            for skill in skills:
                student_skill = StudentSkill(student_id=student.id, skill_name=skill.strip())
                db.session.add(student_skill)
        
        db.session.commit()
        return student.to_dict()
    
    @staticmethod
    def update_student(student_id, **kwargs):
        """Update student record"""
        student = Student.query.get(student_id)
        if not student:
            return None
        
        # Update basic fields
        for key, value in kwargs.items():
            if key == 'skills':
                # Update skills separately
                StudentSkill.query.filter_by(student_id=student_id).delete()
                for skill in value:
                    student_skill = StudentSkill(student_id=student_id, skill_name=skill.strip())
                    db.session.add(student_skill)
            elif hasattr(student, key):
                setattr(student, key, value)
        
        db.session.commit()
        return student.to_dict()
    
    @staticmethod
    def delete_student(student_id):
        """Delete student record"""
        student = Student.query.get(student_id)
        if student:
            db.session.delete(student)
            db.session.commit()
            return True
        return False
    
    @staticmethod
    def get_all_companies():
        """Get all companies with their skills"""
        companies = Company.query.all()
        return [c.to_dict() for c in companies]
    
    @staticmethod
    def get_company_by_name(name):
        """Get company by name"""
        company = Company.query.filter_by(name=name).first()
        return company.to_dict() if company else None
    
    @staticmethod
    def get_analytics_data():
        """Get analytics data for dashboard"""
        students = Student.query.all()
        
        if not students:
            return {
                'total_students': 0,
                'placed_students': 0,
                'placement_rate': 0,
                'avg_salary': 0,
                'students_data': []
            }
        
        total = len(students)
        placed = sum(1 for s in students if s.placed)
        placed_students = [s for s in students if s.placed and s.salary]
        avg_salary = sum(s.salary for s in placed_students) / len(placed_students) if placed_students else 0
        
        return {
            'total_students': total,
            'placed_students': placed,
            'placement_rate': round((placed / total * 100), 2) if total > 0 else 0,
            'avg_salary': round(avg_salary, 2),
            'students_data': [s.to_dict() for s in students]
        }
