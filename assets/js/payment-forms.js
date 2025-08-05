/**
 * JavaScript для обработки форм оплаты на странице balance.php
 * Отвечает за отправку форм оплаты и взаимодействие с системой подтверждения платежа
 */
document.addEventListener('DOMContentLoaded', function() {
    // Получаем формы оплаты
    const paymentForm = document.getElementById('payment-form');
    const sberpayForm = document.getElementById('sberpay-form');
    const tinkoffForm = document.getElementById('tinkoff-form');
    
    // Получаем элементы для выбора способа оплаты
    const paymentMethodRadios = document.querySelectorAll('input[name="payment_method"]');
    const savedPaymentMethods = document.querySelectorAll('.saved-payment-method');
    
    // Получаем кнопки оплаты
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const placeOrderBtnSberPay = document.getElementById('placeOrderBtnSberPay');
    const placeOrderBtnTinkoffPay = document.getElementById('placeOrderBtnTinkoffPay');
    
    // Обработчик выбора способа оплаты
    if (paymentMethodRadios.length > 0) {
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Скрываем все формы оплаты
                hideAllPaymentForms();
                
                // Показываем выбранную форму оплаты
                const selectedMethod = this.value;
                showPaymentForm(selectedMethod);
            });
        });
    }
    
    // Обработчик выбора сохраненного способа оплаты
    if (savedPaymentMethods.length > 0) {
        savedPaymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                // Снимаем выделение со всех способов оплаты
                savedPaymentMethods.forEach(m => m.classList.remove('selected'));
                
                // Выделяем выбранный способ оплаты
                this.classList.add('selected');
                
                // Активируем кнопку оплаты
                if (placeOrderBtn) {
                    placeOrderBtn.disabled = false;
                }
            });
        });
    }
    
    // Обработчик отправки формы оплаты картой
    if (paymentForm) {
        console.log('Форма оплаты картой найдена, добавляем обработчик события');
        
        // Добавляем обработчик нажатия на кнопку Оплатить
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Кнопка Оплатить нажата');
                
                // Проверяем валидность формы
                if (!paymentForm.checkValidity()) {
                    // Если форма невалидна, показываем стандартные сообщения об ошибках
                    console.log('Форма невалидна');
                    paymentForm.reportValidity();
                    return;
                }
                
                console.log('Форма валидна, собираем данные');
                
                // Собираем данные формы
                const cardNumber = document.getElementById('cardNumber').value;
                const cardExpiry = document.getElementById('cardExpiry').value;
                const cardCvv = document.getElementById('cardCvv').value;
                const phoneNumber = document.getElementById('phoneNumber').value;
                const saveCard = document.getElementById('saveCard').checked;
                const amount = document.querySelector('input[name="amount"]').value;
                
                const paymentData = {
                    payment_method: 'card', // Явно указываем метод оплаты
                    amount: amount,
                    phone_number: phoneNumber,
                    card_number: cardNumber,
                    card_expiry: cardExpiry,
                    card_cvv: cardCvv,
                    save_card: saveCard
                };
                
                console.log('Отправляем данные для получения кода подтверждения:', paymentData);
                
                // Отправляем запрос на отправку кода подтверждения
                sendVerificationCode(paymentData);
            });
        } else {
            console.error('Кнопка Оплатить не найдена');
        }
        
        // Также сохраняем обработчик отправки формы
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Форма оплаты картой отправлена');
            
            // Проверяем валидность формы
            if (!paymentForm.checkValidity()) {
                // Если форма невалидна, показываем стандартные сообщения об ошибках
                paymentForm.reportValidity();
                return;
            }
            
            // Собираем данные формы
            const formData = new FormData(paymentForm);
            const paymentData = {
                payment_method: 'card', // Явно указываем метод оплаты
                amount: formData.get('amount'),
                phone_number: formData.get('phone_number'),
                card_number: formData.get('card_number'),
                card_expiry: formData.get('card_expiry'),
                card_cvv: formData.get('card_cvv'),
                save_card: formData.get('save_card') === 'on'
            };
            
            // Отправляем запрос на отправку кода подтверждения
            sendVerificationCode(paymentData);
        });
    } else {
        console.error('Форма оплаты картой не найдена');
    }
    
    // Обработчик отправки формы оплаты через СберПей
    if (sberpayForm) {
        sberpayForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем валидность формы
            if (!sberpayForm.checkValidity()) {
                // Если форма невалидна, показываем стандартные сообщения об ошибках
                sberpayForm.reportValidity();
                return;
            }
            
            // Собираем данные формы
            const formData = new FormData(sberpayForm);
            const paymentData = {
                payment_method: 'sberpay', // Явно указываем метод оплаты
                amount: formData.get('amount'),
                phone_number: formData.get('phone_number')
            };
            
            // Отправляем запрос на отправку кода подтверждения
            sendVerificationCode(paymentData);
        });
    }
    
    // Обработчик отправки формы оплаты через Tinkoff Pay
    if (tinkoffForm) {
        tinkoffForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем валидность формы
            if (!tinkoffForm.checkValidity()) {
                // Если форма невалидна, показываем стандартные сообщения об ошибках
                tinkoffForm.reportValidity();
                return;
            }
            
            // Собираем данные формы
            const formData = new FormData(tinkoffForm);
            const paymentData = {
                payment_method: 'tinkoff', // Явно указываем метод оплаты
                amount: formData.get('amount'),
                phone_number: formData.get('phone_number'),
                save_payment: formData.get('save_payment') === 'on'
            };
            
            // Отправляем запрос на отправку кода подтверждения
            sendVerificationCode(paymentData);
        });
    }
    
    // Функция для скрытия всех форм оплаты
    function hideAllPaymentForms() {
        const paymentForms = document.querySelectorAll('.payment-form');
        paymentForms.forEach(form => {
            form.style.display = 'none';
        });
    }
    
    // Функция для показа выбранной формы оплаты
    function showPaymentForm(method) {
        switch (method) {
            case 'card':
                if (document.getElementById('bankCardForm')) {
                    document.getElementById('bankCardForm').style.display = 'block';
                }
                break;
            case 'sberpay':
                if (document.getElementById('sberPayForm')) {
                    document.getElementById('sberPayForm').style.display = 'block';
                }
                break;
            case 'tinkoff':
                if (document.getElementById('tinkoffPayForm')) {
                    document.getElementById('tinkoffPayForm').style.display = 'block';
                }
                break;
            case 'yoomoney':
                if (document.getElementById('yooMoneyForm')) {
                    document.getElementById('yooMoneyForm').style.display = 'block';
                }
                break;
        }
    }
    
    // Глобальный счетчик попыток ввода кода
    let verificationAttempts = 0;
    const MAX_VERIFICATION_ATTEMPTS = 3;
    
    // Функция для отправки кода подтверждения
    function sendVerificationCode(data) {
        // Сбрасываем счетчик попыток при отправке нового кода
        verificationAttempts = 0;
        
        // Показываем индикатор загрузки
        showLoading();
        
        // Логируем данные платежа для отладки
        console.log('Отправка запроса на получение кода подтверждения:', data);
        
        // Отправляем запрос на сервер
        fetch('api/payment/send_verification_code.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            // Скрываем индикатор загрузки
            hideLoading();
            
            console.log('Ответ сервера:', result);
            
            if (result.success) {
                // Сохраняем данные платежа в локальном хранилище
                localStorage.setItem('paymentData', JSON.stringify(data));
                
                // Показываем модальное окно для ввода кода
                const verificationModal = document.getElementById('verification-modal');
                if (verificationModal) {
                    // Показываем модальное окно
                    verificationModal.style.display = 'block';
                    
                    // Фокусируемся на поле ввода кода
                    const verificationCodeInput = document.getElementById('verification-code');
                    if (verificationCodeInput) {
                        // Очищаем поле ввода
                        verificationCodeInput.value = '';
                        
                        // Если в тестовом режиме и код отправлен в ответе
                        if (result.test_code) {
                            verificationCodeInput.value = result.test_code;
                        }
                        
                        // Фокусируемся на поле ввода
                        setTimeout(() => {
                            verificationCodeInput.focus();
                        }, 300);
                    }
                    
                    // Запускаем таймер
                    startVerificationTimer(result.expires_in || 300);
                    
                    // Показываем уведомление
                    showToast('success', 'Код подтверждения отправлен на ваш телефон');
                } else {
                    console.error('Модальное окно верификации не найдено');
                    showToast('error', 'Ошибка при отображении окна подтверждения');
                }
            } else {
                // Показываем сообщение об ошибке
                showToast('error', result.message || 'Ошибка при отправке кода подтверждения');
            }
        })
        .catch(error => {
            // Скрываем индикатор загрузки
            hideLoading();
            
            // Логируем ошибку
            console.error('Ошибка при отправке кода подтверждения:', error);
            
            // Показываем сообщение об ошибке
            showToast('error', 'Произошла ошибка при отправке кода подтверждения');
        });
    }
    
    // Функция для запуска таймера верификации
    function startVerificationTimer(duration) {
        const timerElement = document.getElementById('verification-timer');
        if (!timerElement) return;
        
        let timeLeft = duration;
        updateTimerDisplay(timerElement, timeLeft);
        
        // Очищаем предыдущий таймер
        if (window.verificationTimerInterval) {
            clearInterval(window.verificationTimerInterval);
        }
        
        // Запускаем новый таймер
        window.verificationTimerInterval = setInterval(function() {
            timeLeft--;
            updateTimerDisplay(timerElement, timeLeft);
            
            if (timeLeft <= 0) {
                // Останавливаем таймер
                clearInterval(window.verificationTimerInterval);
                
                // Показываем сообщение об истечении срока действия кода
                const errorMessage = document.getElementById('verification-error');
                if (errorMessage) {
                    errorMessage.textContent = 'Истек срок действия кода подтверждения';
                    errorMessage.style.display = 'block';
                }
                
                // Активируем кнопку повторной отправки кода
                const resendCodeBtn = document.getElementById('resend-code-btn');
                if (resendCodeBtn) {
                    resendCodeBtn.disabled = false;
                }
            }
        }, 1000);
    }
    
    // Функция для обновления отображения таймера
    function updateTimerDisplay(timerElement, timeLeft) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Обработчик формы верификации
    const verificationForm = document.getElementById('verification-form');
    if (verificationForm) {
        verificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем, не превышено ли количество попыток
            if (verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
                const errorMessage = document.getElementById('verification-error');
                if (errorMessage) {
                    errorMessage.textContent = 'Превышено количество попыток. Выберите другой способ оплаты или попробуйте позже.';
                    errorMessage.style.display = 'block';
                }
                
                // Скрываем кнопку подтверждения
                const submitButton = verificationForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.style.display = 'none';
                }
                
                // Показываем кнопку закрытия модального окна
                const closeButton = document.querySelector('#verification-modal .close');
                if (closeButton) {
                    closeButton.style.display = 'block';
                }
                
                // Добавляем кнопку для выбора другого способа оплаты
                const actionsContainer = verificationForm.querySelector('.form-actions');
                if (actionsContainer) {
                    // Удаляем существующие кнопки
                    actionsContainer.innerHTML = '';
                    
                    // Создаем кнопку для выбора другого способа оплаты
                    const changePaymentMethodBtn = document.createElement('button');
                    changePaymentMethodBtn.type = 'button';
                    changePaymentMethodBtn.className = 'btn btn-primary';
                    changePaymentMethodBtn.textContent = 'Выбрать другой способ оплаты';
                    
                    // Добавляем обработчик нажатия на кнопку
                    changePaymentMethodBtn.addEventListener('click', function() {
                        // Закрываем модальное окно
                        const verificationModal = document.getElementById('verification-modal');
                        if (verificationModal) {
                            verificationModal.style.display = 'none';
                        }
                        
                        // Останавливаем таймер
                        if (window.verificationTimerInterval) {
                            clearInterval(window.verificationTimerInterval);
                        }
                        
                        // Показываем сообщение о необходимости выбрать другой способ оплаты
                        showToast('info', 'Выберите другой способ оплаты');
                    });
                    
                    // Добавляем кнопку в контейнер
                    actionsContainer.appendChild(changePaymentMethodBtn);
                }
                
                return;
            }
            
            // Получаем код подтверждения
            const verificationCode = document.getElementById('verification-code').value.trim();
            
            // Проверяем, что код введен
            if (!verificationCode) {
                const errorMessage = document.getElementById('verification-error');
                if (errorMessage) {
                    errorMessage.textContent = 'Введите код подтверждения';
                    errorMessage.style.display = 'block';
                }
                return;
            }
            
            // Получаем данные платежа из локального хранилища
            const paymentData = JSON.parse(localStorage.getItem('paymentData') || '{}');
            
            // Добавляем код подтверждения к данным платежа
            paymentData.verification_code = verificationCode;
            
            // Увеличиваем счетчик попыток
            verificationAttempts++;
            
            // Отправляем запрос на обработку платежа
            processPayment(paymentData);
        });
    }
    
    // Функция для обработки платежа
    function processPayment(data) {
        // Показываем индикатор загрузки
        showLoading();
        
        // Отправляем запрос на сервер
        fetch('api/payment/process_payment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            // Скрываем индикатор загрузки
            hideLoading();
            
            if (result.success) {
                // Закрываем модальное окно подтверждения
                const verificationModal = document.getElementById('verification-modal');
                if (verificationModal) {
                    verificationModal.style.display = 'none';
                }
                
                // Останавливаем таймер
                if (window.verificationTimerInterval) {
                    clearInterval(window.verificationTimerInterval);
                }
                
                // Сбрасываем счетчик попыток
                verificationAttempts = 0;
                
                // Очищаем данные платежа из локального хранилища
                localStorage.removeItem('paymentData');
                
                // Показываем модальное окно успешной оплаты
                showSuccessModal(result);
            } else {
                // Проверяем, не превышено ли количество попыток
                if (verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
                    // Показываем сообщение об ошибке
                    const errorMessage = document.getElementById('verification-error');
                    if (errorMessage) {
                        errorMessage.textContent = 'Превышено количество попыток. Выберите другой способ оплаты или попробуйте позже.';
                        errorMessage.style.display = 'block';
                    }
                    
                    // Скрываем кнопку подтверждения
                    const submitButton = document.querySelector('#verification-form button[type="submit"]');
                    if (submitButton) {
                        submitButton.style.display = 'none';
                    }
                    
                    // Добавляем кнопку для выбора другого способа оплаты
                    const actionsContainer = document.querySelector('#verification-form .form-actions');
                    if (actionsContainer) {
                        // Удаляем существующие кнопки
                        actionsContainer.innerHTML = '';
                        
                        // Создаем кнопку для выбора другого способа оплаты
                        const changePaymentMethodBtn = document.createElement('button');
                        changePaymentMethodBtn.type = 'button';
                        changePaymentMethodBtn.className = 'btn btn-primary';
                        changePaymentMethodBtn.textContent = 'Выбрать другой способ оплаты';
                        
                        // Добавляем обработчик нажатия на кнопку
                        changePaymentMethodBtn.addEventListener('click', function() {
                            // Закрываем модальное окно
                            const verificationModal = document.getElementById('verification-modal');
                            if (verificationModal) {
                                verificationModal.style.display = 'none';
                            }
                            
                            // Останавливаем таймер
                            if (window.verificationTimerInterval) {
                                clearInterval(window.verificationTimerInterval);
                            }
                            
                            // Сбрасываем счетчик попыток
                            verificationAttempts = 0;
                            
                            // Показываем сообщение о необходимости выбрать другой способ оплаты
                            showToast('info', 'Выберите другой способ оплаты');
                        });
                        
                        // Добавляем кнопку в контейнер
                        actionsContainer.appendChild(changePaymentMethodBtn);
                    }
                } else {
                    // Показываем сообщение об ошибке
                    const errorMessage = document.getElementById('verification-error');
                    if (errorMessage) {
                        errorMessage.textContent = result.message || 'Неверный код подтверждения';
                        errorMessage.style.display = 'block';
                    }
                    
                    // Обновляем количество оставшихся попыток
                    const attemptsLeft = MAX_VERIFICATION_ATTEMPTS - verificationAttempts;
                    const attemptsLeftElement = document.getElementById('attempts-left');
                    if (attemptsLeftElement) {
                        attemptsLeftElement.textContent = `Осталось попыток: ${attemptsLeft}`;
                        attemptsLeftElement.style.display = 'block';
                    }
                    
                    // Очищаем поле ввода кода для повторного ввода
                    const verificationCodeInput = document.getElementById('verification-code');
                    if (verificationCodeInput) {
                        verificationCodeInput.value = '';
                        setTimeout(() => {
                            verificationCodeInput.focus();
                        }, 300);
                    }
                }
            }
        })
        .catch(error => {
            // Скрываем индикатор загрузки
            hideLoading();
            
            // Показываем сообщение об ошибке
            const errorMessage = document.getElementById('verification-error');
            if (errorMessage) {
                errorMessage.textContent = 'Произошла ошибка при обработке платежа';
                errorMessage.style.display = 'block';
            }
            console.error('Error:', error);
        });
    }
    
    // Функция для показа модального окна успешной оплаты
    function showSuccessModal(data) {
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            // Заполняем данные заказа
            const orderNumber = document.getElementById('order-number');
            const orderAmount = document.getElementById('order-amount');
            const orderDate = document.getElementById('order-date');
            
            if (orderNumber) orderNumber.textContent = data.transaction_id || 'N/A';
            if (orderAmount) orderAmount.textContent = `${data.amount || 0} ₽`;
            if (orderDate) orderDate.textContent = data.date || new Date().toLocaleString();
            
            // Показываем модальное окно
            successModal.style.display = 'block';
        } else {
            // Если модальное окно не найдено, показываем сообщение
            showToast('success', 'Платеж успешно обработан!');
        }
    }
    
    // Обработчик кнопки повторной отправки кода
    const resendCodeBtn = document.getElementById('resend-code-btn');
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', function() {
            // Получаем данные платежа из локального хранилища
            const paymentData = JSON.parse(localStorage.getItem('paymentData') || '{}');
            
            // Отправляем запрос на отправку кода подтверждения
            sendVerificationCode(paymentData);
        });
    }
    
    // Обработчики закрытия модальных окон
    const closeButtons = document.querySelectorAll('.modal .close');
    if (closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Получаем родительское модальное окно
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    
                    // Если это модальное окно верификации, останавливаем таймер
                    if (modal.id === 'verification-modal' && window.verificationTimerInterval) {
                        clearInterval(window.verificationTimerInterval);
                    }
                }
            });
        });
    }
    
    // Вспомогательные функции
    function showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }
    
    function hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
    
    function showToast(type, message) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Инициализация форматирования ввода
    initInputFormatting();
});

// Функция для инициализации форматирования ввода
function initInputFormatting() {
    // Форматирование номера карты (добавление пробелов после каждых 4 цифр)
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Форматирование срока действия карты (MM/YY)
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            e.target.value = value;
        });
    }
    
    // Форматирование номера телефона
    const phoneInputs = document.querySelectorAll('input[type="text"][placeholder*="+7"]');
    if (phoneInputs.length > 0) {
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    if (value[0] === '7' || value[0] === '8') {
                        value = value.substring(1);
                    }
                    
                    let formattedValue = '+7';
                    
                    if (value.length > 0) {
                        formattedValue += ' (' + value.substring(0, 3);
                    }
                    
                    if (value.length > 3) {
                        formattedValue += ') ' + value.substring(3, 6);
                    }
                    
                    if (value.length > 6) {
                        formattedValue += '-' + value.substring(6, 8);
                    }
                    
                    if (value.length > 8) {
                        formattedValue += '-' + value.substring(8, 10);
                    }
                    
                    e.target.value = formattedValue;
                }
            });
        });
    }
}
