/**
 * JavaScript для управления интерфейсом способов оплаты
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM элементы способов оплаты
    const bankCardMethod = document.getElementById('bankCardMethod');
    const walletMethod = document.getElementById('walletMethod');
    const sberPayMethod = document.getElementById('sberPayMethod');
    const tinkoffPayMethod = document.getElementById('tinkoffPayMethod');
    
    // DOM элементы форм и списков
    const savedBankCards = document.getElementById('savedBankCards');
    const savedWallets = document.getElementById('savedWallets');
    const bankCardForm = document.getElementById('bankCardForm');
    const walletForm = document.getElementById('walletForm');
    const sberPayForm = document.getElementById('sberPayForm');
    const tinkoffPayForm = document.getElementById('tinkoffPayForm');
    
    // DOM элементы кнопок
    const addNewCardBtn = document.getElementById('addNewCardBtn');
    const addNewWalletBtn = document.getElementById('addNewWalletBtn');
    
    // DOM элементы полей ввода
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvvInput = document.getElementById('cardCvv');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const walletNumberInput = document.getElementById('walletNumber');
    const walletPhoneInput = document.getElementById('walletPhone');
    const sberPayPhoneInput = document.getElementById('sberPayPhone');
    const tinkoffPayPhoneInput = document.getElementById('tinkoffPayPhone');
    
    // DOM элементы кнопок оплаты
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const placeOrderBtnWallet = document.getElementById('placeOrderBtnWallet');
    const placeOrderBtnSberPay = document.getElementById('placeOrderBtnSberPay');
    const placeOrderBtnTinkoffPay = document.getElementById('placeOrderBtnTinkoffPay');
    
    // Обработчик для активации кнопок оплаты при выборе адреса доставки
    function setupAddressSelectionHandler() {
        const selectAddressBtn = document.getElementById('selectAddressBtn');
        const selectedAddressDisplay = document.getElementById('selectedAddressDisplay');
        
        if (selectAddressBtn && selectedAddressDisplay) {
            // Проверяем, если адрес уже выбран при загрузке страницы
            if (selectedAddressDisplay.classList.contains('has-address')) {
                activatePaymentButtons();
            }
            
            // Обработчик для выбора адреса
            document.addEventListener('addressSelected', function() {
                activatePaymentButtons();
            });
            
            // Обработчик для удаления адреса
            document.addEventListener('addressRemoved', function() {
                deactivatePaymentButtons();
            });
        }
    }
    
    // Активация всех кнопок оплаты
    function activatePaymentButtons() {
        if (placeOrderBtn) placeOrderBtn.disabled = false;
        if (placeOrderBtnWallet) placeOrderBtnWallet.disabled = false;
        if (placeOrderBtnSberPay) placeOrderBtnSberPay.disabled = false;
        if (placeOrderBtnTinkoffPay) placeOrderBtnTinkoffPay.disabled = false;
    }
    
    // Деактивация всех кнопок оплаты
    function deactivatePaymentButtons() {
        if (placeOrderBtn) placeOrderBtn.disabled = true;
        if (placeOrderBtnWallet) placeOrderBtnWallet.disabled = true;
        if (placeOrderBtnSberPay) placeOrderBtnSberPay.disabled = true;
        if (placeOrderBtnTinkoffPay) placeOrderBtnTinkoffPay.disabled = true;
    }
    
    // Инициализация
    initPaymentMethodsUI();
    setupAddressSelectionHandler();
    
    /**
     * Инициализация интерфейса способов оплаты
     */
    function initPaymentMethodsUI() {
        // Скрываем все формы и списки при инициализации
        hideAllFormsAndLists();
        
        // Обработчики для выбора способа оплаты
        if (bankCardMethod) {
            bankCardMethod.addEventListener('click', function() {
                selectPaymentMethod('bank-card');
            });
        }
        
        if (walletMethod) {
            walletMethod.addEventListener('click', function() {
                selectPaymentMethod('wallet');
            });
        }
        
        if (sberPayMethod) {
            sberPayMethod.addEventListener('click', function() {
                selectPaymentMethod('sber-pay');
            });
        }
        
        if (tinkoffPayMethod) {
            tinkoffPayMethod.addEventListener('click', function() {
                selectPaymentMethod('tinkoff-pay');
            });
        }
        
        // Обработчики для кнопок добавления новых способов оплаты
        if (addNewCardBtn) {
            addNewCardBtn.addEventListener('click', function() {
                showBankCardForm();
            });
        }
        
        if (addNewWalletBtn) {
            addNewWalletBtn.addEventListener('click', function() {
                showWalletForm();
            });
        }
        
        // Загружаем сохраненные платежные методы, но не показываем их сразу
        loadSavedPaymentMethods();
        
        // Форматирование ввода
        setupInputFormatting();
    }
    
    /**
     * Выбор способа оплаты
     * @param {string} methodType - Тип способа оплаты
     */
    function selectPaymentMethod(methodType) {
        console.log('Selecting payment method:', methodType);
        
        // Проверяем, открыто ли модальное окно верификации
        const verificationModal = document.getElementById('verification-modal');
        if (verificationModal && verificationModal.style.display === 'block') {
            // Закрываем модальное окно
            verificationModal.style.display = 'none';
            
            // Останавливаем таймер
            if (window.verificationTimerInterval) {
                clearInterval(window.verificationTimerInterval);
            }
            
            // Сбрасываем счетчик попыток
            if (typeof window.verificationAttempts !== 'undefined') {
                window.verificationAttempts = 0;
            }
            
            // Показываем сообщение о смене способа оплаты
            if (typeof showToast === 'function') {
                showToast('info', 'Выбран новый способ оплаты');
            }
        }
        
        // Сбрасываем активный класс со всех способов оплаты
        const allMethods = document.querySelectorAll('.payment-method-item');
        allMethods.forEach(method => {
            method.classList.remove('active');
        });
        
        // Скрываем все формы и списки
        hideAllFormsAndLists();
        
        // Устанавливаем активный класс для выбранного способа оплаты
        switch (methodType) {
            case 'bank-card':
                if (bankCardMethod) bankCardMethod.classList.add('active');
                // Показываем сохраненные банковские карты только при выборе этого способа оплаты
                if (savedBankCards) {
                    console.log('Showing saved bank cards');
                    savedBankCards.style.display = 'block';
                }
                break;
            case 'wallet':
                if (walletMethod) walletMethod.classList.add('active');
                // Показываем сохраненные кошельки только при выборе этого способа оплаты
                if (savedWallets) {
                    console.log('Showing saved wallets');
                    savedWallets.style.display = 'block';
                }
                break;
            case 'sber-pay':
                if (sberPayMethod) sberPayMethod.classList.add('active');
                showSberPayForm();
                break;
            case 'tinkoff-pay':
                if (tinkoffPayMethod) tinkoffPayMethod.classList.add('active');
                showTinkoffPayForm();
                break;
        }
    }
    
    /**
     * Скрыть все формы и списки
     */
    function hideAllFormsAndLists() {
        if (savedBankCards) savedBankCards.style.display = 'none';
        if (savedWallets) savedWallets.style.display = 'none';
        if (bankCardForm) bankCardForm.style.display = 'none';
        if (walletForm) walletForm.style.display = 'none';
        if (sberPayForm) sberPayForm.style.display = 'none';
        if (tinkoffPayForm) tinkoffPayForm.style.display = 'none';
    }
    
    /**
     * Показать форму банковской карты
     */
    function showBankCardForm() {
        hideAllFormsAndLists();
        if (bankCardForm) bankCardForm.style.display = 'block';
        
        // Сбрасываем значения полей
        if (cardNumberInput) cardNumberInput.value = '';
        if (cardExpiryInput) cardExpiryInput.value = '';
        if (cardCvvInput) cardCvvInput.value = '';
        if (phoneNumberInput) phoneNumberInput.value = '';
        
        // Устанавливаем фокус на первое поле
        if (cardNumberInput) cardNumberInput.focus();
    }
    
    /**
     * Показать форму кошелька
     */
    function showWalletForm() {
        console.log('Showing wallet form');
        hideAllFormsAndLists();
        if (walletForm) {
            walletForm.style.display = 'block';
            if (walletNumberInput) walletNumberInput.focus();
        }
    }

    /**
     * Показать форму SberPay
     */
    function showSberPayForm() {
        console.log('Showing SberPay form');
        hideAllFormsAndLists();
        if (sberPayForm) {
            sberPayForm.style.display = 'block';
            if (sberPayPhoneInput) sberPayPhoneInput.focus();
            
            // Добавляем обработчик для кнопки оплаты
            if (placeOrderBtnSberPay) {
                // Сначала удаляем старые обработчики, чтобы избежать дублирования
                placeOrderBtnSberPay.removeEventListener('click', handleSberPayPayment);
                
                // Добавляем новый обработчик
                placeOrderBtnSberPay.addEventListener('click', handleSberPayPayment);
                
                // Активируем кнопку, если выбран адрес доставки
                const selectedAddressDisplay = document.getElementById('selectedAddressDisplay');
                if (selectedAddressDisplay && selectedAddressDisplay.classList.contains('has-address')) {
                    placeOrderBtnSberPay.disabled = false;
                }
            }
        }
    }

    /**
     * Показать форму Tinkoff Pay
     */
    function showTinkoffPayForm() {
        console.log('Showing Tinkoff Pay form');
        hideAllFormsAndLists();
        if (tinkoffPayForm) {
            tinkoffPayForm.style.display = 'block';
            if (tinkoffPayPhoneInput) tinkoffPayPhoneInput.focus();
            
            // Добавляем обработчик для кнопки оплаты
            if (placeOrderBtnTinkoffPay) {
                // Сначала удаляем старые обработчики, чтобы избежать дублирования
                placeOrderBtnTinkoffPay.removeEventListener('click', handleTinkoffPayPayment);
                
                // Добавляем новый обработчик
                placeOrderBtnTinkoffPay.addEventListener('click', handleTinkoffPayPayment);
                
                // Активируем кнопку, если выбран адрес доставки
                const selectedAddressDisplay = document.getElementById('selectedAddressDisplay');
                if (selectedAddressDisplay && selectedAddressDisplay.classList.contains('has-address')) {
                    placeOrderBtnTinkoffPay.disabled = false;
                }
            }
        }
    }
    
    /**
     * Загрузка сохраненных платежных методов
     */
    function loadSavedPaymentMethods() {
        console.log('Loading saved payment methods...');
        
        // Загружаем сохраненные методы оплаты из профиля пользователя
        fetch('api/payment_methods/get_payment_methods.php')
            .then(response => response.json())
            .then(data => {
                console.log('API response:', data);
                if (data.success) {
                    // Если есть сохраненные карты, отображаем их
                    if (data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
                        renderSavedCards(data.cards);
                    } else {
                        console.log('No saved cards found');
                    }
                    
                    // Если есть сохраненные кошельки, отображаем их
                    if (data.wallets && Array.isArray(data.wallets) && data.wallets.length > 0) {
                        renderSavedWallets(data.wallets);
                    } else {
                        console.log('No saved wallets found');
                    }
                } else {
                    console.error('Failed to load payment methods:', data.message);
                    // Используем тестовые данные для демонстрации
                    useDemoPaymentMethods();
                }
            })
            .catch(error => {
                console.error('Error loading payment methods:', error);
                // Используем тестовые данные для демонстрации
                useDemoPaymentMethods();
            });
    }
    
    /**
     * Использование демонстрационных данных для отображения
     */
    function useDemoPaymentMethods() {
        // Тестовые данные для демонстрации
        const demoCards = [
            { id: 1, type: 'visa', number: '4276 1234 5678 9012', expiry: '12/25', phone: '+7 (999) 123-45-67', bank: 'alfabank' },
            { id: 2, type: 'mastercard', number: '5536 9876 5432 1098', expiry: '10/24', phone: '+7 (999) 765-43-21', bank: 'tinkoff' },
            { id: 3, type: 'mir', number: '2202 2002 2002 2002', expiry: '08/26', phone: '+7 (999) 888-77-66', bank: 'sberbank' }
        ];
        
        const demoWallets = [
            { id: 1, type: 'yoomoney', number: 'user@example.com', phone: '+7 (999) 123-45-67' },
            { id: 2, type: 'qiwi', number: 'user@example.com', phone: '+7 (999) 765-43-21' },
            { id: 3, type: 'paypal', number: 'paypal@example.com', phone: '+7 (999) 888-77-66' }
        ];
        
        renderSavedCards(demoCards);
        renderSavedWallets(demoWallets);
    }
    
    /**
     * Рендеринг сохраненных банковских карт
     * @param {Array} cards - Массив сохраненных карт
     */
    function renderSavedCards(cards) {
        console.log('Rendering saved cards to container with ID: savedCardsList');
        const savedCardsContainer = document.getElementById('savedCardsList');
        if (!savedCardsContainer) {
            console.error('Container with ID savedCardsList not found!');
            return;
        }
        
        // Не показываем родительский контейнер автоматически
        // Он будет показан только при выборе способа оплаты "Bank Card"
        
        // Очищаем список
        savedCardsContainer.innerHTML = '';
        
        if (cards.length === 0) {
            savedCardsContainer.innerHTML = '<p class="no-saved-items">У вас нет сохраненных карт</p>';
            return;
        }
        
        cards.forEach(card => {
            // Преобразуем данные карты в нужный формат
            let cardType = card.type || '';
            let cardBank = card.bank || '';
            let displayType = cardType;
            
            // Если есть информация о банке, используем её
            if (cardBank) {
                displayType = cardBank;
            }
            
            const cardElement = document.createElement('div');
            cardElement.className = 'saved-payment-item';
            cardElement.setAttribute('data-id', card.id);
            cardElement.setAttribute('data-type', cardType);
            cardElement.setAttribute('data-number', card.number);
            cardElement.setAttribute('data-expiry', card.expiry);
            cardElement.setAttribute('data-phone', card.phone || '');
            
            // Определяем название банка/типа карты для отображения
            let cardTitle = '';
            switch(displayType.toLowerCase()) {
                case 'visa':
                    cardTitle = 'Visa';
                    break;
                case 'mastercard':
                    cardTitle = 'MasterCard';
                    break;
                case 'mir':
                    cardTitle = 'МИР';
                    break;
                case 'sberbank':
                    cardTitle = 'Сбербанк';
                    break;
                case 'tinkoff':
                    cardTitle = 'Тинькофф';
                    break;
                case 'alfabank':
                    cardTitle = 'Альфа-Банк';
                    break;
                case 'vtb':
                    cardTitle = 'ВТБ';
                    break;
                case 'gazprombank':
                    cardTitle = 'Газпромбанк';
                    break;
                default:
                    cardTitle = displayType.charAt(0).toUpperCase() + displayType.slice(1);
            }
            
            // Формируем скрытый номер карты для отображения
            const cardNumberParts = card.number.split(' ');
            let maskedNumber = '';
            
            if (cardNumberParts.length >= 4) {
                maskedNumber = cardNumberParts[0] + ' **** **** ' + cardNumberParts[3];
            } else {
                maskedNumber = card.number; // Если формат не стандартный, показываем как есть
            }
            
            // Используем логотип банка, если есть, иначе логотип типа карты
            const logoType = cardBank ? cardBank : cardType;
            
            cardElement.innerHTML = `
                <div class="saved-item-logo">
                    <img src="${getCardLogo(logoType)}" alt="${cardTitle}">
                </div>
                <div class="saved-item-details">
                    <div class="saved-item-title">${cardTitle}</div>
                    <div class="saved-item-number">${maskedNumber}</div>
                    <div class="saved-item-expiry">Срок действия: ${card.expiry}</div>
                </div>
                <div class="saved-item-actions">
                    <button class="btn-select-saved" data-id="${card.id}">Выбрать</button>
                </div>
            `;
            
            savedCardsContainer.appendChild(cardElement);
            
            // Добавляем обработчик клика на кнопку "Выбрать"
            const selectButton = cardElement.querySelector('.btn-select-saved');
            selectButton.addEventListener('click', function() {
                selectSavedCard(card.id);
            });
        });
    }
    
    /**
     * Рендеринг сохраненных кошельков
     * @param {Array} wallets - Массив сохраненных кошельков
     */
    function renderSavedWallets(wallets) {
        console.log('Rendering saved wallets to container with ID: savedWalletsList');
        const savedWalletsContainer = document.getElementById('savedWalletsList');
        if (!savedWalletsContainer) {
            console.error('Container with ID savedWalletsList not found!');
            return;
        }
        
        // Не показываем родительский контейнер автоматически
        // Он будет показан только при выборе способа оплаты "Wallet"
        
        savedWalletsContainer.innerHTML = '';
        
        if (wallets.length === 0) {
            savedWalletsContainer.innerHTML = '<p class="no-saved-items">У вас нет сохраненных кошельков</p>';
            return;
        }
        
        wallets.forEach(wallet => {
            const walletElement = document.createElement('div');
            walletElement.className = 'saved-payment-item';
            walletElement.setAttribute('data-id', wallet.id);
            walletElement.setAttribute('data-type', wallet.type);
            walletElement.setAttribute('data-number', wallet.number);
            walletElement.setAttribute('data-phone', wallet.phone);
            
            // Определяем название кошелька для отображения
            let walletTitle = '';
            switch(wallet.type.toLowerCase()) {
                case 'qiwi':
                    walletTitle = 'QIWI';
                    break;
                case 'yoomoney':
                case 'yumoney':
                    walletTitle = 'YooMoney';
                    break;
                case 'webmoney':
                    walletTitle = 'WebMoney';
                    break;
                case 'paypal':
                    walletTitle = 'PayPal';
                    break;
                default:
                    walletTitle = wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1);
            }
            
            walletElement.innerHTML = `
                <div class="saved-item-logo">
                    <img src="${getWalletLogo(wallet.type)}" alt="${wallet.type}">
                </div>
                <div class="saved-item-details">
                    <div class="saved-item-title">${walletTitle}</div>
                    <div class="saved-item-number">${wallet.number}</div>
                </div>
                <div class="saved-item-actions">
                    <button class="btn-select-saved" data-id="${wallet.id}">Выбрать</button>
                </div>
            `;
            
            savedWalletsContainer.appendChild(walletElement);
            
            // Добавляем обработчик клика на кнопку "Выбрать"
            const selectButton = walletElement.querySelector('.btn-select-saved');
            selectButton.addEventListener('click', function() {
                selectSavedWallet(wallet.id);
            });
        });
    }
    
    /**
     * Выбор сохраненной карты
     * @param {number} cardId - ID карты
     */
    function selectSavedCard(cardId) {
        // Находим элемент карты по ID
        const cardElement = document.querySelector(`.saved-payment-item[data-id="${cardId}"]`);
        if (!cardElement) return;
        
        // Сбрасываем выделение со всех карт
        const allCards = document.querySelectorAll('.saved-payment-item');
        allCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        // Выделяем выбранную карту
        cardElement.classList.add('selected');
        
        // Получаем данные карты
        const cardNumber = cardElement.getAttribute('data-number');
        const cardExpiry = cardElement.getAttribute('data-expiry');
        const cardPhone = cardElement.getAttribute('data-phone');
        
        // Выбираем способ оплаты "Банковская карта"
        selectPaymentMethod('bank-card');
        
        // Показываем форму оплаты картой
        showBankCardForm();
        
        // Заполняем поля формы
        const cardNumberInput = document.getElementById('cardNumber');
        const cardExpiryInput = document.getElementById('cardExpiry');
        const cardPhoneInput = document.getElementById('phoneNumber');
        const cardCvvInput = document.getElementById('cardCvv');
        
        if (cardNumberInput) cardNumberInput.value = cardNumber;
        if (cardExpiryInput) cardExpiryInput.value = cardExpiry;
        if (cardPhoneInput) cardPhoneInput.value = cardPhone;
        
        // Фокусируемся на поле CVV
        if (cardCvvInput) {
            cardCvvInput.value = '';
            cardCvvInput.focus();
        }
        
        // Отмечаем чекбокс "Сохранить карту" как выбранный
        const saveCardCheckbox = document.getElementById('saveCard');
        if (saveCardCheckbox) saveCardCheckbox.checked = true;
        
        // Подготавливаем кнопку отправки кода
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        if (sendCodeBtn) {
            // Фокусируемся на кнопке после заполнения CVV
            setTimeout(() => {
                sendCodeBtn.focus();
            }, 500);
        }
        
        console.log('Selected card:', {
            id: cardElement.getAttribute('data-id'),
            number: cardNumber,
            expiry: cardExpiry
        });
    }
    
    /**
     * Выбор сохраненного кошелька
     * @param {number} walletId - ID кошелька
     */
    function selectSavedWallet(walletId) {
        // Находим элемент кошелька по ID
        const walletElement = document.querySelector(`.saved-payment-item[data-id="${walletId}"]`);
        if (!walletElement) return;
        
        // Сбрасываем выделение со всех кошельков
        const allWallets = document.querySelectorAll('.saved-payment-item');
        allWallets.forEach(wallet => {
            wallet.classList.remove('selected');
        });
        
        // Выделяем выбранный кошелек
        walletElement.classList.add('selected');
        
        // Получаем данные кошелька
        const walletNumber = walletElement.getAttribute('data-number');
        const walletPhone = walletElement.getAttribute('data-phone');
        
        // Выбираем способ оплаты "Кошелек"
        selectPaymentMethod('wallet');
        
        // Показываем форму оплаты кошельком
        showWalletForm();
        
        // Заполняем поля формы
        const walletNumberInput = document.getElementById('walletNumber');
        const walletPhoneInput = document.getElementById('walletPhone');
        
        if (walletNumberInput) walletNumberInput.value = walletNumber;
        if (walletPhoneInput) walletPhoneInput.value = walletPhone || '';
        
        // Отмечаем чекбокс "Сохранить кошелек" как выбранный
        const saveWalletCheckbox = document.getElementById('saveWallet');
        if (saveWalletCheckbox) saveWalletCheckbox.checked = true;
        
        // Фокусируемся на кнопке отправки кода
        const sendWalletCodeBtn = document.getElementById('sendWalletCodeBtn');
        if (sendWalletCodeBtn) sendWalletCodeBtn.focus();
        
        console.log('Selected wallet:', {
            id: walletId,
            number: walletNumber,
            phone: walletPhone
        });
    }
    
    // Функции для редактирования и удаления были удалены, так как кнопки редактирования и удаления были удалены из интерфейса
    
    /**
     * Получение логотипа карты по типу
     * @param {string} cardType - Тип карты
     * @returns {string} - URL логотипа
     */
    function getCardLogo(cardType) {
        // Используем логотипы банков из PNG файлов
        const logos = {
            'visa': 'assets/images/payment/visa.svg',
            'mastercard': 'assets/images/payment/mastercard.svg',
            'mir': 'assets/images/payment/mir.svg',
            'sberbank': 'assets/images/banks/sberbank.png',
            'tinkoff': 'assets/images/banks/tinkoff.png',
            'alfabank': 'assets/images/banks/alfabank.png',
            'vtb': 'assets/images/banks/vtb.png',
            'gazprombank': 'assets/images/banks/gazprombank.png'
        };
        
        return logos[cardType.toLowerCase()] || 'assets/images/payment/card.svg';
    }
    
    /**
     * Получение логотипа кошелька по типу
     * @param {string} walletType - Тип кошелька
     * @returns {string} - URL логотипа
     */
    function getWalletLogo(walletType) {
        // Используем логотипы кошельков из PNG файлов
        const logos = {
            'qiwi': 'assets/images/payment/qiwi.png',
            'yoomoney': 'assets/images/payment/yoomoney.png',
            'webmoney': 'assets/images/payment/webmoney.png',
            'paypal': 'assets/images/payment/paypal.png'
        };
        
        return logos[walletType.toLowerCase()] || 'assets/images/wallets/wallet-generic.png';
    }
    
    /**
     * Маскирование номера карты
     * @param {string} number - Номер карты
     * @returns {string} - Маскированный номер карты
     */
    function maskCardNumber(number) {
        if (!number) return '';
        
        // Очищаем номер от нецифровых символов
        const cleanNumber = number.replace(/\D/g, '');
        
        // Маскируем номер карты (показываем только первые 4 и последние 4 цифры)
        if (cleanNumber.length >= 8) {
            const firstFour = cleanNumber.substring(0, 4);
            const lastFour = cleanNumber.substring(cleanNumber.length - 4);
            const maskedPart = '•'.repeat(cleanNumber.length - 8);
            
            // Форматируем номер карты (4 цифры - 4 точки - 4 точки - 4 цифры)
            return `${firstFour} ${maskedPart.substring(0, 4)} ${maskedPart.substring(4, 8)} ${lastFour}`;
        }
        
        return cleanNumber;
    }
    
    /**
     * Маскирование номера кошелька
     * @param {string} number - Номер кошелька
     * @returns {string} - Маскированный номер кошелька
     */
    function maskWalletNumber(number) {
        if (!number) return '';
        
        // Очищаем номер от нецифровых символов
        const cleanNumber = number.replace(/\D/g, '');
        
        // Маскируем номер кошелька (показываем только последние 4 цифры)
        if (cleanNumber.length >= 4) {
            const lastFour = cleanNumber.substring(cleanNumber.length - 4);
            const maskedPart = '•'.repeat(cleanNumber.length - 4);
            
            return `${maskedPart}${lastFour}`;
        }
        
        return cleanNumber;
    }
    
    /**
     * Форматирование номера карты
     * @param {string} number - Номер карты
     * @returns {string} - Форматированный номер карты
     */
    function formatCardNumber(number) {
        if (!number) return '';
        
        // Очищаем номер от нецифровых символов
        const cleanNumber = number.replace(/\D/g, '');
        
        // Форматируем номер карты (группы по 4 цифры)
        let formattedNumber = '';
        for (let i = 0; i < cleanNumber.length; i += 4) {
            formattedNumber += cleanNumber.substring(i, i + 4) + ' ';
        }
        
        return formattedNumber.trim();
    }
    
    /**
     * Обработчик оплаты через SberPay
     */
    function handleSberPayPayment() {
        console.log('Processing SberPay payment');
        
        // Получаем значение номера телефона
        const phoneNumber = sberPayPhoneInput ? sberPayPhoneInput.value : '';
        
        if (!phoneNumber || phoneNumber.length < 10) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        // Проверяем, хочет ли пользователь сохранить данные
        const saveData = document.getElementById('saveSberPay') ? document.getElementById('saveSberPay').checked : false;
        
        // Симулируем отправку запроса на сервер
        setTimeout(() => {
            // Показываем модальное окно успешного заказа
            const successModal = document.getElementById('orderSuccessModal');
            if (successModal) {
                successModal.style.display = 'block';
            }
            
            // Если пользователь хочет сохранить данные, можно добавить логику сохранения
            if (saveData) {
                console.log('Saving SberPay data for future use:', { phoneNumber });
                // Здесь был бы запрос на сервер для сохранения данных
            }
        }, 1500);
    }
    
    /**
     * Обработчик оплаты через Tinkoff Pay
     */
    function handleTinkoffPayPayment() {
        console.log('Processing Tinkoff Pay payment');
        
        // Получаем значение номера телефона
        const phoneNumber = tinkoffPayPhoneInput ? tinkoffPayPhoneInput.value : '';
        
        if (!phoneNumber || phoneNumber.length < 10) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        // Проверяем, хочет ли пользователь сохранить данные
        const saveData = document.getElementById('saveTinkoffPay') ? document.getElementById('saveTinkoffPay').checked : false;
        
        // Собираем данные для отправки на сервер
        const paymentData = {
            payment_method: 'tinkoff',
            amount: document.querySelector('input[name="amount"]')?.value || '0',
            phone_number: phoneNumber,
            save_payment: saveData
        };
        
        // Показываем индикатор загрузки
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Отправляем запрос на отправку кода подтверждения
        fetch('api/payment/send_verification_code.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        })
        .then(response => response.json())
        .then(result => {
            // Скрываем индикатор загрузки
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            
            if (result.success) {
                // Сохраняем данные платежа в локальном хранилище
                localStorage.setItem('paymentData', JSON.stringify(paymentData));
                
                // Показываем модальное окно для ввода кода
                const verificationModal = document.getElementById('verification-modal');
                if (verificationModal) {
                    verificationModal.style.display = 'block';
                    
                    // Если в тестовом режиме и код отправлен в ответе
                    if (result.test_code) {
                        const verificationCodeInput = document.getElementById('verification-code');
                        if (verificationCodeInput) {
                            verificationCodeInput.value = result.test_code;
                        }
                    }
                    
                    // Запускаем таймер
                    if (typeof startVerificationTimer === 'function') {
                        startVerificationTimer(result.expires_in || 300);
                    }
                }
            } else {
                // Показываем сообщение об ошибке
                alert(result.message || 'Произошла ошибка при отправке кода подтверждения');
            }
        })
        .catch(error => {
            // Скрываем индикатор загрузки
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            
            // Показываем сообщение об ошибке
            alert('Произошла ошибка при отправке кода подтверждения');
            console.error('Error:', error);
        });
    }
    
    /**
     * Настройка форматирования полей ввода
     */
    function setupInputFormatting() {
        // Форматирование номера карты
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 16) value = value.slice(0, 16);
                e.target.value = formatCardNumber(value);
            });
        }
        
        // Форматирование срока действия карты
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                }
                e.target.value = value;
            });
        }
        
        // Форматирование CVV
        if (cardCvvInput) {
            cardCvvInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 3) value = value.slice(0, 3);
                e.target.value = value;
            });
        }
        
        // Функция форматирования телефона
        function formatPhoneNumber(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 10);
            
            if (value.length > 0) {
                // Если первая цифра не 7, добавляем её
                if (value[0] !== '7') {
                    value = '7' + value;
                }
                
                // Форматируем номер телефона
                let formattedValue = '+7';
                if (value.length > 1) {
                    formattedValue += ' (' + value.slice(1, 4);
                }
                if (value.length > 4) {
                    formattedValue += ') ' + value.slice(4, 7);
                }
                if (value.length > 7) {
                    formattedValue += '-' + value.slice(7, 9);
                }
                if (value.length > 9) {
                    formattedValue += '-' + value.slice(9);
                }
                
                input.value = formattedValue;
            }
        }
        
        // Форматирование номера телефона для карты
        if (phoneNumberInput) {
            phoneNumberInput.addEventListener('input', function(e) {
                formatPhoneNumber(e.target);
            });
        }
        
        // Форматирование номера телефона для кошелька
        if (walletPhoneInput) {
            walletPhoneInput.addEventListener('input', function(e) {
                formatPhoneNumber(e.target);
            });
        }
        
        // Форматирование номера телефона для SberPay
        if (sberPayPhoneInput) {
            sberPayPhoneInput.addEventListener('input', function(e) {
                formatPhoneNumber(e.target);
            });
        }
        
        // Форматирование номера телефона для Tinkoff Pay
        if (tinkoffPayPhoneInput) {
            tinkoffPayPhoneInput.addEventListener('input', function(e) {
                formatPhoneNumber(e.target);
            });
        }
    }
    
    // Инициализируем интерфейс при загрузке страницы
    initPaymentMethodsUI();
});
