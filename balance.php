//balance.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Оплата заказа';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/pages/balance.css">
<link rel="stylesheet" href="assets/css/pages/checkout.css">
<link rel="stylesheet" href="assets/css/pages/bank-logos.css">
<link rel="stylesheet" href="assets/css/pages/payment-methods.css">
<link rel="stylesheet" href="assets/css/toast.css">
<link rel="stylesheet" href="assets/css/pages/footer-fix.css">
<link rel="stylesheet" href="assets/css/payment-verification.css">';

// Additional JS
$additionalJs = '<script src="assets/js/balance.js"></script>
<script src="assets/js/checkout.js"></script>
<script src="assets/js/delivery-address-selector.js"></script>
<script src="assets/js/card-manager.js"></script>
<script src="assets/js/payment-processor.js"></script>
<script src="assets/js/payment-methods-ui.js"></script>
<script src="assets/js/payment-verification.js"></script>
<script src="assets/js/payment-forms.js"></script>';

// Check if user is logged in, redirect to index if not
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php?auth=1&redirect=balance.php');
    exit;
}

// Get user data
require_once 'models/User.php';
$user = new User();
$userData = $user->getById($_SESSION['user_id']);

// Get cart data
require_once 'models/Cart.php';
$cart = new Cart();
$cart_items = $cart->getItems($_SESSION['user_id']);
$cart_total = $cart->getTotal($_SESSION['user_id']);
$cart_count = $cart->getItemCount($_SESSION['user_id']);

// Флаг для проверки, пуста ли корзина
$is_cart_empty = ($cart_count == 0);

// Проверяем, есть ли товары в корзине
// Добавляем логирование для отладки
file_put_contents('cart_debug.log', "\n" . date('Y-m-d H:i:s') . " - Balance.php\n", FILE_APPEND);
file_put_contents('cart_debug.log', "User ID: {$_SESSION['user_id']}\n", FILE_APPEND);
file_put_contents('cart_debug.log', "Cart count: {$cart_count}\n", FILE_APPEND);
file_put_contents('cart_debug.log', "Cart items: " . print_r($cart_items, true) . "\n", FILE_APPEND);

// Если корзина пуста, но мы не будем перенаправлять пользователя,
// а просто покажем соответствующее сообщение на странице оформления

// Include header
include 'includes/header/header.php';
?>

<main>
    <div class="checkout-container">
        <div class="checkout-header">
            <h1>
                <i class="fas fa-shopping-cart"></i>
                Оформление заказа
            </h1>
        </div>
        
        <!-- Шаги оформления заказа -->
        <div class="checkout-steps">
            <div class="step completed">
                <div class="step-number">1</div>
                <div class="step-label">Корзина</div>
            </div>
            <div class="step-connector completed"></div>
            <div class="step active">
                <div class="step-number">2</div>
                <div class="step-label">Оплата</div>
            </div>
            <div class="step-connector"></div>
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-label">Готово</div>
            </div>
        </div>
        
        <div class="checkout-content">
            <!-- Сводка заказа -->
            <div class="order-summary">
                <h2>Ваш заказ</h2>
                
                <?php if ($is_cart_empty): ?>
                <!-- Пустая корзина -->
                <div class="empty-cart-message">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3>Ваша корзина пуста</h3>
                    <p>Добавьте товары в корзину, чтобы оформить заказ</p>
                    <a href="index.php" class="btn-shop-now">Перейти к покупкам</a>
                </div>
                <?php else: ?>
                <!-- Товары в корзине -->
                <div class="order-items">
                    <?php foreach ($cart_items as $item): ?>
                    <div class="order-item">
                        <div class="item-image">
                            <img src="<?= $item['image_url'] ?>" alt="<?= $item['name'] ?>">
                        </div>
                        <div class="item-details">
                            <div class="item-name"><?= $item['name'] ?></div>
                            <div class="item-meta">
                                <span class="item-quantity"><?= $item['quantity'] ?> шт.</span>
                                <span class="item-price"><?= number_format($item['price'], 0, '', ' ') ?> ₽</span>
                            </div>
                        </div>
                        <div class="item-total">
                            <?= number_format($item['price'] * $item['quantity'], 0, '', ' ') ?> ₽
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <div class="order-totals">
                    <div class="total-row">
                        <span>Товары:</span>
                        <span><?= number_format($cart_total, 0, '', ' ') ?> ₽</span>
                    </div>
                    <div class="total-row">
                        <span>Доставка:</span>
                        <span>Бесплатно</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>Итого к оплате:</span>
                        <span><?= number_format($cart_total, 0, '', ' ') ?> ₽</span>
                    </div>
                    <div class="back-to-cart-container">
                        <a href="cart.php" class="btn-back-to-cart">Вернуться в корзину</a>
                    </div>
                </div>
                <?php endif; ?>
            </div>
            
            <!-- Оформление заказа -->
            <div class="checkout-section">
                <!-- Адрес доставки -->
                <div class="delivery-address-section">
                    <h2>Адрес доставки</h2>
                    
                    <div class="delivery-address">
                        <div id="selectedAddressDisplay" class="selected-address-display">
                            <p>Для оформления заказа необходимо выбрать адрес доставки</p>
                        </div>
                        
                        <button id="selectAddressBtn" class="btn-select-address">
                            <i class="fas fa-map-marker-alt"></i> Выбрать адрес доставки
                        </button>
                    </div>
                </div>
                
                <div class="section-divider"></div>
                
                <!-- Способы оплаты -->
                <div class="payment-methods-section">
                    <h2>Способ оплаты</h2>
                
                <div class="payment-methods">
                    <div class="payment-methods-grid">
                        <!-- Первый ряд способов оплаты -->
                        <div class="payment-method-row">
                            <!-- Банковская карта -->
                            <div class="payment-method-item" id="bankCardMethod">
                                <div class="payment-method-icon">
                                    <i class="fas fa-credit-card"></i>
                                </div>
                                <div class="payment-method-title">Банковская карта</div>
                                <div class="payment-method-subtitle">МИР, Mastercard, Maestro, и др.</div>
                            </div>
                            
                            <!-- Кошелек -->
                            <div class="payment-method-item" id="walletMethod">
                                <div class="payment-method-icon">
                                    <i class="fas fa-wallet"></i>
                                </div>
                                <div class="payment-method-title">Кошелек</div>
                                <div class="payment-method-subtitle">Электронные платежные системы</div>
                            </div>
                        </div>
                        
                        <!-- Второй ряд способов оплаты -->
                        <div class="payment-method-row">
                            <!-- SberPay -->
                            <div class="payment-method-item" id="sberPayMethod">
                                <div class="payment-method-icon">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <div class="payment-method-title">SberPay</div>
                                <div class="payment-method-subtitle">Приложение Сбербанк Онлайн</div>
                            </div>
                            
                            <!-- Tinkoff Pay -->
                            <div class="payment-method-item" id="tinkoffPayMethod">
                                <div class="payment-method-icon">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <div class="payment-method-title">Tinkoff Pay</div>
                                <div class="payment-method-subtitle">Приложение Тинькофф</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Сохраненные банковские карты -->
                    <div class="saved-bank-cards" id="savedBankCards" style="display: none;">
                        <h4>Выберите сохраненную карту</h4>
                        <div class="saved-cards-list" id="savedCardsList">
                            <!-- Сохраненные карты будут добавлены через JavaScript -->
                        </div>
                        <div class="add-new-payment-method">
                            <a href="profile.php#payment-methods" class="btn-add-payment-method">
                                <i class="fas fa-plus"></i> Добавить новую карту
                            </a>
                        </div>
                        <div class="pay-with-card-btn">
                            <button id="addNewCardBtn" class="btn-pay-with">
                                <i class="fas fa-credit-card"></i> Оплатить картой
                            </button>
                        </div>
                    </div>
                    
                    <!-- Сохраненные кошельки -->
                    <div class="saved-wallets" id="savedWallets" style="display: none;">
                        <h4>Выберите сохраненный кошелек</h4>
                        <div class="saved-wallets-list" id="savedWalletsList">
                            <!-- Сохраненные кошельки будут добавлены через JavaScript -->
                        </div>
                        <div class="add-new-payment-method">
                            <a href="profile.php#payment-methods" class="btn-add-payment-method">
                                <i class="fas fa-plus"></i> Добавить новый кошелек
                            </a>
                        </div>
                        <div class="pay-with-wallet-btn">
                            <button id="addNewWalletBtn" class="btn-pay-with">
                                <i class="fas fa-wallet"></i> Оплатить кошельком
                            </button>
                        </div>
                    </div>
                    
                    <!-- Форма оплаты картой -->
                    <div class="payment-form bank-card-form" id="bankCardForm" style="display: none;">
                        <h3>Оплатить картой</h3>
                        <form id="payment-form" class="card-form">
                            <input type="hidden" name="payment_method" value="card">
                            <input type="hidden" name="amount" value="<?= $cart_total ?>">
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cardNumber">Номер карты</label>
                                    <input type="text" id="cardNumber" name="card_number" placeholder="0000 0000 0000 0000" maxlength="19" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cardExpiry">Срок действия</label>
                                    <input type="text" id="cardExpiry" name="card_expiry" placeholder="ММ/ГГ" maxlength="5" required>
                                </div>
                                <div class="form-group">
                                    <label for="cardCvv">CVV</label>
                                    <input type="password" id="cardCvv" name="card_cvv" placeholder="000" maxlength="3" required>
                                </div>
                            </div>
                            <!-- Поле имени владельца карты удалено по требованию -->
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="phoneNumber">Номер телефона</label>
                                    <input type="text" id="phoneNumber" name="phone_number" placeholder="+7 (___) ___-__-__" maxlength="18" required>
                                </div>
                            </div>
                            <div class="form-group checkbox-group">
                                <input type="checkbox" id="saveCard" name="save_card">
                                <label for="saveCard">Сохранить карту для будущих покупок</label>
                            </div>
                            <div class="payment-button-container">
                                <?php if (!$is_cart_empty): ?>
                                <button type="submit" id="placeOrderBtn" class="btn-place-order" disabled>Оплатить <?= number_format($cart_total, 0, '', ' ') ?> ₽</button>
                                <?php else: ?>
                                <a href="index.php" class="btn-place-order">Перейти к покупкам</a>
                                <?php endif; ?>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Форма оплаты кошельком -->
                    <div class="payment-form wallet-form" id="walletForm" style="display: none;">
                        <h3>Оплатить через кошелек</h3>
                        <div class="wallet-form-content">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="walletNumber">Номер кошелька</label>
                                    <input type="text" id="walletNumber" placeholder="Введите номер кошелька">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="walletPhone">Номер телефона</label>
                                    <input type="text" id="walletPhone" placeholder="+7 (___) ___-__-__" maxlength="18">
                                </div>
                            </div>
                            <div class="form-group checkbox-group">
                                <input type="checkbox" id="saveWallet">
                                <label for="saveWallet">Сохранить кошелек для будущих покупок</label>
                            </div>
                            <div class="payment-button-container">
                                <?php if (!$is_cart_empty): ?>
                                <button id="placeOrderBtnWallet" class="btn-place-order" disabled>Оплатить <?= number_format($cart_total, 0, '', ' ') ?> ₽</button>
                                <?php else: ?>
                                <a href="index.php" class="btn-place-order">Перейти к покупкам</a>
                                <?php endif; ?>
                            </div>
                            
                            <!-- Блок для ввода кода подтверждения (изначально скрыт) -->
                            <div id="walletVerificationCodeBlock" class="verification-code-block" style="display: none;">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="walletVerificationCode">Код из SMS</label>
                                        <input type="text" id="walletVerificationCode" placeholder="Введите код" maxlength="6">
                                    </div>
                                </div>
                                <div class="verification-actions">
                                    <button id="resendWalletCodeBtn" class="btn-resend-code">
                                        <i class="fas fa-redo"></i> Отправить код повторно
                                    </button>
                                    <button id="sendWalletCodeBtn" class="btn-send-code">
                                        <i class="fas fa-sms"></i> Отправить код подтверждения
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Форма оплаты через СберПей -->
                    <div class="payment-form sberpay-form" id="sberPayForm" style="display: none;">
                        <h3>Оплатить через СберПей</h3>
                        <form id="sberpay-form" class="sberpay-form-content">
                            <input type="hidden" name="payment_method" value="sberpay">
                            <input type="hidden" name="amount" value="<?= $cart_total ?>">
                            
                            <div class="sberpay-info">
                                <div class="sberpay-logo">
                                    <img src="assets/images/payment/sberpay-logo.png" alt="СберПей">
                                </div>
                                <div class="sberpay-description">
                                    <p>Для оплаты через СберПей вам необходимо указать номер телефона, подключенный к СберБанк Онлайн.</p>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="sberPhoneNumber">Номер телефона</label>
                                    <input type="text" id="sberPhoneNumber" name="phone_number" placeholder="+7 (___) ___-__-__" maxlength="18" required>
                                </div>
                            </div>
                            <div class="payment-button-container">
                                <?php if (!$is_cart_empty): ?>
                                <button type="submit" id="placeOrderBtnSberPay" class="btn-place-order" disabled>Оплатить <?= number_format($cart_total, 0, '', ' ') ?> ₽</button>
                                <?php else: ?>
                                <a href="index.php" class="btn-place-order">Перейти к покупкам</a>
                                <?php endif; ?>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Форма оплаты Tinkoff Pay -->
                    <div class="payment-form tinkoff-form" id="tinkoffPayForm" style="display: none;">
                        <h3>Оплатить через Tinkoff Pay</h3>
                        <form id="tinkoff-form" class="tinkoff-form-content">
                            <input type="hidden" name="payment_method" value="tinkoff">
                            <input type="hidden" name="amount" value="<?= $cart_total ?>">
                            
                            <div class="tinkoff-info">
                                <div class="tinkoff-icon">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <div class="tinkoff-description">
                                    <p>Для оплаты через Tinkoff Pay введите номер телефона, привязанный к вашему аккаунту Тинькофф.</p>
                                    <p>После нажатия кнопки "Оплатить" вам будет отправлен SMS-код для подтверждения платежа.</p>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="tinkoffPayPhone">Номер телефона</label>
                                    <input type="text" id="tinkoffPayPhone" name="phone_number" placeholder="+7 (___) ___-__-__" maxlength="18" required>
                                </div>
                            </div>
                            <div class="form-group checkbox-group">
                                <input type="checkbox" id="saveTinkoffPay" name="save_payment">
                                <label for="saveTinkoffPay">Сохранить для будущих покупок</label>
                            </div>
                            <div class="payment-button-container">
                                <?php if (!$is_cart_empty): ?>
                                <button type="submit" id="placeOrderBtnTinkoffPay" class="btn-place-order" disabled>Оплатить <?= number_format($cart_total, 0, '', ' ') ?> ₽</button>
                                <?php else: ?>
                                <a href="index.php" class="btn-place-order">Перейти к покупкам</a>
                                <?php endif; ?>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
                

                
                <div class="checkout-actions">
                </div>
            </div>
        </div>

        <!-- Модальное окно успешного заказа -->
        <div class="modal" id="orderSuccessModal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Заказ успешно оформлен!</h3>
                    <p>Ваш заказ #<span id="successOrderId">0000</span> успешно оформлен.</p>
                    <p>Мы отправили подтверждение на ваш email.</p>
                    <div class="success-actions">
                        <a href="profile.php#my-orders" class="btn btn-primary">Перейти к моим заказам</a>
                        <a href="index.php" class="btn btn-secondary">Продолжить покупки</a>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Модальное окно успешной оплаты -->
        <div class="modal" id="paymentSuccessModal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Оплата успешно произведена!</h3>
                    <p>Сумма <span id="paymentAmount">0</span> ₽ успешно списана с вашей карты.</p>
                    <p>Чек об оплате отправлен на ваш email.</p>
                    <div class="success-actions">
                        <a href="profile.php#payment-history" class="btn btn-primary">История платежей</a>
                        <button id="closePaymentModalBtn" class="btn btn-secondary">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Модальное окно выбора адреса доставки -->
        <div class="modal address-modal" id="addressSelectionModal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Выберите адрес доставки</h3>
                
                <div class="saved-addresses" id="savedAddressesList">
                    <!-- Здесь будут отображаться сохраненные адреса -->
                </div>
            </div>
        </div>
    </div>
</main>

<?php
// Подключаем модальные окна для подтверждения платежа
include 'includes/modals/payment-verification-modal.php';

// Include footer
include 'includes/footer/footer.php';
?>