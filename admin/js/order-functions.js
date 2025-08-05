/**
 * Функции для работы с заказами в админ-панели
 */

// Загрузка заказов
function loadOrders(status = 'all') {
    $.ajax({
        url: 'api/get_orders.php',
        type: 'GET',
        data: { status: status },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                renderOrders(response.orders);
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке заказов', 'error');
        }
    });
}

// Отображение заказов в таблице
function renderOrders(orders) {
    const tbody = $('#ordersTable tbody');
    tbody.empty();
    
    if (orders.length === 0) {
        tbody.append('<tr><td colspan="6" class="no-data">Заказов пока нет</td></tr>');
        return;
    }
    
    orders.forEach(function(order) {
        // Форматирование даты
        const date = new Date(order.created_at);
        const formattedDate = date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
        
        // Определение класса для статуса
        const statusClass = getStatusClass(order.status);
        
        // Получение текста статуса на русском
        const statusText = getStatusText(order.status);
        
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${order.user_name}<br><small>${order.email}</small></td>
                <td>${formattedDate}</td>
                <td>${parseFloat(order.total_amount).toFixed(2)} ₽</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn view-btn" onclick="viewOrderDetails(${order.id})" title="Просмотр деталей">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="changeOrderStatus(${order.id})" title="Изменить статус">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Получение класса для статуса
function getStatusClass(status) {
    switch(status) {
        case 'pending': return 'status-pending';
        case 'processing': return 'status-processing';
        case 'shipped': return 'status-shipped';
        case 'delivered': return 'status-delivered';
        case 'cancelled': return 'status-cancelled';
        default: return 'status-pending';
    }
}

// Получение текста статуса на русском
function getStatusText(status) {
    switch(status) {
        case 'pending': return 'Новый';
        case 'processing': return 'В обработке';
        case 'shipped': return 'Отправлен';
        case 'delivered': return 'Доставлен';
        case 'cancelled': return 'Отменен';
        default: return 'Новый';
    }
}

// Просмотр деталей заказа
function viewOrderDetails(orderId) {
    $.ajax({
        url: 'api/get_order_details.php',
        type: 'GET',
        data: { id: orderId },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const order = response.order;
                const items = response.items;
                
                // Заполняем информацию о заказе
                $('#orderDetailsId').text(order.id);
                $('#orderDetailsDate').text(new Date(order.created_at).toLocaleString('ru-RU'));
                $('#orderDetailsStatus').text(getStatusText(order.status));
                $('#orderDetailsStatus').removeClass().addClass('status ' + getStatusClass(order.status));
                $('#orderDetailsTotal').text(parseFloat(order.total_amount).toFixed(2) + ' ₽');
                
                // Заполняем информацию о клиенте
                $('#orderDetailsCustomerName').text(order.first_name + ' ' + order.last_name);
                $('#orderDetailsCustomerEmail').text(order.email);
                $('#orderDetailsCustomerPhone').text(order.phone);
                $('#orderDetailsCustomerAddress').text(order.address || 'Не указан');
                
                // Добавляем адрес доставки
                if (order.delivery_address) {
                    // Если в интерфейсе еще нет элемента для адреса доставки, добавляем его
                    if ($('.customer-info p:contains("Адрес доставки")').length === 0) {
                        $('.customer-info').append('<p><strong>Адрес доставки:</strong> <span id="orderDetailsDeliveryAddress"></span></p>');
                    }
                    $('#orderDetailsDeliveryAddress').text(order.delivery_address);
                }
                
                // Заполняем таблицу товаров
                const tbody = $('#orderItemsTable tbody');
                tbody.empty();
                
                let totalItems = 0;
                
                items.forEach(function(item, index) {
                    const imageUrl = item.image_url ? item.image_url : '/assets/img/no-image.png';
                    const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td><img src="${imageUrl}" alt="${item.product_name}" class="product-thumbnail"></td>
                            <td>${item.product_name}</td>
                            <td>${parseFloat(item.price_per_unit).toFixed(2)} ₽</td>
                            <td>${item.quantity}</td>
                            <td>${parseFloat(item.price_per_unit * item.quantity).toFixed(2)} ₽</td>
                        </tr>
                    `;
                    tbody.append(row);
                    totalItems += parseInt(item.quantity);
                });
                
                // Обновляем общую информацию
                $('#orderDetailsTotalItems').text(totalItems);
                
                // Показываем кнопки изменения статуса в зависимости от текущего статуса
                updateStatusButtons(order.status, orderId);
                
                // Показываем модальное окно
                $('#orderDetailsModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке деталей заказа', 'error');
        }
    });
}

// Обновление кнопок изменения статуса
function updateStatusButtons(currentStatus, orderId) {
    const buttonsContainer = $('#orderStatusButtons');
    buttonsContainer.empty();
    
    // Определяем, какие кнопки показывать в зависимости от текущего статуса
    switch(currentStatus) {
        case 'pending':
            buttonsContainer.append(`
                <button class="status-btn processing-btn" onclick="updateOrderStatus(${orderId}, 'processing')">Принять в обработку</button>
                <button class="status-btn cancel-btn" onclick="updateOrderStatus(${orderId}, 'cancelled')">Отменить заказ</button>
            `);
            break;
        case 'processing':
            buttonsContainer.append(`
                <button class="status-btn shipped-btn" onclick="updateOrderStatus(${orderId}, 'shipped')">Отправить</button>
                <button class="status-btn cancel-btn" onclick="updateOrderStatus(${orderId}, 'cancelled')">Отменить заказ</button>
            `);
            break;
        case 'shipped':
            buttonsContainer.append(`
                <button class="status-btn delivered-btn" onclick="updateOrderStatus(${orderId}, 'delivered')">Пометить как доставленный</button>
                <button class="status-btn cancel-btn" onclick="updateOrderStatus(${orderId}, 'cancelled')">Отменить заказ</button>
            `);
            break;
        case 'delivered':
            // Для доставленных заказов не показываем кнопки изменения статуса
            break;
        case 'cancelled':
            // Для отмененных заказов не показываем кнопки изменения статуса
            break;
    }
}

// Изменение статуса заказа
function changeOrderStatus(orderId) {
    // Открываем модальное окно для изменения статуса
    $('#changeStatusOrderId').val(orderId);
    $('#changeStatusModal').css('display', 'block');
}

// Обновление статуса заказа
function updateOrderStatus(orderId, newStatus) {
    $.ajax({
        url: 'api/update_order_status.php',
        type: 'POST',
        data: { 
            id: orderId, 
            status: newStatus 
        },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                // Закрываем модальные окна
                $('.modal').css('display', 'none');
                
                // Перезагружаем список заказов
                const activeTab = $('.filter-btn.active').data('status');
                loadOrders(activeTab);
                
                // Показываем уведомление
                showNotification('Статус заказа успешно обновлен', 'success');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при обновлении статуса заказа', 'error');
        }
    });
}

// Инициализация обработчиков событий
$(document).ready(function() {
    // Обработчик клика по кнопкам фильтрации заказов
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        const status = $(this).data('status');
        loadOrders(status);
    });
    
    // Обработчик отправки формы изменения статуса
    $('#changeStatusForm').submit(function(e) {
        e.preventDefault();
        
        const orderId = $('#changeStatusOrderId').val();
        const newStatus = $('#changeStatusSelect').val();
        
        updateOrderStatus(orderId, newStatus);
    });
    
    // Закрытие модальных окон
    $('.close, .modal').click(function(e) {
        if (e.target === this) {
            $('.modal').css('display', 'none');
        }
    });
});
