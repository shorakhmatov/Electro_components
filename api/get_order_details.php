// get_order_details.php
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

// Проверяем наличие ID заказа
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'ID заказа не указан'
    ]);
    exit;
}

$order_id = intval($_GET['id']);
$user_id = $_SESSION['user_id'];

// Подключаем модель заказов
require_once '../models/Order.php';
$orderModel = new Order();

// Получаем данные заказа
$order = $orderModel->getById($order_id);

// Проверяем, существует ли заказ и принадлежит ли он текущему пользователю
if (!$order || $order['user_id'] != $user_id) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Заказ не найден или у вас нет доступа к нему'
    ]);
    exit;
}

// Получаем позиции заказа
$orderItems = $orderModel->getOrderItems($order_id);

// Возвращаем данные в формате JSON
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'order' => $order,
    'items' => $orderItems
]);
exit;
?>
