<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set headers
header('Content-Type: application/json');

// Include the user model
require_once '../models/User.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Пользователь не авторизован']);
    exit;
}

// Get JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true) ?? [];

// Log received data for debugging
error_log("Profile API - Received data: " . print_r($data, true));
error_log("Profile API - Action: " . (isset($_GET['action']) ? $_GET['action'] : 'none'));

// Get action from URL parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';
$response = ['success' => false, 'message' => 'Неверное действие'];

switch ($action) {
    case 'update':
        // Update user profile
        $fullName = $data['fullName'] ?? '';
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        
        // Debug log
        error_log("Profile update data: fullName=$fullName, email=$email, phone=$phone");

        if (empty($fullName) || empty($email) || empty($phone)) {
            error_log("Empty fields: fullName=" . (empty($fullName) ? 'empty' : 'filled') . 
                     ", email=" . (empty($email) ? 'empty' : 'filled') . 
                     ", phone=" . (empty($phone) ? 'empty' : 'filled'));
            $response = ['success' => false, 'message' => 'Пожалуйста, заполните все поля'];
            break;
        }

        // Split name into parts
        $nameParts = explode(' ', $fullName);
        
        // Debug log
        error_log("Name parts: " . print_r($nameParts, true));
        
        // Ensure we have at least first and last name
        $firstName = $nameParts[0] ?? '';
        $lastName = $nameParts[1] ?? $firstName; // Use first name as last name if not provided
        $middleName = $nameParts[2] ?? '';

        $user = new User();
        error_log("Attempting to update user: userId={$_SESSION['user_id']}, firstName=$firstName, lastName=$lastName, middleName=$middleName, email=$email, phone=$phone");
        
        $result = $user->updateProfile($_SESSION['user_id'], $firstName, $lastName, $middleName, $email, $phone, '');
        error_log("Update result: " . ($result ? 'success' : 'failed'));

        if ($result) {
            // Update session variables
            $_SESSION['user_name'] = $firstName . ' ' . $lastName;
            $_SESSION['user_email'] = $email;

            $response = [
                'success' => true, 
                'message' => 'Профиль успешно обновлен',
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'name' => $fullName,
                    'email' => $email,
                    'phone' => $phone
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Ошибка обновления профиля. Возможно, такой email или телефон уже существует.'];
        }
        break;

    case 'get':
        // Get user profile data
        $user = new User();
        $userData = $user->getById($_SESSION['user_id']);

        if ($userData) {
            $fullName = $userData['last_name'] . ' ' . $userData['first_name'] . ' ' . $userData['middle_name'];
            $response = [
                'success' => true,
                'user' => [
                    'id' => $userData['id'],
                    'name' => $fullName,
                    'email' => $userData['email'],
                    'phone' => $userData['phone'],
                    'balance' => $userData['balance']
                ]
            ];
        } else {
            $response = ['success' => false, 'message' => 'Пользователь не найден'];
        }
        break;

    default:
        $response = ['success' => false, 'message' => 'Неизвестное действие'];
        break;
}

// Log response for debugging
error_log("Profile API response: " . json_encode($response));

// Return JSON response
echo json_encode($response);
?>
