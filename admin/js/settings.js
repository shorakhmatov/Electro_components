/**
 * Функции для работы с настройками магазина
 */

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обработчики вкладок
    initTabs();
    
    // Обработчики цветовых полей
    initColorPickers();
    
    // Обработчик формы настроек
    initSettingsForm();
    
    // Загрузка настроек с сервера
    loadSettings();
});

/**
 * Инициализация вкладок
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Скрываем все вкладки
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Показываем выбранную вкладку
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Инициализация цветовых полей
 */
function initColorPickers() {
    // Обновление значения цвета при изменении
    const colorInputs = document.querySelectorAll('input[type="color"]');
    
    colorInputs.forEach(input => {
        // Находим элемент для отображения значения
        const valueElement = input.nextElementSibling;
        
        // Обработчик изменения цвета
        input.addEventListener('input', function() {
            // Обновляем отображаемое значение
            valueElement.textContent = this.value;
            
            // Обновляем предпросмотр
            updateColorPreview();
        });
    });
}

/**
 * Обновление предпросмотра цветов
 */
function updateColorPreview() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    const backgroundColor = document.getElementById('backgroundColor').value;
    
    // Обновляем цвета в предпросмотре
    document.querySelector('.preview-header').style.backgroundColor = primaryColor;
    document.querySelector('.preview-content').style.backgroundColor = backgroundColor;
    document.querySelector('.card-header').style.backgroundColor = secondaryColor;
    document.querySelector('.card-footer').style.backgroundColor = primaryColor;
}

/**
 * Инициализация формы настроек
 */
function initSettingsForm() {
    const form = document.getElementById('settingsForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });
}

/**
 * Загрузка настроек с сервера
 */
function loadSettings() {
    fetch('api/get_settings.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                updateSettingsForm(data.settings);
            } else {
                showMessage('Ошибка при загрузке настроек: ' + data.message, 'error');
            }
        })
        .catch(error => {
            showMessage('Ошибка при загрузке настроек: ' + error, 'error');
        });
}

/**
 * Обновление формы настроек данными с сервера
 */
function updateSettingsForm(settings) {
    // Заполняем основные поля
    document.getElementById('storeName').value = settings.store_name || '';
    
    // Заполняем цветовые поля
    document.getElementById('primaryColor').value = settings.primary_color || '#2196F3';
    document.getElementById('secondaryColor').value = settings.secondary_color || '#FFC107';
    document.getElementById('backgroundColor').value = settings.background_color || '#f5f5f5';
    
    // Обновляем отображаемые значения цветов
    document.querySelectorAll('.color-value').forEach(el => {
        const inputId = el.previousElementSibling.id;
        el.textContent = document.getElementById(inputId).value;
    });
    
    // Обновляем предпросмотр
    updateColorPreview();
    
    // Заполняем контактные данные
    if (settings.contact_email) document.getElementById('contactEmail').value = settings.contact_email;
    if (settings.contact_phone) document.getElementById('contactPhone').value = settings.contact_phone;
    if (settings.contact_address) document.getElementById('contactAddress').value = settings.contact_address;
    
    // Заполняем настройки доставки
    if (settings.delivery_cost !== undefined) document.getElementById('deliveryCost').value = settings.delivery_cost;
    if (settings.free_delivery_threshold !== undefined) document.getElementById('freeDeliveryThreshold').value = settings.free_delivery_threshold;
    
    // Заполняем SEO настройки
    if (settings.meta_description) document.getElementById('metaDescription').value = settings.meta_description;
    if (settings.meta_keywords) document.getElementById('metaKeywords').value = settings.meta_keywords;
    
    // Обновляем логотип
    if (settings.logo_url) {
        const logoImg = document.createElement('img');
        logoImg.src = '../' + settings.logo_url;
        logoImg.alt = 'Current logo';
        
        const currentLogo = document.getElementById('currentLogo');
        currentLogo.innerHTML = '';
        currentLogo.appendChild(logoImg);
    }
}

/**
 * Сохранение настроек на сервер
 */
function saveSettings() {
    const form = document.getElementById('settingsForm');
    const formData = new FormData(form);
    
    // Показываем индикатор загрузки
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Сохранение...';
    submitBtn.disabled = true;
    
    fetch('api/update_settings.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (data.status === 'success') {
            showMessage('Настройки успешно сохранены', 'success');
            
            // Перезагружаем настройки
            loadSettings();
        } else {
            showMessage('Ошибка при сохранении настроек: ' + data.message, 'error');
        }
    })
    .catch(error => {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        showMessage('Ошибка при сохранении настроек: ' + error, 'error');
    });
}

/**
 * Отображение сообщения пользователю
 */
function showMessage(message, type = 'info') {
    const resultElement = document.getElementById('settingsResult');
    
    // Устанавливаем класс в зависимости от типа сообщения
    resultElement.className = 'alert alert-' + type;
    resultElement.textContent = message;
    
    // Прокручиваем к сообщению
    resultElement.scrollIntoView({ behavior: 'smooth' });
    
    // Скрываем сообщение через 5 секунд
    setTimeout(() => {
        resultElement.textContent = '';
        resultElement.className = '';
    }, 5000);
}
