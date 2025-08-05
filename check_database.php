<?php
// Скрипт для проверки подключения к базе данных
require_once 'config/database.php';

// Функция для вывода сообщений
function output($message, $type = 'info') {
    $color = 'black';
    if ($type === 'success') $color = 'green';
    if ($type === 'error') $color = 'red';
    if ($type === 'warning') $color = 'orange';
    
    echo "<div style='color: {$color}; margin: 5px 0;'>{$message}</div>";
}

try {
    // Подключение к базе данных
    $database = new Database();
    $conn = $database->getConnection();
    
    output("✅ Подключение к базе данных успешно установлено.", 'success');
    
    // Получаем информацию о базе данных
    $stmt = $conn->query("SELECT DATABASE() as db_name");
    $dbInfo = $stmt->fetch(PDO::FETCH_ASSOC);
    output("📊 Текущая база данных: " . $dbInfo['db_name']);
    
    // Проверяем таблицы
    $tables = [
        'superadmins', 'users', 'categories', 'products', 
        'orders', 'order_items', 'store_settings'
    ];
    
    output("📋 Проверка таблиц:");
    foreach ($tables as $table) {
        $stmt = $conn->query("SHOW TABLES LIKE '{$table}'");
        $exists = $stmt->rowCount() > 0;
        
        if ($exists) {
            // Получаем количество записей в таблице
            $stmt = $conn->query("SELECT COUNT(*) as count FROM {$table}");
            $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            output("✅ Таблица '{$table}' существует. Записей: {$count}", 'success');
            
            // Проверяем администраторов, если это таблица superadmins
            if ($table === 'superadmins' && $count > 0) {
                $stmt = $conn->query("SELECT id, username, password_hash FROM superadmins");
                $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                output("👤 Администраторы в системе:");
                foreach ($admins as $admin) {
                    output("ID: {$admin['id']}, Логин: {$admin['username']}, Хеш пароля: " . substr($admin['password_hash'], 0, 20) . "...");
                    
                    // Проверяем, работает ли пароль admin123
                    $testPassword = 'admin123';
                    if (password_verify($testPassword, $admin['password_hash'])) {
                        output("✅ Пароль '{$testPassword}' подходит для пользователя {$admin['username']}", 'success');
                    } else {
                        output("❌ Пароль '{$testPassword}' НЕ подходит для пользователя {$admin['username']}", 'error');
                    }
                }
            }
        } else {
            output("❌ Таблица '{$table}' не существует", 'error');
        }
    }
    
    // Проверяем настройки PDO
    output("📊 Настройки PDO:");
    $attributes = [
        PDO::ATTR_ERRMODE => 'Режим ошибок',
        PDO::ATTR_DEFAULT_FETCH_MODE => 'Режим выборки по умолчанию',
        PDO::ATTR_EMULATE_PREPARES => 'Эмуляция подготовленных запросов'
    ];
    
    foreach ($attributes as $attr => $name) {
        try {
            $value = $conn->getAttribute($attr);
            output("{$name}: " . var_export($value, true));
        } catch (Exception $e) {
            output("Не удалось получить {$name}", 'warning');
        }
    }
    
} catch (PDOException $e) {
    output("❌ Ошибка подключения к базе данных: " . $e->getMessage(), 'error');
    
    // Проверяем конфигурацию базы данных
    $configFile = 'config/database.php';
    if (file_exists($configFile)) {
        output("📋 Проверка файла конфигурации базы данных:");
        $configContent = file_get_contents($configFile);
        
        // Ищем параметры подключения, но скрываем пароль
        preg_match('/private \$host = ["\'](.+?)["\']/i', $configContent, $hostMatches);
        preg_match('/private \$db_name = ["\'](.+?)["\']/i', $configContent, $dbNameMatches);
        preg_match('/private \$username = ["\'](.+?)["\']/i', $configContent, $usernameMatches);
        
        if (!empty($hostMatches)) {
            output("Хост: " . $hostMatches[1]);
        }
        if (!empty($dbNameMatches)) {
            output("База данных: " . $dbNameMatches[1]);
        }
        if (!empty($usernameMatches)) {
            output("Пользователь: " . $usernameMatches[1]);
        }
        
        output("Пароль: *****");
    } else {
        output("❌ Файл конфигурации базы данных не найден", 'error');
    }
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Проверка подключения к базе данных</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2196F3;
        }
        .actions {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .button {
            display: inline-block;
            padding: 10px 15px;
            background-color: #2196F3;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .button:hover {
            background-color: #1976D2;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Проверка подключения к базе данных</h1>
        <!-- PHP скрипт выведет результаты выше -->
        
        <div class="actions">
            <h2>Действия</h2>
            <a href="fix_admin_password.php" class="button">Исправить пароли администраторов</a>
            <a href="add_admin.php" class="button">Добавить администраторов</a>
            <a href="admin/login.php" class="button">Перейти на страницу входа</a>
        </div>
    </div>
</body>
</html>
