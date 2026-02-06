import sqlite3
import pandas as pd
import os

# Path to the database
db_path = os.path.join('instance', 'skillsight.db')

def view_database():
    if not os.path.exists(db_path):
        print(f"Database not found at: {db_path}")
        return

    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Get all table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        if not tables:
            print("No tables found in the database.")
            return

        print(f"Database contains {len(tables)} tables:\n")

        for table in tables:
            table_name = table[0]
            print(f"=== Table: {table_name} ===")
            
            # Read table into a pandas DataFrame for nice formatting
            try:
                df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn)
                if df.empty:
                    print("(Empty table)")
                else:
                    print(df.to_string(index=False))
            except Exception as e:
                 print(f"Error reading table {table_name}: {e}")
            
            print("\n" + "-"*50 + "\n")

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    view_database()
