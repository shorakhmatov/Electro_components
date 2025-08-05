//cart.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Корзина';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/pages/cart-improved.css">
<link rel="stylesheet" href="assets/css/toast.css">';

// Additional JS
$additionalJs = '<script src="assets/js/cart-page-new.js"></script>
<script src="assets/js/cart-checkout.js"></script>';

// Check if user is logged in
$isLoggedIn = isset($_SESSION['user_id']);

// Get cart items if user is logged in
$cart_items = [];
$cart_total = 0;
$cart_count = 0;

if ($isLoggedIn) {
    require_once 'models/Cart.php';
    $cart = new Cart();
    $cart_items = $cart->getItems($_SESSION['user_id']);
    $cart_total = $cart->getTotal($_SESSION['user_id']);
    $cart_count = $cart->getItemCount($_SESSION['user_id']);
}

// Include header
include 'includes/header/header.php';
?>

<main>
    <div class="cart-container">
        <div class="cart-header">
            <h1>
                <i class="fas fa-shopping-cart"></i>
                Корзина
            </h1>
            <!-- <span class="cart-count">
                <i class="fas fa-shopping-basket"></i>
                <span id="cartItemsCount"><?= $cart_count ?></span> товаров
            </span> -->
        </div>

        <!-- Cart Items Section -->
        <div class="cart-items" id="cartItems">
            <?php if ($isLoggedIn && count($cart_items) > 0): ?>
                <?php foreach ($cart_items as $item): ?>
                    <div class="cart-item" data-product-id="<?= $item['product_id'] ?>">
                        <div class="item-image">
                            <img src="<?= $item['image_url'] ?>" alt="<?= $item['name'] ?>">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name"><?= $item['name'] ?></h3>
                            <div class="item-controls">
                                <div class="quantity-controls">
                                    <button class="btn-quantity decrement-cart-item" data-product-id="<?= $item['product_id'] ?>">-</button>
                                    <input type="number" class="quantity-input" value="<?= $item['quantity'] ?>" min="1" max="<?= $item['stock_quantity'] ?>" data-product-id="<?= $item['product_id'] ?>">
                                    <button class="btn-quantity increment-cart-item" data-product-id="<?= $item['product_id'] ?>">+</button>
                                </div>
                                <span class="item-price"><?= number_format($item['price'], 0, '', ' ') ?> ₽</span>
                                <button class="btn-remove remove-cart-item" data-product-id="<?= $item['product_id'] ?>">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <div class="item-subtotal">
                                <span>Итого:</span>
                                <span class="subtotal-price"><?= number_format($item['price'] * $item['quantity'], 0, '', ' ') ?> ₽</span>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary" id="cartSummary" <?= (!$isLoggedIn || count($cart_items) == 0) ? 'style="display: none;"' : '' ?>>
            <h3 class="summary-header">Итого</h3>
            <div class="summary-row">
                <span>Товары:</span>
                <span id="itemsTotal"><?= number_format($cart_total, 0, '', ' ') ?> ₽</span>
            </div>
            <div class="summary-row">
                <span>Скидка:</span>
                <span id="discount">0 ₽</span>
            </div>
            <div class="summary-total">
                <span>Итого к оплате:</span>
                <span id="totalAmount"><?= number_format($cart_total, 0, '', ' ') ?> ₽</span>
            </div>
            <a href="balance.php" class="checkout-btn" <?= $cart_count == 0 ? 'disabled' : '' ?> style="text-align: center; display: flex; justify-content: center; align-items: center;">
                Оформить заказ
            </a>
        </div>

        <!-- Empty Cart State -->
        <div class="cart-empty" id="cartEmpty" <?= ($isLoggedIn && count($cart_items) > 0) ? 'style="display: none;"' : '' ?>>
            <i class="fas fa-shopping-cart empty-icon"></i>
            <p class="empty-text">Ваша корзина пуста</p>
            <a href="index.php" class="browse-btn">
                <i class="fas fa-shopping-bag"></i>
                Перейти к покупкам
            </a>
        </div>
    </div>

    <!-- Payment Modal -->
    <div class="modal" id="paymentModal">
        <div class="modal-content">
            <button class="modal-close" id="modalClose">
                <i class="fas fa-times"></i>
            </button>
            <h2>Оплата заказа</h2>
            <div class="payment-methods">
                <div class="payment-method active" data-method="card">
                    <i class="fas fa-credit-card"></i>
                    <span>Банковская карта</span>
                </div>
                <div class="payment-method" data-method="balance">
                    <i class="fas fa-wallet"></i>
                    <span>Баланс</span>
                </div>
            </div>
            <form id="paymentForm" class="card-form">
                <div class="form-group">
                    <label for="cardNumber">Номер карты</label>
                    <input type="text" id="cardNumber" class="form-input" placeholder="0000 0000 0000 0000" maxlength="19">
                    <div class="error-message"></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="cardExpiry">Срок действия</label>
                        <input type="text" id="cardExpiry" class="form-input" placeholder="ММ/ГГ" maxlength="5">
                        <div class="error-message"></div>
                    </div>
                    <div class="form-group">
                        <label for="cardCvv">CVV</label>
                        <input type="password" id="cardCvv" class="form-input" placeholder="***" maxlength="3">
                        <div class="error-message"></div>
                    </div>
                </div>
                <button type="submit" class="checkout-btn">
                    Оплатить <span id="paymentAmount"><?= number_format($cart_total, 0, '', ' ') ?> ₽</span>
                </button>
            </form>
        </div>
    </div>
</main>

<?php
// Include footer
include 'includes/footer/footer.php';
?> 