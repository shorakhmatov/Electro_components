/**
 * Скрипт для управления заказами в профиле пользователя
 */

document.addEventListener('DOMContentLoaded', function() {
    // Кнопки для подробностей заказа
    const orderDetailsButtons = document.querySelectorAll('.btn-order-details');
    
    // Кнопки для отмены заказа
    const cancelOrderButtons = document.querySelectorAll('.btn-cancel-order');
    
    // Обработчики событий
    orderDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            showOrderDetails(orderId);
        });
    });
    
    cancelOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            confirmCancelOrder(orderId);
        });
    });
    
    /**
     * Показывает модальное окно с подробностями заказа
     * @param {string} orderId - ID заказа
     */
    function showOrderDetails(orderId) {
        // Проверяем, существует ли уже модальное окно
        let modal = document.getElementById('orderDetailsModal');
        
        // Если модальное окно не существует, создаем его
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'orderDetailsModal';
            modal.className = 'modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            modalContent.appendChild(closeBtn);
            
            const modalTitle = document.createElement('h3');
            modalTitle.textContent = 'Подробности заказа';
            modalContent.appendChild(modalTitle);
            
            const modalBody = document.createElement('div');
            modalBody.id = 'orderDetailsContent';
            modalContent.appendChild(modalBody);
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Закрытие модального окна при клике вне его области
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Получаем содержимое заказа через AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `api/get_order_details.php?id=${orderId}`, true);
        
        xhr.onload = function() {
            if (this.status === 200) {
                try {
                    const response = JSON.parse(this.responseText);
                    
                    if (response.success) {
                        // Отображаем данные заказа
                        displayOrderDetails(response.order, response.items);
                        modal.style.display = 'block';
                    } else {
                        showNotification('Ошибка: ' + response.message, 'error');
                    }
                } catch (e) {
                    console.error('Ошибка при разборе ответа:', e);
                    showNotification('Ошибка при получении данных заказа', 'error');
                }
            } else {
                showNotification('Ошибка при получении данных заказа', 'error');
            }
        };
        
        xhr.onerror = function() {
            showNotification('Ошибка соединения с сервером', 'error');
        };
        
        xhr.send();
    }
    
    /**
     * Отображает подробности заказа в модальном окне
     * @param {Object} order - Данные заказа
     * @param {Array} items - Позиции заказа
     */
    function displayOrderDetails(order, items) {
        const content = document.getElementById('orderDetailsContent');
        
        // Получаем текст статуса
        let statusText = '';
        switch(order.status) {
            case 'pending':
                statusText = 'В обработке';
                break;
            case 'processing':
                statusText = 'Обрабатывается';
                break;
            case 'shipped':
                statusText = 'Отправлен';
                break;
            case 'delivered':
                statusText = 'Доставлен';
                break;
            case 'cancelled':
                statusText = 'Отменен';
                break;
            default:
                statusText = order.status;
        }
        
        // Форматирование даты
        const orderDate = new Date(order.created_at);
        const formattedDate = orderDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Создаем HTML для отображения данных заказа
        let html = `
            <div class="order-details-header">
                <div class="order-details-info">
                    <div class="order-details-number">Заказ #${order.id}</div>
                    <div class="order-details-date">от ${formattedDate}</div>
                </div>
                <div class="order-details-status ${order.status}">
                    ${statusText}
                </div>
            </div>
            
            <div class="order-details-section">
                <h4>Позиции заказа</h4>
                <div class="order-details-items">
        `;
        
        // Добавляем позиции заказа
        let totalItems = 0;
        items.forEach(item => {
            totalItems += parseInt(item.quantity);
            html += `
                <div class="order-details-item">
                    <div class="item-details-image">
                        <img src="${item.image_url || 'assets/images/products/placeholder.jpg'}" alt="${item.name}">
                    </div>
                    <div class="item-details-info">
                        <div class="item-details-name">${item.name}</div>
                        <div class="item-details-meta">
                            <span class="item-details-quantity">${item.quantity} шт.</span>
                            <span class="item-details-price">${formatPrice(item.price_per_unit)} руб.</span>
                        </div>
                    </div>
                    <div class="item-details-total">
                        ${formatPrice(item.price_per_unit * item.quantity)} руб.
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            
            <div class="order-details-section">
                <h4>Информация о заказе</h4>
                <div class="order-details-summary">
                    <div class="order-summary-item">
                        <span>Количество товаров:</span>
                        <span>${totalItems} шт.</span>
                    </div>
                    <div class="order-summary-item">
                        <span>Стоимость товаров:</span>
                        <span>${formatPrice(order.total_amount)} руб.</span>
                    </div>
                    <div class="order-summary-item">
                        <span>Стоимость доставки:</span>
                        <span>${order.shipping_cost ? formatPrice(order.shipping_cost) + ' руб.' : 'Бесплатно'}</span>
                    </div>
                    ${order.delivery_address ? `
                    <div class="order-summary-item">
                        <span>Адрес доставки:</span>
                        <span>${order.delivery_address}</span>
                    </div>
                    ` : ''}
                    <div class="order-summary-total">
                        <span>Итого:</span>
                        <span>${formatPrice(order.total_amount)} руб.</span>
                    </div>
                </div>
            </div>
            
            <div class="order-details-actions">
                ${order.status === 'pending' || order.status === 'processing' ? 
                    `<button class="btn-cancel-order-modal" data-order-id="${order.id}">Отменить заказ</button>` : ''}
                <button class="btn-close-modal">Закрыть</button>
            </div>
        `;
        
        content.innerHTML = html;
        
        // Добавляем обработчики событий для кнопок
        const cancelOrderModalBtn = content.querySelector('.btn-cancel-order-modal');
        if (cancelOrderModalBtn) {
            cancelOrderModalBtn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-order-id');
                document.getElementById('orderDetailsModal').style.display = 'none';
                confirmCancelOrder(orderId);
            });
        }
        
        const closeModalBtn = content.querySelector('.btn-close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                document.getElementById('orderDetailsModal').style.display = 'none';
            });
        }
    }
    
    /**
     * Показывает диалог подтверждения отмены заказа
     * @param {string} orderId - ID заказа
     */
    function confirmCancelOrder(orderId) {
        if (confirm('Вы уверены, что хотите отменить заказ? Это действие нельзя отменить.')) {
            cancelOrder(orderId);
        }
    }
    
    /**
     * Отправляет запрос на отмену заказа
     * @param {string} orderId - ID заказа
     */
    function cancelOrder(orderId) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'api/cancel_order.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onload = function() {
            if (this.status === 200) {
                try {
                    const response = JSON.parse(this.responseText);
                    
                    if (response.success) {
                        showNotification('Заказ успешно отменен', 'success');
                        
                        // Обновляем статус заказа на странице
                        updateOrderStatus(orderId, 'cancelled');
                        
                        // Удаляем кнопку отмены
                        const cancelButtons = document.querySelectorAll(`.btn-cancel-order[data-order-id="${orderId}"]`);
                        cancelButtons.forEach(button => button.remove());
                    } else {
                        showNotification('Ошибка: ' + response.message, 'error');
                    }
                } catch (e) {
                    console.error('Ошибка при разборе ответа:', e);
                    showNotification('Ошибка при отмене заказа', 'error');
                }
            } else {
                showNotification('Ошибка при отмене заказа', 'error');
            }
        };
        
        xhr.onerror = function() {
            showNotification('Ошибка соединения с сервером', 'error');
        };
        
        xhr.send(`order_id=${orderId}`);
    }
    
    /**
     * Обновляет статус заказа на странице
     * @param {string} orderId - ID заказа
     * @param {string} newStatus - Новый статус
     */
    function updateOrderStatus(orderId, newStatus) {
        const orderCards = document.querySelectorAll(`.order-card`);
        
        orderCards.forEach(card => {
            const orderIdElement = card.querySelector('.order-number');
            if (orderIdElement && orderIdElement.textContent.includes(orderId)) {
                const statusElement = card.querySelector('.order-status');
                
                if (statusElement) {
                    // Удаляем все классы статусов
                    statusElement.classList.remove('pending', 'processing', 'shipped', 'delivered', 'cancelled');
                    
                    // Добавляем новый класс статуса
                    statusElement.classList.add(newStatus);
                    
                    // Обновляем текст статуса
                    let statusText = '';
                    switch(newStatus) {
                        case 'pending':
                            statusText = 'В обработке';
                            break;
                        case 'processing':
                            statusText = 'Обрабатывается';
                            break;
                        case 'shipped':
                            statusText = 'Отправлен';
                            break;
                        case 'delivered':
                            statusText = 'Доставлен';
                            break;
                        case 'cancelled':
                            statusText = 'Отменен';
                            break;
                        default:
                            statusText = newStatus;
                    }
                    
                    statusElement.textContent = statusText;
                }
            }
        });
    }
    
    /**
     * Форматирует цену с разделителями
     * @param {number} price - Цена
     * @returns {string} - Отформатированная цена
     */
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }
    
    /**
     * Показывает уведомление
     * @param {string} message - Текст уведомления
     * @param {string} type - Тип уведомления (success, error)
     */
    function showNotification(message, type = 'success') {
        // Проверка существования контейнера для уведомлений
        let notificationContainer = document.getElementById('notification-container');
        
        // Если контейнер не существует, создаем его
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Создание элемента уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Добавление уведомления в контейнер
        notificationContainer.appendChild(notification);
        
        // Удаление уведомления через 3 секунды
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
});
