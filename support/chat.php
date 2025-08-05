// chat.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Чат с поддержкой';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="../assets/css/pages/support.css">
<link rel="stylesheet" href="../assets/css/pages/chat.css">';

// Additional JS
$additionalJs = '<script src="../assets/js/support.js"></script>
<script src="../assets/js/chatbot-responses.js"></script>
<script src="../assets/js/support-chat.js"></script>';

// Include support header
include 'support_header.php';
?>

<main>
    <div class="container">
        <div class="support-container">
            <div class="support-header">
                <h1><i class="fas fa-comments"></i> Чат с поддержкой</h1>
                <p>Получите мгновенную помощь от наших специалистов</p>
            </div>

            <div class="chat-container">
                <div class="chat-sidebar">
                    <div class="operator-info">
                        <div class="operator-avatar">
                            <img src="../assets/img/support/operator.jpg" alt="Оператор">
                            <span class="status-indicator online"></span>
                        </div>
                        <div class="operator-details">
                            <h3>Оператор на связи</h3>
                            <p class="operator-status">Онлайн</p>
                            <p class="operator-response-time"><span>2 мин</span> среднее время ответа</p>
                        </div>
                    </div>
                    <div class="chat-topics">
                        <h3>Популярные темы</h3>
                        <div class="topic-list">
                            <button class="topic-item" data-topic="order">Вопросы по заказу</button>
                            <button class="topic-item" data-topic="delivery">Доставка</button>
                            <button class="topic-item" data-topic="payment">Оплата</button>
                            <button class="topic-item" data-topic="return">Возврат товара</button>
                            <button class="topic-item" data-topic="technical">Техническая консультация</button>
                        </div>
                    </div>
                    <div class="chat-info">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <p>Время работы чата: <br>Пн-Пт с 9:00 до 20:00<br>Сб-Вс с 10:00 до 18:00</p>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-phone-alt"></i>
                            <p>Телефон поддержки: <br>+7 (385) 223-45-67</p>
                        </div>
                    </div>
                </div>
                <div class="chat-main">
                    <div class="chat-header">
                        <h2>Чат с технической поддержкой</h2>
                        <div class="chat-actions">
                            <button class="btn-chat-action" id="btnClearChat" title="Очистить чат">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            <button class="btn-chat-action" id="btnSaveChat" title="Сохранить историю чата">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                        <div class="message-date-separator">
                            <span>Сегодня</span>
                        </div>
                        <div class="message system-message">
                            <div class="message-content">
                                <p>Добро пожаловать в чат поддержки ElectroStore! Чем мы можем вам помочь?</p>
                            </div>
                            <div class="message-time">10:00</div>
                        </div>
                        <div class="message operator-message">
                            <div class="message-avatar">
                                <img src="../assets/img/support/operator.jpg" alt="Оператор">
                            </div>
                            <div class="message-bubble">
                                <div class="message-sender">Оператор Анна</div>
                                <div class="message-content">
                                    <p>Здравствуйте! Я Анна, специалист технической поддержки. Готова ответить на ваши вопросы по товарам, заказам или работе сайта.</p>
                                </div>
                                <div class="message-time">10:01</div>
                            </div>
                        </div>
                        <!-- Сообщения пользователя и оператора будут добавляться здесь -->
                    </div>
                    <div class="chat-input">
                        <div class="input-attachments">
                            <button class="btn-attachment" title="Прикрепить файл">
                                <i class="fas fa-paperclip"></i>
                            </button>
                            <input type="file" id="chatAttachment" class="attachment-input" accept="image/jpeg,image/png,application/pdf">
                        </div>
                        <textarea id="messageInput" placeholder="Введите ваше сообщение..." rows="1"></textarea>
                        <button id="sendMessage" class="btn-send-message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="chat-faq">
                <h2>Часто задаваемые вопросы</h2>
                <div class="faq-items">
                    <div class="faq-item">
                        <h3>Как долго обрабатывается заказ?</h3>
                        <p>Обработка заказа занимает от 1 до 3 рабочих дней в зависимости от наличия товаров на складе.</p>
                    </div>
                    <div class="faq-item">
                        <h3>Какие способы доставки доступны?</h3>
                        <p>Мы предлагаем доставку Почтой России, СДЭК, DPD, а также курьерскую доставку в крупных городах.</p>
                    </div>
                    <div class="faq-item">
                        <h3>Как отследить статус заказа?</h3>
                        <p>Вы можете отследить статус заказа в личном кабинете или по номеру заказа в разделе "Отследить заказ".</p>
                    </div>
                    <div class="faq-item">
                        <h3>Как оформить возврат товара?</h3>
                        <p>Для оформления возврата свяжитесь с нами по телефону или через форму обратной связи в течение 14 дней с момента получения товара.</p>
                    </div>
                </div>
                <a href="faq.php" class="btn-view-all-faq">Посмотреть все вопросы</a>
            </div>
        </div>
    </div>
</main>

<?php
// Include support footer
include 'support_footer.php';
?>
