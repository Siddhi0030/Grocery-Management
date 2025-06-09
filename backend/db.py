import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",  # Replace with your MySQL username
        password="corazon71",  # Replace with your MySQL password
        database="grocery_management"
    )