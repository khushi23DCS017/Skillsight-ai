
import re
import os
try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

class ResumeAnalyzer:
    def __init__(self):
        # High value skills to look for
        self.keywords = {
            "Languages": ["python", "java", "c++", "javascript", "typescript", "sql", "html", "css", "go", "rust"],
            "Frameworks": ["react", "node", "flask", "django", "spring", "express", "next.js", "angular", "vue"],
            "Tools": ["git", "docker", "kubernetes", "aws", "azure", "jenkins", "jira", "linux"],
            "Concepts": ["ds", "algorithms", "oop", "dbms", "os", "system design", "agile", "scrum"]
        }
        
        self.essential_sections = [
            "education", "skills", "projects", "experience", "internship", "achievements"
        ]

    def extract_text_from_pdf(self, file_path):
        if not PdfReader:
            return "Error: pypdf not installed."
        
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            return f"Error reading PDF: {str(e)}"

    def analyze_resume(self, file_path):
        text = self.extract_text_from_pdf(file_path)
        if text.startswith("Error"):
            return {"error": text}
        
        text_lower = text.lower()
        
        found_skills = []
        missing_skills = []
        suggestions = []
        section_score = 0
        skill_score = 0
        
        # 1. Section Check
        found_sections = []
        for section in self.essential_sections:
            if section in text_lower:
                found_sections.append(section)
                section_score += 15 # Weight for sections
        
        # Cap section score at 60
        section_score = min(section_score, 60)
        
        if len(found_sections) < 3:
            suggestions.append(f"Add more sections! Found: {', '.join(found_sections)}. Missing: {', '.join([s for s in self.essential_sections if s not in found_sections])}")

        # 2. Skill Check
        all_keywords = []
        for category, skills in self.keywords.items():
            for skill in skills:
                all_keywords.append(skill)
                # Simple word matching with regex word boundary
                if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                    if skill not in found_skills:
                        found_skills.append(skill)
                        skill_score += 5
                
        # Cap skill score at 40
        skill_score = min(skill_score, 40)
        
        # Identify missing high-value skills (random sample logic for now, or commonly missed)
        # Just pick a few from the list that aren't found
        import random
        not_found = [k for k in all_keywords if k not in found_skills]
        if not_found:
            missing_skills = not_found[:5] # Suggest top 5 missing
            
        if not found_skills:
            suggestions.append("No technical skills detected. Ensure they are listed clearly.")
        elif len(found_skills) < 5:
            suggestions.append("Try to include more technical skills/tools.")
            
        # 3. Formatting/Length Check
        word_count = len(text.split())
        if word_count < 200:
            suggestions.append("Resume seems too short. Elaborate on your projects and experience.")
            section_score -= 10
        elif word_count > 1000:
            suggestions.append("Resume might be too long (approx 2 pages). Keep it concise.")
            
        total_score = max(0, min(100, section_score + skill_score))
        
        return {
            "resume_score": total_score,
            "found_skills": list(set(found_skills)), # Unique
            "missing_skills": missing_skills,
            "suggestions": suggestions,
            "parsed_text_preview": text[:200] + "..."
        }
