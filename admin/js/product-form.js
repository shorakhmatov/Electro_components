/**
 * Обработка формы товара
 */
$(document).ready(function() {
    // Обработчик отправки формы товара
    $('#productForm').submit(function(e) {
        e.preventDefault();
        
        // Создаем объект FormData для отправки файлов
        const formData = new FormData(this);
        
        // Определяем URL для запроса (добавление или обновление)
        const url = formData.get('id') ? 'api/update_product.php' : 'api/add_product.php';
        
        // Отправляем AJAX запрос
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
                    $('#productModal').css('display', 'none');
                    
                    // Перезагружаем список товаров
                    loadProducts();
                    
                    // Показываем уведомление
                    showNotification(response.message, 'success');
                } else {
                    // Проверяем, если это ошибка дублирования
                    if (response.message.includes('с таким названием уже существует')) {
                        // Выделяем поле с названием товара
                        $('#productName').addClass('error-input').focus();
                        
                        // Показываем уведомление об ошибке
                        showNotification('Товар с таким названием уже существует. Введите другое название.', 'error');
                    } else {
                        showNotification('Ошибка: ' + response.message, 'error');
                    }
                }
            },
            error: function() {
                showNotification('Произошла ошибка при сохранении товара', 'error');
            }
        });
    });
    
    // Загрузка категорий для селекта
    function loadCategoriesForSelect(selectedCategoryId = null) {
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
                        const selected = selectedCategoryId && selectedCategoryId == category.id ? 'selected' : '';
                        select.append(`<option value="${category.id}" ${selected}>${category.name}</option>`);
                    });
                } else {
                    showNotification('Ошибка: ' + response.message, 'error');
                }
            },
            error: function() {
                showNotification('Произошла ошибка при загрузке категорий', 'error');
            }
        });
    }
    
    // Вызываем функцию при открытии модального окна для добавления товара
    $('#addProductBtn').click(function() {
        loadCategoriesForSelect();
    });
    
    // Закрытие модального окна
    $('.close, .modal').click(function(e) {
        if (e.target === this) {
            $('.modal').css('display', 'none');
            // Сбрасываем состояние полей с ошибками
            resetErrorFields();
        }
    });
    
    // Сброс состояния полей с ошибками при изменении значения
    $('#productName').on('input', function() {
        $(this).removeClass('error-input');
    });
    
    // Функция для сброса всех полей с ошибками
    function resetErrorFields() {
        $('#productForm input, #productForm textarea, #productForm select').removeClass('error-input');
    }
    
    // Предпросмотр изображения перед загрузкой
    $('#productImage').change(function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#currentProductImage').attr('src', e.target.result);
                $('#currentImageContainer').show();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Экспортируем функцию для использования в других файлах
    window.loadCategoriesForSelect = loadCategoriesForSelect;
});
