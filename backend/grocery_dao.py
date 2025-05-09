import mysql.connector  # Importing the MySQL connector library to interact with the MySQL database

# Function to fetch all products from the database
def get_all_products(connection):
    cursor = connection.cursor()  # Create a cursor object to execute SQL queries
    # SQL query to fetch product details by joining 'product' and 'unit' tables
    query = ("SELECT product.product_id, product.name, product.unit, product.price_per_unit, unit.unit_name "
             "FROM grocery.product "
             "INNER JOIN unit ON product.unit = unit.unit_id;")
    cursor.execute(query)  # Execute the query

    response = []  # Initialize an empty list to store the results

    # Loop through the result set and extract the details for each product
    for (product_id, name, unit, price_per_unit, unit_name) in cursor:
        # Add product details as a dictionary to the response list
        response.append({
            "product_id": product_id,
            "name": name,
            "unit": unit,
            "price_per_unit": price_per_unit,
            "unit_name": unit_name
        })

    return response  # Return the list of products

from sql_connection import get_sql_connection  # Import the function to get a database connection

# Function to insert a new product into the database
def insert_new_product(connection, product):
    cursor = connection.cursor()  # Create a cursor object
    # SQL query to insert a new product into the 'product' table
    query = ("INSERT INTO product (name, unit, price_per_unit) "
             "VALUES (%s, %s, %s)")
    # Tuple containing the product details to be inserted
    data = (product["name"], product["unit"], product["price_per_unit"])
    cursor.execute(query, data)  # Execute the query with the provided data
    connection.commit()  # Commit the transaction to save the changes
    return cursor.lastrowid  # Return the ID of the newly inserted product

# Function to delete a product from the database by product ID
# def delete_product(connection, product_id):
#     cursor = connection.cursor()  # Create a cursor object
#     # SQL query to delete a product from the 'product' table
#     # query = ("DELETE FROM product WHERE product_id=" + str(product_id))
#     # cursor.execute(query)  # Execute the query
#     connection.commit()  # Commit the transaction to save the changes

def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = "DELETE FROM product WHERE product_id = %s"
    try:
        cursor.execute(query, (product_id,))  # Use parameterized queries
        connection.commit()
        return product_id
    except Exception as e:
        print("Error in delete_product:", e)
        return None


if __name__ == '__main__':
    connection = get_sql_connection()  # Establish a connection to the database

    # Example to delete a product with ID 11
    print(delete_product(connection, 11))

    # Uncomment the following lines to test other functions:

    # Example to insert a new product
    # print(insert_new_product(connection, {
    #     'name': 'cabbage',
    #     'unit': '1',
    #     'price_per_unit': '10',
    # }))

    # Example to fetch all products
    # print(get_all_products(connection))
