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
$id = isset($_POST['id']) ? intval($_POST['id']) : 0;

// Проверка валидности данных
if ($id <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid category ID']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Начало транзакции
    $conn->beginTransaction();
    
    // Проверка, существуют ли товары в этой категории
    $query = "SELECT COUNT(*) FROM products WHERE category_id = :category_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':category_id', $id);
    $stmt->execute();
    
    $productCount = $stmt->fetchColumn();
    
    // Если есть товары, удаляем их
    if ($productCount > 0) {
        $query = "DELETE FROM products WHERE category_id = :category_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':category_id', $id);
        $stmt->execute();
    }
    
    // Удаление категории
    $query = "DELETE FROM categories WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        // Откат транзакции, если категория не найдена
        $conn->rollBack();
        
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Category not found']);
        exit;
    }
    
    // Фиксация транзакции
    $conn->commit();
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Category deleted successfully',
        'products_deleted' => $productCount
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
