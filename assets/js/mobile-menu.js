/**
 * JavaScript для управления мобильным меню с современными анимациями
 */
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const headerNav = document.getElementById('headerNav');
    const headerSearch = document.getElementById('headerSearch');
    const navItems = document.querySelectorAll('.header__nav li');
    const body = document.body;
    
    // Добавляем индексы для анимации элементов меню
    navItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index + 1);
    });
    
    // Функция для открытия мобильного меню с анимацией
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        
        // Анимация для навигации
        if (headerNav) {
            headerNav.classList.add('active');
            
            // Добавляем небольшую задержку для анимации элементов
            setTimeout(() => {
                navItems.forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            }, 200);
        }
        
        // Анимация для поиска
        if (headerSearch) {
            headerSearch.classList.add('active');
        }
        
        // Блокируем прокрутку страницы с плавной анимацией
        body.style.overflow = 'hidden';
        
        // Добавляем класс для анимации фона
        body.classList.add('menu-open');
    }
    
    // Функция для закрытия мобильного меню с анимацией
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        
        // Сначала анимируем элементы меню
        navItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        });
        
        // Затем с небольшой задержкой закрываем меню
        setTimeout(() => {
            if (headerNav) {
                headerNav.classList.remove('active');
            }
            
            if (headerSearch) {
                headerSearch.classList.remove('active');
            }
            
            // Разблокируем прокрутку страницы
            body.style.overflow = '';
            
            // Удаляем класс для анимации фона
            body.classList.remove('menu-open');
        }, 300);
    }
    
    // Обработчик клика по бургер-меню
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    
    // Закрытие мобильного меню при клике по ссылке с анимацией
    const navLinks = document.querySelectorAll('.header__nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Проверяем, открыто ли мобильное меню
            if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                // Добавляем анимацию при клике на ссылку
                this.classList.add('clicked');
                
                // Закрываем мобильное меню с небольшой задержкой
                setTimeout(() => {
                    closeMobileMenu();
                    this.classList.remove('clicked');
                }, 300);
            }
        });
    });
    
    // Закрытие мобильного меню при клике вне меню
    document.addEventListener('click', function(event) {
        if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
            // Проверяем, был ли клик вне меню и не по кнопке меню
            const isClickInsideMenu = headerNav.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle) {
                closeMobileMenu();
            }
        }
    });
    
    // Закрытие мобильного меню при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 767) {
                // Если ширина экрана больше 767px, закрываем мобильное меню
                if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        }, 250);
    });
    
    // Добавляем эффект при прокрутке страницы для шапки
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            // Прокрутка вниз - скрываем шапку
            header.classList.add('header-hidden');
        } else {
            // Прокрутка вверх - показываем шапку
            header.classList.remove('header-hidden');
        }
        
        // Добавляем тень при прокрутке
        if (scrollTop > 10) {
            header.classList.add('header-shadow');
        } else {
            header.classList.remove('header-shadow');
        }
        
        lastScrollTop = scrollTop;
    });
});
