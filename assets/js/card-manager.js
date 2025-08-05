// JavaScript для управления банковскими картами

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация форматирования полей карты
    setupCardInputFormatting();
    
    // Обработчик добавления новой карты
    const addCardBtn = document.getElementById('addCardBtn');
    if (addCardBtn) {
        // Добавляем анимацию при наведении
        addCardBtn.addEventListener('mouseenter', function() {
            this.querySelector('i').classList.add('fa-spin');
        });
        
        addCardBtn.addEventListener('mouseleave', function() {
            this.querySelector('i').classList.remove('fa-spin');
        });
        
        // Обработчик клика
        addCardBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addNewCard();
        });
    }
});

// Настройка форматирования полей карты
function setupCardInputFormatting() {
    // Форматирование номера карты
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
            
            // Определение типа карты по первым цифрам
            updateCardType(value);
        });
    }
    
    // Форматирование срока действия
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                // Месяц (максимум 12)
                let month = value.substring(0, 2);
                if (month.length === 1) {
                    formattedValue = month;
                } else {
                    // Проверяем, что месяц не больше 12
                    if (parseInt(month) > 12) {
                        month = '12';
                    }
                    formattedValue = month;
                    
                    // Добавляем разделитель и год
                    if (value.length > 2) {
                        formattedValue += '/' + value.substring(2, 4);
                    }
                }
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Форматирование CVV
    const cardCvvInput = document.getElementById('cardCvv');
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
    
    // Форматирование имени владельца
    const cardHolderInput = document.getElementById('cardHolder');
    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.toUpperCase();
        });
    }
}

// Определение типа карты по первым цифрам
function updateCardType(cardNumber) {
    // Можно добавить логику определения типа карты (Visa, MasterCard, и т.д.)
    // и отображения соответствующей иконки
}

// Добавление новой карты
function addNewCard() {
    // Получаем значения полей
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCvv = document.getElementById('cardCvv').value;
    const cardHolder = document.getElementById('cardHolder').value;
    const saveCard = document.getElementById('saveCard').checked;
    
    // Валидация полей
    if (!validateCardFields(cardNumber, cardExpiry, cardCvv, cardHolder)) {
        return;
    }
    
    // Создаем объект карты
    const card = {
        id: 'card_' + Date.now(),
        type: 'card',
        number: maskCardNumber(cardNumber),
        expiry: cardExpiry,
        holder: cardHolder,
        last4: cardNumber.slice(-4)
    };
    
    // Если пользователь хочет сохранить карту
    if (saveCard) {
        saveCardToStorage(card);
    }
    
    // Добавляем карту в список выбранных способов оплаты
    addCardToPaymentMethods(card);
    
    // Очищаем форму
    clearCardForm();
    
    // Показываем уведомление
    showNotification('Карта успешно добавлена', 'success');
}

// Валидация полей карты
function validateCardFields(cardNumber, cardExpiry, cardCvv, cardHolder) {
    // Проверка номера карты (должен быть 16 цифр)
    if (cardNumber.length !== 16) {
        showNotification('Введите корректный номер карты', 'error');
        return false;
    }
    
    // Проверка срока действия
    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        showNotification('Введите корректный срок действия (ММ/ГГ)', 'error');
        return false;
    }
    
    // Проверка CVV (должен быть 3 цифры)
    if (cardCvv.length !== 3) {
        showNotification('Введите корректный CVV код', 'error');
        return false;
    }
    
    // Проверка имени владельца
    if (cardHolder.trim() === '') {
        showNotification('Введите имя владельца карты', 'error');
        return false;
    }
    
    return true;
}

// Маскирование номера карты
function maskCardNumber(cardNumber) {
    return '**** **** **** ' + cardNumber.slice(-4);
}

// Сохранение карты в localStorage
function saveCardToStorage(card) {
    // Получаем сохраненные карты
    const savedCards = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
    
    // Добавляем новую карту
    savedCards.push(card);
    
    // Сохраняем обновленный список
    localStorage.setItem('paymentMethods', JSON.stringify(savedCards));
}

// Добавление карты в список способов оплаты на странице
function addCardToPaymentMethods(card) {
    // Получаем контейнер для способов оплаты
    const paymentMethodsContainer = document.getElementById('savedPaymentMethods');
    if (!paymentMethodsContainer) return;
    
    // Создаем элемент для новой карты
    const cardElement = document.createElement('div');
    cardElement.className = 'saved-payment-method selected';
    cardElement.setAttribute('data-id', card.id);
    cardElement.setAttribute('data-type', 'card');
    cardElement.setAttribute('data-details', JSON.stringify(card));
    
    // Определяем иконку карты
    let cardIcon = 'fa-credit-card';
    if (card.number.startsWith('4')) {
        cardIcon = 'fa-cc-visa';
    } else if (card.number.startsWith('5')) {
        cardIcon = 'fa-cc-mastercard';
    } else if (card.number.startsWith('3')) {
        cardIcon = 'fa-cc-amex';
    }
    
    // Заполняем содержимое
    cardElement.innerHTML = `
        <div class="payment-icon">
            <i class="fab ${cardIcon}"></i>
        </div>
        <div class="payment-details">
            <div class="payment-name">Банковская карта</div>
            <div class="payment-info">${card.number}</div>
            <div class="payment-expiry">Срок действия: ${card.expiry}</div>
        </div>
        <div class="payment-actions">
            <div class="payment-selected">
                <i class="fas fa-check-circle"></i>
            </div>
        </div>
    `;
    
    // Добавляем обработчик клика
    cardElement.addEventListener('click', function() {
        // Снимаем выделение со всех способов оплаты
        const allMethods = document.querySelectorAll('.saved-payment-method');
        allMethods.forEach(method => method.classList.remove('selected'));
        
        // Выделяем выбранный способ
        this.classList.add('selected');
    });
    
    // Удаляем сообщение об отсутствии способов оплаты, если оно есть
    const noMethodsMessage = document.getElementById('noPaymentMethods');
    if (noMethodsMessage) {
        noMethodsMessage.style.display = 'none';
    }
    
    // Добавляем карту в контейнер
    paymentMethodsContainer.appendChild(cardElement);
    
    // Снимаем выделение со всех других способов оплаты
    const allMethods = document.querySelectorAll('.saved-payment-method:not([data-id="' + card.id + '"])');
    allMethods.forEach(method => method.classList.remove('selected'));
}

// Очистка формы добавления карты
function clearCardForm() {
    document.getElementById('cardNumber').value = '';
    document.getElementById('cardExpiry').value = '';
    document.getElementById('cardCvv').value = '';
    document.getElementById('cardHolder').value = '';
    document.getElementById('saveCard').checked = false;
}

// Показать уведомление
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                           type === 'error' ? 'fa-exclamation-circle' : 
                           type === 'info' ? 'fa-info-circle' : 'fa-bell'}"></i>
            <div class="message">
                <span class="text">${message}</span>
            </div>
        </div>
        <i class="fas fa-times close"></i>
        <div class="progress"></div>
    `;
    
    document.body.appendChild(toast);
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 5000);
    
    // Закрытие по клику на крестик
    toast.querySelector('.close').addEventListener('click', () => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 500);
    });
}
