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
$orderId = isset($_POST['id']) ? intval($_POST['id']) : 0;
$status = isset($_POST['status']) ? $_POST['status'] : '';

// Проверка валидности данных
if ($orderId <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid order ID']);
    exit;
}

// Проверка статуса
$allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
if (!in_array($status, $allowedStatuses)) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid status']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Обновление статуса заказа
    $query = "UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :order_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':order_id', $orderId);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'message' => 'Order status updated successfully']);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Order not found or status not changed']);
    }
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
