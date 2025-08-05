<?php
// Включаем отображение всех ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "Тестирование отправки письма через PHP mail() функцию\n";

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

// Формируем заголовки письма
$fromEmail = "daler.shd.03@gmail.com";
$fromName = "Electro Components";
$subject = "Подтверждение электронной почты";

$headers = "From: {$fromName} <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$fromEmail}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Создаем HTML-версию письма
$htmlContent = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Подтверждение электронной почты</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;'>
        <h2 style='color: #0066cc;'>Подтверждение электронной почты</h2>
        <p>Здравствуйте!</p>
        <p>Ваш код подтверждения электронной почты: <strong style='font-size: 18px; color: #0066cc;'>{$code}</strong></p>
        <p>Код действителен в течение 8 часов.</p>
        <p>Если вы не запрашивали этот код, пожалуйста, проигнорируйте это письмо.</p>
        <p>С уважением,<br>Команда Electro Components</p>
    </div>
</body>
</html>
";

// Пытаемся отправить письмо
$mailResult = mail($toEmail, $subject, $htmlContent, $headers);

// Выводим результат
if ($mailResult) {
    echo "Письмо успешно отправлено!\n";
} else {
    echo "Ошибка при отправке письма.\n";
    echo "Проверьте настройки PHP для отправки почты.\n";
}

echo "Завершено.\n";
?>
