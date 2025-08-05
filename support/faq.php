// faq.php<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Часто задаваемые вопросы';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="../assets/css/pages/support.css">';

// Additional JS
$additionalJs = '<script src="../assets/js/support.js"></script>';

// Include support header
include 'support_header.php';
?>

<main>
    <div class="container">
        <div class="support-container">
            <div class="support-header">
                <h1><i class="fas fa-question-circle"></i> Часто задаваемые вопросы</h1>
                <p>Ответы на самые популярные вопросы о нашем магазине и товарах</p>
            </div>

            <div class="faq-container">
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Как оформить заказ?</h3>
                        <span class="faq-toggle"><i class="fas fa-chevron-down"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p>Для оформления заказа выполните следующие шаги:</p>
                        <ol>
                            <li>Выберите нужные товары и добавьте их в корзину</li>
                            <li>Перейдите в корзину, нажав на соответствующую иконку в верхнем меню</li>
                            <li>Проверьте содержимое корзины и нажмите "Оформить заказ"</li>
                            <li>Заполните необходимые данные для доставки и оплаты</li>
                            <li>Нажмите "Подтвердить заказ"</li>
                        </ol>
                        <p>После оформления заказа вы получите подтверждение на указанный email.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Какие способы оплаты доступны?</h3>
                        <span class="faq-toggle"><i class="fas fa-chevron-down"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p>В нашем магазине доступны следующие способы оплаты:</p>
                        <ul>
                            <li>Банковской картой онлайн (Visa, MasterCard, МИР)</li>
                            <li>Электронными деньгами (ЮMoney, WebMoney, QIWI)</li>
                            <li>Наличными при получении (для курьерской доставки)</li>
                            <li>Банковским переводом (для юридических лиц)</li>
                            <li>Оплата через систему быстрых платежей (СБП)</li>
                        </ul>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Как долго осуществляется доставка?</h3>
                        <span class="faq-toggle"><i class="fas fa-chevron-down"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p>Сроки доставки зависят от выбранного способа доставки и вашего региона:</p>
                        <ul>
                            <li>Курьерская доставка по г. Барнаул: 1-2 рабочих дня</li>
                            <li>Доставка Почтой России: 5-14 рабочих дней</li>
                            <li>Доставка транспортными компаниями (СДЭК, DPD, BoxBerry): 3-7 рабочих дней</li>
                            <li>Экспресс-доставка: 1-3 рабочих дня</li>
                        </ul>
                        <p>Точные сроки доставки указываются при оформлении заказа.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Как вернуть товар?</h3>
                        <span class="faq-toggle"><i class="fas fa-chevron-down"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p>Вы можете вернуть товар в течение 14 дней с момента получения, если:</p>
                        <ul>
                            <li>Товар не был в употреблении</li>
                            <li>Сохранены товарный вид, потребительские свойства, пломбы, фабричные ярлыки</li>
                            <li>Имеется товарный или кассовый чек (или иное подтверждение покупки)</li>
                        </ul>
                        <p>Для возврата товара необходимо:</p>
                        <ol>
                            <li>Связаться с нашей службой поддержки по телефону или email</li>
                            <li>Заполнить заявление на возврат</li>
                            <li>Отправить товар обратно в магазин указанным способом</li>
                        </ol>
                        <p>Деньги будут возвращены тем же способом, которым была произведена оплата, в течение 10 рабочих дней.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Предоставляется ли гарантия на товары?</h3>
                        <span class="faq-toggle"><i class="fas fa-chevron-down"></i></span>
                    </div>
                    <div class="faq-answer">
                        <p>Да, на все товары предоставляется гарантия:</p>
                        <ul>
                            <li>Гарантия производителя: от 6 месяцев до 3 лет (зависит от категории товара)</li>
                            <li>Дополнительная гарантия магазина: 30 дней на все товары</li>
                        </ul>
                        <p>Гарантия не распространяется на случаи:</p>
                        <ul>
                            <li>Механических повреждений по вине пользователя</li>
                            <li>Нарушения условий эксплуатации</li>
                            <li>Неправильного подключения или использования</li>
                            <li>Следов самостоятельного ремонта или модификации</li>
                        </ul>
                        <p>Для получения гарантийного обслуживания обратитесь в наш сервисный центр.</p>
                    </div>
                </div>
            </div>

            <div class="support-contact">
                <h2>Не нашли ответ на свой вопрос?</h2>
                <p>Свяжитесь с нашей службой поддержки одним из удобных способов:</p>
                <div class="contact-options">
                    <a href="feedback.php" class="contact-option">
                        <i class="fas fa-envelope"></i>
                        <span>Написать в поддержку</span>
                    </a>
                    <a href="tel:+73852234567" class="contact-option">
                        <i class="fas fa-phone"></i>
                        <span>Позвонить: +7 (385) 223-45-67</span>
                    </a>
                    <a href="chat.php" class="contact-option">
                        <i class="fas fa-comments"></i>
                        <span>Онлайн-чат с оператором</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</main>

<?php
// Include support footer
include 'support_footer.php';
?>
