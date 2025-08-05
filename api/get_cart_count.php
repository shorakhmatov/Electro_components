// get_cart_count.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Устанавливаем заголовки для JSON-ответа
header('Content-Type: application/json');

// Проверяем авторизацию пользователя
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'count' => 0, 'message' => 'Пользователь не авторизован']);
    exit;
}

// Подключаем модель корзины
require_once __DIR__ . '/../models/Cart.php';

try {
    // Получаем количество товаров в корзине
    $cart = new Cart();
    $count = $cart->getItemCount($_SESSION['user_id']);
    
    // Возвращаем результат
    echo json_encode([
        'success' => true,
        'count' => $count
    ]);
} catch (Exception $e) {
    // В случае ошибки возвращаем сообщение об ошибке
    error_log('Ошибка при получении количества товаров в корзине: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'count' => 0,
        'message' => 'Произошла ошибка при получении количества товаров в корзине'
    ]);
}
?>
