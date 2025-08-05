/**
 * Функции для работы с товарами в админ-панели
 */

// Функция для просмотра товара на сайте
function viewProductOnSite(id) {
    // Получаем URL товара из API
    $.ajax({
        url: 'api/get_product.php',
        type: 'GET',
        data: { id: id },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                // Открываем товар в новой вкладке
                window.open(response.product.view_url, '_blank');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке данных товара', 'error');
        }
    });
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
                
                // Заполняем форму данными товара
                $('#productId').val(product.id);
                $('#productName').val(product.name);
                $('#productDescription').val(product.description);
                $('#productSpecifications').val(product.specifications);
                $('#productPrice').val(product.price);
                $('#productQuantity').val(product.quantity);
                
                // Выбираем категорию
                loadCategoriesForSelect(product.category_id);
                
                // Показываем текущее изображение, если оно есть
                if (product.image_url) {
                    $('#currentProductImage').attr('src', product.image_url);
                    $('#currentImageContainer').show();
                } else {
                    $('#currentImageContainer').hide();
                }
                
                // Меняем заголовок модального окна
                $('#productModalTitle').text('Редактировать товар');
                
                // Показываем модальное окно
                $('#productModal').css('display', 'block');
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке данных товара', 'error');
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
                    loadProducts(); // Перезагружаем список товаров
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
