<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Получение поискового запроса
$query = isset($_GET['query']) ? trim($_GET['query']) : '';

if (empty($query)) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Search query is required']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Запрос на поиск пользователей
    $searchQuery = "
        SELECT id, first_name, last_name, email, phone, balance, created_at
        FROM users
        WHERE first_name LIKE :query
        OR last_name LIKE :query
        OR email LIKE :query
        OR phone LIKE :query
        ORDER BY id DESC
    ";
    
    $searchParam = '%' . $query . '%';
    
    $stmt = $conn->prepare($searchQuery);
    $stmt->bindParam(':query', $searchParam);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'users' => $users]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
