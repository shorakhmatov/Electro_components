<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Получение ID баннера из запроса
    $id = $_POST['id'] ?? 0;
    
    // Проверка существования баннера и получение пути к изображению
    $check_stmt = $conn->prepare("SELECT image_url FROM banners WHERE id = ?");
    $check_stmt->execute([$id]);
    $banner = $check_stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$banner) {
        throw new Exception('Banner not found');
    }
    
    // Удаление изображения, если оно существует
    if (!empty($banner['image_url']) && file_exists('../../' . $banner['image_url'])) {
        unlink('../../' . $banner['image_url']);
    }
    
    // Удаление баннера из базы данных
    $stmt = $conn->prepare("DELETE FROM banners WHERE id = ?");
    $stmt->execute([$id]);
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success', 
        'message' => 'Banner deleted successfully'
    ]);
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
