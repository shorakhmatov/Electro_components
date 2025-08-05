<?php
// Скрипт для добавления администраторов в базу данных
require_once 'config/database.php';

// Функция для вывода сообщений
function output($message) {
    echo $message . "<br>";
}

try {
    // Подключение к базе данных
    $database = new Database();
    $conn = $database->getConnection();
    
    output("Подключение к базе данных успешно установлено.");
    
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
        output("Таблица superadmins успешно создана.");
    }
    
    // Проверяем, есть ли уже администратор с логином admin
    $stmt = $conn->prepare("SELECT id FROM superadmins WHERE username = ?");
    $stmt->execute(['admin']);
    $adminExists = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($adminExists) {
        output("Администратор с логином 'admin' уже существует.");
    } else {
        // Добавляем администратора
        $username = 'admin';
        $password = 'admin123';
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO superadmins (username, password_hash) VALUES (?, ?)");
        $stmt->execute([$username, $passwordHash]);
        
        output("Администратор успешно добавлен:");
        output("Логин: admin");
        output("Пароль: admin123");
    }
    
    // Проверяем, есть ли уже администратор с логином superadmin
    $stmt = $conn->prepare("SELECT id FROM superadmins WHERE username = ?");
    $stmt->execute(['superadmin']);
    $superadminExists = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($superadminExists) {
        output("Администратор с логином 'superadmin' уже существует.");
    } else {
        // Добавляем superadmin
        $username = 'superadmin';
        $password = 'admin123';
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO superadmins (username, password_hash) VALUES (?, ?)");
        $stmt->execute([$username, $passwordHash]);
        
        output("Администратор успешно добавлен:");
        output("Логин: superadmin");
        output("Пароль: admin123");
    }
    
    // Проверяем, существует ли запись в таблице store_settings
    $stmt = $conn->query("SELECT COUNT(*) FROM store_settings");
    $settingsCount = $stmt->fetchColumn();
    
    if ($settingsCount == 0) {
        // Добавляем настройки магазина
        $sql = "INSERT INTO store_settings (store_name, primary_color, secondary_color, background_color) 
                VALUES ('ElectroStore', '#2196F3', '#FFC107', '#f5f5f5')";
        $conn->exec($sql);
        
        output("Настройки магазина успешно добавлены.");
    } else {
        output("Настройки магазина уже существуют.");
    }
    
    output("<br><strong>Теперь вы можете войти в <a href='admin/login.php'>панель администратора</a> используя созданные учетные данные.</strong>");
    
} catch (PDOException $e) {
    output("Ошибка: " . $e->getMessage());
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
        a {
            color: #2196F3;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Добавление администраторов</h1>
        <!-- PHP скрипт выведет результаты выше -->
    </div>
</body>
</html>
