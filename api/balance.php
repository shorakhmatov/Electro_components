// balance.php<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get database connection and models
require_once '../models/User.php';
require_once '../models/Transaction.php';

$user = new User();
$transaction = new Transaction();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if all required fields are present
    if (!isset($data->type) || !isset($data->amount) || !isset($data->payment_method)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    // Validate amount
    $amount = floatval($data->amount);
    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid amount']);
        exit;
    }

    // Create transaction
    $transactionId = $transaction->create(
        $_SESSION['user_id'],
        $data->type,
        $amount,
        $data->payment_method,
        isset($data->description) ? $data->description : ''
    );

    if ($transactionId) {
        // Complete transaction
        if ($transaction->complete($transactionId)) {
            // Get updated user data
            $userData = $user->getById($_SESSION['user_id']);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Transaction completed successfully',
                'transaction_id' => $transactionId,
                'new_balance' => $userData['balance']
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to complete transaction']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create transaction']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get user's transaction history
    $transactions = $transaction->getByUserId($_SESSION['user_id']);
    $userData = $user->getById($_SESSION['user_id']);

    http_response_code(200);
    echo json_encode([
        'balance' => $userData['balance'],
        'transactions' => $transactions
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
