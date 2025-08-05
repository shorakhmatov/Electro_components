// Менеджер товаров
const productsManager = {
    // Текущая страница
    currentPage: 1,
    // Количество товаров на странице
    itemsPerPage: 12,
    // Текущая категория
    currentCategory: null,
    
    // Загрузка товаров
    async loadProducts() {
        try {
            const url = new URL('/api/products.php', window.location.origin);
            url.searchParams.append('action', 'list');
            url.searchParams.append('page', this.currentPage);
            url.searchParams.append('limit', this.itemsPerPage);
            
            if (this.currentCategory) {
                url.searchParams.append('category_id', this.currentCategory);
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'success') {
                this.renderProducts(data.data.products);
                this.renderPagination(data.data.pagination);
            } else {
                throw new Error(data.message || 'Ошибка загрузки товаров');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Ошибка при загрузке товаров');
        }
    },
    
    // Отрисовка товаров
    renderProducts(products) {
        const container = document.querySelector('.products__grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <div class="product-card__image">
                    <img src="${product.image_url}" alt="${product.name}">
                    <button class="btn-favorite" onclick="productsManager.toggleFavorite(${product.id})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="product-card__content">
                    <h3>${product.name}</h3>
                    <p>${product.description || ''}</p>
                    <div class="product-card__footer">
                        <span class="price">${product.price} ₽</span>
                        <button class="btn btn-primary" onclick="productsManager.addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> В корзину
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
    },
    
    // Отрисовка пагинации
    renderPagination(pagination) {
        const container = document.querySelector('.pagination');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Кнопка "Предыдущая"
        if (pagination.page > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn';
            prevBtn.innerHTML = '&larr; Назад';
            prevBtn.onclick = () => this.changePage(pagination.page - 1);
            container.appendChild(prevBtn);
        }
        
        // Номера страниц
        for (let i = 1; i <= pagination.pages; i++) {
            if (
                i === 1 || // Первая страница
                i === pagination.pages || // Последняя страница
                (i >= pagination.page - 2 && i <= pagination.page + 2) // 2 страницы до и после текущей
            ) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `btn ${i === pagination.page ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.onclick = () => this.changePage(i);
                container.appendChild(pageBtn);
            } else if (
                i === 2 || // После первой страницы
                i === pagination.pages - 1 // Перед последней страницей
            ) {
                const dots = document.createElement('span');
                dots.className = 'pagination-dots';
                dots.textContent = '...';
                container.appendChild(dots);
            }
        }
        
        // Кнопка "Следующая"
        if (pagination.page < pagination.pages) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn';
            nextBtn.innerHTML = 'Вперед &rarr;';
            nextBtn.onclick = () => this.changePage(pagination.page + 1);
            container.appendChild(nextBtn);
        }
    },
    
    // Изменение страницы
    changePage(page) {
        this.currentPage = page;
        this.loadProducts();
        window.scrollTo(0, 0);
    },
    
    // Загрузка категорий
    async loadCategories() {
        try {
            const response = await fetch('/api/products.php?action=categories');
            const data = await response.json();
            
            if (data.status === 'success') {
                this.renderCategories(data.data);
            } else {
                throw new Error(data.message || 'Ошибка загрузки категорий');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showError('Ошибка при загрузке категорий');
        }
    },
    
    // Отрисовка категорий
    renderCategories(categories) {
        const container = document.querySelector('.categories__grid');
        if (!container) return;
        
        container.innerHTML = `
            <a href="#" class="category-card ${!this.currentCategory ? 'active' : ''}" 
               onclick="productsManager.selectCategory(null); return false;">
                <i class="fas fa-border-all"></i>
                <span>Все категории</span>
            </a>
        `;
        
        categories.forEach(category => {
            const card = document.createElement('a');
            card.href = '#';
            card.className = `category-card ${category.id === this.currentCategory ? 'active' : ''}`;
            card.onclick = (e) => {
                e.preventDefault();
                this.selectCategory(category.id);
            };
            
            card.innerHTML = `
                <i class="${category.icon}"></i>
                <span>${category.name}</span>
            `;
            
            container.appendChild(card);
        });
    },
    
    // Выбор категории
    selectCategory(categoryId) {
        this.currentCategory = categoryId;
        this.currentPage = 1;
        this.loadProducts();
        
        // Обновляем активный класс
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.toggle('active', 
                (categoryId === null && card.querySelector('span').textContent === 'Все категории') ||
                (categoryId === parseInt(card.dataset.categoryId))
            );
        });
    },
    
    // Добавление в корзину
    async addToCart(productId) {
        try {
            const response = await fetch('/api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: 1
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                this.showSuccess('Товар добавлен в корзину');
            } else {
                throw new Error(data.message || 'Ошибка добавления в корзину');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showError('Ошибка при добавлении в корзину');
        }
    },
    
    // Добавление в избранное
    async toggleFavorite(productId) {
        try {
            const response = await fetch('/api/favorites.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: productId
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                this.showSuccess(data.message || 'Список избранного обновлен');
            } else {
                throw new Error(data.message || 'Ошибка обновления избранного');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            this.showError('Ошибка при обновлении избранного');
        }
    },
    
    // Показ уведомления об успехе
    showSuccess(message) {
        this.showNotification(message, 'success');
    },
    
    // Показ уведомления об ошибке
    showError(message) {
        this.showNotification(message, 'error');
    },
    
    // Показ уведомления
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    productsManager.loadCategories();
    productsManager.loadProducts();
});
