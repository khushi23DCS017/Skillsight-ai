# ML Engine Configuration

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(os.path.dirname(BASE_DIR), "data")

# PRS Weights
PRS_WEIGHTS = {
    'academics': 0.3,
    'skills': 0.4,
    'projects': 0.2,
    'internships': 0.1
}

# Supported Skills for Standardization
SKILL_MAP = {
    "PYTHON": "Python",
    "JS": "JavaScript",
    "REACT": "React.js",
    "ML": "Machine Learning"
}
