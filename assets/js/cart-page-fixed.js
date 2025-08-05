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
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                // Если пользователь не авторизован, показываем пустое состояние
                showEmptyState();
                return;
            }
            
            // Загружаем товары корзины
            fetch('/api/cart.php', {
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
                <img src="${item.image_url || '/assets/images/no-image.jpg'}" alt="${item.name}">
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
                </div>
                <div class="item-subtotal">
                    <span>Итого: <strong>${formatPrice(item.price * item.quantity)} ₽</strong></span>
                    <button class="btn-remove-item" data-product-id="${item.product_id}">Удалить</button>
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
    const cartContainer = document.getElementById('cartItems');
    const emptyState = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cartContainer) {
        cartContainer.innerHTML = '';
    }
    
    if (emptyState) {
        emptyState.style.display = 'flex';
    }
    
    if (cartSummary) {
        cartSummary.style.display = 'none';
    }
    
    // Обновляем итоговую сумму
    updateCartTotal(0);
}

// Обновление счетчика корзины
function updateCartCount(count) {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = count > 0 ? count : '';
    }
}

// Обновление итоговой суммы
function updateCartTotal(total) {
    const totalElement = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');
    
    if (totalElement) {
        totalElement.textContent = formatPrice(total) + ' ₽';
    }
    
    // Обновляем состояние кнопки оформления заказа
    if (checkoutButton) {
        if (total > 0) {
            checkoutButton.removeAttribute('disabled');
        } else {
            checkoutButton.setAttribute('disabled', 'disabled');
        }
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Обработка кликов по кнопкам
    document.addEventListener('click', function(e) {
        // Обработка кнопки удаления товара
        if (e.target.classList.contains('btn-remove-item')) {
            const productId = e.target.dataset.productId;
            if (productId) {
                removeCartItem(productId);
            }
        }
        
        // Обработка кнопки уменьшения количества
        if (e.target.classList.contains('decrement-cart-item')) {
            const productId = e.target.dataset.productId;
            if (productId) {
                const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
                if (input) {
                    const currentValue = parseInt(input.value);
                    if (currentValue > 1) {
                        updateCartItemQuantity(productId, currentValue - 1);
                    }
                }
            }
        }
        
        // Обработка кнопки увеличения количества
        if (e.target.classList.contains('increment-cart-item')) {
            const productId = e.target.dataset.productId;
            if (productId) {
                const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
                if (input) {
                    const currentValue = parseInt(input.value);
                    const maxValue = parseInt(input.getAttribute('max') || 99);
                    if (currentValue < maxValue) {
                        updateCartItemQuantity(productId, currentValue + 1);
                    }
                }
            }
        }
        
        // Обработка кнопки оформления заказа
        if (e.target.closest('#checkoutBtn')) {
            e.preventDefault(); // Предотвращаем стандартное поведение ссылки
            
            // Проверяем статус подтверждения почты
            fetch('/api/check_email_verification.php')
                .then(response => response.json())
                .then(data => {
                    if (data.verified) {
                        // Если почта подтверждена, переходим к оформлению заказа
                        window.location.href = 'balance.php';
                    } else {
                        // Если почта не подтверждена, показываем уведомление
                        showToast('Для оформления заказа необходимо подтвердить почту в личном кабинете', 'error');
                        
                        // Перенаправляем на страницу профиля через 2 секунды
                        setTimeout(() => {
                            window.location.href = 'profile.php';
                        }, 2000);
                    }
                })
                .catch(error => {
                    console.error('Error checking email verification:', error);
                    showToast('Произошла ошибка при проверке статуса подтверждения почты', 'error');
                });
        }
        
        // Обработка кнопки закрытия модального окна
        if (e.target.closest('#modalClose')) {
            e.preventDefault();
            hidePaymentModal();
        }
    });
    
    // Обработка изменения значения в поле количества
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input') && e.target.dataset.productId) {
            const productId = e.target.dataset.productId;
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0) {
                updateCartItemQuantity(productId, value);
            } else {
                e.target.value = 1;
                updateCartItemQuantity(productId, 1);
            }
        }
    });
    
    // Обработка отправки формы оплаты
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
}

// Удаление товара из корзины
function removeCartItem(productId) {
    // Проверяем авторизацию
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showToast('Пожалуйста, войдите в систему', 'error');
                return;
            }
            
            // Удаляем товар из корзины
            fetch('/api/cart.php', {
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
                    
                    // Обновляем отображение корзины
                    if (data.cart.items.length > 0) {
                        // Удаляем элемент из DOM
                        const cartItem = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
                        if (cartItem) {
                            cartItem.remove();
                        }
                        
                        // Обновляем итоговую сумму
                        updateCartTotal(data.cart.total);
                    } else {
                        // Если корзина пуста, показываем пустое состояние
                        showEmptyState();
                    }
                    
                    showToast('Товар удален из корзины');
                } else {
                    showToast(data.message || 'Ошибка при удалении товара', 'error');
                }
            })
            .catch(error => {
                console.error('Error removing item:', error);
                showToast('Произошла ошибка при удалении товара', 'error');
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
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showToast('Пожалуйста, войдите в систему', 'error');
                return;
            }
            
            // Обновляем количество товара
            fetch('/api/cart.php', {
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
                    
                    // Обновляем отображение корзины
                    const cartItem = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
                    if (cartItem) {
                        // Обновляем поле ввода количества
                        const input = cartItem.querySelector('.quantity-input');
                        if (input) {
                            input.value = data.item.quantity;
                        }
                        
                        // Обновляем подытог товара
                        const subtotal = cartItem.querySelector('.item-subtotal strong');
                        if (subtotal) {
                            subtotal.textContent = formatPrice(data.item.price * data.item.quantity) + ' ₽';
                        }
                    }
                    
                    // Обновляем итоговую сумму
                    updateCartTotal(data.cart.total);
                } else {
                    showToast(data.message || 'Ошибка при обновлении количества', 'error');
                }
            })
            .catch(error => {
                console.error('Error updating quantity:', error);
                showToast('Произошла ошибка при обновлении количества', 'error');
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
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showToast('Пожалуйста, войдите в систему', 'error');
                hidePaymentModal();
                return;
            }
            
            // Очищаем корзину
            fetch('/api/cart.php', {
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
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
