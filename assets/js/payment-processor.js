/**
 * Скрипт для обработки оплаты картой
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM элементы
    const savedPaymentMethodsContainer = document.getElementById('savedPaymentMethods');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvvInput = document.getElementById('cardCvv');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const saveCardCheckbox = document.getElementById('saveCard');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const verificationCodeBlock = document.getElementById('verificationCodeBlock');
    const verificationCodeInput = document.getElementById('verificationCode');
    const resendCodeBtn = document.getElementById('resendCodeBtn');
    const payWithCardBtn = document.getElementById('payWithCardBtn');
    const paymentSuccessModal = document.getElementById('paymentSuccessModal');
    const paymentAmountElement = document.getElementById('paymentAmount');
    const closePaymentModalBtn = document.getElementById('closePaymentModalBtn');
    
    // Флаг для отслеживания выбранного метода оплаты
    let selectedPaymentMethod = null;
    
    // Инициализация
    initPaymentProcessor();
    
    /**
     * Инициализация обработчика оплаты
     */
    function initPaymentProcessor() {
        // Форматирование ввода номера карты
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{4})/g, '$1 ').trim();
                e.target.value = value;
            });
        }
        
        // Форматирование ввода срока действия карты
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
        
        // Форматирование ввода CVV
        if (cardCvvInput) {
            cardCvvInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                e.target.value = value;
            });
        }
        
        // Форматирование ввода номера телефона
        if (phoneNumberInput) {
            phoneNumberInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = '+' + value;
                    if (value.length > 1) {
                        value = value.substring(0, 2) + ' (' + value.substring(2);
                    }
                    if (value.length > 7) {
                        value = value.substring(0, 7) + ') ' + value.substring(7);
                    }
                    if (value.length > 13) {
                        value = value.substring(0, 13) + '-' + value.substring(13);
                    }
                    if (value.length > 16) {
                        value = value.substring(0, 16) + '-' + value.substring(16, 18);
                    }
                }
                e.target.value = value;
            });
        }
        
        // Обработчик для выбора сохраненного метода оплаты
        document.addEventListener('click', function(e) {
            const paymentMethod = e.target.closest('.saved-payment-method');
            if (paymentMethod) {
                selectPaymentMethod(paymentMethod);
            }
        });
        
        // Обработчик для кнопки отправки кода подтверждения
        if (sendCodeBtn) {
            sendCodeBtn.addEventListener('click', function() {
                if (validatePaymentForm()) {
                    sendVerificationCode();
                }
            });
        }
        
        // Обработчик для кнопки повторной отправки кода
        if (resendCodeBtn) {
            resendCodeBtn.addEventListener('click', function() {
                sendVerificationCode();
            });
        }
        
        // Обработчик для кнопки оплаты
        if (payWithCardBtn) {
            payWithCardBtn.addEventListener('click', function() {
                if (validateVerificationCode()) {
                    processPayment();
                }
            });
        }
        
        // Обработчик для закрытия модального окна успешной оплаты
        if (closePaymentModalBtn) {
            closePaymentModalBtn.addEventListener('click', function() {
                paymentSuccessModal.style.display = 'none';
            });
        }
    }
    
    /**
     * Выбор метода оплаты
     * @param {HTMLElement} element - Элемент метода оплаты
     */
    function selectPaymentMethod(element) {
        // Сбрасываем выделение с предыдущего выбранного метода
        const allMethods = document.querySelectorAll('.saved-payment-method');
        allMethods.forEach(method => {
            method.classList.remove('payment-method-selected');
        });
        
        // Выделяем выбранный метод
        element.classList.add('payment-method-selected');
        
        // Получаем данные из data-атрибутов
        const id = element.getAttribute('data-id');
        const type = element.getAttribute('data-type');
        const number = element.getAttribute('data-number');
        const expiry = element.getAttribute('data-expiry') || '';
        
        // Сохраняем данные выбранного метода
        selectedPaymentMethod = {
            id: id,
            type: type,
            number: number,
            expiry: expiry
        };
        
        console.log('Selected payment method:', selectedPaymentMethod);
        
        // Заполняем форму данными выбранного метода
        if (type === 'card') {
            if (cardNumberInput) cardNumberInput.value = number;
            if (cardExpiryInput) cardExpiryInput.value = expiry;
            // CVV не заполняем из соображений безопасности
            if (cardCvvInput) cardCvvInput.value = '';
        }
        
        // Фокус на поле, которое нужно заполнить
        if (type === 'card') {
            if (cardCvvInput) cardCvvInput.focus();
        } else {
            if (phoneNumberInput) phoneNumberInput.focus();
        }
    }
    
    /**
     * Валидация формы оплаты
     * @returns {boolean} - Результат валидации
     */
    function validatePaymentForm() {
        let isValid = true;
        
        // Проверка номера карты
        if (!cardNumberInput.value.trim() || cardNumberInput.value.replace(/\D/g, '').length < 16) {
            showError(cardNumberInput, 'Введите корректный номер карты');
            isValid = false;
        }
        
        // Проверка срока действия
        if (!cardExpiryInput.value.trim() || !isValidExpiry(cardExpiryInput.value)) {
            showError(cardExpiryInput, 'Введите корректный срок действия');
            isValid = false;
        }
        
        // Проверка CVV
        if (!cardCvvInput.value.trim() || cardCvvInput.value.length < 3) {
            showError(cardCvvInput, 'Введите корректный CVV');
            isValid = false;
        }
        
        // Проверка номера телефона
        if (!phoneNumberInput.value.trim() || phoneNumberInput.value.replace(/\D/g, '').length < 11) {
            showError(phoneNumberInput, 'Введите корректный номер телефона');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Валидация кода подтверждения
     * @returns {boolean} - Результат валидации
     */
    function validateVerificationCode() {
        let isValid = true;
        
        // Проверка кода подтверждения
        if (!verificationCodeInput.value.trim() || verificationCodeInput.value.length < 4) {
            showError(verificationCodeInput, 'Введите корректный код подтверждения');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Отправка кода подтверждения
     */
    function sendVerificationCode() {
        // Показываем индикатор загрузки
        sendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка кода...';
        sendCodeBtn.disabled = true;
        
        // Получаем данные для отправки кода
        const requestData = {
            phone_number: phoneNumberInput.value.replace(/\D/g, ''),
            card_number: cardNumberInput.value.replace(/\D/g, ''),
            card_expiry: cardExpiryInput.value,
            card_holder: cardHolderInput.value
        };
        
        // Отправляем запрос на сервер
        fetch('api/payment/send_verification_code.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Показываем блок для ввода кода подтверждения
                verificationCodeBlock.style.display = 'block';
                
                // Показываем уведомление
                showNotification(data.message || 'Код подтверждения отправлен на указанный номер телефона', 'success');
                
                // Фокус на поле для ввода кода
                verificationCodeInput.focus();
            } else {
                // Показываем уведомление об ошибке
                showNotification(data.message || 'Ошибка при отправке кода подтверждения', 'error');
            }
        })
        .catch(error => {
            console.error('Error sending verification code:', error);
            showNotification('Ошибка при отправке кода подтверждения', 'error');
        })
        .finally(() => {
            // Восстанавливаем кнопку
            sendCodeBtn.innerHTML = '<i class="fas fa-sms"></i> Отправить код подтверждения';
            sendCodeBtn.disabled = false;
        });
    }
    
    /**
     * Обработка оплаты
     */
    function processPayment() {
        // Проверяем валидность формы перед отправкой
        if (!validatePaymentForm()) {
            return; // Прекращаем выполнение, если форма невалидна
        }
        
        // Показываем индикатор загрузки
        payWithCardBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка оплаты...';
        payWithCardBtn.disabled = true;
        
        // Получаем данные для оплаты
        const paymentData = {
            card_number: cardNumberInput.value.replace(/\D/g, ''),
            card_expiry: cardExpiryInput.value,
            card_cvv: cardCvvInput.value,
            phone_number: phoneNumberInput.value.replace(/\D/g, ''),
            verification_code: verificationCodeInput.value,
            save_card: saveCardCheckbox.checked,
            payment_method_id: selectedPaymentMethod ? selectedPaymentMethod.id : null,
            amount: 1000 // Здесь должна быть сумма заказа
        };
        
        // Показываем уведомление о начале обработки платежа
        showNotification('Обрабатываем ваш платеж...', 'info');
        
        // Отправляем запрос на сервер
        fetch('api/payment/process_payment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        })
        .then(response => {
            if (!response.ok) {
                // Обрабатываем HTTP ошибки (4xx, 5xx)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Показываем модальное окно успешной оплаты
                paymentAmountElement.textContent = data.amount || '1000';
                paymentSuccessModal.style.display = 'block';
                
                // Показываем уведомление об успешной оплате
                showNotification('Платеж успешно обработан!', 'success');
                
                // Сбрасываем форму
                resetPaymentForm();
            } else {
                // Обрабатываем различные типы ошибок платежа
                let errorMessage = 'Ошибка при обработке платежа';
                
                if (data.error_code) {
                    switch(data.error_code) {
                        case 'invalid_card':
                            errorMessage = 'Неверный номер карты или срок действия';
                            break;
                        case 'insufficient_funds':
                            errorMessage = 'Недостаточно средств на карте';
                            break;
                        case 'card_declined':
                            errorMessage = 'Карта отклонена банком';
                            break;
                        case 'invalid_verification':
                            errorMessage = 'Неверный код подтверждения';
                            // Показываем кнопку повторной отправки кода
                            if (resendCodeBtn) {
                                resendCodeBtn.style.display = 'block';
                            }
                            break;
                        case 'expired_code':
                            errorMessage = 'Срок действия кода истек. Отправьте новый код.';
                            // Показываем кнопку повторной отправки кода
                            if (resendCodeBtn) {
                                resendCodeBtn.style.display = 'block';
                            }
                            break;
                        case 'processing_error':
                            errorMessage = 'Ошибка обработки платежа. Попробуйте позже.';
                            break;
                        default:
                            errorMessage = data.message || 'Ошибка при обработке платежа';
                    }
                } else if (data.message) {
                    errorMessage = data.message;
                }
                
                // Показываем уведомление об ошибке
                showNotification(errorMessage, 'error');
            }
        })
        .catch(error => {
            console.error('Error processing payment:', error);
            
            // Определяем тип ошибки и показываем соответствующее сообщение
            let errorMessage = 'Ошибка при обработке платежа';
            
            if (error.message && error.message.includes('HTTP error')) {
                errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
            } else if (error.name === 'TypeError') {
                errorMessage = 'Ошибка сети. Проверьте ваше интернет-соединение.';
            }
            
            showNotification(errorMessage, 'error');
        })
        .finally(() => {
            // Восстанавливаем кнопку
            payWithCardBtn.innerHTML = '<i class="fas fa-check"></i> Оплатить';
            payWithCardBtn.disabled = false;
        });
    }
    
    /**
     * Сброс формы оплаты
     */
    function resetPaymentForm() {
        // Сбрасываем значения полей
        cardNumberInput.value = '';
        cardExpiryInput.value = '';
        cardCvvInput.value = '';
        cardHolderInput.value = '';
        phoneNumberInput.value = '';
        verificationCodeInput.value = '';
        saveCardCheckbox.checked = false;
        
        // Скрываем блок для ввода кода подтверждения
        verificationCodeBlock.style.display = 'none';
        
        // Сбрасываем выбранный метод оплаты
        selectedPaymentMethod = null;
        
        // Сбрасываем выделение с выбранного метода
        const allMethods = document.querySelectorAll('.saved-payment-method');
        allMethods.forEach(method => {
            method.classList.remove('payment-method-selected');
        });
    }
    
    /**
     * Проверка валидности срока действия карты
     * @param {string} expiry - Срок действия в формате MM/YY
     * @returns {boolean} - Результат проверки
     */
    function isValidExpiry(expiry) {
        if (!expiry || expiry.length !== 5) return false;
        
        const parts = expiry.split('/');
        if (parts.length !== 2) return false;
        
        const month = parseInt(parts[0], 10);
        const year = parseInt(parts[1], 10) + 2000;
        
        if (isNaN(month) || isNaN(year)) return false;
        if (month < 1 || month > 12) return false;
        
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        
        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        
        return true;
    }
    
    /**
     * Показ ошибки валидации
     * @param {HTMLElement} input - Поле ввода
     * @param {string} message - Сообщение об ошибке
     */
    function showError(input, message) {
        // Добавляем класс ошибки
        input.classList.add('error');
        
        // Создаем элемент с сообщением об ошибке
        let errorElement = input.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentElement.appendChild(errorElement);
        }
        
        // Устанавливаем сообщение об ошибке
        errorElement.textContent = message;
        
        // Удаляем ошибку при фокусе на поле
        input.addEventListener('focus', function() {
            input.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
        }, { once: true });
    }
    
    /**
     * Показ уведомления
     * @param {string} message - Сообщение
     * @param {string} type - Тип уведомления (success, error, info)
     */
    function showNotification(message, type = 'success') {
        // Создаем контейнер для уведомлений, если его нет
        let notificationsContainer = document.querySelector('.notifications-container');
        if (!notificationsContainer) {
            notificationsContainer = document.createElement('div');
            notificationsContainer.className = 'notifications-container';
            document.body.appendChild(notificationsContainer);
        }
        
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="notification-content">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        // Добавляем уведомление в контейнер
        notificationsContainer.appendChild(notification);
        
        // Добавляем обработчик для закрытия уведомления
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Автоматически скрываем уведомление через 5 секунд
        setTimeout(() => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
});
