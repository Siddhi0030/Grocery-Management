// Orders page functionality
let orders = [];
let products = [];
let orderItems = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeOrdersPage();
    setupEventListeners();
});

async function initializeOrdersPage() {
    try {
        showLoading();
        await Promise.all([loadOrders(), loadProducts()]);
        document.getElementById('orders-section').style.display = 'block';
    } catch (error) {
        console.error('Error initializing orders page:', error);
        showError('Failed to load page data: ' + error.message);
    } finally {
        hideLoading();
    }
}

function setupEventListeners() {
    // Create Order button
    document.getElementById('create-order-btn').addEventListener('click', openCreateOrderModal);
    
    // Order form submission
    document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);
    
    // Add item button
    document.getElementById('add-item-btn').addEventListener('click', addOrderItem);
    
    // Search functionality
    document.getElementById('search-orders').addEventListener('input', filterOrders);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Cancel button
    document.getElementById('cancel-order-btn').addEventListener('click', closeModals);
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

async function loadOrders() {
    try {
        const response = await orderAPI.getAll();
        if (response.success) {
            orders = response.data;
            displayOrders(orders);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        throw error;
    }
}

async function loadProducts() {
    try {
        const response = await productAPI.getAll();
        if (response.success) {
            products = response.data;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        throw error;
    }
}

function displayOrders(ordersToShow) {
    const container = document.getElementById('orders-table');
    
    if (ordersToShow.length === 0) {
        container.innerHTML = '<p class="no-data">No orders found.</p>';
        return;
    }
    
    const tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${ordersToShow.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.customer_name}</td>
                        <td>${formatDate(order.datetime)}</td>
                        <td>${formatCurrency(order.total_price)}</td>
                        <td class="actions">
                            <button class="btn btn-small btn-primary" onclick="viewOrderDetails(${order.id})">View</button>
                            <button class="btn btn-small btn-danger" onclick="deleteOrder(${order.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function filterOrders() {
    const searchTerm = document.getElementById('search-orders').value.toLowerCase();
    const filteredOrders = orders.filter(order => 
        order.customer_name.toLowerCase().includes(searchTerm)
    );
    displayOrders(filteredOrders);
}

function openCreateOrderModal() {
    orderItems = [];
    document.getElementById('order-form').reset();
    document.getElementById('order-items').innerHTML = '';
    document.getElementById('order-total').textContent = '₹0.00';
    addOrderItem(); // Add first item by default
    document.getElementById('order-modal').style.display = 'block';
}

function addOrderItem() {
    const itemIndex = orderItems.length;
    orderItems.push({ product_id: '', quantity: '', price: 0 });
    
    const itemHTML = `
        <div class="order-item" data-index="${itemIndex}">
            <div class="form-row">
                <div class="form-group">
                    <label>Product</label>
                    <select class="product-select" data-index="${itemIndex}" required>
                        <option value="">Select Product</option>
                        ${products.map(product => `
                            <option value="${product.id}" data-price="${product.price_per_unit}">
                                ${product.name} (${formatCurrency(product.price_per_unit)}/${product.uom_name})
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantity</label>
                    <input type="number" class="quantity-input" data-index="${itemIndex}" min="1" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Total</label>
                    <input type="text" class="item-total" data-index="${itemIndex}" readonly>
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-danger btn-small" onclick="removeOrderItem(${itemIndex})">Remove</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('order-items').insertAdjacentHTML('beforeend', itemHTML);
    
    // Add event listeners for the new item
    const item = document.querySelector(`[data-index="${itemIndex}"]`);
    item.querySelector('.product-select').addEventListener('change', updateItemTotal);
    item.querySelector('.quantity-input').addEventListener('input', updateItemTotal);
}

function removeOrderItem(index) {
    const item = document.querySelector(`[data-index="${index}"]`);
    if (item) {
        item.remove();
        orderItems.splice(index, 1);
        updateOrderTotal();
    }
}

function updateItemTotal(e) {
    const index = e.target.dataset.index;
    const item = document.querySelector(`[data-index="${index}"]`);
    const productSelect = item.querySelector('.product-select');
    const quantityInput = item.querySelector('.quantity-input');
    const totalInput = item.querySelector('.item-total');
    
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const price = parseFloat(selectedOption.dataset.price || 0);
    const quantity = parseFloat(quantityInput.value || 0);
    const total = price * quantity;
    
    totalInput.value = formatCurrency(total);
    
    // Update orderItems array
    orderItems[index] = {
        product_id: parseInt(productSelect.value),
        quantity: quantity,
        price: total
    };
    
    updateOrderTotal();
}

function updateOrderTotal() {
    const total = orderItems.reduce((sum, item) => sum + (item.price || 0), 0);
    document.getElementById('order-total').textContent = formatCurrency(total);
}

async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('customer-name').value.trim();
    if (!customerName) {
        showError('Please enter customer name');
        return;
    }
    
    // Validate order items
    const validItems = orderItems.filter(item => item.product_id && item.quantity > 0);
    if (validItems.length === 0) {
        showError('Please add at least one valid item to the order');
        return;
    }
    
    const orderData = {
        customer_name: customerName,
        order_items: validItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }))
    };
    
    try {
        const response = await orderAPI.create(orderData);
        if (response.success) {
            showSuccess('Order created successfully!');
            closeModals();
            await loadOrders();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        showError('Failed to create order: ' + error.message);
    }
}

async function viewOrderDetails(orderId) {
    try {
        const response = await orderAPI.getById(orderId);
        if (response.success) {
            displayOrderDetails(response.data);
            document.getElementById('order-details-modal').style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading order details:', error);
        showError('Failed to load order details: ' + error.message);
    }
}

function displayOrderDetails(orderDetails) {
    const container = document.getElementById('order-details-content');
    
    const detailsHTML = `
        <div class="order-info">
            <div class="info-row">
                <span class="label">Order ID:</span>
                <span class="value">#${orderDetails.id}</span>
            </div>
            <div class="info-row">
                <span class="label">Customer:</span>
                <span class="value">${orderDetails.customer_name}</span>
            </div>
            <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">${formatDate(orderDetails.datetime)}</span>
            </div>
            <div class="info-row">
                <span class="label">Total Amount:</span>
                <span class="value">${formatCurrency(orderDetails.total_price)}</span>
            </div>
        </div>
        
        <div class="order-items-section">
            <h4>Order Items</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price per Unit</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderDetails.order_items.map(item => `
                        <tr>
                            <td>${item.product_name}</td>
                            <td>${item.quantity} ${item.uom_name}</td>
                            <td>${formatCurrency(item.price_per_unit)}</td>
                            <td>${formatCurrency(item.total_price)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = detailsHTML;
}

async function deleteOrder(id) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
        const response = await orderAPI.delete(id);
        if (response.success) {
            showSuccess('Order deleted successfully!');
            await loadOrders();
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        showError('Failed to delete order: ' + error.message);
    }
}

function closeModals() {
    document.getElementById('order-modal').style.display = 'none';
    document.getElementById('order-details-modal').style.display = 'none';
}