<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Получение ID категории из запроса
$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;

// Проверка валидности данных
if ($category_id <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid category ID']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Проверка, существует ли категория
    $query = "SELECT name FROM categories WHERE id = :category_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->execute();
    
    $category = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$category) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Category not found']);
        exit;
    }
    
    // Запрос на получение товаров в категории
    $query = "
        SELECT p.*, c.name as category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = :category_id
        ORDER BY p.name
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->execute();
    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success', 
        'products' => $products, 
        'category' => $category
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
