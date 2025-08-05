/**
 * Скрипт для работы аккордеона в футере
 */
document.addEventListener('DOMContentLoaded', function() {
    // Находим все заголовки аккордеона
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Добавляем обработчик клика для каждого заголовка
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Получаем ID целевого контента
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            
            // Если текущий элемент уже активен, просто закрываем его
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                targetContent.classList.remove('active');
                return;
            }
            
            // Закрываем все активные элементы
            const activeHeaders = document.querySelectorAll('.accordion-header.active');
            const activeContents = document.querySelectorAll('.accordion-content.active');
            
            activeHeaders.forEach(activeHeader => {
                activeHeader.classList.remove('active');
            });
            
            activeContents.forEach(activeContent => {
                activeContent.classList.remove('active');
            });
            
            // Открываем выбранный элемент
            this.classList.add('active');
            targetContent.classList.add('active');
        });
    });
});
