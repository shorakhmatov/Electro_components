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
require_once '../../models/DeliveryAddress.php';

// Get user ID from session
$userId = $_SESSION['user_id'];

// Create database connection
$database = new Database();
$db = $database->getConnection();

// Create delivery address object
$deliveryAddress = new DeliveryAddress($db);

// Get all addresses for the user
$addresses = $deliveryAddress->getUserAddresses($userId);

echo json_encode([
    'success' => true,
    'addresses' => $addresses
]);
?>
