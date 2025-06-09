-- Insert sample UOMs
INSERT INTO unit_of_measures (name) VALUES 
('kg'), ('ltr'), ('pcs'), ('dozen'), ('grams');

-- Insert sample products
INSERT INTO products (name, price_per_unit, uom_id) VALUES 
('Rice', 80.00, 1),
('Milk', 60.00, 2),
('Eggs', 120.00, 4),
('Bread', 25.00, 3),
('Sugar', 45.00, 1);

-- Insert sample order
INSERT INTO orders (customer_name, total_amount) VALUES 
('John Doe', 285.00);

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES 
(1, 1, 2.000, 80.00, 160.00),
(1, 2, 1.000, 60.00, 60.00),
(1, 4, 1.000, 25.00, 25.00),
(1, 5, 0.500, 45.00, 22.50);