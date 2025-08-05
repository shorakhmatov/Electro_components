<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set headers
header('Content-Type: application/json');

// Include models
require_once '../models/Cart.php';
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
    case 'add':
        // Add item to cart
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;

        if ($product_id <= 0) {
            $response = ['success' => false, 'message' => 'Неверный ID товара'];
            break;
        }

        if ($quantity <= 0) {
            $response = ['success' => false, 'message' => 'Количество должно быть больше 0'];
            break;
        }

        // Check if product exists
        $product = new Product();
        $productData = $product->getById($product_id);

        if (!$productData) {
            $response = ['success' => false, 'message' => 'Товар не найден'];
            break;
        }

        // Check if quantity is available
        if ($productData['quantity'] < $quantity) {
            $response = ['success' => false, 'message' => 'Недостаточно товара на складе'];
            break;
        }

        $cart = new Cart();
        $result = $cart->addItem($_SESSION['user_id'], $product_id, $quantity);

        if ($result) {
            $cartCount = $cart->getItemCount($_SESSION['user_id']);
            $cartTotal = $cart->getTotal($_SESSION['user_id']);
            $response = [
                'success' => true, 
                'message' => 'Товар добавлен в корзину',
                'cart' => [
                    'count' => $cartCount,
                    'total' => $cartTotal
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Ошибка при добавлении товара в корзину'];
        }
        break;

    case 'update':
        // Update item quantity
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;

        if ($product_id <= 0) {
            $response = ['success' => false, 'message' => 'Неверный ID товара'];
            break;
        }

        if ($quantity <= 0) {
            // If quantity is 0 or negative, remove the item
            $cart = new Cart();
            $result = $cart->removeItem($_SESSION['user_id'], $product_id);

            if ($result) {
                $cartCount = $cart->getItemCount($_SESSION['user_id']);
                $cartTotal = $cart->getTotal($_SESSION['user_id']);
                $response = [
                    'success' => true, 
                    'message' => 'Товар удален из корзины',
                    'cart' => [
                        'count' => $cartCount,
                        'total' => $cartTotal
                    ]
                ];
            } else {
                $response = ['success' => false, 'message' => 'Ошибка при удалении товара из корзины'];
            }
        } else {
            // Check if product exists
            $product = new Product();
            $productData = $product->getById($product_id);

            if (!$productData) {
                $response = ['success' => false, 'message' => 'Товар не найден'];
                break;
            }

            // Check if quantity is available
            if ($productData['quantity'] < $quantity) {
                $response = ['success' => false, 'message' => 'Недостаточно товара на складе'];
                break;
            }

            $cart = new Cart();
            $result = $cart->updateQuantity($_SESSION['user_id'], $product_id, $quantity);

            if ($result) {
                $cartCount = $cart->getItemCount($_SESSION['user_id']);
                $cartTotal = $cart->getTotal($_SESSION['user_id']);
                $response = [
                    'success' => true, 
                    'message' => 'Количество товара обновлено',
                    'cart' => [
                        'count' => $cartCount,
                        'total' => $cartTotal
                    ]
                ];
            } else {
                $response = ['success' => false, 'message' => 'Ошибка при обновлении количества товара'];
            }
        }
        break;

    case 'remove':
        // Remove item from cart
        $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

        if ($product_id <= 0) {
            $response = ['success' => false, 'message' => 'Неверный ID товара'];
            break;
        }

        $cart = new Cart();
        $result = $cart->removeItem($_SESSION['user_id'], $product_id);

        if ($result) {
            $cartCount = $cart->getItemCount($_SESSION['user_id']);
            $cartTotal = $cart->getTotal($_SESSION['user_id']);
            $response = [
                'success' => true, 
                'message' => 'Товар удален из корзины',
                'cart' => [
                    'count' => $cartCount,
                    'total' => $cartTotal
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Ошибка при удалении товара из корзины'];
        }
        break;

    case 'clear':
        // Clear cart
        $cart = new Cart();
        $result = $cart->clearCart($_SESSION['user_id']);

        if ($result) {
            $response = [
                'success' => true, 
                'message' => 'Корзина очищена',
                'cart' => [
                    'count' => 0,
                    'total' => 0
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Ошибка при очистке корзины'];
        }
        break;

    case 'get':
        // Get cart items
        $cart = new Cart();
        $items = $cart->getItems($_SESSION['user_id']);
        $cartCount = $cart->getItemCount($_SESSION['user_id']);
        $cartTotal = $cart->getTotal($_SESSION['user_id']);

        $response = [
            'success' => true,
            'cart' => [
                'items' => $items,
                'count' => $cartCount,
                'total' => $cartTotal
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
