import pandas as pd
import numpy as np
import random
import os

DATA_DIR = "data"
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

NUM_STUDENTS = 500
BRANCHES = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL']
SKILLS_POOL = {
    'CSE': ['Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'AWS', 'Machine Learning'],
    'IT': ['Python', 'Java', 'HTML', 'CSS', 'JavaScript', 'SQL', 'Cyber Security'],
    'ECE': ['C', 'C++', 'Verilog', 'MATLAB', 'Embedded Systems', 'IoT', 'Python'],
    'MECH': ['AutoCAD', 'SolidWorks', 'ANSYS', 'MATLAB', 'Thermodynamics'],
    'CIVIL': ['AutoCAD', 'Revit', 'STAAD.Pro', 'Surveying', 'Python']
}

COMPANIES = [
    {'name': 'Google', 'min_cgpa': 8.5, 'skills': ['Python', 'C++', 'Data Structures', 'Machine Learning'], 'salary': 2500000},
    {'name': 'Microsoft', 'min_cgpa': 8.0, 'skills': ['C#', 'Azure', 'System Design', 'Python'], 'salary': 2000000},
    {'name': 'TCS', 'min_cgpa': 6.5, 'skills': ['Java', 'SQL', 'Communication'], 'salary': 450000},
    {'name': 'Infosys', 'min_cgpa': 6.0, 'skills': ['Python', 'Java', 'MySQL'], 'salary': 400000},
    {'name': 'Accenture', 'min_cgpa': 6.5, 'skills': ['Java', 'Cloud Computing', 'Communication'], 'salary': 600000},
    {'name': 'StartupX', 'min_cgpa': 7.0, 'skills': ['React', 'Node.js', 'MongoDB', 'AWS'], 'salary': 1200000}
]

def generate_student_data():
    students = []
    
    for i in range(NUM_STUDENTS):
        branch = np.random.choice(BRANCHES, p=[0.4, 0.3, 0.1, 0.1, 0.1])
        cgpa = np.clip(np.random.normal(7.5, 1.2), 5.0, 10.0)
        tenth_score = np.clip(np.random.normal(80, 10), 50, 100)
        twelfth_score = np.clip(np.random.normal(80, 10), 50, 100)
        
        # Skill assignment based on branch + some random
        branch_skills = SKILLS_POOL[branch]
        num_skills = np.random.randint(2, 6)
        student_skills = random.sample(branch_skills, min(num_skills, len(branch_skills)))
        
        internships = np.random.choice([0, 1, 2, 3], p=[0.5, 0.3, 0.15, 0.05])
        projects = np.random.randint(1, 5)
        
        # Determine Placement
        # Logical rule: High CGPA + Good Skills + Internships -> Higher chance
        placed = 0
        salary_offered = 0
        company_placed = None
        
        score = (cgpa * 10) + (tenth_score * 0.1) + (twelfth_score * 0.1) + (len(student_skills) * 5) + (internships * 10)
        
        prob = 1 / (1 + np.exp(-(score - 100)/10)) # Sigmoidish
        
        if np.random.random() < prob:
            placed = 1
            # Which company?
            possible_companies = [c for c in COMPANIES if cgpa >= c['min_cgpa']]
            if possible_companies:
                # Higher salary logic
                weights = [c['salary'] for c in possible_companies]
                weights = np.array(weights) / sum(weights) 
                # Invert weights slightly because higher salary is harder? 
                # Actually let's make it random but favoured by CGPA
                company = np.random.choice(possible_companies)
                company_placed = company['name']
                salary_offered = company['salary']
            else:
                placed = 0 # Qualifies for none despite score
        
        students.append({
            'Student_ID': f"STU{2025000+i}",
            'Branch': branch,
            'CGPA': round(cgpa, 2),
            '10th_Marks': round(tenth_score, 1),
            '12th_Marks': round(twelfth_score, 1),
            'Skills': "|".join(student_skills),
            'Internships': internships,
            'Projects': projects,
            'Placed': placed,
            'Salary': salary_offered,
            'Company': company_placed if placed else "NA"
        })
        
    return pd.DataFrame(students)

if __name__ == "__main__":
    df = generate_student_data()
    df.to_csv(f"{DATA_DIR}/students.csv", index=False)
    print(f"Generated {NUM_STUDENTS} student records in {DATA_DIR}/students.csv")
    
    # Save Company Data
    pd.DataFrame(COMPANIES).to_csv(f"{DATA_DIR}/companies.csv", index=False)
    print(f"Generated company records in {DATA_DIR}/companies.csv")
