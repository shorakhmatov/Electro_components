// JavaScript для улучшенной страницы профиля

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация только навигации
    setupProfileNavigation();
    // Не инициализируем обработчики форм, так как они теперь в confirm-modals.js
});

// Настройка навигации по профилю
function setupProfileNavigation() {
    const sidebarItems = document.querySelectorAll('.profile-sidebar-item');
    const sections = document.querySelectorAll('.profile-section');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Получаем ID секции из href ссылки
            const targetId = this.getAttribute('href').substring(1);
            
            // Удаляем активный класс у всех элементов меню
            sidebarItems.forEach(item => item.classList.remove('active'));
            
            // Добавляем активный класс текущему элементу меню
            this.classList.add('active');
            
            // Скрываем все секции
            sections.forEach(section => section.classList.remove('active'));
            
            // Показываем нужную секцию
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Функция для отображения уведомлений (используется в confirm-modals.js)
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getIconForType(type)}"></i>
            <div class="toast-message">${message}</div>
        </div>
        <i class="fas fa-times toast-close"></i>
    `;
    
    document.body.appendChild(toast);
    
    // Показываем уведомление
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Скрываем уведомление через 5 секунд
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
    
    // Обработчик для кнопки закрытия
    const closeButton = toast.querySelector('.toast-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        });
    }
}

// Получить иконку для типа уведомления
function getIconForType(type) {
    switch(type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-exclamation-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        default:
            return 'fa-info-circle';
    }
}

// Делаем функцию showNotification глобальной
window.showNotification = showNotification;
function showNotification(message, type = 'success') {
    // Проверяем, существует ли контейнер для уведомлений
    let container = document.querySelector('.toast-container');
    
    // Если контейнера нет, создаем его
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Создаем элемент уведомления
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Добавляем уведомление в контейнер
    container.appendChild(toast);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
