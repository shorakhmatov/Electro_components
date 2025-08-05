/**
 * Скрипт для управления админ-панелью
 */
$(document).ready(function() {
    // Показываем первую секцию по умолчанию
    $('.section:first').addClass('active');

    // Обработка клика по пунктам меню
    $('.nav-item').click(function() {
        const section = $(this).data('section');
        $('.section').removeClass('active');
        $(`#${section}`).addClass('active');

        // Загружаем данные при переходе в раздел
        if (section === 'categories') loadCategories();
        if (section === 'products') loadProducts();
        if (section === 'orders') loadOrders('all');
        if (section === 'users') loadUsers();
        if (section === 'banners') loadBanners();
    });
    
    // Загрузка данных при инициализации
    loadCategories();
    loadProducts();
    loadOrders('all');
    loadUsers();
    loadBanners();

    // Обработчики событий для табов заказов
    $('.order-tabs .tab').click(function() {
        $('.order-tabs .tab').removeClass('active');
        $(this).addClass('active');
        const status = $(this).data('status');
        loadOrders(status);
    });

    // Обработчик для добавления категории
    $('#addCategoryBtn').click(function() {
        $('#categoryId').val('');
        $('#categoryName').val('');
        $('#categoryIcon').val('');
        $('#categoryModalTitle').text('Добавить категорию');
        $('#categoryModal').css('display', 'block');
    });

    // Обработчик для добавления товара
    $('#addProductBtn').click(function() {
        // Очищаем все поля формы
        $('#productId').val('');
        $('#productName').val('');
        $('#productDescription').val('');
        $('#productSpecifications').val('');
        $('#productPrice').val('');
        $('#productQuantity').val('');
        $('#productImage').val('');
        $('#currentImageContainer').hide();
        $('#productModalTitle').text('Добавить товар');
        loadCategoriesForSelect();
        $('#productModal').css('display', 'block');
    });

    // Закрытие модальных окон
    $('.close').click(function() {
        $(this).closest('.modal').css('display', 'none');
    });

    // Обработка клика вне модального окна
    $(window).click(function(event) {
        if ($(event.target).hasClass('modal')) {
            $('.modal').css('display', 'none');
        }
    });

    // Обработка формы категории
    $('#categoryForm').submit(function(e) {
        e.preventDefault();
        const categoryId = $('#categoryId').val();
        const categoryName = $('#categoryName').val();
        const categoryIcon = $('#categoryIcon').val();

        const url = categoryId ? 'api/update_category.php' : 'api/add_category.php';
        const data = {
            id: categoryId,
            name: categoryName,
            icon: categoryIcon
        };

        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function(response) {
                if (response.status === 'success') {
                    $('#categoryModal').css('display', 'none');
                    loadCategories();
                    showNotification('Категория успешно сохранена', 'success');
                } else {
                    showNotification('Ошибка: ' + response.message, 'error');
                }
            },
            error: function() {
                showNotification('Произошла ошибка при сохранении категории', 'error');
            }
        });
    });

    // Обработка формы товара
    $('#productForm').submit(function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const productId = $('#productId').val();

        const url = productId ? 'api/update_product.php' : 'api/add_product.php';
        
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status === 'success') {
                    $('#productModal').css('display', 'none');
                    loadProducts();
                    showNotification('Товар успешно сохранен', 'success');
                } else {
                    showNotification('Ошибка: ' + response.message, 'error');
                }
            },
            error: function() {
                showNotification('Произошла ошибка при сохранении товара', 'error');
            }
        });
    });

    // Обработка импорта из Excel
    $('#uploadExcelBtn').click(function() {
        const fileInput = $('#excelFile')[0];
        if (fileInput.files.length === 0) {
            showNotification('Выберите файл Excel', 'error');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                // Предпросмотр данных
                showExcelPreview(jsonData);
            } catch (error) {
                showNotification('Ошибка при чтении файла: ' + error.message, 'error');
            }
        };

        reader.readAsArrayBuffer(file);
    });

    // Подтверждение импорта
    $('#confirmImportBtn').click(function() {
        const fileInput = $('#excelFile')[0];
        if (fileInput.files.length === 0) {
            showNotification('Выберите файл Excel', 'error');
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('excel_file', file);

        $.ajax({
            url: 'api/import_products.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.status === 'success') {
                    showNotification('Товары успешно импортированы: ' + response.imported_count, 'success');
                    $('#importPreview').hide();
                    $('#excelFile').val('');
                    loadProducts();
                } else {
                    showNotification('Ошибка: ' + response.message, 'error');
                }
            },
            error: function() {
                showNotification('Произошла ошибка при импорте товаров', 'error');
            }
        });
    });

    // Обработчики для кнопок действий с заказами
    $('#approveOrderBtn').click(function() {
        const orderId = $('#orderIdDisplay').text();
        updateOrderStatus(orderId, 'processing');
    });

    $('#shipOrderBtn').click(function() {
        const orderId = $('#orderIdDisplay').text();
        updateOrderStatus(orderId, 'shipped');
    });

    $('#cancelOrderBtn').click(function() {
        const orderId = $('#orderIdDisplay').text();
        updateOrderStatus(orderId, 'cancelled');
    });
});

// Функция для загрузки категорий
function loadCategories() {
    $.ajax({
        url: 'api/get_categories.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                renderCategories(response.categories);
            } else {
                showNotification('Ошибка загрузки категорий: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке категорий', 'error');
        }
    });
}

// Функция для загрузки категорий в выпадающий список
function loadCategoriesForSelect() {
    $.ajax({
        url: 'api/get_categories.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const select = $('#productCategory');
                select.empty();
                
                response.categories.forEach(function(category) {
                    select.append(`<option value="${category.id}">${category.name}</option>`);
                });
            } else {
                showNotification('Ошибка загрузки категорий: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке категорий', 'error');
        }
    });
}

// Функция для отображения категорий
function renderCategories(categories) {
    const tbody = $('#categoriesTable tbody');
    tbody.empty();

    categories.forEach(function(category) {
        const row = `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td><i class="${category.icon}"></i> ${category.icon}</td>
                <td>
                    <button class="btn-edit" onclick="editCategory(${category.id})">Редактировать</button>
                    <button class="btn-delete" onclick="deleteCategory(${category.id})">Удалить</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Функция для загрузки товаров
function loadProducts() {
    $.ajax({
        url: 'api/get_products.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                renderProducts(response.products);
            } else {
                showNotification('Ошибка загрузки товаров: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке товаров', 'error');
        }
    });
}

// Функция для отображения товаров
function renderProducts(products) {
    const tbody = $('#productsTable tbody');
    tbody.empty();
    
    if (products.length === 0) {
        tbody.append('<tr><td colspan="7" class="no-data">Товаров пока нет</td></tr>');
        return;
    }

    products.forEach(function(product) {
        const imageUrl = product.image_url ? product.image_url : '/assets/img/no-image.png';
        const row = `
            <tr>
                <td>${product.id}</td>
                <td><img src="${imageUrl}" alt="${product.name}" class="product-thumbnail"></td>
                <td>${product.name}</td>
                <td>${product.category_name}</td>
                <td>${product.price} ₽</td>
                <td>${product.quantity || 0}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewProductOnSite(${product.id})" title="Просмотр на сайте">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Функция для загрузки заказов
function loadOrders(status) {
    $.ajax({
        url: 'api/get_orders.php',
        type: 'GET',
        data: { status: status },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                renderOrders(response.orders);
            } else {
                showNotification('Ошибка загрузки заказов: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке заказов', 'error');
        }
    });
}

// Функция для отображения заказов
function renderOrders(orders) {
    const tbody = $('#ordersTable tbody');
    tbody.empty();

    if (orders.length === 0) {
        tbody.append('<tr><td colspan="6" class="text-center">Нет заказов с выбранным статусом</td></tr>');
        return;
    }

    orders.forEach(function(order) {
        const statusText = getStatusText(order.status);
        const statusClass = getStatusClass(order.status);
        
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${order.user_name}</td>
                <td>${order.total_amount} ₽</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>${formatDate(order.created_at)}</td>
                <td>
                    <button class="btn-view" onclick="viewOrder(${order.id})">Детали</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Функция для загрузки пользователей
function loadUsers() {
    $.ajax({
        url: 'api/get_users.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                renderUsers(response.users);
            } else {
                showNotification('Ошибка загрузки пользователей: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке пользователей', 'error');
        }
    });
}

// Функция для отображения пользователей
function renderUsers(users) {
    const tbody = $('#usersTable tbody');
    tbody.empty();

    users.forEach(function(user) {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.balance} ₽</td>
                <td>${formatDate(user.created_at)}</td>
                <td>
                    <button class="btn-view" onclick="viewUser(${user.id})">Детали</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Функция для редактирования категории
function editCategory(id) {
    $.ajax({
        url: 'api/get_category.php',
        type: 'GET',
        data: { id: id },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const category = response.category;
                $('#categoryId').val(category.id);
                $('#categoryName').val(category.name);
                $('#categoryIcon').val(category.icon);
                $('#categoryModalTitle').text('Редактировать категорию');
                $('#categoryModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при получении данных категории', 'error');
        }
    });
}

// Функция для удаления категории
function deleteCategory(id) {
    if (confirm('Вы уверены, что хотите удалить эту категорию? Все товары в этой категории также будут удалены.')) {
        $.ajax({
            url: 'api/delete_category.php',
            type: 'POST',
            data: { id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    loadCategories();
                    showNotification('Категория успешно удалена', 'success');
                } else {
                    showNotification('Ошибка: ' + response.message, 'error');
                }
            },
            error: function() {
                showNotification('Произошла ошибка при удалении категории', 'error');
            }
        });
    }
}

// Функция для просмотра товара
function viewProduct(id) {
    window.open(`../product.php?id=${id}`, '_blank');
}

// Функция для редактирования товара
function editProduct(id) {
    $.ajax({
        url: 'api/get_product.php',
        type: 'GET',
        data: { id: id },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const product = response.product;
                $('#productId').val(product.id);
                $('#productName').val(product.name);
                $('#productDescription').val(product.description);
                $('#productPrice').val(product.price);
                $('#productQuantity').val(product.stock_quantity);
                
                loadCategoriesForSelect();
                setTimeout(function() {
                    $('#productCategory').val(product.category_id);
                }, 500);
                
                if (product.image_url) {
                    $('#currentImage').attr('src', product.image_url);
                    $('#currentImageContainer').show();
                } else {
                    $('#currentImageContainer').hide();
                }
                
                $('#productModalTitle').text('Редактировать товар');
                $('#productModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при получении данных товара', 'error');
        }
    });
}

// Функция для удаления товара
function deleteProduct(id) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        $.ajax({
            url: 'api/delete_product.php',
            type: 'POST',
            data: { id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    loadProducts();
                    showNotification('Товар успешно удален', 'success');
                } else {
                    showNotification('Ошибка: ' + response.message, 'error');
                }
            },
            error: function() {
                showNotification('Произошла ошибка при удалении товара', 'error');
            }
        });
    }
}

// Функция для просмотра деталей заказа
function viewOrder(id) {
    $.ajax({
        url: 'api/get_order_details.php',
        type: 'GET',
        data: { id: id },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const order = response.order;
                const items = response.items;
                
                // Заполняем данные в модальном окне
                $('#orderIdDisplay').text(order.id);
                $('#customerName').text(`${order.first_name} ${order.last_name}`);
                $('#customerEmail').text(order.email);
                $('#customerPhone').text(order.phone);
                $('#deliveryAddress').text(order.address || 'Не указан');
                $('#orderTotal').text(order.total_amount);
                
                // Заполняем товары
                const tbody = $('#orderItemsList');
                tbody.empty();
                
                items.forEach(function(item) {
                    const row = `
                        <tr>
                            <td>${item.product_name}</td>
                            <td>${item.price_per_unit} ₽</td>
                            <td>${item.quantity}</td>
                            <td>${item.price_per_unit * item.quantity} ₽</td>
                        </tr>
                    `;
                    tbody.append(row);
                });
                
                // Показываем/скрываем кнопки в зависимости от статуса
                if (order.status === 'pending') {
                    $('#approveOrderBtn').show();
                    $('#shipOrderBtn').hide();
                    $('#cancelOrderBtn').show();
                } else if (order.status === 'processing') {
                    $('#approveOrderBtn').hide();
                    $('#shipOrderBtn').show();
                    $('#cancelOrderBtn').show();
                } else {
                    $('#approveOrderBtn').hide();
                    $('#shipOrderBtn').hide();
                    $('#cancelOrderBtn').hide();
                }
                
                // Показываем модальное окно
                $('#orderDetailsModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при получении деталей заказа', 'error');
        }
    });
}

// Функция для обновления статуса заказа
function updateOrderStatus(id, status) {
    $.ajax({
        url: 'api/update_order_status.php',
        type: 'POST',
        data: { id: id, status: status },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                $('#orderDetailsModal').css('display', 'none');
                loadOrders($('.order-tabs .tab.active').data('status'));
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

// Функция для загрузки баннеров
function loadBanners() {
    $.ajax({
        url: 'api/get_banners.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                renderBanners(response.data);
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке баннеров', 'error');
        }
    });
}

// Функция для отображения баннеров
function renderBanners(banners) {
    const tableBody = $('#bannersTable tbody');
    tableBody.empty();
    
    if (banners.length === 0) {
        tableBody.append('<tr><td colspan="7" class="no-data">Баннеров пока нет</td></tr>');
        return;
    }
    
    banners.forEach(function(banner) {
        const imagePreview = banner.image_url ? 
            `<img src="${banner.image_url}" alt="${banner.title}" class="thumbnail">` : 
            '<span class="no-image">Нет изображения</span>';
        
        const isActive = banner.is_active == 1 ? 
            '<span class="status-active">Да</span>' : 
            '<span class="status-inactive">Нет</span>';
        
        const row = `
            <tr>
                <td>${banner.id}</td>
                <td>${imagePreview}</td>
                <td>${banner.title || '-'}</td>
                <td>${banner.subtitle || '-'}</td>
                <td>${banner.link || '-'}</td>
                <td>${isActive}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editBanner(${banner.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteBanner(${banner.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        
        tableBody.append(row);
    });
}

// Функция для редактирования баннера
function editBanner(id) {
    // Загрузка данных баннера для редактирования
    $.ajax({
        url: 'api/get_banner.php',
        type: 'GET',
        data: { id: id },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const banner = response.data;
                
                // Заполняем форму данными баннера
                $('#bannerId').val(banner.id);
                $('#bannerTitle').val(banner.title);
                $('#bannerSubtitle').val(banner.subtitle);
                $('#bannerLink').val(banner.link);
                $('#bannerIsActive').prop('checked', banner.is_active == 1);
                
                // Показываем текущее изображение, если оно есть
                if (banner.image_url) {
                    $('#currentBannerImage').attr('src', banner.image_url);
                    $('#currentBannerImageContainer').show();
                } else {
                    $('#currentBannerImageContainer').hide();
                }
                
                // Меняем заголовок модального окна
                $('#bannerModalTitle').text('Редактировать баннер');
                
                // Показываем модальное окно
                $('#bannerModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке данных баннера', 'error');
        }
    });
}

// Функция для удаления баннера
function deleteBanner(id) {
    if (confirm('Вы уверены, что хотите удалить этот баннер?')) {
        $.ajax({
            url: 'api/delete_banner.php',
            type: 'POST',
            data: { id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    loadBanners(); // Перезагружаем список баннеров
                    showNotification('Баннер успешно удален', 'success');
                } else {
                    showNotification('Ошибка: ' + response.message, 'error');
                }
            },
            error: function() {
                showNotification('Произошла ошибка при удалении баннера', 'error');
            }
        });
    }
}

// Функция для просмотра данных пользователя
function viewUser(id) {
    // Здесь можно добавить код для просмотра деталей пользователя
    // Например, открыть модальное окно с информацией о пользователе
}

// Функция для предпросмотра данных из Excel
function showExcelPreview(data) {
    if (data.length < 2) {
        showNotification('Файл не содержит данных или имеет неверный формат', 'error');
        return;
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Создаем таблицу предпросмотра
    const table = $('#previewTable');
    table.empty();
    
    // Добавляем заголовки
    let headerRow = '<thead><tr>';
    headers.forEach(function(header) {
        headerRow += `<th>${header}</th>`;
    });
    headerRow += '</tr></thead>';
    table.append(headerRow);
    
    // Добавляем строки с данными
    let tbody = '<tbody>';
    rows.forEach(function(row) {
        tbody += '<tr>';
        for (let i = 0; i < headers.length; i++) {
            tbody += `<td>${row[i] || ''}</td>`;
        }
        tbody += '</tr>';
    });
    tbody += '</tbody>';
    table.append(tbody);
    
    // Показываем предпросмотр и кнопку подтверждения
    $('#importPreview').show();
    $('#confirmImportBtn').show();
}

// Функция для отображения уведомлений
function showNotification(message, type) {
    const notification = $('<div class="notification"></div>');
    notification.addClass(type);
    notification.text(message);
    
    $('body').append(notification);
    
    setTimeout(function() {
        notification.addClass('show');
        
        setTimeout(function() {
            notification.removeClass('show');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// Вспомогательные функции
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Новый',
        'processing': 'В обработке',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const classMap = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipped': 'status-shipped',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
    };
    return classMap[status] || '';
}
