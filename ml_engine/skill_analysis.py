import pandas as pd
import numpy as np
import os

try:
    from .config import DATA_DIR, PRS_WEIGHTS, SKILL_MAP
except ImportError:
    from config import DATA_DIR, PRS_WEIGHTS, SKILL_MAP

class SkillAnalyzer:
    def __init__(self):
        self.companies_df = self._load_companies()
    
    def _load_companies(self):
        path = os.path.join(DATA_DIR, "companies.csv")
        if os.path.exists(path):
            return pd.read_csv(path)
        return pd.DataFrame() # Return empty if not found
    
    def calculate_prs(self, student_data):
        """
        Calculate Placement Readiness Score (0-100)
        student_data: dict with keys 'CGPA', 'Skill_Count', 'Projects', 'Internships'
        """
        # Normalize inputs roughly to 0-100 scale
        cgpa_score = (student_data.get('CGPA', 0) / 10.0) * 100
        
        # Skill count: assume 10 skills is max score
        skill_count = student_data.get('Skill_Count', 0)
        skill_score = min((skill_count / 8.0) * 100, 100)
        
        # Projects: assume 5 is max
        proj_count = student_data.get('Projects', 0)
        proj_score = min((proj_count / 4.0) * 100, 100)
        
        # Internships: assume 3 is max
        intern_count = student_data.get('Internships', 0)
        intern_score = min((intern_count / 2.0) * 100, 100)
        
        prs = (
            cgpa_score * PRS_WEIGHTS['academics'] + 
            skill_score * PRS_WEIGHTS['skills'] +
            proj_score * PRS_WEIGHTS['projects'] +
            intern_score * PRS_WEIGHTS['internships']
        )
        
        return round(prs, 2)

    def get_skill_gaps(self, student_skills_list, target_company_name):
        """
        Identify missing skills for a target company.
        """
        if self.companies_df.empty:
            return []
            
        company = self.companies_df[self.companies_df['name'] == target_company_name]
        if company.empty:
            return []
        
        # Parse company skills (stored as string representation of list or string)
        # In generate_data, it was a list object, but CSV stores as string "['A', 'B']"
        # Let's handle simple string parsing
        req_skills_str = company.iloc[0]['skills']
        # localized eval or simple cleanup
        req_skills = req_skills_str.replace("['", "").replace("']", "").replace("'", "").split(", ")
        
        # Standardize
        student_skills_std = [s.strip() for s in student_skills_list]
        req_skills_std = [s.strip() for s in req_skills]
        
        missing = [skill for skill in req_skills_std if skill not in student_skills_std]
        return missing
    
    def get_prs_category(self, prs_score):
        """Categorize PRS score into risk levels"""
        if prs_score >= 70:
            return {"category": "Excellent", "color": "green", "message": "Strong placement readiness"}
        elif prs_score >= 50:
            return {"category": "Good", "color": "yellow", "message": "Moderate readiness, focus on skill building"}
        elif prs_score >= 30:
            return {"category": "At Risk", "color": "orange", "message": "Needs significant improvement"}
        else:
            return {"category": "Critical", "color": "red", "message": "Urgent intervention required"}
    
    def get_company_roadmap(self, student_skills_list, target_company_name):
        """
        Generate company-specific skill roadmap with priorities
        Returns: {company, required_skills, student_has, missing_priority}
        """
        if self.companies_df.empty:
            return None
        
        company = self.companies_df[self.companies_df['name'] == target_company_name]
        if company.empty:
            return None
        
        # Parse company skills
        req_skills_str = company.iloc[0]['skills']
        req_skills = req_skills_str.replace("['", "").replace("']", "").replace("'", "").split(", ")
        
        student_skills_std = [s.strip() for s in student_skills_list]
        req_skills_std = [s.strip() for s in req_skills]
        
        # Categorize skills
        has_skills = [s for s in req_skills_std if s in student_skills_std]
        missing_skills = [s for s in req_skills_std if s not in student_skills_std]
        
        # Priority levels (first 2 are critical, next 2 are important, rest are good-to-have)
        roadmap = []
        for idx, skill in enumerate(missing_skills):
            if idx < 2:
                priority = "Critical"
                weeks = 4
            elif idx < 4:
                priority = "Important"
                weeks = 3
            else:
                priority = "Good to Have"
                weeks = 2
            
            roadmap.append({
                "skill": skill,
                "priority": priority,
                "estimated_weeks": weeks
            })
        
        return {
            "company": target_company_name,
            "min_cgpa": float(company.iloc[0]['min_cgpa']),
            "has_skills": has_skills,
            "roadmap": roadmap,
            "completion_percentage": round((len(has_skills) / len(req_skills_std) * 100), 2) if req_skills_std else 0
        }

if __name__ == "__main__":
    analyzer = SkillAnalyzer()
    dummy_student = {'CGPA': 8.5, 'Skill_Count': 4, 'Projects': 2, 'Internships': 1}
    print("PRS:", analyzer.calculate_prs(dummy_student))
    print("Category:", analyzer.get_prs_category(65))
    print("Roadmap:", analyzer.get_company_roadmap(['Python', 'Data Structures'], 'Google'))
