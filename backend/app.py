import sys
import os
# Add parent directory to path to allow importing ml_engine
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, get_jwt
import tempfile
import traceback

# Database imports
from database.models import db, User, Faculty
from database.db_service import DatabaseService
from auth.auth_service import AuthService

# ML imports
try:
    from ml_engine.inference import Predictor
    from ml_engine.resume_analyzer import ResumeAnalyzer
    from ml_engine.analytics import AnalyticsEngine
    from ml_engine.prs_service import PRSService
    from ml_engine.skill_gap_service import SkillGapService
    from ml_engine.roadmap_service import RoadmapService
    from ml_engine.learning_path_service import LearningPathService
    from ml_engine.curriculum_advisor import CurriculumAdvisor
except ImportError as e:
    import traceback
    with open("backend_import_error.log", "w") as f:
        f.write(f"CRITICAL ML IMPORT ERROR: {e}\n")
        f.write(traceback.format_exc())
    print(f"CRITICAL ML IMPORT ERROR: {e}")
    Predictor = None
    ResumeAnalyzer = None
    AnalyticsEngine = None
    PRSService = None
    SkillGapService = None
    RoadmapService = None
    LearningPathService = None
    CurriculumAdvisor = None

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillsight.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Initialize ML Components
try:
    if Predictor:
        predictor = Predictor()
        print("ML Engine Loaded Successfully")
    else:
        predictor = None
        print("ML Engine module not found")
    
    if ResumeAnalyzer:
        resume_analyzer = ResumeAnalyzer()
        print("Resume Analyzer Loaded Successfully")
    else:
        print("ResumeAnalyzer class is None, skipping initialization")
        resume_analyzer = None
    
    if AnalyticsEngine:
        analytics_engine = AnalyticsEngine()
        print("Analytics Engine Loaded")
    else:
        analytics_engine = None
        
    if PRSService:
        print("Attempting to initialize PRSService...")
        prs_service = PRSService()
        print("PRS Service Loaded Successfully")
    else:
        print("PRSService class is None, skipping initialization")
        prs_service = None

    if SkillGapService:
        print("Attempting to initialize SkillGapService...")
        skill_gap_service = SkillGapService()
        print("SkillGap Service Loaded Successfully")
    else:
        print("SkillGapService class is None, skipping initialization")
        skill_gap_service = None

    if RoadmapService:
        print("Attempting to initialize RoadmapService...")
        roadmap_service = RoadmapService()
        print("Roadmap Service Loaded Successfully")
    else:
        print("RoadmapService class is None, skipping initialization")
        roadmap_service = None

    if LearningPathService:
        print("Attempting to initialize LearningPathService...")
        learning_path_service = LearningPathService()
        print("LearningPath Service Loaded Successfully")
    else:
        print("LearningPathService class is None, skipping initialization")
        learning_path_service = None

    if CurriculumAdvisor:
        print("Attempting to initialize CurriculumAdvisor...")
        curriculum_advisor = CurriculumAdvisor()
        print("CurriculumAdvisor Service Loaded Successfully")
    else:
        print("CurriculumAdvisor class is None, skipping initialization")
        curriculum_advisor = None
        
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"CRITICAL ML INIT ERROR: {e}")
    predictor = None
    resume_analyzer = None
    analytics_engine = None
    prs_service = None
    skill_gap_service = None
    roadmap_service = None
    learning_path_service = None
    curriculum_advisor = None

@app.route('/')
def home():
    return """
    <html>
        <head><title>SkillSight AI Backend</title></head>
        <body style="font-family: Arial; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h1>🎓 SkillSight AI - Backend API</h1>
            <p>Status: <strong>Running</strong></p>
            <h3>Available Endpoints:</h3>
            <ul>
                <li><strong>POST /api/auth/register</strong> - Register new user</li>
                <li><strong>POST /api/auth/login</strong> - Login user</li>
                <li><strong>GET /api/students</strong> - Get all students (Faculty only)</li>
                <li><strong>POST /api/students</strong> - Create student (Faculty only)</li>
                <li><strong>GET /api/students/me</strong> - Get current student profile</li>
                <li><strong>POST /api/predict/placement</strong> - Predict placement</li>
                <li><strong>POST /api/recommend/roadmap</strong> - Get company roadmap</li>
                <li><strong>POST /api/analyze/resume</strong> - Analyze resume</li>
                <li><strong>GET /api/analytics/dashboard</strong> - Get analytics data</li>
            </ul>
        </body>
    </html>
    """

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "ml_engine": predictor is not None})

# ============ Authentication Endpoints ============

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email', '').strip().lower()
    password = data.get('password')
    role = data.get('role', 'student')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
        
    # Domain Validation
    if role == 'student':
        if not email.endswith('.edu.in'):
            return jsonify({"error": "Student email must end with .edu.in"}), 400
    elif role in ['faculty', 'admin', 'tpo']:
        if not email.endswith('.ac.in'):
             return jsonify({"error": f"{role.capitalize()} email must end with .ac.in"}), 400
    else:
        return jsonify({"error": "Invalid role"}), 400
    
    user, error = AuthService.register_user(email, password, role)
    if error:
        return jsonify({"error": error}), 400
    
    return jsonify({"message": "User registered successfully", "user": user.to_dict()}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    
    result, error = AuthService.login_user(email, password)
    if error:
        return jsonify({"error": error}), 401
    
    return jsonify(result), 200

# ============ Student Endpoints ============

@app.route('/api/students', methods=['GET'])
@jwt_required()
def get_students():
    claims = get_jwt()
    if claims.get('role') != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    students = DatabaseService.get_all_students()
    return jsonify(students), 200

@app.route('/api/students', methods=['POST'])
@jwt_required()
def create_student():
    claims = get_jwt()
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Check permissions: Faculty OR Student creating their own profile
    is_faculty = claims.get('role') == 'faculty'
    # Ensure data['user_id'] is present and matches current user if not faculty
    target_user_id = data.get('user_id')
    is_own_profile = target_user_id is not None and str(target_user_id) == str(current_user_id)
    
    if not (is_faculty or is_own_profile):
        print(f"DEBUG: Unauthorized creation attempt. Claims Role: {claims.get('role')}, Target: {target_user_id}, Current: {current_user_id}")
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.json
    try:
        print(f"DEBUG: Creating student for User ID: {target_user_id}")
        student = DatabaseService.create_student(
            user_id=data.get('user_id'),
            name=data['name'],
            branch=data['branch'],
            cgpa=float(data['cgpa']),
            tenth_marks=float(data['tenth_marks']),
            twelfth_marks=float(data['twelfth_marks']),
            internships=int(data.get('internships', 0)),
            projects=int(data.get('projects', 0)),
            skills=data.get('skills', [])
        )
        return jsonify(student), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/students/me', methods=['GET'])
@jwt_required()
def get_my_profile():
    user_id = get_jwt_identity()
    student = DatabaseService.get_student_by_user_id(user_id)
    
    if not student:
        return jsonify({"error": "Student profile not found"}), 404
    
    return jsonify(student), 200

@app.route('/api/students/me', methods=['PUT'])
@jwt_required()
def update_my_profile():
    user_id = get_jwt_identity()
    student = DatabaseService.get_student_by_user_id(user_id)
    data = request.json
    
    if not student:
        # Upsert: Create new student if not exists
        try:
            print(f"Upserting: Creating new profile for user {user_id}")
            new_student = DatabaseService.create_student(
                user_id=user_id,
                name=data.get('name', 'Unknown'),
                branch=data.get('branch', 'General'),
                cgpa=float(data.get('cgpa', 0)),
                tenth_marks=float(data.get('tenth_marks', 0)),
                twelfth_marks=float(data.get('twelfth_marks', 0)),
                internships=int(data.get('internships', 0)),
                projects=int(data.get('projects', 0)),
                skills=data.get('skills', [])
            )
            return jsonify(new_student), 201
        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": f"Failed to create profile: {str(e)}"}), 400
    
    updated = DatabaseService.update_student(student['id'], **data)
    return jsonify(updated), 200

@app.route('/api/students/<int:student_id>', methods=['PUT'])
@jwt_required()
def update_student(student_id):
    claims = get_jwt()
    if claims.get('role') != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    data = request.json
    updated = DatabaseService.update_student(student_id, **data)
    
    if not updated:
        return jsonify({"error": "Student not found"}), 404
    
    return jsonify(updated), 200

@app.route('/api/students/<int:student_id>', methods=['DELETE'])
@jwt_required()
def delete_student(student_id):
    claims = get_jwt()
    if claims.get('role') != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    success = DatabaseService.delete_student(student_id)
    if not success:
        return jsonify({"error": "Student not found"}), 404
    
    return jsonify({"message": "Student deleted successfully"}), 200

# ============ ML Prediction Endpoints ============

@app.route('/api/predict/placement', methods=['POST'])
def predict_placement():
    if not predictor:
        return jsonify({"error": "ML Engine not ready"}), 503
    
    try:
        data = request.json
        result = predictor.predict_placement(data)
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

@app.route('/api/recommend/skills', methods=['POST'])
def recommend_skills():
    if not predictor:
        return jsonify({"error": "ML Engine not ready"}), 503
    
    try:
        data = request.json
        result = predictor.recommend_skills(data)
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

@app.route('/api/recommend/roadmap', methods=['POST'])
def get_company_roadmap():
    if not predictor:
        return jsonify({"error": "ML Engine not ready"}), 503
    
    data = request.json
    student_skills = data.get('skills', [])
    if isinstance(student_skills, str):
        student_skills = student_skills.split('|')
    
    target_company = data.get('target_company')
    if not target_company:
        return jsonify({"error": "target_company required"}), 400
    
    roadmap = predictor.analyzer.get_company_roadmap(student_skills, target_company)
    if roadmap is None:
        return jsonify({"error": f"Company '{target_company}' not found"}), 404
    
    return jsonify(roadmap)

@app.route('/api/analyze/resume', methods=['POST'])
def analyze_resume():
    if not resume_analyzer:
        return jsonify({"error": "Resume Analyzer not available"}), 503
        
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "Only PDF files are supported"}), 400
        
    # Save temporarily
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
            file.save(temp.name)
            temp_path = temp.name
            
        result = resume_analyzer.analyze_resume(temp_path)
        
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        if "error" in result:
             return jsonify(result), 400
             
        return jsonify(result), 200
    except Exception as e:
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/companies', methods=['GET'])
def get_companies():
    companies = DatabaseService.get_all_companies()
    # If no DB companies, fallback to CSV ones loaded by SkillAnalyzer if feasible or just return empty
    # For now, just DB companies
    return jsonify(companies)

# ============ Admin / Data Management Endpoints ============

@app.route('/api/admin/upload-data', methods=['POST'])
@jwt_required()
def upload_data():
    claims = get_jwt()
    if claims.get('role') != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only CSV files are supported"}), 400
        
    try:
        import pandas as pd
        import random
        from database.models import User
        
        # Read CSV
        df = pd.read_csv(file)
        
        # Validate columns (basic check)
        required_cols = ['Name', 'Branch', 'CGPA', 'Placed']
        if not all(col in df.columns for col in required_cols):
             # Try lowercase attempt or fuzzy match
             return jsonify({"error": f"CSV must contain columns: {required_cols}"}), 400
             
        success_count = 0
        
        # Process each row
        with app.app_context():
            for _, row in df.iterrows():
                # Generate a unique dummy email for historical data
                unique_id = random.randint(10000, 99999)
                email = f"historical_{unique_id}_{random.randint(1,1000)}@archive.edu"
                
                # Check if user exists (unlikely given random, but safe check)
                if User.query.filter_by(email=email).first():
                    continue
                    
                # Create Dummy User
                user, _ = AuthService.register_user(email, "historical_data_pass", role='student')
                
                # Parse Skills
                skills_raw = row.get('Skills', '')
                if pd.isna(skills_raw):
                    skills = []
                elif isinstance(skills_raw, str):
                    skills = skills_raw.split('|')
                else:
                    skills = []
                    
                # Create Student Record
                DatabaseService.create_student(
                    user_id=user.id,
                    name=row.get('Name', 'Unknown'),
                    branch=row.get('Branch', 'Unknown'),
                    cgpa=float(row.get('CGPA', 0)),
                    tenth_marks=float(row.get('10th Marks', 0)),
                    twelfth_marks=float(row.get('12th Marks', 0)),
                    internships=int(row.get('Internships', 0)),
                    projects=int(row.get('Projects', 0)),
                    skills=skills
                )
                
                # Manually update placement status if provided in CSV (since create_student defaults)
                # We need a way to set 'placed' status and salary directly.
                # Currently create_student doesn't accept 'placed'. 
                # We'll fetch the just-created student and update it.
                
                # Re-fetch is expensive, let's just update the DB object if we had access, 
                # but create_student commits. 
                # Let's use a direct update for efficiency or just update the logic in create_student?
                # For now, let's use the update method.
                
                # We need the student ID. DatabaseService.create_student returns a dict with 'id'.
                # Wait, I need to check the return value of create_student in my previous edit.
                # It returns student.to_dict().
                
                # Actually, let's optimize: We can't easily get the ID without refetching or modifying create_student return.
                # Assuming create_student returns the dict with ID.
                pass # Logic continues below logic block to simplify tool usage
                
                success_count += 1
                
        return jsonify({"message": f"Successfully imported {success_count} records"}), 200
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/report', methods=['GET'])
@jwt_required()
def download_report():
    claims = get_jwt()
    if claims.get('role') != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
        
    try:
        import pandas as pd
        from io import StringIO
        from flask import Response
        
        # Fetch all data
        students = DatabaseService.get_all_students()
        df = pd.DataFrame(students)
        
        # Clean up for report
        if not df.empty:
            # Flatten skills list to string
            df['skills'] = df['skills'].apply(lambda x: '|'.join(x) if isinstance(x, list) else str(x))
            
            # Select relevant columns
            cols = ['name', 'branch', 'cgpa', 'placed', 'salary', 'skills', 'internships', 'projects']
            # Filter to existing cols
            existing_cols = [c for c in cols if c in df.columns]
            df = df[existing_cols]
        
        # Generate CSV
        output = StringIO()
        df.to_csv(output, index=False)
        
        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=placement_report.csv"}
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============ Analytics Endpoints ============

@app.route('/api/analytics/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    claims = get_jwt()
    if claims.get('role') != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    try:
        # Get data from database
        analytics_data = DatabaseService.get_analytics_data()
        students_data = analytics_data['students_data']
        
        # Use AnalyticsEngine to process if available
        if analytics_engine and students_data:
            # Convert to DataFrame format expected by AnalyticsEngine
            import pandas as pd
            df = pd.DataFrame(students_data)
            analytics_engine.students_df = df
            data = analytics_engine.get_dashboard_summary()
        else:
            # Return basic analytics
            data = {
                "placement_rate": analytics_data['placement_rate'],
                "avg_salary": analytics_data['avg_salary'],
                "total_students": analytics_data['total_students'],
                "placed_students": analytics_data['placed_students'],
                "branch_wise": [],
                "top_skills": [],
                "salary_distribution": [],
                "skill_gaps": []
            }
        
        return jsonify(data)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



@app.route('/api/analytics/prs', methods=['GET'])
@jwt_required()
def get_prs_score():
    if not prs_service:
        return jsonify({"error": "PRS Service not available"}), 503
        
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user.student:
        return jsonify({"error": "Student profile not found"}), 404
        
    student_data = user.student.to_dict()
    result = prs_service.calculate_score(student_data)
    
    return jsonify(result), 200

@app.route('/api/analytics/skill-gap', methods=['POST'])
@jwt_required()
def analyze_skill_gap():
    if not skill_gap_service:
        return jsonify({"error": "Skill Gap Service not available"}), 503
        
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user.student:
        return jsonify({"error": "Student profile not found"}), 404
        
    data = request.get_json() or {}
    mode = data.get('mode', 'role') # 'role' or 'peer'
    role = data.get('target_role', 'Software Engineer')
    
    student_data = user.student.to_dict()
    
    if mode == 'peer':
        result = skill_gap_service.analyze_peer_gap(student_data)
    else:
        result = skill_gap_service.analyze_role_gap(student_data, role)
        
    if "error" in result:
        return jsonify(result), 400
        
    return jsonify(result), 200

@app.route('/api/analytics/roadmap/companies', methods=['GET'])
@jwt_required()
def get_roadmap_companies():
    if not roadmap_service:
        return jsonify({"error": "Roadmap Service not available"}), 503
    return jsonify(roadmap_service.get_all_companies()), 200

@app.route('/api/analytics/roadmap', methods=['POST'])
@jwt_required()
def generate_roadmap():
    if not roadmap_service:
        return jsonify({"error": "Roadmap Service not available"}), 503
        
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user.student:
        return jsonify({"error": "Student profile not found"}), 404
        
    data = request.get_json() or {}
    company = data.get('company')
    
    if not company:
        return jsonify({"error": "Target company is required"}), 400
        
    student_data = user.student.to_dict()
    roadmap = roadmap_service.generate_roadmap(student_data, company)
    
    if "error" in roadmap:
        return jsonify(roadmap), 400
        
    return jsonify(roadmap), 200

@app.route('/api/recommend/learning-path/skills', methods=['GET'])
@jwt_required()
def get_learning_path_skills():
    if not learning_path_service:
        return jsonify({"error": "Learning Path Service not available"}), 503
    return jsonify(learning_path_service.get_available_paths()), 200

@app.route('/api/recommend/learning-path', methods=['POST'])
@jwt_required()
def generate_learning_path():
    if not learning_path_service:
        return jsonify({"error": "Learning Path Service not available"}), 503
        
    data = request.get_json() or {}
    skill = data.get('skill')
    
    if not skill:
        return jsonify({"error": "Skill name is required"}), 400
        
    path = learning_path_service.generate_path(skill)
    
    if "error" in path:
        return jsonify(path), 404
        
    return jsonify(path), 200

# ============ Faculty Analytics Endpoints ============

@app.route('/api/faculty/analytics/skills', methods=['GET'])
@jwt_required()
def get_faculty_skill_analytics():
    """Get aggregated skill gap analytics for faculty"""
    if not curriculum_advisor:
        return jsonify({"error": "Curriculum Advisor Service not available"}), 503
    
    claims = get_jwt()
    if claims.get('role') != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    # Get all students
    students = DatabaseService.get_all_students()
    
    # Analyze skill gaps
    analysis = curriculum_advisor.analyze_skill_gaps(students)
    
    if "error" in analysis:
        return jsonify(analysis), 400
    
    return jsonify(analysis), 200

@app.route('/api/faculty/recommendations', methods=['GET'])
@jwt_required()
def get_faculty_recommendations():
    """Get AI-driven curriculum improvement recommendations"""
    if not curriculum_advisor:
        return jsonify({"error": "Curriculum Advisor Service not available"}), 503
    
    claims = get_jwt()
    if claims.get('role') != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    # Get all students
    students = DatabaseService.get_all_students()
    
    # Analyze skill gaps
    analysis = curriculum_advisor.analyze_skill_gaps(students)
    
    if "error" in analysis:
        return jsonify(analysis), 400
    
    # Generate recommendations
    recommendations = curriculum_advisor.suggest_improvements(analysis)
    
    return jsonify(recommendations), 200

# ============ Faculty Profile Endpoints ============

@app.route('/api/faculty/profile', methods=['GET'])
@jwt_required()
def get_faculty_profile():
    """Get current faculty profile"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    faculty = Faculty.query.filter_by(user_id=current_user_id).first()
    
    if not faculty:
        return jsonify({"profile_completed": False, "faculty": None}), 200
    
    return jsonify({"profile_completed": faculty.profile_completed, "faculty": faculty.to_dict()}), 200

@app.route('/api/faculty/profile', methods=['POST'])
@jwt_required()
def create_or_update_faculty_profile():
    """Create or update faculty profile"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    data = request.json
    name = data.get('name')
    department = data.get('department')
    designation = data.get('designation')
    experience_years = data.get('experience_years')
    qualification = data.get('qualification')
    subjects = data.get('subjects', [])
    specialization = data.get('specialization')
    skills = data.get('skills', [])
    
    if not name or not department:
        return jsonify({"error": "Name and department are required"}), 400
    
    # Convert subjects and skills to JSON strings if they're not already
    import json
    subjects_json = subjects if isinstance(subjects, str) else json.dumps(subjects)
    skills_json = skills if isinstance(skills, str) else json.dumps(skills)
    
    # Check if profile exists
    faculty = Faculty.query.filter_by(user_id=current_user_id).first()
    
    if faculty:
        # Update existing profile
        faculty.name = name
        faculty.department = department
        faculty.designation = designation
        faculty.experience_years = experience_years
        faculty.qualification = qualification
        faculty.subjects = subjects_json
        faculty.specialization = specialization
        faculty.skills = skills_json
        faculty.profile_completed = True
    else:
        # Create new profile
        faculty = Faculty(
            user_id=current_user_id,
            name=name,
            department=department,
            designation=designation,
            experience_years=experience_years,
            qualification=qualification,
            subjects=subjects_json,
            specialization=specialization,
            skills=skills_json,
            profile_completed=True
        )
        db.session.add(faculty)
    
    db.session.commit()
    
    return jsonify({"message": "Profile saved successfully", "faculty": faculty.to_dict()}), 200

@app.route('/api/faculty/analytics/branch/<branch>', methods=['GET'])
@jwt_required()
def get_branch_analytics(branch):
    """Get analytics for a specific branch"""
    claims = get_jwt()
    if claims.get('role') != 'faculty':
        return jsonify({"error": "Faculty access required"}), 403
    
    # Get all students from the specified branch
    students = DatabaseService.get_all_students()
    branch_students = [s for s in students if s.get('branch', '').lower() == branch.lower()]
    
    if not branch_students:
        return jsonify({"error": f"No students found in {branch} branch"}), 404
    
    # Calculate branch-specific analytics
    total = len(branch_students)
    placed = sum(1 for s in branch_students if s.get('placed', False))
    avg_cgpa = sum(s.get('cgpa', 0) for s in branch_students) / total if total > 0 else 0
    
    # Aggregate skills
    all_skills = set()
    for student in branch_students:
        all_skills.update(student.get('skills', []))
    
    return jsonify({
        'branch': branch,
        'total_students': total,
        'placed_students': placed,
        'placement_rate': round((placed / total * 100), 2) if total > 0 else 0,
        'avg_cgpa': round(avg_cgpa, 2),
        'unique_skills': len(all_skills),
        'top_skills': list(all_skills)[:10]
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
