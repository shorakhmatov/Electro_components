<?php
// Скрипт для исправления паролей администраторов
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
    
    // Проверяем, существует ли таблица superadmins
    $stmt = $conn->query("SHOW TABLES LIKE 'superadmins'");
    $tableExists = $stmt->rowCount() > 0;
    
    if (!$tableExists) {
        // Создаем таблицу superadmins, если она не существует
        $sql = "CREATE TABLE IF NOT EXISTS superadmins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        $conn->exec($sql);
        output("✅ Таблица superadmins успешно создана.", 'success');
    }
    
    // Проверяем, есть ли администраторы в таблице
    $stmt = $conn->query("SELECT COUNT(*) FROM superadmins");
    $adminCount = $stmt->fetchColumn();
    
    // Удаляем существующих администраторов, если они есть
    if ($adminCount > 0) {
        $stmt = $conn->query("SELECT id, username FROM superadmins");
        $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        output("🔄 Существующие администраторы:");
        foreach ($admins as $admin) {
            output("ID: {$admin['id']}, Логин: {$admin['username']}");
        }
        
        // Спрашиваем пользователя, хочет ли он сбросить пароли
        if (isset($_POST['reset_passwords'])) {
            $conn->exec("DELETE FROM superadmins WHERE username IN ('admin', 'superadmin')");
            output("✅ Существующие администраторы удалены.", 'success');
            $adminCount = 0;
        } else {
            output("⚠️ Администраторы уже существуют. Нажмите кнопку ниже, чтобы сбросить их пароли.", 'warning');
            ?>
            <form method="post">
                <button type="submit" name="reset_passwords" style="padding: 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 10px 0;">Сбросить пароли администраторов</button>
            </form>
            <?php
        }
    }
    
    // Добавляем новых администраторов, если их нет или пользователь сбросил пароли
    if ($adminCount == 0) {
        // Добавляем администратора
        $username = 'admin';
        $password = 'admin123';
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO superadmins (username, password_hash) VALUES (?, ?)");
        $stmt->execute([$username, $passwordHash]);
        
        output("✅ Администратор успешно добавлен:", 'success');
        output("Логин: admin");
        output("Пароль: admin123");
        
        // Добавляем superadmin
        $username = 'superadmin';
        $password = 'admin123';
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO superadmins (username, password_hash) VALUES (?, ?)");
        $stmt->execute([$username, $passwordHash]);
        
        output("✅ Администратор успешно добавлен:", 'success');
        output("Логин: superadmin");
        output("Пароль: admin123");
        
        // Проверяем, что администраторы добавлены
        $stmt = $conn->query("SELECT id, username, password_hash FROM superadmins");
        $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        output("👤 Проверка добавленных администраторов:");
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
    
    // Проверяем, существует ли запись в таблице store_settings
    $stmt = $conn->query("SHOW TABLES LIKE 'store_settings'");
    $tableExists = $stmt->rowCount() > 0;
    
    if (!$tableExists) {
        // Создаем таблицу store_settings, если она не существует
        $sql = "CREATE TABLE IF NOT EXISTS store_settings (
            id INT PRIMARY KEY DEFAULT 1,
            store_name VARCHAR(100) NOT NULL DEFAULT 'ElectroStore',
            logo_url VARCHAR(255),
            primary_color VARCHAR(7) DEFAULT '#2196F3',
            secondary_color VARCHAR(7) DEFAULT '#FFC107',
            background_color VARCHAR(7) DEFAULT '#f5f5f5',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        
        $conn->exec($sql);
        output("✅ Таблица store_settings успешно создана.", 'success');
    }
    
    // Проверяем, есть ли запись в таблице store_settings
    $stmt = $conn->query("SELECT COUNT(*) FROM store_settings");
    $settingsCount = $stmt->fetchColumn();
    
    if ($settingsCount == 0) {
        // Добавляем настройки магазина
        $sql = "INSERT INTO store_settings (store_name, primary_color, secondary_color, background_color) 
                VALUES ('ElectroStore', '#2196F3', '#FFC107', '#f5f5f5')";
        $conn->exec($sql);
        
        output("✅ Настройки магазина успешно добавлены.", 'success');
    }
    
    output("<br><strong>✅ Теперь вы можете войти в <a href='admin/login.php' style='color: #2196F3;'>панель администратора</a> используя созданные учетные данные.</strong>", 'success');
    
} catch (PDOException $e) {
    output("❌ Ошибка: " . $e->getMessage(), 'error');
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Исправление паролей администраторов</title>
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
        <h1>Исправление паролей администраторов</h1>
        <!-- PHP скрипт выведет результаты выше -->
        
        <div class="actions">
            <h2>Действия</h2>
            <a href="check_database.php" class="button">Проверить подключение к базе данных</a>
            <a href="admin/login.php" class="button">Перейти на страницу входа</a>
            <a href="index.php" class="button">Вернуться на главную</a>
        </div>
    </div>
</body>
</html>
