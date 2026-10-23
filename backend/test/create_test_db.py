import sqlite3

# This creates a file named test.db in your backend folder
conn = sqlite3.connect("test.db")
cursor = conn.cursor()

# Create a sample sales table
cursor.execute("""
CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT,
    category TEXT,
    price REAL,
    quantity INTEGER,
    sale_date TEXT
)
""")

# Insert mock business rows
cursor.execute("INSERT INTO sales (product_name, category, price, quantity, sale_date) VALUES ('Laptop', 'Electronics', 75000, 2, '2026-10-01')")
cursor.execute("INSERT INTO sales (product_name, category, price, quantity, sale_date) VALUES ('Phone', 'Electronics', 40000, 5, '2026-10-15')")
cursor.execute("INSERT INTO sales (product_name, category, price, quantity, sale_date) VALUES ('Desk Chair', 'Furniture', 5000, 10, '2026-10-20')")

conn.commit()
conn.close()
print("test.db created successfully!")