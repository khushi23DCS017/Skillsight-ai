import pandas as pd
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

try:
    from .preprocessing import DataPreprocessor, load_data
    from .config import MODELS_DIR
except ImportError:
    from preprocessing import DataPreprocessor, load_data
    from config import MODELS_DIR

def train():
    print("Loading data...")
    df = load_data()
    
    print("Preprocessing data...")
    # We load the preprocessor we saved earlier to ensure consistency, 
    # OR we create a new one and fit it.
    # Since we are training, let's fit a fresh one and save it (overwriting).
    processor = DataPreprocessor()
    X, y_placed, y_salary = processor.fit_transform(df)
    processor.save()
    
    # Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y_placed, test_size=0.2, random_state=42)
    
    # Train Random Forest
    print("Training Random Forest Classifier...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    
    # Evaluate
    preds = rf_model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Random Forest Accuracy: {acc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, preds))
    
    # Save Model
    if not os.path.exists(MODELS_DIR):
        os.makedirs(MODELS_DIR)
        
    model_path = os.path.join(MODELS_DIR, 'placement_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(rf_model, f)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train()
