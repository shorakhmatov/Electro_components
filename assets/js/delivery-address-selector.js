// JavaScript для выбора адреса доставки при оформлении заказа

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    setupAddressSelection();
    
    // Кнопка выбора адреса доставки
    const selectAddressBtn = document.getElementById('selectAddressBtn');
    if (selectAddressBtn) {
        selectAddressBtn.addEventListener('click', function() {
            showAddressSelectionModal();
        });
    }
    
    // Кнопка оформления заказа
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Проверяем, выбран ли адрес доставки
            if (!window.selectedDeliveryAddress) {
                showAddressSelectionModal();
                showNotification('Пожалуйста, выберите адрес доставки', 'error');
                return;
            }
            
            // Если адрес выбран, продолжаем оформление заказа
            const selectedPaymentMethod = document.querySelector('.saved-payment-method.selected');
            if (!selectedPaymentMethod) {
                showNotification('Пожалуйста, выберите способ оплаты', 'error');
                return;
            }
            
            const paymentData = {
                id: selectedPaymentMethod.getAttribute('data-id'),
                type: selectedPaymentMethod.getAttribute('data-type'),
                details: selectedPaymentMethod.getAttribute('data-details')
            };
            
            // Добавляем адрес доставки к данным заказа
            const orderData = {
                payment: paymentData,
                delivery_address: window.selectedDeliveryAddress
            };
            
            // Отправляем запрос на оформление заказа
            placeOrder(orderData);
        });
    }
});

// Настройка выбора адреса доставки
function setupAddressSelection() {
    // Загружаем сохраненные адреса
    loadSavedAddresses();
    
    // Обработчик закрытия модального окна
    const closeButtons = document.querySelectorAll('.address-modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('addressSelectionModal').style.display = 'none';
        });
    });
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('addressSelectionModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Показать модальное окно выбора адреса
function showAddressSelectionModal() {
    // Обновляем список адресов перед показом модального окна
    loadSavedAddresses();
    
    // Показываем модальное окно
    document.getElementById('addressSelectionModal').style.display = 'block';
}

// Загрузка сохраненных адресов
function loadSavedAddresses() {
    const addressesContainer = document.getElementById('savedAddressesList');
    if (!addressesContainer) return;
    
    // Очищаем контейнер
    addressesContainer.innerHTML = '';
    
    // Добавляем индикатор загрузки
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка адресов...';
    addressesContainer.appendChild(loadingIndicator);
    
    // Проверяем, есть ли сохраненные адреса в localStorage
    if (!localStorage.getItem('savedAddresses')) {
        // Создаем пустой массив адресов
        localStorage.setItem('savedAddresses', JSON.stringify([]));
    }
    
    // Загружаем адреса из базы данных
    fetch('api/delivery_addresses/get_addresses.php')
        .then(response => response.json())
        .then(data => {
            // Удаляем индикатор загрузки
            addressesContainer.removeChild(loadingIndicator);
            
            if (data.success && data.addresses && data.addresses.length > 0) {
                // Добавляем карточки адресов
                data.addresses.forEach(address => {
                    // Подготавливаем данные адреса
                    if (address.type === 'manual') {
                        address.full = `${address.city}, ${address.street}, ${address.building}`;
                        if (address.apartment) {
                            address.full += `, кв./офис ${address.apartment}`;
                        }
                        address.name = 'Домашний адрес';
                    } else if (address.type === 'office') {
                        address.full = `${address.city}, ${address.street}, ${address.building}`;
                        if (address.office) {
                            address.full += `, офис ${address.office}`;
                        }
                        address.name = 'Офис';
                    } else if (address.type === 'pickup') {
                        address.full = address.pointAddress || '';
                        address.name = address.pointName || 'Пункт выдачи';
                    }
                    
                    const addressCard = createAddressCard(address);
                    addressesContainer.appendChild(addressCard);
                    
                    // Если это выбранный адрес, отмечаем его
                    if (window.selectedDeliveryAddress && window.selectedDeliveryAddress.id === address.id) {
                        const selectedCard = addressesContainer.querySelector(`.address-card[data-id="${address.id}"]`);
                        if (selectedCard) {
                            selectedCard.classList.add('selected');
                        }
                    }
                });
            } else {
                // Если нет сохраненных адресов, показываем форму для добавления нового адреса
                const noAddressesMessage = document.createElement('div');
                noAddressesMessage.className = 'no-addresses-message';
                noAddressesMessage.innerHTML = `
                    <div class="empty-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <h3>У вас нет сохраненных адресов</h3>
                    <p>Вы можете добавить новый адрес прямо сейчас или перейти в личный кабинет</p>
                    <div class="address-options">
                        <button class="btn-add-address-now">
                            <i class="fas fa-plus"></i> Добавить адрес сейчас
                        </button>
                        <a href="profile.php#delivery-addresses" class="btn-add-address">
                            <i class="fas fa-user"></i> Добавить в личном кабинете
                        </a>
                    </div>
                    
                    <!-- Форма для добавления нового адреса -->
                    <div class="new-address-form" style="display: none;">
                        <h4>Добавление нового адреса</h4>
                        <form id="newAddressForm">
                            <div class="form-group">
                                <label for="addressCity">Город</label>
                                <input type="text" id="addressCity" name="city" required>
                            </div>
                            <div class="form-group">
                                <label for="addressStreet">Улица</label>
                                <input type="text" id="addressStreet" name="street" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="addressBuilding">Дом</label>
                                    <input type="text" id="addressBuilding" name="building" required>
                                </div>
                                <div class="form-group">
                                    <label for="addressApartment">Квартира/Офис</label>
                                    <input type="text" id="addressApartment" name="apartment">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="addressPostcode">Индекс</label>
                                    <input type="text" id="addressPostcode" name="postcode" required>
                                </div>
                                <div class="form-group">
                                    <label for="addressType">Тип адреса</label>
                                    <select id="addressType" name="type">
                                        <option value="manual">Домашний</option>
                                        <option value="office">Офис</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group checkbox-group">
                                <input type="checkbox" id="addressDefault" name="is_default">
                                <label for="addressDefault">Использовать по умолчанию</label>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-save-address">Сохранить адрес</button>
                                <button type="button" class="btn-cancel-address">Отмена</button>
                            </div>
                        </form>
                    </div>
                `;
                
                // Добавляем сообщение в контейнер
                addressesContainer.appendChild(noAddressesMessage);
                
                // Добавляем обработчики событий для кнопок
                const addButton = noAddressesMessage.querySelector('.btn-add-address');
                const addNowButton = noAddressesMessage.querySelector('.btn-add-address-now');
                const cancelButton = noAddressesMessage.querySelector('.btn-cancel-address');
                const newAddressForm = noAddressesMessage.querySelector('.new-address-form');
                const addressForm = document.getElementById('newAddressForm');
                
                // Показываем форму добавления адреса при нажатии на кнопку
                if (addNowButton) {
                    addNowButton.addEventListener('click', function() {
                        const optionsDiv = noAddressesMessage.querySelector('.address-options');
                        if (optionsDiv) optionsDiv.style.display = 'none';
                        if (newAddressForm) newAddressForm.style.display = 'block';
                    });
                }
                
                // Скрываем форму при нажатии на кнопку Отмена
                if (cancelButton) {
                    cancelButton.addEventListener('click', function() {
                        const optionsDiv = noAddressesMessage.querySelector('.address-options');
                        if (optionsDiv) optionsDiv.style.display = 'flex';
                        if (newAddressForm) newAddressForm.style.display = 'none';
                    });
                }
                
                // Обработчик отправки формы
                if (addressForm) {
                    addressForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        // Собираем данные формы
                        const formData = new FormData(addressForm);
                        
                        // Отправляем запрос на сервер
                        fetch('api/delivery_addresses/save_address.php', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                // Закрываем модальное окно и обновляем список адресов
                                showNotification('Адрес успешно добавлен', 'success');
                                
                                // Выбираем новый адрес автоматически
                                selectDeliveryAddress(data.address);
                                
                                // Обновляем список адресов
                                loadSavedAddresses();
                                
                                // Закрываем модальное окно
                                document.getElementById('addressSelectionModal').style.display = 'none';
                            } else {
                                showNotification(data.message || 'Ошибка при добавлении адреса', 'error');
                            }
                        })
                        .catch(error => {
                            console.error('Error saving address:', error);
                            showNotification('Произошла ошибка при сохранении адреса', 'error');
                        });
                    });
                }
                
                // Обработчик для кнопки перехода в личный кабинет
                if (addButton) {
                    addButton.addEventListener('mouseenter', function() {
                        this.querySelector('i').classList.add('fa-spin');
                    });
                    
                    addButton.addEventListener('mouseleave', function() {
                        this.querySelector('i').classList.remove('fa-spin');
                    });
                }
            }
        })
        .catch(error => {
            // Удаляем индикатор загрузки
            addressesContainer.removeChild(loadingIndicator);
            
            console.error('Ошибка при загрузке адресов:', error);
            
            // Показываем сообщение об ошибке
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Ошибка загрузки</h3>
                <p>Не удалось загрузить адреса доставки. Пожалуйста, попробуйте позже.</p>
                <a href="profile.php#delivery-addresses" class="btn-add-address">
                    <i class="fas fa-plus"></i> Добавить новый адрес
                </a>
            `;
            addressesContainer.appendChild(errorMessage);
            
            // Добавляем обработчики событий для кнопки
            const addButton = errorMessage.querySelector('.btn-add-address');
            if (addButton) {
                addButton.addEventListener('mouseenter', function() {
                    this.querySelector('i').classList.add('fa-spin');
                });
                
                addButton.addEventListener('mouseleave', function() {
                    this.querySelector('i').classList.remove('fa-spin');
                });
            }
        });
}

// Создание карточки адреса
function createAddressCard(address) {
    const card = document.createElement('div');
    card.className = 'address-card';
    card.setAttribute('data-id', address.id);
    
    // Проверяем, выбран ли этот адрес
    if (window.selectedDeliveryAddress && window.selectedDeliveryAddress.id === address.id) {
        card.classList.add('selected');
    }
    
    // Определяем иконку в зависимости от типа адреса
    let icon = 'fa-home';
    if (address.type === 'office') {
        icon = 'fa-building';
    } else if (address.type === 'pickup') {
        icon = 'fa-store';
    }
    
    // Формируем адрес для отображения
    let addressName = address.name || 'Адрес';
    let addressFull = '';
    
    if (address.type === 'manual') {
        // Для ручного ввода формируем адрес из компонентов
        addressFull = `${address.city}, ${address.street}, ${address.building}`;
        if (address.apartment) {
            addressFull += `, кв./офис ${address.apartment}`;
        }
    } else if (address.type === 'pickup') {
        // Для пункта выдачи используем адрес пункта
        addressFull = address.pointAddress || '';
        addressName = address.pointName || 'Пункт выдачи';
    } else if (address.full) {
        // Если есть готовый полный адрес, используем его
        addressFull = address.full;
    }
    
    card.innerHTML = `
        <div class="address-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="address-details">
            <div class="address-name">${addressName}</div>
            <div class="address-full">${addressFull}</div>
            ${address.comment ? `<div class="address-comment">${address.comment}</div>` : ''}
            ${address.postalCode ? `<div class="address-postal-code">Индекс: ${address.postalCode}</div>` : ''}
        </div>
        <div class="address-actions">
            <button class="select-address-btn" data-id="${address.id}">Выбрать</button>
        </div>
    `;
    
    // Добавляем обработчик клика на кнопку выбора адреса
    card.querySelector('.select-address-btn').addEventListener('click', function() {
        selectDeliveryAddress(address);
    });
    
    return card;
}

// Выбор адреса доставки
function selectDeliveryAddress(address) {
    // Сохраняем выбранный адрес
    window.selectedDeliveryAddress = address;
    
    // Обновляем отображение выбранного адреса
    const selectedAddressDisplay = document.getElementById('selectedAddressDisplay');
    if (selectedAddressDisplay) {
        // Определяем иконку в зависимости от типа адреса
        let icon = 'fa-home';
        if (address.type === 'office') {
            icon = 'fa-building';
        } else if (address.type === 'pickup') {
            icon = 'fa-store';
        }
        
        // Формируем адрес для отображения
        let addressName = address.name || 'Адрес';
        let addressFull = '';
        
        if (address.type === 'manual') {
            // Для ручного ввода формируем адрес из компонентов
            addressFull = `${address.city}, ${address.street}, ${address.building}`;
            if (address.apartment) {
                addressFull += `, кв./офис ${address.apartment}`;
            }
        } else if (address.type === 'pickup') {
            // Для пункта выдачи используем адрес пункта
            addressFull = address.pointAddress || '';
            addressName = address.pointName || 'Пункт выдачи';
        } else if (address.full) {
            // Если есть готовый полный адрес, используем его
            addressFull = address.full;
        }
        
        selectedAddressDisplay.innerHTML = `
            <div class="selected-address">
                <div class="address-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="address-details">
                    <div class="address-name">${addressName}</div>
                    <div class="address-full">${addressFull}</div>
                    ${address.comment ? `<div class="address-comment">${address.comment}</div>` : ''}
                </div>
                <button class="remove-address-btn" id="removeAddressBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Добавляем обработчик для кнопки удаления адреса
        const removeAddressBtn = document.getElementById('removeAddressBtn');
        if (removeAddressBtn) {
            removeAddressBtn.addEventListener('click', removeSelectedAddress);
        }
    }
    
    // Закрываем модальное окно
    document.getElementById('addressSelectionModal').style.display = 'none';
    
    // Активируем все кнопки оплаты
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const placeOrderBtnWallet = document.getElementById('placeOrderBtnWallet');
    const placeOrderBtnSberPay = document.getElementById('placeOrderBtnSberPay');
    const placeOrderBtnTinkoffPay = document.getElementById('placeOrderBtnTinkoffPay');
    
    if (placeOrderBtn) placeOrderBtn.disabled = false;
    if (placeOrderBtnWallet) placeOrderBtnWallet.disabled = false;
    if (placeOrderBtnSberPay) placeOrderBtnSberPay.disabled = false;
    if (placeOrderBtnTinkoffPay) placeOrderBtnTinkoffPay.disabled = false;
    
    // Создаем и диспетчеризуем событие выбора адреса
    const addressSelectedEvent = new Event('addressSelected');
    document.dispatchEvent(addressSelectedEvent);
    
    // Показываем уведомление
    showNotification('Адрес доставки выбран', 'success');
}

// Удаление выбранного адреса
function removeSelectedAddress() {
    // Очищаем выбранный адрес
    window.selectedDeliveryAddress = null;
    
    // Обновляем отображение
    const selectedAddressDisplay = document.getElementById('selectedAddressDisplay');
    if (selectedAddressDisplay) {
        selectedAddressDisplay.innerHTML = `
            <p>Для оформления заказа необходимо выбрать адрес доставки</p>
        `;
    }
    
    // Деактивируем все кнопки оплаты
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const placeOrderBtnWallet = document.getElementById('placeOrderBtnWallet');
    const placeOrderBtnSberPay = document.getElementById('placeOrderBtnSberPay');
    const placeOrderBtnTinkoffPay = document.getElementById('placeOrderBtnTinkoffPay');
    
    if (placeOrderBtn) placeOrderBtn.disabled = true;
    if (placeOrderBtnWallet) placeOrderBtnWallet.disabled = true;
    if (placeOrderBtnSberPay) placeOrderBtnSberPay.disabled = true;
    if (placeOrderBtnTinkoffPay) placeOrderBtnTinkoffPay.disabled = true;
    
    // Показываем уведомление
    showNotification('Адрес доставки удален', 'info');
}

// Размещение заказа
function placeOrder(orderData) {
    // Показываем индикатор загрузки
    showNotification('Оформляем заказ...', 'info');
    
    // Создаем FormData для отправки данных
    const formData = new FormData();
    formData.append('payment_data', JSON.stringify(orderData.payment));
    formData.append('delivery_address', JSON.stringify(orderData.delivery_address));
    
    // Отправляем запрос на сервер
    fetch('api/place_order.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Показываем модальное окно успешного оформления заказа
            const successModal = document.getElementById('orderSuccessModal');
            if (successModal) {
                // Обновляем информацию о заказе в модальном окне
                const orderIdElement = document.getElementById('successOrderId');
                if (orderIdElement) {
                    orderIdElement.textContent = data.order_id;
                }
                
                // Показываем модальное окно
                successModal.style.display = 'block';
            }
            
            // Очищаем выбранный адрес
            window.selectedDeliveryAddress = null;
        } else {
            // Показываем сообщение об ошибке
            showNotification(data.message || 'Ошибка при оформлении заказа', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Произошла ошибка при оформлении заказа', 'error');
    });
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
