/**
 * Скрипт для автоматического открытия модального окна авторизации
 * при переходе с параметром auth=1 в URL
 */
document.addEventListener('DOMContentLoaded', function() {
    // Получаем параметры URL
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    const redirectParam = urlParams.get('redirect');
    
    // Если есть параметр auth=1, открываем модальное окно авторизации
    if (authParam === '1') {
        // Находим модальное окно
        const authModal = document.getElementById('authModal');
        if (authModal) {
            // Показываем модальное окно
            authModal.style.display = 'block';
            
            // Добавляем сообщение о необходимости авторизации
            const loginError = document.getElementById('loginError');
            if (loginError) {
                loginError.textContent = 'Для доступа к этой странице необходимо авторизоваться';
                loginError.style.display = 'block';
            }
            
            // Сохраняем URL для перенаправления после авторизации
            if (redirectParam) {
                localStorage.setItem('authRedirect', redirectParam);
            }
        }
    }
    
    // Проверяем, есть ли сохраненный URL для перенаправления
    const storedRedirect = localStorage.getItem('authRedirect');
    if (storedRedirect && window.isUserLoggedIn) {
        // Удаляем сохраненный URL
        localStorage.removeItem('authRedirect');
        // Перенаправляем пользователя
        window.location.href = storedRedirect;
    }
});

// Переопределяем функцию входа, чтобы добавить перенаправление
const originalLogin = window.login;
if (typeof originalLogin === 'function') {
    window.login = async function(email, password) {
        const result = await originalLogin(email, password);
        
        // Если вход успешен и есть сохраненный URL для перенаправления
        if (result && result.success) {
            const storedRedirect = localStorage.getItem('authRedirect');
            if (storedRedirect) {
                // Удаляем сохраненный URL
                localStorage.removeItem('authRedirect');
                // Перенаправляем пользователя
                window.location.href = storedRedirect;
                return result;
            }
        }
        
        return result;
    };
}
