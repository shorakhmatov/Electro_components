<?php
/**
 * API для обработки платежа и перенаправления средств на карту Тинькофф
 * Все платежи перенаправляются на карту Тинькофф, указанную в конфигурации
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
if (!isset($data['verification_code']) || empty($data['verification_code'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Не указан код подтверждения'
    ]);
    exit;
}

// Проверяем наличие данных о платеже
if (!isset($data['payment_method']) || empty($data['payment_method'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Не указан способ оплаты'
    ]);
    exit;
}

// Проверяем наличие данных карты, если выбран метод оплаты картой
if ($data['payment_method'] === 'card') {
    // Проверяем наличие номера карты
    if (!isset($data['card_number']) || empty($data['card_number'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Не указан номер карты'
        ]);
        exit;
    }
    
    // Проверяем наличие срока действия карты
    if (!isset($data['card_expiry']) || empty($data['card_expiry'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Не указан срок действия карты'
        ]);
        exit;
    }
    
    // Проверяем наличие CVV-кода
    if (!isset($data['card_cvv']) || empty($data['card_cvv'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Не указан CVV-код'
        ]);
        exit;
    }
}

// Проверяем наличие сохраненного кода подтверждения
if (!isset($_SESSION['verification_code']) || 
    !isset($_SESSION['verification_code']['code']) || 
    !isset($_SESSION['verification_code']['expires'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Код подтверждения не был отправлен или истек срок его действия'
    ]);
    exit;
}

// Проверяем срок действия кода
if ($_SESSION['verification_code']['expires'] < time()) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Истек срок действия кода подтверждения'
    ]);
    exit;
}

// Проверяем количество попыток ввода кода
if (isset($_SESSION['verification_code']['attempts']) && 
    $_SESSION['verification_code']['attempts'] >= $_SESSION['verification_code']['max_attempts']) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Превышено максимальное количество попыток ввода кода'
    ]);
    exit;
}

// Проверяем правильность кода
if ($_SESSION['verification_code']['code'] != $data['verification_code']) {
    // Увеличиваем счетчик попыток
    $_SESSION['verification_code']['attempts'] = isset($_SESSION['verification_code']['attempts']) ? 
        $_SESSION['verification_code']['attempts'] + 1 : 1;
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Неверный код подтверждения',
        'attempts_left' => $_SESSION['verification_code']['max_attempts'] - $_SESSION['verification_code']['attempts']
    ]);
    exit;
}

// Получаем данные о платеже из сессии
$amount = isset($_SESSION['verification_code']['amount']) ? $_SESSION['verification_code']['amount'] : 0;
$paymentMethod = $data['payment_method'];
$userId = $_SESSION['user_id'];
$description = isset($_SESSION['verification_code']['description']) ? $_SESSION['verification_code']['description'] : 'Оплата заказа';

// Получаем конфигурацию карты Тинькофф
$tinkoffCardConfig = getPaymentConfig('tinkoff_card');
$targetCardNumber = $tinkoffCardConfig['number']; // Номер карты Тинькофф для перенаправления платежей

// Данные платежа в зависимости от выбранного метода
switch ($paymentMethod) {
    case 'card':
        // Очищаем данные карты
        $cardNumber = preg_replace('/\D/', '', $data['card_number']);
        $cardExpiry = $data['card_expiry'];
        $cardCvv = $data['card_cvv'];
        
        // Проверяем, нужно ли сохранить карту
        $saveCard = isset($data['save_card']) && $data['save_card'] === true;
        
        // Подключаем модель для работы с платежными методами
        require_once '../../models/PaymentMethod.php';
        $paymentMethodModel = new PaymentMethod();
        
        // Если нужно сохранить карту, сохраняем ее
        if ($saveCard) {
            $cardData = [
                'user_id' => $userId,
                'card_number' => $cardNumber,
                'expiry_date' => $cardExpiry,
                'card_type' => detectCardType($cardNumber)
            ];
            
            // Проверяем, существует ли уже такая карта
            $existingCard = $paymentMethodModel->getCardByNumber($userId, $cardNumber);
            
            if (!$existingCard) {
                // Сохраняем новую карту
                $paymentMethodModel->addCard($cardData);
            }
        }
        
        // Логируем информацию о платеже
        if (PAYMENT_LOG_ENABLED) {
            error_log(sprintf(
                "[%s] Payment processed: User ID: %d, Method: Card, Amount: %.2f RUB, Card: **** **** **** %s, Target Card: %s",
                date('Y-m-d H:i:s'),
                $userId,
                $amount,
                substr($cardNumber, -4),
                $targetCardNumber
            ));
        }
        break;
        
    case 'sberpay':
        // Перенаправление платежа через СберПей на карту Тинькофф
        if (PAYMENT_LOG_ENABLED) {
            error_log(sprintf(
                "[%s] Payment processed: User ID: %d, Method: SberPay, Amount: %.2f RUB, Target Card: %s",
                date('Y-m-d H:i:s'),
                $userId,
                $amount,
                $targetCardNumber
            ));
        }
        break;
        
    case 'yoomoney':
        // Перенаправление платежа через ЮMoney на карту Тинькофф
        if (PAYMENT_LOG_ENABLED) {
            error_log(sprintf(
                "[%s] Payment processed: User ID: %d, Method: YooMoney, Amount: %.2f RUB, Target Card: %s",
                date('Y-m-d H:i:s'),
                $userId,
                $amount,
                $targetCardNumber
            ));
        }
        break;
        
    case 'tinkoff':
        // Прямой платеж через Тинькофф
        if (PAYMENT_LOG_ENABLED) {
            error_log(sprintf(
                "[%s] Payment processed: User ID: %d, Method: Tinkoff, Amount: %.2f RUB, Target Card: %s",
                date('Y-m-d H:i:s'),
                $userId,
                $amount,
                $targetCardNumber
            ));
        }
        break;
        
    default:
        // Неизвестный метод оплаты
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Неподдерживаемый способ оплаты'
        ]);
        exit;
}

// Сохраняем информацию о платеже в базе данных
// В реальном приложении здесь был бы код для сохранения транзакции в базе данных
$transactionId = uniqid('trx_');

// Очищаем данные верификации из сессии
unset($_SESSION['verification_code']);

// Возвращаем успешный ответ
echo json_encode([
    'success' => true,
    'message' => 'Платеж успешно обработан',
    'transaction_id' => $transactionId,
    'amount' => $amount,
    'date' => date('Y-m-d H:i:s'),
    'payment_method' => $paymentMethod,
    'target_card' => substr($targetCardNumber, 0, 4) . ' **** **** ' . substr($targetCardNumber, -4),
    'description' => $description
]);

/**
 * Определение типа карты по номеру
 * @param string $cardNumber Номер карты
 * @return string Тип карты
 */
function detectCardType($cardNumber) {
    // Visa
    if (preg_match('/^4[0-9]{12}(?:[0-9]{3})?$/', $cardNumber)) {
        return 'visa';
    }
    
    // Mastercard
    if (preg_match('/^5[1-5][0-9]{14}$/', $cardNumber)) {
        return 'mastercard';
    }
    
    // American Express
    if (preg_match('/^3[47][0-9]{13}$/', $cardNumber)) {
        return 'amex';
    }
    
    // Discover
    if (preg_match('/^6(?:011|5[0-9]{2})[0-9]{12}$/', $cardNumber)) {
        return 'discover';
    }
    
    // Mir
    if (preg_match('/^220[0-4][0-9]{12}$/', $cardNumber)) {
        return 'mir';
    }
    
    // По умолчанию
    return 'unknown';
}
