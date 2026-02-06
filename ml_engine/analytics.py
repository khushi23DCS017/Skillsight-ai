import pandas as pd
import numpy as np
import os

try:
    from .config import DATA_DIR
except ImportError:
    from config import DATA_DIR

class AnalyticsEngine:
    def __init__(self):
        self.students_df = self._load_students()
    
    def _load_students(self):
        """Load students dataset"""
        path = os.path.join(DATA_DIR, "students.csv")
        if os.path.exists(path):
            return pd.read_csv(path)
        return pd.DataFrame()
    
    def get_placement_rate(self):
        """Calculate overall placement rate"""
        if self.students_df.empty:
            return 0
        placed = self.students_df['placed'].sum()
        total = len(self.students_df)
        return round((placed / total) * 100, 2)
    
    def get_average_salary(self):
        """Calculate average salary of placed students"""
        if self.students_df.empty:
            return 0
        placed_students = self.students_df[self.students_df['placed'] == True]
        if placed_students.empty:
            return 0
        return int(placed_students['salary'].mean())
    
    def get_branch_wise_placement(self):
        """Get placement rate by branch"""
        if self.students_df.empty:
            return []
        
        branch_stats = self.students_df.groupby('branch').agg({
            'placed': ['sum', 'count']
        }).reset_index()
        
        branch_stats.columns = ['branch', 'placed', 'total']
        branch_stats['rate'] = (branch_stats['placed'] / branch_stats['total'] * 100).round(2)
        
        return branch_stats[['branch', 'rate', 'placed', 'total']].to_dict('records')
    
    def get_top_skills(self, top_n=10):
        """Get most common skills across all students"""
        if self.students_df.empty:
            return []
        
        all_skills = []
        for skills_list in self.students_df['skills']:
            if isinstance(skills_list, list):
                all_skills.extend([s.strip() for s in skills_list])
            elif isinstance(skills_list, str):
                 # Fallback if somehow string
                 all_skills.extend([s.strip() for s in skills_list.split('|')])
        
        if not all_skills:
            return []
        
        skill_counts = pd.Series(all_skills).value_counts().head(top_n)
        return [{"skill": skill, "count": int(count)} for skill, count in skill_counts.items()]
    
    def get_salary_distribution(self):
        """Get salary ranges and counts"""
        if self.students_df.empty:
            return []
        
        placed_students = self.students_df[self.students_df['placed'] == True]
        if placed_students.empty:
            return []
        
        # Create salary bins
        bins = [0, 400000, 800000, 1200000, 2000000, 5000000]
        labels = ['<4L', '4-8L', '8-12L', '12-20L', '>20L']
        
        placed_students['salary_range'] = pd.cut(placed_students['salary'], bins=bins, labels=labels)
        distribution = placed_students['salary_range'].value_counts().sort_index()
        
        return [{"range": str(range_), "count": int(count)} for range_, count in distribution.items()]
    
    def get_skill_gap_heatmap(self):
        """Identify skill gaps by branch"""
        if self.students_df.empty:
            return []
        
        # Common industry skills
        target_skills = ['Python', 'Java', 'SQL', 'Machine Learning', 'AWS', 'React']
        
        branch_skill_data = []
        for branch in self.students_df['branch'].unique():
            branch_students = self.students_df[self.students_df['branch'] == branch]
            
            for skill in target_skills:
                # Count students with this skill
                has_skill = 0
                for skills_list in branch_students['skills']:
                     # Check if skill exists in user's skill list
                     if isinstance(skills_list, list):
                         if any(skill.lower() == s.lower() for s in skills_list):
                             has_skill += 1
                     elif isinstance(skills_list, str) and skill.lower() in skills_list.lower():
                         has_skill += 1
                
                coverage = (has_skill / len(branch_students) * 100) if len(branch_students) > 0 else 0
                branch_skill_data.append({
                    "branch": branch,
                    "skill": skill,
                    "coverage": round(coverage, 2)
                })
        
        return branch_skill_data
    
    def get_dashboard_summary(self):
        """Get complete dashboard data"""
        return {
            "placement_rate": self.get_placement_rate(),
            "avg_salary": self.get_average_salary(),
            "total_students": len(self.students_df),
            "placed_students": int(self.students_df['placed'].sum()) if not self.students_df.empty else 0,
            "branch_wise": self.get_branch_wise_placement(),
            "top_skills": self.get_top_skills(),
            "salary_distribution": self.get_salary_distribution(),
            "skill_gaps": self.get_skill_gap_heatmap()
        }

if __name__ == "__main__":
    engine = AnalyticsEngine()
    print("Analytics Engine initialized")
    print("Placement Rate:", engine.get_placement_rate())
    print("Avg Salary:", engine.get_average_salary())
