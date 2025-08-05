<?php
$host = 'localhost';
$username = 'root';
$password = 'daler2003';
$database = 'electronic_store';

try {
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Читаем SQL файл
    $sql = file_get_contents(__DIR__ . '/schema.sql');
    
    // Выполняем SQL
    $pdo->exec($sql);
    
    echo "База данных успешно инициализирована\n";
    
} catch(PDOException $e) {
    echo "Ошибка: " . $e->getMessage() . "\n";
}
?>
