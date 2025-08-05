<?php
// Подключение к базе данных
require_once 'config/database.php';

// Создание подключения к базе данных
$database = new Database();
$db = $database->getConnection();

// Чтение SQL-файла
$sql = file_get_contents('database/delivery_addresses.sql');

// Выполнение SQL-запросов
try {
    $result = $db->exec($sql);
    echo "Таблица для адресов доставки успешно создана!";
} catch (PDOException $e) {
    echo "Ошибка при создании таблицы: " . $e->getMessage();
}
?>
