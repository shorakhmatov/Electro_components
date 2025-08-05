// JavaScript для авторизации и регистрации на странице профиля
document.addEventListener('DOMContentLoaded', function() {
    setupAuthForms();
});

function setupAuthForms() {
    // Переключение между вкладками
    const authTabs = document.querySelectorAll('.auth-tab');
    
    // Обработка кнопки "Забыли пароль"
    const forgotPasswordLink = document.getElementById('forgotPassword');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Создаем модальное окно для восстановления пароля
            showForgotPasswordModal();
        });
    }
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс у всех вкладок
            authTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Получаем ID формы из атрибута data-tab
            const tabId = this.getAttribute('data-tab');
            
            // Скрываем все формы
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            
            // Показываем нужную форму
            document.getElementById(tabId + 'Form').classList.add('active');
        });
    });

    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showNotification('Пожалуйста, заполните все поля', 'error');
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
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const phone = document.getElementById('registerPhone').value.trim();
            const password = document.getElementById('registerPassword').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;
            const terms = document.getElementById('termsAccept').checked;
            
            // Проверяем все поля
            if (!name || !email || !phone || !password) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            // Проверяем совпадение паролей
            if (password !== passwordConfirm) {
                showNotification('Пароли не совпадают', 'error');
                return;
            }
            
            // Проверяем согласие с условиями
            if (!terms) {
                showNotification('Необходимо принять условия обработки персональных данных', 'error');
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

// Показать модальное окно для восстановления пароля
function showForgotPasswordModal() {
    // Проверяем, существует ли уже модальное окно
    let modal = document.getElementById('forgotPasswordModal');
    
    // Если модального окна нет, создаем его
    if (!modal) {
        // Добавляем CSS для модального окна, если его еще нет
        if (!document.querySelector('link[href*="forgot-password-modal.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/assets/css/forgot-password-modal.css';
            document.head.appendChild(link);
        }
        
        modal = document.createElement('div');
        modal.id = 'forgotPasswordModal';
        
        // Создаем содержимое модального окна
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Восстановление пароля</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <p class="modal-description">Введите email или телефон, указанный при регистрации, и мы отправим вам инструкции по восстановлению пароля.</p>
                    <div class="form-group">
                        <label for="resetEmailOrPhone">Email или телефон</label>
                        <div class="input-icon">
                            <i class="fas fa-envelope"></i>
                            <input type="text" id="resetEmailOrPhone" name="resetEmailOrPhone" class="form-control" placeholder="Введите email или телефон" required>
                        </div>
                        <div class="error-message"></div>
                    </div>
                    <button type="button" id="sendResetLink" class="btn-submit"><i class="fas fa-paper-plane"></i> ОТПРАВИТЬ ИНСТРУКЦИИ</button>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно на страницу
        document.body.appendChild(modal);
        
        // Обработчик закрытия модального окна
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Закрытие модального окна при клике вне его
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Обработчик отправки формы
        const sendResetLinkBtn = document.getElementById('sendResetLink');
        sendResetLinkBtn.addEventListener('click', function() {
            const emailOrPhone = document.getElementById('resetEmailOrPhone').value.trim();
            
            if (!emailOrPhone) {
                const errorElement = document.querySelector('#resetEmailOrPhone + .error-message');
                errorElement.textContent = 'Пожалуйста, введите email или телефон';
                errorElement.style.display = 'block';
                return;
            }
            
            // Отправляем запрос на сервер
            fetch('/api/reset_password.php?action=request_reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailOrPhone })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Заменяем содержимое модального окна на сообщение об успехе
                    const modalContent = modal.querySelector('.modal-content');
                    modalContent.innerHTML = `
                        <div class="modal-header">
                            <h3>Инструкции отправлены</h3>
                            <span class="close">&times;</span>
                        </div>
                        <div class="modal-body success-message">
                            <p>Мы отправили инструкции по восстановлению пароля на указанный адрес электронной почты.</p>
                            <p>Пожалуйста, проверьте вашу почту и следуйте инструкциям в письме.</p>
                            <p>Если вы не получили письмо, проверьте папку "Спам" или попробуйте запросить восстановление пароля еще раз.</p>
                        </div>
                    `;
                    
                    // Обновляем обработчик закрытия
                    const newCloseBtn = modalContent.querySelector('.close');
                    newCloseBtn.addEventListener('click', function() {
                        modal.style.display = 'none';
                    });
                    
                    // Показываем уведомление
                    showNotification(data.message, 'success');
                } else {
                    // Показываем ошибку
                    const errorElement = document.querySelector('#resetEmailOrPhone + .error-message');
                    errorElement.textContent = data.message || 'Не удалось отправить инструкции';
                    errorElement.style.display = 'block';
                    
                    // Показываем уведомление
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Reset password request error:', error);
                showNotification('Произошла ошибка при отправке запроса', 'error');
            });
        });
    }
    
    // Показываем модальное окно
    modal.style.display = 'block';
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
