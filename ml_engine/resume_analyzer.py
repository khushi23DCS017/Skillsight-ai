import os
import re
from pypdf import PdfReader

try:
    from .config import DATA_DIR
except ImportError:
    from config import DATA_DIR

class ResumeAnalyzer:
    def __init__(self):
        self.target_skills = self._load_target_skills()
    
    def _load_target_skills(self):
        """Load common industry skills for matching"""
        return [
            'Python', 'Java', 'JavaScript', 'C++', 'C#', 'SQL', 'React', 'Node.js',
            'Angular', 'Vue.js', 'Django', 'Flask', 'Spring', 'AWS', 'Azure', 'GCP',
            'Docker', 'Kubernetes', 'Git', 'Machine Learning', 'Deep Learning',
            'Data Structures', 'Algorithms', 'System Design', 'REST API', 'GraphQL',
            'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Kafka', 'Microservices',
            'CI/CD', 'Agile', 'Scrum', 'TDD', 'DevOps', 'Linux', 'Networking',
            'Cloud Computing', 'Big Data', 'Spark', 'Hadoop', 'TensorFlow', 'PyTorch',
            'NLP', 'Computer Vision', 'Blockchain', 'Cybersecurity', 'Ethical Hacking'
        ]
    
    def extract_text_from_pdf(self, pdf_path):
        """Extract text from PDF resume"""
        try:
            reader = PdfReader(pdf_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            raise Exception(f"Failed to parse PDF: {str(e)}")
    
    def extract_skills_from_text(self, text):
        """Extract skills mentioned in resume text"""
        text_upper = text.upper()
        found_skills = []
        
        for skill in self.target_skills:
            # Case-insensitive search with word boundaries
            pattern = r'\b' + re.escape(skill.upper()) + r'\b'
            if re.search(pattern, text_upper):
                found_skills.append(skill)
        
        return found_skills
    
    def calculate_resume_score(self, resume_skills, target_skills=None):
        """
        Calculate resume match score
        Returns score (0-100) and missing skills
        """
        if target_skills is None:
            target_skills = self.target_skills[:20]  # Top 20 common skills
        
        if not target_skills:
            return 0, []
        
        matched = len(set(resume_skills) & set(target_skills))
        score = (matched / len(target_skills)) * 100
        missing = list(set(target_skills) - set(resume_skills))
        
        return round(score, 2), missing
    
    def analyze_resume(self, pdf_path, target_company=None):
        """
        Complete resume analysis pipeline
        Returns: {score, found_skills, missing_skills, suggestions}
        """
        text = self.extract_text_from_pdf(pdf_path)
        found_skills = self.extract_skills_from_text(text)
        
        # Use top skills as default target
        target_skills = self.target_skills[:15]
        
        score, missing = self.calculate_resume_score(found_skills, target_skills)
        
        suggestions = []
        if score < 40:
            suggestions.append("Add more technical skills to your resume")
        if score < 60:
            suggestions.append("Consider adding projects showcasing your skills")
        if len(found_skills) < 5:
            suggestions.append("Highlight at least 5-7 core technical skills")
        
        return {
            "resume_score": score,
            "found_skills": found_skills,
            "missing_skills": missing[:10],  # Top 10 missing
            "suggestions": suggestions
        }

if __name__ == "__main__":
    analyzer = ResumeAnalyzer()
    print("Resume Analyzer initialized with", len(analyzer.target_skills), "skills")
