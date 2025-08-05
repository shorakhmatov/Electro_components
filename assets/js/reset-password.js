// JavaScript для восстановления пароля
document.addEventListener('DOMContentLoaded', function() {
    // Форма запроса сброса пароля
    const requestResetForm = document.getElementById('requestResetForm');
    if (requestResetForm) {
        requestResetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailOrPhone = document.getElementById('emailOrPhone').value.trim();
            
            if (!emailOrPhone) {
                showError('emailOrPhone', 'Пожалуйста, введите email или телефон');
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
                    // Очищаем форму
                    requestResetForm.reset();
                    
                    // Показываем сообщение об успехе
                    showNotification(data.message, 'success');
                    
                    // Заменяем форму на сообщение об успехе
                    setTimeout(() => {
                        const container = requestResetForm.parentElement;
                        container.innerHTML = `
                            <div class="success-message">
                                <h3>Проверьте вашу почту</h3>
                                <p>Мы отправили инструкции по восстановлению пароля на указанный адрес электронной почты.</p>
                                <p>Если вы не получили письмо, проверьте папку "Спам" или <a href="reset_password.php">запросите новую ссылку</a>.</p>
                                <div class="form-footer">
                                    <a href="profile.php">Вернуться на страницу входа</a>
                                </div>
                            </div>
                        `;
                    }, 1500);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Reset password request error:', error);
                showNotification('Произошла ошибка при отправке запроса', 'error');
            });
        });
    }
    
    // Форма установки нового пароля
    const setNewPasswordForm = document.getElementById('setNewPasswordForm');
    if (setNewPasswordForm) {
        setNewPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const token = document.getElementById('resetToken').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Проверяем пароль
            if (!newPassword) {
                showError('newPassword', 'Пожалуйста, введите новый пароль');
                return;
            }
            
            if (newPassword.length < 6) {
                showError('newPassword', 'Пароль должен содержать не менее 6 символов');
                return;
            }
            
            // Проверяем совпадение паролей
            if (newPassword !== confirmPassword) {
                showError('confirmPassword', 'Пароли не совпадают');
                return;
            }
            
            // Отправляем запрос на сервер
            fetch('/api/reset_password.php?action=reset_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    token: token,
                    newPassword: newPassword
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Очищаем форму
                    setNewPasswordForm.reset();
                    
                    // Показываем сообщение об успехе
                    showNotification(data.message, 'success');
                    
                    // Заменяем форму на сообщение об успехе
                    setTimeout(() => {
                        const container = setNewPasswordForm.parentElement;
                        container.innerHTML = `
                            <div class="success-message">
                                <h3>Пароль успешно изменен</h3>
                                <p>Ваш пароль был успешно изменен. Теперь вы можете войти в систему, используя новый пароль.</p>
                                <div class="form-footer">
                                    <a href="profile.php" class="btn-submit">Перейти на страницу входа</a>
                                </div>
                            </div>
                        `;
                    }, 1500);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Reset password error:', error);
                showNotification('Произошла ошибка при сбросе пароля', 'error');
            });
        });
    }
    
    // Функция для отображения ошибки в поле формы
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = field.nextElementSibling;
        
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Добавляем класс ошибки для поля
            field.classList.add('error');
            
            // Убираем ошибку при фокусе на поле
            field.addEventListener('focus', function() {
                errorElement.style.display = 'none';
                field.classList.remove('error');
            }, { once: true });
        }
    }
    
    // Функция для отображения уведомления
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
