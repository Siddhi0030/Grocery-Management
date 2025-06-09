// API Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Utility function for making API requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// UOM API functions
const uomAPI = {
    // Get all UOMs
    getAll: async () => {
        return await apiRequest('/uoms');
    },
    
    // Create new UOM
    create: async (name) => {
        return await apiRequest('/uoms', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
    },
    
    // Delete UOM
    delete: async (id) => {
        return await apiRequest(`/uoms/${id}`, {
            method: 'DELETE'
        });
    }
};

// Product API functions
const productAPI = {
    // Get all products
    getAll: async () => {
        return await apiRequest('/products');
    },
    
    // Get product by ID
    getById: async (id) => {
        return await apiRequest(`/products/${id}`);
    },
    
    // Create new product
    create: async (productData) => {
        return await apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    },
    
    // Update product
    update: async (id, productData) => {
        return await apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    },
    
    // Delete product
    delete: async (id) => {
        return await apiRequest(`/products/${id}`, {
            method: 'DELETE'
        });
    }
};

// Order API functions
const orderAPI = {
    // Get all orders
    getAll: async () => {
        return await apiRequest('/orders');
    },
    
    // Get order by ID
    getById: async (id) => {
        return await apiRequest(`/orders/${id}`);
    },
    
    // Create new order
    create: async (orderData) => {
        return await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },
    
    // Delete order
    delete: async (id) => {
        return await apiRequest(`/orders/${id}`, {
            method: 'DELETE'
        });
    }
};

// Health check
const healthCheck = async () => {
    return await apiRequest('/health');
};

// Utility functions for UI
const showLoading = (elementId = 'loading') => {
    const element = document.getElementById(elementId);
    if (element) element.style.display = 'block';
};

const hideLoading = (elementId = 'loading') => {
    const element = document.getElementById(elementId);
    if (element) element.style.display = 'none';
};

const showError = (message, elementId = 'error') => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
};

const showSuccess = (message, elementId = 'success') => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
};

const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
};