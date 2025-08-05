/**
 * Скрипт для автоматического обновления счетчика товаров в корзине
 */
document.addEventListener('DOMContentLoaded', function() {
    // Функция для обновления счетчика корзины
    function updateCartCounter() {
        fetch('api/get_cart_count.php')
            .then(response => response.json())
            .then(data => {
                const cartCountElement = document.getElementById('cartCount');
                if (cartCountElement) {
                    // Если количество товаров больше 0, показываем счетчик, иначе скрываем
                    if (data.count > 0) {
                        cartCountElement.textContent = data.count;
                        cartCountElement.style.display = 'flex';
                    } else {
                        cartCountElement.textContent = '';
                        cartCountElement.style.display = 'none';
                    }
                }
            })
            .catch(error => {
                console.error('Ошибка при получении количества товаров в корзине:', error);
            });
    }

    // Обновляем счетчик при загрузке страницы
    updateCartCounter();

    // Обновляем счетчик каждые секунды
    setInterval(updateCartCounter, 100);

    // Обновляем счетчик после добавления товара в корзину
    document.addEventListener('cartUpdated', function() {
        updateCartCounter();
    });

    // Функция для создания и отправки события обновления корзины
    window.updateCart = function() {
        const event = new CustomEvent('cartUpdated');
        document.dispatchEvent(event);
    };

    // Находим все кнопки "Добавить в корзину" и добавляем обработчик события
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Вызываем функцию обновления счетчика после небольшой задержки
                setTimeout(updateCartCounter, 100);
            });
        });
    }
    
    // Находим все кнопки удаления из корзины и добавляем обработчик
    const removeButtons = document.querySelectorAll('.remove-from-cart-btn, .cart-item-remove, .remove-from-cart');
    if (removeButtons.length > 0) {
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                setTimeout(updateCartCounter, 300);
            });
        });
    }
    
    // Обрабатываем изменение количества товаров в корзине
    const quantityInputs = document.querySelectorAll('.cart-item-quantity input');
    if (quantityInputs.length > 0) {
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                setTimeout(updateCartCounter, 300);
            });
        });
    }
});
