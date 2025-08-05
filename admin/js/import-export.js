/**
 * Функции для импорта и экспорта товаров
 */

// Обработка выбора Excel файла
$('#excelFile').change(function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Проверка типа файла
    const fileType = file.name.split('.').pop().toLowerCase();
    if (fileType !== 'xlsx' && fileType !== 'xls') {
        showNotification('Поддерживаются только файлы Excel (.xlsx, .xls)', 'error');
        $('#excelFile').val('');
        return;
    }
    
    // Чтение файла Excel
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Получение первого листа
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Преобразование в JSON
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Проверка наличия данных
        if (jsonData.length < 2) {
            showNotification('Файл не содержит данных', 'error');
            return;
        }
        
        // Проверка заголовков
        const headers = jsonData[0];
        const requiredHeaders = ['name', 'price', 'quantity', 'description'];
        const optionalHeaders = ['category', 'category_id'];
        
        // Проверка наличия всех необходимых заголовков
        const headersLower = headers.map(h => String(h).toLowerCase());
        const missingHeaders = requiredHeaders.filter(h => !headersLower.includes(h));
        
        // Проверка наличия хотя бы одного из опциональных заголовков
        const hasOptionalHeader = optionalHeaders.some(h => headersLower.includes(h));
        
        if (!hasOptionalHeader) {
            missingHeaders.push('category or category_id');
        }
        
        if (missingHeaders.length > 0) {
            showNotification('Отсутствуют обязательные заголовки: ' + missingHeaders.join(', '), 'error');
            return;
        }
        
        // Отображение данных в таблице предпросмотра
        renderPreviewTable(jsonData);
        
        // Активация кнопки импорта
        $('#importBtn').prop('disabled', false);
    };
    
    reader.readAsArrayBuffer(file);
});

// Отображение данных в таблице предпросмотра
function renderPreviewTable(data) {
    const tbody = $('#previewTable tbody');
    tbody.empty();
    
    // Получение индексов столбцов
    const headers = data[0].map(h => String(h).toLowerCase());
    const nameIndex = headers.indexOf('name');
    const categoryIndex = headers.indexOf('category');
    const categoryIdIndex = headers.indexOf('category_id');
    const priceIndex = headers.indexOf('price');
    const quantityIndex = headers.indexOf('quantity');
    const descriptionIndex = headers.indexOf('description');
    
    // Отображение первых 10 строк (или меньше, если данных меньше)
    const rowsToShow = Math.min(10, data.length - 1);
    
    for (let i = 1; i <= rowsToShow; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        
        const name = row[nameIndex] || '';
        const category = row[categoryIndex] || '';
        const categoryId = categoryIdIndex !== -1 ? row[categoryIdIndex] || '' : '';
        const price = row[priceIndex] || 0;
        const quantity = row[quantityIndex] || 0;
        const description = row[descriptionIndex] || '';
        
        // Формируем отображение категории (название и ID, если есть)
        const categoryDisplay = categoryId ? `${category} (ID: ${categoryId})` : category;
        
        const tr = `
            <tr>
                <td>${name}</td>
                <td>${description.length > 50 ? description.substring(0, 50) + '...' : description}</td>
                <td>${price}</td>
                <td>${categoryDisplay}</td>
                <td>${quantity}</td>
            </tr>
        `;
        
        tbody.append(tr);
    }
    
    // Если данных больше, чем показано
    if (data.length - 1 > rowsToShow) {
        tbody.append(`
            <tr>
                <td colspan="5" class="preview-more">
                    ... и еще ${data.length - 1 - rowsToShow} товаров
                </td>
            </tr>
        `);
    }
}

// Импорт товаров
$('#importBtn').click(function() {
    const file = $('#excelFile')[0].files[0];
    if (!file) {
        showNotification('Пожалуйста, выберите файл', 'error');
        return;
    }
    
    // Отображение индикатора загрузки
    $('#importResult').html('<div class="loading-spinner"></div><p>Импорт товаров...</p>');
    
    // Получаем данные из оригинального Excel-файла
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Получение первого листа
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Преобразование в JSON
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            if (jsonData.length < 2) {
                showNotification('Файл не содержит данных', 'error');
                $('#importResult').html('');
                return;
            }
            
            // Получаем заголовки и преобразуем их в ожидаемый формат
            const originalHeaders = jsonData[0].map(h => String(h).toLowerCase());
            
            // Маппинг заголовков в таблице предпросмотра на ожидаемые заголовки API
            const headerMapping = {
                'название': 'name',
                'описание': 'description',
                'цена': 'price',
                'категория': 'category',
                'категория id': 'category_id',
                'id категории': 'category_id',
                'category id': 'category_id',
                'количество': 'quantity',
                'характеристики': 'specifications'
            };
            
            // Преобразуем заголовки
            const apiHeaders = [];
            const headerIndexMap = {};
            
            originalHeaders.forEach((header, index) => {
                const apiHeader = headerMapping[header] || header;
                apiHeaders.push(apiHeader);
                headerIndexMap[apiHeader] = index;
            });
            
            // Преобразуем данные
            const apiRows = [];
            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (row.length > 0) {
                    apiRows.push(row);
                }
            }
            
            // Отправляем данные на сервер в формате JSON
            $.ajax({
                url: 'api/import_products.php',
                type: 'POST',
                data: JSON.stringify({ headers: apiHeaders, rows: apiRows }),
                contentType: 'application/json',
                success: function(response) {
                    if (response.status === 'success') {
                        let resultHtml = `
                            <div class="import-success">
                                <i class="fas fa-check-circle"></i>
                                <p>Импорт успешно завершен</p>
                                <p>Импортировано товаров: ${response.imported_count}</p>
                            </div>
                        `;
                
                        // Если есть ошибки, отображаем их
                        if (response.errors && response.errors.length > 0) {
                            resultHtml += `
                                <div class="import-warnings">
                                    <p>Предупреждения (${response.errors.length}):</p>
                                    <ul>
                                        ${response.errors.map(error => `<li>${error}</li>`).join('')}
                                    </ul>
                                </div>
                            `;
                        }
                        
                        $('#importResult').html(resultHtml);
                        
                        // Обновляем список товаров
                        loadProducts();
                        
                        // Сбрасываем форму
                        $('#excelFile').val('');
                        $('#previewTable tbody').empty();
                        $('#importBtn').prop('disabled', true);
                        
                        showNotification('Товары успешно импортированы', 'success');
                    } else {
                        $('#importResult').html(`
                            <div class="import-error">
                                <i class="fas fa-exclamation-circle"></i>
                                <p>Ошибка импорта: ${response.message}</p>
                            </div>
                        `);
                        
                        showNotification('Ошибка импорта: ' + response.message, 'error');
                    }
                },
                error: function() {
                    $('#importResult').html(`
                        <div class="import-error">
                            <i class="fas fa-exclamation-circle"></i>
                            <p>Произошла ошибка при импорте товаров</p>
                        </div>
                    `);
                    
                    showNotification('Произошла ошибка при импорте товаров', 'error');
                }
            });
        } catch (error) {
            $('#importResult').html(`
                <div class="import-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Ошибка обработки файла: ${error.message}</p>
                </div>
            `);
            
            showNotification('Ошибка обработки файла: ' + error.message, 'error');
        }
    };
    
    reader.onerror = function() {
        $('#importResult').html(`
            <div class="import-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Ошибка чтения файла</p>
            </div>
        `);
        
        showNotification('Ошибка чтения файла', 'error');
    };
    
    reader.readAsArrayBuffer(file);
});

// Экспорт товаров
$('#exportBtn').click(function() {
    exportProducts();
});

function exportProducts() {
    // Отображение индикатора загрузки
    $('#exportResult').html('<div class="loading-spinner"></div><p>Экспорт товаров...</p>');
    
    $.ajax({
        url: 'api/export_products.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const products = response.products;
                
                // Создание рабочей книги Excel
                const wb = XLSX.utils.book_new();
                
                // Заголовки
                const headers = ['ID', 'Name', 'Category', 'Category ID', 'Description', 'Specifications', 'Price', 'Quantity', 'Image URL'];
                
                // Данные для экспорта
                const data = [headers];
                
                products.forEach(function(product) {
                    data.push([
                        product.id,
                        product.name,
                        product.category_name,
                        product.category_id,
                        product.description,
                        product.specifications || '',
                        product.price,
                        product.quantity,
                        product.image_url
                    ]);
                });
                
                // Создание листа
                const ws = XLSX.utils.aoa_to_sheet(data);
                
                // Добавление листа в книгу
                XLSX.utils.book_append_sheet(wb, ws, 'Products');
                
                // Генерация имени файла с датой
                const date = new Date();
                const dateStr = date.toISOString().split('T')[0];
                const fileName = `products_export_${dateStr}.xlsx`;
                
                // Сохранение файла
                XLSX.writeFile(wb, fileName);
                
                $('#exportResult').html(`
                    <div class="export-success">
                        <i class="fas fa-check-circle"></i>
                        <p>Экспорт успешно завершен</p>
                        <p>Экспортировано товаров: ${products.length}</p>
                    </div>
                `);
                
                showNotification('Товары успешно экспортированы', 'success');
            } else {
                $('#exportResult').html(`
                    <div class="export-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Ошибка экспорта: ${response.message}</p>
                    </div>
                `);
                
                showNotification('Ошибка экспорта: ' + response.message, 'error');
            }
        },
        error: function() {
            $('#exportResult').html(`
                <div class="export-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Произошла ошибка при экспорте товаров</p>
                </div>
            `);
            
            showNotification('Произошла ошибка при экспорте товаров', 'error');
        }
    });
}
