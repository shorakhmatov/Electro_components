// JavaScript для добавления товаров в избранное на всех страницах

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    setupFavoriteButtons();
});

// Настройка кнопок избранного
function setupFavoriteButtons() {
    // Делегирование событий для кнопок на странице
    document.addEventListener('click', function(e) {
        // Обработка кнопки добавления в избранное
        const favoriteBtn = e.target.closest('.btn-favorite, .favorite-btn');
        if (favoriteBtn) {
            const productId = favoriteBtn.dataset.productId;
            if (productId) {
                e.preventDefault();
                toggleFavorite(productId, favoriteBtn);
            }
        }
    });
    
    // Проверяем статус избранного для всех товаров на странице
    checkFavoritesStatus();
}

// Проверка статуса избранного для всех товаров на странице
function checkFavoritesStatus() {
    // Собираем все ID товаров на странице
    const productIds = [];
    document.querySelectorAll('.btn-favorite, .favorite-btn').forEach(btn => {
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
                    document.querySelectorAll('.btn-favorite, .favorite-btn').forEach(btn => {
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

// Переключение статуса избранного
function toggleFavorite(productId, button) {
    console.log('Переключение статуса избранного для товара:', productId);
    
    // Проверяем авторизацию
    fetch('/api/auth_status.php')
        .then(response => response.json())
        .then(data => {
            console.log('Статус авторизации:', data);
            if (!data.logged_in) {
                showAuthPrompt('Пожалуйста, войдите в систему для добавления товаров в избранное');
                return;
            }
            
            // Переключаем статус избранного
            fetch('/api/favorites.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=toggle&product_id=${productId}`
            })
            .then(response => response.json())
            .then(data => {
                console.log('Ответ API избранного:', data);
                if (data.success) {
                    // Показываем уведомление
                    showToast(data.message);
                    
                    // Обновляем иконку избранного
                    const buttons = document.querySelectorAll(`.btn-favorite[data-product-id="${productId}"], .favorite-btn[data-product-id="${productId}"]`);
                    buttons.forEach(btn => {
                        const icon = btn.querySelector('i');
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
                    
                    // Если мы на странице избранного и удалили товар, обновляем страницу
                    if (window.location.pathname.includes('favorites.php') && !data.favorites.status) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }
                } else {
                    showToast(data.message || 'Ошибка при обновлении избранного', 'error');
                }
            })
            .catch(error => {
                console.error('Ошибка при переключении статуса избранного:', error);
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
