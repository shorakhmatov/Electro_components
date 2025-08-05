// Функции для работы с избранным
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Переключение избранного
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        // Добавляем в избранное
        favorites.push(productId);
        showNotification('Товар добавлен в избранное');
    } else {
        // Удаляем из избранного
        favorites.splice(index, 1);
        showNotification('Товар удален из избранного');
    }
    
    // Сохраняем избранное
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Обновляем иконки и счетчик
    updateFavoriteButtons();
    updateFavoritesCount();
}

// Обновление иконок избранного
function updateFavoriteButtons() {
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        const productId = parseInt(btn.getAttribute('data-product-id'));
        if (!productId) return;
        
        const isFavorite = favorites.includes(productId);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
        }
    });
}

// Обновление счетчика в шапке
function updateFavoritesCount() {
    const favCount = document.getElementById('favoritesCount');
    if (favCount) {
        favCount.textContent = favorites.length > 0 ? favorites.length : '';
    }
}

// Показ уведомлений
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация при загрузке страницы
    updateFavoriteButtons();
    updateFavoritesCount();

    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoritesEmpty = document.getElementById('favoritesEmpty');
    const favoritesCount = document.getElementById('favoritesCount');
    const toast = document.getElementById('toast');

    // Favorites Management
    class FavoritesManager {
        constructor() {
            this.items = this.loadFavorites();
            this.updateFavoritesCount();
            this.updateFavoriteButtons();
        }

        loadFavorites() {
            const favorites = localStorage.getItem('favorites');
            return favorites ? JSON.parse(favorites) : [];
        }

        saveFavorites() {
            localStorage.setItem('favorites', JSON.stringify(this.items));
            this.updateFavoritesCount();
            this.updateFavoriteButtons();
        }

        updateFavoritesCount() {
            const favCount = document.querySelector('.favorites-count');
            if (favCount) {
                favCount.textContent = this.items.length;
            }
        }

        updateFavoriteButtons() {
            document.querySelectorAll('.btn-favorite').forEach(btn => {
                const productId = parseInt(btn.dataset.productId);
                const isFavorite = this.items.includes(productId);
                
                btn.innerHTML = `<i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>`;
                btn.classList.toggle('active', isFavorite);
            });
        }

        toggleFavorite(productId) {
            const index = this.items.indexOf(productId);
            
            if (index === -1) {
                this.items.push(productId);
                this.showNotification('Товар добавлен в избранное', 'success');
            } else {
                this.items.splice(index, 1);
                this.showNotification('Товар удален из избранного', 'info');
            }

            this.saveFavorites();
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;

            const container = document.querySelector('.notification-container') || 
                (() => {
                    const cont = document.createElement('div');
                    cont.className = 'notification-container';
                    document.body.appendChild(cont);
                    return cont;
                })();

            container.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    // Initialize favorites manager
    const favoritesManager = new FavoritesManager();

    // Event handler for favorite button clicks
    function toggleFavorite(productId) {
        favoritesManager.toggleFavorite(productId);
    }

    // Load favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    updateFavoritesDisplay();

    function updateFavoritesDisplay() {
        favoritesCount.textContent = favorites.length;

        if (favorites.length === 0) {
            favoritesGrid.style.display = 'none';
            favoritesEmpty.style.display = 'block';
            return;
        }

        favoritesGrid.style.display = 'grid';
        favoritesEmpty.style.display = 'none';

        // Clear existing content
        favoritesGrid.innerHTML = '';

        // Add each favorite item
        favorites.forEach(item => {
            const card = createFavoriteCard(item);
            favoritesGrid.appendChild(card);
        });
    }

    function createFavoriteCard(item) {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        card.innerHTML = `
            <div class="favorite-image">
                <img src="${item.image}" alt="${item.name}">
                <div class="favorite-actions">
                    <button class="action-btn remove" data-id="${item.id}" title="Удалить из избранного">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="action-btn cart" data-id="${item.id}" title="Добавить в корзину">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="favorite-content">
                <h3 class="favorite-title">${item.name}</h3>
                <div class="favorite-category">${item.category}</div>
                <div class="favorite-price">${formatPrice(item.price)} ₽</div>
                <div class="favorite-stock ${item.inStock ? '' : 'out'}">
                    <i class="fas ${item.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${item.inStock ? 'В наличии' : 'Нет в наличии'}
                </div>
            </div>
        `;

        // Add event listeners
        const removeBtn = card.querySelector('.remove');
        const cartBtn = card.querySelector('.cart');

        removeBtn.addEventListener('click', () => removeFromFavorites(item.id));
        cartBtn.addEventListener('click', () => addToCart(item));

        return card;
    }

    function removeFromFavorites(itemId) {
        favorites = favorites.filter(item => item.id !== itemId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesDisplay();
        showToast('Товар удален из избранного', 'error');
    }

    function addToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if item already in cart
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        showToast('Товар добавлен в корзину', 'success');
    }

    function showToast(message, type = 'success') {
        const toastMessage = toast.querySelector('.toast-message');
        const icon = toast.querySelector('i');

        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;
        
        icon.className = type === 'success' 
            ? 'fas fa-check-circle'
            : 'fas fa-times-circle';

        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }
});
