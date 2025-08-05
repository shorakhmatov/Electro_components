//test_email.php
<?php
// Включаем отображение всех ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Подключаем необходимые файлы
require_once 'models/EmailSender.php';

// Загружаем конфигурацию электронной почты
$emailConfig = require_once 'config/email_config.php';

echo "Тестирование отправки письма с кодом подтверждения\n";
echo "API ключ: " . substr($emailConfig['api_key'], 0, 10) . "...\n";
echo "От: " . $emailConfig['from_email'] . "\n";

// Создаем экземпляр класса EmailSender
$emailSender = new EmailSender(
    $emailConfig['api_key'],
    $emailConfig['from_email'],
    $emailConfig['from_name']
);

// Запрашиваем у пользователя email для отправки
if (isset($argv[1])) {
    $toEmail = $argv[1];
} else {
    echo "Введите email для отправки: ";
    $toEmail = trim(fgets(STDIN));
}

// Генерируем код подтверждения
$code = sprintf('%06d', mt_rand(1, 999999));

echo "Отправка кода подтверждения {$code} на email {$toEmail}...\n";

// Отправляем письмо с кодом подтверждения
$result = $emailSender->sendVerificationEmail(
    $toEmail,
    'Пользователь',
    $code
);

// Выводим результат
if ($result) {
    echo "Письмо успешно отправлено!\n";
} else {
    echo "Ошибка при отправке письма.\n";
    echo "Проверьте логи для получения дополнительной информации.\n";
}

echo "Завершено.\n";
?>
