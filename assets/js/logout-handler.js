// Обработчик для кнопки выхода из аккаунта
document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку выхода
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        // Добавляем обработчик события клика
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Очищаем localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            
            // Перенаправляем на страницу выхода для очистки сессии PHP
            window.location.href = 'logout.php';
        });
    }
});
