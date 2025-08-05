// JavaScript для модального окна авторизации
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    setupModalAuth();
});

function setupModalAuth() {
    // Получаем элементы модального окна
    const authModal = document.getElementById('authModal');
    const closeBtn = authModal ? authModal.querySelector('.close') : null;
    const authTabs = authModal ? authModal.querySelectorAll('.auth-tab') : [];
    
    // Формы авторизации и регистрации
    const modalLoginForm = document.getElementById('modalLoginForm');
    const modalRegisterForm = document.getElementById('modalRegisterForm');
    
    // Кнопка "Забыли пароль"
    const forgotPasswordLink = document.getElementById('modalForgotPassword');
    
    // Если модальное окно не найдено, выходим
    if (!authModal) return;
    
    // Открытие модального окна при клике на кнопку "Профиль" (если пользователь не авторизован)
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            // Проверяем, авторизован ли пользователь
            const isLoggedIn = checkIfUserIsLoggedIn();
            
            if (!isLoggedIn) {
                // Если пользователь не авторизован, открываем модальное окно
                e.preventDefault();
                authModal.style.display = 'block';
            }
        });
    }
    
    // Функция проверки авторизации пользователя
    function checkIfUserIsLoggedIn() {
        // Проверяем несколько признаков авторизации
        
        // 1. Проверяем наличие сессии в PHP (наличие кнопки выхода)
        const logoutBtn = document.getElementById('logoutBtn');
        
        // 2. Проверяем наличие данных пользователя в localStorage
        const userInLocalStorage = localStorage.getItem('user') || localStorage.getItem('user_id');
        
        // 3. Проверяем наличие имени пользователя в кнопке профиля
        const profileBtnText = profileBtn.querySelector('span');
        const hasUserName = profileBtnText && profileBtnText.textContent !== 'Профиль';
        
        // Считаем пользователя авторизованным, если хотя бы один из признаков присутствует
        return !!logoutBtn || !!userInLocalStorage || hasUserName;
    }
    
    // Закрытие модального окна при клике на крестик
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }
    
    // Закрытие модального окна при клике вне его области
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Обработка кнопки "Забыли пароль"
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Закрываем модальное окно авторизации
            authModal.style.display = 'none';
            
            // Загружаем скрипт для модального окна восстановления пароля, если он еще не загружен
            loadForgotPasswordScript();
        });
    }
        // Переключение между вкладками
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс у всех вкладок
            authTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Получаем ID формы из атрибута data-tab
            const tabId = this.getAttribute('data-tab');
            
            // Скрываем все формы
            const allForms = authModal.querySelectorAll('.auth-form');
            allForms.forEach(form => {
                form.style.display = 'none';
                form.classList.remove('active');
            });
            
            // Показываем нужную форму
            if (tabId === 'modalLogin') {
                modalLoginForm.style.display = 'block';
                modalLoginForm.classList.add('active');
            } else if (tabId === 'modalRegister') {
                modalRegisterForm.style.display = 'block';
                modalRegisterForm.classList.add('active');
            }
            
            console.log('Переключение на вкладку:', tabId);
            console.log('Форма входа видима:', modalLoginForm.style.display);
            console.log('Форма регистрации видима:', modalRegisterForm.style.display);
        });
    });
    
    // Обработка формы входа
    if (modalLoginForm) {
        modalLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('modalLoginEmail').value;
            const password = document.getElementById('modalLoginPassword').value;
            
            // Сбрасываем все ошибки
            modalLoginForm.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            
            // Проверяем каждое поле
            let hasErrors = false;
            
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                document.getElementById('modalLoginEmail').parentNode.classList.add('error');
                hasErrors = true;
            }
            
            if (!password) {
                document.getElementById('modalLoginPassword').parentNode.classList.add('error');
                hasErrors = true;
            }
            
            if (hasErrors) {
                return;
            }
            
            // Отправляем запрос на сервер
            fetch('api/auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Вход выполнен успешно', 'success');
                    
                    // Сохраняем данные пользователя в localStorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                    }
                    
                    // Закрываем модальное окно
                    authModal.style.display = 'none';
                    
                    // Перезагружаем страницу
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    showNotification(data.message || 'Ошибка входа', 'error');
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                showNotification('Ошибка при входе', 'error');
            });
        });
    }
    
    // Обработка формы регистрации
    if (modalRegisterForm) {
        // Сначала убедимся, что форма регистрации видима при переключении вкладки
        const registerTab = document.querySelector('[data-tab="modalRegister"]');
        if (registerTab) {
            registerTab.addEventListener('click', function() {
                setTimeout(() => {
                    modalRegisterForm.style.display = 'block';
                    modalRegisterForm.classList.add('active');
                }, 50);
            });
        }
        
        modalRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('modalRegisterName').value.trim();
            const email = document.getElementById('modalRegisterEmail').value.trim();
            const phone = document.getElementById('modalRegisterPhone').value.trim();
            const password = document.getElementById('modalRegisterPassword').value;
            const passwordConfirm = document.getElementById('modalPasswordConfirm').value;
            const terms = document.getElementById('modalTermsAccept').checked;
            
            // Сбрасываем все ошибки
            modalRegisterForm.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            
            // Проверяем каждое поле
            let hasErrors = false;
            
            if (!name) {
                document.getElementById('modalRegisterName').parentNode.parentNode.classList.add('error');
                hasErrors = true;
            }
            
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                document.getElementById('modalRegisterEmail').parentNode.parentNode.classList.add('error');
                hasErrors = true;
            }
            
            if (!phone || !/^\+7\d{10}$/.test(phone)) {
                document.getElementById('modalRegisterPhone').parentNode.parentNode.classList.add('error');
                hasErrors = true;
            }
            
            if (!password) {
                document.getElementById('modalRegisterPassword').parentNode.parentNode.classList.add('error');
                hasErrors = true;
            }
            
            if (password !== passwordConfirm) {
                document.getElementById('modalPasswordConfirm').parentNode.parentNode.classList.add('error');
                hasErrors = true;
            }
            
            if (!terms) {
                showNotification('Необходимо принять условия обработки персональных данных', 'error');
                hasErrors = true;
            }
            
            if (hasErrors) {
                return;
            }
            
            // Отправляем запрос на сервер
            fetch('api/auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: name, 
                    email: email, 
                    phone: phone, 
                    password: password,
                    terms: 'accepted'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Регистрация успешна!', 'success');
                    
                    // После успешной регистрации выполняем вход
                    setTimeout(() => {
                        fetch('api/auth.php?action=login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ email, password })
                        })
                        .then(response => response.json())
                        .then(loginData => {
                            if (loginData.success) {
                                // Сохраняем данные пользователя в localStorage
                                localStorage.setItem('user', JSON.stringify(loginData.user));
                                if (loginData.token) {
                                    localStorage.setItem('token', loginData.token);
                                }
                                
                                // Закрываем модальное окно
                                authModal.style.display = 'none';
                                
                                // Перезагружаем страницу
                                window.location.reload();
                            }
                        });
                    }, 1500);
                } else {
                    showNotification(data.message || 'Ошибка регистрации', 'error');
                }
            })
            .catch(error => {
                console.error('Registration error:', error);
                showNotification('Ошибка при регистрации', 'error');
            });
        });
    }
}

// Загрузка скрипта для модального окна восстановления пароля
function loadForgotPasswordScript() {
    // Проверяем, загружен ли уже скрипт
    if (!document.querySelector('script[src*="profile-auth.js"]')) {
        // Загружаем CSS для модального окна, если его еще нет
        if (!document.querySelector('link[href*="forgot-password-modal.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/assets/css/forgot-password-modal.css';
            document.head.appendChild(link);
        }
        
        // Загружаем скрипт
        const script = document.createElement('script');
        script.src = '/assets/js/profile-auth.js';
        script.onload = function() {
            // После загрузки скрипта вызываем функцию показа модального окна
            if (typeof showForgotPasswordModal === 'function') {
                showForgotPasswordModal();
            } else {
                console.error('Function showForgotPasswordModal not found');
            }
        };
        document.head.appendChild(script);
    } else {
        // Если скрипт уже загружен, просто вызываем функцию
        if (typeof showForgotPasswordModal === 'function') {
            showForgotPasswordModal();
        } else {
            console.error('Function showForgotPasswordModal not found');
        }
    }
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Проверяем, существует ли контейнер для уведомлений
    let container = document.querySelector('.toast-container');
    
    // Если контейнера нет, создаем его
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Создаем элемент уведомления
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Добавляем уведомление в контейнер
    container.appendChild(toast);
    
    // Показываем уведомление
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
