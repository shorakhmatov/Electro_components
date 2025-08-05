// auth_status.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set headers
header('Content-Type: application/json');

// Check if user is logged in
$isLoggedIn = isset($_SESSION['user_id']);

// Return response
echo json_encode([
    'success' => true,
    'logged_in' => $isLoggedIn,
    'user_id' => $isLoggedIn ? $_SESSION['user_id'] : null
]);
?>
