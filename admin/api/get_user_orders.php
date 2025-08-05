<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Получение ID пользователя из запроса
$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($userId <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid user ID']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Запрос на получение информации о пользователе
    $query = "
        SELECT id, first_name, last_name
        FROM users
        WHERE id = :user_id
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit;
    }
    
    // Запрос на получение заказов пользователя
    $query = "
        SELECT id, total_amount, status, created_at, updated_at
        FROM orders
        WHERE user_id = :user_id
        ORDER BY created_at DESC
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'user' => $user,
        'orders' => $orders
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
