
class RoadmapService:
    def __init__(self):
        self.companies = {
            "Amazon": {
                "tier": "Tier 1 Product",
                "focus_areas": ["Data Structures & Algorithms", "System Design", "Leadership Principles", "Object-Oriented Design"],
                "rounds": ["Online Assessment (Code + Aptitude)", "Technical Interview 1 (DSA)", "Technical Interview 2 (System Design)", "Bar Raiser (Behavioral + Tech)"],
                "min_cgpa": 7.5,
                "resources": ["Blind 75 LeetCode", "Amazon Leadership Principles", "Grokking System Design"]
            },
            "Motorola": {
                "tier": "Product",
                "focus_areas": ["Embedded Systems", "C/C++", "Operating Systems", "Computer Networks"],
                "rounds": ["Online Test (Coding + Electronics)", "Technical Interview 1", "HR Interview"],
                "min_cgpa": 7.0,
                "resources": ["Embedded C Programming", "OS Concepts by Galvin"]
            },
            "TCS": {
                "tier": "Service",
                "focus_areas": ["Aptitude", "Basic Coding (Arrays/Strings)", "Communication Skills", "Java/Python Basics"],
                "rounds": ["TCS NQT (Aptitude + Coding)", "Technical Interview", "Managerial/HR Interview"],
                "min_cgpa": 6.0,
                "resources": ["TCS NQT Past Papers", "Java for Beginners", "R.S. Aggarwal Aptitude"]
            },
            "Meditab": {
                "tier": "Product/HealthTech",
                "focus_areas": ["Database (SQL)", "C# / .NET", "Problem Solving", "Healthcare Domain Knowledge"],
                "rounds": ["Aptitude Test", "Technical Test (SQL + Coding)", "Technical Interview", "HR Round"],
                "min_cgpa": 6.5,
                "resources": ["SQLZoo", "C# Documentation", "Healthcare IT Basics"]
            },
            "Reliance Industries Limited": {
                "tier": "Conglomerate",
                "focus_areas": ["Core Engineering", "Data Analytics", "Supply Chain", "Basic Coding"],
                "rounds": ["Online Assessment (Cognitive + Technical)", "Group Discussion", "Personal Interview"],
                "min_cgpa": 6.5,
                "resources": ["Relaince Graduate Engineer Trainee papers", "Data Analytics Basics"]
            },
            "Intuitive.Cloud": {
                "tier": "Cloud/Product",
                "focus_areas": ["Cloud Computing (AWS/Azure)", "DevOps", "Python", "Networking"],
                "rounds": ["Online Coding", "Cloud Concepts Interview", "HR Round"],
                "min_cgpa": 7.0,
                "resources": ["AWS Certified Practitioner Guide", "Docker & Kubernetes Basics"]
            },
            "Crest Data Systems": {
                "tier": "Product/Data",
                "focus_areas": ["Python/Java", "Data Engineering", "Elasticsearch", "Linux Internals"],
                "rounds": ["Aptitude + Coding", "Technical Round 1", "Technical Round 2", "HR"],
                "min_cgpa": 7.2,
                "resources": ["Elasticsearch Guide", "Linux Command Line", "Python Data Science Handbook"]
            },
            "ICICI Bank": {
                "tier": "FinTech",
                "focus_areas": ["Banking Domain", "SQL/PLSQL", "Python (Data Analysis)", "Aptitude"],
                "rounds": ["Online Psychometric & Aptitude", "Group Discussion", "Personal Interview"],
                "min_cgpa": 6.0,
                "resources": ["Banking & Finance Basics", "SQL for Data Analysis"]
            },
            "Amul": {
                "tier": "FMCG",
                "focus_areas": ["Supply Chain Management", "IoT Basics", "Database Management", "ERP Concepts"],
                "rounds": ["Aptitude Test", "Technical Interview (Project based)", "HR Interview"],
                "min_cgpa": 6.5,
                "resources": ["Supply Chain Logistics", "DBMS Concepts"]
            },
            "Alembic": {
                "tier": "Pharma",
                "focus_areas": ["Data Analysis", "Automation", "Basic Programming", "Process logic"],
                "rounds": ["Aptitude", "Technical Interview", "HR"],
                "min_cgpa": 6.0,
                "resources": ["Automation Basics", "Excel for Data Analysis"]
            },
            "MG (Morris Garages)": {
                "tier": "Automotive",
                "focus_areas": ["Embedded Systems", "IoT", "C++", "Automotive Protocols (CAN/LIN)"],
                "rounds": ["Technical Test", "Technical Interview", "HR"],
                "min_cgpa": 6.5,
                "resources": ["Automotive Electronics", "C++ Programming"]
            },
            "Jeavio": {
                "tier": "Service/Product",
                "focus_areas": ["Full Stack Development", "JavaScript", "React/Node", "Problem Solving"],
                "rounds": ["Coding Test", "Technical Interview", "Managerial Round"],
                "min_cgpa": 6.5,
                "resources": ["FreeCodeCamp Web Dev", "JavaScript Info"]
            },
            "Apollo Hospitals": {
                "tier": "HealthTech",
                "focus_areas": ["Health Informatics", "Data Privacy", "App Development", "Basic Coding"],
                "rounds": ["Aptitude", "Technical Interview", "HR"],
                "min_cgpa": 6.0,
                "resources": ["Health IT certifications", "Mobile App Dev Basics"]
            },
            "Torrent Power": {
                "tier": "Energy",
                "focus_areas": ["Power Systems", "IoT", "Data Analysis", "Electrical Basics"],
                "rounds": ["Technical Written Test", "Interview"],
                "min_cgpa": 6.5,
                "resources": ["Power Systems Engineering", "Smart Grid Concepts"]
            },
            "Berger": {
                "tier": "Manufacturing",
                "focus_areas": ["Process Automation", "ERP Systems", "Data Management"],
                "rounds": ["Aptitude", "Interview"],
                "min_cgpa": 6.0,
                "resources": ["Enterprise Resource Planning", "Industrial Automation"]
            },
            "IBM": {
                "tier": "Tier 1 Product/Service",
                "focus_areas": ["Cloud", "AI/ML", "Java", "Cognitive Ability"],
                "rounds": ["Cognitive Ability Games", "Coding Test", "Technical Interview", "HR"],
                "min_cgpa": 6.5,
                "resources": ["IBM Cognitive Class", "Java Programming"]
            },
            "Thomson Reuters": {
                "tier": "Product",
                "focus_areas": ["Cybersecurity", "Cloud", "Full Stack", "Data Science"],
                "rounds": ["Online Assessment", "Technical Interview 1", "Technical Interview 2"],
                "min_cgpa": 7.0,
                "resources": ["OWASP Top 10", "Cloud Security Basics"]
            },
            "M&M Software": {
                "tier": "Industrial",
                "focus_areas": ["C#/.NET", "Industrial Automation", "WPF", "Software Architecture"],
                "rounds": ["Aptitude & Technical Test", "Technical Interview", "HR"],
                "min_cgpa": 7.0,
                "resources": [".NET Architecture", "Industrial IoT"]
            },
            "Cadila Healthcare Ltd.": {
                "tier": "Pharma",
                "focus_areas": ["Bioinformatics", "Data Analytics", "IT Infrastructure"],
                "rounds": ["Aptitude", "Interview"],
                "min_cgpa": 6.0,
                "resources": ["Bioinformatics Algorithms", "ITSM Basics"]
            },
            "Capgemini": {
                "tier": "Service",
                "focus_areas": ["Pseudocode", "English Communication", "Game-Based Aptitude", "Java/C"],
                "rounds": ["Capgemini Exceller (Pseduocode + Verbal + Game)", "Technical Interview", "HR"],
                "min_cgpa": 6.0,
                "resources": ["Capgemini Game Based Aptitude", "Pseudocode Practice"]
            },
            "Infocusp Innovations": {
                "tier": "Product/AI",
                "focus_areas": ["Machine Learning", "Algorithms", "Python", "Math/Statistics"],
                "rounds": ["Algorithms Test", "ML Concept Check", "Interview"],
                "min_cgpa": 7.5,
                "resources": ["Andrew Ng ML Course", "Mathematical Statistics"]
            },
            "IRS (Ishitva Robotic Systems)": {
                "tier": "Robotics",
                "focus_areas": ["Robotics", "Computer Vision", "Python/C++", "AI"],
                "rounds": ["Technical Test", "Interview"],
                "min_cgpa": 7.0,
                "resources": ["ROS (Robot Operating System)", "OpenCV"]
            },
            "Infosys": {
                "tier": "Service",
                "focus_areas": ["Pseudocode", "Puzzle Solving", "Database", "Python/Java"],
                "rounds": ["InfyTQ / HackWithInfy", "Technical Interview", "HR"],
                "min_cgpa": 6.0,
                "resources": ["Infosys Pseudocode", "SQL Basics"]
            },
            "Asite": {
                "tier": "Product",
                "focus_areas": ["SaaS", "Cloud", "Java", "Database"],
                "rounds": ["Coding Test", "Technical Interview", "HR"],
                "min_cgpa": 6.5,
                "resources": ["SaaS Architecture", "Java Collections"]
            },
            "Tata Consulting Engineers Limited": {
                "tier": "Engineering",
                "focus_areas": ["Core Engineering", "Design Software", "Project Management"],
                "rounds": ["Technical Test", "Interview"],
                "min_cgpa": 6.5,
                "resources": ["AutoCAD/Design Tools", "Engineering Fundamentals"]
            },
            "Apex Hospitals": {
                "tier": "HealthTech",
                "focus_areas": ["Hospital Management Systems", "IT Support", "Basic Networking"],
                "rounds": ["Interview"],
                "min_cgpa": 6.0,
                "resources": ["HMS Software", "CompTIA Network+"]
            },
            "Panblicks": {
                "tier": "Cloud/Data",
                "focus_areas": ["Data Engineering", "Snowflake", "AWS", "SQL"],
                "rounds": ["Aptitude + SQL", "Technical Interview", "HR"],
                "min_cgpa": 6.5,
                "resources": ["Snowflake Documentation", "Data Warehousing"]
            },
            "Intas": {
                "tier": "Pharma",
                "focus_areas": ["Pharma IT", "Regulatory Compliance", "Data Integrity"],
                "rounds": ["Interview"],
                "min_cgpa": 6.0,
                "resources": ["GAMP 5", "Pharma Compliance"]
            },
            "Philips": {
                "tier": "Product/HealthTech",
                "focus_areas": ["C++", "Image Processing", "Algorithms", "Embedded"],
                "rounds": ["Online Test", "Technical Interview 1", "Technical Interview 2", "HR"],
                "min_cgpa": 7.0,
                "resources": ["Digital Image Processing", "C++ STL"]
            },
            "Bosch": {
                "tier": "Product/Auto",
                "focus_areas": ["Embedded C", "Automotive", "Control Systems", "IoT"],
                "rounds": ["Technical Test", "Technical Interview", "Managerial Round"],
                "min_cgpa": 7.0,
                "resources": ["Embedded C", "Control Systems Theory"]
            },
            "HHAExchange": {
                "tier": "HealthTech/SaaS",
                "focus_areas": ["healthcare SaaS", ".NET/Java", "SQL", "Agile"],
                "rounds": ["Coding Test", "Technical Interview", "HR"],
                "min_cgpa": 6.5,
                "resources": ["Agile Methodology", "SaaS Basics"]
            }
        }

    def get_all_companies(self):
        return list(self.companies.keys())

    def get_company_details(self, company_name):
        return self.companies.get(company_name, {})

    def generate_roadmap(self, student_profile, company_name):
        company = self.companies.get(company_name)
        if not company:
            return {"error": "Company not found"}

        # Basic roadmap structure
        roadmap = {
            "company": company_name,
            "tier": company["tier"],
            "eligibility_status": "Eligible" if student_profile.get("cgpa", 0) >= company["min_cgpa"] else "Conditions Apply",
            "timeline": []
        }

        # Week 1-2: Foundations based on focus areas
        roadmap["timeline"].append({
            "weeks": "Week 1-2",
            "phase": "Foundations",
            "tasks": [f"Master {area}" for area in company["focus_areas"][:2]],
            "resources": company["resources"]
        })

        # Week 3-4: Advanced Topics & Practice
        roadmap["timeline"].append({
            "weeks": "Week 3-4",
            "phase": "Advanced Concepts",
            "tasks": [f"Deep dive into {area}" for area in company["focus_areas"][2:]] + ["Practice 20+ problems"],
            "resources": ["GeeksForGeeks Company Archives", "LeetCode Tagged Questions"]
        })

        # Week 5: Mock Tests
        roadmap["timeline"].append({
            "weeks": "Week 5",
            "phase": "Mock & Review",
            "tasks": [f"Take {r} practice test" for r in company["rounds"] if "Test" in r or "Assessment" in r],
            "resources": ["Pramp (Mock Interviews)", "Resume Review"]
        })

        return roadmap
