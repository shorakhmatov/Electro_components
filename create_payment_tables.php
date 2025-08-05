<?php
// Подключение к базе данных
require_once 'config/database.php';

// Создание подключения к базе данных
$database = new Database();
$db = $database->getConnection();

// Чтение SQL-файла
$sql = file_get_contents('database/payment_methods.sql');

// Выполнение SQL-запросов
try {
    $result = $db->exec($sql);
    echo "Таблицы для платежных методов успешно созданы!";
} catch (PDOException $e) {
    echo "Ошибка при создании таблиц: " . $e->getMessage();
}
?>
