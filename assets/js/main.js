// main.js
// API Endpoints
const API_URL = 'api';

// DOM Elements
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authTabs = document.querySelectorAll('.auth-tab');
const chatWidget = document.getElementById('chatWidget');
const chatContainer = document.querySelector('.chat-widget__container');
const productsGrid = document.getElementById('productsGrid');
const categoriesGrid = document.getElementById('categoriesGrid');
const logoutBtn = document.getElementById('logoutBtn');

// State management
let currentUser = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadUserData();
    setupEventListeners();
    updateCartUI();
    updateFavoritesUI();
});

function setupEventListeners() {
    // Logout button handler
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Login form submission
    document.getElementById('loginSubmit').addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showError('Пожалуйста, заполните все поля');
            return;
        }
        
        await login(email, password);
    });

    // Register form submission
    document.getElementById('registerSubmit').addEventListener('click', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const terms = document.getElementById('termsAccept').checked;
        
        if (!name || !email || !phone || !password) {
            showError('Пожалуйста, заполните все поля');
            return;
        }
        
        if (!terms) {
            showError('Необходимо принять условия обработки персональных данных');
            return;
        }
        
        await register({ full_name: name, email, phone, password });
    });

    // Category click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.id;
            getProductsByCategory(categoryId);
        });
    });

    // Add to cart button handlers
    document.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.btn-primary');
        if (addToCartBtn && addToCartBtn.getAttribute('onclick')?.includes('addToCart')) {
            e.preventDefault();
            const productId = addToCartBtn.getAttribute('onclick').match(/\d+/)[0];
            addToCart(productId, addToCartBtn);
        }
    });

    // Add to favorites button handlers
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-favorites')) {
            const productId = e.target.dataset.id;
            toggleFavorite(productId);
        }
    });

    // Chat widget toggle
    document.querySelector('.chat-widget__button').addEventListener('click', toggleChat);
}

// Profile Button
document.getElementById('profileBtn').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = './profile.html';
});

// Auth Modal Close Button
document.querySelector('.modal .close').addEventListener('click', () => {
    hideAuthModal();
});

// Auth Tabs
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchAuthTab(tab.dataset.tab);
    });
});

// Initialize App
async function initializeApp() {
    try {
        const response = await fetch(`${API_URL}/products.php?action=getAll`);
        const data = await response.json();
        if (data.status === 'success') {
            renderProducts(data.products);
            renderCategories();
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render Functions
function renderCategories() {
    categoriesGrid.innerHTML = categories.map(category => `
        <div class="category-card" data-id="${category.id}">
            <i class="fas fa-${category.icon}"></i>
            <h3>${category.name}</h3>
        </div>
    `).join('');
}

function renderProducts(products) {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-card__image">
            <div class="product-card__content">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__price">${product.price} ₽</p>
                <div class="product-card__actions">
                    <div class="quantity-controls">
                        <button class="btn-quantity" onclick="decrementQuantity(this)">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="99" onchange="validateQuantity(this)">
                        <button class="btn-quantity" onclick="incrementQuantity(this)">+</button>
                    </div>
                    <button class="btn btn-primary" onclick="addToCart(${product.id}, this)">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                    <button class="btn btn-secondary btn-favorite" onclick="toggleFavorite(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Обновляем состояние избранного
    updateFavoritesUI();

    // Обновляем состояние корзины
    updateCartUI();
}

// Auth Functions
async function logout() {
    try {
        // Очищаем данные пользователя
        currentUser = null;
        localStorage.removeItem('user');
        
        // Перенаправляем на страницу выхода
        window.location.href = 'logout.php';
    } catch (error) {
        console.error('Logout error:', error);
        showError('Ошибка при выходе');
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth.php?action=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.status === 'success') {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            hideAuthModal();
            updateUIForLoggedInUser();
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Ошибка при входе');
    }
}

async function register(formData) {
    try {
        const response = await fetch(`${API_URL}/auth.php?action=register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        if (data.status === 'success') {
            showSuccess('Регистрация успешна! Теперь вы можете войти.');
            switchAuthTab('login');
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Ошибка при регистрации');
    }
}

function loadUserData() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    if (currentUser) {
        document.getElementById('profileBtn').innerHTML = `<i class="fas fa-user"></i> ${currentUser.full_name}`;
        document.getElementById('logoutBtn').style.display = 'inline-block';
        // Скрываем модальное окно авторизации, если оно открыто
        hideAuthModal();
    } else {
        document.getElementById('profileBtn').innerHTML = '<i class="fas fa-user"></i> Профиль';
        document.getElementById('logoutBtn').style.display = 'none';
    }
}

// Product Functions
async function searchProducts(query) {
    try {
        const response = await fetch(`${API_URL}/products.php?action=search&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.status === 'success') {
            renderProducts(data.products);
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}

async function getProductsByCategory(categoryId) {
    try {
        const response = await fetch(`${API_URL}/products.php?action=getByCategory&category_id=${categoryId}`);
        const data = await response.json();
        if (data.status === 'success') {
            renderProducts(data.products);
        }
    } catch (error) {
        console.error('Category filter error:', error);
    }
}

// Quantity Functions
function incrementQuantity(btn) {
    const input = btn.parentElement.querySelector('.quantity-input');
    const currentValue = parseInt(input.value);
    if (currentValue < 99) {
        input.value = currentValue + 1;
    }
}

function decrementQuantity(btn) {
    const input = btn.parentElement.querySelector('.quantity-input');
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

function validateQuantity(input) {
    let value = parseInt(input.value);
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > 99) {
        value = 99;
    }
    input.value = value;
}

// Cart Functions
async function addToCart(productId, btn) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = './profile.html';
        return;
    }

    const quantityInput = btn.parentElement.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value);

    try {
        const response = await fetch(`${API_URL}/cart.php?action=add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ 
                product_id: productId,
                quantity: quantity
            })
        });

        const data = await response.json();
        if (data.status === 'success') {
            showSuccess('Товар добавлен в корзину');
            updateCartUI();
        } else {
            showError(data.message || 'Ошибка при добавлении в корзину');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        showError('Ошибка при добавлении в корзину');
    }
}

async function updateCartUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
        const response = await fetch(`${API_URL}/cart.php?action=get`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        
        const data = await response.json();
        if (data.status === 'success') {
            const cartBtn = document.querySelector('#cartBtn');
            const cartCounter = cartBtn.querySelector('.counter') || document.createElement('span');
            cartCounter.className = 'counter';
            
            if (data.cart && data.cart.length > 0) {
                cartCounter.textContent = data.cart.reduce((sum, item) => sum + item.quantity, 0);
                if (!cartCounter.parentNode) {
                    cartBtn.appendChild(cartCounter);
                }
            } else if (cartCounter.parentNode) {
                cartCounter.remove();
            }

            // Обновляем количество в инпутах, если мы на странице корзины
            if (window.location.pathname.includes('cart.html')) {
                data.cart.forEach(item => {
                    const quantityInput = document.querySelector(`[data-product-id="${item.product_id}"] .quantity-input`);
                    if (quantityInput) {
                        quantityInput.value = item.quantity;
                    }
                });
            }
        }
    } catch (error) {
        console.error('Update cart UI error:', error);
    }
}

// Favorites Functions
async function toggleFavorite(productId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = './profile.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/favorites.php?action=toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ product_id: productId })
        });

        const data = await response.json();
        if (data.status === 'success') {
            const btn = event.target.closest('.btn-favorite');
            const icon = btn.querySelector('i');
            
            if (data.is_favorite) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showSuccess('Товар добавлен в избранное');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showSuccess('Товар удален из избранного');
            }
            
            updateFavoritesUI();
        } else {
            showError(data.message || 'Ошибка при обновлении избранного');
        }
    } catch (error) {
        console.error('Toggle favorite error:', error);
        showError('Ошибка при обновлении избранного');
    }
}

async function updateFavoritesUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
        const response = await fetch(`${API_URL}/favorites.php?action=get`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        
        const data = await response.json();
        if (data.status === 'success') {
            const favBtn = document.querySelector('#favoritesBtn');
            const favCounter = favBtn.querySelector('.counter') || document.createElement('span');
            favCounter.className = 'counter';
            
            if (data.favorites && data.favorites.length > 0) {
                favCounter.textContent = data.favorites.length;
                if (!favCounter.parentNode) {
                    favBtn.appendChild(favCounter);
                }
            } else if (favCounter.parentNode) {
                favCounter.remove();
            }

            // Обновляем иконки на странице
            if (data.favorites) {
                const favoriteIds = data.favorites.map(f => f.product_id);
                document.querySelectorAll('.btn-favorite').forEach(btn => {
                    const productId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
                    const icon = btn.querySelector('i');
                    if (favoriteIds.includes(productId)) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                    }
                });
            }
        }
    } catch (error) {
        console.error('Update favorites UI error:', error);
    }
}

// UI Helper Functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showAuthModal() {
    authModal.style.display = 'block';
}

function hideAuthModal() {
    authModal.style.display = 'none';
}

function switchAuthTab(tab) {
    authTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

function toggleChat() {
    const isHidden = chatContainer.style.display === 'none';
    chatContainer.style.display = isHidden ? 'block' : 'none';
}

// Search Implementation
const searchInput = document.querySelector('.header__search input');
searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length >= 3) {
        searchProducts(searchTerm);
    } else if (searchTerm.length === 0) {
        initializeApp();
    }
}, 300));

// Utility Functions
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

// Profile Functions

// Загрузка данных профиля
async function loadProfile() {
    try {
        const response = await fetch('api/get_profile.php');
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Обновляем данные в шапке профиля
        document.querySelector('.profile__name').textContent = `${data.user.last_name} ${data.user.first_name} ${data.user.middle_name || ''}`;
        document.querySelector('.profile__email').textContent = data.user.email;

        // Заполняем форму профиля
        document.getElementById('lastName').value = data.user.last_name;
        document.getElementById('firstName').value = data.user.first_name;
        document.getElementById('middleName').value = data.user.middle_name || '';
        document.getElementById('email').value = data.user.email;
        document.getElementById('phone').value = data.user.phone;
        document.getElementById('address').value = data.user.address || '';

        // Заполняем настройки
        document.querySelector('input[name="notifications"]').checked = data.user.notifications_enabled;

    } catch (error) {
        showError('Ошибка загрузки профиля');
        console.error('Error loading profile:', error);
    }
}

// Обработка отправки формы профиля
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        lastName: document.getElementById('lastName').value,
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    try {
        const response = await fetch('api/update_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        showSuccess('Профиль успешно обновлен');
        loadProfile(); // Перезагружаем данные профиля

    } catch (error) {
        showError('Ошибка обновления профиля');
        console.error('Error updating profile:', error);
    }
});

// Обработка отправки формы настроек
document.getElementById('settingsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        notifications: document.querySelector('input[name="notifications"]').checked
    };

    // Проверяем совпадение паролей
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        showError('Пароли не совпадают');
        return;
    }

    try {
        const response = await fetch('api/update_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        showSuccess('Настройки успешно обновлены');
        
        // Очищаем поля паролей
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

    } catch (error) {
        showError('Ошибка обновления настроек');
        console.error('Error updating settings:', error);
    }
});

// Обработка переключения вкладок
document.querySelectorAll('.profile__tab')?.forEach(tab => {
    tab.addEventListener('click', () => {
        // Убираем активный класс у всех вкладок
        document.querySelectorAll('.profile__tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.profile__tab-content').forEach(c => c.classList.remove('active'));

        // Добавляем активный класс выбранной вкладке
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Загружаем профиль при инициализации
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('profileContent')) {
        loadProfile();
    }
});

// Sample data (to be replaced with backend data)
const categories = [
    { id: 1, name: 'Микроконтроллеры', icon: 'microchip' },
    { id: 2, name: 'Резисторы', icon: 'bolt' },
    { id: 3, name: 'Конденсаторы', icon: 'battery-full' },
    { id: 4, name: 'Светодиоды', icon: 'lightbulb' },
    { id: 5, name: 'Транзисторы', icon: 'broadcast-tower' },
    { id: 6, name: 'Датчики', icon: 'sensor' }
];

const products = [
    {
        id: 1,
        name: 'Arduino Uno R3',
        price: 2500,
        image: 'assets/images/products/arduino-uno.jpg',
        description: 'Популярная плата на ATmega328P',
        category: 1
    },
    {
        id: 2,
        name: 'Raspberry Pi 4B 4GB',
        price: 8900,
        image: 'assets/images/products/raspberry-pi.jpg',
        description: 'Одноплатный компьютер',
        category: 1
    },
    {
        id: 3,
        name: 'ESP32 DevKit',
        price: 990,
        image: 'assets/images/products/esp32.jpg',
        description: 'WiFi + Bluetooth модуль',
        category: 1
    },
    {
        id: 4,
        name: 'Arduino Nano',
        price: 1200,
        image: 'assets/images/products/arduino-nano.jpg',
        description: 'Компактная версия Arduino',
        category: 1
    },
    {
        id: 5,
        name: 'NodeMCU ESP8266',
        price: 750,
        image: 'assets/images/products/nodemcu.jpg',
        description: 'WiFi модуль разработки',
        category: 1
    }
];
