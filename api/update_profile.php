// update_profile.php
<?php
header('Content-Type: application/json');
require_once '../includes/db/database.php';
require_once '../models/User.php';

// Проверяем авторизацию
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Получаем данные из POST запроса
$data = $_POST;

if (empty($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data', 'success' => false]);
    exit;
}

try {
    // Создаем экземпляр класса User
    $userModel = new User();
    
    // Обновляем данные пользователя
    $result = $userModel->updateUserProfile(
        $user_id,
        $data['firstName'] ?? '',
        $data['lastName'] ?? '',
        $data['middleName'] ?? '',
        $data['email'] ?? '',
        $data['phone'] ?? ''
    );
    
    if ($result) {
        // Получаем обновленные данные пользователя
        $userData = $userModel->getUserById($user_id);
        
        echo json_encode([
            'success' => true,
            'message' => 'Профиль успешно обновлен',
            'user' => $userData
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Не удалось обновить профиль'
        ]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
