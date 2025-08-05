/**
 * Скрипт для страниц технической поддержки
 */
document.addEventListener('DOMContentLoaded', function() {
    // FAQ аккордеон
    initFaqAccordion();
    
    // Фильтрация руководств по категориям
    initManualsCategoryFilter();
    
    // Рейтинг звездами в форме обратной связи
    initRatingStars();
    
    // Переключение типа обратной связи
    initFeedbackTypeToggle();
    
    // Обработка загрузки файлов
    initFileUpload();
    
    // Аккордеон для частых проблем
    initIssuesAccordion();
    
    // Инициализация форм
    initForms();
});

/**
 * Инициализация аккордеона для FAQ
 */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (!faqQuestions.length) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const faqAnswer = this.nextElementSibling;
            
            // Если элемент уже активен, просто закрываем его
            if (faqItem.classList.contains('active')) {
                faqItem.classList.remove('active');
                faqAnswer.style.maxHeight = '0';
                return;
            }
            
            // Закрываем все активные элементы
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                activeItem.classList.remove('active');
                activeItem.querySelector('.faq-answer').style.maxHeight = '0';
            });
            
            // Открываем выбранный элемент
            faqItem.classList.add('active');
            faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
        });
    });
}

/**
 * Инициализация фильтрации руководств по категориям
 */
function initManualsCategoryFilter() {
    const categorySelectors = document.querySelectorAll('.category-selector');
    const manualItems = document.querySelectorAll('.manual-item');
    
    if (!categorySelectors.length || !manualItems.length) return;
    
    categorySelectors.forEach(selector => {
        selector.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Обновляем активный селектор
            document.querySelectorAll('.category-selector.active').forEach(activeSelector => {
                activeSelector.classList.remove('active');
            });
            this.classList.add('active');
            
            // Фильтруем руководства
            manualItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Инициализация рейтинга звездами
 */
function initRatingStars() {
    const ratingStars = document.querySelectorAll('.rating-stars i');
    const ratingInput = document.getElementById('feedbackRating');
    
    if (!ratingStars.length || !ratingInput) return;
    
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.dataset.rating);
            
            // Подсвечиваем звезды при наведении
            ratingStars.forEach(s => {
                const starRating = parseInt(s.dataset.rating);
                if (starRating <= rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            const currentRating = parseInt(ratingInput.value) || 0;
            
            // Восстанавливаем текущий рейтинг при уходе курсора
            ratingStars.forEach(s => {
                const starRating = parseInt(s.dataset.rating);
                if (starRating <= currentRating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
        
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;
            
            // Устанавливаем активные звезды
            ratingStars.forEach(s => {
                const starRating = parseInt(s.dataset.rating);
                if (starRating <= rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                    s.classList.add('active');
                } else {
                    s.classList.remove('fas');
                    s.classList.remove('active');
                    s.classList.add('far');
                }
            });
        });
    });
}

/**
 * Инициализация переключения типа обратной связи
 */
function initFeedbackTypeToggle() {
    const feedbackType = document.getElementById('feedbackType');
    const productSelectGroup = document.getElementById('productSelectGroup');
    
    if (!feedbackType || !productSelectGroup) return;
    
    feedbackType.addEventListener('change', function() {
        if (this.value === 'product') {
            productSelectGroup.style.display = 'block';
        } else {
            productSelectGroup.style.display = 'none';
        }
    });
}

/**
 * Инициализация загрузки файлов
 */
function initFileUpload() {
    const fileInput = document.getElementById('reportAttachment');
    const fileName = document.querySelector('.file-name');
    
    if (!fileInput || !fileName) return;
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'Файл не выбран';
        }
    });
}

/**
 * Инициализация аккордеона для частых проблем
 */
function initIssuesAccordion() {
    const issueItems = document.querySelectorAll('.issue-item h3');
    
    if (!issueItems.length) return;
    
    issueItems.forEach(item => {
        item.addEventListener('click', function() {
            const solution = this.nextElementSibling;
            
            if (solution.style.display === 'block') {
                solution.style.display = 'none';
            } else {
                // Закрываем все открытые решения
                document.querySelectorAll('.issue-solution').forEach(sol => {
                    sol.style.display = 'none';
                });
                
                // Открываем выбранное решение
                solution.style.display = 'block';
            }
        });
    });
}
/**
 * Инициализация форм
 */
function initForms() {
    const feedbackForm = document.getElementById('feedbackForm');
    const reportForm = document.getElementById('reportForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения полей
            const name = document.getElementById('feedbackName').value.trim();
            const email = document.getElementById('feedbackEmail').value.trim();
            const type = document.getElementById('feedbackType').value;
            const rating = document.getElementById('feedbackRating').value;
            const message = document.getElementById('feedbackMessage').value.trim();
            const consent = document.getElementById('feedbackConsent').checked;
            
            // Проверяем обязательные поля
            if (!name || !email || !type || !rating || !message || !consent) {
                showNotification('error', 'Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Проверяем валидность email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('error', 'Пожалуйста, укажите корректный email адрес');
                return;
            }
            
            // Проверяем минимальную длину сообщения
            if (message.length < 10) {
                showNotification('error', 'Сообщение должно содержать минимум 10 символов');
                return;
            }
            
            // Проверка согласия на обработку данных уже выполнена выше
            
            // Подготавливаем данные для отправки
            const feedbackData = {
                name: name,
                email: email,
                type: type,
                message: message,
                rating: rating
            };
            
            // Если выбран тип "отзыв о товаре", добавляем ID товара
            if (type === 'product') {
                const productId = document.getElementById('feedbackProduct').value;
                if (!productId) {
                    showNotification('error', 'Пожалуйста, выберите товар');
                    return;
                }
                feedbackData.product_id = productId;
            }
            
            // Показываем индикатор загрузки
            showLoading();
            
            // Отправляем данные на сервер
            fetch('../api/feedback/save_feedback.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            })
            .then(response => response.json())
            .then(result => {
                // Скрываем индикатор загрузки
                hideLoading();
                
                if (result.success) {
                    // Показываем модальное окно с благодарностью
                    showFeedbackSuccessModal();
                    
                    // Сбрасываем форму
                    this.reset();
                    
                    // Сбрасываем рейтинг
                    const ratingStars = document.querySelectorAll('.rating-stars i');
                    const ratingInput = document.getElementById('feedbackRating');
                    
                    if (ratingStars.length && ratingInput) {
                        ratingInput.value = '';
                        ratingStars.forEach(s => {
                            s.classList.remove('fas');
                            s.classList.remove('active');
                            s.classList.add('far');
                        });
                    }
                    
                    // Обновляем список последних отзывов
                    loadRecentFeedback();
                } else {
                    // Показываем сообщение об ошибке
                    showNotification('error', result.message || 'Произошла ошибка при отправке отзыва');
                }
            })
            .catch(error => {
                // Скрываем индикатор загрузки
                hideLoading();
                
                // Показываем сообщение об ошибке
                showNotification('error', 'Произошла ошибка при отправке отзыва');
                console.error('Error:', error);
            });
        });
    }
    
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь будет отправка формы на сервер
            // Для демонстрации просто показываем сообщение об успехе
            showNotification('success', 'Ваше сообщение о проблеме успешно отправлено! Мы рассмотрим его в ближайшее время.');
            this.reset();
            
            // Сбрасываем имя файла
            const fileName = document.querySelector('.file-name');
            if (fileName) {
                fileName.textContent = 'Файл не выбран';
            }
        });
    }
    
    // Загружаем последние отзывы при загрузке страницы
    loadRecentFeedback();
}

/**
 * Загрузка последних отзывов
 */
function loadRecentFeedback() {
    const reviewsList = document.querySelector('.reviews-list');
    if (!reviewsList) return;
    
    // Показываем индикатор загрузки в списке отзывов
    reviewsList.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Загрузка отзывов...</div>';
    
    // Загружаем последние отзывы с сервера
    fetch('../api/feedback/get_recent_feedback.php')
        .then(response => response.json())
        .then(result => {
            if (result.success && result.data && result.data.length > 0) {
                // Очищаем список отзывов
                reviewsList.innerHTML = '';
                
                // Добавляем отзывы в список
                result.data.forEach(feedback => {
                    const reviewItem = document.createElement('div');
                    reviewItem.className = 'review-item';
                    
                    // Создаем HTML для отзыва
                    let reviewHTML = `
                        <div class="review-header">
                            <div class="review-author">${feedback.formatted_name}</div>
                            <div class="review-rating">
                    `;
                    
                    // Добавляем звезды рейтинга
                    for (let i = 1; i <= 5; i++) {
                        if (i <= feedback.rating) {
                            reviewHTML += '<i class="fas fa-star"></i>';
                        } else if (i - 0.5 <= feedback.rating) {
                            reviewHTML += '<i class="fas fa-star-half-alt"></i>';
                        } else {
                            reviewHTML += '<i class="far fa-star"></i>';
                        }
                    }
                    
                    reviewHTML += `
                            </div>
                            <div class="review-date">${feedback.formatted_date}</div>
                        </div>
                        <div class="review-content">
                            <p>${feedback.message}</p>
                        </div>
                    `;
                    
                    // Если это отзыв о товаре, добавляем информацию о товаре
                    if (feedback.type === 'product' && feedback.product_name) {
                        reviewHTML += `
                            <div class="review-product">
                                <span class="product-label">Товар:</span>
                                <span class="product-name">${feedback.product_name}</span>
                            </div>
                        `;
                    }
                    
                    // Добавляем HTML в элемент отзыва
                    reviewItem.innerHTML = reviewHTML;
                    
                    // Добавляем отзыв в список
                    reviewsList.appendChild(reviewItem);
                });
            } else {
                // Если отзывов нет, показываем сообщение
                reviewsList.innerHTML = '<div class="no-reviews">Пока нет отзывов. Будьте первым, кто оставит отзыв!</div>';
            }
        })
        .catch(error => {
            // В случае ошибки показываем сообщение
            reviewsList.innerHTML = '<div class="error-message">Не удалось загрузить отзывы. Пожалуйста, попробуйте позже.</div>';
            console.error('Error loading feedback:', error);
        });
}

/**
 * Показать модальное окно успешной отправки отзыва
 */
function showFeedbackSuccessModal() {
    // Проверяем, существует ли уже модальное окно
    let modal = document.getElementById('feedbackSuccessModal');
    
    // Если модального окна нет, создаем его
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'feedbackSuccessModal';
        modal.className = 'modal';
        
        // Создаем содержимое модального окна
        modal.innerHTML = `
            <div class="modal-content feedback-success-modal">
                <span class="close">&times;</span>
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Спасибо за ваш отзыв!</h2>
                <p>Мы ценим ваше мнение и учтем его в нашей работе.</p>
                <button class="btn-primary">Закрыть</button>
            </div>
        `;
        
        // Добавляем модальное окно в DOM
        document.body.appendChild(modal);
        
        // Добавляем обработчики для закрытия модального окна
        const closeBtn = modal.querySelector('.close');
        const closeButton = modal.querySelector('.btn-primary');
        
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Закрываем модальное окно при клике вне его содержимого
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Показываем модальное окно
    modal.style.display = 'block';
}

/**
 * Показать уведомление
 * @param {string} type - Тип уведомления (success, error, info)
 * @param {string} message - Текст уведомления
 */
function showNotification(type, message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Добавляем иконку в зависимости от типа уведомления
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    // Создаем содержимое уведомления
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Добавляем уведомление в DOM
    const notificationsContainer = document.querySelector('.notifications-container');
    if (!notificationsContainer) {
        // Если контейнера нет, создаем его
        const container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
        container.appendChild(notification);
    } else {
        notificationsContainer.appendChild(notification);
    }
    
    // Добавляем обработчик для закрытия уведомления
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.classList.add('closing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Автоматически скрываем уведомление через 5 секунд
    setTimeout(() => {
        notification.classList.add('closing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Показать индикатор загрузки
 */
function showLoading() {
    // Проверяем, существует ли уже индикатор загрузки
    let loader = document.getElementById('globalLoader');
    
    // Если индикатора нет, создаем его
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.className = 'global-loader';
        loader.innerHTML = '<div class="loader-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
        document.body.appendChild(loader);
    }
    
    // Показываем индикатор
    loader.style.display = 'flex';
}

/**
 * Скрыть индикатор загрузки
 */
function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}
