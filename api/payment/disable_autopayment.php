<?php
/**
 * API для отключения автоплатежа для карты
 */

// Заголовки для CORS и JSON
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Начинаем сессию, если она еще не начата
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Проверяем, авторизован ли пользователь
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Пользователь не авторизован'
    ]);
    exit;
}

// Получаем ID пользователя
$userId = $_SESSION['user_id'];

// Получаем данные из тела запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем наличие необходимых данных
if (!isset($data['card_id']) || empty($data['card_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Не указан ID карты'
    ]);
    exit;
}

// Получаем ID карты
$cardId = $data['card_id'];

// Подключаем модель PaymentMethod
require_once '../../models/PaymentMethod.php';

// Создаем экземпляр модели PaymentMethod
$paymentMethod = new PaymentMethod();

// Получаем данные карты
$card = $paymentMethod->getCardById($cardId);

// Проверяем, существует ли карта и принадлежит ли она пользователю
if (!$card || $card['user_id'] != $userId) {
    echo json_encode([
        'success' => false,
        'message' => 'Карта не найдена или не принадлежит пользователю'
    ]);
    exit;
}

// Отключаем автоплатеж для карты
$result = $paymentMethod->setAutopayment($cardId, false);

if ($result) {
    // Возвращаем успешный ответ
    echo json_encode([
        'success' => true,
        'message' => 'Автоплатеж успешно отключен'
    ]);
} else {
    // Возвращаем ошибку
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при отключении автоплатежа'
    ]);
}
?>
