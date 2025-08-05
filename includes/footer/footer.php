    <!-- Footer Section Begin -->
<footer class="footer-section">
    <div class="footer-main">
        <div class="container">
            <div class="footer-row">
                <div class="footer-col">
                    <h3 class="footer-title">О компании</h3>
                    <p class="footer-description">
                        ElectroStore - ведущий интернет-магазин электронных компонентов и комплектующих. Мы предлагаем широкий ассортимент качественных товаров для профессионалов и любителей электроники.
                    </p>
                    <div class="footer-contact">
                        <p><i class="fas fa-map-marker-alt"></i> г. Барнаул, ул. Ленина, 46</p>
                        <p><i class="fas fa-phone"></i> +7 (385) 223-45-67</p>
                        <p><i class="fas fa-envelope"></i> info@electrostore.ru</p>
                    </div>
                </div>
                <div class="footer-col">
                    <h3 class="footer-title">Техническая поддержка</h3>
                    <ul class="footer-links">
                        <li><a href="/support/faq.php">Часто задаваемые вопросы</a></li>
                        <li><a href="/support/manuals.php">Инструкции и руководства</a></li>
                        <li><a href="/support/feedback.php">Обратная связь</a></li>
                        <li><a href="/support/report.php">Сообщить о проблеме</a></li>
                        <li><a href="/support/chat.php">Чат с поддержкой</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3 class="footer-title">Информация</h3>
                    <div class="footer-accordion">
                        <div class="accordion-item">
                            <div class="accordion-header" data-target="about-us">О нас</div>
                            <div class="accordion-content" id="about-us">
                                <p>ElectroStore - ведущий магазин электронных компонентов с 2015 года. Мы предлагаем широкий ассортимент качественных товаров от ведущих производителей.</p>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <div class="accordion-header" data-target="delivery">Доставка и оплата</div>
                            <div class="accordion-content" id="delivery">
                                <p>Доставка осуществляется по всей России. Способы оплаты: наличные, банковские карты, электронные платежи, рассрочка.</p>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <div class="accordion-header" data-target="warranty">Гарантия и возврат</div>
                            <div class="accordion-content" id="warranty">
                                <p>На все товары предоставляется гарантия от производителя. Возврат товара возможен в течение 14 дней с момента покупки.</p>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <div class="accordion-header" data-target="privacy">Политика конфиденциальности</div>
                            <div class="accordion-content" id="privacy">
                                <p>Мы гарантируем полную конфиденциальность ваших персональных данных и используем их только для обработки заказов.</p>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <div class="accordion-header" data-target="contacts">Контакты</div>
                            <div class="accordion-content" id="contacts">
                                <p>Телефон: +7 (385) 223-45-67<br>Email: info@electrostore.ru<br>Адрес: г. Барнаул, ул. Ленина, 46</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-col">
                    <h3 class="footer-title">Мы в соцсетях</h3>
                    <div class="social-links">
                        <a href="https://vk.com/" target="_blank"><i class="fab fa-vk"></i></a>
                        <a href="https://t.me/" target="_blank"><i class="fab fa-telegram"></i></a>
                        <a href="https://www.youtube.com/" target="_blank"><i class="fab fa-youtube"></i></a>
                        <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                    <div class="footer-newsletter">
                        <h4>Подписаться на новости</h4>
                        <form class="newsletter-form">
                            <input type="email" placeholder="Ваш email">
                            <button type="submit"><i class="fas fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="copyright-text">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <div class="ct-inside">
                        &copy; <?php echo date('Y'); ?> Электронные компоненты | Все права защищены. Created by <a href="mailto:daler.shd.03@gmail.com">Daler</a>
                        <br>ИВТ-12, Шорахматов Далер<br>АлтГТУ им. И.И. Ползунова, г. Барнаул
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
<!-- Footer Section End -->

<!-- Auth Modal -->
<?php if (!isset($_SESSION['user_id'])): ?>
<div id="authModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Авторизация</h3>
            <span class="close">&times;</span>
        </div>
        <div class="auth-tabs">
            <button class="auth-tab active" data-tab="modalLogin">Вход</button>
            <button class="auth-tab" data-tab="modalRegister">Регистрация</button>
        </div>
        
        <!-- Login Form -->
        <form class="auth-form active" id="modalLoginForm">
            <div class="form-group">
                <label for="modalLoginEmail">Email или телефон</label>
                <div class="input-icon">
                    <i class="fas fa-user"></i>
                    <input type="text" id="modalLoginEmail" name="emailOrPhone" data-type="email-or-phone" placeholder="Email или +7XXXXXXXXXX" required>
                </div>
            </div>
            <div class="form-group">
                <label for="modalLoginPassword">Пароль</label>
                <div class="input-icon">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="modalLoginPassword" name="password" required>
                </div>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="modalRememberMe">
                <label for="modalRememberMe">Запомнить меня</label>
            </div>
            <button type="submit" class="btn-submit" id="modalLoginSubmit">Войти</button>
            <div class="form-footer">
                <a href="#" id="modalForgotPassword">Забыли пароль?</a>
            </div>
        </form>
        
        <!-- Register Form -->
        <form class="auth-form" id="modalRegisterForm">
            <div class="form-group">
                <label for="modalRegisterName">ФИО</label>
                <div class="input-icon">
                    <i class="fas fa-user"></i>
                    <input type="text" id="modalRegisterName" name="name" required>
                </div>
                <div class="error-message">Введите ФИО</div>
            </div>
            <div class="form-group">
                <label for="modalRegisterEmail">Email</label>
                <div class="input-icon">
                    <i class="fas fa-envelope"></i>
                    <input type="email" id="modalRegisterEmail" name="email" required>
                </div>
                <div class="error-message">Пожалуйста, введите корректный email</div>
            </div>
            <div class="form-group">
                <label for="modalRegisterPhone">Телефон</label>
                <div class="input-icon">
                    <i class="fas fa-phone"></i>
                    <input type="tel" id="modalRegisterPhone" name="phone" required placeholder="+7-(XXX)-XXX-XX-XX">
                </div>
                <div class="error-message">Введите полный номер телефона</div>
            </div>
            <div class="form-group">
                <label for="modalRegisterPassword">Пароль</label>
                <div class="input-icon">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="modalRegisterPassword" name="password" required>
                </div>
                <div class="error-message">Введите пароль</div>
            </div>
            <div class="form-group">
                <label for="modalPasswordConfirm">Подтверждение пароля</label>
                <div class="input-icon">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="modalPasswordConfirm" name="passwordConfirm" required>
                </div>
                <div class="error-message">Пароли не совпадают</div>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="modalTermsAccept" required>
                <label for="modalTermsAccept">
                    Я согласен с <a href="privacy-policy.php" target="_blank">политикой конфиденциальности</a>
                </label>
            </div>
            <button type="submit" class="btn-submit" id="modalRegisterSubmit">Зарегистрироваться</button>
        </form>
    </div>
</div>
<?php endif; ?>

<!-- Модальное окно для просмотра товара -->
<?php include 'includes/modals/product-modal.php'; ?>

<link rel="stylesheet" href="assets/css/auth-modal-improved.css">
<script src="assets/js/common.js"></script>
<?php if (!isset($_SESSION['user_id'])): ?>
<script src="assets/js/auth.js"></script>
<?php endif; ?>
<script src="assets/js/product-modal.js"></script>
<script src="assets/js/footer-accordion.js"></script>
<?php if (isset($additionalJs)) echo $additionalJs; ?>
</body>
</html>