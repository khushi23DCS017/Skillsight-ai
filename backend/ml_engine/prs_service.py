
import os
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

class PRSService:
    def __init__(self):
        self.model = None
        self.ideal_skills = {
            'CSE': ['python', 'java', 'c++', 'dsa', 'oops', 'dbms', 'os', 'cn', 'react', 'node', 'sql'],
            'IT': ['python', 'java', 'web development', 'dbms', 'networking', 'cloud', 'javascript'],
            'ECE': ['c', 'c++', 'embedded systems', 'verilog', 'iot', 'python', 'matlab'],
            'MECH': ['autocad', 'solidworks', 'ansys', 'catia', 'thermodynamics', 'matlab'],
            'CIVIL': ['autocad', 'staad pro', 'revit', 'gis', 'construction management'],
            'GENERAL': ['communication', 'aptitude', 'problem solving']
        }
        self.train_model()
        
    def train_model(self):
        try:
            # Load dataset
            # Assuming data is in backend/data/placement_data.csv
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, 'data', 'placement_data.csv')
            
            if not os.path.exists(data_path):
                print(f"PRS Data not found at {data_path}")
                return

            df = pd.read_csv(data_path)
            
            # Features: cgpa, tenth_marks, twelfth_marks, internships, projects, skill_score, backlogs
            X = df.drop('placed', axis=1)
            y = df['placed']
            
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            self.model.fit(X, y)
            print("PRS ML Model Trained Successfully")
            
        except Exception as e:
            print(f"Error training PRS model: {e}")
            self.model = None

    def calculate_skill_score(self, student):
        student_skills = [s.lower() for s in student.get('skills', [])]
        
        # Extract skills from profile_data
        profile_data = student.get('profile_data')
        if profile_data:
            try:
                if isinstance(profile_data, str):
                    p_data = json.loads(profile_data)
                else:
                    p_data = profile_data
                
                if 'languages' in p_data:
                    student_skills.extend([s.lower().strip() for s in p_data['languages']])
                if 'webAppSkills' in p_data:
                    student_skills.extend([s.lower().strip() for s in p_data['webAppSkills']])
                if 'aiMlSkills' in p_data:
                    student_skills.extend([s.lower().strip() for s in p_data['aiMlSkills']])
            except:
                pass
        
        student_skills = list(set(student_skills))
        branch = student.get('branch', 'GENERAL')
        target_skills = self.ideal_skills.get(branch, self.ideal_skills['GENERAL'])
        
        if not target_skills:
            return 0
            
        matches = sum(1 for s in student_skills if any(ts in s for ts in target_skills) or s in target_skills)
        # Normalize to 0-100 scale for input to model
        # Assuming 10 skills is "max" in simulated data
        return min(matches * 10, 100)

    def calculate_score(self, student):
        try:
            # 1. Prepare Features for ML
            cgpa = float(student.get('cgpa', 0))
            tenth = float(student.get('tenth_marks', 0))
            twelfth = float(student.get('twelfth_marks', 0))
            internships = int(student.get('internships', 0))
            projects = int(student.get('projects', 0))
            
            # Helper to get backlogs
            backlogs = 0
            profile_data = student.get('profile_data')
            if profile_data:
                 try:
                    if isinstance(profile_data, str):
                        p_data = json.loads(profile_data)
                    else:
                        p_data = profile_data
                    if p_data.get('hasBacklogs') == 'Yes':
                         try:
                             backlogs = int(p_data.get('backlogCount', 0))
                         except:
                             backlogs = 1
                 except:
                     pass
            
            skill_score = self.calculate_skill_score(student)
            
            # Predict
            if self.model:
                features = np.array([[cgpa, tenth, twelfth, internships, projects, skill_score, backlogs]])
                # Probability of class 1 (Placed)
                placement_prob = self.model.predict_proba(features)[0][1]
                final_score = placement_prob * 100
            else:
                # Fallback purely rule based if model fails
                final_score = (cgpa * 4) + (skill_score * 0.3) + (projects * 5)
                final_score = min(100, final_score)
            
            # 2. Insights generation (Rule-based for interpretability)
            insights = []
            if cgpa < 7.5:
                insights.append(f"Improve your CGPA to at least 7.5 to boost your chances.")
            if skill_score < 50:
                 branch = student.get('branch', 'GENERAL')
                 target = self.ideal_skills.get(branch, [])[:3]
                 insights.append(f"Acquire more {branch} skills like {', '.join(target)}.")
            if projects < 2:
                insights.append("Work on more projects to demonstrate practical knowledge.")
            if internships == 0:
                insights.append("Try to secure an internship to gain industry experience.")
            
            return {
                "score": round(final_score, 1),
                "insights": insights,
                "breakdown": {
                    "academic": round(cgpa * 4, 1), # Approx for display
                    "skills": round(skill_score * 0.3, 1),
                    "experience": min(round((projects*5) + (internships*10), 1), 20),
                    "consistency": 10 if backlogs == 0 else 0
                }
            }
            
        except Exception as e:
            print(f"Error calculation PRS: {e}")
            return {"score": 0, "insights": ["Error calculating score."], "breakdown": {}}
