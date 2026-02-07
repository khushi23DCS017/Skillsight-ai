
import sqlite3
import os

DB_PATH = os.path.join("instance", "skillsight.db")

def view_users():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("\n=== SYSTEM USERS ===")
    try:
        cursor.execute("SELECT id, email, role, created_at FROM users")
        users = cursor.fetchall()
        print(f"{'ID':<5} {'Role':<10} {'Email':<30} {'Created At'}")
        print("-" * 70)
        for user in users:
            print(f"{user[0]:<5} {user[2]:<10} {user[1]:<30} {user[3]}")
    except sqlite3.OperationalError as e:
        print(f"Error querying users: {e}")
            
    conn.close()

if __name__ == "__main__":
    view_users()
