// JavaScript для главной страницы

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    setupProductActions();
    checkFavoritesStatus();
});

// Настройка действий с товарами
function setupProductActions() {
    // Обработка кнопок добавления в корзину
    document.querySelectorAll('.btn.btn-primary').forEach(btn => {
        if (btn.textContent.includes('В корзину')) {
            // Удаляем старые обработчики, если они есть
            const clonedBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(clonedBtn, btn);
            
            // Добавляем новый обработчик
            clonedBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.getAttribute('data-product-id');
                if (productId) {
                    // Передаем глобальное событие
                    window.event = e;
                    addToCart(productId);
                }
            });
        }
    });

    // Обработка кнопок изменения количества
    document.querySelectorAll('.btn-quantity').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.parentElement.querySelector('.quantity-input');
            if (this.textContent === '+') {
                incrementQuantity(input);
            } else if (this.textContent === '-') {
                decrementQuantity(input);
            }
        });
    });

    // Валидация ввода количества
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            validateQuantity(this);
        });
    });
}

// Проверка статуса избранного для всех товаров на странице
function checkFavoritesStatus() {
    // Собираем все ID товаров на странице
    const productIds = [];
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        const productId = btn.dataset.productId;
        if (productId) productIds.push(productId);
    });
    
    if (productIds.length === 0) return;
    
    // Проверяем авторизацию
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) return;
            
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
                console.log('Статус избранного:', data);
                if (data.success && data.favorites && data.favorites.items) {
                    // Обновляем иконки избранного
                    const favoriteItems = data.favorites.items;
                    document.querySelectorAll('.btn-favorite').forEach(btn => {
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
                console.error('Ошибка при проверке статуса избранного:', error);
            });
        })
        .catch(error => {
            console.error('Ошибка при проверке авторизации:', error);
        });
}

// Увеличение количества товара
function incrementQuantity(input) {
    const max = parseInt(input.getAttribute('max')) || 99;
    let value = parseInt(input.value) || 1;
    value = Math.min(value + 1, max);
    input.value = value;
}

// Уменьшение количества товара
function decrementQuantity(input) {
    const min = parseInt(input.getAttribute('min')) || 1;
    let value = parseInt(input.value) || 1;
    value = Math.max(value - 1, min);
    input.value = value;
}

// Валидация количества товара
function validateQuantity(input) {
    const min = parseInt(input.getAttribute('min')) || 1;
    const max = parseInt(input.getAttribute('max')) || 99;
    let value = parseInt(input.value) || 1;
    value = Math.max(min, Math.min(value, max));
    input.value = value;
}

// Добавление товара в корзину
function addToCart(productId) {
    // Находим элемент, который был нажат
    const clickedButton = event ? event.target.closest(`button[data-product-id="${productId}"]`) : null;
    let quantity = 1;
    
    // Если кнопка найдена, ищем ближайшую карточку товара и получаем количество
    if (clickedButton) {
        const productCard = clickedButton.closest('.product-card');
        if (productCard) {
            const quantityInput = productCard.querySelector('.quantity-input');
            if (quantityInput) {
                quantity = parseInt(quantityInput.value) || 1;
            }
        }
    }
    
    console.log(`Добавление товара ID: ${productId}, количество: ${quantity}`);
    
    // Проверяем авторизацию
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                showAuthPrompt('Пожалуйста, войдите в систему для добавления товаров в корзину');
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
                console.error('Ошибка при добавлении в корзину:', error);
                showToast('Произошла ошибка. Попробуйте позже.', 'error');
            });
        })
        .catch(error => {
            console.error('Ошибка при проверке авторизации:', error);
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
