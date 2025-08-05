// Функции для работы с формами
function showError(form, message) {
    const errorElement = form.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    showToast(message, 'error');
}

function clearErrors(form) {
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(el => el.style.display = 'none');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
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

document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('user');
    const authContainer = document.getElementById('authContainer');
    const profileContent = document.getElementById('profileContent');

    if (user) {
        // Пользователь авторизован
        const userData = JSON.parse(user);

        // Скрываем форму авторизации и показываем профиль
        if (authContainer) authContainer.style.display = 'none';
        if (profileContent) profileContent.style.display = 'flex'; // Изменено на flex для нового дизайна

        // Заполняем данные профиля
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('profileEmail');
        const phoneInput = document.getElementById('profilePhone');
        
        if (fullNameInput) fullNameInput.value = userData.name || '';
        if (emailInput) emailInput.value = userData.email || '';
        if (phoneInput) phoneInput.value = userData.phone || '';

        // Показываем кнопку выхода
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        // Пользователь не авторизован
        if (authContainer) authContainer.style.display = 'block';
        if (profileContent) profileContent.style.display = 'none';

        // Скрываем кнопку выхода
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.style.display = 'none';
    }

    // Обработка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.reload();
        });
    }

    // Обработка форм авторизации
    setupAuthForms();
    
    // Обработка формы профиля
    setupProfileForm();
    
    // Обработка боковой навигации
    setupSidebarNavigation();
});

// Функция для обработки формы профиля
function setupProfileForm() {
    const personalDataForm = document.getElementById('personalDataForm');
    if (personalDataForm) {
        personalDataForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('profileEmail').value.trim();
            const phone = document.getElementById('profilePhone').value.trim();
            
            if (!fullName || !email || !phone) {
                showToast('Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            try {
                const response = await fetch('./api/profile.php?action=update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        phone
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Обновляем данные пользователя в localStorage
                    const user = JSON.parse(localStorage.getItem('user'));
                    user.name = fullName;
                    user.email = email;
                    user.phone = phone;
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    showToast('Данные успешно обновлены', 'success');
                } else {
                    showToast(data.message || 'Ошибка при обновлении данных', 'error');
                }
            } catch (error) {
                console.error('Profile update error:', error);
                showToast('Ошибка сервера', 'error');
            }
        });
    }
}

// Функция для обработки боковой навигации
function setupSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.profile-sidebar-item');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Удаляем активный класс у всех элементов
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Добавляем активный класс к выбранному элементу
            item.classList.add('active');
            
            // Получаем ID целевого раздела из href
            const targetId = item.getAttribute('href').substring(1);
            
            // Показываем соответствующий раздел (пока реализован только личные данные)
            if (targetId === 'personal-data') {
                document.getElementById('personal-data').style.display = 'block';
            }
        });
    });
}

function setupAuthForms() {
    // Переключение между вкладками
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(targetForm + 'Form').classList.add('active');
        });
    });

    // Обработка формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('./api/auth.php?action=login', {
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
                    window.location.reload();
                } else {
                    showError(loginForm, data.message || 'Ошибка входа');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError(loginForm, 'Ошибка сервера');
            }
        });
    }

    // Обработка формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const lastName = document.getElementById('regLastName').value.trim();
            const firstName = document.getElementById('regFirstName').value.trim();
            const middleName = document.getElementById('regMiddleName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            let phone = document.getElementById('regPhone').value.trim();
            const password = document.getElementById('regPassword').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm').value;

            // Validate name fields
            if (lastName.length < 2 || firstName.length < 2) {
                showError(registerForm, 'Фамилия и имя должны быть не менее 2 символов');
                return;
            }

            // Add +7 prefix if not present
            if (!phone.startsWith('+7') && phone.length === 10) {
                phone = '+7' + phone;
            } else if (!phone.startsWith('+7')) {
                showError(registerForm, 'Введите номер в формате +7XXXXXXXXXX или 10 цифр');
                return;
            }

            if (password !== passwordConfirm) {
                showError(registerForm, 'Пароли не совпадают');
                return;
            }

            try {
                const response = await fetch('./api/auth.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: `${lastName} ${firstName} ${middleName}`.trim(),
                        email,
                        phone,
                        password,
                        terms: 'accepted'
                    })
                });

                const data = await response.json();
                console.log('Register response:', data);

                if (data.success) {
                    // После успешной регистрации выполняем вход
                    const loginResponse = await fetch('./api/auth.php?action=login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    const loginData = await loginResponse.json();
                    console.log('Auto-login response:', loginData);

                    if (loginData.success) {
                        localStorage.setItem('user', JSON.stringify(loginData.user));
                        localStorage.setItem('token', loginData.token);
                        window.location.reload();
                    }
                } else {
                    showError(registerForm, data.message || 'Ошибка регистрации');
                }
            } catch (error) {
                console.error('Register error:', error);
                showError(registerForm, 'Ошибка сервера');
            }
        });
    }
}
