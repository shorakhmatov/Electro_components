// feedback.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Обратная связь';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="../assets/css/pages/support.css">
<link rel="stylesheet" href="../assets/css/pages/feedback-modal.css">';

// Additional JS
$additionalJs = '<script src="../assets/js/support.js"></script>';

// Include support header
include 'support_header.php';
?>

<main>
    <div class="container">
        <div class="support-container">
            <div class="support-header">
                <h1><i class="fas fa-comment-alt"></i> Обратная связь</h1>
                <p>Мы ценим ваше мнение и всегда рады получить отзывы о нашей работе</p>
            </div>

            <div class="feedback-container">
                <div class="feedback-form-container">
                    <div class="feedback-form-header">
                        <h2><i class="fas fa-paper-plane"></i> Оставить отзыв</h2>
                    </div>
                    <form id="feedbackForm" class="feedback-form">
                        <div class="form-group">
                            <label for="feedbackName"><i class="fas fa-user"></i> Ваше имя</label>
                            <input type="text" id="feedbackName" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="feedbackEmail"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" id="feedbackEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="feedbackType"><i class="fas fa-list-alt"></i> Тип обращения</label>
                            <select id="feedbackType" name="type" required>
                                <option value="">Выберите тип обращения</option>
                                <option value="review">Отзыв о магазине</option>
                                <option value="product">Отзыв о товаре</option>
                                <option value="suggestion">Предложение по улучшению</option>
                                <option value="complaint">Жалоба</option>
                                <option value="other">Другое</option>
                            </select>
                        </div>
                        <div class="form-group" id="productSelectGroup" style="display: none;">
                            <label for="feedbackProduct"><i class="fas fa-box"></i> Выберите товар</label>
                            <select id="feedbackProduct" name="product">
                                <option value="">Выберите товар</option>
                                <option value="1">Arduino Uno</option>
                                <option value="2">Raspberry Pi 4</option>
                                <option value="3">ESP32 DevKit</option>
                                <option value="4">DHT22 датчик температуры и влажности</option>
                                <option value="5">OLED дисплей 0.96"</option>
                                <!-- Другие товары будут загружаться динамически -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="feedbackRating"><i class="fas fa-star"></i> Оценка (от 1 до 5)</label>
                            <div class="rating-stars">
                                <i class="far fa-star" data-rating="1"></i>
                                <i class="far fa-star" data-rating="2"></i>
                                <i class="far fa-star" data-rating="3"></i>
                                <i class="far fa-star" data-rating="4"></i>
                                <i class="far fa-star" data-rating="5"></i>
                                <input type="hidden" id="feedbackRating" name="rating" value="">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="feedbackMessage"><i class="fas fa-comment"></i> Сообщение</label>
                            <textarea id="feedbackMessage" name="message" rows="5" required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-container">
                                <input type="checkbox" id="feedbackConsent" name="consent" required>
                                <span class="checkmark"></span>
                                Я согласен на обработку персональных данных
                            </label>
                        </div>
                        <button type="submit" class="btn-submit"><i class="fas fa-paper-plane"></i> Отправить отзыв</button>
                    </form>
                </div>

                <div class="feedback-info">
                    <div class="info-card">
                        <div class="info-header">
                            <div class="info-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <h3 class="info-title">Как мы обрабатываем обращения</h3>
                        </div>
                        <div class="info-content">
                            <p>После отправки формы ваше обращение будет рассмотрено нашими специалистами в течение 24 часов. Мы свяжемся с вами по указанному email, если потребуется дополнительная информация.</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="info-content">
                            <h3>Конфиденциальность</h3>
                            <p>Мы гарантируем конфиденциальность ваших персональных данных и используем их только для обработки вашего обращения в соответствии с нашей политикой конфиденциальности.</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-header">
                            <div class="info-icon">
                                <i class="fas fa-thumbs-up"></i>
                            </div>
                            <h3 class="info-title">Ваше мнение важно для нас</h3>
                        </div>
                        <div class="info-content">
                            <p>Благодаря вашим отзывам мы постоянно улучшаем качество обслуживания и ассортимент товаров. Спасибо, что помогаете нам становиться лучше!</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="recent-reviews">
                <h2>Последние отзывы</h2>
                <div class="reviews-list" id="recentFeedbackList">
                    <!-- Здесь будут отображаться последние отзывы, загруженные через AJAX -->
                    <div class="loading-indicator">
                        <i class="fas fa-spinner fa-spin"></i> Загрузка отзывов...
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php
// Include support footer
include 'support_footer.php';
?>
