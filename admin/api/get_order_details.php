<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Получение ID заказа из запроса
$orderId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($orderId <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid order ID']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Запрос на получение информации о заказе
    $query = "
        SELECT o.*, u.first_name, u.last_name, u.email, u.phone, u.address,
        o.delivery_address, o.delivery_address_id, o.delivery_type
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = :order_id
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':order_id', $orderId);
    $stmt->execute();
    
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Order not found']);
        exit;
    }
    
    // Запрос на получение товаров в заказе
    $query = "
        SELECT oi.*, p.name as product_name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = :order_id
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':order_id', $orderId);
    $stmt->execute();
    
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'order' => $order,
        'items' => $items
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
