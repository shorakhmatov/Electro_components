<?php
// Database credentials
$host = 'localhost';
$username = 'root';
$password = 'daler2003';

try {
    // Create database
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Read and execute create database SQL
    $sql = file_get_contents(__DIR__ . '/create_database.sql');
    $pdo->exec($sql);
    
    // Connect to the new database
    $pdo = new PDO("mysql:host=$host;dbname=electronic_store", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Read and execute create tables SQL
    $sql = file_get_contents(__DIR__ . '/create_users_table.sql');
    $pdo->exec($sql);
    
    echo "Database and tables created successfully\n";
} catch(PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
?>
