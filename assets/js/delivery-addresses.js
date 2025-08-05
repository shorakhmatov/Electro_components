// JavaScript для работы с адресами доставки

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    setupDeliveryServiceSelection();
    setupAddressCardActions();
    setupMapControls();
    loadSavedAddresses();
});

// Настройка выбора службы доставки
function setupDeliveryServiceSelection() {
    const deliveryServices = document.querySelectorAll('.delivery-service');
    const pickupPointsMapContainer = document.querySelector('.pickup-points-map-container');
    const manualAddressEntry = document.querySelector('.manual-address-entry');
    
    // Кнопки выбора службы доставки
    const selectServiceButtons = document.querySelectorAll('.select-service');
    
    selectServiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            
            // Сбрасываем выделение всех служб
            deliveryServices.forEach(srv => srv.classList.remove('selected'));
            
            // Выделяем выбранную службу
            this.closest('.delivery-service').classList.add('selected');
            
            // Сохраняем выбранную службу в глобальной переменной
            window.currentDeliveryService = service;
            
            // Показываем контейнер с картой
            pickupPointsMapContainer.style.display = 'block';
            
            // Инициализируем карту для выбранной службы
            initMap(service);
            
            // Добавляем кнопку для ручного ввода адреса
            const mapControls = document.querySelector('.map-controls');
            
            // Проверяем, существует ли уже кнопка
            if (!document.getElementById('manualAddressButton')) {
                const manualButton = document.createElement('button');
                manualButton.id = 'manualAddressButton';
                manualButton.className = 'btn-secondary';
                manualButton.textContent = 'Ввести адрес вручную';
                manualButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Скрываем карту и показываем форму ручного ввода
                    pickupPointsMapContainer.style.display = 'none';
                    manualAddressEntry.style.display = 'block';
                    
                    // Устанавливаем выбранную службу в форме
                    document.getElementById('deliveryService').value = service;
                });
                
                mapControls.appendChild(manualButton);
            }
            
            // Прокручиваем к карте
            pickupPointsMapContainer.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Настройка формы ручного ввода адреса
    const manualAddressForm = document.getElementById('manualAddressForm');
    if (manualAddressForm) {
        manualAddressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            
            // Проверяем, есть ли скрытое поле с ID адреса (для редактирования)
            const addressId = document.getElementById('addressId') ? document.getElementById('addressId').value : null;
            
            // Создаем объект с данными адреса
            const addressData = {
                type: 'manual',
                service: formData.get('deliveryService'),
                city: formData.get('city'),
                street: formData.get('street'),
                building: formData.get('building'),
                apartment: formData.get('apartment'),
                postalCode: formData.get('postalCode'),
                comment: formData.get('addressComment'),
                isDefault: false // По умолчанию не устанавливаем адрес по умолчанию
            };
            
            // Если это редактирование, добавляем ID адреса
            if (addressId) {
                addressData.id = addressId;
            }
            
            // Сохраняем адрес
            saveAddress(addressData);
            
            // Очищаем форму
            this.reset();
            
            // Скрываем форму
            manualAddressEntry.style.display = 'none';
            
            // Показываем уведомление
            showNotification('Адрес успешно сохранен', 'success');
            
            // Обновляем список сохраненных адресов
            loadSavedAddresses();
        });
    }
}

// Инициализация карты для выбранной службы доставки
function initMap(service) {
    // Получаем элемент карты
    const mapElement = document.getElementById('pickupPointsMap');
    
    // Проверяем, загружен ли API Яндекс.Карт
    if (typeof ymaps !== 'undefined') {
        createMap(service);
    } else {
        // Загружаем API Яндекс.Карт
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU';
        script.async = true;
        script.onload = function() {
            // После загрузки API инициализируем карту
            ymaps.ready(function() {
                createMap(service);
            });
        };
        document.head.appendChild(script);
    }
}

// Создание карты
function createMap(service) {
    // Проверяем, загружен ли API Яндекс.Карт
    if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps API is not loaded');
        return;
    }
    
    // Получаем элемент карты
    const mapElement = document.getElementById('pickupPointsMap');
    
    // Создаем карту
    const map = new ymaps.Map(mapElement, {
        center: [55.76, 37.64], // Москва
        zoom: 10,
        controls: ['zoomControl', 'geolocationControl']
    });
    
    // Сохраняем карту в глобальной переменной
    window.deliveryMap = map;
    
    // Загружаем пункты выдачи в зависимости от выбранной службы
    loadPickupPoints(service, map);
    
    // Настраиваем кнопку геолокации
    const useGeolocationButton = document.getElementById('useGeolocation');
    if (useGeolocationButton) {
        useGeolocationButton.addEventListener('click', function() {
            // Запрашиваем геолокацию
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const coords = [position.coords.latitude, position.coords.longitude];
                        
                        // Центрируем карту на текущем местоположении
                        map.setCenter(coords, 14);
                        
                        // Добавляем метку текущего местоположения
                        const userPlacemark = new ymaps.Placemark(coords, {
                            hintContent: 'Ваше местоположение'
                        }, {
                            preset: 'islands#blueCircleDotIcon'
                        });
                        
                        map.geoObjects.add(userPlacemark);
                        
                        // Находим ближайшие пункты выдачи
                        findNearestPickupPoints(coords, service);
                    },
                    function(error) {
                        console.error('Ошибка при получении геолокации:', error);
                        showNotification('Не удалось определить ваше местоположение', 'error');
                    }
                );
            } else {
                showNotification('Ваш браузер не поддерживает геолокацию', 'error');
            }
        });
    }
    
    // Настраиваем поиск по адресу
    const searchAddressButton = document.getElementById('searchAddress');
    const addressSearchInput = document.getElementById('addressSearch');
    
    if (searchAddressButton && addressSearchInput) {
        searchAddressButton.addEventListener('click', function() {
            const address = addressSearchInput.value.trim();
            
            if (address) {
                try {
                    // Проверяем, загружен ли API Яндекс.Карт
                    if (typeof ymaps === 'undefined') {
                        showNotification('API Яндекс.Карт еще не загружен. Пожалуйста, подождите...', 'warning');
                        return;
                    }
                    
                    // Используем упрощенный подход для демонстрации
                    // В реальном приложении здесь будет полноценный геокодер
                    
                    // Симулируем нахождение координат для демонстрации
                    const coords = [55.76, 37.64]; // Москва по умолчанию
                    
                    // Центрируем карту на найденном адресе
                    map.setCenter(coords, 14);
                    
                    // Добавляем метку найденного адреса
                    const addressPlacemark = new ymaps.Placemark(coords, {
                        hintContent: address
                    }, {
                        preset: 'islands#redDotIcon'
                    });
                    
                    map.geoObjects.add(addressPlacemark);
                    
                    // Показываем уведомление об успехе
                    showNotification('Адрес найден', 'success');
                    
                    // Находим ближайшие пункты выдачи
                    loadPickupPoints(window.currentDeliveryService || 'cdek', map);
                } catch (error) {
                    console.error('Ошибка при поиске адреса:', error);
                    showNotification('Ошибка при поиске адреса. Попробуйте позже.', 'error');
                }
            } else {
                showNotification('Введите адрес для поиска', 'warning');
            }
        });
        
        // Поиск при нажатии Enter
        addressSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchAddressButton.click();
            }
        });
    }
}

// Загрузка пунктов выдачи
function loadPickupPoints(service, map) {
    // В реальном приложении здесь будет запрос к API для получения пунктов выдачи
    // Для демонстрации используем моковые данные
    
    let pickupPoints = [];
    
    if (service === 'cdek') {
        // Моковые данные пунктов СДЭК
        pickupPoints = [
            {
                id: 'cdek1',
                name: 'СДЭК - Пункт выдачи №1',
                address: 'г. Москва, ул. Тверская, д. 10',
                coords: [55.762, 37.609],
                hours: 'Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00',
                phone: '+7 (495) 123-45-67'
            },
            {
                id: 'cdek2',
                name: 'СДЭК - Пункт выдачи №2',
                address: 'г. Москва, ул. Ленинский проспект, д. 45',
                coords: [55.703, 37.566],
                hours: 'Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-19:00',
                phone: '+7 (495) 765-43-21'
            },
            {
                id: 'cdek3',
                name: 'СДЭК - Пункт выдачи №3',
                address: 'г. Москва, ул. Профсоюзная, д. 25',
                coords: [55.670, 37.557],
                hours: 'Пн-Вс: 9:00-22:00',
                phone: '+7 (495) 987-65-43'
            }
        ];
    } else if (service === 'russian-post') {
        // Моковые данные отделений Почты России
        pickupPoints = [
            {
                id: 'post1',
                name: 'Почта России - Отделение №101000',
                address: 'г. Москва, ул. Мясницкая, д. 26',
                coords: [55.765, 37.638],
                hours: 'Пн-Пт: 8:00-20:00, Сб: 9:00-18:00, Вс: выходной',
                phone: '+7 (495) 456-78-90'
            },
            {
                id: 'post2',
                name: 'Почта России - Отделение №107045',
                address: 'г. Москва, Рождественский бульвар, д. 5/7',
                coords: [55.766, 37.624],
                hours: 'Пн-Пт: 8:00-20:00, Сб: 9:00-18:00, Вс: выходной',
                phone: '+7 (495) 234-56-78'
            },
            {
                id: 'post3',
                name: 'Почта России - Отделение №105062',
                address: 'г. Москва, ул. Покровка, д. 5',
                coords: [55.758, 37.647],
                hours: 'Пн-Пт: 8:00-20:00, Сб: 9:00-18:00, Вс: выходной',
                phone: '+7 (495) 345-67-89'
            }
        ];
    }
    
    // Очищаем карту от предыдущих меток
    map.geoObjects.removeAll();
    
    // Добавляем метки пунктов выдачи на карту
    pickupPoints.forEach(point => {
        const placemark = new ymaps.Placemark(point.coords, {
            hintContent: point.name,
            balloonContent: `
                <div class="pickup-point-balloon">
                    <h4>${point.name}</h4>
                    <p><strong>Адрес:</strong> ${point.address}</p>
                    <p><strong>Режим работы:</strong> ${point.hours}</p>
                    <p><strong>Телефон:</strong> ${point.phone}</p>
                    <button class="select-pickup-point" data-point-id="${point.id}">Выбрать этот пункт</button>
                </div>
            `
        }, {
            preset: service === 'cdek' ? 'islands#darkGreenDotIcon' : 'islands#darkBlueDotIcon'
        });
        
        // Обработчик клика на метку
        placemark.events.add('click', function(e) {
            // Сохраняем данные о выбранном пункте
            window.selectedPickupPoint = point;
            
            // Показываем детали выбранного пункта
            showSelectedPointDetails(point);
        });
        
        map.geoObjects.add(placemark);
    });
    
    // Устанавливаем границы карты, чтобы видеть все пункты
    if (pickupPoints.length > 0) {
        const bounds = map.geoObjects.getBounds();
        map.setBounds(bounds, {
            checkZoomRange: true,
            zoomMargin: 30
        });
    }
}

// Поиск ближайших пунктов выдачи
function findNearestPickupPoints(coords, service) {
    // В реальном приложении здесь будет запрос к API для получения ближайших пунктов выдачи
    // Для демонстрации просто центрируем карту на указанных координатах
    console.log(`Поиск ближайших пунктов ${service} к координатам:`, coords);
}

// Показать детали выбранного пункта
function showSelectedPointDetails(point) {
    const detailsContainer = document.querySelector('.pickup-point-details');
    const detailsContent = document.getElementById('selectedPointDetails');
    
    if (detailsContainer && detailsContent) {
        // Заполняем детали пункта
        detailsContent.innerHTML = `
            <p><strong>Название:</strong> ${point.name}</p>
            <p><strong>Адрес:</strong> ${point.address}</p>
            <p><strong>Режим работы:</strong> ${point.hours}</p>
            <p><strong>Телефон:</strong> ${point.phone}</p>
        `;
        
        // Показываем контейнер с деталями
        detailsContainer.style.display = 'block';
        
        // Настраиваем кнопку подтверждения выбора
        const confirmButton = document.getElementById('confirmPickupPoint');
        if (confirmButton) {
            confirmButton.addEventListener('click', function() {
                // Создаем объект с данными адреса
                const addressData = {
                    type: 'pickup',
                    service: point.id.startsWith('cdek') ? 'cdek' : 'russian-post',
                    pointId: point.id,
                    pointName: point.name,
                    pointAddress: point.address,
                    pointWorkHours: point.hours,
                    pointPhone: point.phone,
                    city: '', // Добавляем пустые поля для обязательных полей в базе данных
                    isDefault: false
                };
                
                // Сохраняем адрес
                saveAddress(addressData);
                
                // Скрываем контейнер с деталями
                detailsContainer.style.display = 'none';
                
                // Скрываем контейнер с картой
                document.querySelector('.pickup-points-map-container').style.display = 'none';
                
                // Показываем уведомление
                showNotification('Пункт выдачи успешно выбран', 'success');
                
                // Обновляем список сохраненных адресов
                loadSavedAddresses();
            });
        }
    }
}

// Сохранение адреса
function saveAddress(addressData) {
    // Показываем индикатор загрузки
    const saveButton = document.querySelector('#manualAddressForm button[type="submit"]');
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
    }
    
    // Проверяем, это добавление или редактирование адреса
    let apiUrl = 'api/delivery_addresses/save_address.php';
    
    if (addressData.id) {
        apiUrl = 'api/delivery_addresses/update_address.php';
    }
    
    // Отправляем данные на сервер
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
    })
    .then(response => response.json())
    .then(data => {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = 'Сохранить адрес';
        }
        
        if (data.success) {
            // Обновляем список адресов
            loadSavedAddresses();
            
            // Показываем уведомление
            showNotification(data.message, 'success');
        } else {
            // Показываем уведомление об ошибке
            showNotification(data.message || 'Ошибка при сохранении адреса', 'error');
        }
    })
    .catch(error => {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = 'Сохранить адрес';
        }
        console.error('Ошибка при сохранении адреса:', error);
        showNotification('Ошибка при сохранении адреса', 'error');
    });
}

// Загрузка сохраненных адресов
function loadSavedAddresses() {
    // Получаем контейнер для адресов
    const addressesList = document.getElementById('savedAddressesList');
    
    if (addressesList) {
        // Очищаем контейнер, оставляя только кнопку добавления
        const addAddressCard = document.getElementById('addAddressCard');
        addressesList.innerHTML = '';
        
        if (addAddressCard) {
            addressesList.appendChild(addAddressCard);
        }
        
        // Добавляем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка адресов...';
        addressesList.insertBefore(loadingIndicator, addAddressCard);
        
        // Загружаем адреса из базы данных
        fetch('api/delivery_addresses/get_addresses.php')
            .then(response => response.json())
            .then(data => {
                // Удаляем индикатор загрузки
                if (loadingIndicator.parentNode) {
                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                }
                
                if (data.success && data.addresses) {
                    // Добавляем сохраненные адреса
                    data.addresses.forEach(address => {
                        const addressCard = createAddressCard(address);
                        addressesList.insertBefore(addressCard, addAddressCard);
                    });
                    
                    // Если адресов нет, показываем сообщение
                    if (data.addresses.length === 0) {
                        const noAddressesMessage = document.createElement('div');
                        noAddressesMessage.className = 'no-addresses-message';
                        noAddressesMessage.textContent = 'У вас еще нет сохраненных адресов. Добавьте новый адрес.';
                        addressesList.insertBefore(noAddressesMessage, addAddressCard);
                    }
                } else {
                    console.error('Ошибка при загрузке адресов:', data.message);
                }
            })
            .catch(error => {
                // Удаляем индикатор загрузки
                if (loadingIndicator.parentNode) {
                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                }
                
                console.error('Ошибка при загрузке адресов:', error);
                
                // Показываем сообщение об ошибке
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Ошибка при загрузке адресов. Пожалуйста, попробуйте обновить страницу.';
                addressesList.insertBefore(errorMessage, addAddressCard);
            });
    }
}

// Создание карточки адреса
function createAddressCard(address) {
    const card = document.createElement('div');
    card.className = 'address-card';
    card.setAttribute('data-id', address.id); // Устанавливаем атрибут data-id
    card.setAttribute('data-address-id', address.id); // Оставляем для совместимости
    
    // Заголовок и содержимое в зависимости от типа адреса
    let title, content;
    
    if (address.type === 'pickup') {
        const serviceName = address.service === 'cdek' ? 'СДЭК' : 'Почта России';
        title = `${serviceName} - Пункт выдачи`;
        content = `
            <p><strong>Название:</strong> ${address.pointName || 'Не указано'}</p>
            <p><strong>Адрес:</strong> ${address.pointAddress || 'Не указано'}</p>
            <p><strong>Режим работы:</strong> ${address.pointWorkHours || 'Не указано'}</p>
            ${address.pointPhone ? `<p><strong>Телефон:</strong> ${address.pointPhone}</p>` : ''}
        `;
    } else {
        const serviceName = address.service === 'cdek' ? 'СДЭК' : 'Почта России';
        title = `${serviceName} - Адрес доставки`;
        content = `
            <p><strong>Адрес:</strong> ${address.city || ''}, ${address.street || ''}, ${address.building || ''}${address.apartment ? ', кв./офис ' + address.apartment : ''}</p>
            <p><strong>Индекс:</strong> ${address.postalCode || 'Не указано'}</p>
            ${address.comment ? `<p><strong>Комментарий:</strong> ${address.comment}</p>` : ''}
        `;
    }
    
    // Формируем HTML карточки
    card.innerHTML = `
        <h4>${title}</h4>
        ${content}
        <div class="address-actions">
            <button class="edit-address" data-address-id="${address.id}">Редактировать</button>
            <button class="delete-address" data-address-id="${address.id}">Удалить</button>
        </div>
    `;
    
    return card;
}

// Настройка действий с карточками адресов
function setupAddressCardActions() {
    // Обработчик для кнопки добавления нового адреса
    const addAddressCard = document.getElementById('addAddressCard');
    if (addAddressCard) {
        addAddressCard.addEventListener('click', function() {
            // Показываем выбор службы доставки
            document.querySelector('.delivery-service-selection').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Делегирование событий для кнопок редактирования и удаления
    const addressesList = document.getElementById('savedAddressesList');
    
    if (addressesList) {
        addressesList.addEventListener('click', function(e) {
            // Находим ближайшую кнопку
            const button = e.target.closest('button');
            
            if (!button) return;
            
            // Получаем ID адреса
            const addressId = button.getAttribute('data-address-id');
            
            if (!addressId) return;
            
            // Определяем действие (редактирование или удаление)
            if (button.classList.contains('delete-address')) {
                deleteAddress(addressId);
            } else if (button.classList.contains('edit-address')) {
                editAddress(addressId);
            }
        });
    }
}

// Удаление адреса
function deleteAddress(addressId) {
    if (confirm('Вы уверены, что хотите удалить этот адрес?')) {
        // Показываем индикатор загрузки
        const addressCard = document.querySelector(`.address-card[data-id="${addressId}"]`) || 
                           document.querySelector(`.address-card[data-address-id="${addressId}"]`);
        if (addressCard) {
            addressCard.classList.add('deleting');
            addressCard.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Удаление...';
        }
        
        // Отправляем запрос на удаление адреса
        fetch('api/delivery_addresses/delete_address.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: addressId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Обновляем отображение
                loadSavedAddresses();
                
                // Показываем уведомление
                showNotification(data.message || 'Адрес успешно удален', 'success');
            } else {
                // Удаляем класс deleting и восстанавливаем карточку
                if (addressCard) {
                    addressCard.classList.remove('deleting');
                    loadSavedAddresses(); // Перезагружаем адреса
                }
                
                // Показываем уведомление об ошибке
                showNotification(data.message || 'Ошибка при удалении адреса', 'error');
            }
        })
        .catch(error => {
            console.error('Ошибка при удалении адреса:', error);
            
            // Удаляем класс deleting и восстанавливаем карточку
            if (addressCard) {
                addressCard.classList.remove('deleting');
                loadSavedAddresses(); // Перезагружаем адреса
            }
            
            // Показываем уведомление об ошибке
            showNotification('Ошибка при удалении адреса', 'error');
        });
    }
}

// Редактирование адреса
function editAddress(addressId) {
    // Показываем индикатор загрузки
    const addressCard = document.querySelector(`.address-card[data-id="${addressId}"]`) || 
                       document.querySelector(`.address-card[data-address-id="${addressId}"]`);
    if (addressCard) {
        addressCard.classList.add('loading');
    }
    
    // Загружаем данные адреса с сервера
    fetch('api/delivery_addresses/get_addresses.php')
        .then(response => response.json())
        .then(data => {
            if (addressCard) {
                addressCard.classList.remove('loading');
            }
            
            if (data.success && data.addresses) {
                // Находим адрес с указанным ID
                const address = data.addresses.find(addr => addr.id == addressId);
                
                if (address) {
                    // Заполняем форму данными адреса
                    const manualAddressForm = document.getElementById('manualAddressForm');
                    const manualAddressEntry = document.querySelector('.manual-address-entry');
                    
                    if (manualAddressForm && manualAddressEntry) {
                        // Скрываем карту и показываем форму ручного ввода
                        document.querySelector('.pickup-points-map-container').style.display = 'none';
                        manualAddressEntry.style.display = 'block';
                        
                        // Добавляем скрытое поле для ID адреса
                        if (!document.getElementById('addressId')) {
                            const idField = document.createElement('input');
                            idField.type = 'hidden';
                            idField.id = 'addressId';
                            idField.name = 'addressId';
                            manualAddressForm.appendChild(idField);
                        }
                        
                        // Заполняем поля формы
                        document.getElementById('addressId').value = address.id;
                        document.getElementById('deliveryService').value = address.service;
                        document.getElementById('city').value = address.city || '';
                        document.getElementById('street').value = address.street || '';
                        document.getElementById('building').value = address.building || '';
                        document.getElementById('apartment').value = address.apartment || '';
                        document.getElementById('postalCode').value = address.postalCode || '';
                        document.getElementById('addressComment').value = address.comment || '';
                        
                        // Прокручиваем к форме
                        manualAddressEntry.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    showNotification('Адрес не найден', 'error');
                }
            } else {
                showNotification('Ошибка при загрузке данных адреса', 'error');
            }
        })
        .catch(error => {
            if (addressCard) {
                addressCard.classList.remove('loading');
            }
            console.error('Ошибка при загрузке данных адреса:', error);
            showNotification('Ошибка при загрузке данных адреса', 'error');
        });
}
    if (addressesList) {
        addressesList.addEventListener('click', function(e) {
            const target = e.target;
            
            // Обработка кнопки удаления
            if (target.classList.contains('delete-address')) {
                const addressId = target.getAttribute('data-address-id');
                deleteAddress(addressId);
            }
            
            // Обработка кнопки редактирования
            if (target.classList.contains('edit-address')) {
                const addressId = target.getAttribute('data-address-id');
                editAddress(addressId);
            }
        });
    const address = savedAddresses.find(addr => addr.id === addressId);
    
    if (address) {
        if (address.type === 'manual') {
            // Показываем форму ручного ввода адреса
            const manualAddressEntry = document.querySelector('.manual-address-entry');
            manualAddressEntry.style.display = 'block';
            
            // Заполняем форму данными адреса
            document.getElementById('deliveryService').value = address.service;
            document.getElementById('city').value = address.city;
            document.getElementById('street').value = address.street;
            document.getElementById('building').value = address.building;
            document.getElementById('apartment').value = address.apartment || '';
            document.getElementById('postalCode').value = address.postalCode;
            document.getElementById('addressComment').value = address.comment || '';
            
            // Прокручиваем к форме
            manualAddressEntry.scrollIntoView({ behavior: 'smooth' });
            
            // Удаляем старый адрес
            deleteAddress(addressId);
        } else {
            // Для пунктов выдачи показываем сообщение
            showNotification('Для изменения пункта выдачи выберите новый пункт', 'info');
            
            // Показываем выбор службы доставки
            document.querySelector('.delivery-service-selection').scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Настройка элементов управления картой
function setupMapControls() {
    // Обработчики будут добавлены при инициализации карты
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Проверяем, существует ли контейнер для уведомлений
    let container = document.querySelector('.toast-container');
    
    // Если контейнера нет, создаем его
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Создаем элемент уведомления
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Добавляем уведомление в контейнер
    container.appendChild(toast);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
