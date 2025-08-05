/**
 * JavaScript для обработки модального окна подтверждения платежа
 * Отвечает за отправку кода подтверждения и обработку платежа
 */
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const paymentForm = document.getElementById('payment-form');
    const sberpayForm = document.getElementById('sberpay-form');
    const tinkoffForm = document.getElementById('tinkoff-form');
    const verificationModal = document.getElementById('verification-modal');
    const verificationForm = document.getElementById('verification-form');
    const verificationCodeInput = document.getElementById('verification-code');
    const resendCodeBtn = document.getElementById('resend-code-btn');
    const verificationTimer = document.getElementById('verification-timer');
    const successModal = document.getElementById('success-modal');
    const errorMessage = document.getElementById('verification-error');
    const attemptsLeft = document.getElementById('attempts-left');
    const closeVerificationBtn = document.querySelector('#verification-modal .close');
    
    // Переменные для таймера
    let timerInterval;
    let timeLeft = 0;
    
    // Данные платежа
    let paymentData = {};
    
    // Обработчик отправки формы оплаты картой
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем валидность формы
            if (!paymentForm.checkValidity()) {
                paymentForm.reportValidity();
                return;
            }
            
            // Собираем данные формы
            const formData = new FormData(paymentForm);
            paymentData = {
                payment_method: formData.get('payment_method'),
                amount: formData.get('amount'),
                phone_number: formData.get('phone_number')
            };
            
            // Добавляем данные карты, если выбран способ оплаты картой
            if (paymentData.payment_method === 'card') {
                paymentData.card_number = formData.get('card_number');
                paymentData.card_expiry = formData.get('card_expiry');
                paymentData.card_cvv = formData.get('card_cvv');
                paymentData.card_holder = formData.get('card_holder');
                paymentData.save_card = formData.get('save_card') === 'on';
            }
            
            // Отправляем запрос на отправку кода подтверждения
            sendVerificationCode(paymentData);
        });
    }
    
    // Обработчик отправки формы оплаты через СберПей
    if (sberpayForm) {
        sberpayForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем валидность формы
            if (!sberpayForm.checkValidity()) {
                sberpayForm.reportValidity();
                return;
            }
            
            // Собираем данные формы
            const formData = new FormData(sberpayForm);
            paymentData = {
                payment_method: formData.get('payment_method'),
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
                tinkoffForm.reportValidity();
                return;
            }
            
            // Собираем данные формы
            const formData = new FormData(tinkoffForm);
            paymentData = {
                payment_method: formData.get('payment_method'),
                amount: formData.get('amount'),
                phone_number: formData.get('phone_number'),
                save_payment: formData.get('save_payment') === 'on'
            };
            
            // Отправляем запрос на отправку кода подтверждения
            sendVerificationCode(paymentData);
        });
    }
    
    // Функция для отправки кода подтверждения
    function sendVerificationCode(data) {
        // Проверяем и дополняем данные, если необходимо
        if (!data.payment_method) {
            console.error('Не указан метод оплаты');
            showToast('error', 'Не указан метод оплаты');
            return;
        }
        
        // Сохраняем данные платежа в глобальной переменной
        paymentData = data;
        
        // Показываем индикатор загрузки
        showLoading();
        
        console.log('Отправка данных для получения кода:', data);
        
        // Отправляем запрос на сервер
        fetch('api/payment/send_verification_code.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(result => {
            // Скрываем индикатор загрузки
            hideLoading();
            
            console.log('Ответ от сервера:', result);
            
            if (result.success) {
                // Показываем модальное окно для ввода кода
                showVerificationModal(result);
                
                // Если в тестовом режиме и код отправлен в ответе
                if (result.test_code && verificationCodeInput) {
                    verificationCodeInput.value = result.test_code;
                }
            } else {
                // Показываем сообщение об ошибке
                showToast('error', result.message || 'Произошла ошибка при отправке кода');
            }
        })
        .catch(error => {
            // Скрываем индикатор загрузки
            hideLoading();
            
            // Показываем сообщение об ошибке
            showToast('error', 'Произошла ошибка при отправке кода подтверждения');
            console.error('Error:', error);
        });
    }
    
    // Функция для показа модального окна подтверждения
    function showVerificationModal(data) {
        if (verificationModal) {
            // Очищаем предыдущие данные
            verificationCodeInput.value = '';
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
            
            // Устанавливаем таймер
            timeLeft = data.expires_in || 300;
            startTimer();
            
            // Показываем модальное окно
            verificationModal.style.display = 'block';
        }
    }
    
    // Функция для запуска таймера
    function startTimer() {
        // Очищаем предыдущий таймер
        clearInterval(timerInterval);
        
        // Обновляем отображение таймера
        updateTimerDisplay();
        
        // Запускаем новый таймер
        timerInterval = setInterval(function() {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                // Останавливаем таймер
                clearInterval(timerInterval);
                
                // Показываем сообщение об истечении срока действия кода
                errorMessage.textContent = 'Истек срок действия кода подтверждения';
                errorMessage.style.display = 'block';
                
                // Активируем кнопку повторной отправки кода
                resendCodeBtn.disabled = false;
            }
        }, 1000);
    }
    
    // Функция для обновления отображения таймера
    function updateTimerDisplay() {
        if (verificationTimer) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            verificationTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Обработчик отправки формы подтверждения
    if (verificationForm) {
        verificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем код подтверждения
            const verificationCode = verificationCodeInput ? verificationCodeInput.value.trim() : '';
            
            // Проверяем, что код введен
            if (!verificationCode) {
                if (errorMessage) {
                    errorMessage.textContent = 'Введите код подтверждения';
                    errorMessage.style.display = 'block';
                } else {
                    showToast('error', 'Введите код подтверждения');
                }
                return;
            }
            
            // Проверяем, что данные платежа существуют
            if (!paymentData || Object.keys(paymentData).length === 0) {
                if (errorMessage) {
                    errorMessage.textContent = 'Отсутствуют данные платежа. Пожалуйста, попробуйте снова.';
                    errorMessage.style.display = 'block';
                } else {
                    showToast('error', 'Отсутствуют данные платежа. Пожалуйста, попробуйте снова.');
                }
                return;
            }
            
            // Добавляем код подтверждения к данным платежа
            paymentData.verification_code = verificationCode;
            
            console.log('Отправка данных для обработки платежа:', paymentData);
            
            // Отправляем запрос на обработку платежа
            processPayment(paymentData);
        });
    }
    
    // Функция для обработки платежа
    function processPayment(data) {
        // Проверяем наличие необходимых данных
        if (!data || !data.payment_method || !data.verification_code) {
            console.error('Недостаточно данных для обработки платежа:', data);
            showToast('error', 'Недостаточно данных для обработки платежа');
            return;
        }
        
        // Показываем индикатор загрузки
        showLoading();
        
        console.log('Отправка запроса на обработку платежа:', data);
        
        // Отправляем запрос на сервер
        fetch('api/payment/process_payment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(result => {
            // Скрываем индикатор загрузки
            hideLoading();
            
            console.log('Ответ от сервера по обработке платежа:', result);
            
            if (result.success) {
                // Закрываем модальное окно подтверждения
                if (verificationModal) {
                    verificationModal.style.display = 'none';
                }
                
                // Останавливаем таймер
                clearInterval(timerInterval);
                
                // Очищаем поле ввода кода
                if (verificationCodeInput) {
                    verificationCodeInput.value = '';
                }
                
                // Скрываем сообщения об ошибках
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
                
                if (attemptsLeft) {
                    attemptsLeft.style.display = 'none';
                }
                
                // Показываем модальное окно успешной оплаты
                setTimeout(() => {
                    showSuccessModal(result);
                    // Очищаем данные платежа после успешной обработки
                    paymentData = {};
                }, 300); // Небольшая задержка для плавного перехода
            } else {
                // Показываем сообщение об ошибке
                if (errorMessage) {
                    errorMessage.textContent = result.message || 'Произошла ошибка при обработке платежа';
                    errorMessage.style.display = 'block';
                } else {
                    showToast('error', result.message || 'Произошла ошибка при обработке платежа');
                }
                
                // Обновляем количество оставшихся попыток
                if (result.attempts_left !== undefined) {
                    attemptsLeft.textContent = `Осталось попыток: ${result.attempts_left}`;
                    attemptsLeft.style.display = 'block';
                }
            }
        })
        .catch(error => {
            // Скрываем индикатор загрузки
            hideLoading();
            
            // Показываем сообщение об ошибке
            errorMessage.textContent = 'Произошла ошибка при обработке платежа';
            errorMessage.style.display = 'block';
            console.error('Error:', error);
        });
    }
    
    // Функция для показа модального окна успешной оплаты
    function showSuccessModal(data) {
        if (successModal) {
            // Заполняем данные заказа
            const orderNumber = document.getElementById('order-number');
            const orderAmount = document.getElementById('order-amount');
            const orderDate = document.getElementById('order-date');
            
            // Форматируем сумму с разделителями
            let formattedAmount = data.amount || 0;
            if (typeof formattedAmount === 'number') {
                formattedAmount = formattedAmount.toLocaleString('ru-RU');
            }
            
            // Форматируем дату
            let formattedDate = data.date || new Date().toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Заполняем данные в модальном окне
            if (orderNumber) orderNumber.textContent = data.transaction_id || 'N/A';
            if (orderAmount) orderAmount.textContent = `${formattedAmount} ₽`;
            if (orderDate) orderDate.textContent = formattedDate;
            
            // Показываем модальное окно с анимацией
            successModal.style.display = 'block';
            
            // Добавляем обработчик закрытия модального окна
            const closeBtn = successModal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    successModal.style.display = 'none';
                    // Перезагружаем страницу для обновления корзины
                    window.location.reload();
                });
            }
            
            // Добавляем обработчик кнопки возврата на главную
            const homeBtn = successModal.querySelector('.btn-secondary');
            if (homeBtn) {
                homeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'index.php';
                });
            }
        } else {
            // Если модальное окно не найдено, показываем сообщение
            showToast('success', 'Заказ успешно оформлен! Спасибо за покупку!');
            // Перенаправляем на страницу заказов через 3 секунды
            setTimeout(function() {
                window.location.href = 'profile.php?tab=orders';
            }, 3000);
        }
    }
    
    // Обработчик кнопки повторной отправки кода
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', function() {
            // Отправляем запрос на отправку кода подтверждения
            sendVerificationCode(paymentData);
        });
    }
    
    // Обработчик кнопки закрытия модального окна подтверждения
    if (closeVerificationBtn) {
        closeVerificationBtn.addEventListener('click', function() {
            // Закрываем модальное окно
            verificationModal.style.display = 'none';
            
            // Останавливаем таймер
            clearInterval(timerInterval);
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
});
