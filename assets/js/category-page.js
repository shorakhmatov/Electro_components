// JavaScript для страницы категорий

document.addEventListener('DOMContentLoaded', function() {
    // Загружаем товары категории
    loadCategoryProducts();
    
    // Добавляем обработчики для кнопок избранного и корзины
    setupEventListeners();
});

// Получаем ID категории из URL
function getCategoryIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 1; // По умолчанию возвращаем ID 1
}

// Загружаем товары категории
function loadCategoryProducts() {
    const categoryId = getCategoryIdFromUrl();
    const productsContainer = document.querySelector('.products-grid');
    
    if (!productsContainer) return;
    
    // Показываем индикатор загрузки
    productsContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Загружаем товары из API
    fetch(`/api/products.php?action=getByCategory&category_id=${categoryId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.products && data.products.length > 0) {
                // Отображаем товары
                productsContainer.innerHTML = data.products.map(product => createProductCard(product)).join('');
                
                // Проверяем статус избранного для всех товаров
                checkFavoritesStatus();
            } else {
                // Если товаров нет
                productsContainer.innerHTML = '<div class="empty-category">В данной категории пока нет товаров</div>';
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productsContainer.innerHTML = '<div class="error-message">Ошибка при загрузке товаров. Пожалуйста, попробуйте позже.</div>';
        });
}

// Создаем карточку товара
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image_url || '/assets/images/no-image.jpg'}" alt="${product.name}">
                <button class="favorite-btn" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description || ''}</p>
            <div class="product-price">${product.price} ₽</div>
            <div class="product-controls">
                <div class="quantity-control">
                    <button class="quantity-btn minus-btn" onclick="decrementQuantity(this)">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="99" oninput="validateQuantity(this)">
                    <button class="quantity-btn plus-btn" onclick="incrementQuantity(this)">+</button>
                </div>
                <button class="add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                    В корзину
                </button>
            </div>
        </div>
    `;
}

// Настраиваем обработчики событий
function setupEventListeners() {
    // Делегирование событий для кнопок на странице
    document.addEventListener('click', function(e) {
        // Обработка кнопки добавления в избранное
        if (e.target.closest('.favorite-btn')) {
            const btn = e.target.closest('.favorite-btn');
            const productId = btn.dataset.productId;
            if (productId) {
                e.preventDefault();
                toggleFavorite(productId);
            }
        }
        
        // Обработка кнопки добавления в корзину
        if (e.target.closest('.add-to-cart')) {
            const btn = e.target.closest('.add-to-cart');
            const productId = btn.dataset.productId;
            if (productId) {
                e.preventDefault();
                
                // Находим количество
                const productCard = btn.closest('.product-card');
                const quantityInput = productCard.querySelector('.quantity-input');
                const quantity = parseInt(quantityInput.value) || 1;
                
                addToCart(productId, quantity);
            }
        }
    });
}

// Функция для увеличения количества товара
function incrementQuantity(button) {
    const input = button.parentNode.querySelector('.quantity-input');
    const maxValue = parseInt(input.getAttribute('max') || 99);
    const currentValue = parseInt(input.value);

    if (currentValue < maxValue) {
        input.value = currentValue + 1;
    }
}

// Функция для уменьшения количества товара
function decrementQuantity(button) {
    const input = button.parentNode.querySelector('.quantity-input');
    const minValue = parseInt(input.getAttribute('min') || 1);
    const currentValue = parseInt(input.value);

    if (currentValue > minValue) {
        input.value = currentValue - 1;
    }
}

// Функция для валидации введенного количества
function validateQuantity(input) {
    let value = parseInt(input.value);
    const minValue = parseInt(input.getAttribute('min') || 1);
    const maxValue = parseInt(input.getAttribute('max') || 99);

    if (isNaN(value) || value < minValue) {
        input.value = minValue;
    } else if (value > maxValue) {
        input.value = maxValue;
    }
}

// Проверяем статус избранного для всех товаров на странице
function checkFavoritesStatus() {
    // Собираем все ID товаров на странице
    const productIds = [];
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        if (productId) productIds.push(productId);
    });
    
    if (productIds.length === 0) return;
    
    // Запрашиваем статус избранного для всех товаров
    fetch('/api/favorites_check.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `product_ids=${productIds.join(',')}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.favorites && data.favorites.items) {
            // Обновляем иконки избранного
            const favoriteItems = data.favorites.items;
            document.querySelectorAll('.favorite-btn').forEach(btn => {
                const productId = parseInt(btn.dataset.productId);
                const icon = btn.querySelector('i');
                if (productId && icon && favoriteItems.includes(productId)) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            });
            
            // Обновляем счетчик в шапке
            const favCount = document.getElementById('favoritesCount');
            if (favCount && data.favorites.count !== undefined) {
                favCount.textContent = data.favorites.count > 0 ? data.favorites.count : '';
            }
        }
    })
    .catch(error => {
        console.error('Error checking favorites status:', error);
    });
}

// Добавление товара в избранное
function toggleFavorite(productId) {
    // Проверяем авторизацию
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showAuthPrompt('Пожалуйста, войдите в систему для добавления товаров в избранное');
                return;
            }
            
            // Добавляем в избранное
            fetch('/api/favorites.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=toggle&product_id=${productId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Показываем уведомление
                    showToast(data.message);
                    
                    // Обновляем иконку избранного
                    const buttons = document.querySelectorAll(`.favorite-btn[data-product-id="${productId}"]`);
                    buttons.forEach(button => {
                        const icon = button.querySelector('i');
                        if (icon) {
                            if (data.favorites.status) {
                                icon.classList.remove('far');
                                icon.classList.add('fas');
                            } else {
                                icon.classList.remove('fas');
                                icon.classList.add('far');
                            }
                        }
                    });
                    
                    // Обновляем счетчик в шапке
                    const favCount = document.getElementById('favoritesCount');
                    if (favCount && data.favorites.count !== undefined) {
                        favCount.textContent = data.favorites.count > 0 ? data.favorites.count : '';
                    }
                } else {
                    showToast(data.message || 'Ошибка при обновлении избранного', 'error');
                }
            })
            .catch(error => {
                console.error('Error toggling favorite:', error);
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
                showAuthPrompt('Пожалуйста, войдите в систему для добавления товаров в корзину');
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

// Показать модальное окно авторизации или сообщение
function showAuthPrompt(message) {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        // Если есть модальное окно авторизации, показываем его
        authModal.style.display = 'flex';
        // Если есть элемент для сообщения, устанавливаем текст
        const authMessage = document.getElementById('authMessage');
        if (authMessage) {
            authMessage.textContent = message;
        }
    } else {
        // Если нет модального окна, показываем сообщение
        alert(message);
    }
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
