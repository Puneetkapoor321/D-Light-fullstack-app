import sqlite3
import os

db_path = os.path.join('backend', 'rental.db')
print(f"Connecting to {os.path.abspath(db_path)}")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Check if column exists
    cursor.execute("PRAGMA table_info(cars)")
    columns = [col[1] for col in cursor.fetchall()]
    print(f"Current columns: {columns}")
    
    if 'status' not in columns:
        print("Adding 'status' column...")
        cursor.execute("ALTER TABLE cars ADD COLUMN status TEXT DEFAULT 'inactive'")
    
    if 'is_active' in columns:
        print("Migrating 'is_active' to 'status'...")
        cursor.execute("UPDATE cars SET status = 'active' WHERE is_active = 1")
    
    conn.commit()
    print("Migration successful.")
except Exception as e:
    print(f"Error during migration: {e}")
finally:
    conn.close()
