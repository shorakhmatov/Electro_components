/**
 * Скрипт для страницы оформления заказа
 */

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const savedPaymentMethodsContainer = document.getElementById('savedPaymentMethods');
    const noPaymentMethodsContainer = document.getElementById('noPaymentMethods');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const orderSuccessModal = document.getElementById('orderSuccessModal');
    const orderNumberElement = document.getElementById('orderNumber');
    const closeModalButtons = document.querySelectorAll('.modal .close');
    
    // Форматирование ввода новой карты
    const newCardNumberInput = document.getElementById('newCardNumber');
    const newCardExpiryInput = document.getElementById('newCardExpiry');
    const newCardCvvInput = document.getElementById('newCardCvv');
    
    // Ключи для localStorage
    const BANK_CARDS_STORAGE_KEY = 'bankCards';
    const WEB_WALLETS_STORAGE_KEY = 'webWallets';
    
    // Инициализация
    init();
    
    /**
     * Инициализация страницы оформления заказа
     */
    function init() {
        // Загрузка сохраненных способов оплаты
        loadSavedPaymentMethods();
        
        // Обработчики событий для форматирования ввода карты
        setupCardInputFormatting();
        
        // Обработчик для кнопки оформления заказа
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', handlePlaceOrder);
        }
        
        // Обработчики для закрытия модальных окон
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Закрытие модальных окон при клике вне их области
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
    }
    
    /**
     * Загрузка сохраненных способов оплаты из базы данных
     */
    function loadSavedPaymentMethods() {
        // Добавляем индикатор загрузки
        if (savedPaymentMethodsContainer) {
            savedPaymentMethodsContainer.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Загрузка способов оплаты...</div>';
            savedPaymentMethodsContainer.style.display = 'block';
        }
        
        // Загружаем способы оплаты из базы данных
        fetch('api/payment_methods/get_payment_methods.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const bankCards = data.cards || [];
                    const webWallets = data.wallets || [];
                    
                    if (bankCards.length === 0 && webWallets.length === 0) {
                        // Если нет сохраненных способов оплаты
                        if (savedPaymentMethodsContainer) {
                            savedPaymentMethodsContainer.style.display = 'none';
                        }
                        if (noPaymentMethodsContainer) {
                            noPaymentMethodsContainer.style.display = 'block';
                            noPaymentMethodsContainer.innerHTML = `
                                <div class="no-payment-methods">
                                    <div class="no-methods-icon">
                                        <i class="fas fa-credit-card"></i>
                                    </div>
                                    <h3>У вас нет сохраненных способов оплаты</h3>
                                    <p>Добавьте банковскую карту или электронный кошелек в личном кабинете</p>
                                    <a href="profile.php#payment-methods" class="btn-add-payment-method">
                                        <i class="fas fa-plus"></i> Добавить способ оплаты
                                    </a>
                                </div>
                            `;
                            
                            // Добавляем обработчики событий для кнопки
                            setTimeout(() => {
                                const addButton = noPaymentMethodsContainer.querySelector('.btn-add-payment-method');
                                if (addButton) {
                                    addButton.addEventListener('mouseenter', function() {
                                        this.querySelector('i').classList.add('fa-spin');
                                    });
                                    
                                    addButton.addEventListener('mouseleave', function() {
                                        this.querySelector('i').classList.remove('fa-spin');
                                    });
                                }
                            }, 100);
                        }
                    } else {
                        // Если есть сохраненные способы оплаты
                        if (savedPaymentMethodsContainer) {
                            savedPaymentMethodsContainer.innerHTML = '';
                            
                            // Добавляем заголовок
                            const methodsTitle = document.createElement('h3');
                            methodsTitle.textContent = 'Сохраненные способы оплаты';
                            methodsTitle.className = 'payment-methods-title';
                            savedPaymentMethodsContainer.appendChild(methodsTitle);
                            
                            // Добавляем банковские карты
                            bankCards.forEach((card, index) => {
                                const cardElement = createSavedCardElement(card, index);
                                savedPaymentMethodsContainer.appendChild(cardElement);
                            });
                            
                            // Добавляем электронные кошельки
                            webWallets.forEach((wallet, index) => {
                                const walletElement = createSavedWalletElement(wallet, index);
                                savedPaymentMethodsContainer.appendChild(walletElement);
                            });
                            
                            // Добавляем разделитель
                            const divider = document.createElement('div');
                            divider.className = 'payment-divider';
                            divider.innerHTML = '<span>или</span>';
                            savedPaymentMethodsContainer.appendChild(divider);
                            
                            // Добавляем кнопку добавления нового способа оплаты
                            const addPaymentButton = document.createElement('a');
                            addPaymentButton.href = 'profile.php#payment-methods';
                            addPaymentButton.className = 'btn-add-payment-method';
                            addPaymentButton.innerHTML = '<i class="fas fa-plus"></i> Добавить новый способ оплаты';
                            
                            // Добавляем обработчики событий для кнопки
                            addPaymentButton.addEventListener('mouseenter', function() {
                                this.querySelector('i').classList.add('fa-spin');
                            });
                            
                            addPaymentButton.addEventListener('mouseleave', function() {
                                this.querySelector('i').classList.remove('fa-spin');
                            });
                            
                            savedPaymentMethodsContainer.appendChild(addPaymentButton);
                        }
                        if (noPaymentMethodsContainer) {
                            noPaymentMethodsContainer.style.display = 'none';
                        }
                    }
                } else {
                    // Если произошла ошибка при загрузке данных
                    console.error('Ошибка при загрузке способов оплаты:', data.message);
                    showNotification('Ошибка при загрузке способов оплаты', 'error');
                    
                    // Показываем сообщение об ошибке
                    if (savedPaymentMethodsContainer) {
                        savedPaymentMethodsContainer.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Не удалось загрузить способы оплаты</div>';
                    }
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке способов оплаты:', error);
                showNotification('Ошибка при загрузке способов оплаты', 'error');
                
                // Показываем сообщение об ошибке
                if (savedPaymentMethodsContainer) {
                    savedPaymentMethodsContainer.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Не удалось загрузить способы оплаты</div>';
                }
            });
    }
    
    /**
     * Получение сохраненных банковских карт из localStorage
     * @returns {Array} - Массив банковских карт
     */
    function getSavedBankCards() {
        const storedCards = localStorage.getItem(BANK_CARDS_STORAGE_KEY);
        return storedCards ? JSON.parse(storedCards) : [];
    }
    
    /**
     * Получение сохраненных электронных кошельков из localStorage
     * @returns {Array} - Массив электронных кошельков
     */
    function getSavedWebWallets() {
        const storedWallets = localStorage.getItem(WEB_WALLETS_STORAGE_KEY);
        return storedWallets ? JSON.parse(storedWallets) : [];
    }
    
    /**
     * Создание элемента сохраненной банковской карты
     * @param {Object} card - Данные карты
     * @param {number} index - Индекс карты
     * @returns {HTMLElement} - DOM-элемент карты
     */
    function createSavedCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'saved-payment-method';
        cardElement.dataset.type = 'card';
        cardElement.dataset.index = index;
        
        // Получение названия банка
        function getBankName(bankCode) {
            const banks = {
                'sberbank': 'Сбербанк',
                'tinkoff': 'Тинькофф',
                'alfabank': 'Альфа-Банк',
                'vtb': 'ВТБ',
                'gazprombank': 'Газпромбанк',
                'other': 'Другой'
            };
            
            return banks[bankCode] || 'Банковская карта';
        }
        
        // Получение пути к логотипу банка
        function getBankLogo(bankCode) {
            const logos = {
                'sberbank': 'assets/images/banks/sberbank.png',
                'tinkoff': 'assets/images/banks/tinkoff.png',
                'alfabank': 'assets/images/banks/alfabank.png',
                'vtb': 'assets/images/banks/vtb.png',
                'gazprombank': 'assets/images/banks/gazprombank.png'
            };
            
            return logos[bankCode] || 'assets/images/banks/sberbank.png';
        }
        
        let bankName = getBankName(card.bank);
        if (card.bank === 'other' && card.otherBank) {
            bankName = card.otherBank;
        }
        
        // Маскирование номера карты
        const maskedNumber = maskCardNumber(card.number);
        
        // Получаем логотип банка
        const bankLogo = getBankLogo(card.bank);
        
        cardElement.innerHTML = `
            <div class="payment-method-icon">
                <img src="${bankLogo}" alt="${bankName}" class="bank-logo">
            </div>
            <div class="payment-method-details">
                <div class="payment-method-name">${bankName}</div>
                <div class="payment-method-info">${maskedNumber}</div>
            </div>
            <input type="radio" name="payment-method" class="payment-method-radio" value="card-${index}">
        `;
        
        // Обработчик выбора способа оплаты
        cardElement.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
        
        return cardElement;
    }
    
    /**
     * Создание элемента сохраненного электронного кошелька
     * @param {Object} wallet - Данные кошелька
     * @param {number} index - Индекс кошелька
     * @returns {HTMLElement} - DOM-элемент кошелька
     */
    function createSavedWalletElement(wallet, index) {
        const walletElement = document.createElement('div');
        walletElement.className = 'saved-payment-method';
        walletElement.dataset.type = 'wallet';
        walletElement.dataset.index = index;
        
        // Получение типа кошелька
        let walletTypeName = wallet.type;
        if (wallet.type === 'other' && wallet.otherType) {
            walletTypeName = wallet.otherType;
        } else if (wallet.type === 'yoomoney') {
            walletTypeName = 'ЮМани';
        } else if (wallet.type === 'qiwi') {
            walletTypeName = 'QIWI';
        } else if (wallet.type === 'webmoney') {
            walletTypeName = 'WebMoney';
        } else if (wallet.type === 'paypal') {
            walletTypeName = 'PayPal';
        }
        
        // Маскирование номера кошелька
        const maskedNumber = maskWalletNumber(wallet.number);
        
        walletElement.innerHTML = `
            <div class="payment-method-icon">
                <i class="fas fa-wallet"></i>
            </div>
            <div class="payment-method-details">
                <div class="payment-method-name">${walletTypeName}</div>
                <div class="payment-method-info">${maskedNumber}</div>
            </div>
            <input type="radio" name="payment-method" class="payment-method-radio" value="wallet-${index}">
        `;
        
        // Обработчик выбора способа оплаты
        walletElement.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
        
        return walletElement;
    }
    
    /**
     * Выбор способа оплаты
     * @param {HTMLElement} element - Элемент способа оплаты
     */
    function selectPaymentMethod(element) {
        // Снимаем выделение со всех способов оплаты
        const allMethods = document.querySelectorAll('.saved-payment-method');
        allMethods.forEach(method => {
            method.classList.remove('selected');
            const radio = method.querySelector('.payment-method-radio');
            if (radio) {
                radio.checked = false;
            }
        });
        
        // Выделяем выбранный способ оплаты
        element.classList.add('selected');
        const radio = element.querySelector('.payment-method-radio');
        if (radio) {
            radio.checked = true;
        }
    }
    
    /**
     * Маскирование номера карты
     * @param {string} number - Номер карты
     * @returns {string} - Маскированный номер карты
     */
    function maskCardNumber(number) {
        // Удаление пробелов и других символов
        const cleanNumber = number.replace(/\D/g, '');
        
        // Проверка длины номера
        if (cleanNumber.length < 12) {
            return cleanNumber;
        }
        
        // Маскирование номера (отображение только первых 4 и последних 4 цифр)
        const firstFour = cleanNumber.substring(0, 4);
        const lastFour = cleanNumber.substring(cleanNumber.length - 4);
        
        return `${firstFour} •••• •••• ${lastFour}`;
    }
    
    /**
     * Маскирование номера кошелька
     * @param {string} number - Номер кошелька
     * @returns {string} - Маскированный номер кошелька
     */
    function maskWalletNumber(number) {
        if (!number) return '';
        
        // Если это email
        if (number.includes('@')) {
            const parts = number.split('@');
            if (parts[0].length <= 3) {
                return number; // Слишком короткий email, не маскируем
            }
            const maskedName = parts[0].substring(0, 3) + '•••';
            return `${maskedName}@${parts[1]}`;
        }
        
        // Если это номер телефона или другой идентификатор
        if (number.length <= 4) {
            return number; // Слишком короткий, не маскируем
        }
        
        return number.substring(0, 3) + '•••' + number.substring(number.length - 3);
    }
    
    /**
     * Настройка форматирования ввода данных карты
     */
    function setupCardInputFormatting() {
        // Форматирование номера карты
        if (newCardNumberInput) {
            newCardNumberInput.addEventListener('input', function(e) {
                // Удаляем все нецифровые символы
                let value = this.value.replace(/\D/g, '');
                
                // Ограничиваем длину до 16 цифр
                if (value.length > 16) {
                    value = value.slice(0, 16);
                }
                
                // Форматируем с пробелами после каждых 4 цифр
                let formattedValue = '';
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        formattedValue += ' ';
                    }
                    formattedValue += value[i];
                }
                
                // Устанавливаем отформатированное значение
                this.value = formattedValue;
            });
        }
        
        // Форматирование срока действия карты
        if (newCardExpiryInput) {
            newCardExpiryInput.addEventListener('input', function(e) {
                // Удаляем все нецифровые символы
                let value = this.value.replace(/\D/g, '');
                
                // Ограничиваем длину до 4 цифр
                if (value.length > 4) {
                    value = value.slice(0, 4);
                }
                
                // Форматируем как ММ/ГГ
                if (value.length > 2) {
                    this.value = value.slice(0, 2) + '/' + value.slice(2);
                } else {
                    this.value = value;
                }
            });
        }
        
        // Ограничение ввода CVV
        if (newCardCvvInput) {
            newCardCvvInput.addEventListener('input', function(e) {
                // Удаляем все нецифровые символы
                let value = this.value.replace(/\D/g, '');
                
                // Ограничиваем длину до 3 цифр
                if (value.length > 3) {
                    value = value.slice(0, 3);
                }
                
                this.value = value;
            });
        }
    }
    
    /**
     * Обработчик оформления заказа
     */
    function handlePlaceOrder() {
        // Проверяем, выбран ли способ оплаты
        const selectedMethod = document.querySelector('.saved-payment-method.selected');
        const newCardForm = document.getElementById('new-card-form');
        
        let paymentData = {};
        
        if (selectedMethod) {
            // Если выбран сохраненный способ оплаты
            const methodType = selectedMethod.dataset.type;
            const methodIndex = selectedMethod.dataset.index;
            
            if (methodType === 'card') {
                const cards = getSavedBankCards();
                if (cards[methodIndex]) {
                    paymentData = {
                        type: 'saved_card',
                        card_id: cards[methodIndex].id
                    };
                }
            } else if (methodType === 'wallet') {
                const wallets = getSavedWebWallets();
                if (wallets[methodIndex]) {
                    paymentData = {
                        type: 'saved_wallet',
                        wallet_id: wallets[methodIndex].id
                    };
                }
            }
        } else if (newCardForm) {
            // Если используется новая карта
            const cardNumber = document.getElementById('newCardNumber').value.trim().replace(/\s/g, '');
            const cardExpiry = document.getElementById('newCardExpiry').value.trim();
            const cardCvv = document.getElementById('newCardCvv').value.trim();
            const cardHolder = document.getElementById('newCardHolder').value.trim().toUpperCase();
            const saveCard = document.getElementById('saveNewCard').checked;
            
            // Валидация данных карты
            if (!cardNumber || cardNumber.length < 16) {
                showNotification('Введите корректный номер карты', 'error');
                return;
            }
            
            if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                showNotification('Введите срок действия в формате ММ/ГГ', 'error');
                return;
            }
            
            if (!cardCvv || cardCvv.length < 3) {
                showNotification('Введите CVV код', 'error');
                return;
            }
            
            if (!cardHolder) {
                showNotification('Введите имя владельца карты', 'error');
                return;
            }
            
            paymentData = {
                type: 'new_card',
                card_number: cardNumber,
                card_expiry: cardExpiry,
                card_cvv: cardCvv,
                card_holder: cardHolder,
                save_card: saveCard
            };
        } else {
            showNotification('Выберите способ оплаты', 'error');
            return;
        }
        
        // Отправка запроса на оформление заказа
        placeOrder(paymentData);
    }
    
    /**
     * Отправка запроса на оформление заказа
     * @param {Object} paymentData - Данные о способе оплаты
     */
    function placeOrder(paymentData) {
        // Отображаем индикатор загрузки
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
        
        // Формируем данные для отправки
        const formData = new FormData();
        formData.append('payment_data', JSON.stringify(paymentData));
        
        // Отправляем запрос
        fetch('api/place_order.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Если заказ успешно оформлен
                if (orderNumberElement) {
                    orderNumberElement.textContent = data.order_id;
                }
                
                // Если нужно сохранить новую карту
                if (paymentData.type === 'new_card' && paymentData.save_card) {
                    saveNewCard(paymentData);
                }
                
                // Показываем модальное окно успешного заказа
                if (orderSuccessModal) {
                    orderSuccessModal.style.display = 'block';
                }
                
                // Очищаем корзину
                localStorage.removeItem('cart');
            } else {
                // Если произошла ошибка
                showNotification(data.message || 'Ошибка при оформлении заказа', 'error');
                
                // Возвращаем кнопку в исходное состояние
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerHTML = 'Оплатить';
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            showNotification('Ошибка при оформлении заказа', 'error');
            
            // Возвращаем кнопку в исходное состояние
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = 'Оплатить';
        });
    }
    
    /**
     * Сохранение новой карты в localStorage
     * @param {Object} cardData - Данные карты
     */
    function saveNewCard(cardData) {
        const cards = getSavedBankCards();
        
        // Создаем объект карты
        const newCard = {
            id: Date.now(),
            number: cardData.card_number,
            expiry: cardData.card_expiry,
            holder: cardData.card_holder,
            bank: 'other',
            otherBank: 'Банк',
            isDefault: cards.length === 0 // Если это первая карта, делаем ее по умолчанию
        };
        
        // Добавляем карту в массив
        cards.push(newCard);
        
        // Сохраняем в localStorage
        localStorage.setItem(BANK_CARDS_STORAGE_KEY, JSON.stringify(cards));
    }
    
    /**
     * Показывает уведомление
     * @param {string} message - Текст уведомления
     * @param {string} type - Тип уведомления (success, error)
     */
    function showNotification(message, type = 'success') {
        // Проверка существования контейнера для уведомлений
        let notificationContainer = document.getElementById('notification-container');
        
        // Если контейнер не существует, создаем его
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Создание элемента уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Добавление уведомления в контейнер
        notificationContainer.appendChild(notification);
        
        // Удаление уведомления через 3 секунды
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
});
