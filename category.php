
//category.php<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if category ID is provided
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: index.php');
    exit;
}

$category_id = intval($_GET['id']);

// Include required models
require_once 'models/Category.php';
require_once 'models/Product.php';

// Get category data
$category = new Category();
$categoryData = $category->getById($category_id);

// If category doesn't exist, redirect to home
if (!$categoryData) {
    header('Location: index.php');
    exit;
}

// Page title
$pageTitle = $categoryData['name'];

// Get products in this category
$product = new Product();
$totalProducts = $product->countByCategory($category_id);
$products = $product->getByCategory($category_id, $totalProducts);

// Get total products count for pagination
$totalProducts = $product->countByCategory($category_id);

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/pages/category.css">
<link rel="stylesheet" href="assets/css/toast.css">
<link rel="stylesheet" href="assets/css/product-card-fix.css">';

// Additional JS
$additionalJs = '<script src="assets/js/category-page.js"></script>
<script src="assets/js/toggle-favorites.js"></script>';

// Include header
include 'includes/header/header.php';
?>

<main>
    <div class="container">
        <div class="category-header">
            <h1>
                <i class="fas fa-<?= $categoryData['icon'] ?? 'tag' ?>"></i>
                <?= $categoryData['name'] ?>
            </h1>
            <div class="category-count">
                <span><?= $totalProducts ?> товаров</span>
            </div>
        </div>

        <!-- Products Grid -->
        <div class="products__grid">
            <?php if (count($products) > 0): ?>
                <?php foreach ($products as $prod): ?>
                    <div class="product-card">
                        <div class="product-card__image">
                            <img src="<?= $prod['image_url'] ?>" alt="<?= $prod['name'] ?>">
                            <button class="btn-favorite" data-product-id="<?= $prod['id'] ?>">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                        <div class="product-card__content">
                            <h3><?= $prod['name'] ?></h3>
                            <p><?= substr($prod['description'], 0, 100) . (strlen($prod['description']) > 100 ? '...' : '') ?></p>
                            <div class="product-card__footer">
                                <span class="price"><?= number_format($prod['price'], 0, '', ' ') ?> ₽</span>
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
            <?php else: ?>
                <div class="category-empty">
                    <i class="fas fa-box-open"></i>
                    <p>В данной категории нет товаров</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php
// Include footer
include 'includes/footer/footer.php';
?> 