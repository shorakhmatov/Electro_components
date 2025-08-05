// auth.js
// API Endpoints
const API_URL = '.';

// UI Elements
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const profileBtn = document.getElementById('profileBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    setupAuthListeners();
});

function initAuth() {
    const user = localStorage.getItem('user');
    if (user) {
        updateUIForLoggedInUser(JSON.parse(user));
    }
}

function setupAuthListeners() {
    // Profile button click
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'profile.php';
        });
    }

    // Login form submission
    if (loginForm) {
        const loginSubmit = loginForm.querySelector('#loginSubmit');
        if (loginSubmit) {
            loginSubmit.addEventListener('click', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail')?.value;
                const password = document.getElementById('loginPassword')?.value;
                
                if (!email || !password) {
                    showError('Пожалуйста, заполните все поля');
                    return;
                }
                
                await login(email, password);
            });
        }
    }
    
    // Modal login form submission
    const modalLoginForm = document.getElementById('modalLoginForm');
    if (modalLoginForm) {
        const modalLoginSubmit = document.getElementById('modalLoginSubmit');
        if (modalLoginSubmit) {
            modalLoginSubmit.addEventListener('click', async (e) => {
                e.preventDefault();
                const email = document.getElementById('modalLoginEmail')?.value;
                const password = document.getElementById('modalLoginPassword')?.value;
                
                if (!email || !password) {
                    showError('Пожалуйста, заполните все поля');
                    return;
                }
                
                await login(email, password);
            });
        }
    }

    // Register form submission
    if (registerForm) {
        const registerSubmit = registerForm.querySelector('#registerSubmit');
        if (registerSubmit) {
            registerSubmit.addEventListener('click', async (e) => {
                e.preventDefault();
                
                // Получаем значения полей
                const name = document.getElementById('registerName')?.value.trim();
                const email = document.getElementById('registerEmail')?.value.trim();
                const phone = document.getElementById('registerPhone')?.value.trim();
                const password = document.getElementById('registerPassword')?.value;
                const terms = document.getElementById('termsAccept')?.checked;
                
                console.log('Registration form data:', { name, email, phone, password: '***', terms });
                
                // Проверяем все поля
                if (!name || !email || !phone || !password) {
                    showError('Пожалуйста, заполните все поля');
                    console.log('Empty fields detected:', { 
                        name: !name, 
                        email: !email, 
                        phone: !phone, 
                        password: !password 
                    });
                    return;
                }
                
                // Проверяем согласие с условиями
                if (!terms) {
                    showError('Необходимо принять условия обработки персональных данных');
                    return;
                }
                
                try {
                    await register({ 
                        name: name,
                        email: email, 
                        phone: phone, 
                        password: password
                    });
                } catch (error) {
                    console.error('Registration error:', error);
                    showError('Произошла ошибка при регистрации');
                }
            });
        }
    }
    
    // Modal Register form submission
    const modalRegisterForm = document.getElementById('modalRegisterForm');
    if (modalRegisterForm) {
        const modalRegisterSubmit = document.getElementById('modalRegisterSubmit');
        if (modalRegisterSubmit) {
            modalRegisterSubmit.addEventListener('click', async (e) => {
                e.preventDefault();
                
                // Получаем значения полей
                const name = document.getElementById('modalRegisterName')?.value.trim();
                const email = document.getElementById('modalRegisterEmail')?.value.trim();
                const phone = document.getElementById('modalRegisterPhone')?.value.trim();
                const password = document.getElementById('modalRegisterPassword')?.value;
                const terms = document.getElementById('modalTermsAccept')?.checked;
                
                console.log('Modal Registration form data:', { name, email, phone, password: '***', terms });
                
                // Проверяем все поля
                if (!name || !email || !phone || !password) {
                    showError('Пожалуйста, заполните все поля');
                    console.log('Empty fields detected:', { 
                        name: !name, 
                        email: !email, 
                        phone: !phone, 
                        password: !password 
                    });
                    return;
                }
                
                // Проверяем согласие с условиями
                if (!terms) {
                    showError('Необходимо принять условия обработки персональных данных');
                    return;
                }
                
                try {
                    await register({ 
                        name: name,
                        email, 
                        phone, 
                        password,
                        terms: 'accepted'
                    });
                } catch (error) {
                    console.error('Registration error:', error);
                    showError('Произошла ошибка при регистрации');
                }
            });
        }
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Auth tabs switching
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.dataset.tab;
            switchAuthTab(targetForm);
        });
    });

    // Modal close button
    const closeBtn = authModal?.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAuthModal);
    }
}

async function login(email, password) {
    try {
        const response = await fetch('api/auth.php?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Login response:', data);

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            updateUIForLoggedInUser(data.user);
            hideAuthModal();
            showSuccess('Вы успешно вошли в систему!');
            
            // Обновляем страницу после успешной авторизации
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Задержка в 1 секунду, чтобы пользователь увидел сообщение об успешном входе
        } else {
            showError(data.message || 'Ошибка входа');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Ошибка при входе');
    }
}

async function register({ name, email, phone, password }) {
    try {
        console.log('Sending registration data:', { name, email, phone, password: '***', terms: 'accepted' });
        const response = await fetch('api/auth.php?action=register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, password, terms: 'accepted' })
        });
        
        const data = await response.json();
        console.log('Register response:', data);

        if (data.success) {
            showSuccess('Регистрация успешна!');
            // После успешной регистрации выполняем вход
            await login(email, password);
            hideAuthModal();
        } else {
            showError(data.message || 'Ошибка регистрации');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Ошибка при регистрации');
    }
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    updateUIForLoggedInUser(null);
    
    // Если мы на защищенной странице, перенаправляем на главную
    const protectedPages = ['profile.html', 'cart.html', 'favorites.html', 'balance.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        window.location.href = './index.html';
    }
}

function updateUIForLoggedInUser(user) {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.style.display = user ? 'block' : 'none';
    }

    // Обновляем UI на защищенных страницах
    const protectedPages = ['profile.html', 'cart.html', 'favorites.html', 'balance.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !user) {
        window.location.href = './index.html';
    }
}

function showAuthModal() {
    if (authModal) {
        authModal.style.display = 'block';
    }
}

function hideAuthModal() {
    if (authModal) {
        authModal.style.display = 'none';
    }
}

function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}Form`).classList.add('active');
}

function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, 100);
}

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, 100);
}
