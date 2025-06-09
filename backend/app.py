from flask import Flask, request, jsonify
from flask_cors import CORS
import crud as crud

app = Flask(__name__)
CORS(app)

# ===== UOM ROUTES =====
@app.route('/api/uoms', methods=['GET'])
def get_uoms():
    try:
        uoms = crud.get_all_uoms()
        return jsonify({'success': True, 'data': uoms})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/uoms', methods=['POST'])
def create_uom():
    try:
        data = request.get_json()
        if not data.get('name'):
            return jsonify({'success': False, 'error': 'UOM name is required'}), 400
        
        uom_id = crud.create_uom(data['name'])
        return jsonify({'success': True, 'data': {'id': uom_id}}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/uoms/<int:uom_id>', methods=['DELETE'])
def delete_uom(uom_id):
    try:
        crud.delete_uom(uom_id)
        return jsonify({'success': True, 'message': 'UOM deleted'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== PRODUCT ROUTES =====
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = crud.get_all_products()
        return jsonify({'success': True, 'data': products})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = crud.get_product_by_id(product_id)
        if product:
            return jsonify({'success': True, 'data': product})
        return jsonify({'success': False, 'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        if not data.get('name') or not data.get('price_per_unit') or not data.get('uom_id'):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        product_id = crud.create_product(data['name'], data['price_per_unit'], data['uom_id'])
        return jsonify({'success': True, 'data': {'id': product_id}}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        data = request.get_json()
        if not data.get('name') or not data.get('price_per_unit') or not data.get('uom_id'):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        rows_affected = crud.update_product(product_id, data['name'], data['price_per_unit'], data['uom_id'])
        if rows_affected > 0:
            return jsonify({'success': True, 'message': 'Product updated'})
        return jsonify({'success': False, 'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        rows_affected = crud.delete_product(product_id)
        if rows_affected > 0:
            return jsonify({'success': True, 'message': 'Product deleted'})
        return jsonify({'success': False, 'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== ORDER ROUTES =====
@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        orders = crud.get_all_orders()
        return jsonify({'success': True, 'data': orders})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = crud.get_order_details(order_id)
        if order:
            return jsonify({'success': True, 'data': order})
        return jsonify({'success': False, 'error': 'Order not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        if not data.get('customer_name') or not data.get('order_items'):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        if not isinstance(data['order_items'], list) or len(data['order_items']) == 0:
            return jsonify({'success': False, 'error': 'Order must have at least one item'}), 400
        
        order_id = crud.create_order(data['customer_name'], data['order_items'])
        return jsonify({'success': True, 'data': {'id': order_id}}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    try:
        rows_affected = crud.delete_order(order_id)
        if rows_affected > 0:
            return jsonify({'success': True, 'message': 'Order deleted'})
        return jsonify({'success': False, 'error': 'Order not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Grocery Management API is running'})

if __name__ == '__main__':
    print("🚀 Starting Grocery Management API...")
    app.run(debug=True, host='0.0.0.0', port=5000)