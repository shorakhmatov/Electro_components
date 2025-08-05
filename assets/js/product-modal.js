// Функции для работы с модальным окном товара
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация модального окна
    initProductModal();
});

// Инициализация модального окна и обработчиков событий
function initProductModal() {
    // Получаем модальное окно
    const modal = document.getElementById('productModal');
    
    // Если модальное окно не найдено, выходим
    if (!modal) return;
    
    // Получаем кнопку закрытия
    const closeBtn = modal.querySelector('.close-modal');
    
    // Обработчик для закрытия модального окна при клике на кнопку закрытия
    closeBtn.addEventListener('click', function() {
        closeProductModal();
    });
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeProductModal();
        }
    });
    
    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeProductModal();
        }
    });
    
    // Добавляем обработчики для всех карточек товаров на странице
    addProductCardListeners();
    
    // Инициализация кнопок в модальном окне
    initModalButtons();
}

// Добавление обработчиков событий для карточек товаров
function addProductCardListeners() {
    // Находим все карточки товаров на странице
    const productCards = document.querySelectorAll('.product-card');
    
    console.log('Found product cards:', productCards.length);
    
    // Для каждой карточки добавляем обработчик клика
    productCards.forEach(card => {
        // Находим изображение и заголовок товара для клика
        const productImage = card.querySelector('.product-card__image img');
        const productTitle = card.querySelector('h3');
        
        // Получаем ID товара из атрибута data-product-id
        const productId = card.getAttribute('data-product-id') || 
                         card.querySelector('[data-product-id]')?.getAttribute('data-product-id');
        
        console.log('Product card:', card, 'Product ID:', productId);
        
        // Добавляем обработчик клика на изображение товара
        if (productImage) {
            productImage.style.cursor = 'pointer';
            productImage.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                if (productId) {
                    console.log('Opening modal for product ID:', productId);
                    openProductModal(productId);
                } else {
                    console.error('Product ID not found for card:', card);
                }
            });
        }
        
        // Добавляем обработчик клика на заголовок товара
        if (productTitle) {
            productTitle.style.cursor = 'pointer';
            productTitle.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                if (productId) {
                    console.log('Opening modal for product ID:', productId);
                    openProductModal(productId);
                } else {
                    console.error('Product ID not found for card:', card);
                }
            });
        }
    });
}

// Функция для открытия модального окна с данными товара
function openProductModal(productId) {
    // Получаем данные о товаре через AJAX
    fetchProductData(productId)
        .then(productData => {
            // Заполняем модальное окно данными
            fillProductModal(productData);
            
            // Показываем модальное окно
            document.getElementById('productModal').style.display = 'block';
            
            // Блокируем прокрутку страницы
            document.body.style.overflow = 'hidden';
        })
        .catch(error => {
            console.error('Ошибка при получении данных о товаре:', error);
        });
}

// Функция для закрытия модального окна
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    
    // Разблокируем прокрутку страницы
    document.body.style.overflow = '';
}

// Функция для получения данных о товаре через AJAX
function fetchProductData(productId) {
    return new Promise((resolve, reject) => {
        // Создаем объект XMLHttpRequest
        const xhr = new XMLHttpRequest();
        
        // Настраиваем запрос
        xhr.open('GET', `/api/products.php?action=getById&id=${productId}`, true);
        
        // Обработчик загрузки
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success && response.product) {
                        resolve(response.product);
                    } else {
                        reject(new Error('Не удалось получить данные о товаре'));
                    }
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error(`Ошибка HTTP: ${xhr.status}`));
            }
        };
        
        // Обработчик ошибки
        xhr.onerror = function() {
            reject(new Error('Ошибка сети'));
        };
        
        // Отправляем запрос
        xhr.send();
    });
}

// Функция для заполнения модального окна данными о товаре
function fillProductModal(productData) {
    // Заполняем основные данные
    document.getElementById('modalProductName').textContent = productData.name;
    document.getElementById('modalProductPrice').textContent = formatPrice(productData.price);
    document.getElementById('modalProductDescription').innerHTML = formatDescription(productData.description);
    
    // Устанавливаем изображение товара
    const productImage = document.getElementById('modalProductImage');
    if (productData.image_url) {
        productImage.src = productData.image_url;
        productImage.alt = productData.name;
        productImage.style.display = 'block';
    } else {
        productImage.src = '/assets/images/products/default.jpg';
        productImage.alt = 'Изображение отсутствует';
        productImage.style.display = 'block';
    }
    
    // Устанавливаем максимальное количество
    const quantityInput = document.getElementById('modalQuantityInput');
    quantityInput.max = Math.min(productData.quantity, 99);
    quantityInput.value = 1;
    
    // Заполняем характеристики товара
    fillProductCharacteristics(productData);
    
    // Устанавливаем ID товара для кнопок
    document.getElementById('modalAddToCartBtn').dataset.productId = productData.id;
    document.getElementById('modalAddToFavoritesBtn').dataset.productId = productData.id;
    
    // Проверяем, находится ли товар в избранном
    checkFavoriteStatus(productData.id);
    
    // Выводим в консоль информацию об изображении для отладки
    console.log('Product image URL:', productData.image_url);
}

// Функция для форматирования описания
function formatDescription(description) {
    if (!description) return 'Описание отсутствует';
    
    // Заменяем переносы строк на HTML-теги
    description = description.replace(/\n/g, '<br>');
    
    // Выделяем важные фразы
    const importantPhrases = [
        'важно', 'внимание', 'обратите внимание', 'примечание', 
        'note', 'important', 'warning', 'caution'
    ];
    
    importantPhrases.forEach(phrase => {
        const regex = new RegExp(`(${phrase})[:\\s]`, 'gi');
        description = description.replace(regex, '<strong>$1:</strong> ');
    });
    
    return description;
}

// Функция для заполнения характеристик товара
function fillProductCharacteristics(productData) {
    const characteristicsList = document.getElementById('modalProductCharacteristics');
    characteristicsList.innerHTML = '';
    
    // Добавляем основные характеристики из данных товара
    const characteristics = [
        { name: 'Категория', value: productData.category_name },
        { name: 'На складе', value: `${productData.quantity} шт.` }
    ];
    
    // Выводим в консоль данные о товаре для отладки
    console.log('Product data:', productData);
    
    // Добавляем технические характеристики из specifications, если они есть
    if (productData.specifications) {
        console.log('Specifications:', productData.specifications);
        
        // Если specifications уже является объектом
        if (typeof productData.specifications === 'object' && productData.specifications !== null) {
            for (const [key, value] of Object.entries(productData.specifications)) {
                characteristics.push({ name: key, value: value });
            }
        } 
        // Если specifications является строкой, пытаемся распарсить JSON
        else if (typeof productData.specifications === 'string' && productData.specifications.trim() !== '') {
            try {
                const parsedSpecs = JSON.parse(productData.specifications);
                if (typeof parsedSpecs === 'object' && parsedSpecs !== null) {
                    for (const [key, value] of Object.entries(parsedSpecs)) {
                        characteristics.push({ name: key, value: value });
                    }
                }
            } catch (e) {
                console.error('Ошибка при парсинге спецификаций:', e);
                // Если не удалось распарсить JSON, добавляем как есть
                characteristics.push({ name: 'Спецификации', value: productData.specifications });
            }
        }
    }
    
    // Добавляем дополнительные характеристики из characteristics, если они есть
    if (productData.characteristics) {
        console.log('Characteristics:', productData.characteristics);
        
        // Если characteristics уже является объектом
        if (typeof productData.characteristics === 'object' && productData.characteristics !== null) {
            for (const [key, value] of Object.entries(productData.characteristics)) {
                // Проверяем, нет ли уже такой характеристики
                if (!characteristics.some(char => char.name.toLowerCase() === key.toLowerCase())) {
                    characteristics.push({ name: key, value: value });
                }
            }
        } 
        // Если characteristics является строкой, пытаемся распарсить JSON
        else if (typeof productData.characteristics === 'string' && productData.characteristics.trim() !== '') {
            try {
                const parsedChars = JSON.parse(productData.characteristics);
                if (typeof parsedChars === 'object' && parsedChars !== null) {
                    for (const [key, value] of Object.entries(parsedChars)) {
                        // Проверяем, нет ли уже такой характеристики
                        if (!characteristics.some(char => char.name.toLowerCase() === key.toLowerCase())) {
                            characteristics.push({ name: key, value: value });
                        }
                    }
                }
            } catch (e) {
                console.error('Ошибка при парсинге характеристик:', e);
                // Если не удалось распарсить JSON, добавляем как есть
                characteristics.push({ name: 'Характеристики', value: productData.characteristics });
            }
        }
    }
    
    console.log('Final characteristics to display:', characteristics);
    
    // Добавляем все характеристики в список
    characteristics.forEach(char => {
        if (char.value) {
            addCharacteristic(characteristicsList, char.name, char.value);
        }
    });
    
    // Если характеристик нет, добавляем сообщение
    if (characteristicsList.children.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Нет доступных характеристик';
        characteristicsList.appendChild(li);
    }
}

// Функция для добавления характеристики в список
function addCharacteristic(list, name, value) {
    const li = document.createElement('li');
    
    // Форматируем значение в зависимости от типа
    let formattedValue = value;
    
    // Если значение - число, добавляем единицы измерения для некоторых характеристик
    if (!isNaN(value) && typeof name === 'string') {
        const nameLower = name.toLowerCase();
        
        if (nameLower.includes('вес') || nameLower.includes('масса')) {
            formattedValue = `${value} г`;
        } else if (nameLower.includes('размер') || nameLower.includes('габарит') || 
                  nameLower.includes('длина') || nameLower.includes('ширина') || 
                  nameLower.includes('высота') || nameLower.includes('диаметр')) {
            formattedValue = `${value} мм`;
        } else if (nameLower.includes('напряжение')) {
            formattedValue = `${value} В`;
        } else if (nameLower.includes('ток')) {
            formattedValue = `${value} А`;
        } else if (nameLower.includes('мощность')) {
            formattedValue = `${value} Вт`;
        } else if (nameLower.includes('частота')) {
            formattedValue = `${value} Гц`;
        } else if (nameLower.includes('сопротивление') || nameLower.includes('резистор')) {
            if (value >= 1000000) {
                formattedValue = `${(value / 1000000).toFixed(1)} МОм`;
            } else if (value >= 1000) {
                formattedValue = `${(value / 1000).toFixed(1)} кОм`;
            } else {
                formattedValue = `${value} Ом`;
            }
        } else if (nameLower.includes('емкость') || nameLower.includes('конденсатор')) {
            if (value >= 1000000) {
                formattedValue = `${(value / 1000000).toFixed(1)} Ф`;
            } else if (value >= 1000) {
                formattedValue = `${(value / 1000).toFixed(1)} мФ`;
            } else if (value >= 1) {
                formattedValue = `${value} мкФ`;
            } else {
                formattedValue = `${value * 1000} нФ`;
            }
        }
    }
    
    // Форматируем значения типа "да/нет"
    if (typeof value === 'string') {
        const valueLower = value.toLowerCase();
        if (valueLower === 'да' || valueLower === 'yes' || valueLower === 'true') {
            formattedValue = '<span class="value-yes">Да</span>';
        } else if (valueLower === 'нет' || valueLower === 'no' || valueLower === 'false') {
            formattedValue = '<span class="value-no">Нет</span>';
        }
    }
    
    li.innerHTML = `<strong>${name}:</strong> ${formattedValue}`;
    list.appendChild(li);
}

// Функция для форматирования цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Функция для проверки статуса избранного
function checkFavoriteStatus(productId) {
    const favoriteBtn = document.getElementById('modalAddToFavoritesBtn');
    const favorites = getFavorites();
    
    if (favorites.includes(parseInt(productId))) {
        favoriteBtn.classList.add('active');
        favoriteBtn.querySelector('i').classList.remove('far');
        favoriteBtn.querySelector('i').classList.add('fas');
    } else {
        favoriteBtn.classList.remove('active');
        favoriteBtn.querySelector('i').classList.remove('fas');
        favoriteBtn.querySelector('i').classList.add('far');
    }
}

// Функция для получения списка избранных товаров
function getFavorites() {
    const favoritesJson = localStorage.getItem('favorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
}

// Инициализация кнопок в модальном окне
function initModalButtons() {
    // Кнопка добавления в корзину
    const addToCartBtn = document.getElementById('modalAddToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const quantity = parseInt(document.getElementById('modalQuantityInput').value);
            
            if (productId && quantity > 0) {
                addToCart(productId, quantity);
            }
        });
    }
    
    // Кнопка добавления в избранное
    const addToFavoritesBtn = document.getElementById('modalAddToFavoritesBtn');
    if (addToFavoritesBtn) {
        addToFavoritesBtn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            
            if (productId) {
                toggleFavorite(productId);
            }
        });
    }
}

// Функция для добавления товара в корзину
function addToCart(productId, quantity) {
    console.log(`Добавление товара из модального окна ID: ${productId}, количество: ${quantity}`);
    
    // Проверяем авторизацию
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showNotification('Пожалуйста, войдите в систему для добавления товаров в корзину', 'error');
                return;
            }
            
            // Добавляем товар в корзину
            fetch('/api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=add&product_id=${productId}&quantity=${quantity}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Показываем уведомление
                    if (typeof window.showToast === 'function') {
                        window.showToast(data.message || 'Товар добавлен в корзину');
                    } else {
                        showNotification(data.message || 'Товар добавлен в корзину', 'success');
                    }
                    
                    // Обновляем счетчик в шапке
                    const cartCount = document.getElementById('cartCount');
                    if (cartCount && data.cart && data.cart.count !== undefined) {
                        cartCount.textContent = data.cart.count > 0 ? data.cart.count : '';
                    }
                    
                    // Закрываем модальное окно после успешного добавления
                    setTimeout(() => {
                        closeProductModal();
                    }, 1000);
                } else {
                    if (typeof window.showToast === 'function') {
                        window.showToast(data.message || 'Ошибка при добавлении в корзину', 'error');
                    } else {
                        showNotification(data.message || 'Ошибка при добавлении в корзину', 'error');
                    }
                }
            })
            .catch(error => {
                console.error('Ошибка при добавлении в корзину:', error);
                if (typeof window.showToast === 'function') {
                    window.showToast('Произошла ошибка. Попробуйте позже.', 'error');
                } else {
                    showNotification('Произошла ошибка. Попробуйте позже.', 'error');
                }
            });
        })
        .catch(error => {
            console.error('Ошибка при проверке авторизации:', error);
            if (typeof window.showToast === 'function') {
                window.showToast('Произошла ошибка. Попробуйте позже.', 'error');
            } else {
                showNotification('Произошла ошибка. Попробуйте позже.', 'error');
            }
        });
}

// Функция для переключения статуса избранного
function toggleFavorite(productId) {
    const favorites = getFavorites();
    const productIdInt = parseInt(productId);
    const index = favorites.indexOf(productIdInt);
    
    if (index === -1) {
        // Добавляем в избранное
        favorites.push(productIdInt);
        showNotification('Товар добавлен в избранное', 'success');
    } else {
        // Удаляем из избранного
        favorites.splice(index, 1);
        showNotification('Товар удален из избранного', 'info');
    }
    
    // Сохраняем обновленный список избранного
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Обновляем статус кнопки
    checkFavoriteStatus(productId);
    
    // Обновляем счетчик избранных товаров, если он есть
    updateFavoritesCounter();
}

// Функция для обновления счетчика товаров в корзине
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        // Получаем текущее количество товаров в корзине
        fetch('/api/cart.php?action=count')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    cartCounter.textContent = data.count;
                    if (data.count > 0) {
                        cartCounter.style.display = 'flex';
                    } else {
                        cartCounter.style.display = 'none';
                    }
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении счетчика корзины:', error);
            });
    }
}

// Функция для обновления счетчика избранных товаров
function updateFavoritesCounter() {
    const favCounter = document.querySelector('.favorites-counter');
    if (favCounter) {
        const favorites = getFavorites();
        favCounter.textContent = favorites.length;
        if (favorites.length > 0) {
            favCounter.style.display = 'flex';
        } else {
            favCounter.style.display = 'none';
        }
    }
}

// Функция для показа уведомления
function showNotification(message, type = 'info') {
    // Проверяем, существует ли функция showToast
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        // Если функция showToast не существует, создаем простое уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Скрываем и удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Функции для изменения количества товара в модальном окне
function incrementModalQuantity() {
    const input = document.getElementById('modalQuantityInput');
    const maxValue = parseInt(input.getAttribute('max') || 99);
    const currentValue = parseInt(input.value);
    
    if (currentValue < maxValue) {
        input.value = currentValue + 1;
    }
}

function decrementModalQuantity() {
    const input = document.getElementById('modalQuantityInput');
    const minValue = parseInt(input.getAttribute('min') || 1);
    const currentValue = parseInt(input.value);
    
    if (currentValue > minValue) {
        input.value = currentValue - 1;
    }
}
