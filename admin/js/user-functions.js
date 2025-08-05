/**
 * Функции для работы с пользователями в админ-панели
 */

// Загрузка пользователей
function loadUsers() {
    $.ajax({
        url: 'api/get_users.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                renderUsers(response.users);
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке пользователей', 'error');
        }
    });
}

// Отображение пользователей в таблице
function renderUsers(users) {
    const tbody = $('#usersTable tbody');
    tbody.empty();
    
    if (users.length === 0) {
        tbody.append('<tr><td colspan="6" class="no-data">Пользователей пока нет</td></tr>');
        return;
    }
    
    users.forEach(function(user) {
        // Форматирование даты
        const date = new Date(user.created_at);
        const formattedDate = date.toLocaleDateString('ru-RU');
        
        // Форматирование имени
        const fullName = user.first_name + ' ' + (user.last_name || '');
        
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${fullName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewUserDetails(${user.id})" title="Просмотр деталей">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn orders-btn" onclick="viewUserOrders(${user.id})" title="Заказы пользователя">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Просмотр деталей пользователя
function viewUserDetails(userId) {
    $.ajax({
        url: 'api/get_user_details.php',
        type: 'GET',
        data: { id: userId },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const user = response.user;
                
                // Заполняем информацию о пользователе
                $('#userDetailsId').text(user.id);
                $('#userDetailsName').text(user.first_name + ' ' + (user.last_name || ''));
                $('#userDetailsEmail').text(user.email);
                $('#userDetailsPhone').text(user.phone);
                $('#userDetailsBalance').text(parseFloat(user.balance).toFixed(2) + ' ₽');
                $('#userDetailsAddress').text(user.address || 'Не указан');
                $('#userDetailsCreated').text(new Date(user.created_at).toLocaleString('ru-RU'));
                
                // Если есть аватар, показываем его
                if (user.avatar_url) {
                    $('#userDetailsAvatar').attr('src', user.avatar_url).show();
                } else {
                    $('#userDetailsAvatar').hide();
                }
                
                // Показываем модальное окно
                $('#userDetailsModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке деталей пользователя', 'error');
        }
    });
}

// Просмотр заказов пользователя
function viewUserOrders(userId) {
    $.ajax({
        url: 'api/get_user_orders.php',
        type: 'GET',
        data: { user_id: userId },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const orders = response.orders;
                const user = response.user;
                
                // Заполняем информацию о пользователе
                $('#userOrdersTitle').text('Заказы пользователя: ' + user.first_name + ' ' + (user.last_name || ''));
                
                // Заполняем таблицу заказов
                const tbody = $('#userOrdersTable tbody');
                tbody.empty();
                
                if (orders.length === 0) {
                    tbody.append('<tr><td colspan="5" class="no-data">У пользователя пока нет заказов</td></tr>');
                } else {
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
                                <td>${formattedDate}</td>
                                <td>${parseFloat(order.total_amount).toFixed(2)} ₽</td>
                                <td><span class="status ${statusClass}">${statusText}</span></td>
                                <td>
                                    <button class="action-btn view-btn" onclick="viewOrderDetails(${order.id})" title="Просмотр деталей">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                }
                
                // Показываем модальное окно
                $('#userOrdersModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке заказов пользователя', 'error');
        }
    });
}

// Поиск пользователей
function searchUsers(query) {
    if (!query) {
        loadUsers();
        return;
    }
    
    $.ajax({
        url: 'api/search_users.php',
        type: 'GET',
        data: { query: query },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                renderUsers(response.users);
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при поиске пользователей', 'error');
        }
    });
}

// Экспорт пользователей
function exportUsers() {
    // Отображение индикатора загрузки
    $('#exportUsersResult').html('<div class="loading-spinner"></div><p>Экспорт пользователей...</p>');
    
    $.ajax({
        url: 'api/export_users.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const users = response.users;
                
                // Создание рабочей книги Excel
                const wb = XLSX.utils.book_new();
                
                // Заголовки
                const headers = ['ID', 'Имя', 'Фамилия', 'Email', 'Телефон', 'Баланс', 'Дата регистрации'];
                
                // Данные для экспорта
                const data = [headers];
                
                users.forEach(function(user) {
                    data.push([
                        user.id,
                        user.first_name,
                        user.last_name || '',
                        user.email,
                        user.phone,
                        user.balance,
                        user.created_at
                    ]);
                });
                
                // Создание листа
                const ws = XLSX.utils.aoa_to_sheet(data);
                
                // Добавление листа в книгу
                XLSX.utils.book_append_sheet(wb, ws, 'Users');
                
                // Генерация имени файла с датой
                const date = new Date();
                const dateStr = date.toISOString().split('T')[0];
                const fileName = `users_export_${dateStr}.xlsx`;
                
                // Сохранение файла
                XLSX.writeFile(wb, fileName);
                
                $('#exportUsersResult').html(`
                    <div class="export-success">
                        <i class="fas fa-check-circle"></i>
                        <p>Экспорт успешно завершен</p>
                        <p>Экспортировано пользователей: ${users.length}</p>
                    </div>
                `);
                
                showNotification('Пользователи успешно экспортированы', 'success');
            } else {
                $('#exportUsersResult').html(`
                    <div class="export-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Ошибка экспорта: ${response.message}</p>
                    </div>
                `);
                
                showNotification('Ошибка экспорта: ' + response.message, 'error');
            }
        },
        error: function() {
            $('#exportUsersResult').html(`
                <div class="export-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Произошла ошибка при экспорте пользователей</p>
                </div>
            `);
            
            showNotification('Произошла ошибка при экспорте пользователей', 'error');
        }
    });
}

// Инициализация обработчиков событий
$(document).ready(function() {
    // Обработчик поиска пользователей
    $('#searchUsersInput').on('input', function() {
        const query = $(this).val().trim();
        searchUsers(query);
    });
    
    // Обработчик кнопки экспорта пользователей
    $('#exportUsersBtn').click(function() {
        exportUsers();
    });
    
    // Закрытие модальных окон
    $('.close, .modal').click(function(e) {
        if (e.target === this) {
            $('.modal').css('display', 'none');
        }
    });
});
