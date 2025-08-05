/**
 * JavaScript для страницы поиска
 */
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    initSearchPage();
});

/**
 * Инициализация страницы поиска
 */
function initSearchPage() {
    // Обработка формы поиска в шапке
    const searchForm = document.querySelector('.header__search form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('input[name="q"]');
            if (!searchInput.value.trim()) {
                e.preventDefault();
                showSearchError('Пожалуйста, введите поисковый запрос');
            }
        });
    }

    // Обработка кнопок добавления в корзину
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const quantityInput = this.closest('.product-card').querySelector('.quantity-input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            addToCart(productId, quantity);
        });
    });

    // Подсветка результатов поиска
    highlightSearchResults();
}

/**
 * Подсветка поисковых запросов в результатах
 */
function highlightSearchResults() {
    // Получаем поисковый запрос из URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    if (!searchQuery) return;
    
    // Получаем все заголовки и описания товаров
    const productTitles = document.querySelectorAll('.product-card h3');
    const productDescriptions = document.querySelectorAll('.product-card p');
    
    // Функция для подсветки текста
    function highlightText(element, query) {
        const text = element.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    // Подсвечиваем запрос в заголовках
    productTitles.forEach(title => {
        highlightText(title, searchQuery);
    });
    
    // Подсвечиваем запрос в описаниях
    productDescriptions.forEach(description => {
        highlightText(description, searchQuery);
    });
    
    // Добавляем стили для подсветки
    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            background-color: rgba(255, 193, 7, 0.3);
            padding: 0 2px;
            border-radius: 2px;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Показать ошибку поиска
 * @param {string} message - Сообщение об ошибке
 */
function showSearchError(message) {
    // Проверяем, существует ли уже элемент с ошибкой
    let errorElement = document.querySelector('.search-error');
    
    if (!errorElement) {
        // Создаем элемент для отображения ошибки
        errorElement = document.createElement('div');
        errorElement.className = 'search-error';
        
        // Добавляем стили
        errorElement.style.color = '#d32f2f';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '5px';
        errorElement.style.position = 'absolute';
        errorElement.style.top = '100%';
        errorElement.style.left = '0';
        errorElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        errorElement.style.padding = '5px 10px';
        errorElement.style.borderRadius = '4px';
        errorElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        errorElement.style.zIndex = '100';
        
        // Добавляем элемент в форму поиска
        const searchForm = document.querySelector('.header__search');
        searchForm.style.position = 'relative';
        searchForm.appendChild(errorElement);
    }
    
    // Устанавливаем сообщение об ошибке
    errorElement.textContent = message;
    
    // Удаляем сообщение через 3 секунды
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

/**
 * Добавление товара в корзину
 * @param {number} productId - ID товара
 * @param {number} quantity - Количество товара
 */
function addToCart(productId, quantity = 1) {
    // Проверка входных данных
    if (!productId || quantity < 1) {
        console.error('Неверные параметры для добавления в корзину');
        return;
    }
    
    // Отправляем запрос на сервер для добавления товара в корзину
    fetch('api/cart/add_item.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Обновляем счетчик товаров в корзине
            updateCartCounter(data.cart_count);
            
            // Показываем уведомление об успешном добавлении
            showToast('Товар добавлен в корзину', 'success');
        } else {
            // Показываем уведомление об ошибке
            showToast(data.message || 'Ошибка при добавлении товара в корзину', 'error');
        }
    })
    .catch(error => {
        console.error('Ошибка при добавлении товара в корзину:', error);
        showToast('Произошла ошибка при добавлении товара в корзину', 'error');
    });
}

/**
 * Обновление счетчика товаров в корзине
 * @param {number} count - Количество товаров в корзине
 */
function updateCartCounter(count) {
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.textContent = count;
        cartCounter.style.display = count > 0 ? 'flex' : 'none';
    }
}

/**
 * Показать всплывающее уведомление
 * @param {string} message - Сообщение уведомления
 * @param {string} type - Тип уведомления (success, error, info)
 */
function showToast(message, type = 'success') {
    // Проверяем, существует ли контейнер для уведомлений
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        // Создаем контейнер для уведомлений
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Создаем элемент уведомления
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="toast-content">${message}</div>
        <button class="toast-close">×</button>
    `;
    
    // Добавляем уведомление в контейнер
    toastContainer.appendChild(toast);
    
    // Добавляем обработчик для закрытия уведомления
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', function() {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
