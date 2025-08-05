// update_notification_settings.php<?php
header('Content-Type: application/json');
require_once '../includes/db/database.php';

// Проверяем авторизацию
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Получаем данные из POST запроса
$emailNotifications = isset($_POST['emailNotifications']) ? 1 : 0;
$smsNotifications = isset($_POST['smsNotifications']) ? 1 : 0;
$orderUpdates = isset($_POST['orderUpdates']) ? 1 : 0;
$promotions = isset($_POST['promotions']) ? 1 : 0;

// Временно сохраняем настройки в сессии
$_SESSION['notification_settings'] = [
    'email_notifications' => $emailNotifications,
    'sms_notifications' => $smsNotifications,
    'order_updates' => $orderUpdates,
    'promotions' => $promotions
];

// Возвращаем успешный ответ
echo json_encode([
    'success' => true,
    'message' => 'Настройки уведомлений успешно сохранены',
    'settings' => [
        'emailNotifications' => (bool)$emailNotifications,
        'smsNotifications' => (bool)$smsNotifications,
        'orderUpdates' => (bool)$orderUpdates,
        'promotions' => (bool)$promotions
    ]
]);
