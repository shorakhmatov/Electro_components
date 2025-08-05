<?php
/**
 * API для отправки SMS-кода подтверждения платежа
 * Используется для подтверждения автосписания средств
 */

// Подключаем конфигурацию платежной системы
require_once '../../config/payment_config.php';

// Начинаем сессию, если она еще не начата
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Проверяем авторизацию пользователя
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Пользователь не авторизован'
    ]);
    exit;
}

// Проверяем, включена ли платежная система
if (!PAYMENT_ENABLED) {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'message' => 'Платежная система временно недоступна'
    ]);
    exit;
}

// Получаем конфигурацию автоплатежа
$autopaymentConfig = getPaymentConfig('autopayment');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Метод не поддерживается'
    ]);
    exit;
}

// Получаем данные из запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем наличие необходимых данных
if (!isset($data['phone_number']) || empty($data['phone_number'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Не указан номер телефона'
    ]);
    exit;
}

// Проверяем наличие суммы платежа
if (!isset($data['amount']) || !is_numeric($data['amount']) || $data['amount'] <= 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Некорректная сумма платежа'
    ]);
    exit;
}

// Очищаем номер телефона от лишних символов
$phoneNumber = preg_replace('/\D/', '', $data['phone_number']);

// Проверяем корректность номера телефона
if (strlen($phoneNumber) < 10) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Некорректный номер телефона'
    ]);
    exit;
}

// Проверяем, есть ли уже активный код подтверждения
if (isset($_SESSION['verification_code']) && 
$_SESSION['verification_code']['phone'] === $phoneNumber && 
$_SESSION['verification_code']['expires'] > time()) {
    // Если код уже существует и еще действителен, возвращаем информацию о нем
    $remainingTime = $_SESSION['verification_code']['expires'] - time();
    echo json_encode([
        'success' => true,
        'message' => 'Код подтверждения уже отправлен',
        'expires_in' => $remainingTime,
        'already_sent' => true
    ]);
    exit;
}

// Генерируем код подтверждения
$verificationCode = rand(100000, 999999);

// Сохраняем дополнительную информацию о платеже
$amount = floatval($data['amount']);

// Проверяем наличие метода оплаты и устанавливаем его по умолчанию, если не указан
$paymentMethod = 'card'; // По умолчанию

if (isset($data['payment_method'])) {
    // Проверяем, что метод оплаты поддерживается
    $supportedMethods = ['card', 'sberpay', 'tinkoff', 'yoomoney'];
    if (in_array($data['payment_method'], $supportedMethods)) {
        $paymentMethod = $data['payment_method'];
    }
}

// Описание заказа
$orderDescription = isset($data['description']) ? $data['description'] : 'Оплата заказа';

// Записываем в лог информацию о методе оплаты
if (PAYMENT_LOG_ENABLED) {
    error_log(sprintf("Payment method selected: %s", $paymentMethod));
}

// Сохраняем код в сессии для последующей проверки
$_SESSION['verification_code'] = [
    'code' => $verificationCode,
    'phone' => $phoneNumber,
    'amount' => $amount,
    'payment_method' => $paymentMethod,
    'description' => $orderDescription,
    'user_id' => $_SESSION['user_id'],
    'created_at' => time(),
    'expires' => time() + $autopaymentConfig['verification_timeout'],
    'attempts' => 0,
    'max_attempts' => $autopaymentConfig['max_attempts']
];

// Записываем в лог информацию о попытке платежа
if (PAYMENT_LOG_ENABLED) {
    $logMessage = sprintf(
        "[%s] Payment verification initiated: User ID: %d, Phone: %s, Amount: %.2f %s, Method: %s",
        date('Y-m-d H:i:s'),
        $_SESSION['user_id'],
        $phoneNumber,
        $amount,
        'RUB',
        $paymentMethod
    );
    error_log($logMessage);
}

// В реальном приложении здесь был бы код для отправки SMS
// Для демонстрации просто логируем код
// В реальном приложении здесь был бы вызов API SMS-шлюза
if (PAYMENT_TEST_MODE) {
    error_log("TEST MODE: Verification code for {$phoneNumber}: {$verificationCode}");
    // В тестовом режиме показываем код в ответе
    echo json_encode([
        'success' => true,
        'message' => 'Код подтверждения отправлен',
        'expires_in' => $autopaymentConfig['verification_timeout'],
        'test_code' => $verificationCode // Только в тестовом режиме!
    ]);
} else {
    // В реальном режиме не показываем код
    // Здесь был бы код отправки SMS через сервис
    // Но для демонстрации просто логируем
    error_log("PRODUCTION: Verification code for {$phoneNumber}: {$verificationCode}");
    
    echo json_encode([
        'success' => true,
        'message' => 'Код подтверждения отправлен на указанный номер телефона',
        'expires_in' => $autopaymentConfig['verification_timeout']
    ]);
}
