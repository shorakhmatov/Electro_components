/**
 * Скрипт для обработки удаления аккаунта пользователя
 */
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const confirmDeleteAccountModal = document.getElementById('confirmDeleteAccountModal');
    const confirmDeleteAccount = document.getElementById('confirmDeleteAccount');
    const cancelDeleteAccount = document.getElementById('cancelDeleteAccount');
    const closeButtons = document.querySelectorAll('#confirmDeleteAccountModal .close');
    const activeOrdersWarning = document.getElementById('activeOrdersWarning');

    // Открытие модального окна подтверждения
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            // Проверяем наличие активных заказов
            checkActiveOrders();
        });
    }

    // Закрытие модального окна
    if (closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                confirmDeleteAccountModal.style.display = 'none';
            });
        });
    }

    // Отмена удаления
    if (cancelDeleteAccount) {
        cancelDeleteAccount.addEventListener('click', function() {
            confirmDeleteAccountModal.style.display = 'none';
        });
    }

    // Подтверждение удаления
    if (confirmDeleteAccount) {
        confirmDeleteAccount.addEventListener('click', function() {
            deleteAccount();
        });
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === confirmDeleteAccountModal) {
            confirmDeleteAccountModal.style.display = 'none';
        }
    });

    /**
     * Проверка наличия активных заказов
     */
    function checkActiveOrders() {
        fetch('api/delete_account.php?check_only=1')
            .then(response => response.json())
            .then(data => {
                if (data.has_active_orders) {
                    // Показываем предупреждение о наличии активных заказов
                    activeOrdersWarning.style.display = 'flex';
                    confirmDeleteAccount.disabled = true;
                    confirmDeleteAccount.style.opacity = '0.5';
                    confirmDeleteAccount.style.cursor = 'not-allowed';
                } else {
                    // Скрываем предупреждение
                    activeOrdersWarning.style.display = 'none';
                    confirmDeleteAccount.disabled = false;
                    confirmDeleteAccount.style.opacity = '1';
                    confirmDeleteAccount.style.cursor = 'pointer';
                }
                // Открываем модальное окно
                confirmDeleteAccountModal.style.display = 'block';
            })
            .catch(error => {
                console.error('Ошибка при проверке активных заказов:', error);
                showToast('Произошла ошибка при проверке активных заказов. Пожалуйста, попробуйте позже.', 'error');
            });
    }

    /**
     * Удаление аккаунта
     */
    function deleteAccount() {
        // Показываем индикатор загрузки в кнопке
        const confirmButton = document.getElementById('confirmDeleteAccount');
        if (confirmButton) {
            confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Удаление...';
            confirmButton.disabled = true;
        }
        
        fetch('api/delete_account.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            console.log('Response status:', response.status);
            // Проверяем статус ответа
            if (!response.ok) {
                throw new Error('Server response: ' + response.status + ' ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.success) {
                showToast('Ваш аккаунт был успешно удален.', 'success');
                // Перенаправляем на главную страницу после короткой задержки
                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 2000);
            } else {
                if (confirmButton) {
                    confirmButton.innerHTML = 'Подтвердить удаление';
                    confirmButton.disabled = false;
                }
                showToast(data.message || 'Произошла ошибка при удалении аккаунта.', 'error');
                confirmDeleteAccountModal.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении аккаунта:', error);
            if (confirmButton) {
                confirmButton.innerHTML = 'Подтвердить удаление';
                confirmButton.disabled = false;
            }
            showToast('Произошла ошибка при удалении аккаунта. Пожалуйста, попробуйте позже.', 'error');
            confirmDeleteAccountModal.style.display = 'none';
        });
    }

    /**
     * Отображение уведомления
     */
    function showToast(message, type = 'info') {
        // Проверяем, существует ли функция showToast в глобальной области видимости
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            // Создаем собственное уведомление, если функция не существует
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            // Показываем уведомление
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);
            
            // Скрываем и удаляем уведомление через 3 секунды
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }
    }
});
