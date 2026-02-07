"""
Database initialization script to create the Faculty table
Run this after adding the Faculty model
"""
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask
from database.models import db, Faculty

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///placement.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    # Create the Faculty table
    db.create_all()
    print("✅ Faculty table created successfully!")
    print("You can now restart the backend server.")
