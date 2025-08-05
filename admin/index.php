//admin/index.php
<?php
session_start();
require_once '../config/database.php';

// Check if superadmin is logged in
if (!isset($_SESSION['superadmin_id'])) {
    header('Location: login.php');
    exit;
}

$database = new Database();
$conn = $database->getConnection();

// Get store settings
$stmt = $conn->query("SELECT * FROM store_settings WHERE id = 1");
$settings = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Панель администратора</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/admin.css">
    <link rel="stylesheet" href="css/orders.css">
    <link rel="stylesheet" href="css/import-export.css">
    <link rel="stylesheet" href="css/users.css">
    <link rel="stylesheet" href="css/income.css">
    <link rel="stylesheet" href="css/settings.css">
    <!-- Все стили перенесены в файл css/admin.css -->
</head>
<body>
    <div class="sidebar">
        <h1>Панель управления</h1>
        <div class="nav-item" data-section="settings">
            <i class="fas fa-cog"></i>
            Настройки магазина
        </div>
        <div class="nav-item" data-section="products">
            <i class="fas fa-box"></i>
            Управление товарами
        </div>
        <div class="nav-item" data-section="categories">
            <i class="fas fa-tags"></i>
            Категории
        </div>
        <div class="nav-item" data-section="orders">
            <i class="fas fa-shopping-cart"></i>
            Заказы
        </div>
        <div class="nav-item" data-section="import">
            <i class="fas fa-file-excel"></i>
            Импорт товаров
        </div>
        <div class="nav-item" data-section="users">
            <i class="fas fa-users"></i>
            Пользователи
        </div>
        <!-- Ссылка на раздел баннеров удалена -->
        <div class="nav-item" data-section="income">
            <i class="fas fa-chart-line"></i>
            Доходы
        </div>
        <div class="nav-item" onclick="location.href='logout.php'">
            <i class="fas fa-sign-out-alt"></i>
            Выход
        </div>
    </div>

    <div class="content">
        <!-- Секция настроек -->
        <div id="settings" class="section">
            <h2>Настройки магазина</h2>
            <div class="settings-tabs">
                <div class="tab-buttons">
                    <button class="tab-btn active" data-tab="general">Основные</button>
                    <button class="tab-btn" data-tab="appearance">Внешний вид</button>
                    <button class="tab-btn" data-tab="contacts">Контакты</button>
                    <button class="tab-btn" data-tab="delivery">Доставка</button>
                    <button class="tab-btn" data-tab="seo">SEO</button>
                </div>
                
                <form id="settingsForm" enctype="multipart/form-data">
                    <!-- Основные настройки -->
                    <div class="tab-content active" id="general-tab">
                        <div class="form-group">
                            <label for="storeName">Название магазина</label>
                            <input type="text" id="storeName" name="store_name" value="<?php echo htmlspecialchars($settings['store_name']); ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="logo">Логотип</label>
                            <input type="file" id="logo" name="logo" accept="image/*">
                            <div id="currentLogo" class="current-logo">
                                <?php if ($settings['logo_url']): ?>
                                    <img src="<?php echo htmlspecialchars($settings['logo_url']); ?>" alt="Current logo">
                                <?php else: ?>
                                    <p>Логотип не загружен</p>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Настройки внешнего вида -->
                    <div class="tab-content" id="appearance-tab">
                        <div class="color-settings">
                            <div class="form-group">
                                <label for="primaryColor">Основной цвет</label>
                                <div class="color-picker-container">
                                    <input type="color" id="primaryColor" name="primary_color" value="<?php echo htmlspecialchars($settings['primary_color']); ?>">
                                    <span class="color-value"><?php echo htmlspecialchars($settings['primary_color']); ?></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="secondaryColor">Дополнительный цвет</label>
                                <div class="color-picker-container">
                                    <input type="color" id="secondaryColor" name="secondary_color" value="<?php echo htmlspecialchars($settings['secondary_color']); ?>">
                                    <span class="color-value"><?php echo htmlspecialchars($settings['secondary_color']); ?></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="backgroundColor">Цвет фона</label>
                                <div class="color-picker-container">
                                    <input type="color" id="backgroundColor" name="background_color" value="<?php echo htmlspecialchars($settings['background_color']); ?>">
                                    <span class="color-value"><?php echo htmlspecialchars($settings['background_color']); ?></span>
                                </div>
                            </div>
                        </div>
                        <div class="color-preview">
                            <h3>Предпросмотр</h3>
                            <div class="preview-container" id="colorPreview">
                                <div class="preview-header" style="background-color: <?php echo htmlspecialchars($settings['primary_color']); ?>">
                                    <div class="preview-logo">LOGO</div>
                                    <div class="preview-menu">
                                        <div class="menu-item">Menu 1</div>
                                        <div class="menu-item">Menu 2</div>
                                        <div class="menu-item">Menu 3</div>
                                    </div>
                                </div>
                                <div class="preview-content" style="background-color: <?php echo htmlspecialchars($settings['background_color']); ?>">
                                    <div class="preview-card">
                                        <div class="card-header" style="background-color: <?php echo htmlspecialchars($settings['secondary_color']); ?>">Product</div>
                                        <div class="card-body">Description</div>
                                        <div class="card-footer" style="background-color: <?php echo htmlspecialchars($settings['primary_color']); ?>">Button</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Настройки контактов -->
                    <div class="tab-content" id="contacts-tab">
                        <div class="form-group">
                            <label for="contactEmail">Контактный Email</label>
                            <input type="email" id="contactEmail" name="contact_email" value="<?php echo isset($settings['contact_email']) ? htmlspecialchars($settings['contact_email']) : ''; ?>">
                        </div>
                        <div class="form-group">
                            <label for="contactPhone">Контактный телефон</label>
                            <input type="tel" id="contactPhone" name="contact_phone" value="<?php echo isset($settings['contact_phone']) ? htmlspecialchars($settings['contact_phone']) : ''; ?>">
                        </div>
                        <div class="form-group">
                            <label for="contactAddress">Адрес магазина</label>
                            <textarea id="contactAddress" name="contact_address" rows="3"><?php echo isset($settings['contact_address']) ? htmlspecialchars($settings['contact_address']) : ''; ?></textarea>
                        </div>
                    </div>
                    
                    <!-- Настройки доставки -->
                    <div class="tab-content" id="delivery-tab">
                        <div class="form-group">
                            <label for="deliveryCost">Стоимость доставки (₽)</label>
                            <input type="number" id="deliveryCost" name="delivery_cost" min="0" step="0.01" value="<?php echo isset($settings['delivery_cost']) ? htmlspecialchars($settings['delivery_cost']) : '0.00'; ?>">
                        </div>
                        <div class="form-group">
                            <label for="freeDeliveryThreshold">Минимальная сумма для бесплатной доставки (₽)</label>
                            <input type="number" id="freeDeliveryThreshold" name="free_delivery_threshold" min="0" step="0.01" value="<?php echo isset($settings['free_delivery_threshold']) ? htmlspecialchars($settings['free_delivery_threshold']) : '0.00'; ?>">
                        </div>
                    </div>
                    
                    <!-- SEO настройки -->
                    <div class="tab-content" id="seo-tab">
                        <div class="form-group">
                            <label for="metaDescription">Meta Description</label>
                            <textarea id="metaDescription" name="meta_description" rows="3"><?php echo isset($settings['meta_description']) ? htmlspecialchars($settings['meta_description']) : ''; ?></textarea>
                        </div>
                        <div class="form-group">
                            <label for="metaKeywords">Meta Keywords</label>
                            <input type="text" id="metaKeywords" name="meta_keywords" value="<?php echo isset($settings['meta_keywords']) ? htmlspecialchars($settings['meta_keywords']) : ''; ?>">
                            <small>Указывайте ключевые слова через запятую</small>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">Сохранить настройки</button>
                        <div id="settingsResult"></div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Секция товаров -->
        <div id="products" class="section">
            <h2>Управление товарами</h2>
            <div class="action-buttons">
                <button id="addProductBtn" class="add-button"><i class="fas fa-plus"></i> Добавить товар</button>
            </div>
            <div class="table-container">
                <table id="productsTable" class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Изображение</th>
                            <th>Название</th>
                            <th>Категория</th>
                            <th>Цена</th>
                            <th>Количество</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Данные будут загружены через AJAX -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Секция категорий -->
        <div id="categories" class="section">
            <h2>Управление категориями</h2>
            <div class="action-buttons">
                <button class="add-button" id="addCategoryBtn"><i class="fas fa-plus"></i> Добавить категорию</button>
            </div>
            <div class="table-container">
                <table id="categoriesTable" class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Кол-во товаров</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Данные будут загружены через AJAX -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Секция заказов -->
        <div id="orders" class="section">
            <h2>Управление заказами</h2>
            <div class="order-filters">
                <button class="filter-btn active" data-status="all">Все заказы</button>
                <button class="filter-btn" data-status="new">Новые</button>
                <button class="filter-btn" data-status="processing">В обработке</button>
                <button class="filter-btn" data-status="shipped">Отправленные</button>
                <button class="filter-btn" data-status="delivered">Доставленные</button>
                <button class="filter-btn" data-status="cancelled">Отмененные</button>
            </div>
            <div class="table-container">
                <table id="ordersTable" class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Клиент</th>
                            <th>Дата</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Данные будут загружены через AJAX -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Секция импорта и экспорта товаров -->
        <div id="import" class="section">
            <h2>Импорт и экспорт товаров</h2>
            <div class="export-container">
                <button id="exportBtn" class="export-button"><i class="fas fa-file-export"></i> Экспортировать товары</button>
                <div id="exportResult" class="export-result"></div>
            </div>
            <div class="import-container">
                <div class="import-step">
                    <h3>1. Выберите Excel файл</h3>
                    <input type="file" id="excelFile" accept=".xlsx, .xls" />
                    <p class="import-note">Поддерживаемые форматы: .xlsx, .xls</p>
                </div>
                <div class="import-step">
                    <h3>2. Предпросмотр данных</h3>
                    <div class="preview-container">
                        <table id="previewTable" class="data-table">
                            <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Описание</th>
                                    <th>Цена</th>
                                    <th>Категория</th>
                                    <th>Количество</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Здесь будет предпросмотр данных -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="import-step">
                    <h3>3. Импорт товаров</h3>
                    <button id="importBtn" class="import-button" disabled><i class="fas fa-file-import"></i> Импортировать товары</button>
                    <div id="importResult" class="import-result"></div>
                </div>
            </div>
        </div>

        <!-- Секция пользователей -->
        <div id="users" class="section">
            <h2>Пользователи</h2>
            <div class="user-actions">
                <div class="search-container">
                    <input type="text" id="searchUsersInput" placeholder="Поиск пользователей..." />
                    <i class="fas fa-search search-icon"></i>
                </div>
                <button id="exportUsersBtn" class="export-button"><i class="fas fa-file-export"></i> Экспортировать пользователей</button>
            </div>
            <div id="exportUsersResult" class="export-result"></div>
            <div class="table-container">
                <table id="usersTable" class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Дата регистрации</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Данные будут загружены через AJAX -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Секция баннеров удалена -->

        <!-- Секция доходов -->
        <div id="income" class="section">
            <h2>Анализ доходов</h2>
            
            <!-- Общая статистика -->
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="stat-content">
                        <h3>Всего заказов</h3>
                        <div class="stat-value" id="totalOrders">0</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-ruble-sign"></i></div>
                    <div class="stat-content">
                        <h3>Общий доход</h3>
                        <div class="stat-value" id="totalIncome">0 ₽</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-content">
                        <h3>Средний чек</h3>
                        <div class="stat-value" id="averageOrder">0 ₽</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <h3>Клиентов</h3>
                        <div class="stat-value" id="totalCustomers">0</div>
                    </div>
                </div>
            </div>
            
            <!-- Фильтры по периоду -->
            <div class="period-filter">
                <h3>Выберите период:</h3>
                <div class="filter-buttons">
                    <button class="period-btn active" data-period="week">Неделя</button>
                    <button class="period-btn" data-period="month">Месяц</button>
                    <button class="period-btn" data-period="year">Год</button>
                    <button class="period-btn" data-period="all">Все время</button>
                </div>
                <div class="custom-period">
                    <label for="startDate">От:</label>
                    <input type="date" id="startDate">
                    <label for="endDate">До:</label>
                    <input type="date" id="endDate">
                    <button id="applyCustomPeriod">Применить</button>
                </div>
            </div>
            
            <!-- Графики -->
            <div class="charts-container">
                <div class="chart-card">
                    <h3>Доходы по дням</h3>
                    <canvas id="incomeChart"></canvas>
                </div>
                
                <div class="chart-card">
                    <h3>Топ-5 категорий по продажам</h3>
                    <canvas id="categoriesChart"></canvas>
                </div>
            </div>
            
            <!-- Таблица последних заказов -->
            <div class="recent-orders">
                <h3>Последние заказы</h3>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Клиент</th>
                                <th>Дата</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody id="recentOrdersTable">
                            <!-- Данные будут загружены через AJAX -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Модальное окно для просмотра товаров в категории -->
    <div id="categoryProductsModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="categoryProductsModalTitle">Товары в категории</h2>
            <div id="categoryProductsActions" class="action-buttons">
                <!-- Здесь будет кнопка для добавления товара в категорию -->
            </div>
            <div class="table-container">
                <table id="categoryProductsTable" class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Изображение</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Количество</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Данные будут загружены через AJAX -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <!-- Модальное окно для баннеров -->
    <div id="bannerModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="bannerModalTitle">Добавить баннер</h2>
            <form id="bannerForm" enctype="multipart/form-data">
                <input type="hidden" id="bannerId" name="id">
                <div class="form-group">
                    <label for="bannerTitle">Заголовок</label>
                    <input type="text" id="bannerTitle" name="title" placeholder="Введите заголовок баннера">
                </div>
                <div class="form-group">
                    <label for="bannerSubtitle">Подзаголовок</label>
                    <input type="text" id="bannerSubtitle" name="subtitle" placeholder="Введите подзаголовок баннера">
                </div>
                <div class="form-group">
                    <label for="bannerLink">Ссылка</label>
                    <input type="text" id="bannerLink" name="link" placeholder="Введите ссылку для баннера">
                </div>
                <div class="form-group">
                    <label for="bannerImage">Изображение</label>
                    <input type="file" id="bannerImage" name="image" accept="image/*">
                    <div id="currentBannerImageContainer" style="display: none; margin-top: 10px;">
                        <p>Текущее изображение:</p>
                        <img id="currentBannerImage" src="" alt="Текущее изображение" style="max-width: 200px;">
                    </div>
                </div>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="bannerIsActive" name="is_active">
                    <label for="bannerIsActive">Активен</label>
                </div>
                <button type="submit" class="submit-btn">Сохранить</button>
            </form>
        </div>
    </div>

    <!-- Модальное окно для категорий -->
    <div id="categoryModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="categoryModalTitle">Добавить категорию</h2>
            <form id="categoryForm">
                <input type="hidden" id="categoryId" name="id">
                <div class="form-group">
                    <label for="categoryName">Название категории</label>
                    <input type="text" id="categoryName" name="name" placeholder="Введите название категории" required>
                </div>
                <!-- Поле для иконки временно убрано -->
                <button type="submit" class="submit-btn">Сохранить</button>
            </form>
        </div>
    </div>

    <!-- Модальное окно для товаров -->
    <div id="productModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="productModalTitle">Добавить товар</h2>
            <form id="productForm" enctype="multipart/form-data">
                <input type="hidden" id="productId" name="id">
                <div class="form-group">
                    <label for="productName">Название товара</label>
                    <input type="text" id="productName" name="name" placeholder="Введите название товара" required>
                </div>
                <div class="form-group">
                    <label for="productDescription">Описание</label>
                    <textarea id="productDescription" name="description" placeholder="Введите описание товара"></textarea>
                </div>
                <div class="form-group">
                    <label for="productSpecifications">Характеристики</label>
                    <textarea id="productSpecifications" name="specifications" placeholder="Введите характеристики товара (например: Рабочее напряжение: 3.3-5В; Диапазон температур: -40...85°C)"></textarea>
                </div>
                <div class="form-group">
                    <label for="productCategory">Категория</label>
                    <select id="productCategory" name="category_id" required>
                        <!-- Категории будут загружены через AJAX -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="productPrice">Цена</label>
                    <input type="number" id="productPrice" name="price" min="0" step="0.01" placeholder="Введите цену" required>
                </div>
                <div class="form-group">
                    <label for="productQuantity">Количество на складе</label>
                    <input type="number" id="productQuantity" name="quantity" min="0" placeholder="Введите количество" required>
                </div>
                <div class="form-group">
                    <label for="productImage">Изображение</label>
                    <div class="image-input-options">
                        <div class="input-option">
                            <input type="radio" id="uploadImageOption" name="imageOption" value="upload" checked>
                            <label for="uploadImageOption">Загрузить файл</label>
                        </div>
                        <div class="input-option">
                            <input type="radio" id="urlImageOption" name="imageOption" value="url">
                            <label for="urlImageOption">Указать ссылку</label>
                        </div>
                    </div>
                    
                    <div id="uploadImageContainer">
                        <input type="file" id="productImage" name="image" accept="image/*">
                    </div>
                    
                    <div id="urlImageContainer" style="display: none;">
                        <input type="text" id="imageUrl" name="image_url" placeholder="Введите URL изображения">
                    </div>
                    
                    <div id="currentImageContainer" style="display: none; margin-top: 10px;">
                        <p>Текущее изображение:</p>
                        <img id="currentProductImage" src="" alt="Текущее изображение" style="max-width: 200px;">
                    </div>
                </div>
                <button type="submit" class="submit-btn">Сохранить</button>
            </form>
        </div>
    </div>

    <!-- Модальное окно для деталей заказа -->
    <div id="orderDetailsModal" class="modal">
        <div class="modal-content large-modal">
            <span class="close">&times;</span>
            <h2>Детали заказа #<span id="orderDetailsId"></span></h2>
            <div class="order-details-container">
                <div class="order-info">
                    <h3>Информация о заказе</h3>
                    <p><strong>Дата:</strong> <span id="orderDetailsDate"></span></p>
                    <p><strong>Статус:</strong> <span id="orderDetailsStatus"></span></p>
                    <p><strong>Сумма:</strong> <span id="orderDetailsTotal"></span> ₽</p>
                    <p><strong>Количество товаров:</strong> <span id="orderDetailsTotalItems"></span></p>
                </div>
                <div class="customer-info">
                    <h3>Информация о клиенте</h3>
                    <p><strong>Имя:</strong> <span id="orderDetailsCustomerName"></span></p>
                    <p><strong>Email:</strong> <span id="orderDetailsCustomerEmail"></span></p>
                    <p><strong>Телефон:</strong> <span id="orderDetailsCustomerPhone"></span></p>
                    <p><strong>Адрес:</strong> <span id="orderDetailsCustomerAddress"></span></p>
                </div>
                <div class="order-items">
                    <h3>Товары в заказе</h3>
                    <table class="data-table" id="orderItemsTable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Фото</th>
                                <th>Название</th>
                                <th>Цена</th>
                                <th>Количество</th>
                                <th>Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Список товаров будет загружен через AJAX -->
                        </tbody>
                    </table>
                </div>
                <div class="order-actions" id="orderStatusButtons">
                    <!-- Кнопки для изменения статуса будут добавлены динамически -->
                </div>
            </div>
        </div>
    </div>

    <!-- Модальное окно для просмотра деталей пользователя -->
    <div id="userDetailsModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Информация о пользователе #<span id="userDetailsId"></span></h2>
            <div class="user-details-container">
                <div class="user-avatar">
                    <img id="userDetailsAvatar" src="/assets/img/default-avatar.png" alt="Аватар пользователя">
                </div>
                <div class="user-info">
                    <h3>Личные данные</h3>
                    <p><strong>Имя:</strong> <span id="userDetailsName"></span></p>
                    <p><strong>Email:</strong> <span id="userDetailsEmail"></span></p>
                    <p><strong>Телефон:</strong> <span id="userDetailsPhone"></span></p>
                    <p><strong>Дата регистрации:</strong> <span id="userDetailsCreated"></span></p>
                </div>
                <div class="user-info">
                    <h3>Дополнительная информация</h3>
                    <p><strong>Баланс:</strong> <span id="userDetailsBalance"></span></p>
                    <p><strong>Адрес:</strong> <span id="userDetailsAddress"></span></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Модальное окно для просмотра заказов пользователя -->
    <div id="userOrdersModal" class="modal">
        <div class="modal-content large-modal">
            <span class="close">&times;</span>
            <h2 id="userOrdersTitle">Заказы пользователя</h2>
            <div class="user-orders-container">
                <table id="userOrdersTable" class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Дата</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Заказы будут загружены через AJAX -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Модальное окно для изменения статуса заказа -->
    <div id="changeStatusModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Изменить статус заказа</h2>
            <form id="changeStatusForm">
                <input type="hidden" id="changeStatusOrderId">
                <div class="form-group">
                    <label for="changeStatusSelect">Новый статус</label>
                    <select id="changeStatusSelect" required>
                        <option value="pending">Новый</option>
                        <option value="processing">В обработке</option>
                        <option value="shipped">Отправлен</option>
                        <option value="delivered">Доставлен</option>
                        <option value="cancelled">Отменен</option>
                    </select>
                </div>
                <button type="submit" class="submit-btn">Сохранить</button>
            </form>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="/assets/js/payment.js"></script>
    <script src="js/admin.js"></script>
    <script src="js/product-functions.js"></script>
    <script src="js/product-form.js"></script>
    <script src="js/image-upload.js"></script>
    <script src="js/category-functions.js"></script>
    <script src="js/order-functions.js"></script>
    <script src="js/import-export.js"></script>
    <script src="js/user-functions.js"></script>
    <script src="js/income-functions.js"></script>
    <script src="js/settings.js"></script>
    <script>
        $(document).ready(function() {
            // Показываем первую секцию по умолчанию
            $('.section:first').addClass('active');
            
            // Загрузка заказов при загрузке страницы
            loadOrders('all');
            
            // Загрузка товаров при загрузке страницы
            loadProducts();
            
            // Загрузка категорий при загрузке страницы
            loadCategories();
            
            // Загрузка пользователей при загрузке страницы
            loadUsers();

            // Обработка клика по пунктам меню
            $('.nav-item').click(function() {
                const section = $(this).data('section');
                $('.section').removeClass('active');
                $(`#${section}`).addClass('active');
            });

            // Загрузка данных о доходах при загрузке страницы
            if ($('#income').length) {
                loadIncomeData('week');
            }
        });
    </script>
</body>
</html>
