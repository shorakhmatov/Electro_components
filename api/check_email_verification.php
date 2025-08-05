// check_email_verification.php<?php
// Запускаем сессию, если она еще не запущена
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Подключаем необходимые файлы
require_once '../models/User.php';

// Проверяем, авторизован ли пользователь
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['verified' => false, 'message' => 'Пользователь не авторизован']);
    exit;
}

// Получаем ID пользователя из сессии
$userId = $_SESSION['user_id'];

// Создаем экземпляр класса User
$user = new User();

// Проверяем статус подтверждения почты
$isVerified = $user->isEmailVerified($userId);

// Возвращаем результат
echo json_encode(['verified' => $isVerified]);
?>
