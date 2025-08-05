<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Получение статуса из запроса
$status = isset($_GET['status']) ? $_GET['status'] : 'all';

// Преобразование статуса из UI в значения базы данных
$statusMap = [
    'new' => 'pending',
    'processing' => 'processing',
    'shipped' => 'shipped',
    'delivered' => 'delivered',
    'cancelled' => 'cancelled'
];

// Флаг для определения, нужно ли фильтровать по статусу
$filterByStatus = ($status !== 'all' && isset($statusMap[$status]));

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Запрос на получение заказов
    if ($filterByStatus) {
        // Если указан статус, фильтруем по нему
        $dbStatus = $statusMap[$status];
        $query = "
            SELECT o.*, CONCAT(u.first_name, ' ', u.last_name) as user_name, u.email, u.phone
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.status = :status
            ORDER BY o.created_at DESC
        ";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':status', $dbStatus);
    } else {
        // Если статус не указан или указан 'all', получаем все заказы
        $query = "
            SELECT o.*, CONCAT(u.first_name, ' ', u.last_name) as user_name, u.email, u.phone
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ";
        
        $stmt = $conn->prepare($query);
    }
    
    $stmt->execute();
    
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'orders' => $orders]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
