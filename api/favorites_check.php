// favorites_check.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set headers
header('Content-Type: application/json');

// Include models
require_once '../models/Favorite.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Пользователь не авторизован']);
    exit;
}

// Get product IDs from request
$product_ids = [];
if (isset($_POST['product_ids'])) {
    $product_ids = explode(',', $_POST['product_ids']);
    $product_ids = array_map('intval', $product_ids);
} elseif (isset($_GET['product_ids'])) {
    $product_ids = explode(',', $_GET['product_ids']);
    $product_ids = array_map('intval', $product_ids);
}

// Check if products are in favorites
$favorite = new Favorite();
$favorite_items = [];

foreach ($product_ids as $product_id) {
    if ($product_id > 0 && $favorite->exists($_SESSION['user_id'], $product_id)) {
        $favorite_items[] = $product_id;
    }
}

// Return response
echo json_encode([
    'success' => true,
    'favorites' => [
        'items' => $favorite_items,
        'count' => count($favorite_items)
    ]
]);
?>
