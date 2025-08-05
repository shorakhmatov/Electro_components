<?php
// Подключаем файлы конфигурации и модели
require_once '../../config/database.php';
require_once '../../models/Feedback.php';

// Проверяем, что запрос отправлен методом GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

// Получаем параметры из запроса
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
$type = isset($_GET['type']) ? $_GET['type'] : null;

try {
    // Создаем экземпляр модели Feedback
    $feedback = new Feedback();
    
    // Получаем последние отзывы
    $recentFeedback = $feedback->getRecent($limit, $type);
    
    // Отправляем успешный ответ
    http_response_code(200);
    echo json_encode(['success' => true, 'data' => $recentFeedback]);
} catch (Exception $e) {
    // Логируем ошибку
    error_log('Error getting recent feedback: ' . $e->getMessage());
    
    // Отправляем сообщение об ошибке
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Произошла ошибка при получении отзывов']);
}
