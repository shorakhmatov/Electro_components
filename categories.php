//categories.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Категории';

// Include required models
require_once 'models/Category.php';
require_once 'models/Product.php';

// Get categories and product counts
$category = new Category();
$categories = $category->getAll();

// Get product counts for each category
$productCounts = [];
foreach ($categories as $cat) {
    $productCounts[$cat['id']] = $category->getProductCount($cat['id']);
}

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/category-icons.css">
<link rel="stylesheet" href="assets/css/toast.css">
<link rel="stylesheet" href="assets/css/feature-links.css">
<link rel="stylesheet" href="assets/css/categories-page.css">
<link rel="stylesheet" href="assets/css/breadcrumbs.css">';

// Additional JS
$additionalJs = '<script src="assets/js/product-actions.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    // Анимация появления категорий
    const categoryItems = document.querySelectorAll(".category-item");
    categoryItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add("show");
        }, 100 * index);
    });
});
</script>';

// Include header
include 'includes/header/header.php';
?>

<main>
    <div class="container">
        <!-- Breadcrumbs -->
        <div class="breadcrumbs">
            <ul class="breadcrumbs-list">
                <li class="breadcrumbs-item">
                    <a href="index.php" class="breadcrumbs-link"><i class="fas fa-home"></i> Главная</a>
                </li>
                <li class="breadcrumbs-item">
                    <span class="breadcrumbs-current">Категории товаров</span>
                </li>
            </ul>
        </div>
        
        <!-- Categories Section -->
        <section class="categories-page">
            <div class="page-header">
                <h1><i class="fas fa-th-large category-title-icon"></i> Категории товаров</h1>
                <p class="page-description">Выберите категорию электронных компонентов, чтобы просмотреть товары и найти все необходимое для ваших проектов</p>
            </div>
            
            <div class="categories-grid">
                <a href="category.php?id=1" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-microchip"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Микроконтроллеры</h3>
                            <p class="category-description">Широкий выбор микроконтроллеров для ваших проектов</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[1]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=2" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Резисторы</h3>
                            <p class="category-description">Резисторы различных номиналов и мощностей</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[2]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=3" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-battery-full"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Конденсаторы</h3>
                            <p class="category-description">Конденсаторы различных типов и емкостей</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[3]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=4" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Светодиоды</h3>
                            <p class="category-description">Светодиоды различных цветов и яркости</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[4]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=5" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-broadcast-tower"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Транзисторы</h3>
                            <p class="category-description">Транзисторы различных типов и мощностей</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[5]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=6" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-wave-square"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Датчики</h3>
                            <p class="category-description">Различные датчики для ваших проектов</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[6]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=7" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-memory"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Память</h3>
                            <p class="category-description">Микросхемы памяти различных типов и объемов</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[7]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=8" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-plug"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Разъёмы</h3>
                            <p class="category-description">Разъёмы и коннекторы различных типов</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[8]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=9" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-microchip"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Печатные платы</h3>
                            <p class="category-description">Печатные платы и макетные платы для прототипирования</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[9]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=10" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-tools"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Инструменты</h3>
                            <p class="category-description">Инструменты для работы с электроникой</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[10]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
                
                <a href="category.php?id=11" class="category-item">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                    </div>
                    <div class="category-content">
                        <div>
                            <h3 class="category-title">Роботехника</h3>
                            <p class="category-description">Компоненты для робототехники и автоматизации</p>
                        </div>
                        <div class="category-stats">
                            <div class="category-stat"><i class="fas fa-box"></i> <?php echo $productCounts[11]; ?> товаров</div>
                        </div>
                        <div class="category-button">Перейти <i class="fas fa-arrow-right"></i></div>
                    </div>
                </a>
            </div>
        </section>
    </div>
</main>

<?php
// Include footer
include 'includes/footer/footer.php';
?>
