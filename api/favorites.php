<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set headers
header('Content-Type: application/json');

// Include models
require_once '../models/Favorite.php';
require_once '../models/Product.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Пользователь не авторизован']);
    exit;
}

// Handle request based on the action parameter
$action = isset($_POST['action']) ? $_POST['action'] : '';
$response = ['success' => false, 'message' => 'Invalid action'];

switch ($action) {
    case 'check_multiple':
        // Check multiple products in favorites
        $product_ids = [];
        if (isset($_POST['product_ids'])) {
            $product_ids = explode(',', $_POST['product_ids']);
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
        
        $favoriteCount = $favorite->getCount($_SESSION['user_id']);
        $response = [
            'success' => true,
            'favorites' => [
                'items' => $favorite_items,
                'count' => $favoriteCount
            ]
        ];
        break;
        
    case 'toggle':
        // Toggle favorite status
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

        if ($product_id <= 0) {
            $response = ['success' => false, 'message' => 'Неверный ID товара'];
            break;
        }

        // Check if product exists
        $product = new Product();
        $productData = $product->getById($product_id);

        if (!$productData) {
            $response = ['success' => false, 'message' => 'Товар не найден'];
            break;
        }

        $favorite = new Favorite();
        $exists = $favorite->exists($_SESSION['user_id'], $product_id);
        $result = $favorite->toggle($_SESSION['user_id'], $product_id);

        if ($result) {
            $favoriteCount = $favorite->getCount($_SESSION['user_id']);
            $response = [
                'success' => true, 
                'message' => $exists ? 'Товар удален из избранного' : 'Товар добавлен в избранное',
                'favorites' => [
                    'count' => $favoriteCount,
                    'status' => !$exists // New status (true = in favorites, false = not in favorites)
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Ошибка при изменении статуса избранного'];
        }
        break;

    case 'add':
        // Add product to favorites
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

        if ($product_id <= 0) {
            $response = ['success' => false, 'message' => 'Неверный ID товара'];
            break;
        }

        // Check if product exists
        $product = new Product();
        $productData = $product->getById($product_id);

        if (!$productData) {
            $response = ['success' => false, 'message' => 'Товар не найден'];
            break;
        }

        $favorite = new Favorite();
        $result = $favorite->add($_SESSION['user_id'], $product_id);

        if ($result) {
            $favoriteCount = $favorite->getCount($_SESSION['user_id']);
            $response = [
                'success' => true, 
                'message' => 'Товар добавлен в избранное',
                'favorites' => [
                    'count' => $favoriteCount
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Ошибка при добавлении товара в избранное'];
        }
        break;

    case 'remove':
        // Remove product from favorites
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

        if ($product_id <= 0) {
            $response = ['success' => false, 'message' => 'Неверный ID товара'];
            break;
        }

        $favorite = new Favorite();
        $result = $favorite->remove($_SESSION['user_id'], $product_id);

        if ($result) {
            $favoriteCount = $favorite->getCount($_SESSION['user_id']);
            $response = [
                'success' => true, 
                'message' => 'Товар удален из избранного',
                'favorites' => [
                    'count' => $favoriteCount
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Ошибка при удалении товара из избранного'];
        }
        break;

    case 'check':
        // Check if product is in favorites
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

        if ($product_id <= 0) {
            $response = ['success' => false, 'message' => 'Неверный ID товара'];
            break;
        }

        $favorite = new Favorite();
        $exists = $favorite->exists($_SESSION['user_id'], $product_id);

        $response = [
            'success' => true,
            'favorites' => [
                'status' => $exists
            ]
        ];
        break;

    case 'get':
        // Get all favorites with product details
        $favorite = new Favorite();
        $items = $favorite->getAll($_SESSION['user_id']);
        $favoriteCount = $favorite->getCount($_SESSION['user_id']);

        $response = [
            'success' => true,
            'favorites' => [
                'items' => $items,
                'count' => $favoriteCount
            ]
        ];
        break;

    default:
        $response = ['success' => false, 'message' => 'Неизвестное действие'];
        break;
}

// Return JSON response
echo json_encode($response);
?>
