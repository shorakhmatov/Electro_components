<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Get cart count
$cartCount = 0;
$favoritesCount = 0;
$userName = null;

if (isset($_SESSION['user_id'])) {
    // Get cart count
    require_once __DIR__ . '/../../models/Cart.php';
    $cart = new Cart();
    $cartCount = $cart->getItemCount($_SESSION['user_id']);

    // Get favorites count
    require_once __DIR__ . '/../../models/Favorite.php';
    $favorite = new Favorite();
    $favoritesCount = $favorite->getCount($_SESSION['user_id']);
    
    // Get user name
    require_once __DIR__ . '/../../models/User.php';
    $user = new User();
    $userData = $user->getById($_SESSION['user_id']);
    if ($userData) {
        $userName = $userData['first_name'];
        // Если имя длиннее 8 символов, сокращаем его
        if (mb_strlen($userName, 'UTF-8') > 8) {
            $userName = mb_substr($userName, 0, 8, 'UTF-8') . '...';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle . ' | ElectroStore' : 'ElectroStore'; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/header-badges.css">
    <link rel="stylesheet" href="assets/css/product-modal.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <link rel="stylesheet" href="assets/css/auth-modal.css">
    <link rel="stylesheet" href="assets/css/toast.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link rel="stylesheet" href="assets/css/modal-responsive.css">
    <link rel="stylesheet" href="assets/css/fixed-header.css">
    <link rel="stylesheet" href="assets/css/mobile-sidebar.css">
    <?php if (isset($additionalCss)) echo $additionalCss; ?>
    <script src="assets/js/logout-handler.js"></script>
    <script src="assets/js/modal-auth.js"></script>
    <script src="assets/js/register-handler.js"></script>
    <script src="assets/js/balance-redirect.js"></script>
    <script src="assets/js/phone-formatter.js"></script>
    <script src="assets/js/mobile-menu.js"></script>
    <script src="assets/js/mobile-sidebar.js"></script>
    <script src="assets/js/fixed-header.js"></script>
    <script src="assets/js/cart-counter-updater.js"></script>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header__logo">
                <a href="index.php">
                    <h1>ElectroStore</h1>
                </a>
            </div>
            
            <!-- Мобильное меню (бургер-меню) -->
            <div class="mobile-menu-toggle" id="mobileMenuToggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
            
            <div class="header__search" id="headerSearch">
                <form action="search.php" method="GET">
                    <input type="text" name="q" placeholder="Поиск компонентов..." value="<?php echo isset($_GET['q']) ? htmlspecialchars($_GET['q']) : ''; ?>">
                    <button type="submit"><i class="fas fa-search"></i></button>
                </form>
            </div>
            
            <nav class="header__nav" id="headerNav">
                <ul>
                    <li><a href="profile.php" id="profileBtn"><i class="fas fa-user"></i> <span><?php echo isset($userName) ? htmlspecialchars($userName) : 'Профиль'; ?></span></a></li>
                    <li>
                        <a href="favorites.php" id="favoritesBtn">
                            <i class="fas fa-heart"></i> <span>Избранное</span>
                            <span id="favoritesCount" class="count-badge"><?php echo $favoritesCount > 0 ? $favoritesCount : ''; ?></span>
                        </a>
                    </li>
                    <li>
                        <a href="cart.php" id="cartBtn">
                            <i class="fas fa-shopping-cart"></i> <span>Корзина</span>
                            <span id="cartCount" class="count-badge"><?php echo $cartCount > 0 ? $cartCount : ''; ?></span>
                        </a>
                    </li>
                    <li><a href="balance.php" id="balanceBtn"><i class="fas fa-wallet"></i> <span>Баланс</span></a></li>
                    <?php if(isset($_SESSION['user_id'])): ?>
                        <li><a href="logout.php" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> <span>Выход</span></a></li>
                    <?php endif; ?>
                </ul>
            </nav>
        </div>
    </header>
    <!-- Мобильное боковое меню -->
    <div class="mobile-sidebar" id="mobileSidebar">
        <div class="mobile-sidebar-header">
            <h2>ElectroStore</h2>
            <button class="mobile-sidebar-close" id="mobileSidebarClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <!-- Поиск в боковом меню -->
        <div class="mobile-sidebar-search">
            <form action="search.php" method="GET">
                <input type="text" name="q" placeholder="Поиск компонентов..." value="<?php echo isset($_GET['q']) ? htmlspecialchars($_GET['q']) : ''; ?>">
                <button type="submit"><i class="fas fa-search"></i></button>
            </form>
        </div>
        <div class="mobile-sidebar-menu">
            <a href="profile.php" class="mobile-sidebar-menu-item">
                <i class="fas fa-user"></i>
                <span><?php echo isset($userName) ? htmlspecialchars($userName) : 'Профиль'; ?></span>
            </a>
            <a href="favorites.php" class="mobile-sidebar-menu-item">
                <i class="fas fa-heart"></i>
                <span>Избранное</span>
                <?php if ($favoritesCount > 0): ?>
                <span class="badge"><?php echo $favoritesCount; ?></span>
                <?php endif; ?>
            </a>
            <a href="cart.php" class="mobile-sidebar-menu-item">
                <i class="fas fa-shopping-cart"></i>
                <span>Корзина</span>
                <?php if ($cartCount > 0): ?>
                <span class="badge"><?php echo $cartCount; ?></span>
                <?php endif; ?>
            </a>
            <a href="balance.php" class="mobile-sidebar-menu-item">
                <i class="fas fa-wallet"></i>
                <span>Баланс</span>
            </a>
            <?php if (isset($_SESSION['user_id'])): ?>
            <a href="#" class="mobile-sidebar-menu-item" id="logoutBtnMobile">
                <i class="fas fa-sign-out-alt"></i>
                <span>Выход</span>
            </a>
            <?php else: ?>
            <a href="#" class="mobile-sidebar-menu-item" id="loginBtnMobile" onclick="openLoginModal()">
                <i class="fas fa-sign-in-alt"></i>
                <span>Вход</span>
            </a>
            <?php endif; ?>
        </div>
    </div>
    <div class="mobile-sidebar-overlay" id="mobileSidebarOverlay"></div>

    <script>
        // Добавляем обработчик для кнопки выхода в мобильном меню
        document.addEventListener('DOMContentLoaded', function() {
            const logoutBtnMobile = document.getElementById('logoutBtnMobile');
            if (logoutBtnMobile) {
                logoutBtnMobile.addEventListener('click', function(e) {
                    e.preventDefault();
                    handleLogout();
                });
            }
            
            const loginBtnMobile = document.getElementById('loginBtnMobile');
            if (loginBtnMobile) {
                loginBtnMobile.addEventListener('click', function(e) {
                    e.preventDefault();
                    openLoginModal();
                });
            }
        });
    </script>
</body>
</html>