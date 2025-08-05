//search.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Поиск товаров';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/pages/search.css">
<link rel="stylesheet" href="assets/css/toast.css">';

// Additional JS
$additionalJs = '<script src="assets/js/product-actions.js"></script>
<script src="assets/js/toggle-favorites.js"></script>
<script src="assets/js/search.js"></script>';

// Include required models and database connection
require_once 'includes/db/database.php';
require_once 'models/Product.php';

// Get search query
$searchQuery = isset($_GET['q']) ? trim($_GET['q']) : '';

// Get current page
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 12; // Number of products per page
$offset = ($page - 1) * $limit;

// Search products
$product = new Product();
$searchResults = [];
$totalProducts = 0;

// Добавляем отладочную информацию
$debugInfo = [];
$debugInfo['query'] = $searchQuery;
$debugInfo['connection'] = 'Checking database connection...';

// Проверяем подключение к базе данных
try {
    $db = new Database();
    $conn = $db->getConnection();
    $debugInfo['connection'] = 'Database connection successful';
    
    // Проверяем наличие товаров в базе данных
    $stmt = $conn->query("SELECT COUNT(*) as total FROM products");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $debugInfo['total_products_in_db'] = $row['total'];
    
    // Получаем список первых 5 товаров для проверки
    $stmt = $conn->query("SELECT id, name FROM products LIMIT 5");
    $debugInfo['sample_products'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $debugInfo['connection_error'] = $e->getMessage();
}

if (!empty($searchQuery)) {
    try {
        // Получаем результаты поиска
        $searchResults = $product->search($searchQuery, $limit, $offset);
        $totalProducts = $product->countSearchResults($searchQuery);
        
        // Добавляем информацию о результатах
        $debugInfo['results_count'] = count($searchResults);
        $debugInfo['total_products'] = $totalProducts;
        $debugInfo['success'] = true;
    } catch (Exception $e) {
        // Добавляем информацию об ошибке
        $debugInfo['error'] = $e->getMessage();
        $debugInfo['success'] = false;
    }
}

// Calculate pagination
$totalPages = ceil($totalProducts / $limit);

// Include header
include 'includes/header/header.php';
?>

<main>
    <div class="container">
        <!-- Отладочная информация -->
        <?php if (isset($_GET['debug']) && $_GET['debug'] == 1): ?>
        <div class="debug-info" style="background: #f8f9fa; padding: 15px; margin-bottom: 20px; border-radius: 5px; border: 1px solid #ddd;">
            <h3>Отладочная информация</h3>
            <pre><?php print_r($debugInfo); ?></pre>
        </div>
        <?php endif; ?>
        
        <div class="search-header">
            <h1>Результаты поиска: "<?= htmlspecialchars($searchQuery) ?>"</h1>
            <?php if ($totalProducts > 0): ?>
                <p class="search-results-count"><?= $totalProducts ?> товаров найдено</p>
            <?php endif; ?>
        </div>

        <?php if (empty($searchResults) && !empty($searchQuery)): ?>
            <div class="no-results">
                <i class="fas fa-search-minus"></i>
                <h2>По вашему запросу ничего не найдено</h2>
                <p>Попробуйте изменить запрос или просмотреть товары по категориям</p>
                <a href="index.php" class="btn btn-primary">На главную</a>
            </div>
        <?php elseif (empty($searchQuery)): ?>
            <div class="no-query">
                <i class="fas fa-search"></i>
                <h2>Введите поисковый запрос</h2>
                <p>Используйте поле поиска выше, чтобы найти нужные товары</p>
                <a href="index.php" class="btn btn-primary">На главную</a>
            </div>
        <?php else: ?>
            <div class="products__grid">
                <?php foreach ($searchResults as $prod): ?>
                    <div class="product-card">
                        <div class="product-card__image">
                            <img src="<?= $prod['image_url'] ?>" alt="<?= $prod['name'] ?>">
                            <button class="btn-favorite" data-product-id="<?= $prod['id'] ?>" onclick="toggleFavorite(<?= $prod['id'] ?>)">
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
            </div>

            <!-- Pagination -->
            <?php if ($totalPages > 1): ?>
                <div class="pagination">
                    <?php if ($page > 1): ?>
                        <a href="?q=<?= urlencode($searchQuery) ?>&page=<?= $page - 1 ?>" class="pagination-item prev">
                            <i class="fas fa-chevron-left"></i> Назад
                        </a>
                    <?php endif; ?>
                    
                    <?php
                    $startPage = max(1, $page - 2);
                    $endPage = min($totalPages, $page + 2);
                    
                    if ($startPage > 1) {
                        echo '<a href="?q=' . urlencode($searchQuery) . '&page=1" class="pagination-item">1</a>';
                        if ($startPage > 2) {
                            echo '<span class="pagination-ellipsis">...</span>';
                        }
                    }
                    
                    for ($i = $startPage; $i <= $endPage; $i++) {
                        $activeClass = $i == $page ? 'active' : '';
                        echo '<a href="?q=' . urlencode($searchQuery) . '&page=' . $i . '" class="pagination-item ' . $activeClass . '">' . $i . '</a>';
                    }
                    
                    if ($endPage < $totalPages) {
                        if ($endPage < $totalPages - 1) {
                            echo '<span class="pagination-ellipsis">...</span>';
                        }
                        echo '<a href="?q=' . urlencode($searchQuery) . '&page=' . $totalPages . '" class="pagination-item">' . $totalPages . '</a>';
                    }
                    ?>
                    
                    <?php if ($page < $totalPages): ?>
                        <a href="?q=<?= urlencode($searchQuery) ?>&page=<?= $page + 1 ?>" class="pagination-item next">
                            Вперед <i class="fas fa-chevron-right"></i>
                        </a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</main>

<?php
// Include footer
include 'includes/footer/footer.php';
?>
