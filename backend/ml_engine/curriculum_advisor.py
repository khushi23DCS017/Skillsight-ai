"""
Curriculum Advisor - AI-powered curriculum improvement suggestions
Analyzes student skill gaps and provides actionable recommendations for faculty
"""

class CurriculumAdvisor:
    def __init__(self):
        # Industry-standard skills by domain
        self.industry_skills = {
            'Web Development': ['React', 'Node.js', 'MongoDB', 'REST APIs', 'TypeScript'],
            'Data Science': ['Python', 'Machine Learning', 'SQL', 'Data Visualization', 'Statistics'],
            'Cloud & DevOps': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
            'Mobile Development': ['React Native', 'Flutter', 'Android', 'iOS', 'Firebase'],
            'System Design': ['Microservices', 'System Architecture', 'Database Design', 'Scalability', 'Load Balancing']
        }
        
    def analyze_skill_gaps(self, students_data):
        """
        Analyze skill gaps across all students
        Returns aggregated data on missing skills
        """
        if not students_data:
            return {"error": "No student data provided"}
            
        # Aggregate all student skills
        all_student_skills = set()
        skill_frequency = {}
        branch_skills = {}
        
        for student in students_data:
            branch = student.get('branch', 'General')
            skills = student.get('skills', [])
            
            # Track skills per branch
            if branch not in branch_skills:
                branch_skills[branch] = set()
            
            for skill in skills:
                all_student_skills.add(skill)
                branch_skills[branch].add(skill)
                skill_frequency[skill] = skill_frequency.get(skill, 0) + 1
        
        # Identify missing industry skills
        all_industry_skills = set()
        for domain_skills in self.industry_skills.values():
            all_industry_skills.update(domain_skills)
        
        missing_skills = all_industry_skills - all_student_skills
        
        # Calculate skill coverage by domain
        domain_coverage = {}
        for domain, required_skills in self.industry_skills.items():
            total = len(required_skills)
            present = len(set(required_skills) & all_student_skills)
            coverage = (present / total * 100) if total > 0 else 0
            domain_coverage[domain] = {
                'coverage': round(coverage, 1),
                'missing': list(set(required_skills) - all_student_skills),
                'present': list(set(required_skills) & all_student_skills)
            }
        
        # Top missing skills (industry skills not in student profiles)
        top_missing = sorted(
            [(skill, 0) for skill in missing_skills],
            key=lambda x: x[1],
            reverse=True
        )[:10]
        
        return {
            'total_students': len(students_data),
            'total_unique_skills': len(all_student_skills),
            'skill_frequency': skill_frequency,
            'domain_coverage': domain_coverage,
            'top_missing_skills': [skill for skill, _ in top_missing],
            'branch_analysis': {
                branch: list(skills) for branch, skills in branch_skills.items()
            }
        }
    
    def suggest_improvements(self, skill_gap_data):
        """
        Generate actionable curriculum improvement suggestions
        """
        if 'error' in skill_gap_data:
            return {"error": skill_gap_data['error']}
        
        suggestions = []
        domain_coverage = skill_gap_data.get('domain_coverage', {})
        
        # Analyze each domain
        for domain, data in domain_coverage.items():
            coverage = data['coverage']
            missing = data['missing']
            
            if coverage < 50 and missing:
                # Critical gap
                suggestions.append({
                    'priority': 'HIGH',
                    'domain': domain,
                    'issue': f"Only {coverage}% coverage in {domain}",
                    'recommendation': f"Introduce mandatory {domain} module covering: {', '.join(missing[:3])}",
                    'action_items': [
                        f"Add practical labs for {missing[0]}" if missing else "Review curriculum",
                        f"Organize workshop on {missing[1]}" if len(missing) > 1 else "Industry expert sessions",
                        "Update course materials with latest industry standards"
                    ]
                })
            elif coverage < 75 and missing:
                # Moderate gap
                suggestions.append({
                    'priority': 'MEDIUM',
                    'domain': domain,
                    'issue': f"{coverage}% coverage in {domain} - room for improvement",
                    'recommendation': f"Strengthen {domain} curriculum with focus on: {', '.join(missing[:2])}",
                    'action_items': [
                        f"Include {missing[0]} in existing courses" if missing else "Enhance projects",
                        "Encourage student projects in this domain"
                    ]
                })
        
        # General recommendations based on top missing skills
        top_missing = skill_gap_data.get('top_missing_skills', [])
        if top_missing:
            suggestions.append({
                'priority': 'MEDIUM',
                'domain': 'General Skills',
                'issue': f"Students lack exposure to {len(top_missing)} industry-relevant skills",
                'recommendation': f"Create elective courses or workshops covering: {', '.join(top_missing[:5])}",
                'action_items': [
                    "Partner with industry for guest lectures",
                    "Organize hackathons focused on these technologies",
                    "Update lab infrastructure to support new tools"
                ]
            })
        
        return {
            'total_suggestions': len(suggestions),
            'suggestions': sorted(suggestions, key=lambda x: {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2}.get(x['priority'], 3))
        }
