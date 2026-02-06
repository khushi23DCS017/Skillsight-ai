import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import pickle
import os

# Adjust imports to work both as module and script
try:
    from .config import DATA_DIR, MODELS_DIR
except ImportError:
    from config import DATA_DIR, MODELS_DIR

def load_data():
    students_path = os.path.join(DATA_DIR, "students.csv")
    if not os.path.exists(students_path):
        raise FileNotFoundError(f"Data file not found at {students_path}. Run generate_data.py first.")
    return pd.read_csv(students_path)

class DataPreprocessor:
    def __init__(self):
        self.le_branch = LabelEncoder()
        self.feature_columns = ['CGPA', '10th_Marks', '12th_Marks', 'Internships', 'Projects', 'Branch_Encoded', 'Skill_Count']

    def fit_transform(self, df):
        # Feature Engineering: Skill Count
        df['Skill_Count'] = df['Skills'].apply(lambda x: len(str(x).split('|')) if pd.notna(x) else 0)
        
        # Encoding Branch
        df['Branch_Encoded'] = self.le_branch.fit_transform(df['Branch'])
        
        X = df[self.feature_columns]
        y_placed = df['Placed']
        y_salary = df['Salary']
        
        return X, y_placed, y_salary

    def save(self):
        if not os.path.exists(MODELS_DIR):
            os.makedirs(MODELS_DIR)
        with open(os.path.join(MODELS_DIR, 'preprocessor.pkl'), 'wb') as f:
            pickle.dump(self, f)
            
    @staticmethod
    def load():
        path = os.path.join(MODELS_DIR, 'preprocessor.pkl')
        if os.path.exists(path):
            with open(path, 'rb') as f:
                return pickle.load(f)
        return DataPreprocessor()

if __name__ == "__main__":
    df = load_data()
    processor = DataPreprocessor()
    X, y, y_sal = processor.fit_transform(df)
    processor.save()
    print("Data Preprocessing Complete. Shape:", X.shape)
