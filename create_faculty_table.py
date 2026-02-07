"""
Create Faculty table in the correct database
"""
import sqlite3
import os

# Path to the actual database being used
db_path = os.path.join('backend', 'instance', 'skillsight.db')

if not os.path.exists(db_path):
    print(f"❌ Database not found at {db_path}")
    exit(1)

# Connect to database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create Faculty table
create_table_sql = """
CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    subjects TEXT,
    specialization VARCHAR(100),
    experience_years INTEGER,
    profile_completed BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
"""

try:
    cursor.execute(create_table_sql)
    conn.commit()
    print("✅ Faculty table created successfully in backend/instance/skillsight.db!")
    
    # Verify table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='faculty';")
    result = cursor.fetchone()
    if result:
        print("✅ Verified: Faculty table exists")
    else:
        print("❌ Error: Faculty table was not created")
        
except Exception as e:
    print(f"❌ Error creating table: {e}")
finally:
    conn.close()

print("\n🔄 Now restart the backend server!")
