<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Проверка наличия ID баннера
if (!isset($_GET['id']) || empty($_GET['id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Banner ID is required']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    $id = $_GET['id'];
    
    $stmt = $conn->prepare("SELECT * FROM banners WHERE id = ?");
    $stmt->execute([$id]);
    $banner = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$banner) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Banner not found']);
        exit;
    }
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => $banner]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
