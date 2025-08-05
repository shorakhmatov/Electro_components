// Обработчик регистрации и авторизации
document.addEventListener('DOMContentLoaded', function() {
    // Находим формы регистрации
    const registerForms = document.querySelectorAll('#registerForm, #modalRegisterForm');
    
    // Обрабатываем каждую форму регистрации
    registerForms.forEach(form => {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Определяем префикс для ID полей (пусто для профиля, "modal" для модального окна)
                const prefix = form.id.startsWith('modal') ? 'modal' : '';
                
                // Получаем значения полей
                const name = document.getElementById(prefix + (prefix ? 'R' : 'r') + 'egisterName').value.trim();
                const email = document.getElementById(prefix + (prefix ? 'R' : 'r') + 'egisterEmail').value.trim();
                const phone = document.getElementById(prefix + (prefix ? 'R' : 'r') + 'egisterPhone').value.trim();
                const password = document.getElementById(prefix + (prefix ? 'R' : 'r') + 'egisterPassword').value;
                const terms = document.getElementById(prefix + 'TermsAccept').checked;
                
                console.log('Form submission data:', { 
                    name, 
                    email, 
                    phone, 
                    password: '***', 
                    terms,
                    formId: form.id
                });
                
                // Проверяем все поля
                if (!name || !email || !phone || !password || !terms) {
                    showNotification('Пожалуйста, заполните все поля и примите условия', 'error');
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
                    console.log('Registration response:', data);
                    
                    if (data.success) {
                        showNotification('Регистрация успешна!', 'success');
                        
                        // После успешной регистрации выполняем вход
                        setTimeout(() => {
                            fetch('api/auth.php?action=login', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    email: email,
                                    password: password
                                })
                            })
                            .then(response => response.json())
                            .then(loginData => {
                                if (loginData.success) {
                                    // Сохраняем данные пользователя в localStorage
                                    localStorage.setItem('user', JSON.stringify(loginData.user));
                                    if (loginData.token) {
                                        localStorage.setItem('token', loginData.token);
                                    }
                                    
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
    });
    
    // Функция для отображения уведомлений
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
});
