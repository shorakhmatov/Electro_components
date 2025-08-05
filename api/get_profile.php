// get_profile.php<?php
header('Content-Type: application/json');
require_once '../database/connection.php';

// Проверяем авторизацию
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    // Получаем данные пользователя
    $stmt = $pdo->prepare("
        SELECT u.*, us.notifications_enabled
        FROM users u
        LEFT JOIN user_settings us ON u.id = us.user_id
        WHERE u.id = ?
    ");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        throw new Exception('User not found');
    }

    // Удаляем пароль из ответа
    unset($user['password']);

    echo json_encode([
        'success' => true,
        'user' => $user
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
