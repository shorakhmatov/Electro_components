<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Главная';

// Include required models
require_once 'models/Category.php';
require_once 'models/Product.php';

// Get categories
$category = new Category();
$categories = $category->getAll();

// Get popular products - ограничиваем до 4
$product = new Product();
$popularProducts = $product->getPopular(11);

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/chat.css">
<link rel="stylesheet" href="assets/css/toast.css">
<link rel="stylesheet" href="assets/css/category-icons.css">
<link rel="stylesheet" href="assets/css/product-card-fix.css">
<link rel="stylesheet" href="assets/css/promo-blocks.css">
<link rel="stylesheet" href="assets/css/feature-links.css">
<link rel="stylesheet" href="assets/css/section-title.css">';

// Additional JS
$additionalJs = '<script src="assets/js/product-actions.js"></script>
<script src="assets/js/toggle-favorites.js"></script>
<script src="assets/js/home-page.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    // Обработчик для сворачивания/разворачивания категорий
    const categoriesHeader = document.querySelector(".categories-header");
    const categoriesToggle = document.querySelector(".categories-toggle");
    const categoriesContent = document.querySelector(".categories-content");
    
    if (categoriesHeader && categoriesToggle && categoriesContent) {
        // Сворачиваем категории по умолчанию при загрузке страницы
        categoriesContent.classList.add("collapsed");
        categoriesToggle.classList.add("collapsed");
        
        categoriesHeader.addEventListener("click", function() {
            categoriesContent.classList.toggle("collapsed");
            categoriesToggle.classList.toggle("collapsed");
        });
    }
});
</script>';

// Include header
include 'includes/header/header.php';
?>

    <main>
        <div class="container">
            <!-- Promo Section -->
            <section class="promo-section">
                <div class="promo-grid">
                    <!-- Блок 1: Приветствие и акции -->
                    <div class="promo-block promo-block-1 sale">
                        <div class="promo-content">
                            <div>
                                <h3 class="promo-title">Добрый день!</h3>
                                <p class="promo-subtitle">Специальное предложение для вас</p>
                                <p class="promo-text">Скидка 15% на все микроконтроллеры и электронные</p>
                                <p class="promo-text">компоненты до конца месяца!</p>
                            </div>
                            <a href="category.php?id=1" class="promo-button">Подробнее <i class="fas fa-arrow-right"></i></a>
                        </div>
                        <span class="promo-badge">-15%</span>
                        <img src="assets/images/promo/components.jpg" alt="Микроконтроллеры" class="promo-image">
                    </div>
                    
                    <!-- Блок 2: Новинки -->
                    <div class="promo-block promo-block-2 new">
                        <div class="promo-content">
                            <div>
                                <h3 class="promo-title">Новое поступление</h3>
                                <p class="promo-subtitle">Arduino, Raspberry Pi и другие платформы</p>
                                <p class="promo-text">Свежие поставки популярных плат и компонентов</p>
                                <p class="promo-text"> уже в наличии!</p>
                            </div>
                            <a href="search.php?q=new" class="promo-button">Смотреть новинки <i class="fas fa-arrow-right"></i></a>
                        </div>
                        <img src="assets/images/promo/arduino.jpg" alt="Arduino" class="promo-image">
                    </div>
                    

                    
                    <!-- Блок 4: Специальное предложение -->
                    <div class="promo-block promo-block-4 special">
                        <div class="promo-content">
                            <div>
                                <h3 class="promo-title"></h3>
                                <h3 class="promo-title">Специальное предложение</h3>
                                <p class="promo-subtitle">Комплекты для начинающих</p>
                                <p class="promo-text">Стартовые наборы для изучения электроники и программирования. Идеально подходят для студентов и хобби-проектов. В комплект входят все необходимые компоненты и подробные инструкции.</p>
                                <p class="promo-text"></p>
                            </div>
                            <a href="category.php?id=5" class="promo-button">Выбрать набор <i class="fas fa-arrow-right"></i></a>
                        </div>
                        <span class="promo-badge">Хит продаж</span>
                        <img src="assets/images/promo/components.jpg" alt="Стартовый набор" class="promo-image">
                    </div>
                </div>
            </section>
            
            <!-- Feature Links Section -->
            <section class="feature-links">
                <div class="feature-links-container">
                    <!-- Личный кабинет -->
                    <!-- <a href="profile.php" class="feature-link">
                        <div class="feature-link-content">
                            <div class="feature-link-title">Личный кабинет</div>
                            <div class="feature-link-description">Получайте бонусы, отслеживайте заказы и делитесь мнением</div>
                            <img src="assets/images/feature-links/profile.jpg" alt="Личный кабинет" class="feature-link-image">
                        </div>
                    </a> -->
                    
                    <!-- Каталог -->
                    <a href="categories.php" class="feature-link">
                        <div class="feature-link-content">
                            <div class="feature-link-title">Каталог</div>
                            <div class="feature-link-description">Большой выбор электронных компонентов для ваших проектов</div>
                            <img src="assets/images/feature-links/catalog.jpg" alt="Каталог" class="feature-link-image">
                        </div>
                    </a>
                    
                    <!-- Акции и скидки -->
                    <a href="sales.php" class="feature-link">
                        <div class="feature-link-content">
                            <div class="feature-link-title">Акции и скидки</div>
                            <div class="feature-link-description">Специальные предложения и скидки на популярные товары</div>
                            <img src="assets/images/feature-links/sale.jpg" alt="Акции и скидки" class="feature-link-image">
                        </div>
                    </a>
                    
                    <!-- Новинки -->
                    <a href="search.php?q=new" class="feature-link">
                        <div class="feature-link-content">
                            <div class="feature-link-title">Новинки</div>
                            <div class="feature-link-description">Последние поступления и новые модели</div>
                            <img src="assets/images/feature-links/compatibility.jpg" alt="Новинки" class="feature-link-image">
                        </div>
                    </a>
                    
                    <!-- Популярные товары -->
                    <a href="search.php?q=popular" class="feature-link">
                        <div class="feature-link-content">
                            <div class="feature-link-title">Популярные товары</div>
                            <div class="feature-link-description">Самые популярные товары среди наших клиентов</div>
                            <img src="assets/images/feature-links/gift.jpg" alt="Популярные товары" class="feature-link-image">
                        </div>
                    </a>
                    
                    <!-- Доставка -->
                    <a href="delivery.php" class="feature-link">
                        <div class="feature-link-content">
                            <div class="feature-link-title">Доставка</div>
                            <div class="feature-link-description">Быстрая доставка по всей стране</div>
                            <img src="assets/images/feature-links/delivery.jpg" alt="Доставка" class="feature-link-image">
                        </div>
                    </a>
                </div>
            </section>
            
            <!-- Categories Section -->
            <section class="categories categories-collapsible">                
                <div class="categories-header">
                    <h2><i class="fas fa-th-large category-title-icon"></i> Категории</h2>
                    <button class="categories-toggle"><i class="fas fa-chevron-up"></i></button>
                </div>
                
                <div class="categories-content">
                <div class="categories__grid">
                    <a href="category.php?id=1" class="category-card microcontrollers">
                        <div class="category-icon">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <span>Микроконтроллеры</span>
                    </a>
                    <a href="category.php?id=2" class="category-card resistors">
                        <div class="category-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <span>Резисторы</span>
                    </a>
                    <a href="category.php?id=3" class="category-card capacitors">
                        <div class="category-icon">
                            <i class="fas fa-battery-full"></i>
                        </div>
                        <span>Конденсаторы</span>
                    </a>
                    <a href="category.php?id=4" class="category-card leds">
                        <div class="category-icon">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                        <span>Светодиоды</span>
                    </a>
                    <a href="category.php?id=5" class="category-card transistors">
                        <div class="category-icon">
                            <i class="fas fa-broadcast-tower"></i>
                        </div>
                        <span>Транзисторы</span>
                    </a>
                    <a href="category.php?id=6" class="category-card sensors">
                        <div class="category-icon">
                            <i class="fas fa-wave-square"></i>
                        </div>
                        <span>Датчики</span>
                    </a>
                    <a href="category.php?id=7" class="category-card memory">
                        <div class="category-icon">
                            <i class="fas fa-memory"></i>
                        </div>
                        <span>Память</span>
                    </a>
                    <a href="category.php?id=8" class="category-card connectors">
                        <div class="category-icon">
                            <i class="fas fa-plug"></i>
                        </div>
                        <span>Разъёмы</span>
                    </a>
                    <a href="category.php?id=9" class="category-card pcb">
                        <div class="category-icon">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <span>Печатные платы</span>
                    </a>
                    <a href="category.php?id=10" class="category-card tools">
                        <div class="category-icon">
                            <i class="fas fa-tools"></i>
                        </div>
                        <span>Инструменты</span>
                    </a>
                    <a href="category.php?id=11" class="category-card robotics">
                        <div class="category-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <span>Роботехника</span>
                    </a>
                    <a href="category.php?id=12" class="category-card literature">
                        <div class="category-icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <span>Литература</span>
                    </a>
                </div>
            </section>

            <!-- Products Section -->
            <section class="products">
                <div class="section-title-wrapper">
                    <h2 class="section-title">Популярные товары</h2>
                    <div class="section-title-decoration"></div>
                </div>
                <div class="products__grid">
                    <?php foreach ($popularProducts as $prod): ?>
                        <div class="product-card" data-product-id="<?= $prod['id'] ?>">
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
            </section>
        </div>
    </main>

    <?php
    // Include footer
    include 'includes/footer/footer.php';
    ?>
    
    <!-- Modal windows -->
    <div id="authModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="login">Вход</button>
                <button class="auth-tab" data-tab="register">Регистрация</button>
            </div>
            <div id="loginForm" class="auth-form active">
                <input type="email" id="loginEmail" placeholder="Email">
                <input type="password" id="loginPassword" placeholder="Пароль">
                <button class="btn btn-primary" id="loginSubmit">Войти</button>
                <div id="loginError" class="error-message"></div>
            </div>
            <div id="registerForm" class="auth-form">
                <input type="text" id="registerName" placeholder="ФИО">
                <input type="email" id="registerEmail" placeholder="Email">
                <input type="tel" id="registerPhone" placeholder="Телефон">
                <input type="password" id="registerPassword" placeholder="Пароль">
                <label class="checkbox">
                    <input type="checkbox" id="termsAccept">
                    Согласен на обработку персональных данных
                </label>
                <button class="btn btn-primary" id="registerSubmit">Зарегистрироваться</button>
                <div id="registerError" class="error-message"></div>
            </div>
        </div>
    </div>

    <script src="assets/js/auth.js"></script>
    <script src="assets/js/auth-redirect.js"></script>
</body>
</html>
