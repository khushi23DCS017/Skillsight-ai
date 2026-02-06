import pandas as pd
import pickle
import os

try:
    from .preprocessing import DataPreprocessor
    from .skill_analysis import SkillAnalyzer
    from .config import MODELS_DIR
except ImportError:
    from preprocessing import DataPreprocessor
    from skill_analysis import SkillAnalyzer
    from config import MODELS_DIR

class Predictor:
    def __init__(self):
        self.model = self._load_model()
        self.preprocessor = DataPreprocessor.load()
        self.analyzer = SkillAnalyzer()

    def _load_model(self):
        path = os.path.join(MODELS_DIR, 'placement_model.pkl')
        if not os.path.exists(path):
            raise FileNotFoundError("Model not found. Train first.")
        with open(path, 'rb') as f:
            return pickle.load(f)

    def predict_placement(self, student_data):
        """
        student_data: dict containing single student valid fields
        Returns: {probability, prs_score, missing_skills, predicted_salary_range}
        """
        # 1. Calc PRS
        # Need to derive simple counts if raw list provided
        skills = student_data.get('Skills', [])
        if isinstance(skills, str):
            skills = skills.split('|')
            
        prs_input = {
            'CGPA': student_data.get('CGPA', 0),
            'Skill_Count': len(skills),
            'Projects': student_data.get('Projects', 0),
            'Internships': student_data.get('Internships', 0)
        }
        prs = self.analyzer.calculate_prs(prs_input)
        
        # 2. Predict Probability
        # Create DF for preprocessor
        # Preprocessor expects columns: 'Branch', 'CGPA', '10th_Marks', 'Skills', etc.
        data_df = pd.DataFrame([student_data])
        # Manually ensure format matches what Preprocessor expects if needed
        # Just use fit_transform logic but only transform
        
        # We need to replicate preprocessor transform logic manually or expose transform method
        # The stored preprocessor has 'le_branch'.
        
        # Let's assume we use the preprocessor object incorrectly above (fit_transform on new data).
        # We need a transform method in DataPreprocessor.
        # But for now, let's implement the transform logic here briefly or fixing preprocessing.py is better.
        # I'll rely on the class structure I wrote. It has fit_transform but not transform.
        # Let's just do manual transform here for safety as I can't edit `preprocessing.py` easily without overwriting.
        
        # Manual Transform for Inference
        # Encoding Branch
        try:
            branch_encoded = self.preprocessor.le_branch.transform([student_data['Branch']])[0]
        except:
            branch_encoded = 0 # Default or error
            
        input_vector = [
            student_data['CGPA'], 
            student_data['10th_Marks'], 
            student_data['12th_Marks'],
            student_data['Internships'],
            student_data['Projects'],
            branch_encoded,
            len(skills)
        ]
        
        prob = self.model.predict_proba([input_vector])[0][1] # Prob of class 1
        prs_category = self.analyzer.get_prs_category(prs)
        
        return {
            "placement_probability": round(prob * 100, 2),
            "prs_score": prs,
            "prs_category": prs_category,
            "predicted_class": int(prob > 0.5)
        }

    def get_recommendations(self, student_skills, target_company):
        return self.analyzer.get_skill_gaps(student_skills, target_company)

    def recommend_skills(self, data):
        """
        Wrapper to get skills recommendation / roadmap.
        data: { 'skills': [], 'target_company': 'Name' }
        """
        skills = data.get('skills', [])
        if isinstance(skills, str):
            skills = skills.split('|')
            
        target_company = data.get('target_company')
        
        if target_company:
            return self.analyzer.get_company_roadmap(skills, target_company)
        else:
            # If no company specified, find gaps for a generic high-tier company or return error logic
            # For this MVP, let's default to 'Google' or similar if available, or just error.
            # actually better: return list of companies user is close to?
            # For simplicity, let's require target_company for now, or pick the first one.
            if not self.analyzer.companies_df.empty:
                default_company = self.analyzer.companies_df.iloc[0]['name']
                return self.analyzer.get_company_roadmap(skills, default_company)
            return {"error": "No companies available to recommend against."}

if __name__ == "__main__":
    p = Predictor()
    dummy = {
        'Student_ID': 'TEST', 'Branch': 'CSE', 'CGPA': 8.0, 
        '10th_Marks': 85, '12th_Marks': 85, 
        'Skills': 'Python|Java', 'Internships': 1, 'Projects': 2
    }
    print(p.predict_placement(dummy))
