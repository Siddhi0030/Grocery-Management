from flask import Flask, request, jsonify
import grocery_dao
import uom_dao
from sql_connection import get_sql_connection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

connection = get_sql_connection()
@app.route('/getProducts',methods=['GET'])
def get_products():
    products=grocery_dao.get_all_products(connection)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
@app.route('/deleteProduct/<int:id>',methods=['POST'])
def delete_product(id):
    return_id=grocery_dao.delete_product(connection,id)
    response = jsonify({
        'product_id':return_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

from uom_dao import get_uom  # Import the function from uom_dao

@app.route('/getUOM', methods=['GET'])
def get_uom():
    units = get_uom(connection)  # Fetch data using the uom_dao function
    response = jsonify(units)  # Convert the data to JSON
    response.headers.add('Access-Control-Allow-Origin', '*')  # Allow cross-origin requests
    return response


if __name__ == '__main__':
    print("hello world")
    app.run(port=5000)
    