// verify_email.php
<?php
// Включаем отображение всех ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Запускаем сессию, если она еще не запущена
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Режим тестирования - в этом режиме код будет показан в ответе
define('TEST_MODE', true);

// Логируем запрос
error_log("verify_email.php: Request received. Action: " . (isset($_GET['action']) ? $_GET['action'] : 'none') . ", Session user_id: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'not set'));

// Подключаем необходимые файлы
require_once '../models/User.php';
require_once '../models/EmailSender.php';

// Проверяем, авторизован ли пользователь
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Пользователь не авторизован']);
    exit;
}

// Получаем ID пользователя из сессии
$userId = $_SESSION['user_id'];

// Создаем экземпляр класса User
$user = new User();

// Загружаем конфигурацию электронной почты
$emailConfig = require_once '../config/email_config.php';

// Определяем действие на основе параметра запроса
$action = isset($_GET['action']) ? $_GET['action'] : '';

error_log("verify_email.php: Processing action: {$action}");

switch ($action) {
    case 'send_code':
        error_log("verify_email.php: Sending verification code for user ID: {$userId}");
        // Получаем данные пользователя
        $userData = $user->getById($userId);
        
        if (!$userData) {
            echo json_encode(['success' => false, 'message' => 'Пользователь не найден']);
            exit;
        }
        
        // Генерируем код подтверждения
        $code = $user->generateEmailVerificationCode($userId);
        
        if (!$code) {
            echo json_encode(['success' => false, 'message' => 'Ошибка при генерации кода подтверждения']);
            exit;
        }
        
        // Создаем экземпляр класса EmailSender
        error_log("verify_email.php: Creating EmailSender with API key: {$emailConfig['api_key']}, from: {$emailConfig['from_email']}");
        $emailSender = new EmailSender(
            $emailConfig['api_key'],
            $emailConfig['from_email'],
            $emailConfig['from_name']
        );
        
        // Формируем имя получателя
        $recipientName = trim($userData['first_name'] . ' ' . $userData['last_name']);
        if (empty($recipientName)) {
            $recipientName = 'Пользователь';
        }
        
        // Отправляем письмо с кодом подтверждения
        error_log("verify_email.php: Sending email to {$userData['email']} with code: {$code}");
        
        // В тестовом режиме мы не отправляем письмо, а просто считаем, что оно отправлено
        if (TEST_MODE) {
            error_log("verify_email.php: TEST MODE is enabled, skipping actual email sending");
            $emailSent = true;
        } else {
            $emailSent = $emailSender->sendVerificationEmail(
                $userData['email'],
                $recipientName,
                $code
            );
        }
        
        error_log("verify_email.php: Email sending result: " . ($emailSent ? 'success' : 'failed'));
        
        // Формируем ответ
        $response = [
            'success' => $emailSent,
            'message' => $emailSent ? 'Код подтверждения отправлен на вашу почту' : 'Не удалось отправить код подтверждения',
            'email' => $userData['email']
        ];
        
        // В тестовом режиме добавляем код в ответ
        if (TEST_MODE) {
            $response['test_code'] = $code;
            $response['message'] .= ' (Тестовый режим: код ' . $code . ')';
        }
        
        // Добавляем информацию об отправке письма
        if (!$emailSent) {
            $response['email_status'] = 'Ошибка при отправке письма';
            error_log("Failed to send verification email to {$userData['email']}");
        }
        
        echo json_encode($response);
        break;
        
    case 'verify_code':
        error_log("verify_email.php: Verifying code for user ID: {$userId}");
        // Получаем код из POST-запроса
        $code = isset($_POST['code']) ? $_POST['code'] : '';
        
        if (empty($code)) {
            echo json_encode(['success' => false, 'message' => 'Код подтверждения не указан']);
            exit;
        }
        
        // Проверяем код
        $verified = $user->verifyEmailCode($userId, $code);
        
        if ($verified) {
            echo json_encode(['success' => true, 'message' => 'Email успешно подтвержден']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Неверный код подтверждения или истек срок его действия']);
        }
        break;
        
    case 'check_status':
        error_log("verify_email.php: Checking verification status for user ID: {$userId}");
        // Проверяем статус подтверждения почты
        $isVerified = $user->isEmailVerified($userId);
        
        echo json_encode(['success' => true, 'verified' => $isVerified]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Неизвестное действие']);
}
?>
