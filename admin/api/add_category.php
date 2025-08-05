<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Получение данных из запроса
$name = isset($_POST['name']) ? trim($_POST['name']) : '';

// Проверка валидности данных
if (empty($name)) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Category name is required']);
    exit;
}

// Используем только поле name

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Проверка, существует ли категория с таким именем
    $query = "SELECT id FROM categories WHERE name = :name";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Category with this name already exists']);
        exit;
    }
    
    // Добавление новой категории
    $query = "INSERT INTO categories (name) VALUES (:name)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->execute();
    
    $categoryId = $conn->lastInsertId();
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Category added successfully',
        'category_id' => $categoryId
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
