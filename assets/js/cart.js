// Менеджер корзины
const cartManager = {
    items: [],

    async init() {
        try {
            const response = await fetch('/api/cart.php');
            if (response.ok) {
                const data = await response.json();
                this.items = data.items || [];
            } else {
                this.items = JSON.parse(localStorage.getItem('cart')) || [];
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = JSON.parse(localStorage.getItem('cart')) || [];
        }
        this.updateDisplay();
    },

    async save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        try {
            await fetch('/api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: this.items })
            });
        } catch (error) {
            console.error('Error saving cart:', error);
        }
        this.updateDisplay();
    },

    async addItem(productId) {
        if (!productId) return;

        productId = parseInt(productId);
        const existingItem = this.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification('Количество товара увеличено');
        } else {
            this.items.push({
                productId: productId,
                quantity: 1
            });
            this.showNotification('Товар добавлен в корзину');
        }

        await this.save();
    },

    async removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        await this.save();
        this.showNotification('Товар удален из корзины');
    },

    async updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                await this.removeItem(productId);
                return;
            }
            item.quantity = Math.max(1, Math.min(99, quantity));
            await this.save();
        }
    },

    updateDisplay() {
        this.updateCount();
        this.renderItems();
        this.updateCheckoutButton();
    },

    updateCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = count > 0 ? count : '';
        }
    },

    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.items.length === 0;
        }
    },

    renderItems() {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartTotal = document.getElementById('cartTotal');
        const paymentAmount = document.getElementById('paymentAmount');

        if (!cartItems) return;

        if (this.items.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
            cartItems.innerHTML = '';
            if (cartTotal) cartTotal.textContent = '0 ₽';
            if (paymentAmount) paymentAmount.textContent = '0 ₽';
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';

        let total = 0;
        cartItems.innerHTML = this.items.map(item => {
            const product = this.getProductInfo(item.productId);
            if (!product) return '';

            total += product.price * item.quantity;

            return `
                <div class="cart-item" data-product-id="${item.productId}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="cart-item__content">
                        <h3>${product.name}</h3>
                        <p>${product.price} ₽</p>
                        <div class="quantity-controls">
                            <button onclick="cartManager.updateQuantity(${item.productId}, ${item.quantity - 1})">−</button>
                            <span>${item.quantity}</span>
                            <button onclick="cartManager.updateQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="cartManager.removeItem(${item.productId})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');

        if (cartTotal) cartTotal.textContent = `${total} ₽`;
        if (paymentAmount) paymentAmount.textContent = `${total} ₽`;
    },

    getProductInfo(productId) {
        const products = {
            1: { name: 'Arduino Uno R3', price: 850, image: 'assets/images/products/arduino-uno.jpg' },
            2: { name: 'Raspberry Pi 4', price: 7500, image: 'assets/images/products/raspberry-pi.jpg' },
            3: { name: 'ESP32 DevKit', price: 1200, image: 'assets/images/products/esp32.jpg' },
            4: { name: 'Набор резисторов', price: 350, image: 'assets/images/products/resistors.jpg' },
            5: { name: 'LCD дисплей 16x2', price: 480, image: 'assets/images/products/lcd.jpg' }
        };
        return products[productId];
    },

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2700);
    },

    async checkout() {
        if (this.items.length === 0) {
            this.showNotification('Корзина пуста');
            return;
        }

        try {
            const response = await fetch('/api/cart.php?action=checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: this.items })
            });

            if (response.ok) {
                this.items = [];
                await this.save();
                this.showNotification('Заказ успешно оформлен');
                setTimeout(() => {
                    window.location.href = 'order-success.html';
                }, 2000);
            } else {
                const data = await response.json();
                this.showNotification(data.message || 'Ошибка при оформлении заказа');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            this.showNotification('Произошла ошибка при оформлении заказа');
        }
    }
};

// Глобальные функции для вызова из HTML
window.addToCart = function (productId) {
    cartManager.addItem(productId);
};

window.removeFromCart = function (productId) {
    cartManager.removeItem(productId);
};

window.updateQuantity = function (productId, quantity) {
    cartManager.updateQuantity(productId, quantity);
};

window.checkout = function () {
    cartManager.checkout();
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    cartManager.init();

    // Обработка платежной формы
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await cartManager.checkout();
        });
    }

    // Обработка кнопки закрытия модального окна
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            const modal = document.getElementById('paymentModal');
            if (modal) modal.style.display = 'none';
        });
    }
});
