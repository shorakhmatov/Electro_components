<?php
// Параметры подключения к базе данных
define('DB_HOST', 'localhost');     // Хост базы данных
define('DB_USER', 'root');         // Имя пользователя
define('DB_PASS', 'daler2003');             // Пароль (пустой для локальной разработки)
define('DB_NAME', 'electronic_store'); // Имя базы данных

// Функция для создания подключения к базе данных
function getConnection() {
    static $conn = null;
    
    if ($conn === null) {
        try {
            $conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                ]
            );
        } catch (PDOException $e) {
            error_log("Database Connection Error: " . $e->getMessage());
            die("Ошибка подключения к базе данных");
        }
    }
    
    return $conn;
}

// Функция для безопасного выполнения SQL запросов
function executeQuery($sql, $params = []) {
    try {
        $conn = getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        error_log("Database Query Error: " . $e->getMessage());
        throw new Exception("Ошибка выполнения запроса");
    }
}
