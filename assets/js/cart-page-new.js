// JavaScript для страницы корзины

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация страницы
    initCartPage();
    
    // Добавляем обработчики событий
    setupEventListeners();
});

// Инициализация страницы корзины
function initCartPage() {
    // Загружаем товары корзины с сервера
    loadCart();
}

// Загрузка товаров корзины
function loadCart() {
    // Проверяем авторизацию
    fetch('api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                // Если пользователь не авторизован, показываем пустое состояние
                showEmptyState();
                return;
            }
            
            // Загружаем товары корзины
            fetch('api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=get'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.cart && data.cart.items) {
                    // Обновляем счетчик
                    updateCartCount(data.cart.count);
                    
                    // Отображаем товары
                    if (data.cart.items.length > 0) {
                        renderCart(data.cart.items, data.cart.total);
                    } else {
                        showEmptyState();
                    }
                } else {
                    showEmptyState();
                }
            })
            .catch(error => {
                console.error('Error loading cart:', error);
                showEmptyState();
                showToast('Ошибка при загрузке корзины', 'error');
            });
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            showEmptyState();
        });
}

// Отображение товаров корзины
function renderCart(items, total) {
    const cartContainer = document.getElementById('cartItems');
    const emptyState = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartContainer) return;
    
    // Скрываем пустое состояние
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Показываем сводку корзины
    if (cartSummary) {
        cartSummary.style.display = 'block';
    }
    
    // Очищаем контейнер
    cartContainer.innerHTML = '';
    
    // Добавляем товары
    items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.productId = item.product_id;
        
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${item.image_url || 'assets/images/no-image.jpg'}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="btn-quantity decrement-cart-item" data-product-id="${item.product_id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.stock_quantity}" data-product-id="${item.product_id}">
                        <button class="btn-quantity increment-cart-item" data-product-id="${item.product_id}">+</button>
                    </div>
                    <span class="item-price">${formatPrice(item.price)} ₽</span>
                    <button class="btn-remove remove-cart-item" data-product-id="${item.product_id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="item-subtotal">
                    <span>Итого:</span>
                    <span class="subtotal-price">${formatPrice(item.price * item.quantity)} ₽</span>
                </div>
            </div>
        `;
        
        cartContainer.appendChild(cartItem);
    });
    
    // Обновляем итоговую сумму
    updateCartTotal(total);
}

// Показать пустое состояние
function showEmptyState() {
    const cartItems = document.getElementById('cartItems');
    const emptyState = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cartItems) {
        cartItems.innerHTML = '';
    }
    
    if (emptyState) {
        emptyState.style.display = 'flex';
    }
    
    if (cartSummary) {
        cartSummary.style.display = 'none';
    }
    
    // Обновляем счетчик в шапке
    updateCartCount(0);
}

// Обновление счетчика корзины
function updateCartCount(count) {
    const cartItemsCount = document.getElementById('cartItemsCount');
    if (cartItemsCount) {
        cartItemsCount.textContent = count;
    }
}

// Обновление итоговой суммы
function updateCartTotal(total) {
    const itemsTotal = document.getElementById('itemsTotal');
    const totalAmount = document.getElementById('totalAmount');
    const paymentAmount = document.getElementById('paymentAmount');
    
    if (itemsTotal) {
        itemsTotal.textContent = `${formatPrice(total)} ₽`;
    }
    
    if (totalAmount) {
        totalAmount.textContent = `${formatPrice(total)} ₽`;
    }
    
    if (paymentAmount) {
        paymentAmount.textContent = `${formatPrice(total)} ₽`;
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Обработчики для кнопок удаления товара
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-cart-item') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('remove-cart-item'))) {
            
            const button = e.target.classList.contains('remove-cart-item') ? e.target : e.target.parentElement;
            const productId = button.dataset.productId;
            
            if (productId) {
                removeCartItem(productId);
            }
        }
    });
    
    // Обработчики для кнопок изменения количества
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('increment-cart-item')) {
            const productId = e.target.dataset.productId;
            const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
            
            if (input) {
                const currentValue = parseInt(input.value);
                const maxValue = parseInt(input.getAttribute('max'));
                
                if (currentValue < maxValue) {
                    input.value = currentValue + 1;
                    updateCartItemQuantity(productId, currentValue + 1);
                }
            }
        } else if (e.target.classList.contains('decrement-cart-item')) {
            const productId = e.target.dataset.productId;
            const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
            
            if (input) {
                const currentValue = parseInt(input.value);
                
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateCartItemQuantity(productId, currentValue - 1);
                } else {
                    // Если количество 1, то удаляем товар
                    removeCartItem(productId);
                }
            }
        }
    });
    
    // Обработчик для ручного ввода количества
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.dataset.productId;
            let value = parseInt(e.target.value);
            const maxValue = parseInt(e.target.getAttribute('max'));
            
            if (isNaN(value) || value < 1) {
                value = 1;
                e.target.value = 1;
            } else if (value > maxValue) {
                value = maxValue;
                e.target.value = maxValue;
            }
            
            updateCartItemQuantity(productId, value);
        }
    });
    
    // Обработчик для кнопки оформления заказа
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Проверяем количество товаров в корзине
            const cartCount = document.getElementById('cartItemsCount');
            const itemCount = cartCount ? parseInt(cartCount.textContent) : 0;
            
            if (itemCount <= 0) {
                // Если корзина пуста, показываем уведомление
                showToast('Ваша корзина пуста. Добавьте товары перед оформлением заказа.', 'error');
                return;
            }
            
            // Проверяем авторизацию
            fetch('api/auth_status.php')
                .then(response => response.json())
                .then(data => {
                    if (!data.logged_in) {
                        showToast('Пожалуйста, войдите в систему для оформления заказа', 'error');
                        return;
                    }
                    
                    // Проверяем, подтвержден ли email пользователя
                    fetch('api/user/check_email_verification.php')
                        .then(response => response.json())
                        .then(verificationData => {
                            if (!verificationData.verified) {
                                showToast('Для оформления заказа необходимо подтвердить почту в личном кабинете', 'error');
                                setTimeout(() => {
                                    window.location.href = 'profile.php#email-verification';
                                }, 2000);
                                return;
                            }
                            
                            // Если все проверки пройдены, перенаправляем на страницу оплаты
                            window.location.href = 'balance.php';
                        })
                        .catch(error => {
                            console.error('Error checking email verification:', error);
                            showToast('Произошла ошибка при проверке статуса подтверждения почты', 'error');
                        });
                })
                .catch(error => {
                    console.error('Error checking auth status:', error);
                    showToast('Произошла ошибка. Попробуйте позже.', 'error');
                });
        });
    }
}

// Удаление товара из корзины
function removeCartItem(productId) {
    // Проверяем авторизацию
    fetch('api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showToast('Пожалуйста, войдите в систему', 'error');
                return;
            }
            
            // Удаляем товар из корзины
            fetch('api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=remove&product_id=${productId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Обновляем счетчик
                    updateCartCount(data.cart.count);
                    
                    // Если корзина пуста, показываем пустое состояние
                    if (data.cart.count === 0) {
                        showEmptyState();
                    } else {
                        // Удаляем элемент из DOM
                        const cartItem = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
                        if (cartItem) {
                            cartItem.remove();
                        }
                        
                        // Обновляем итоговую сумму
                        updateCartTotal(data.cart.total);
                    }
                    
                    showToast('Товар удален из корзины', 'success');
                } else {
                    showToast(data.message || 'Ошибка при удалении товара', 'error');
                }
            })
            .catch(error => {
                console.error('Error removing item:', error);
                showToast('Произошла ошибка. Попробуйте позже.', 'error');
            });
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            showToast('Произошла ошибка. Попробуйте позже.', 'error');
        });
}

// Обновление количества товара в корзине
function updateCartItemQuantity(productId, quantity) {
    // Проверяем авторизацию
    fetch('api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showToast('Пожалуйста, войдите в систему', 'error');
                return;
            }
            
            // Обновляем количество товара
            fetch('api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=update&product_id=${productId}&quantity=${quantity}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Обновляем счетчик
                    updateCartCount(data.cart.count);
                    
                    // Если корзина пуста, показываем пустое состояние
                    if (data.cart.count === 0) {
                        showEmptyState();
                    } else {
                        // Обновляем подытог для товара
                        const cartItem = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
                        if (cartItem) {
                            const price = parseFloat(cartItem.querySelector('.item-price').textContent.replace(/[^\d.,]/g, '').replace(',', '.'));
                            const subtotalElement = cartItem.querySelector('.subtotal-price');
                            
                            if (subtotalElement) {
                                subtotalElement.textContent = `${formatPrice(price * quantity)} ₽`;
                            }
                        }
                        
                        // Обновляем итоговую сумму
                        updateCartTotal(data.cart.total);
                    }
                } else {
                    showToast(data.message || 'Ошибка при обновлении количества', 'error');
                }
            })
            .catch(error => {
                console.error('Error updating quantity:', error);
                showToast('Произошла ошибка. Попробуйте позже.', 'error');
            });
        })
        .catch(error => {
            console.error('Error checking auth status:', error);
            showToast('Произошла ошибка. Попробуйте позже.', 'error');
        });
}

// Показать модальное окно оплаты
function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Скрыть модальное окно оплаты
function hidePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Обработка оплаты
function processPayment() {
    // Проверяем авторизацию
    fetch('api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showToast('Пожалуйста, войдите в систему', 'error');
                hidePaymentModal();
                return;
            }
            
            // Очищаем корзину
            fetch('api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=clear'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Скрываем модальное окно
                    hidePaymentModal();
                    
                    // Показываем уведомление
                    showToast('Заказ успешно оформлен!', 'success');
                    
                    // Обновляем счетчик в шапке
                    const cartCount = document.getElementById('cartCount');
                    if (cartCount) {
                        cartCount.textContent = '';
                    }
                    
                    // Показываем пустое состояние
                    showEmptyState();
                    
                    // Перенаправляем на страницу успешного оформления заказа через 2 секунды
                    setTimeout(() => {
                        window.location.href = 'order-success.php';
                    }, 2000);
                } else {
                    showToast(data.message || 'Ошибка при оформлении заказа', 'error');
                }
            })
            .catch(error => {
                console.error('Error processing payment:', error);
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
    
    // Показываем уведомление
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
