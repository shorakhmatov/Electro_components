//sales.php<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Акции и скидки';

// Include required models
require_once 'models/Category.php';
require_once 'models/Product.php';

// Get categories
$category = new Category();
$categories = $category->getAll();

// Get products on sale
$product = new Product();
$saleProducts = $product->getOnSale(20); // Получаем товары со скидкой

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/toast.css">
<link rel="stylesheet" href="assets/css/category-icons.css">
<link rel="stylesheet" href="assets/css/product-card-fix.css">
<link rel="stylesheet" href="assets/css/section-title.css">
<link rel="stylesheet" href="assets/css/sales-page.css">';

// Additional JS
$additionalJs = '<script src="assets/js/product-actions.js"></script>
<script src="assets/js/toggle-favorites.js"></script>';

// Include header
include 'includes/header/header.php';
?>

<main>
    <div class="container">
        <!-- Sales Header Section -->
        <section class="sales-header">
            <div class="section-title-wrapper">
                <h2 class="section-title">Акции и специальные предложения</h2>
                <div class="section-title-decoration"></div>
            </div>
            <div class="sales-description">
                <p>Здесь вы найдете самые выгодные предложения и скидки на электронные компоненты. Не упустите возможность приобрести качественные товары по сниженным ценам!</p>
            </div>
        </section>

        <!-- Current Sales Section -->
        <section class="current-sales">
            <h3 class="subsection-title">Текущие акции</h3>
            <div class="sales-banners">
                <div class="sale-banner">
                    <div class="sale-banner-content">
                        <h4>Скидка 15% на микроконтроллеры</h4>
                        <p>До конца месяца скидка на все микроконтроллеры и электронные компоненты</p>
                        <a href="category.php?id=1" class="btn btn-primary">Перейти к товарам</a>
                    </div>
                    <div class="sale-banner-image">
                        <img src="assets/images/promo/components.jpg" alt="Микроконтроллеры">
                        <span class="sale-badge">-15%</span>
                    </div>
                </div>
                <div class="sale-banner">
                    <div class="sale-banner-content">
                        <h4>Комплекты для начинающих</h4>
                        <p>Специальное предложение на стартовые наборы для изучения электроники</p>
                        <a href="category.php?id=5" class="btn btn-primary">Выбрать набор</a>
                    </div>
                    <div class="sale-banner-image">
                        <img src="assets/images/promo/arduino.jpg" alt="Стартовый набор">
                        <span class="sale-badge">Хит продаж</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Products on Sale Section -->
        <section class="products">
            <h3 class="subsection-title">Товары со скидкой</h3>
            <div class="products__grid">
                <?php foreach ($saleProducts as $prod): ?>
                    <div class="product-card" data-product-id="<?= $prod['id'] ?>">
                        <div class="product-card__image">
                            <img src="<?= $prod['image_url'] ?>" alt="<?= $prod['name'] ?>">
                            <button class="btn-favorite" data-product-id="<?= $prod['id'] ?>" onclick="toggleFavorite(<?= $prod['id'] ?>)">
                                <i class="far fa-heart"></i>
                            </button>
                            <?php if (isset($prod['discount']) && $prod['discount'] > 0): ?>
                                <span class="discount-badge">-<?= $prod['discount'] ?>%</span>
                            <?php endif; ?>
                        </div>
                        <div class="product-card__content">
                            <h3><?= $prod['name'] ?></h3>
                            <p><?= substr($prod['description'], 0, 100) . (strlen($prod['description']) > 100 ? '...' : '') ?></p>
                            <div class="product-card__footer">
                                <div class="price-container">
                                    <?php if (isset($prod['old_price']) && $prod['old_price'] > 0): ?>
                                        <span class="old-price"><?= number_format($prod['old_price'], 0, '', ' ') ?> ₽</span>
                                    <?php endif; ?>
                                    <span class="price"><?= number_format($prod['price'], 0, '', ' ') ?> ₽</span>
                                </div>
                                <div class="stock-info">
                                    <span class="stock-label">На складе:</span>
                                    <span class="stock-quantity"><?= $prod['quantity'] ?> шт.</span>
                                </div>
                                <div class="quantity-controls">
                                    <button class="btn-quantity" onclick="decrementQuantity(this)">-</button>
                                    <input type="number" class="quantity-input" value="1" min="1" max="<?= min($prod['quantity'], 99) ?>" onchange="validateQuantity(this)">
                                    <button class="btn-quantity" onclick="incrementQuantity(this)">+</button>
                                </div>
                                <button class="btn btn-primary add-to-cart" data-product-id="<?= $prod['id'] ?>">
                                    <i class="fas fa-shopping-cart"></i> В корзину
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>
    </div>
</main>

<?php
// Include footer
include 'includes/footer/footer.php';
?>
</body>
</html>
