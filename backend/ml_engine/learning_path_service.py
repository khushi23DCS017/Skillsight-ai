
class LearningPathService:
    def __init__(self):
        self.curricula = {
            "Python": {
                "title": "Master Python in 4 Weeks",
                "description": "From zero to hero in Python programming.",
                "modules": [
                    {
                        "week": 1,
                        "topic": "Python Basics & Logic",
                        "tasks": ["Variables & Data Types", "Control Flow (If/Else, Loops)", "Functions & Modules"],
                        "resources": ["Official Python Validator", "Automate the Boring Stuff (Ch 1-3)"]
                    },
                    {
                        "week": 2,
                        "topic": "Data Structures & OOP",
                        "tasks": ["Lists, Dictionaries, Sets", "Object-Oriented Programming (Classes/Objects)", "File Handling"],
                        "resources": ["RealPython OOP Guide", "HackerRank Python Basic"]
                    },
                    {
                        "week": 3,
                        "topic": "Libraries & APIs",
                        "tasks": ["Requests & JSON", "Pandas Basics", "Virtual Environments"],
                        "resources": ["Pandas 10 Minutes", "Rest API Tutorial"]
                    },
                    {
                        "week": 4,
                        "topic": "Final Project",
                        "tasks": ["Build a Web Scraper", "Create a CLI Tool", "Deploy to GitHub"],
                        "resources": ["BeautifulSoup Docs", "GitHub Guides"]
                    }
                ]
            },
            "SQL": {
                "title": "SQL for Data Science",
                "description": "Learn to query and manage databases effectively.",
                "modules": [
                    {
                        "week": 1,
                        "topic": "Foundations",
                        "tasks": ["SELECT, FROM, WHERE", "Filtering & Sorting", "Aggregate Functions (COUNT, SUM)"],
                        "resources": ["SQLBolt", "W3Schools SQL"]
                    },
                    {
                        "week": 2,
                        "topic": "Joins & Relationships",
                        "tasks": ["INNER/LEFT/RIGHT JOINs", "Primary & Foreign Keys", "Normalization Basics"],
                        "resources": ["SQL Joins Visualizer", "Mode Analytics SQL"]
                    },
                    {
                        "week": 3,
                        "topic": "Advanced Querying",
                        "tasks": ["Subqueries", "Window Functions (RANK, LEAD)", "CTEs"],
                        "resources": ["Advanced SQL Puzzles", "LeetCode Database Problems"]
                    },
                    {
                        "week": 4,
                        "topic": "Optimization & Design",
                        "tasks": ["Indexing", "Query Performance", "Database Design Project"],
                        "resources": ["Use The Index Luke", "Database Star"]
                    }
                ]
            },
            "React": {
                "title": "React.js Accelerator",
                "description": "Build modern, interactive web applications.",
                "modules": [
                    {
                        "week": 1,
                        "topic": "React Fundamentals",
                        "tasks": ["JSX & Rendering", "Components & Props", "Conditional Rendering"],
                        "resources": ["React Docs (Beta)", "Scrimba React Course"]
                    },
                    {
                        "week": 2,
                        "topic": "State & Effects",
                        "tasks": ["useState Hook", "useEffect Hook", "Handling Events"],
                        "resources": ["Overreacted.io", "React Hooks Guide"]
                    },
                    {
                        "week": 3,
                        "topic": "Data & Routing",
                        "tasks": ["Fetching API Data", "React Router", "Context API"],
                        "resources": ["TanStack Query", "React Router Docs"]
                    },
                    {
                        "week": 4,
                        "topic": "Capstone App",
                        "tasks": ["Build a Todo/Dashboard App", "State Management (Redux/Zustand)", "Deployment (Vercel)"],
                        "resources": ["Redux Toolkit", "Vercel Deployment Guide"]
                    }
                ]
            },
            "Data Science": {
                "title": "Data Science Kickstart",
                "description": "Intro to analyzing data with Python.",
                "modules": [
                    {
                        "week": 1,
                        "topic": "Statistics & Probability",
                        "tasks": ["Mean, Median, Mode", "Distributions", "Hypothesis Testing Basics"],
                        "resources": ["Khan Academy Statistics", "StatQuest YouTube"]
                    },
                    {
                        "week": 2,
                        "topic": "Data Manipulation",
                        "tasks": ["Numpy Arrays", "Pandas DataFrames", "Data Cleaning"],
                        "resources": ["Kaggle Pandas Course", "DataCamp Cheatsheets"]
                    },
                    {
                        "week": 3,
                        "topic": "Visualization",
                        "tasks": ["Matplotlib & Seaborn", "Exploratory Data Analysis (EDA)", "Storytelling with Data"],
                        "resources": ["Python Graph Gallery", "Seaborn Docs"]
                    },
                    {
                        "week": 4,
                        "topic": "Intro to ML",
                        "tasks": ["Scikit-Learn Basics", "Linear Regression", "First Kaggle Submission"],
                        "resources": ["Scikit-Learn Tutorials", "Kaggle Titanic Competition"]
                    }
                ]
            },
            "DSA": {
                "title": "Data Structures & Algorithms",
                "description": "Crack technical interviews with confidence.",
                "modules": [
                    {
                        "week": 1,
                        "topic": "Arrays & Strings",
                        "tasks": ["Array Manipulation", "Two Pointers", "Sliding Window"],
                        "resources": ["LeetCode Array Card", "GeeksForGeeks Arrays"]
                    },
                    {
                        "week": 2,
                        "topic": "Hashing & Linked Lists",
                        "tasks": ["Hash Maps", "Singly/Doubly Linked Lists", "Floyd's Cycle Detection"],
                        "resources": ["VisuAlgo", "HackerRank Linked Lists"]
                    },
                    {
                        "week": 3,
                        "topic": "Stacks, Queues & Trees",
                        "tasks": ["Stack/Queue Implementation", "Binary Trees", "DFS/BFS Traversals"],
                        "resources": ["Tree Traversal Visualizer", "Inorder/Preorder/Postorder"]
                    },
                    {
                        "week": 4,
                        "topic": "Sorting & Searching",
                        "tasks": ["Merge Sort", "Quick Sort", "Binary Search", "Interview Problems"],
                        "resources": ["Sorting Algorithms Animations", "Binary Search Guide"]
                    }
                ]
            }
        }

    def get_available_paths(self):
        return list(self.curricula.keys())

    def generate_path(self, skill_name):
        return self.curricula.get(skill_name, {"error": "Learning path not found"})
