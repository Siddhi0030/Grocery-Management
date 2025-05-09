
import mysql.connector
__cnx = None


def get_sql_connection():
    # Declare a global variable __cnx to store the connection object
    global __cnx

    # Check if the connection object is not initialized (None)
    if __cnx is None:
        # Establish a new connection to the MySQL database
        __cnx = mysql.connector.connect(
            user='root',  # MySQL username
            password='12345',  # MySQL password
            host='127.0.0.1',  # Host where MySQL server is running (localhost in this case)
            database='grocery'  # Database name to connect to
        )
        # Return the newly created connection object
        return __cnx