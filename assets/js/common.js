// Toast Notifications
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    const toast = createToast(message, type);
    toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' :
                type === 'error' ? 'times-circle' :
                'exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    return toast;
}

// Local Storage Helpers
const storage = {
    get: (key, defaultValue = null) => {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    },
    
    set: (key, value) => {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    },
    
    clear: () => {
        localStorage.clear();
    }
};

// Authentication State
function isAuthenticated() {
    return !!storage.get('user');
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/profile.html';
        return false;
    }
    return true;
}

// Format Helpers
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Input Validation
function validateCardNumber(number) {
    return /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(number);
}

function validateCardExpiry(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
}

function validateCardCVV(cvv) {
    return /^\d{3}$/.test(cvv);
}

// Form Input Formatting
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    input.value = value;
}

function formatCardExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0,2) + '/' + value.slice(2);
    }
    input.value = value;
}

// Cart Management
const cart = {
    items: [],
    
    init() {
        this.items = storage.get('cart', []);
        this.updateCartCount();
    },
    
    add(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
        this.save();
        showToast('Товар добавлен в корзину');
    },
    
    remove(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.save();
    },
    
    updateQuantity(itemId, quantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = Math.max(1, Math.min(99, quantity));
            this.save();
        }
    },
    
    clear() {
        this.items = [];
        this.save();
    },
    
    save() {
        storage.set('cart', this.items);
        this.updateCartCount();
    },
    
    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    },
    
    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
});
