// check_cart.php
<?php
// Начинаем сессию
session_start();

// Проверяем авторизацию
if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Необходима авторизация'
    ]);
    exit;
}

// Получаем ID пользователя
$user_id = $_SESSION['user_id'];

// Подключаем модель корзины
require_once '../models/Cart.php';

// Создаем экземпляр модели
$cart = new Cart();

// Получаем количество товаров в корзине
$cart_count = $cart->getItemCount($user_id);

// Проверяем, что корзина не пуста
if ($cart_count > 0) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'Корзина не пуста',
        'cart_count' => $cart_count
    ]);
} else {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Ваша корзина пуста. Добавьте товары перед оформлением заказа.'
    ]);
}
?>
