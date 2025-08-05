/**
 * Скрипт для управления платежными методами (банковские карты и электронные кошельки)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentTabContents = document.querySelectorAll('.payment-tab-content');
    
    // Модальные окна
    const addBankCardBtn = document.getElementById('addBankCard');
    const addWebWalletBtn = document.getElementById('addWebWallet');
    const addBankCardModal = document.getElementById('addBankCardModal');
    const addWebWalletModal = document.getElementById('addWebWalletModal');
    const closeButtons = document.querySelectorAll('.modal .close');
    
    // Формы
    const addBankCardForm = document.getElementById('addBankCardForm');
    const addWebWalletForm = document.getElementById('addWebWalletForm');
    
    // Поля выбора банка и типа кошелька
    const cardBankSelect = document.getElementById('cardBank');
    const walletTypeSelect = document.getElementById('walletType');
    const otherBankGroup = document.getElementById('otherBankGroup');
    const otherWalletGroup = document.getElementById('otherWalletGroup');
    
    // Локальное хранилище для сохранения данных
    const BANK_CARDS_STORAGE_KEY = 'bankCards';
    const WEB_WALLETS_STORAGE_KEY = 'webWallets';
    
    // Массивы для хранения данных о картах и кошельках
    let bankCards = [];
    let webWallets = [];
    
    // Инициализация
    init();
    
    /**
     * Получение названия банка по его коду
     * @param {string} bankCode - Код банка
     * @returns {string} - Название банка
     */
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
    
    /**
     * Получение названия типа кошелька по его коду
     * @param {string} walletType - Код типа кошелька
     * @returns {string} - Название типа кошелька
     */
    function getWalletTypeName(walletType) {
        const walletTypes = {
            'yoomoney': 'ЮMoney',
            'qiwi': 'QIWI',
            'webmoney': 'WebMoney',
            'paypal': 'PayPal',
            'other': 'Другой'
        };
        
        return walletTypes[walletType] || 'Электронный кошелек';
    }
    
    /**
     * Получение пути к логотипу банка
     * @param {string} bankCode - Код банка
     * @returns {string} - Путь к логотипу банка
     */
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
    
    /**
     * Получение пути к логотипу кошелька
     * @param {string} walletType - Тип кошелька
     * @returns {string} - Путь к логотипу
     */
    function getWalletLogo(walletType) {
        const logos = {
            'yoomoney': 'assets/images/payment/yoomoney.png',
            'qiwi': 'assets/images/payment/qiwi.png',
            'webmoney': 'assets/images/payment/webmoney.png',
            'paypal': 'assets/images/payment/paypal.png',
            'applepay': 'assets/images/payment/applepay.png',
            'googlepay': 'assets/images/payment/googlepay.png',
            'alipay': 'assets/images/payment/alipay.png',
            'wechatpay': 'assets/images/payment/wechatpay.png',
            'unionpay': 'assets/images/payment/unionpay.png'
        };
        
        return logos[walletType] || 'assets/images/payment/wallet-generic.png';
    }
    
    /**
     * Инициализация скрипта
     */
    function init() {
        // Загрузка сохраненных данных
        loadBankCards();
        loadWebWallets();
        
        // Отображение сохраненных карт и кошельков
        renderBankCards();
        renderWebWallets();
        
        // Обработчики событий для вкладок
        paymentTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Активация вкладки
                paymentTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Отображение содержимого вкладки
                paymentTabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
        
        // Обработчики для модальных окон
        if (addBankCardBtn) {
            addBankCardBtn.addEventListener('click', function() {
                addBankCardModal.style.display = 'block';
            });
        }
        
        if (addWebWalletBtn) {
            addWebWalletBtn.addEventListener('click', function() {
                addWebWalletModal.style.display = 'block';
            });
        }
        
        // Закрытие модальных окон
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.style.display = 'none';
            });
        });
        
        // Закрытие модальных окон при клике вне их области
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
        
        // Обработчики для полей выбора банка и типа кошелька
        if (cardBankSelect) {
            cardBankSelect.addEventListener('change', function() {
                if (this.value === 'other') {
                    otherBankGroup.style.display = 'block';
                } else {
                    otherBankGroup.style.display = 'none';
                }
            });
        }
        
        // Обработчик для автоматического форматирования номера карты
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
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
        
        // Обработчик для форматирования срока действия карты
        const cardExpiryInput = document.getElementById('cardExpiry');
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', function(e) {
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
        
        if (walletTypeSelect) {
            walletTypeSelect.addEventListener('change', function() {
                if (this.value === 'other') {
                    otherWalletGroup.style.display = 'block';
                } else {
                    otherWalletGroup.style.display = 'none';
                }
            });
        }
        
        // Обработчики отправки форм
        if (addBankCardForm) {
            addBankCardForm.addEventListener('submit', handleAddBankCard);
        }
        
        if (addWebWalletForm) {
            addWebWalletForm.addEventListener('submit', handleAddWebWallet);
        }
    }
    
    /**
     * Загрузка банковских карт из базы данных
     */
    function loadBankCards() {
        // Сначала проверяем, есть ли карты в localStorage для обратной совместимости
        const storedCards = localStorage.getItem(BANK_CARDS_STORAGE_KEY);
        if (storedCards) {
            bankCards = JSON.parse(storedCards);
        }
        
        // Загружаем карты из базы данных
        fetch('api/payment_methods/get_cards.php')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.cards) {
                    bankCards = data.cards;
                    renderBankCards();
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке карт:', error);
            });
    }
    
    /**
     * Загрузка электронных кошельков из базы данных
     */
    function loadWebWallets() {
        // Сначала проверяем, есть ли кошельки в localStorage для обратной совместимости
        const storedWallets = localStorage.getItem(WEB_WALLETS_STORAGE_KEY);
        if (storedWallets) {
            webWallets = JSON.parse(storedWallets);
        }
        
        // Загружаем кошельки из базы данных
        fetch('api/payment_methods/get_wallets.php')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.wallets) {
                    webWallets = data.wallets;
                    renderWebWallets();
                }
            })
            .catch(error => {
                console.error('Ошибка при загрузке кошельков:', error);
            });
    }
    
    /**
     * Сохранение банковских карт в базу данных
     */
    function saveBankCards() {
        // Сохраняем в localStorage для обратной совместимости
        localStorage.setItem(BANK_CARDS_STORAGE_KEY, JSON.stringify(bankCards));
        
        // Сохранение в базу данных происходит при добавлении/редактировании/удалении карты
    }
    
    /**
     * Сохранение электронных кошельков в базу данных
     */
    function saveWebWallets() {
        // Сохраняем в localStorage для обратной совместимости
        localStorage.setItem(WEB_WALLETS_STORAGE_KEY, JSON.stringify(webWallets));
        
        // Сохранение в базу данных происходит при добавлении/редактировании/удалении кошелька
    }
    
    /**
     * Отображение банковских карт
     */
    function renderBankCards() {
        const bankCardsList = document.getElementById('bankCardsList');
        if (!bankCardsList) return;
        
        // Очистка списка, оставляя только кнопку добавления
        const addCardButton = document.getElementById('addBankCard');
        bankCardsList.innerHTML = '';
        bankCardsList.appendChild(addCardButton);
        
        // Отображение карт
        bankCards.forEach((card, index) => {
            const cardElement = createBankCardElement(card, index);
            bankCardsList.insertBefore(cardElement, addCardButton);
        });
    }
    
    /**
     * Отображение электронных кошельков
     */
    function renderWebWallets() {
        const webWalletsList = document.getElementById('webWalletsList');
        if (!webWalletsList) return;
        
        // Очистка списка, оставляя только кнопку добавления
        const addWalletButton = document.getElementById('addWebWallet');
        webWalletsList.innerHTML = '';
        webWalletsList.appendChild(addWalletButton);
        
        // Отображение кошельков
        webWallets.forEach((wallet, index) => {
            const walletElement = createWebWalletElement(wallet, index);
            webWalletsList.insertBefore(walletElement, addWalletButton);
        });
    }
    
    /**
     * Создание элемента банковской карты
     * @param {Object} card - Данные карты
     * @param {number} index - Индекс карты в массиве
     * @returns {HTMLElement} - DOM-элемент карты
     */
    function createBankCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'payment-card';
        if (card.isDefault) {
            cardElement.classList.add('default');
        }
        
        // Получение названия банка и логотипа
        const bankName = card.bankName || getBankName(card.bank);
        const bankLogo = getBankLogo(card.bank);
        
        // Маскирование номера карты
        const maskedNumber = maskCardNumber(card.number);
        
        // Создание содержимого карты
        cardElement.innerHTML = `
            <div class="payment-card-header">
                <div class="payment-card-bank">${bankName}</div>
                <img src="${bankLogo}" alt="${bankName}" class="payment-card-logo">
            </div>
            <div class="payment-card-number">${maskedNumber}</div>
            <div class="payment-card-details">
                <div class="payment-card-holder">${card.holder}</div>
                <div class="payment-card-actions">
                    <button class="payment-card-edit" data-index="${index}">Изменить</button>
                    <button class="payment-card-delete" data-index="${index}">Удалить</button>
                </div>
                <div class="payment-card-expiry">${card.expiry}</div>
            </div>
        `;
        
        // Обработчики событий для кнопок
        const editButton = cardElement.querySelector('.payment-card-edit');
        const deleteButton = cardElement.querySelector('.payment-card-delete');
        
        editButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            editBankCard(index);
        });
        
        deleteButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            deleteBankCard(index);
        });
        
        return cardElement;
    }
    
    /**
     * Создание элемента электронного кошелька
     * @param {Object} wallet - Данные кошелька
     * @param {number} index - Индекс кошелька в массиве
     * @returns {HTMLElement} - DOM-элемент кошелька
     */
    function createWebWalletElement(wallet, index) {
        const walletElement = document.createElement('div');
        walletElement.className = 'payment-wallet';
        if (wallet.isDefault) {
            walletElement.classList.add('default');
        }
        
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
        
        // Создание содержимого кошелька
        walletElement.innerHTML = `
            <div class="payment-wallet-header">
                <div class="payment-wallet-type">${walletTypeName}</div>
                <img src="${getWalletLogo(wallet.type)}" alt="${walletTypeName}" class="payment-wallet-logo">
            </div>
            <div class="payment-wallet-number">${wallet.number}</div>
            <div class="payment-wallet-actions">
                <button class="payment-wallet-edit" data-index="${index}">Изменить</button>
                <button class="payment-wallet-delete" data-index="${index}">Удалить</button>
            </div>
        `;
        
        // Обработчики событий для кнопок
        const editButton = walletElement.querySelector('.payment-wallet-edit');
        const deleteButton = walletElement.querySelector('.payment-wallet-delete');
        
        editButton.addEventListener('click', function() {
            editWebWallet(index);
        });
        
        deleteButton.addEventListener('click', function() {
            deleteWebWallet(index);
        });
        
        return walletElement;
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
        const middleStars = '•'.repeat(cleanNumber.length - 8);
        
        // Форматирование номера с пробелами
        return `${firstFour} ${middleStars.substring(0, 4)} ${middleStars.substring(4, 8)} ${lastFour}`;
    }
    
    /**
     * Обработчик добавления банковской карты
     * @param {Event} event - Событие отправки формы
     */
    function handleAddBankCard(event) {
        event.preventDefault();
        
        // Получение данных формы
        const cardNumberInput = document.getElementById('cardNumber');
        const cardExpiryInput = document.getElementById('cardExpiry');
        const cardHolderInput = document.getElementById('cardHolder');
        const cardBankSelect = document.getElementById('cardBank');
        const otherBankInput = document.getElementById('otherBank');
        const isDefaultCheckbox = document.getElementById('defaultCard');
        
        // Получение значений
        const cardNumber = cardNumberInput.value.trim();
        const cardExpiry = cardExpiryInput.value.trim();
        const cardHolder = cardHolderInput.value.trim().toUpperCase();
        const cardBank = cardBankSelect.value;
        const otherBank = otherBankInput ? otherBankInput.value.trim() : '';
        const isDefault = isDefaultCheckbox.checked;
        
        // Очистка предыдущих ошибок
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(el => el.remove());
        
        // Сброс стилей ошибок
        [cardNumberInput, cardExpiryInput, cardHolderInput, cardBankSelect, otherBankInput].forEach(input => {
            if (input) input.classList.remove('input-error');
        });
        
        // Проверка номера карты
        const cleanCardNumber = cardNumber.replace(/\D/g, '');
        if (!cleanCardNumber || cleanCardNumber.length < 16) {
            showInputError(cardNumberInput, 'Введите корректный номер карты (16 цифр)');
            return false;
        }
        
        // Проверка срока действия
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(cardExpiry)) {
            showInputError(cardExpiryInput, 'Введите срок в формате ММ/ГГ');
            return false;
        }
        
        // Проверка имени владельца
        if (!cardHolder || cardHolder.length < 3) {
            showInputError(cardHolderInput, 'Введите имя владельца карты');
            return false;
        }
        
        // Проверка выбора банка
        if (!cardBank || cardBank === '') {
            showInputError(cardBankSelect, 'Выберите банк');
            return false;
        }
        
        // Если выбран "Другой банк", проверяем, что указано название
        if (cardBank === 'other' && !otherBank) {
            showInputError(otherBankInput, 'Укажите название банка');
            return false;
        }
        
        /**
         * Показывает ошибку для конкретного поля ввода
         * @param {HTMLElement} inputElement - Элемент ввода
         * @param {string} errorMessage - Сообщение об ошибке
         */
        function showInputError(inputElement, errorMessage) {
            if (!inputElement) return;
            
            // Добавляем класс ошибки к полю
            inputElement.classList.add('input-error');
            
            // Создаем элемент с текстом ошибки
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.textContent = errorMessage;
            
            // Добавляем после поля ввода
            inputElement.parentNode.appendChild(errorElement);
            
            // Фокус на поле с ошибкой
            inputElement.focus();
        }
        
        // Создание объекта карты
        const newCard = {
            number: cardNumber,
            expiry: cardExpiry,
            holder: cardHolder,
            bank: cardBank,
            otherBank: otherBank,
            isDefault: isDefault,
            type: 'card',
            last4: cardNumber.replace(/\D/g, '').slice(-4),
            bankName: cardBank === 'other' ? otherBank : getBankName(cardBank)
        };
        
        // Показываем индикатор загрузки
        const submitButton = document.querySelector('#addBankCardForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
        }
        
        // Проверяем, это добавление или редактирование карты
        const cardId = document.getElementById('cardId') ? document.getElementById('cardId').value : null;
        const editCardIndex = document.getElementById('editCardIndex') ? parseInt(document.getElementById('editCardIndex').value) : -1;
        
        // Если есть ID или индекс, значит это редактирование
        let apiUrl = 'api/payment_methods/save_card.php';
        let isEditing = false;
        
        if (cardId) {
            newCard.id = cardId;
            apiUrl = 'api/payment_methods/update_card.php';
            isEditing = true;
        }
        
        // Если есть индекс редактируемой карты
        if (editCardIndex >= 0 && editCardIndex < bankCards.length) {
            isEditing = true;
            // Если у карты есть ID, используем его
            if (bankCards[editCardIndex].id) {
                newCard.id = bankCards[editCardIndex].id;
                apiUrl = 'api/payment_methods/update_card.php';
            }
        }
        
        // Отправляем данные на сервер
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCard)
        })
        .then(response => response.json())
        .then(data => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Добавить карту';
            }
            
            if (data.success) {
                // Если новая карта установлена по умолчанию, сбрасываем флаг у других карт
                if (isDefault) {
                    bankCards.forEach(card => {
                        card.isDefault = false;
                    });
                }
                
                // Проверяем, это редактирование или добавление
                if (isEditing && editCardIndex >= 0 && editCardIndex < bankCards.length) {
                    // Обновляем существующую карту
                    console.log('Обновляем карту с индексом:', editCardIndex);
                    bankCards[editCardIndex] = data.card || {
                        ...newCard,
                        id: bankCards[editCardIndex].id
                    };
                } else {
                    // Добавляем новую карту в массив
                    console.log('Добавляем новую карту');
                    bankCards.push(data.card || newCard);
                }
                
                // Сохранение и обновление отображения
                saveBankCards();
                renderBankCards();
                
                // Закрытие модального окна
                const modal = document.getElementById('addBankCardModal');
                if (modal) {
                    modal.style.display = 'none';
                    // Если есть jQuery, используем его
                    if (typeof $ !== 'undefined') {
                        $(modal).modal('hide');
                    }
                }
                
                // Очистка формы
                const form = document.getElementById('addBankCardForm');
                if (form) {
                    form.reset();
                    
                    // Сбрасываем скрытые поля
                    const cardIdInput = document.getElementById('cardId');
                    if (cardIdInput) cardIdInput.value = '';
                    
                    const editCardIndexInput = document.getElementById('editCardIndex');
                    if (editCardIndexInput) editCardIndexInput.value = '-1';
                    
                    // Сбрасываем заголовок и текст кнопки
                    const modalTitle = document.querySelector('#addBankCardModal .modal-title');
                    if (modalTitle) modalTitle.textContent = 'Добавление карты';
                    
                    if (submitButton) submitButton.textContent = 'Добавить карту';
                }
                
                const otherBankGroup = document.getElementById('otherBankGroup');
                if (otherBankGroup) otherBankGroup.style.display = 'none';
                
                // Показ уведомления
                const message = isEditing ? 'Карта успешно обновлена!' : 'Карта успешно добавлена!';
                showNotification(message);
            } else {
                // Показываем уведомление об ошибке
                showNotification(data.message || 'Ошибка при добавлении карты', 'error');
            }
        })
        .catch(error => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Добавить карту';
            }
            console.error('Ошибка при добавлении карты:', error);
            showNotification('Ошибка при добавлении карты', 'error');
        });
    }
    
    /**
     * Обработчик добавления электронного кошелька
     * @param {Event} event - Событие отправки формы
     */
    function handleAddWebWallet(event) {
        event.preventDefault();
        
        // Получение данных формы
        const walletType = document.getElementById('walletType').value;
        const otherWalletType = document.getElementById('otherWalletType').value.trim();
        const walletNumber = document.getElementById('walletNumber').value.trim();
        const isDefault = document.getElementById('defaultWallet').checked;
        
        // Валидация данных
        if (!walletType || !walletNumber) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Если выбран "Другой тип кошелька", проверяем, что указано название
        if (walletType === 'other' && !otherWalletType) {
            alert('Пожалуйста, укажите тип кошелька');
            return;
        }
        
        // Создание объекта кошелька
        const newWallet = {
            type: walletType,
            otherType: otherWalletType,
            number: walletNumber,
            isDefault: isDefault,
            typeName: walletType === 'other' ? otherWalletType : getWalletTypeName(walletType)
        };
        
        // Показываем индикатор загрузки
        const submitButton = document.querySelector('#addWebWalletForm button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
        }
        
        // Проверяем, это добавление или редактирование кошелька
        const walletId = document.getElementById('walletId') ? document.getElementById('walletId').value : null;
        
        // Если есть ID, значит это редактирование
        let apiUrl = 'api/payment_methods/save_wallet.php';
        
        if (walletId) {
            newWallet.id = walletId;
            apiUrl = 'api/payment_methods/update_wallet.php';
        }
        
        // Отправляем данные на сервер
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newWallet)
        })
        .then(response => response.json())
        .then(data => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Добавить кошелек';
            }
            
            if (data.success) {
                // Если новый кошелек установлен по умолчанию, сбрасываем флаг у других кошельков
                if (isDefault) {
                    webWallets.forEach(wallet => {
                        wallet.isDefault = false;
                    });
                }
                
                // Добавляем кошелек в массив с ID из базы данных
                if (walletId) {
                    // Если это редактирование, то кошелек уже удален из массива
                } else {
                    // Если это добавление, добавляем кошелек в массив
                    webWallets.push(data.wallet);
                }
                
                // Сохранение и обновление отображения
                saveWebWallets();
                renderWebWallets();
                
                // Сброс формы и закрытие модального окна
                addWebWalletForm.reset();
                addWebWalletModal.style.display = 'none';
                
                // Показ уведомления
                showNotification(walletId ? 'Кошелек успешно обновлен' : 'Кошелек успешно добавлен', 'success');
            } else {
                // Показываем уведомление об ошибке
                showNotification(data.message || 'Ошибка при сохранении кошелька', 'error');
            }
        })
        .catch(error => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Добавить кошелек';
            }
            console.error('Ошибка при сохранении кошелька:', error);
            showNotification('Ошибка при сохранении кошелька', 'error');
        });
    }
    
    /**
     * Редактирование банковской карты
     * @param {number} index - Индекс карты в массиве
     */
    function editBankCard(index) {
        // Проверяем, что индекс валидный
        if (index < 0 || index >= bankCards.length) {
            console.error('Неверный индекс карты:', index);
            return;
        }
        
        const card = bankCards[index];
        console.log('Редактирование карты:', card);
        
        // Сохраняем ID карты и индекс для последующего обновления
        const cardIdInput = document.getElementById('cardId');
        if (cardIdInput) {
            cardIdInput.value = card.id || '';
        }
        
        // Создаем скрытое поле для индекса, если его нет
        let indexInput = document.getElementById('editCardIndex');
        if (!indexInput) {
            indexInput = document.createElement('input');
            indexInput.type = 'hidden';
            indexInput.id = 'editCardIndex';
            const form = document.getElementById('addBankCardForm');
            if (form) {
                form.appendChild(indexInput);
            }
        }
        if (indexInput) {
            indexInput.value = index;
        }
        
        // Заполнение формы данными карты
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.value = card.number || '';
        }
        
        const cardExpiryInput = document.getElementById('cardExpiry');
        if (cardExpiryInput) {
            cardExpiryInput.value = card.expiry || '';
        }
        
        const cardHolderInput = document.getElementById('cardHolder');
        if (cardHolderInput) {
            cardHolderInput.value = card.holder || '';
        }
        
        const cardBankSelect = document.getElementById('cardBank');
        if (cardBankSelect) {
            cardBankSelect.value = card.bank || 'other';
            
            // Обработка поля для другого банка
            const otherBankGroup = document.getElementById('otherBankGroup');
            const otherBankInput = document.getElementById('otherBank');
            
            if (card.bank === 'other' && otherBankGroup && otherBankInput) {
                otherBankGroup.style.display = 'block';
                otherBankInput.value = card.otherBank || '';
            } else if (otherBankGroup) {
                otherBankGroup.style.display = 'none';
            }
        }
        
        // Установка флага по умолчанию
        const defaultCardCheckbox = document.getElementById('defaultCard');
        if (defaultCardCheckbox) {
            defaultCardCheckbox.checked = card.isDefault || false;
        }
        
        // Изменяем текст кнопки и заголовок модального окна
        const submitButton = document.querySelector('#addBankCardForm button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Сохранить изменения';
        }
        
        const modalTitle = document.querySelector('#addBankCardModal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Редактирование карты';
        }
        
        // Открытие модального окна
        const modal = document.getElementById('addBankCardModal');
        if (modal) {
            modal.style.display = 'block';
            
            // Если есть jQuery, можно использовать его
            if (typeof $ !== 'undefined') {
                $(modal).modal('show');
            }
        } else {
            console.error('Модальное окно не найдено');
        }
    }
    
    /**
     * Редактирование электронного кошелька
     * @param {number} index - Индекс кошелька в массиве
     */
    function editWebWallet(index) {
        const wallet = webWallets[index];
        
        // Заполнение формы данными кошелька
        document.getElementById('walletType').value = wallet.type;
        document.getElementById('walletNumber').value = wallet.number;
        
        if (wallet.type === 'other') {
            document.getElementById('otherWalletType').value = wallet.otherType;
            document.getElementById('otherWalletGroup').style.display = 'block';
        } else {
            document.getElementById('otherWalletGroup').style.display = 'none';
        }
        
        document.getElementById('defaultWallet').checked = wallet.isDefault;
        
        // Удаление кошелька из массива (будет добавлен заново при сохранении)
        webWallets.splice(index, 1);
        
        // Открытие модального окна
        addWebWalletModal.style.display = 'block';
    }
    

    
    /**
     * Удаление банковской карты
     * @param {number} index - Индекс карты в массиве
     */
    function deleteBankCard(index) {
        if (confirm('Вы уверены, что хотите удалить эту карту?')) {
            const card = bankCards[index];
            
            // Показываем индикатор загрузки
            showNotification('Удаление карты...', 'info');
            
            // Отправляем запрос на удаление карты в базе данных
            fetch('api/payment_methods/delete_card.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: card.id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Удаление карты из массива
                    bankCards.splice(index, 1);
                    
                    // Сохранение и обновление отображения
                    saveBankCards();
                    renderBankCards();
                    
                    // Показ уведомления
                    showNotification('Карта успешно удалена', 'success');
                } else {
                    // Показ уведомления об ошибке
                    showNotification(data.message || 'Ошибка при удалении карты', 'error');
                }
            })
            .catch(error => {
                console.error('Ошибка при удалении карты:', error);
                showNotification('Ошибка при удалении карты', 'error');
            });
        }
    }
    
    /**
     * Удаление электронного кошелька
     * @param {number} index - Индекс кошелька в массиве
     */
    function deleteWebWallet(index) {
        if (confirm('Вы уверены, что хотите удалить этот кошелек?')) {
            const wallet = webWallets[index];
            
            // Показываем индикатор загрузки
            showNotification('Удаление кошелька...', 'info');
            
            // Отправляем запрос на удаление кошелька в базе данных
            fetch('api/payment_methods/delete_wallet.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: wallet.id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Удаление кошелька из массива
                    webWallets.splice(index, 1);
                    
                    // Сохранение и обновление отображения
                    saveWebWallets();
                    renderWebWallets();
                    
                    // Показ уведомления
                    showNotification('Кошелек успешно удален', 'success');
                } else {
                    // Показ уведомления об ошибке
                    showNotification(data.message || 'Ошибка при удалении кошелька', 'error');
                }
            })
            .catch(error => {
                console.error('Ошибка при удалении кошелька:', error);
                showNotification('Ошибка при удалении кошелька', 'error');
            });
        }
    }
    
    /**
     * Показ уведомления
     * @param {string} message - Текст уведомления
     */
    function showNotification(message) {
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
        notification.className = 'notification';
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
