import psycopg2

# Database connection details
conn = psycopg2.connect(
    dbname="fitnessDB",
    user="your_username",
    password="your_password",
    host="localhost",  
    port="5432"       
)
cur = conn.cursor()


# ----------------------------------------------------------------
# What you guys ONLY need to modify is in between these dashed lines
# Replace with your actual sql command
cur.execute("SELECT * FROM your_table;")

# just prints the rows
rows = cur.fetchall()
for row in rows:
    print(row)

# ----------------------------------------------------------------
# Commit and close the connection
conn.commit() # this commits any changes that you make to the pgsql server
cur.close() 
conn.close()
