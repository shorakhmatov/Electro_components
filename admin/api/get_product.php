<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Получение ID товара из запроса
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Проверка валидности данных
if ($id <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid product ID']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Запрос на получение информации о товаре
    $query = "
        SELECT p.*, c.name as category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = :id
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$product) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Product not found']);
        exit;
    }
    
    // Добавляем URL для просмотра товара на сайте
    $product['view_url'] = '/product.php?id=' . $product['id'];
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'product' => $product]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
