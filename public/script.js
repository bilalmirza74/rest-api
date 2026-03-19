// API Configuration
const API_BASE = '/api/products';
let currentPage = 1;
let currentFilters = {};
let editingProductId = null;

// DOM Elements
const productsTable = document.getElementById('productsTable');
const productsBody = document.getElementById('productsBody');
const searchInput = document.getElementById('searchInput');
const companyFilter = document.getElementById('companyFilter');
const sortSelect = document.getElementById('sortSelect');
const refreshBtn = document.getElementById('refreshBtn');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const deleteModal = document.getElementById('deleteModal');
const productForm = document.getElementById('productForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search and filters
    searchInput.addEventListener('input', debounce(handleSearch, 500));
    companyFilter.addEventListener('change', handleFilters);
    sortSelect.addEventListener('change', handleFilters);
    refreshBtn.addEventListener('click', () => loadProducts());

    // Pagination
    prevBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextBtn.addEventListener('click', () => changePage(currentPage + 1));

    // Add product
    addProductBtn.addEventListener('click', () => openModal());

    // Modal events
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });

    document.getElementById('cancelBtn').addEventListener('click', closeModals);
    document.getElementById('deleteCancelBtn').addEventListener('click', closeModals);

    // Form submission
    productForm.addEventListener('submit', handleFormSubmit);

    // Delete confirmation
    document.getElementById('deleteConfirmBtn').addEventListener('click', confirmDelete);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === productModal) closeModals();
        if (e.target === deleteModal) closeModals();
    });
}

// Load products from API
async function loadProducts() {
    try {
        showLoading();

        const params = new URLSearchParams({
            page: currentPage,
            limit: 10,
            ...currentFilters
        });

        const response = await fetch(`${API_BASE}?${params}`);
        const data = await response.json();

        if (data.success) {
            displayProducts(data.data);
            updatePagination(data.data.length);
        } else {
            showError('Failed to load products');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products');
    } finally {
        hideLoading();
    }
}

// Display products in table
function displayProducts(products) {
    productsBody.innerHTML = '';

    if (products.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">
                <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 10px;"></i><br>
                No products found
            </td>
        `;
        productsBody.appendChild(emptyRow);
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td><span style="text-transform: capitalize;">${product.company}</span></td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <div class="rating">
                    <span>${product.rating}</span>
                    <i class="fas fa-star"></i>
                </div>
            </td>
            <td>
                ${product.featured ?
                    '<span class="featured-badge">Featured</span>' :
                    '<span style="color: #7f8c8d;">No</span>'
                }
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editProduct('${product._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProduct('${product._id}', '${product.name}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        productsBody.appendChild(row);
    });
}

// Handle search input
function handleSearch() {
    const query = searchInput.value.trim();
    currentFilters.name = query || undefined;
    currentPage = 1;
    loadProducts();
}

// Handle filters
function handleFilters() {
    const company = companyFilter.value;
    const sort = sortSelect.value;

    currentFilters.company = company || undefined;
    currentFilters.sort = sort || undefined;
    currentPage = 1;
    loadProducts();
}

// Change page
function changePage(page) {
    if (page < 1) return;
    currentPage = page;
    loadProducts();
}

// Update pagination controls
function updatePagination(productCount) {
    pageInfo.textContent = `Page ${currentPage}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = productCount < 10; // Assuming limit is 10
}

// Open modal for adding/editing
function openModal(product = null) {
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');

    if (product) {
        modalTitle.textContent = 'Edit Product';
        editingProductId = product._id;
        populateForm(product);
    } else {
        modalTitle.textContent = 'Add Product';
        editingProductId = null;
        form.reset();
    }

    productModal.style.display = 'block';
}

// Edit product
function editProduct(productId) {
    // For demo purposes, we'll create a mock product object
    // In a real app, you'd fetch the product details from the API
    const mockProduct = {
        _id: productId,
        name: 'Sample Product',
        price: 99.99,
        company: 'apple',
        rating: 4.5,
        featured: true
    };

    openModal(mockProduct);
}

// Delete product
function deleteProduct(productId, productName) {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
        performDelete(productId);
    }
}

// Perform delete operation
async function performDelete(productId) {
    try {
        const response = await fetch(`${API_BASE}/${productId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            loadProducts(); // Refresh the table
            closeModals();
            showMessage('Product deleted successfully!', 'success');
        } else {
            throw new Error('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        company: document.getElementById('productCompany').value,
        rating: parseFloat(document.getElementById('productRating').value),
        featured: document.getElementById('productFeatured').checked
    };

    try {
        let response;
        if (editingProductId) {
            // Update product (PUT request)
            response = await fetch(`${API_BASE}/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Add new product (POST request)
            response = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
        }

        if (response.ok) {
            closeModals();
            loadProducts();
            showMessage(editingProductId ? 'Product updated successfully!' : 'Product added successfully!', 'success');
        } else {
            throw new Error('Failed to save product');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showError('Failed to save product');
    }
}

// Populate form with product data
function populateForm(product) {
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCompany').value = product.company;
    document.getElementById('productRating').value = product.rating;
    document.getElementById('productFeatured').checked = product.featured;
}

// Close all modals
function closeModals() {
    productModal.style.display = 'none';
    deleteModal.style.display = 'none';
    editingProductId = null;
}

// Show loading state
function showLoading() {
    productsBody.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                <div class="spinner"></div>
                Loading products...
            </td>
        </tr>
    `;
}

// Hide loading state
function hideLoading() {
    // Loading is hidden when products are displayed
}

// Show success/error messages
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

function showError(message) {
    showMessage(message, 'error');
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some sample data if the API is empty (for demonstration)
async function addSampleData() {
    const sampleProducts = [
        { name: 'iPhone 15', price: 999, company: 'apple', rating: 4.8, featured: true },
        { name: 'Samsung Galaxy S24', price: 899, company: 'samsung', rating: 4.7, featured: true },
        { name: 'Dell XPS 13', price: 1299, company: 'dell', rating: 4.6, featured: false },
        { name: 'Redmi Note 12', price: 299, company: 'mi', rating: 4.4, featured: false }
    ];

    for (const product of sampleProducts) {
        try {
            await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        } catch (error) {
            console.error('Error adding sample data:', error);
        }
    }
}