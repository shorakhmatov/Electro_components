<?php
session_start();
header('Content-Type: application/json');

require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$database = new Database();
$conn = $database->getConnection();

try {
    // Получение настроек магазина
    $query = "SELECT * FROM store_settings WHERE id = 1";
    $stmt = $conn->query($query);
    $settings = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($settings) {
        echo json_encode([
            'status' => 'success',
            'settings' => $settings
        ]);
    } else {
        throw new Exception('Настройки не найдены');
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
