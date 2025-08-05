// auth_check.php
<?php
function checkAuth() {
    $headers = getallheaders();
    $token = null;

    // Получаем токен из заголовка Authorization
    if (isset($headers['Authorization'])) {
        $auth_header = $headers['Authorization'];
        if (strpos($auth_header, 'Bearer ') === 0) {
            $token = substr($auth_header, 7);
        }
    }

    if (!$token) {
        return false;
    }

    try {
        require_once '../config/database.php';
        
        $stmt = $pdo->prepare("
            SELECT u.* 
            FROM users u
            WHERE u.token = :token
        ");
        
        $stmt->execute([':token' => $token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            return $user;
        }
    } catch (PDOException $e) {
        return false;
    }

    return false;
}
