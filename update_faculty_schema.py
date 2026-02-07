"""
Add new columns to Faculty table
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

# Add new columns
try:
    cursor.execute("ALTER TABLE faculty ADD COLUMN designation VARCHAR(100);")
    print("✅ Added designation column")
except Exception as e:
    print(f"⚠️  designation column: {e}")

try:
    cursor.execute("ALTER TABLE faculty ADD COLUMN qualification VARCHAR(200);")
    print("✅ Added qualification column")
except Exception as e:
    print(f"⚠️  qualification column: {e}")

try:
    cursor.execute("ALTER TABLE faculty ADD COLUMN skills TEXT;")
    print("✅ Added skills column")
except Exception as e:
    print(f"⚠️  skills column: {e}")

conn.commit()
conn.close()

print("\n✅ Database schema updated successfully!")
print("🔄 Restart the backend server to apply changes.")
