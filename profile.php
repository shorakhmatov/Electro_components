<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Профиль';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/pages/profile-improved.css">
<link rel="stylesheet" href="assets/css/pages/bank-logos.css">
<link rel="stylesheet" href="assets/css/payment-notification.css">
<link rel="stylesheet" href="assets/css/toast.css">
<link rel="stylesheet" href="assets/css/confirm-modal.css">
<link rel="stylesheet" href="assets/css/email-verification.css">
<link rel="stylesheet" href="assets/css/auth-modal-improved.css">
<link rel="stylesheet" href="assets/css/delete-account.css">';

// Additional JS
$additionalJs = '<script src="assets/js/profile-auth.js"></script>
<script src="assets/js/profile-improved.js"></script>
<script src="assets/js/delivery-addresses.js"></script>
<script src="assets/js/payment-methods.js"></script>
<script src="assets/js/orders.js"></script>
<script src="assets/js/profile-card-manager.js"></script>
<script src="assets/js/confirm-modals.js"></script>
<script src="assets/js/email-verification.js"></script>
<script src="assets/js/delete-account.js"></script>
<script src="https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU" defer></script>
<!-- Примечание: Замените YOUR_API_KEY на действительный API ключ Яндекс Карт -->
<link rel="stylesheet" href="assets/css/toast.css">';

// Check if user is logged in
$isLoggedIn = isset($_SESSION['user_id']);

// Get user data if logged in
$userData = null;
if ($isLoggedIn) {
    require_once 'models/User.php';
    $user = new User();
    $userData = $user->getById($_SESSION['user_id']);
}

// Include header
include 'includes/header/header.php';
?>

<main class="profile-page">
    <div class="container">
        <!-- Auth Container (Login/Register) -->
        <div class="auth-container" id="authContainer" <?= $isLoggedIn ? 'style="display: none;"' : '' ?>>
            <div class="modal-header">
                <h3>Авторизация</h3>
            </div>
            <div class="auth-tabs">
                <div class="auth-tab active" data-tab="login">Войти</div>
                <div class="auth-tab" data-tab="register">Регистрация</div>
            </div>

            <!-- Login Form -->
            <form class="auth-form active" id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">Email или телефон</label>
                    <div class="input-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" id="loginEmail" name="emailOrPhone" data-type="email-or-phone" placeholder="Email или +7XXXXXXXXXX" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Пароль</label>
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="loginPassword" name="password" required>
                    </div>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="rememberMe">
                    <label for="rememberMe">Запомнить меня</label>
                </div>
                <button type="submit" class="btn-submit" id="loginSubmit">Войти</button>
                <div class="form-footer">
                    <a href="#" id="forgotPassword">Забыли пароль?</a>
                </div>
            </form>

            <!-- Register Form -->
            <form class="auth-form" id="registerForm">
                <div class="form-group">
                    <label for="registerName">ФИО</label>
                    <div class="input-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" id="registerName" name="name" required>
                    </div>
                    <div class="error-message">Введите ФИО</div>
                </div>
                <div class="form-group">
                    <label for="registerEmail">Email</label>
                    <div class="input-icon">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="registerEmail" name="email" required>
                    </div>
                    <div class="error-message">Пожалуйста, введите корректный email</div>
                </div>
                <div class="form-group">
                    <label for="registerPhone">Телефон</label>
                    <div class="input-icon">
                        <i class="fas fa-phone"></i>
                        <input type="tel" id="registerPhone" name="phone" required placeholder="+7-(XXX)-XXX-XX-XX">
                    </div>
                    <div class="error-message">Введите полный номер телефона</div>
                </div>
                <div class="form-group">
                    <label for="registerPassword">Пароль</label>
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="registerPassword" name="password" required>
                    </div>
                    <div class="error-message">Введите пароль</div>
                </div>
                <div class="form-group">
                    <label for="passwordConfirm">Подтверждение пароля</label>
                    <div class="input-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="passwordConfirm" name="passwordConfirm" required>
                    </div>
                    <div class="error-message">Пароли не совпадают</div>
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="termsAccept" required>
                    <label for="termsAccept">
                        Я согласен с <a href="privacy-policy.php" target="_blank">политикой конфиденциальности</a>
                    </label>
                </div>
                <button type="submit" class="btn-submit" id="registerSubmit">Зарегистрироваться</button>
            </form>
        </div>

        <!-- Profile Content -->
        <div class="profile-container" id="profileContent" <?= !$isLoggedIn ? 'style="display: none;"' : '' ?>>
            <!-- Sidebar -->
            <div class="profile-sidebar">
                <a href="#personal-data" class="profile-sidebar-item active">
                    <i class="fas fa-user"></i> Личные данные
                </a>
                <a href="#my-orders" class="profile-sidebar-item">
                    <i class="fas fa-shopping-bag"></i> Мои заказы
                </a>
                <a href="#payment-methods" class="profile-sidebar-item">
                    <i class="fas fa-credit-card"></i> Мои карты
                </a>
                <a href="#delivery-addresses" class="profile-sidebar-item">
                    <i class="fas fa-map-marker-alt"></i> Адреса доставки
                </a>
                <!-- <a href="#orders" class="profile-sidebar-item">
                    <i class="fas fa-shopping-bag"></i> Мои заказы
                </a> -->

                <a href="#settings" class="profile-sidebar-item">
                    <i class="fas fa-cog"></i> Настройки
                </a>
                <!-- <a href="logout.php" class="profile-sidebar-item">
                    <i class="fas fa-sign-out-alt"></i> Выход
                </a> -->
            </div>
            
            <!-- Main Content -->
            <div class="profile-content">
                <div class="profile-section active" id="personal-data">
                    <h2>Личные данные</h2>
                    <div class="personal-data-info">
                        <div class="info-card">
                            <div class="info-card-label">Фамилия</div>
                            <div class="info-card-value"><?= $isLoggedIn ? htmlspecialchars($userData['last_name']) : '-' ?></div>
                        </div>
                        <div class="info-card">
                            <div class="info-card-label">Имя</div>
                            <div class="info-card-value"><?= $isLoggedIn ? htmlspecialchars($userData['first_name']) : '-' ?></div>
                        </div>
                        <div class="info-card">
                            <div class="info-card-label">Отчество</div>
                            <div class="info-card-value"><?= $isLoggedIn && !empty($userData['middle_name']) ? htmlspecialchars($userData['middle_name']) : '-' ?></div>
                        </div>
                        <div class="info-card">
                            <div class="info-card-label">Email</div>
                            <div class="info-card-value">
                                <?= $isLoggedIn ? htmlspecialchars($userData['email']) : '-' ?>
                                <?php if ($isLoggedIn): ?>
                                    <?php if (isset($userData['email_verified']) && $userData['email_verified'] == 1): ?>
                                        <span class="email-status verified" title="Email подтвержден"><i class="fas fa-check-circle"></i> Подтвержден</span>
                                    <?php else: ?>
                                        <span class="email-status not-verified" title="Email не подтвержден"><i class="fas fa-exclamation-circle"></i> Не подтвержден</span>
                                        <button id="verifyEmailBtn" class="btn-verify-email">Подтвердить</button>
                                    <?php endif; ?>
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="info-card">
                            <div class="info-card-label">Телефон</div>
                            <div class="info-card-value"><?= $isLoggedIn ? htmlspecialchars($userData['phone']) : '-' ?></div>
                        </div>
                        <div class="info-card">
                            <div class="info-card-label">Дата регистрации</div>
                            <div class="info-card-value"><?= $isLoggedIn ? date('d.m.Y', strtotime($userData['created_at'])) : '-' ?></div>
                        </div>
                    </div>
                </div>
                
                <!-- Раздел Мои карты -->
                <div class="profile-section profile-payment-methods" id="payment-methods">
                    <h2>Мои карты и кошельки</h2>
                    
                    <div class="payment-methods-container">
                        <div class="payment-methods-tabs">
                            <div class="payment-tab active" data-tab="bank-cards">Банковские карты</div>
                            <div class="payment-tab" data-tab="web-wallets">Электронные кошельки</div>
                        </div>
                        
                        <div class="payment-tab-content active" id="bank-cards">
                            <div class="payment-cards-list" id="bankCardsList">
                                <!-- Здесь будут отображаться сохраненные банковские карты -->
                                <div class="payment-card add-card" id="addBankCard">
                                    <div class="add-card-icon">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <p>Добавить новую карту</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="payment-tab-content" id="web-wallets">
                            <div class="payment-wallets-list" id="webWalletsList">
                                <!-- Здесь будут отображаться сохраненные электронные кошельки -->
                                <div class="payment-wallet add-wallet" id="addWebWallet">
                                    <div class="add-wallet-icon">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <p>Добавить новый кошелек</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Раздел Мои заказы -->
                <div class="profile-section" id="my-orders">
                    <h2>Мои заказы</h2>
                    
                    <?php
                    // Подключаем модель заказов
                    require_once 'models/Order.php';
                    $orderModel = new Order();
                    
                    // Получаем заказы пользователя
                    $userOrders = $orderModel->getUserOrders($_SESSION['user_id']);
                    
                    if (!empty($userOrders)) :
                    ?>
                    <div class="orders-list">
                        <?php foreach ($userOrders as $order) : ?>
                            <div class="order-card">
                                <div class="order-header">
                                    <div class="order-info">
                                        <div class="order-number">Заказ #<?php echo $order['id']; ?></div>
                                        <div class="order-date"><?php echo date('d.m.Y H:i', strtotime($order['created_at'])); ?></div>
                                    </div>
                                    <div class="order-status <?php echo strtolower($order['status']); ?>">
                                        <?php 
                                        $statusText = '';
                                        switch($order['status']) {
                                            case 'pending':
                                                $statusText = 'В обработке';
                                                break;
                                            case 'processing':
                                                $statusText = 'Обрабатывается';
                                                break;
                                            case 'shipped':
                                                $statusText = 'Отправлен';
                                                break;
                                            case 'delivered':
                                                $statusText = 'Доставлен';
                                                break;
                                            case 'cancelled':
                                                $statusText = 'Отменен';
                                                break;
                                            default:
                                                $statusText = $order['status'];
                                        }
                                        echo $statusText;
                                        ?>
                                    </div>
                                </div>
                                
                                <?php 
                                // Получаем позиции заказа
                                $orderItems = $orderModel->getOrderItems($order['id']);
                                ?>
                                
                                <div class="order-items">
                                    <?php foreach ($orderItems as $item) : ?>
                                        <div class="order-item">
                                            <div class="item-image">
                                                <img src="<?php echo !empty($item['image_url']) ? $item['image_url'] : 'assets/images/products/placeholder.jpg'; ?>" alt="<?php echo $item['name']; ?>">
                                            </div>
                                            <div class="item-details">
                                                <div class="item-name"><?php echo $item['name']; ?></div>
                                                <div class="item-meta">
                                                    <span class="item-quantity"><?php echo $item['quantity']; ?> шт.</span>
                                                    <span class="item-price"><?php echo number_format($item['price_per_unit'], 0, '.', ' '); ?> руб.</span>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                                
                                <div class="order-footer">
                                    <div class="order-total">
                                        <span>Итого:</span>
                                        <span class="total-amount"><?php echo number_format($order['total_amount'], 0, '.', ' '); ?> руб.</span>
                                    </div>
                                    <div class="order-actions">
                                        <button class="btn-order-details" data-order-id="<?php echo $order['id']; ?>">Подробнее</button>
                                        <?php if ($order['status'] === 'pending' || $order['status'] === 'processing') : ?>
                                            <button class="btn-cancel-order" data-order-id="<?php echo $order['id']; ?>">Отменить</button>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <?php else : ?>
                    <div class="no-orders">
                        <div class="no-orders-icon">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <h3>У вас пока нет заказов</h3>
                        <p>Здесь будет отображаться история ваших заказов</p>
                        <a href="index.php" class="btn-shop-now">Перейти в каталог</a>
                    </div>
                    <?php endif; ?>
                </div>
                
                <!-- Раздел Адреса доставки -->
                <div class="profile-section" id="delivery-addresses">
                    <h2>Адреса доставки</h2>
                    
                    <div class="delivery-service-selection">
                        <h3>Выберите способ доставки</h3>
                        <div class="delivery-services">
                            <div class="delivery-service" data-service="cdek">
                                <img src="data:image/jpeg;base64,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" alt="СДЭК" onerror="this.src='assets/images/placeholder.png'; this.onerror=''">
                                <h4>СДЭК</h4>
                                <p>Доставка в пункты выдачи СДЭК</p>
                                <a href="https://www.cdek.ru/ru/offices/" target="_blank" class="view-points">Посмотреть пункты выдачи</a>
                                <button class="select-service" data-service="cdek">Выбрать</button>
                            </div>
                            <div class="delivery-service" data-service="russian-post">
                                <img src="data:image/png;base64,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" alt="Почта России" onerror="this.src='assets/images/placeholder.png'; this.onerror=''">
                                <h4>Почта России</h4>
                                <p>Доставка в почтовые отделения</p>
                                <a href="https://www.pochta.ru/" target="_blank" class="view-points">Посмотреть отделения</a>
                                <button class="select-service" data-service="russian-post">Выбрать</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pickup-points-map-container" style="display: none;">
                        <h3>Выберите пункт выдачи на карте</h3>
                        <div class="map-controls">
                            <button id="useGeolocation" class="btn-primary">Использовать мое местоположение</button>
                            <div class="search-container">
                                <input type="text" id="addressSearch" placeholder="Введите адрес для поиска">
                                <button id="searchAddress" class="btn-secondary">Поиск</button>
                            </div>
                        </div>
                        <div id="pickupPointsMap" class="pickup-points-map"></div>
                        <div class="pickup-point-details" style="display: none;">
                            <h4>Выбранный пункт выдачи</h4>
                            <div id="selectedPointDetails"></div>
                            <button id="confirmPickupPoint" class="btn-primary">Подтвердить выбор</button>
                        </div>
                    </div>
                    
                    <div class="manual-address-entry" style="display: none;">
                        <h3>Введите адрес доставки вручную</h3>
                        <form id="manualAddressForm" class="settings-form">
                            <div class="form-group">
                                <label for="deliveryService">Служба доставки</label>
                                <select id="deliveryService" name="deliveryService" required>
                                    <option value="" disabled selected>Выберите службу доставки</option>
                                    <option value="cdek">СДЭК</option>
                                    <option value="russian-post">Почта России</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="city">Город</label>
                                <input type="text" id="city" name="city" required>
                            </div>
                            <div class="form-group">
                                <label for="street">Улица</label>
                                <input type="text" id="street" name="street" required>
                            </div>
                            <div class="form-group">
                                <label for="building">Дом</label>
                                <input type="text" id="building" name="building" required>
                            </div>
                            <div class="form-group">
                                <label for="apartment">Квартира/Офис</label>
                                <input type="text" id="apartment" name="apartment">
                            </div>
                            <div class="form-group">
                                <label for="postalCode">Почтовый индекс</label>
                                <input type="text" id="postalCode" name="postalCode" required>
                            </div>
                            <div class="form-group">
                                <label for="addressComment">Комментарий к адресу</label>
                                <textarea id="addressComment" name="addressComment" rows="3"></textarea>
                            </div>
                            <button type="submit" class="save-button">Сохранить адрес</button>
                        </form>
                    </div>
                    
                    <div class="saved-addresses">
                        <h3>Сохраненные адреса</h3>
                        <div class="address-cards" id="savedAddressesList">
                            <!-- Здесь будут отображаться сохраненные адреса -->
                            <div class="address-card add-address-card" id="addAddressCard">
                                <div class="add-address-icon">
                                    <i class="fas fa-plus"></i>
                                </div>
                                <p>Добавить новый адрес</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Раздел Настройки -->
                <div class="profile-section" id="settings">
                    <h2>Настройки</h2>
                    
                    <div class="settings-section">
                        <h3>Редактирование личных данных</h3>
                        <form class="settings-form" id="personalDataForm">
                            <div class="form-group">
                                <label for="lastName">Фамилия</label>
                                <input type="text" id="lastName" name="lastName" value="<?= $isLoggedIn ? htmlspecialchars($userData['last_name']) : '' ?>">
                            </div>
                            <div class="form-group">
                                <label for="firstName">Имя</label>
                                <input type="text" id="firstName" name="firstName" value="<?= $isLoggedIn ? htmlspecialchars($userData['first_name']) : '' ?>">
                            </div>
                            <div class="form-group">
                                <label for="middleName">Отчество</label>
                                <input type="text" id="middleName" name="middleName" value="<?= $isLoggedIn && isset($userData['middle_name']) ? htmlspecialchars($userData['middle_name']) : '' ?>">
                            </div>
                            <div class="form-group">
                                <label for="profileEmail">Email</label>
                                <input type="email" id="profileEmail" name="email" value="<?= $isLoggedIn ? htmlspecialchars($userData['email']) : '' ?>">
                            </div>
                            <div class="form-group">
                                <label for="profilePhone">Телефон</label>
                                <input type="tel" id="profilePhone" name="phone" value="<?= $isLoggedIn ? htmlspecialchars($userData['phone']) : '' ?>" placeholder="+7XXXXXXXXXX">
                            </div>
                            <button type="submit" class="save-button">Сохранить изменения</button>
                        </form>
                    </div>
                    
                    <div class="settings-section">
                        <h3>Изменение пароля</h3>
                        <form class="settings-form" id="changePasswordForm">
                            <div class="form-group">
                                <label for="currentPassword">Текущий пароль</label>
                                <input type="password" id="currentPassword" name="currentPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="newPassword">Новый пароль</label>
                                <input type="password" id="newPassword" name="newPassword" required minlength="8">
                                <div class="help-text">Минимум 8 символов</div>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Подтверждение пароля</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required>
                            </div>
                            <button type="submit" class="save-button">Изменить пароль</button>
                        </form>
                    </div>
                    
                    <div class="settings-section">
                        <h3>Настройки уведомлений</h3>
                        <form class="settings-form" id="notificationSettingsForm">
                            <div class="checkbox-group">
                                <input type="checkbox" id="emailNotifications" name="emailNotifications" checked>
                                <label for="emailNotifications">Получать уведомления по электронной почте</label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="smsNotifications" name="smsNotifications">
                                <label for="smsNotifications">Получать SMS-уведомления</label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="orderUpdates" name="orderUpdates" checked>
                                <label for="orderUpdates">Уведомления о статусе заказа</label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="promotions" name="promotions" checked>
                                <label for="promotions">Акции и специальные предложения</label>
                            </div>
                            <button type="submit" class="save-button">Сохранить настройки</button>
                        </form>
                    </div>
                    
                    <div class="settings-section">
                        <h3>Удаление аккаунта</h3>
                        <div class="delete-account-container">
                            <p class="delete-account-warning">Внимание! Удаление аккаунта приведет к безвозвратному удалению всех ваших данных, включая историю заказов, адреса доставки и платежные данные.</p>
                            <button id="deleteAccountBtn" class="delete-account-button">Удалить аккаунт</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Add Card Modal -->
<div id="addBankCardModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Добавить карту</h3>
        <form id="addBankCardForm">
            <div class="form-group">
                <label for="cardNumber">Номер карты</label>
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" id="cardNumber" name="cardNumber" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="cardExpiry">Срок действия</label>
                    <input type="text" placeholder="ММ/ГГ" id="cardExpiry" name="cardExpiry" required>
                </div>
            </div>
            <div class="form-group">
                <label for="cardHolder">Имя владельца</label>
                <input type="text" placeholder="ИВАНОВ ИВАН" id="cardHolder" name="cardHolder" required>
            </div>
            <div class="form-group">
                <label for="cardBank">Банк</label>
                <select id="cardBank" name="cardBank" required>
                    <option value="" disabled selected>Выберите банк</option>
                    <option value="sberbank">Сбербанк</option>
                    <option value="tinkoff">Тинькофф</option>
                    <option value="alfabank">Альфа-Банк</option>
                    <option value="vtb">ВТБ</option>
                    <option value="gazprombank">Газпромбанк</option>
                    <option value="other">Другой</option>
                </select>
            </div>
            <div class="form-group" id="otherBankGroup" style="display: none;">
                <label for="otherBank">Укажите банк</label>
                <input type="text" id="otherBank" name="otherBank" placeholder="Название банка">
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="defaultCard" name="defaultCard">
                <label for="defaultCard">Использовать по умолчанию</label>
            </div>
            <button type="submit" class="btn-submit">Добавить карту</button>
        </form>
    </div>
</div>

<!-- Add Bank Card Modal -->
<div id="addBankCardModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Добавить банковскую карту</h3>
        <form id="addBankCardForm">
            <div class="form-group">
                <label for="cardNumber">Номер карты</label>
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" id="cardNumber" name="cardNumber" required>
            </div>
            <div class="form-row">
                <div class="form-group half">
                    <label for="cardExpiry">Срок действия</label>
                    <input type="text" placeholder="ММ/ГГ" id="cardExpiry" name="cardExpiry" required>
                </div>
                <div class="form-group half">
                    <label for="cardCvv">CVV/CVC</label>
                    <input type="password" placeholder="XXX" id="cardCvv" name="cardCvv" required maxlength="4">
                </div>
            </div>
            <div class="form-group">
                <label for="cardHolder">Имя владельца</label>
                <input type="text" placeholder="ИВАНОВ ИВАН" id="cardHolder" name="cardHolder" required>
            </div>
            <div class="form-group">
                <label for="cardBank">Банк</label>
                <select id="cardBank" name="cardBank" required>
                    <option value="" disabled selected>Выберите банк</option>
                    <option value="sberbank">Сбербанк</option>
                    <option value="tinkoff">Тинькофф</option>
                    <option value="alfabank">Альфа-Банк</option>
                    <option value="vtb">ВТБ</option>
                    <option value="gazprombank">Газпромбанк</option>
                    <option value="other">Другой</option>
                </select>
            </div>
            <div class="form-group" id="otherBankGroup" style="display: none;">
                <label for="otherBank">Укажите банк</label>
                <input type="text" id="otherBank" name="otherBank" placeholder="Название банка">
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="defaultCard" name="defaultCard">
                <label for="defaultCard">Использовать по умолчанию</label>
            </div>
            <button type="submit" class="btn-submit">Добавить карту</button>
        </form>
    </div>
</div>

<!-- Add Web Wallet Modal -->
<div id="addWebWalletModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Добавить электронный кошелек</h3>
        <form id="addWebWalletForm">
            <div class="form-group">
                <label for="walletType">Тип кошелька</label>
                <select id="walletType" name="walletType" required>
                    <option value="" disabled selected>Выберите тип кошелька</option>
                    <option value="yoomoney">ЮМани</option>
                    <option value="qiwi">QIWI</option>
                    <option value="webmoney">WebMoney</option>
                    <option value="paypal">PayPal</option>
                    <option value="other">Другой</option>
                </select>
            </div>
            <div class="form-group" id="otherWalletGroup" style="display: none;">
                <label for="otherWalletType">Укажите тип кошелька</label>
                <input type="text" id="otherWalletType" name="otherWalletType" placeholder="Название кошелька">
            </div>
            <div class="form-group">
                <label for="walletNumber">Номер кошелька или Email</label>
                <input type="text" id="walletNumber" name="walletNumber" required>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="defaultWallet" name="defaultWallet">
                <label for="defaultWallet">Использовать по умолчанию</label>
            </div>
            <button type="submit" class="btn-submit">Добавить кошелек</button>
        </form>
    </div>
</div>

<!-- Модальное окно подтверждения изменения личных данных -->
<div id="confirmSaveDataModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Подтверждение</h3>
        <p>Вы действительно хотите сохранить изменения в личных данных?</p>
        <div class="modal-buttons">
            <button id="confirmSaveData" class="btn-confirm">Подтвердить</button>
            <button id="cancelSaveData" class="btn-cancel">Отменить</button>
        </div>
    </div>
</div>

<!-- Модальное окно подтверждения изменения пароля -->
<div id="confirmChangePasswordModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Подтверждение</h3>
        <p>Вы действительно хотите изменить пароль?</p>
        <div class="modal-buttons">
            <button id="confirmChangePassword" class="btn-confirm">Подтвердить</button>
            <button id="cancelChangePassword" class="btn-cancel">Отменить</button>
        </div>
    </div>
</div>

<!-- Модальное окно подтверждения сохранения настроек уведомлений -->
<div id="confirmSaveNotificationsModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Подтверждение</h3>
        <p>Вы действительно хотите сохранить настройки уведомлений?</p>
        <div class="modal-buttons">
            <button id="confirmSaveNotifications" class="btn-confirm">Подтвердить</button>
            <button id="cancelSaveNotifications" class="btn-cancel">Отменить</button>
        </div>
    </div>
</div>

<!-- Модальное окно для ввода кода подтверждения почты -->
<div id="verifyEmailModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Подтверждение почты</h3>
        <p>На вашу почту <span id="verificationEmail"></span> отправлен код подтверждения.</p>
        <div class="form-group">
            <label for="verificationCode">Введите код подтверждения</label>
            <input type="text" id="verificationCode" name="verificationCode" placeholder="Код подтверждения" maxlength="6">
            <div class="verification-message" id="verificationMessage"></div>
        </div>
        <div class="modal-buttons">
            <button id="submitVerificationCode" class="btn-confirm">Подтвердить</button>
            <button id="cancelVerification" class="btn-cancel">Отменить</button>
        </div>
        <div class="resend-code">
            <a href="#" id="resendVerificationCode">Отправить код повторно</a>
        </div>

    </div>
</div>

<!-- Модальное окно подтверждения удаления аккаунта -->
<div id="confirmDeleteAccountModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Подтверждение удаления аккаунта</h3>
        <p>Вы действительно хотите удалить свой аккаунт? Это действие невозможно отменить.</p>
        <div id="activeOrdersWarning" style="display: none;" class="warning-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>У вас есть активные заказы. Удаление аккаунта будет возможно только после завершения всех заказов.</p>
        </div>
        <div class="modal-buttons">
            <button id="confirmDeleteAccount" class="btn-confirm btn-danger">Подтвердить удаление</button>
            <button id="cancelDeleteAccount" class="btn-cancel">Отменить</button>
        </div>
    </div>
</div>

<?php
// Include footer
include 'includes/footer/footer.php';
?>