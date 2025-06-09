// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        showLoading();
        
        // Fetch all data in parallel
        const [productsResponse, ordersResponse, uomsResponse] = await Promise.all([
            productAPI.getAll(),
            orderAPI.getAll(),
            uomAPI.getAll()
        ]);
        
        if (productsResponse.success && ordersResponse.success && uomsResponse.success) {
            const products = productsResponse.data;
            const orders = ordersResponse.data;
            const uoms = uomsResponse.data;
            
            // Update statistics
            updateStatistics(products, orders, uoms);
            
            // Display recent orders
            displayRecentOrders(orders);
            
            // Display products summary
            displayProductsSummary(products);
            
            // Show dashboard content
            document.getElementById('dashboard-content').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard data: ' + error.message);
    } finally {
        hideLoading();
    }
}

function updateStatistics(products, orders, uoms) {
    // Update total products
    document.getElementById('total-products').textContent = products.length;
    
    // Update total orders
    document.getElementById('total-orders').textContent = orders.length;
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);
    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);
    
    // Update total UOMs
    document.getElementById('total-uoms').textContent = uoms.length;
}

function displayRecentOrders(orders) {
    const container = document.getElementById('recent-orders-table');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="no-data">No orders found.</p>';
        return;
    }
    
    // Sort orders by date (most recent first) and take first 5
    const recentOrders = orders
        .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
        .slice(0, 5);
    
    const tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${recentOrders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.customer_name}</td>
                        <td>${formatDate(order.datetime)}</td>
                        <td>${formatCurrency(order.total_price)}</td>
                        <td><span class="status-badge status-completed">Completed</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function displayProductsSummary(products) {
    const container = document.getElementById('products-summary-table');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="no-data">No products found.</p>';
        return;
    }
    
    // Sort products by name and take first 10
    const topProducts = products
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 10);
    
    const tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price per Unit</th>
                    <th>UOM</th>
                </tr>
            </thead>
            <tbody>
                ${topProducts.map(product => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${formatCurrency(product.price_per_unit)}</td>
                        <td>${product.uom_name}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

// Refresh dashboard data
function refreshDashboard() {
    loadDashboardData();
}

// Add refresh button functionality if needed
document.addEventListener('click', function(e) {
    if (e.target.id === 'refresh-dashboard') {
        refreshDashboard();
    }
});