// Обработчик для кнопки "Баланс"
document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку "Баланс"
    const balanceBtn = document.getElementById('balanceBtn');
    
    if (balanceBtn) {
        // Добавляем обработчик события клика
        balanceBtn.addEventListener('click', function(e) {
            // Проверяем, авторизован ли пользователь, используя более надежный метод
            // 1. Проверяем наличие элемента с id="logoutBtn"
            // 2. Проверяем наличие класса is-logged-in у body (добавляется при авторизации)
            // 3. Проверяем наличие пользовательских данных в localStorage
            const logoutBtn = document.getElementById('logoutBtn');
            const bodyHasLoggedInClass = document.body.classList.contains('is-logged-in');
            const hasUserDataInStorage = localStorage.getItem('user_id') !== null;
            
            // Пользователь считается авторизованным, если хотя бы один из признаков присутствует
            const isLoggedIn = !!logoutBtn || bodyHasLoggedInClass || hasUserDataInStorage;
            
            // Если пользователь не авторизован, перенаправляем на страницу профиля
            if (!isLoggedIn) {
                e.preventDefault(); // Отменяем стандартное действие ссылки
                
                // Перенаправляем на страницу профиля
                window.location.href = 'profile.php';
                
                // Показываем уведомление
                showNotification('Пожалуйста, войдите в аккаунт для доступа к балансу', 'info');
            }
        });
    }
    
    // Функция для отображения уведомлений
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
        
        // Показываем уведомление
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
});
