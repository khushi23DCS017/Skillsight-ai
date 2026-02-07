
import os
import json
import pandas as pd
from collections import Counter

class SkillGapService:
    def __init__(self):
        self.role_skills = {
            'Software Engineer': ['python', 'java', 'c++', 'dsa', 'oops', 'sql', 'git', 'problem solving'],
            'Frontend Developer': ['react', 'javascript', 'html', 'css', 'redux', 'typescript', 'figma', 'responsive design'],
            'Backend Developer': ['node', 'express', 'python', 'django', 'flask', 'sql', 'mongodb', 'rest api', 'aws'],
            'Data Scientist': ['python', 'machine learning', 'sql', 'pandas', 'numpy', 'statistics', 'deep learning', 'visualization'],
            'Full Stack Developer': ['react', 'node', 'javascript', 'sql', 'mongodb', 'aws', 'git', 'html', 'css'],
            'App Developer': ['flutter', 'react native', 'android', 'ios', 'dart', 'javascript', 'firebase']
        }
        self.peer_benchmarks = self._calculate_peer_benchmarks()

    def _calculate_peer_benchmarks(self):
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            data_path = os.path.join(base_dir, 'data', 'placement_data.csv')
            
            if not os.path.exists(data_path):
                print(f"SkillGap Data not found at {data_path}")
                return None

            df = pd.read_csv(data_path)
            placed_df = df[df['placed'] == 1]
            
            if placed_df.empty:
                return None

            # Calculate Averages
            avg_cgpa = round(placed_df['cgpa'].mean(), 2)
            avg_projects = round(placed_df['projects'].mean(), 1)
            avg_internships = round(placed_df['internships'].mean(), 1)
            
            # Common Skills (Simulated as we don't have raw skills in CSV, using synthetic logic or if CSV had skills)
            # Since CSV doesn't have raw skills column, we will use a static reliable set for "placed students" 
            # or infer from PRS logic.
            # For this MVP, let's assume a set of high-value skills based on the 'skill_score' implies presence of:
            common_skills = ['python', 'sql', 'communication', 'problem solving', 'java']
            
            return {
                "avg_cgpa": avg_cgpa,
                "avg_projects": avg_projects,
                "avg_internships": avg_internships,
                "common_skills": common_skills
            }
        except Exception as e:
            print(f"Error calculating peer benchmarks: {e}")
            return None

    def _normalize_skills(self, student):
        """Extracts and normalizes skills from student object."""
        student_skills = [s.lower().strip() for s in student.get('skills', [])]
        
        profile_data = student.get('profile_data')
        if profile_data:
            try:
                if isinstance(profile_data, str):
                    p_data = json.loads(profile_data)
                else:
                    p_data = profile_data
                
                for cat in ['languages', 'webAppSkills', 'aiMlSkills']:
                    if cat in p_data:
                        student_skills.extend([s.lower().strip() for s in p_data[cat]])
            except:
                pass
        
        return set(student_skills)

    def analyze_role_gap(self, student, role):
        target_skills = self.role_skills.get(role, [])
        if not target_skills:
            return {"error": "Role not found"}

        user_skills = self._normalize_skills(student)
        
        present = []
        missing = []
        
        for skill in target_skills:
            # Simple substring match for flexibility (e.g. "react js" matches "react")
            if any(skill in us for us in user_skills) or any(us in skill for us in user_skills):
                present.append(skill)
            else:
                missing.append(skill)
        
        match_percentage = round((len(present) / len(target_skills)) * 100) if target_skills else 0
        
        return {
            "role": role,
            "match_percentage": match_percentage,
            "present_skills": present,
            "missing_skills": missing
        }

    def analyze_peer_gap(self, student):
        if not self.peer_benchmarks:
            return {"error": "Peer data unavailable"}

        user_cgpa = float(student.get('cgpa', 0))
        user_projects = int(student.get('projects', 0))
        user_internships = int(student.get('internships', 0))
        user_skills = self._normalize_skills(student)

        # Gap logic
        cgpa_gap = round(user_cgpa - self.peer_benchmarks['avg_cgpa'], 2)
        project_gap = user_projects - self.peer_benchmarks['avg_projects']
        
        missing_common_skills = [
            skill for skill in self.peer_benchmarks['common_skills']
            if not any(skill in us for us in user_skills)
        ]

        return {
            "metrics": {
                "cgpa": {"you": user_cgpa, "peer_avg": self.peer_benchmarks['avg_cgpa'], "gap": cgpa_gap},
                "projects": {"you": user_projects, "peer_avg": self.peer_benchmarks['avg_projects'], "gap": round(project_gap, 1)},
                "internships": {"you": user_internships, "peer_avg": self.peer_benchmarks['avg_internships']}
            },
            "missing_common_skills": missing_common_skills
        }
