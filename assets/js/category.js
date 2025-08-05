// Получаем категорию из URL
function getCategoryFromUrl() {
    const path = window.location.pathname;
    const category = path.split('/').pop().replace('.html', '');
    return category;
}

// Создаем карточку товара
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="favorite-btn" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price} ₽</div>
            <div class="product-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="decrementQuantity(this)">-</button>
                    <input type="number" class="quantity-input" value="1" min="1" max="99">
                    <button class="quantity-btn" onclick="incrementQuantity(this)">+</button>
                </div>
                <button class="add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                    В корзину
                </button>
            </div>
        </div>
    `;
}

// Загружаем товары выбранной категории
function loadProducts() {
    const category = getCategoryFromUrl();
    const categoryId = getCategoryId(category);
    
    // Загружаем товары из API
    fetch(`/api/products.php?action=getByCategory&category_id=${categoryId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.products) {
                const container = document.querySelector('.category-grid');
                if (container && data.products.length > 0) {
                    container.innerHTML = data.products.map(product => createProductCard(product)).join('');
                    // Проверяем статус избранного для всех товаров
                    checkFavoritesStatus();
                } else if (container) {
                    container.innerHTML = '<div class="empty-category">В данной категории пока нет товаров</div>';
                }
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            const container = document.querySelector('.category-grid');
            if (container) {
                container.innerHTML = '<div class="error-message">Ошибка при загрузке товаров. Пожалуйста, попробуйте позже.</div>';
            }
        });
}

// Получаем ID категории по её URL-имени
function getCategoryId(categoryName) {
    // Маппинг имен категорий на их ID
    const categoryMap = {
        'arduino': 1,
        'raspberry': 2,
        'sensors': 3,
        'displays': 4,
        'motors': 5,
        'components': 6
    };
    
    return categoryMap[categoryName] || 1; // По умолчанию возвращаем ID 1, если категория не найдена
}

// Проверяем статус избранного для всех товаров на странице
function checkFavoritesStatus() {
    // Проверяем авторизацию
    checkUserAuth().then(auth => {
        if (!auth.isLoggedIn) return;
        
        // Собираем все ID товаров на странице
        const productIds = [];
        document.querySelectorAll('.favorite-btn, .btn-favorite').forEach(btn => {
            const productId = btn.dataset.productId;
            if (productId) productIds.push(productId);
        });
        
        if (productIds.length === 0) return;
        
        // Запрашиваем статус избранного для всех товаров
        fetch('/api/favorites.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=check_multiple&product_ids=${productIds.join(',')}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.favorites && data.favorites.items) {
                // Обновляем иконки избранного
                const favoriteItems = data.favorites.items;
                document.querySelectorAll('.favorite-btn, .btn-favorite').forEach(btn => {
                    const productId = btn.dataset.productId;
                    const icon = btn.querySelector('i');
                    if (productId && icon && favoriteItems.includes(parseInt(productId))) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error checking favorites status:', error);
        });
    });
}

// Function to increment quantity
function incrementQuantity(button) {
    const input = button.parentNode.querySelector('.quantity-input');
    const maxValue = parseInt(input.getAttribute('max') || 99);
    const currentValue = parseInt(input.value);

    if (currentValue < maxValue) {
        input.value = currentValue + 1;
    }
}

// Function to decrement quantity
function decrementQuantity(button) {
    const input = button.parentNode.querySelector('.quantity-input');
    const minValue = parseInt(input.getAttribute('min') || 1);
    const currentValue = parseInt(input.value);

    if (currentValue > minValue) {
        input.value = currentValue - 1;
    }
}

// Function to validate quantity input
function validateQuantity(input) {
    let value = parseInt(input.value);
    const minValue = parseInt(input.getAttribute('min') || 1);
    const maxValue = parseInt(input.getAttribute('max') || 99);

    if (isNaN(value) || value < minValue) {
        value = minValue;
    } else if (value > maxValue) {
        value = maxValue;
    }

    input.value = value;
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

// Проверка авторизации пользователя
async function checkUserAuth() {
    try {
        const response = await fetch('/api/auth_status.php');
        const data = await response.json();
        return {
            isLoggedIn: data.logged_in,
            userId: data.user_id
        };
    } catch (error) {
        console.error('Error checking auth status:', error);
        return { isLoggedIn: false, userId: null };
    }
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

// Добавление товара в корзину
async function addToCart(productId, quantity = 1) {
    // Проверяем авторизацию
    const auth = await checkUserAuth();
    
    if (!auth.isLoggedIn) {
        showAuthPrompt('Пожалуйста, войдите в систему для добавления товаров в корзину');
        return;
    }
    
    try {
        const response = await fetch('/api/cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=add&product_id=${productId}&quantity=${quantity}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message || 'Товар добавлен в корзину');
            // Обновляем счетчик в шапке
            const cartCount = document.getElementById('cartCount');
            if (cartCount && data.cart && data.cart.count !== undefined) {
                cartCount.textContent = data.cart.count > 0 ? data.cart.count : '';
            }
            return true;
        } else {
            showToast(data.message || 'Ошибка при добавлении в корзину', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Произошла ошибка. Попробуйте позже.', 'error');
    }
    
    return false;
}

// Переключение статуса избранного
async function toggleFavorite(productId) {
    // Проверяем авторизацию
    const auth = await checkUserAuth();
    
    if (!auth.isLoggedIn) {
        showAuthPrompt('Пожалуйста, войдите в систему для добавления товаров в избранное');
        return;
    }
    
    try {
        const response = await fetch('/api/favorites.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=toggle&product_id=${productId}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message);
            
            // Обновляем иконку избранного
            const buttons = document.querySelectorAll(`.btn-favorite[data-product-id="${productId}"], .favorite-btn[data-product-id="${productId}"]`);
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
            
            return true;
        } else {
            showToast(data.message || 'Ошибка при обновлении избранного', 'error');
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showToast('Произошла ошибка. Попробуйте позже.', 'error');
    }
    
    return false;
}

//                 // Update favorites count in header
//                 const favoritesCount = document.getElementById('favoritesCount');
//                 if (favoritesCount) {
//                     favoritesCount.textContent = data.favorites.count > 0 ? data.favorites.count : '';
//                 }
//             } else {
//                 showToast(data.message, 'error');
//             }
//         })
//         .catch(error => {
//             console.error('Error toggling favorite:', error);
//             showToast('Произошла ошибка. Попробуйте позже.', 'error');
//         });
// }

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Загружаем товары
    loadProducts();
    
    // Добавляем обработчики для кнопок избранного и корзины
    document.addEventListener('click', function(e) {
        // Обработка кнопок избранного
        if (e.target.closest('.btn-favorite, .favorite-btn')) {
            const btn = e.target.closest('.btn-favorite, .favorite-btn');
            const productId = btn.dataset.productId;
            if (productId) {
                e.preventDefault();
                toggleFavorite(productId);
            }
        }
        
        // Обработка кнопок корзины
        if (e.target.closest('.btn-cart, .add-to-cart')) {
            const btn = e.target.closest('.btn-cart, .add-to-cart');
            const productId = btn.dataset.productId;
            if (productId) {
                e.preventDefault();
                
                // Ищем поле количества
                let quantity = 1;
                const productCard = btn.closest('.product-card, .product-item');
                if (productCard) {
                    const quantityInput = productCard.querySelector('.quantity-input');
                    if (quantityInput) {
                        quantity = parseInt(quantityInput.value) || 1;
                    }
                }
                
                addToCart(productId, quantity);
            }
        }
    });

    if (favoriteButtons.length > 0) {
        // Only check if user is logged in and there are products
        fetch('/api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=check`,
        })
            .then(response => response.json())
            .then(data => {
                if (data.logged_in) {
                    favoriteButtons.forEach(button => {
                        const productId = button.getAttribute('data-product-id');
                        fetch('/api/favorites.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `action=check&product_id=${productId}`,
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success && data.favorites.status) {
                                    const icon = button.querySelector('i');
                                    icon.classList.remove('far');
                                    icon.classList.add('fas');
                                }
                            })
                            .catch(error => console.error('Error checking favorite status:', error));
                    });
                }
            })
            .catch(error => console.error('Error checking auth status:', error));
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
