/**
 * JavaScript для управления фиксированной шапкой сайта
 */
document.addEventListener('DOMContentLoaded', function() {
    // Получаем элемент шапки
    const header = document.querySelector('.header');
    
    // Добавляем класс для предотвращения скрытия шапки при прокрутке
    if (header) {
        header.classList.add('scrolled');
    }
    
    // Обработчик события прокрутки страницы
    window.addEventListener('scroll', function() {
        if (header) {
            // Если прокрутка больше 10px, добавляем класс scrolled
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            }
        }
    });
    
    // Обработчик для мобильного меню
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const headerNav = document.getElementById('headerNav');
    
    if (mobileMenuToggle && headerNav) {
        mobileMenuToggle.addEventListener('click', function() {
            // Переключаем класс для мобильного меню
            headerNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Обеспечиваем правильное отображение шапки при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Для десктопной версии
            if (headerNav) {
                headerNav.classList.remove('active');
            }
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});
