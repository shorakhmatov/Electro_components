// JavaScript для страницы избранного

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация страницы
    initFavoritesPage();
    
    // Добавляем обработчики событий
    setupEventListeners();
});

// Инициализация страницы избранного
function initFavoritesPage() {
    // Загружаем избранные товары с сервера
    loadFavorites();
}

// Загрузка избранных товаров
function loadFavorites() {
    console.log('Загрузка избранных товаров...');
    // Проверяем авторизацию
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            console.log('Статус авторизации:', data);
            if (!data.logged_in) {
                // Если пользователь не авторизован, показываем пустое состояние
                showEmptyState();
                console.log('Пользователь не авторизован');
                return;
            }
            
            // Загружаем избранные товары
            fetch('/api/favorites.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=get'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Ответ API избранного:', data);
                if (data.success && data.favorites) {
                    // Обновляем счетчик
                    updateFavoritesCount(data.favorites.count);
                    
                    // Отображаем товары
                    if (data.favorites.items && data.favorites.items.length > 0) {
                        console.log('Найдены избранные товары:', data.favorites.items);
                        renderFavorites(data.favorites.items);
                    } else {
                        console.log('Избранные товары не найдены');
                        showEmptyState();
                    }
                } else {
                    console.log('Ошибка при загрузке избранного:', data);
                    showEmptyState();
                }
            })
            .catch(error => {
                console.error('Error loading favorites:', error);
                showEmptyState();
                showToast('Ошибка при загрузке избранного', 'error');
            });
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            showEmptyState();
        });
}

// Отображение избранных товаров
function renderFavorites(items) {
    console.log('Отображение избранных товаров:', items);
    const favoritesContainer = document.getElementById('favoritesItems');
    const emptyState = document.getElementById('favoritesEmpty');
    
    if (!favoritesContainer) {
        console.error('Не найден контейнер для избранных товаров');
        return;
    }
    
    // Очищаем контейнер
    favoritesContainer.innerHTML = '';
    
    if (!items || items.length === 0) {
        // Показываем пустое состояние
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    // Скрываем пустое состояние
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Отображаем товары в сетке
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'favorites-item';
        itemElement.dataset.productId = item.product_id;
        
        // Проверяем наличие обязательных полей
        const name = item.name || 'Товар без названия';
        const description = item.description || 'Нет описания';
        const price = item.price || 0;
        const imageUrl = item.image_url || 'assets/images/no-image.png';
        
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${imageUrl}" alt="${name}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${name}</h3>
                <p class="item-description">${description}</p>
                <div class="item-footer">
                    <span class="item-price">${formatPrice(price)} ₽</span>
                    <div class="item-actions">
                        <button class="btn btn-primary add-to-cart" data-product-id="${item.product_id}">
                            <i class="fas fa-shopping-cart"></i> В корзину
                        </button>
                        <button class="btn-remove remove-favorite" data-product-id="${item.product_id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        favoritesContainer.appendChild(itemElement);
    });
}

// Показать пустое состояние
function showEmptyState() {
    const favoritesContainer = document.getElementById('favoritesItems');
    const emptyState = document.getElementById('favoritesEmpty');
    
    if (favoritesContainer) {
        favoritesContainer.innerHTML = '';
        favoritesContainer.style.display = 'none';
    }
    
    if (emptyState) {
        emptyState.style.display = 'block';
    }
}

// Обновление счетчика избранного
function updateFavoritesCount(count) {
    const favCount = document.getElementById('favoritesItemsCount');
    if (favCount) {
        favCount.textContent = count;
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Делегирование событий для кнопок на странице
    document.addEventListener('click', function(e) {
        // Обработка кнопки удаления из избранного
        if (e.target.closest('.remove-favorite')) {
            const btn = e.target.closest('.remove-favorite');
            const productId = btn.dataset.productId;
            if (productId) {
                e.preventDefault();
                removeFromFavorites(productId);
            }
        }
        
        // Обработка кнопки добавления в корзину
        if (e.target.closest('.add-to-cart')) {
            const btn = e.target.closest('.add-to-cart');
            const productId = btn.dataset.productId;
            if (productId) {
                e.preventDefault();
                addToCart(productId);
            }
        }
    });
}

// Удаление товара из избранного
function removeFromFavorites(productId) {
    // Проверяем авторизацию
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showToast('Пожалуйста, войдите в систему', 'error');
                return;
            }
            
            // Удаляем из избранного
            fetch('/api/favorites.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=remove&product_id=${productId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Показываем уведомление
                    showToast(data.message || 'Товар удален из избранного');
                    
                    // Обновляем счетчик в шапке
                    const favCount = document.getElementById('favoritesCount');
                    if (favCount && data.favorites && data.favorites.count !== undefined) {
                        favCount.textContent = data.favorites.count > 0 ? data.favorites.count : '';
                    }
                    
                    // Обновляем счетчик на странице
                    updateFavoritesCount(data.favorites.count);
                    
                    // Удаляем элемент из DOM
                    const item = document.querySelector(`.favorites-item[data-product-id="${productId}"]`);
                    if (item) {
                        item.remove();
                    }
                    
                    // Если больше нет товаров, показываем пустое состояние
                    const items = document.querySelectorAll('.favorites-item');
                    if (items.length === 0) {
                        showEmptyState();
                    }
                } else {
                    showToast(data.message || 'Ошибка при удалении из избранного', 'error');
                }
            })
            .catch(error => {
                console.error('Error removing from favorites:', error);
                showToast('Произошла ошибка. Попробуйте позже.', 'error');
            });
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            showToast('Произошла ошибка. Попробуйте позже.', 'error');
        });
}

// Добавление товара в корзину
function addToCart(productId, quantity = 1) {
    // Проверяем авторизацию
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showToast('Пожалуйста, войдите в систему для добавления товаров в корзину', 'error');
                return;
            }
            
            // Добавляем в корзину
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
                    showToast(data.message || 'Товар добавлен в корзину');
                    
                    // Обновляем счетчик в шапке
                    const cartCount = document.getElementById('cartCount');
                    if (cartCount && data.cart && data.cart.count !== undefined) {
                        cartCount.textContent = data.cart.count > 0 ? data.cart.count : '';
                    }
                } else {
                    showToast(data.message || 'Ошибка при добавлении в корзину', 'error');
                }
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                showToast('Произошла ошибка. Попробуйте позже.', 'error');
            });
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            showToast('Произошла ошибка. Попробуйте позже.', 'error');
        });
}

// Форматирование цены
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

// Показать уведомление
function showToast(message, type = 'success') {
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
