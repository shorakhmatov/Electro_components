<?php
// Скрипт для прямого добавления администраторов в базу данных
require_once 'config/database.php';

// Включаем вывод всех ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    
    if (!$conn) {
        output("❌ Не удалось подключиться к базе данных", 'error');
        die();
    }
    
    output("✅ Подключение к базе данных успешно установлено", 'success');
    
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
        output("✅ Таблица superadmins успешно создана", 'success');
    } else {
        output("✅ Таблица superadmins уже существует", 'success');
    }
    
    // Удаляем существующих администраторов с логинами admin и superadmin
    $stmt = $conn->prepare("DELETE FROM superadmins WHERE username IN (?, ?)");
    $stmt->execute(['admin', 'superadmin']);
    $deletedCount = $stmt->rowCount();
    
    if ($deletedCount > 0) {
        output("🔄 Удалено {$deletedCount} существующих администраторов", 'warning');
    }
    
    // Добавляем администратора
    $username = 'admin';
    $password = 'admin123';
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO superadmins (username, password_hash) VALUES (?, ?)");
    $stmt->execute([$username, $passwordHash]);
    
    output("✅ Администратор успешно добавлен:", 'success');
    output("Логин: admin");
    output("Пароль: admin123");
    output("Хеш пароля: " . substr($passwordHash, 0, 20) . "...");
    
    // Добавляем superadmin
    $username = 'superadmin';
    $password = 'admin123';
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO superadmins (username, password_hash) VALUES (?, ?)");
    $stmt->execute([$username, $passwordHash]);
    
    output("✅ Администратор успешно добавлен:", 'success');
    output("Логин: superadmin");
    output("Пароль: admin123");
    output("Хеш пароля: " . substr($passwordHash, 0, 20) . "...");
    
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
    
    output("<br><strong>✅ Теперь вы можете войти в <a href='admin/login.php' style='color: #2196F3;'>панель администратора</a> используя созданные учетные данные.</strong>", 'success');
    
} catch (PDOException $e) {
    output("❌ Ошибка базы данных: " . $e->getMessage(), 'error');
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Добавление администраторов</title>
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
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            font-family: Consolas, Monaco, 'Andale Mono', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Добавление администраторов</h1>
        <!-- PHP скрипт выведет результаты выше -->
        
        <div class="actions">
            <h2>SQL-запрос для ручного добавления</h2>
            <p>Если вы хотите добавить администраторов вручную через SQL, используйте следующий запрос:</p>
            
            <pre><code>-- Удаляем существующих администраторов, чтобы избежать дубликатов
DELETE FROM superadmins WHERE username IN ('admin', 'superadmin');

-- Добавляем администраторов с захешированными паролями
INSERT INTO superadmins (username, password_hash) VALUES 
('admin', '<?php echo $passwordHash; ?>'),
('superadmin', '<?php echo $passwordHash; ?>');</code></pre>
            
            <h2>Действия</h2>
            <a href="check_database.php" class="button">Проверить подключение к базе данных</a>
            <a href="fix_admin_password.php" class="button">Исправить пароли администраторов</a>
            <a href="admin/login.php" class="button">Перейти на страницу входа</a>
            <a href="index.php" class="button">Вернуться на главную</a>
        </div>
    </div>
</body>
</html>
