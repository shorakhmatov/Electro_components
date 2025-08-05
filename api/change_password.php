// change_password.php<?php
header('Content-Type: application/json');
require_once '../includes/db/database.php';
require_once '../models/User.php';

// Проверяем авторизацию
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Получаем данные из POST запроса
$currentPassword = $_POST['currentPassword'] ?? '';
$newPassword = $_POST['newPassword'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';

// Проверяем, что все необходимые данные предоставлены
if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Все поля должны быть заполнены']);
    exit;
}

// Проверяем, что новый пароль и подтверждение совпадают
if ($newPassword !== $confirmPassword) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Новый пароль и подтверждение не совпадают']);
    exit;
}

try {
    // Создаем экземпляр класса User
    $userModel = new User();
    
    // Проверяем текущий пароль
    $isValidPassword = $userModel->verifyPassword($user_id, $currentPassword);
    
    if (!$isValidPassword) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Текущий пароль неверен']);
        exit;
    }
    
    // Обновляем пароль
    $result = $userModel->updatePassword($user_id, $newPassword);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Пароль успешно изменен'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Не удалось изменить пароль'
        ]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
