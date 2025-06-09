// Products page functionality
let products = [];
let uoms = [];
let currentProductId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
    setupEventListeners();
});

async function initializeProductsPage() {
    try {
        showLoading();
        await Promise.all([loadProducts(), loadUOMs()]);
        document.getElementById('products-section').style.display = 'block';
    } catch (error) {
        console.error('Error initializing products page:', error);
        showError('Failed to load page data: ' + error.message);
    } finally {
        hideLoading();
    }
}

function setupEventListeners() {
    // Add Product button
    document.getElementById('add-product-btn').addEventListener('click', openAddProductModal);
    
    // Add UOM button
    document.getElementById('add-uom-btn').addEventListener('click', openAddUOMModal);
    
    // Product form submission
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
    
    // UOM form submission
    document.getElementById('uom-form').addEventListener('submit', handleUOMSubmit);
    
    // Search functionality
    document.getElementById('search-products').addEventListener('input', filterProducts);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Cancel buttons
    document.getElementById('cancel-btn').addEventListener('click', closeModals);
    document.getElementById('cancel-uom-btn').addEventListener('click', closeModals);
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

async function loadProducts() {
    try {
        const response = await productAPI.getAll();
        if (response.success) {
            products = response.data;
            displayProducts(products);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        throw error;
    }
}

async function loadUOMs() {
    try {
        const response = await uomAPI.getAll();
        if (response.success) {
            uoms = response.data;
            populateUOMDropdown();
            displayUOMs();
        }
    } catch (error) {
        console.error('Error loading UOMs:', error);
        throw error;
    }
}

function displayProducts(productsToShow) {
    const container = document.getElementById('products-table');
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<p class="no-data">No products found.</p>';
        return;
    }
    
    const tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Price per Unit</th>
                    <th>UOM</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${productsToShow.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${formatCurrency(product.price_per_unit)}</td>
                        <td>${product.uom_name}</td>
                        <td class="actions">
                            <button class="btn btn-small btn-secondary" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn btn-small btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function displayUOMs() {
    const container = document.getElementById('uoms-list');
    
    if (uoms.length === 0) {
        container.innerHTML = '<p class="no-data">No UOMs found.</p>';
        return;
    }
    
    const uomHTML = `
        <div class="uom-grid">
            ${uoms.map(uom => `
                <div class="uom-item">
                    <span class="uom-name">${uom.name}</span>
                    <button class="btn btn-small btn-danger" onclick="deleteUOM(${uom.id})">×</button>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = uomHTML;
}

function populateUOMDropdown() {
    const select = document.getElementById('product-uom');
    select.innerHTML = '<option value="">Select UOM</option>';
    
    uoms.forEach(uom => {
        const option = document.createElement('option');
        option.value = uom.id;
        option.textContent = uom.name;
        select.appendChild(option);
    });
}

function filterProducts() {
    const searchTerm = document.getElementById('search-products').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

function openAddProductModal() {
    currentProductId = null;
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('save-btn').textContent = 'Save Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').style.display = 'block';
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    currentProductId = id;
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('save-btn').textContent = 'Update Product';
    
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price_per_unit;
    document.getElementById('product-uom').value = product.uom_id;
    
    document.getElementById('product-modal').style.display = 'block';
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('product-name').value.trim(),
        price_per_unit: parseFloat(document.getElementById('product-price').value),
        uom_id: parseInt(document.getElementById('product-uom').value)
    };
    
    if (!formData.name || !formData.price_per_unit || !formData.uom_id) {
        showError('Please fill in all required fields');
        return;
    }
    
    try {
        let response;
        if (currentProductId) {
            response = await productAPI.update(currentProductId, formData);
        } else {
            response = await productAPI.create(formData);
        }
        
        if (response.success) {
            showSuccess(`Product ${currentProductId ? 'updated' : 'created'} successfully!`);
            closeModals();
            await loadProducts();
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showError('Failed to save product: ' + error.message);
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await productAPI.delete(id);
        if (response.success) {
            showSuccess('Product deleted successfully!');
            await loadProducts();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product: ' + error.message);
    }
}

function openAddUOMModal() {
    document.getElementById('uom-form').reset();
    document.getElementById('uom-modal').style.display = 'block';
}

async function handleUOMSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('uom-name').value.trim();
    if (!name) {
        showError('Please enter UOM name');
        return;
    }
    
    try {
        const response = await uomAPI.create(name);
        if (response.success) {
            showSuccess('UOM created successfully!');
            closeModals();
            await loadUOMs();
        }
    } catch (error) {
        console.error('Error creating UOM:', error);
        showError('Failed to create UOM: ' + error.message);
    }
}

async function deleteUOM(id) {
    if (!confirm('Are you sure you want to delete this UOM? This may affect products using this UOM.')) return;
    
    try {
        const response = await uomAPI.delete(id);
        if (response.success) {
            showSuccess('UOM deleted successfully!');
            await loadUOMs();
        }
    } catch (error) {
        console.error('Error deleting UOM:', error);
        showError('Failed to delete UOM: ' + error.message);
    }
}

function closeModals() {
    document.getElementById('product-modal').style.display = 'none';
    document.getElementById('uom-modal').style.display = 'none';
}