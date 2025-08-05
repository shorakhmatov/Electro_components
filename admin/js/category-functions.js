/**
 * Функции для работы с категориями в админ-панели
 */

// Загрузка категорий
function loadCategories() {
    $.ajax({
        url: 'api/get_categories.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                renderCategories(response.categories);
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке категорий', 'error');
        }
    });
}

// Отображение категорий в таблице
function renderCategories(categories) {
    const tbody = $('#categoriesTable tbody');
    tbody.empty();
    
    if (categories.length === 0) {
        tbody.append('<tr><td colspan="6" class="no-data">Категорий пока нет</td></tr>');
        return;
    }
    
    // Получаем количество товаров в каждой категории
    $.ajax({
        url: 'api/get_products.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const products = response.products;
                const categoryCounts = {};
                
                // Подсчитываем количество товаров в каждой категории
                products.forEach(function(product) {
                    if (!categoryCounts[product.category_id]) {
                        categoryCounts[product.category_id] = 0;
                    }
                    categoryCounts[product.category_id]++;
                });
                
                // Отображаем категории с количеством товаров
                categories.forEach(function(category) {
                    const productCount = categoryCounts[category.id] || 0;
                    const row = `
                        <tr>
                            <td>${category.id}</td>
                            <td>${category.name}</td>
                            <td>${productCount}</td>
                            <td>
                                <button class="action-btn view-btn" onclick="viewCategoryProducts(${category.id})" title="Просмотр товаров">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn edit-btn" onclick="editCategory(${category.id})" title="Редактировать">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete-btn" onclick="deleteCategory(${category.id})" title="Удалить">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                    tbody.append(row);
                });
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            // Если не удалось получить товары, просто отображаем категории без количества товаров
            categories.forEach(function(category) {
                const row = `
                    <tr>
                        <td>${category.id}</td>
                        <td>${category.name}</td>
                        <td>-</td>
                        <td>
                            <button class="action-btn view-btn" onclick="viewCategoryProducts(${category.id})" title="Просмотр товаров">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit-btn" onclick="editCategory(${category.id})" title="Редактировать">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="deleteCategory(${category.id})" title="Удалить">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
        }
    });
}

// Функция для редактирования категории
function editCategory(id) {
    $.ajax({
        url: 'api/get_categories.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const category = response.categories.find(cat => cat.id == id);
                
                if (category) {
                    // Заполняем форму данными категории
                    $('#categoryId').val(category.id);
                    $('#categoryName').val(category.name);
                    
                    // Меняем заголовок модального окна
                    $('#categoryModalTitle').text('Редактировать категорию');
                    
                    // Показываем модальное окно
                    $('#categoryModal').css('display', 'block');
                } else {
                    showNotification('Категория не найдена', 'error');
                }
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке данных категории', 'error');
        }
    });
}

// Функция для просмотра товаров в категории
function viewCategoryProducts(id) {
    $.ajax({
        url: 'api/get_products_by_category.php',
        type: 'GET',
        data: { category_id: id },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                // Получаем данные о категории и товарах
                const products = response.products;
                const category = response.category;
                
                // Заполняем заголовок модального окна
                $('#categoryProductsModalTitle').text('Товары в категории: ' + category.name);
                
                // Добавляем кнопку для быстрого добавления товара в эту категорию
                $('#categoryProductsActions').html(`
                    <button class="add-button" onclick="addProductToCategory(${id})">
                        <i class="fas fa-plus"></i> Добавить товар в эту категорию
                    </button>
                `);
                
                // Заполняем таблицу товарами
                const tbody = $('#categoryProductsTable tbody');
                tbody.empty();
                
                if (products.length === 0) {
                    tbody.append('<tr><td colspan="6" class="no-data">В этой категории пока нет товаров</td></tr>');
                } else {
                    products.forEach(function(product) {
                        const imageUrl = product.image_url ? product.image_url : '/assets/img/no-image.png';
                        const row = `
                            <tr>
                                <td>${product.id}</td>
                                <td><img src="${imageUrl}" alt="${product.name}" class="product-thumbnail"></td>
                                <td>${product.name}</td>
                                <td>${product.price} ₽</td>
                                <td>${product.quantity || 0}</td>
                                <td>
                                    <button class="action-btn view-btn" onclick="viewProductOnSite(${product.id})" title="Просмотр на сайте">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})" title="Редактировать">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                }
                
                // Показываем модальное окно
                $('#categoryProductsModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке товаров', 'error');
        }
    });
}

// Функция для удаления категории
function deleteCategory(id) {
    if (confirm('Вы уверены, что хотите удалить эту категорию? Все товары в этой категории также будут удалены!')) {
        $.ajax({
            url: 'api/delete_category.php',
            type: 'POST',
            data: { id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    loadCategories(); // Перезагружаем список категорий
                    
                    // Показываем уведомление с информацией о количестве удаленных товаров
                    const message = `Категория успешно удалена. ${response.products_deleted > 0 ? 'Удалено товаров: ' + response.products_deleted : ''}`;
                    showNotification(message, 'success');
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

// Функция для быстрого добавления товара в выбранную категорию
function addProductToCategory(categoryId) {
    // Закрываем модальное окно с товарами в категории
    $('#categoryProductsModal').css('display', 'none');
    
    // Очищаем форму добавления товара
    $('#productId').val('');
    $('#productName').val('');
    $('#productDescription').val('');
    $('#productSpecifications').val('');
    $('#productPrice').val('');
    $('#productQuantity').val('');
    $('#productImage').val('');
    $('#currentImageContainer').hide();
    
    // Загружаем категории для селекта и выбираем нужную
    $.ajax({
        url: 'api/get_categories.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const select = $('#productCategory');
                select.empty();
                
                // Добавляем пустой вариант
                select.append('<option value="">Выберите категорию</option>');
                
                // Добавляем категории
                response.categories.forEach(function(category) {
                    const selected = category.id == categoryId ? 'selected' : '';
                    select.append(`<option value="${category.id}" ${selected}>${category.name}</option>`);
                });
                
                // Меняем заголовок модального окна
                $('#productModalTitle').text('Добавить товар');
                
                // Показываем модальное окно
                $('#productModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке категорий', 'error');
        }
    });
}

// Инициализация обработчиков событий
$(document).ready(function() {
    // Обработчик отправки формы категории
    $('#categoryForm').submit(function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const url = formData.get('id') ? 'api/update_category.php' : 'api/add_category.php';
        
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    // Закрываем модальное окно
                    $('#categoryModal').css('display', 'none');
                    
                    // Перезагружаем список категорий
                    loadCategories();
                    
                    // Показываем уведомление
                    showNotification(response.message, 'success');
                } else {
                    // Проверяем, если это ошибка дублирования
                    if (response.message.includes('с этим именем уже существует')) {
                        // Выделяем поле с названием категории
                        $('#categoryName').addClass('error-input').focus();
                        
                        // Показываем уведомление об ошибке
                        showNotification('Категория с таким названием уже существует. Введите другое название.', 'error');
                    } else {
                        showNotification('Ошибка: ' + response.message, 'error');
                    }
                }
            },
            error: function() {
                showNotification('Произошла ошибка при сохранении категории', 'error');
            }
        });
    });
    
    // Сброс состояния полей с ошибками при изменении значения
    $('#categoryName').on('input', function() {
        $(this).removeClass('error-input');
    });
    
    // Функция для сброса всех полей с ошибками
    function resetErrorFields() {
        $('#categoryForm input, #categoryForm textarea').removeClass('error-input');
    }
    
    // Сброс формы при открытии модального окна для добавления категории
    $('#addCategoryBtn').click(function() {
        $('#categoryId').val('');
        $('#categoryName').val('');
        $('#categoryModalTitle').text('Добавить категорию');
        resetErrorFields();
        $('#categoryModal').css('display', 'block');
    });
    
    // Закрытие модального окна
    $('.close, .modal').click(function(e) {
        if (e.target === this) {
            $('.modal').css('display', 'none');
            resetErrorFields();
        }
    });
});
