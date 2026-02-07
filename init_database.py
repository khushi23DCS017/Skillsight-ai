"""
Properly initialize the Faculty table in the skillsight database
This script uses Flask-SQLAlchemy to create the table with the correct schema
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from flask import Flask
from database.models import db, Faculty, User

# Create Flask app with same config as main app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillsight.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

with app.app_context():
    # Create all tables (will only create missing ones)
    db.create_all()
    print("✅ Database tables created/verified successfully!")
    
    # Verify Faculty table exists
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    
    if 'faculty' in tables:
        print("✅ Faculty table exists")
        columns = [col['name'] for col in inspector.get_columns('faculty')]
        print(f"   Columns: {', '.join(columns)}")
    else:
        print("❌ Faculty table NOT found!")
    
    print("\n🔄 Restart the backend server to use the updated database.")
