// reset_password.php<?php
// Включаем отображение всех ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Запускаем сессию, если она еще не запущена
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Подключаем необходимые файлы
require_once '../models/User.php';
require_once '../models/EmailSender.php';
require_once '../config/email_config.php';

// Создаем экземпляр класса User
$user = new User();

// Получаем данные из POST-запроса
$data = json_decode(file_get_contents('php://input'), true);

// Определяем действие на основе параметра запроса
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Логируем запрос
error_log("reset_password.php: Request received. Action: {$action}");

// Обрабатываем запрос в зависимости от действия
switch ($action) {
    case 'request_reset':
        // Проверяем, что email или телефон предоставлены
        if (!isset($data['emailOrPhone']) || empty($data['emailOrPhone'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Пожалуйста, укажите email или телефон'
            ]);
            exit;
        }

        $emailOrPhone = $data['emailOrPhone'];
        error_log("reset_password.php: Request reset for: {$emailOrPhone}");

        // Проверяем, существует ли пользователь с таким email или телефоном
        $userData = $user->findByEmailOrPhone($emailOrPhone);
        
        if (!$userData) {
            echo json_encode([
                'success' => false,
                'message' => 'Пользователь с таким email или телефоном не найден'
            ]);
            exit;
        }

        // Генерируем токен для сброса пароля
        $resetToken = $user->generateResetToken($userData['id']);
        
        if (!$resetToken) {
            echo json_encode([
                'success' => false,
                'message' => 'Ошибка при создании токена для сброса пароля'
            ]);
            exit;
        }

        // Формируем ссылку для сброса пароля
        $resetLink = "http://{$_SERVER['HTTP_HOST']}/reset_password.php?token=" . $resetToken;
        
        // Загружаем конфигурацию электронной почты
        $emailConfig = require_once '../config/email_config.php';
        
        // Создаем экземпляр класса EmailSender
        $emailSender = new EmailSender(
            $emailConfig['api_key'],
            $emailConfig['from_email'],
            $emailConfig['from_name']
        );
        
        // Определяем имя получателя
        $recipientName = $userData['name'] ?? 'Пользователь';
        
        // Отправляем письмо со ссылкой для сброса пароля
        $emailSent = $emailSender->sendPasswordResetEmail(
            $userData['email'],
            $recipientName,
            $resetLink
        );
        
        // Формируем ответ
        if ($emailSent) {
            echo json_encode([
                'success' => true,
                'message' => 'Инструкции по восстановлению пароля отправлены на вашу почту'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Не удалось отправить инструкции по восстановлению пароля'
            ]);
        }
        break;
        
    case 'reset_password':
        // Проверяем, что токен и новый пароль предоставлены
        if (!isset($data['token']) || empty($data['token']) || 
            !isset($data['newPassword']) || empty($data['newPassword'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Недостаточно данных для сброса пароля'
            ]);
            exit;
        }

        $token = $data['token'];
        $newPassword = $data['newPassword'];
        
        error_log("reset_password.php: Reset password with token: {$token}");

        // Проверяем токен и сбрасываем пароль
        $resetResult = $user->resetPasswordWithToken($token, $newPassword);
        
        if ($resetResult) {
            echo json_encode([
                'success' => true,
                'message' => 'Пароль успешно изменен'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Не удалось сбросить пароль. Токен недействителен или срок его действия истек'
            ]);
        }
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'message' => 'Неизвестное действие'
        ]);
}
?>
