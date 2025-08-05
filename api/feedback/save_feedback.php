<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Подключаем файлы конфигурации и модели
require_once '../../config/database.php';
require_once '../../models/Feedback.php';

// Проверяем, что запрос отправлен методом POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

// Получаем данные из запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем наличие всех необходимых полей
$requiredFields = ['name', 'email', 'type', 'rating', 'message'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Поле $field обязательно для заполнения"]);
        exit;
    }
}

// Проверяем валидность email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, укажите корректный email адрес']);
    exit;
}

// Проверяем рейтинг
if (!is_numeric($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Рейтинг должен быть от 1 до 5']);
    exit;
}

// Проверяем тип обратной связи
$allowedTypes = ['review', 'product', 'suggestion', 'complaint', 'other'];
if (!in_array($data['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Неверный тип обратной связи']);
    exit;
}

// Если тип - отзыв о товаре, проверяем наличие product_id
if ($data['type'] === 'product' && (!isset($data['product_id']) || empty($data['product_id']))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Для отзыва о товаре необходимо указать товар']);
    exit;
}

// Получаем ID пользователя, если он авторизован
$userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

try {
    // Создаем экземпляр модели Feedback
    $feedback = new Feedback();
    
    // Подготавливаем данные для сохранения
    $feedbackData = [
        'name' => htmlspecialchars($data['name']),
        'email' => filter_var($data['email'], FILTER_SANITIZE_EMAIL),
        'type' => $data['type'],
        'product_id' => isset($data['product_id']) ? (int)$data['product_id'] : null,
        'rating' => (int)$data['rating'],
        'message' => htmlspecialchars($data['message']),
        'user_id' => $userId
    ];
    
    // Проверяем подключение к базе данных
    if (!$feedback->checkDatabaseConnection()) {
        // Логируем ошибку
        error_log('Database connection error when saving feedback');
        
        // Отправляем сообщение об ошибке
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Ошибка подключения к базе данных']);
        exit;
    }
    
    // Сохраняем отзыв в базу данных
    $result = $feedback->save($feedbackData);
    
    if ($result) {
        // Логируем успешное сохранение
        error_log('Feedback successfully saved for user ID: ' . $userId);
        
        // Отправляем успешный ответ
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Отзыв успешно сохранен']);
    } else {
        // Логируем ошибку
        error_log('Failed to save feedback for user ID: ' . $userId);
        
        // Отправляем сообщение об ошибке
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Не удалось сохранить отзыв']);
    }
} catch (Exception $e) {
    // Логируем ошибку
    error_log('Error saving feedback: ' . $e->getMessage());
    
    // Отправляем сообщение об ошибке
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Произошла ошибка при сохранении отзыва']);
}
