<?php
// Включаем заголовки для CORS и JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Проверяем, что пользователь авторизован
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["success" => false, "message" => "Пользователь не авторизован"]);
    exit;
}

// Получаем ID пользователя из сессии
$userId = $_SESSION['user_id'];

// Подключаем необходимые файлы
require_once '../../config/database.php';
require_once '../../models/PaymentMethod.php';

// Создаем соединение с базой данных
$database = new Database();
$db = $database->getConnection();

// Создаем объект модели PaymentMethod
$paymentMethod = new PaymentMethod($db);

// Получаем карты и кошельки пользователя
$cards = $paymentMethod->getUserCards($userId);
$wallets = $paymentMethod->getUserWallets($userId);

// Формируем ответ
$response = [
    "success" => true,
    "cards" => $cards,
    "wallets" => $wallets
];

// Возвращаем ответ
http_response_code(200);
echo json_encode($response);
