/**
 * JavaScript для обработки модальных окон подтверждения в профиле пользователя
 */
document.addEventListener('DOMContentLoaded', function() {
    // Формы и модальные окна
    const personalDataForm = document.getElementById('personalDataForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const notificationSettingsForm = document.getElementById('notificationSettingsForm');
    
    const confirmSaveDataModal = document.getElementById('confirmSaveDataModal');
    const confirmChangePasswordModal = document.getElementById('confirmChangePasswordModal');
    const confirmSaveNotificationsModal = document.getElementById('confirmSaveNotificationsModal');
    
    // Кнопки подтверждения и отмены
    const confirmSaveDataBtn = document.getElementById('confirmSaveData');
    const cancelSaveDataBtn = document.getElementById('cancelSaveData');
    const confirmChangePasswordBtn = document.getElementById('confirmChangePassword');
    const cancelChangePasswordBtn = document.getElementById('cancelChangePassword');
    const confirmSaveNotificationsBtn = document.getElementById('confirmSaveNotifications');
    const cancelSaveNotificationsBtn = document.getElementById('cancelSaveNotifications');
    
    // Кнопки закрытия модальных окон
    const closeButtons = document.querySelectorAll('.modal .close');
    
    // Временное хранение данных форм
    let personalDataFormData = null;
    let changePasswordFormData = null;
    let notificationSettingsFormData = null;
    
    // Обработчики событий для форм
    if (personalDataForm) {
        personalDataForm.addEventListener('submit', function(e) {
            e.preventDefault();
            personalDataFormData = new FormData(personalDataForm);
            showModal(confirmSaveDataModal);
        });
    }
    
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверка совпадения паролей
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                showToast('Пароли не совпадают', 'error');
                return;
            }
            
            changePasswordFormData = new FormData(changePasswordForm);
            showModal(confirmChangePasswordModal);
        });
    }
    
    if (notificationSettingsForm) {
        notificationSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            notificationSettingsFormData = new FormData(notificationSettingsForm);
            showModal(confirmSaveNotificationsModal);
        });
    }
    
    // Обработчики событий для кнопок подтверждения
    if (confirmSaveDataBtn) {
        confirmSaveDataBtn.addEventListener('click', function() {
            hideModal(confirmSaveDataModal);
            submitPersonalDataForm();
        });
    }
    
    if (confirmChangePasswordBtn) {
        confirmChangePasswordBtn.addEventListener('click', function() {
            hideModal(confirmChangePasswordModal);
            submitChangePasswordForm();
        });
    }
    
    if (confirmSaveNotificationsBtn) {
        confirmSaveNotificationsBtn.addEventListener('click', function() {
            hideModal(confirmSaveNotificationsModal);
            submitNotificationSettingsForm();
        });
    }
    
    // Обработчики событий для кнопок отмены
    if (cancelSaveDataBtn) {
        cancelSaveDataBtn.addEventListener('click', function() {
            hideModal(confirmSaveDataModal);
            personalDataFormData = null;
        });
    }
    
    if (cancelChangePasswordBtn) {
        cancelChangePasswordBtn.addEventListener('click', function() {
            hideModal(confirmChangePasswordModal);
            changePasswordFormData = null;
        });
    }
    
    if (cancelSaveNotificationsBtn) {
        cancelSaveNotificationsBtn.addEventListener('click', function() {
            hideModal(confirmSaveNotificationsModal);
            notificationSettingsFormData = null;
        });
    }
    
    // Обработчики событий для кнопок закрытия модальных окон
    closeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            hideModal(modal);
            
            // Сбрасываем данные формы при закрытии модального окна
            if (modal === confirmSaveDataModal) {
                personalDataFormData = null;
            } else if (modal === confirmChangePasswordModal) {
                changePasswordFormData = null;
            } else if (modal === confirmSaveNotificationsModal) {
                notificationSettingsFormData = null;
            }
        });
    });
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
            
            // Сбрасываем данные формы при закрытии модального окна
            if (e.target === confirmSaveDataModal) {
                personalDataFormData = null;
            } else if (e.target === confirmChangePasswordModal) {
                changePasswordFormData = null;
            } else if (e.target === confirmSaveNotificationsModal) {
                notificationSettingsFormData = null;
            }
        }
    });
    
    // Функция для отображения модального окна
    function showModal(modal) {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку страницы
        }
    }
    
    // Функция для скрытия модального окна
    function hideModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
        }
    }
    
    // Функция для отправки формы личных данных
    function submitPersonalDataForm() {
        if (!personalDataFormData) return;
        
        fetch('api/update_profile.php', {
            method: 'POST',
            body: personalDataFormData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Личные данные успешно обновлены', 'success');
                
                // Обновляем отображаемые данные на странице
                const firstName = personalDataFormData.get('firstName');
                const lastName = personalDataFormData.get('lastName');
                const middleName = personalDataFormData.get('middleName');
                const email = personalDataFormData.get('email');
                const phone = personalDataFormData.get('phone');
                
                // Обновляем значения в информационных карточках
                updateInfoCardValue('Фамилия', lastName);
                updateInfoCardValue('Имя', firstName);
                updateInfoCardValue('Отчество', middleName || '-');
                updateInfoCardValue('Email', email);
                updateInfoCardValue('Телефон', phone);
            } else {
                showToast(data.message || 'Ошибка при обновлении данных', 'error');
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            showToast('Произошла ошибка при обновлении данных', 'error');
        });
    }
    
    // Функция для отправки формы изменения пароля
    function submitChangePasswordForm() {
        if (!changePasswordFormData) return;
        
        fetch('api/change_password.php', {
            method: 'POST',
            body: changePasswordFormData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Пароль успешно изменен', 'success');
                
                // Очищаем поля формы
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
            } else {
                showToast(data.message || 'Ошибка при изменении пароля', 'error');
            }
        })
        .catch(error => {
            console.error('Error changing password:', error);
            showToast('Произошла ошибка при изменении пароля', 'error');
        });
    }
    
    // Функция для отправки формы настроек уведомлений
    function submitNotificationSettingsForm() {
        if (!notificationSettingsFormData) return;
        
        fetch('api/update_notification_settings.php', {
            method: 'POST',
            body: notificationSettingsFormData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('Настройки уведомлений успешно обновлены', 'success');
            } else {
                showToast(data.message || 'Ошибка при обновлении настроек', 'error');
            }
        })
        .catch(error => {
            console.error('Error updating notification settings:', error);
            showToast('Произошла ошибка при обновлении настроек', 'error');
        });
    }
    
    // Функция для обновления значения в информационной карточке
    function updateInfoCardValue(label, value) {
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            const cardLabel = card.querySelector('.info-card-label');
            if (cardLabel && cardLabel.textContent === label) {
                const cardValue = card.querySelector('.info-card-value');
                if (cardValue) {
                    cardValue.textContent = value;
                }
            }
        });
    }
    
    // Функция для отображения уведомлений
    function showToast(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log('Функция showNotification не найдена, используем alert');
            alert(message);
        }
    }
});
