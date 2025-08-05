// place_order.php<?php
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

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Метод не поддерживается'
    ]);
    exit;
}

// Получаем данные о способе оплаты
$payment_data = isset($_POST['payment_data']) ? json_decode($_POST['payment_data'], true) : null;

if (!$payment_data) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Данные о способе оплаты не указаны'
    ]);
    exit;
}

// Получаем данные об адресе доставки
$delivery_address_raw = isset($_POST['delivery_address']) ? $_POST['delivery_address'] : null;
$delivery_address = isset($_POST['delivery_address']) ? json_decode($_POST['delivery_address'], true) : null;

// Логируем полученные данные для отладки
file_put_contents('delivery_address_log.txt', "\n\n" . date('Y-m-d H:i:s') . "\n", FILE_APPEND);
file_put_contents('delivery_address_log.txt', "Raw delivery_address: " . $delivery_address_raw . "\n", FILE_APPEND);
file_put_contents('delivery_address_log.txt', "Decoded delivery_address: " . print_r($delivery_address, true) . "\n", FILE_APPEND);

if (!$delivery_address) {
    file_put_contents('delivery_address_log.txt', "Error: Delivery address not provided or invalid JSON\n", FILE_APPEND);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Адрес доставки не указан'
    ]);
    exit;
}

// Получаем ID пользователя
$user_id = $_SESSION['user_id'];

// Подключаем модели
require_once '../models/Cart.php';
require_once '../models/Order.php';

// Создаем экземпляры моделей
$cart = new Cart();
$order = new Order();

// Получаем товары из корзины
$cart_items = $cart->getItems($user_id);
$cart_total = $cart->getTotal($user_id);

// Проверяем, что корзина не пуста
if (empty($cart_items)) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Корзина пуста'
    ]);
    exit;
}

// Подготавливаем данные для создания заказа
$items = [];
foreach ($cart_items as $item) {
    $items[] = [
        'product_id' => $item['product_id'],
        'quantity' => $item['quantity'],
        'price' => $item['price']
    ];
}

// Добавляем данные об адресе доставки
$order_data = [
    'delivery_address' => $delivery_address['full'],
    'delivery_address_id' => $delivery_address['id'],
    'delivery_type' => $delivery_address['type'] ?? 'home'
];

// Создаем заказ
$order_id = $order->create($user_id, $cart_total, $items, $order_data);

if (!$order_id) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при создании заказа'
    ]);
    exit;
}

// Очищаем корзину пользователя
$cart->clearCart($user_id);

// Возвращаем успешный результат
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'message' => 'Заказ успешно оформлен',
    'order_id' => $order_id
]);
exit;
?>
