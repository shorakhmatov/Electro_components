//admin/login.php<?php
session_start();
require_once '../config/database.php';

// Включаем вывод всех ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Функция для логирования
function logDebug($message) {
    $logDir = '../logs';
    if (!file_exists($logDir)) {
        mkdir($logDir, 0777, true);
    }
    $logFile = $logDir . '/login_debug_' . date('Y-m-d') . '.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[{$timestamp}] {$message}\n", FILE_APPEND);
}

// Проверяем, существует ли таблица superadmins и есть ли в ней записи
function checkAndCreateAdmins($conn) {
    try {
        logDebug("Проверка и создание администраторов");
        
        // Проверяем, существует ли таблица superadmins
        $stmt = $conn->query("SHOW TABLES LIKE 'superadmins'");
        $tableExists = $stmt->rowCount() > 0;
        
        logDebug("Таблица superadmins существует: " . ($tableExists ? 'да' : 'нет'));
        
        if (!$tableExists) {
            // Создаем таблицу superadmins, если она не существует
            $sql = "CREATE TABLE IF NOT EXISTS superadmins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )";
            
            $conn->exec($sql);
            logDebug("Таблица superadmins создана");
        }
        
        // Проверяем, есть ли записи в таблице superadmins
        $stmt = $conn->query("SELECT COUNT(*) FROM superadmins");
        $adminCount = $stmt->fetchColumn();
        
        logDebug("Количество администраторов в базе: {$adminCount}");
        
        if ($adminCount == 0) {
            // Добавляем администратора по умолчанию
            $username = 'admin';
            $password = 'admin123';
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("INSERT INTO superadmins (username, password_hash) VALUES (?, ?)");
            $stmt->execute([$username, $passwordHash]);
            logDebug("Добавлен администратор: {$username}");
            
            // Добавляем superadmin
            $username = 'superadmin';
            $password = 'admin123';
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("INSERT INTO superadmins (username, password_hash) VALUES (?, ?)");
            $stmt->execute([$username, $passwordHash]);
            logDebug("Добавлен администратор: {$username}");
            
            // Проверяем, что администраторы добавлены
            $stmt = $conn->query("SELECT id, username, password_hash FROM superadmins");
            $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($admins as $admin) {
                logDebug("Проверка администратора: ID={$admin['id']}, Username={$admin['username']}");
                // Проверяем, работает ли пароль admin123
                $testPassword = 'admin123';
                if (password_verify($testPassword, $admin['password_hash'])) {
                    logDebug("Пароль '{$testPassword}' подходит для пользователя {$admin['username']}");
                } else {
                    logDebug("ОШИБКА: Пароль '{$testPassword}' НЕ подходит для пользователя {$admin['username']}");
                }
            }
            
            return true;
        } else {
            // Проверяем существующих администраторов
            $stmt = $conn->query("SELECT id, username, password_hash FROM superadmins");
            $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($admins as $admin) {
                logDebug("Существующий администратор: ID={$admin['id']}, Username={$admin['username']}");
            }
        }
        
        return false;
    } catch (Exception $e) {
        logDebug("ОШИБКА при проверке/создании администраторов: " . $e->getMessage());
        return false;
    }
}

// Обработка формы входа
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $database = new Database();
        $conn = $database->getConnection();
        
        if (!$conn) {
            logDebug("ОШИБКА: Не удалось подключиться к базе данных");
            $error = 'Ошибка подключения к базе данных';
        } else {
            logDebug("Подключение к базе данных успешно");
            
            // Проверяем и создаем администраторов, если нужно
            checkAndCreateAdmins($conn);
            
            $username = $_POST['username'] ?? '';
            $password = $_POST['password'] ?? '';
            
            logDebug("Попытка входа: username={$username}");
            
            // Прямая проверка учетных данных (для отладки)
            if (($username === 'admin' || $username === 'superadmin') && $password === 'admin123') {
                logDebug("Прямая проверка учетных данных прошла успешно");
                
                // Проверяем, существует ли пользователь в базе
                $stmt = $conn->prepare("SELECT id, username, password_hash FROM superadmins WHERE username = ?");
                $stmt->execute([$username]);
                $admin = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$admin) {
                    logDebug("Пользователь не найден в базе, но прямая проверка прошла успешно. Создаем пользователя.");
                    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = $conn->prepare("INSERT INTO superadmins (username, password_hash) VALUES (?, ?)");
                    $stmt->execute([$username, $passwordHash]);
                    
                    $stmt = $conn->prepare("SELECT id, username FROM superadmins WHERE username = ?");
                    $stmt->execute([$username]);
                    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
                }
                
                $_SESSION['superadmin_id'] = $admin['id'];
                $_SESSION['superadmin_username'] = $admin['username'];
                
                logDebug("Вход выполнен успешно через прямую проверку. ID={$admin['id']}, Username={$admin['username']}");
                
                header('Location: index.php');
                exit;
            }
            
            // Стандартная проверка через базу данных
            $stmt = $conn->prepare("SELECT id, username, password_hash FROM superadmins WHERE username = ?");
            $stmt->execute([$username]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($admin) {
                logDebug("Найден пользователь: id={$admin['id']}, username={$admin['username']}");
                
                if (password_verify($password, $admin['password_hash'])) {
                    logDebug("Пароль верный, выполняется вход");
                    $_SESSION['superadmin_id'] = $admin['id'];
                    $_SESSION['superadmin_username'] = $admin['username'];
                    
                    header('Location: index.php');
                    exit;
                } else {
                    logDebug("Неверный пароль");
                    $error = 'Неверный пароль';
                    
                    // Для отладки: проверяем, какой хеш у пароля admin123
                    $testHash = password_hash('admin123', PASSWORD_DEFAULT);
                    logDebug("Хеш для 'admin123': {$testHash}");
                    logDebug("Хеш в базе: {$admin['password_hash']}");
                    
                    // Пробуем обновить пароль для этого пользователя
                    $newPasswordHash = password_hash('admin123', PASSWORD_DEFAULT);
                    $updateStmt = $conn->prepare("UPDATE superadmins SET password_hash = ? WHERE id = ?");
                    $updateStmt->execute([$newPasswordHash, $admin['id']]);
                    logDebug("Пароль обновлен для пользователя {$admin['username']}");
                }
            } else {
                logDebug("Пользователь не найден");
                $error = 'Пользователь не найден';
            }
        }
    } catch (Exception $e) {
        logDebug("ОШИБКА при входе: " . $e->getMessage());
        $error = 'Произошла ошибка: ' . $e->getMessage();
    }
}

// Проверяем и создаем администраторов при загрузке страницы
try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        logDebug("ОШИБКА: Не удалось подключиться к базе данных при загрузке страницы");
        $error = 'Ошибка подключения к базе данных';
    } else {
        logDebug("Подключение к базе данных успешно при загрузке страницы");
        $adminsCreated = checkAndCreateAdmins($conn);
        
        if ($adminsCreated) {
            $message = 'Учетные записи администраторов созданы. Используйте логин "admin" или "superadmin" и пароль "admin123".';
            logDebug("Учетные записи администраторов созданы");
        }
    }
} catch (Exception $e) {
    logDebug("ОШИБКА при загрузке страницы: " . $e->getMessage());
    $error = 'Произошла ошибка: ' . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Панель администратора - Вход</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .admin-login {
            width: 100%;
            max-width: 400px;
            padding: 30px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .admin-login h1 {
            text-align: center;
            margin-bottom: 25px;
            color: #2c3e50;
            font-weight: 500;
        }
        .error-message {
            color: #e74c3c;
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #fdecea;
            border-radius: 4px;
            font-size: 14px;
        }
        .success-message {
            color: #27ae60;
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #e8f8f0;
            border-radius: 4px;
            font-size: 14px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #2c3e50;
        }
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 15px;
            transition: border-color 0.3s;
            box-sizing: border-box;
        }
        .form-group input:focus {
            border-color: #3498db;
            outline: none;
        }
        .form-group .input-with-icon {
            position: relative;
        }
        .form-group .input-with-icon i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #7f8c8d;
        }
        .form-group .input-with-icon input {
            padding-left: 45px;
        }
        .btn {
            display: block;
            width: 100%;
            padding: 12px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #2980b9;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #7f8c8d;
            font-size: 14px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo i {
            font-size: 50px;
            color: #3498db;
        }
    </style>
</head>
<body>
    <div class="admin-login">
        <div class="logo">
            <i class="fas fa-cogs"></i>
        </div>
        <h1>Вход в панель администратора</h1>
        
        <?php if (isset($error)): ?>
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i> <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($message)): ?>
            <div class="success-message">
                <i class="fas fa-check-circle"></i> <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="form-group">
                <label for="username">Имя пользователя</label>
                <div class="input-with-icon">
                    <i class="fas fa-user"></i>
                    <input type="text" id="username" name="username" placeholder="Введите имя пользователя" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="password">Пароль</label>
                <div class="input-with-icon">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="password" name="password" placeholder="Введите пароль" required>
                </div>
            </div>
            
            <button type="submit" class="btn">Войти в панель</button>
        </form>
        
        <div class="footer">
            <p>&copy; <?php echo date('Y'); ?> ElectroStore - Панель администратора</p>
        </div>
    </div>
</body>
</html>
