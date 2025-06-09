from db import get_connection

# ===== UOM OPERATIONS =====
def get_all_uoms():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM unit_of_measures ORDER BY name")
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

def create_uom(name):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO unit_of_measures (name) VALUES (%s)", (name,))
    uom_id = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    return uom_id

def delete_uom(uom_id):
    conn = get_connection()
    cursor = conn.cursor()
    # Check if used by products
    cursor.execute("SELECT COUNT(*) FROM products WHERE uom_id = %s", (uom_id,))
    count = cursor.fetchone()[0]
    if count > 0:
        cursor.close()
        conn.close()
        raise Exception("Cannot delete UOM: It is being used by products")
    
    cursor.execute("DELETE FROM unit_of_measures WHERE id = %s", (uom_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    cursor.close()
    conn.close()
    return rows_affected

# ===== PRODUCT OPERATIONS =====
def get_all_products():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
    SELECT p.id, p.name, p.price_per_unit, p.is_active, p.created_at,
           u.name as uom_name, u.id as uom_id
    FROM products p
    JOIN unit_of_measures u ON p.uom_id = u.id
    WHERE p.is_active = 1
    ORDER BY p.name
    """
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

def get_product_by_id(product_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
    SELECT p.id, p.name, p.price_per_unit, p.is_active, p.created_at,
           u.name as uom_name, u.id as uom_id
    FROM products p
    JOIN unit_of_measures u ON p.uom_id = u.id
    WHERE p.id = %s
    """
    cursor.execute(query, (product_id,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result

def create_product(name, price_per_unit, uom_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO products (name, price_per_unit, uom_id) VALUES (%s, %s, %s)",
        (name, price_per_unit, uom_id)
    )
    product_id = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    return product_id

def update_product(product_id, name, price_per_unit, uom_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE products SET name = %s, price_per_unit = %s, uom_id = %s WHERE id = %s",
        (name, price_per_unit, uom_id, product_id)
    )
    rows_affected = cursor.rowcount
    conn.commit()
    cursor.close()
    conn.close()
    return rows_affected

def delete_product(product_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE products SET is_active = 0 WHERE id = %s", (product_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    cursor.close()
    conn.close()
    return rows_affected

# ===== ORDER OPERATIONS =====
def get_all_orders():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

def get_order_details(order_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Get order info
    cursor.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
    order = cursor.fetchone()
    
    if not order:
        cursor.close()
        conn.close()
        return None
    
    # Get order items
    query = """
    SELECT oi.id, oi.quantity, oi.unit_price, oi.total_price,
           p.name as product_name, u.name as uom_name
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN unit_of_measures u ON p.uom_id = u.id
    WHERE oi.order_id = %s
    ORDER BY p.name
    """
    cursor.execute(query, (order_id,))
    items = cursor.fetchall()
    
    order['items'] = items
    cursor.close()
    conn.close()
    return order

def create_order(customer_name, order_items):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Calculate total
    total_amount = sum(float(item['quantity']) * float(item['unit_price']) for item in order_items)
    
    # Insert order
    cursor.execute(
        "INSERT INTO orders (customer_name, total_amount) VALUES (%s, %s)",
        (customer_name, total_amount)
    )
    order_id = cursor.lastrowid
    
    # Insert order items
    for item in order_items:
        item_total = float(item['quantity']) * float(item['unit_price'])
        cursor.execute(
            "INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (%s, %s, %s, %s, %s)",
            (order_id, item['product_id'], item['quantity'], item['unit_price'], item_total)
        )
    
    conn.commit()
    cursor.close()
    conn.close()
    return order_id

def delete_order(order_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM orders WHERE id = %s", (order_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    cursor.close()
    conn.close()
    return rows_affected