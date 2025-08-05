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
$id = isset($_POST['id']) ? intval($_POST['id']) : 0;

// Проверка валидности данных
if ($id <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid product ID']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Получаем информацию о товаре (для удаления изображения)
    $query = "SELECT image_url FROM products WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$product) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Product not found']);
        exit;
    }
    
    // Начало транзакции
    $conn->beginTransaction();
    
    // Удаляем товар из корзины пользователей
    $query = "DELETE FROM cart WHERE product_id = :product_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':product_id', $id);
    $stmt->execute();
    
    // Удаляем товар из избранного пользователей
    $query = "DELETE FROM favorites WHERE product_id = :product_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':product_id', $id);
    $stmt->execute();
    
    // Удаляем товар
    $query = "DELETE FROM products WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    // Фиксация транзакции
    $conn->commit();
    
    // Удаляем изображение товара, если оно существует
    if (!empty($product['image_url']) && file_exists('../../' . ltrim($product['image_url'], '/'))) {
        unlink('../../' . ltrim($product['image_url'], '/'));
    }
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Product deleted successfully'
    ]);
} catch (PDOException $e) {
    // Откат транзакции в случае ошибки
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
