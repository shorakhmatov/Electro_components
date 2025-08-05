//favorites.php<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Избранное';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/pages/favorites-grid.css">
<link rel="stylesheet" href="assets/css/toast.css">';

// Additional JS
$additionalJs = '<script src="assets/js/favorites-page.js"></script>
<script src="assets/js/toggle-favorites.js"></script>';

// Check if user is logged in
$isLoggedIn = isset($_SESSION['user_id']);

// Get favorites if user is logged in
$favorites = [];
$favoritesCount = 0;

if ($isLoggedIn) {
    require_once 'models/Favorite.php';
    $favorite = new Favorite();
    $favorites = $favorite->getAll($_SESSION['user_id']);
    $favoritesCount = $favorite->getCount($_SESSION['user_id']);
}

// Include header
include 'includes/header/header.php';
?>

<main>
    <div class="favorites-container">
        <div class="favorites-header">
            <h1>
                <i class="fas fa-heart"></i>
                Избранное
            </h1>
            <span class="favorites-count">
                <i class="fas fa-bookmark"></i>
                <span id="favoritesItemsCount"><?= $favoritesCount ?></span> товаров
            </span>
        </div>

        <!-- Favorites Items Section -->
        <div class="favorites-items" id="favoritesItems">
            <?php if ($isLoggedIn && count($favorites) > 0): ?>
                <?php foreach ($favorites as $item): ?>
                    <div class="favorites-item" data-product-id="<?= $item['product_id'] ?>">
                        <div class="item-image">
                            <img src="<?= $item['image_url'] ?>" alt="<?= $item['name'] ?>">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name"><?= $item['name'] ?></h3>
                            <p class="item-description"><?= $item['description'] ?></p>
                            <div class="item-footer">
                                <span class="item-price"><?= number_format($item['price'], 0, '', ' ') ?> ₽</span>
                                <div class="item-actions">
                                    <button class="btn btn-primary add-to-cart" data-product-id="<?= $item['product_id'] ?>">
                                        <i class="fas fa-shopping-cart"></i> В корзину
                                    </button>
                                    <button class="btn-remove remove-favorite" data-product-id="<?= $item['product_id'] ?>">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <!-- Empty Favorites State -->
        <div class="favorites-empty" id="favoritesEmpty" <?= ($isLoggedIn && count($favorites) > 0) ? 'style="display: none;"' : '' ?>>
            <i class="fas fa-heart empty-icon"></i>
            <p class="empty-text">Ваш список избранного пуст</p>
            <a href="index.php" class="browse-btn">
                <i class="fas fa-shopping-bag"></i>
                Перейти к покупкам
            </a>
        </div>
    </div>
</main>

<?php
// Include footer
include 'includes/footer/footer.php';
?> 