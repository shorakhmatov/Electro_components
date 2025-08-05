// auth.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set headers
header('Content-Type: application/json');

// Include the user model
require_once '../models/User.php';

// Get JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true) ?? [];

// Log received data for debugging
error_log("Received data: " . print_r($data, true));
error_log("Action: " . (isset($_GET['action']) ? $_GET['action'] : 'none'));

// Get action from URL parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';
$response = ['success' => false, 'message' => 'Invalid action'];

switch ($action) {
    case 'login':
        // Login user
        $emailOrPhone = $data['emailOrPhone'] ?? $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($emailOrPhone) || empty($password)) {
            $response = ['success' => false, 'message' => 'Пожалуйста, заполните все поля'];
            break;
        }

        // Очищаем телефон от форматирования, если это телефон
        $isPhone = false;
        if (preg_match('/^\+7[-\(\)\d\s]+$/', $emailOrPhone)) {
            $isPhone = true;
            $emailOrPhone = preg_replace('/\D/', '', $emailOrPhone);
            // Если номер начинается с 7, то добавляем + в начало
            if (strlen($emailOrPhone) === 11 && $emailOrPhone[0] === '7') {
                $emailOrPhone = '+' . $emailOrPhone;
            }
            error_log("Login with phone: $emailOrPhone");
        } else {
            error_log("Login with email: $emailOrPhone");
        }

        $user = new User();
        $userData = $isPhone ? $user->loginWithPhone($emailOrPhone, $password) : $user->login($emailOrPhone, $password);

        if ($userData) {
            // Set session variables
            $_SESSION['user_id'] = $userData['id'];
            $_SESSION['user_name'] = $userData['first_name'] . ' ' . $userData['last_name'];
            $_SESSION['user_email'] = $userData['email'];
            $_SESSION['user_balance'] = $userData['balance'];

            $response = [
                'success' => true, 
                'message' => 'Вы успешно вошли в систему',
                'user' => [
                    'id' => $userData['id'],
                    'name' => $userData['first_name'] . ' ' . $userData['last_name'],
                    'email' => $userData['email'],
                    'balance' => $userData['balance']
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Неверный email или пароль'];
        }
        break;

    case 'register':
        // Register new user
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        $password = $data['password'] ?? '';
        $terms = $data['terms'] ?? '';
        
        // Debug log
        error_log("Register data: name=$name, email=$email, phone=$phone, terms=$terms");

        if (empty($name) || empty($email) || empty($phone) || empty($password)) {
            error_log("Empty fields: name=" . (empty($name) ? 'empty' : 'filled') . 
                     ", email=" . (empty($email) ? 'empty' : 'filled') . 
                     ", phone=" . (empty($phone) ? 'empty' : 'filled') . 
                     ", password=" . (empty($password) ? 'empty' : 'filled'));
            $response = ['success' => false, 'message' => 'Пожалуйста, заполните все поля'];
            break;
        }

        // Проверяем согласие с обработкой персональных данных
        if ($terms !== 'accepted' && $terms !== true && $terms !== 'true' && $terms !== 1 && $terms !== '1') {
            error_log("Terms not accepted: terms=$terms (type: " . gettype($terms) . ")");
            $response = ['success' => false, 'message' => 'Необходимо согласие на обработку персональных данных'];
            break;
        }

        // Split name into parts
        $nameParts = explode(' ', $name);
        
        // Debug log
        error_log("Name parts: " . print_r($nameParts, true));
        
        // Ensure we have at least first and last name
        $firstName = $nameParts[0] ?? '';
        $lastName = $nameParts[1] ?? $firstName; // Use first name as last name if not provided
        $middleName = $nameParts[2] ?? '';

        $user = new User();
        error_log("Attempting to register user: firstName=$firstName, lastName=$lastName, middleName=$middleName, email=$email, phone=$phone");
        $userId = $user->register($firstName, $lastName, $middleName, $email, $phone, $password);
        error_log("Register result: userId=" . ($userId ? $userId : 'failed'));

        if ($userId) {
            // Set session variables
            $_SESSION['user_id'] = $userId;
            $_SESSION['user_name'] = $firstName . ' ' . $lastName;
            $_SESSION['user_email'] = $email;
            $_SESSION['user_balance'] = 0;

            $response = [
                'success' => true, 
                'message' => 'Вы успешно зарегистрировались',
                'user' => [
                    'id' => $userId,
                    'name' => $firstName . ' ' . $lastName,
                    'email' => $email,
                    'balance' => 0
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Ошибка регистрации. Возможно, такой email или телефон уже существует.'];
        }
        break;

    case 'logout':
        // Logout user
        session_unset();
        session_destroy();
        $response = ['success' => true, 'message' => 'Вы вышли из системы'];
        break;

    case 'check':
        // Check if user is logged in
        if (isset($_SESSION['user_id'])) {
            $response = [
                'success' => true, 
                'logged_in' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'name' => $_SESSION['user_name'],
                    'email' => $_SESSION['user_email'],
                    'balance' => $_SESSION['user_balance']
                ]
            ];
        } else {
            $response = ['success' => true, 'logged_in' => false];
        }
        break;

    default:
        $response = ['success' => false, 'message' => 'Неизвестное действие'];
        break;
}

// Log response for debugging
error_log("Auth response: " . json_encode($response));

// Return JSON response
echo json_encode($response);
?>
