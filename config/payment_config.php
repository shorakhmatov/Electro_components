<?php
/**
 * Конфигурация платежной системы
 * Настройки для всех платежных методов
 */

// Основные настройки платежной системы
define('PAYMENT_ENABLED', true); // Включена ли платежная система
define('PAYMENT_TEST_MODE', false); // Тестовый режим (для разработки)
define('PAYMENT_LOG_ENABLED', true); // Логирование платежей

// Настройки для карты Тинькофф (основная карта для приема платежей)
define('TINKOFF_CARD_NUMBER', '2200700740386353'); // Номер карты Тинькофф для приема платежей
define('TINKOFF_CARD_HOLDER', 'CARDHOLDER NAME'); // Имя держателя карты
define('TINKOFF_CARD_EXPIRY', '12/28'); // Срок действия карты (MM/YY)

// Настройки для Тинькофф API
define('TINKOFF_API_URL', 'https://securepay.tinkoff.ru/v2/'); // URL API Тинькофф
define('TINKOFF_TERMINAL_KEY', 'TinkoffTerminalKey'); // Терминальный ключ (заменить на реальный при подключении)
define('TINKOFF_SECRET_KEY', 'TinkoffSecretKey'); // Секретный ключ (заменить на реальный при подключении)

// Настройки для СберПей
define('SBER_API_URL', 'https://api.sberbank.ru/prod/v2/'); // URL API СберБанк
define('SBER_CLIENT_ID', 'SberClientId'); // ID клиента (заменить на реальный при подключении)
define('SBER_CLIENT_SECRET', 'SberClientSecret'); // Секретный ключ (заменить на реальный при подключении)
define('SBER_REDIRECT_CARD', TINKOFF_CARD_NUMBER); // Перенаправление на карту Тинькофф

// Настройки для ЮMoney (бывший Яндекс.Деньги)
define('YOOMONEY_API_URL', 'https://yoomoney.ru/api/'); // URL API ЮMoney
define('YOOMONEY_WALLET', 'YooMoneyWallet'); // Номер кошелька (заменить на реальный при подключении)
define('YOOMONEY_SECRET_KEY', 'YooMoneySecretKey'); // Секретный ключ (заменить на реальный при подключении)
define('YOOMONEY_REDIRECT_CARD', TINKOFF_CARD_NUMBER); // Перенаправление на карту Тинькофф

// Настройки для автосписания
define('AUTOPAYMENT_ENABLED', true); // Включено ли автосписание
define('AUTOPAYMENT_SMS_VERIFICATION', true); // Требуется ли SMS-подтверждение
define('AUTOPAYMENT_VERIFICATION_TIMEOUT', 300); // Тайм-аут для ввода кода подтверждения (в секундах)
define('AUTOPAYMENT_MAX_ATTEMPTS', 3); // Максимальное количество попыток ввода кода

// Настройки для уведомлений
define('PAYMENT_NOTIFICATION_EMAIL', 'your@email.com'); // Email для уведомлений о платежах
define('PAYMENT_NOTIFICATION_SMS', '+79XXXXXXXXX'); // Телефон для SMS-уведомлений о платежах

// Настройки для возвратов
define('REFUND_ENABLED', true); // Разрешены ли возвраты
define('REFUND_APPROVAL_REQUIRED', true); // Требуется ли подтверждение для возврата
define('REFUND_MAX_DAYS', 30); // Максимальное количество дней для возврата

// Функция для получения конфигурации платежной системы
function getPaymentConfig($payment_method = null) {
    $config = [
        'enabled' => PAYMENT_ENABLED,
        'test_mode' => PAYMENT_TEST_MODE,
        'log_enabled' => PAYMENT_LOG_ENABLED,
        'tinkoff_card' => [
            'number' => TINKOFF_CARD_NUMBER,
            'holder' => TINKOFF_CARD_HOLDER,
            'expiry' => TINKOFF_CARD_EXPIRY
        ],
        'tinkoff' => [
            'api_url' => TINKOFF_API_URL,
            'terminal_key' => TINKOFF_TERMINAL_KEY,
            'secret_key' => TINKOFF_SECRET_KEY
        ],
        'sber' => [
            'api_url' => SBER_API_URL,
            'client_id' => SBER_CLIENT_ID,
            'client_secret' => SBER_CLIENT_SECRET,
            'redirect_card' => SBER_REDIRECT_CARD
        ],
        'yoomoney' => [
            'api_url' => YOOMONEY_API_URL,
            'wallet' => YOOMONEY_WALLET,
            'secret_key' => YOOMONEY_SECRET_KEY,
            'redirect_card' => YOOMONEY_REDIRECT_CARD
        ],
        'autopayment' => [
            'enabled' => AUTOPAYMENT_ENABLED,
            'sms_verification' => AUTOPAYMENT_SMS_VERIFICATION,
            'verification_timeout' => AUTOPAYMENT_VERIFICATION_TIMEOUT,
            'max_attempts' => AUTOPAYMENT_MAX_ATTEMPTS
        ],
        'notification' => [
            'email' => PAYMENT_NOTIFICATION_EMAIL,
            'sms' => PAYMENT_NOTIFICATION_SMS
        ],
        'refund' => [
            'enabled' => REFUND_ENABLED,
            'approval_required' => REFUND_APPROVAL_REQUIRED,
            'max_days' => REFUND_MAX_DAYS
        ]
    ];
    
    if ($payment_method && isset($config[$payment_method])) {
        return $config[$payment_method];
    }
    
    return $config;
}
