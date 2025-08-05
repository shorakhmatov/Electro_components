<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Пользователь не авторизован']);
    exit;
}

// Include database connection
require_once '../../config/database.php';
require_once '../../models/PaymentMethod.php';

// Get user ID from session
$userId = $_SESSION['user_id'];

// Get POST data
$postData = json_decode(file_get_contents('php://input'), true);

if (!$postData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Неверные данные']);
    exit;
}

// Create database connection
$database = new Database();
$db = $database->getConnection();

// Create payment method object
$paymentMethod = new PaymentMethod($db);

// Save card to database
$result = $paymentMethod->saveCard($userId, $postData);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Карта успешно сохранена',
        'card' => $result
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при сохранении карты'
    ]);
}
