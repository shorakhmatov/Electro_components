// cancel_order.php
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

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Метод не поддерживается'
    ]);
    exit;
}

// Проверяем наличие ID заказа
if (!isset($_POST['order_id']) || empty($_POST['order_id'])) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'ID заказа не указан'
    ]);
    exit;
}

$order_id = intval($_POST['order_id']);
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

// Проверяем, можно ли отменить заказ (только в статусах "pending" и "processing")
if ($order['status'] !== 'pending' && $order['status'] !== 'processing') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Невозможно отменить заказ в текущем статусе'
    ]);
    exit;
}

// Обновляем статус заказа на "cancelled"
$result = $orderModel->updateStatus($order_id, 'cancelled');

if ($result) {
    // Возвращаем успешный результат
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'Заказ успешно отменен'
    ]);
} else {
    // Возвращаем ошибку
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при отмене заказа'
    ]);
}
exit;
?>
