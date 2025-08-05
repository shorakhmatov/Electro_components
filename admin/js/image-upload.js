/**
 * Обработка переключения между загрузкой файла и указанием ссылки на изображение
 */
$(document).ready(function() {
    // Обработчик переключения между загрузкой файла и указанием ссылки
    $('input[name="imageOption"]').change(function() {
        const selectedOption = $('input[name="imageOption"]:checked').val();
        
        if (selectedOption === 'upload') {
            $('#uploadImageContainer').show();
            $('#urlImageContainer').hide();
        } else {
            $('#uploadImageContainer').hide();
            $('#urlImageContainer').show();
        }
    });
    
    // Инициализация при открытии модального окна
    function initImageOptions() {
        const hasImage = $('#currentImageContainer').is(':visible');
        
        if (hasImage) {
            // Если есть изображение, устанавливаем опцию "Указать ссылку" по умолчанию
            $('#urlImageOption').prop('checked', true).trigger('change');
            
            // Получаем текущий URL изображения
            const currentImageUrl = $('#currentProductImage').attr('src');
            $('#imageUrl').val(currentImageUrl);
        } else {
            // Если нет изображения, устанавливаем опцию "Загрузить файл" по умолчанию
            $('#uploadImageOption').prop('checked', true).trigger('change');
        }
    }
    
    // Вызываем инициализацию при открытии модального окна для редактирования товара
    $('#productModal').on('shown', function() {
        initImageOptions();
    });
    
    // Также вызываем инициализацию при клике на кнопку добавления товара
    $('#addProductBtn').click(function() {
        setTimeout(initImageOptions, 100);
    });
});
