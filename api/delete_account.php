// delete_account.php
<?php
// Включаем отображение всех ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Настраиваем заголовки для CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Обрабатываем OPTIONS запросы для CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Начинаем сессию, если она еще не начата
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Проверяем, авторизован ли пользователь
if (!isset($_SESSION['user_id'])) {
    error_log("Delete account attempt without authorization");
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Вы не авторизованы']);
    exit;
}

try {
    // Подключаем модель пользователя
    require_once '../models/User.php';

    // Получаем ID пользователя из сессии
    $userId = $_SESSION['user_id'];
    error_log("Processing account deletion for user ID: $userId");

    // Создаем экземпляр модели пользователя
    $user = new User();

    // Проверяем, есть ли у пользователя активные заказы
    $hasActiveOrders = $user->hasActiveOrders($userId);
    error_log("User has active orders: " . ($hasActiveOrders ? 'yes' : 'no'));

    // Если это только проверка активных заказов (для JavaScript)
    if (isset($_GET['check_only']) && $_GET['check_only'] == '1') {
        error_log("Checking active orders only");
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'has_active_orders' => $hasActiveOrders
        ]);
        exit;
    }

    // Если есть активные заказы, запрещаем удаление
    if ($hasActiveOrders) {
        error_log("Account deletion denied due to active orders");
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => 'Невозможно удалить аккаунт, так как у вас есть активные заказы. Дождитесь завершения всех заказов или отмените их.'
        ]);
        exit;
    }

    // Удаляем аккаунт пользователя
    error_log("Attempting to delete account for user ID: $userId");
    if ($user->deleteAccount($userId)) {
        // Если удаление прошло успешно, уничтожаем сессию
        error_log("Account deleted successfully, destroying session");
        session_unset();
        session_destroy();
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Ваш аккаунт был успешно удален']);
    } else {
        error_log("Account deletion failed");
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Произошла ошибка при удалении аккаунта. Пожалуйста, попробуйте позже.']);
    }
} catch (Exception $e) {
    // Обрабатываем любые непредвиденные ошибки
    error_log("Unexpected error in delete_account.php: " . $e->getMessage());
    error_log("Error trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Произошла непредвиденная ошибка при удалении аккаунта. Пожалуйста, попробуйте позже.',
        'error' => $e->getMessage()
    ]);
}
?>
