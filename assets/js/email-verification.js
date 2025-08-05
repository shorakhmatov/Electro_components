/**
 * JavaScript для обработки подтверждения почты
 */
document.addEventListener('DOMContentLoaded', function() {
    // Элементы для подтверждения почты
    const verifyEmailBtn = document.getElementById('verifyEmailBtn');
    const verifyEmailModal = document.getElementById('verifyEmailModal');
    const verificationEmail = document.getElementById('verificationEmail');
    const verificationCode = document.getElementById('verificationCode');
    const verificationMessage = document.getElementById('verificationMessage');
    const submitVerificationCode = document.getElementById('submitVerificationCode');
    const cancelVerification = document.getElementById('cancelVerification');
    const resendVerificationCode = document.getElementById('resendVerificationCode');
    const testVerificationCode = document.getElementById('testVerificationCode');
    const closeButtons = document.querySelectorAll('.modal .close');
    
    // Проверяем статус подтверждения почты при загрузке страницы
    checkEmailVerificationStatus();
    
    // Обработчик для кнопки подтверждения почты
    if (verifyEmailBtn) {
        verifyEmailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendVerificationCode();
        });
    }
    
    // Обработчик для кнопки отправки кода подтверждения
    if (submitVerificationCode) {
        submitVerificationCode.addEventListener('click', function() {
            const code = verificationCode.value.trim();
            
            if (!code) {
                showVerificationMessage('Пожалуйста, введите код подтверждения', 'error');
                return;
            }
            
            verifyCode(code);
        });
    }
    
    // Обработчик для кнопки отмены подтверждения
    if (cancelVerification) {
        cancelVerification.addEventListener('click', function() {
            hideModal(verifyEmailModal);
            verificationCode.value = '';
            verificationMessage.textContent = '';
            verificationMessage.className = 'verification-message';
        });
    }
    
    // Обработчик для повторной отправки кода
    if (resendVerificationCode) {
        resendVerificationCode.addEventListener('click', function(e) {
            e.preventDefault();
            sendVerificationCode();
        });
    }
    
    // Обработчики для кнопок закрытия модальных окон
    closeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            hideModal(modal);
            
            if (modal === verifyEmailModal) {
                verificationCode.value = '';
                verificationMessage.textContent = '';
                verificationMessage.className = 'verification-message';
            }
        });
    });
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
            
            if (e.target === verifyEmailModal) {
                verificationCode.value = '';
                verificationMessage.textContent = '';
                verificationMessage.className = 'verification-message';
            }
        }
    });
    
    // Функция для отправки кода подтверждения
    function sendVerificationCode() {
        console.log('Sending verification code...');
        fetch('/api/verify_email.php?action=send_code')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Показываем модальное окно с формой для ввода кода
                    showModal(verifyEmailModal);
                    
                    // Отображаем email пользователя
                    if (verificationEmail) {
                        verificationEmail.textContent = data.email;
                    }
                    
                    // Проверяем, есть ли тестовый код в ответе
                    if (data.test_code) {
                        // Показываем контейнер с тестовым кодом
                        const testCodeContainer = document.querySelector('.test-code-container');
                        if (testCodeContainer) {
                            testCodeContainer.style.display = 'block';
                        }
                        const testCode = document.getElementById('testCode');
                        if (testCode) {
                            testCode.textContent = data.test_code;
                        }
                    } else {
                        // Скрываем контейнер с тестовым кодом
                        const testCodeContainer = document.querySelector('.test-code-container');
                        if (testCodeContainer) {
                            testCodeContainer.style.display = 'none';
                        }
                    }
                    
                    // Очищаем поле ввода и сообщение
                    verificationCode.value = '';
                    verificationMessage.textContent = '';
                    verificationMessage.className = 'verification-message';
                    
                    // Фокус на поле ввода кода
                    verificationCode.focus();
                    
                    showToast('Код подтверждения отправлен на вашу почту', 'success');
                } else {
                    showToast(data.message || 'Ошибка при отправке кода подтверждения', 'error');
                }
            })
            .catch(error => {
                console.error('Error sending verification code:', error);
                showToast('Произошла ошибка при отправке кода подтверждения', 'error');
            });
    }
    
    // Функция для проверки кода подтверждения
    function verifyCode(code) {
        console.log('Verifying code:', code);
        const formData = new FormData();
        formData.append('code', code);
        
        fetch('/api/verify_email.php?action=verify_code', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showVerificationMessage('Email успешно подтвержден!', 'success');
                
                // Обновляем статус подтверждения почты на странице
                setTimeout(() => {
                    hideModal(verifyEmailModal);
                    window.location.reload(); // Перезагружаем страницу для обновления статуса
                }, 2000);
                
                showToast('Email успешно подтвержден!', 'success');
            } else {
                showVerificationMessage(data.message || 'Неверный код подтверждения', 'error');
            }
        })
        .catch(error => {
            console.error('Error verifying code:', error);
            showVerificationMessage('Произошла ошибка при проверке кода', 'error');
        });
    }
    
    // Функция для проверки статуса подтверждения почты
    function checkEmailVerificationStatus() {
        console.log('Checking email verification status...');
        fetch('/api/verify_email.php?action=check_status')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Если статус изменился, перезагружаем страницу
                    const emailStatus = document.querySelector('.email-status');
                    if (emailStatus) {
                        const currentStatus = emailStatus.classList.contains('verified');
                        if (currentStatus !== data.verified) {
                            window.location.reload();
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Error checking email verification status:', error);
            });
    }
    
    // Функция для отображения сообщения в модальном окне
    function showVerificationMessage(message, type) {
        if (verificationMessage) {
            verificationMessage.textContent = message;
            verificationMessage.className = 'verification-message ' + type;
        }
    }
    
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
    
    // Функция для отображения уведомлений
    function showToast(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
});
