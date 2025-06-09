import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="",  # Replace with your MySQL username
        password="",  # Replace with your MySQL password
        database="grocery_management"
    )