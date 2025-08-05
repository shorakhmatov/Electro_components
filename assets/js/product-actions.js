// Общие функции для работы с товарами (избранное и корзина)

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

// Добавление товара в избранное
async function addToFavorites(productId) {
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
            body: `action=add&product_id=${productId}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message || 'Товар добавлен в избранное');
            updateFavoritesUI(data.favorites);
            return true;
        } else {
            showToast(data.message || 'Ошибка при добавлении в избранное', 'error');
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
        showToast('Произошла ошибка. Попробуйте позже.', 'error');
    }
    
    return false;
}

// Удаление товара из избранного
async function removeFromFavorites(productId) {
    // Проверяем авторизацию
    const auth = await checkUserAuth();
    
    if (!auth.isLoggedIn) {
        showAuthPrompt('Пожалуйста, войдите в систему');
        return;
    }
    
    try {
        const response = await fetch('/api/favorites.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=remove&product_id=${productId}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message || 'Товар удален из избранного');
            updateFavoritesUI(data.favorites);
            return true;
        } else {
            showToast(data.message || 'Ошибка при удалении из избранного', 'error');
        }
    } catch (error) {
        console.error('Error removing from favorites:', error);
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
            updateFavoritesUI(data.favorites);
            
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

// Обновление UI для избранного
function updateFavoritesUI(favoritesData) {
    if (!favoritesData) return;
    
    // Обновляем счетчик в шапке
    const favCount = document.getElementById('favoritesCount');
    if (favCount && favoritesData.count !== undefined) {
        favCount.textContent = favoritesData.count > 0 ? favoritesData.count : '';
    }
    
    // Если мы на странице избранного, обновляем список
    if (window.location.pathname.includes('favorites.php')) {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const favoritesEmpty = document.getElementById('favoritesEmpty');
        
        if (favoritesGrid && favoritesEmpty) {
            if (favoritesData.items && favoritesData.items.length > 0) {
                favoritesGrid.style.display = 'grid';
                favoritesEmpty.style.display = 'none';
                
                // Обновляем список избранных товаров
                // Эта часть зависит от структуры HTML на странице
            } else {
                favoritesGrid.style.display = 'none';
                favoritesEmpty.style.display = 'block';
            }
        }
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
            updateCartUI(data.cart);
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

// Обновление количества товара в корзине
async function updateCartQuantity(productId, quantity) {
    // Проверяем авторизацию
    const auth = await checkUserAuth();
    
    if (!auth.isLoggedIn) {
        showAuthPrompt('Пожалуйста, войдите в систему');
        return;
    }
    
    try {
        const response = await fetch('/api/cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=update&product_id=${productId}&quantity=${quantity}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message || 'Количество обновлено');
            updateCartUI(data.cart);
            return true;
        } else {
            showToast(data.message || 'Ошибка при обновлении количества', 'error');
        }
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        showToast('Произошла ошибка. Попробуйте позже.', 'error');
    }
    
    return false;
}

// Удаление товара из корзины
async function removeFromCart(productId) {
    // Проверяем авторизацию
    const auth = await checkUserAuth();
    
    if (!auth.isLoggedIn) {
        showAuthPrompt('Пожалуйста, войдите в систему');
        return;
    }
    
    try {
        const response = await fetch('/api/cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=remove&product_id=${productId}`
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(data.message || 'Товар удален из корзины');
            updateCartUI(data.cart);
            return true;
        } else {
            showToast(data.message || 'Ошибка при удалении из корзины', 'error');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        showToast('Произошла ошибка. Попробуйте позже.', 'error');
    }
    
    return false;
}

// Обновление UI для корзины
function updateCartUI(cartData) {
    if (!cartData) return;
    
    // Обновляем счетчик в шапке
    const cartCount = document.getElementById('cartCount');
    if (cartCount && cartData.count !== undefined) {
        cartCount.textContent = cartData.count > 0 ? cartData.count : '';
    }
    
    // Если мы на странице корзины, обновляем список
    if (window.location.pathname.includes('cart.php')) {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartItems && cartEmpty) {
            if (cartData.items && cartData.items.length > 0) {
                if (cartEmpty) cartEmpty.style.display = 'none';
                
                // Обновляем список товаров в корзине
                // Эта часть зависит от структуры HTML на странице
                
                // Обновляем общую сумму
                if (cartTotal && cartData.total !== undefined) {
                    cartTotal.textContent = `${cartData.total} ₽`;
                }
            } else {
                if (cartItems) cartItems.innerHTML = '';
                if (cartEmpty) cartEmpty.style.display = 'block';
                if (cartTotal) cartTotal.textContent = '0 ₽';
            }
        }
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем обработчики для кнопок избранного
    document.querySelectorAll('.btn-favorite, .favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.dataset.productId;
            if (productId) {
                toggleFavorite(productId);
            }
        });
    });
    
    // Добавляем обработчики для кнопок корзины
    document.querySelectorAll('.btn-cart, .add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.dataset.productId;
            if (productId) {
                // Ищем поле количества
                let quantity = 1;
                const quantityInput = btn.closest('.product-card, .product-item')?.querySelector('.quantity-input');
                if (quantityInput) {
                    quantity = parseInt(quantityInput.value) || 1;
                }
                addToCart(productId, quantity);
            }
        });
    });
});
