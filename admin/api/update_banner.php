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
    
    // Получение данных из запроса
    $id = $_POST['id'] ?? 0;
    $title = $_POST['title'] ?? '';
    $subtitle = $_POST['subtitle'] ?? '';
    $link = $_POST['link'] ?? '';
    $is_active = isset($_POST['is_active']) ? 1 : 0;
    
    // Проверка существования баннера
    $check_stmt = $conn->prepare("SELECT image_url FROM banners WHERE id = ?");
    $check_stmt->execute([$id]);
    $banner = $check_stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$banner) {
        throw new Exception('Banner not found');
    }
    
    $image_url = $banner['image_url'];
    
    // Загрузка нового изображения, если оно предоставлено
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../../uploads/banners/';
        
        // Создаем директорию, если она не существует
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_name = time() . '_' . basename($_FILES['image']['name']);
        $target_file = $upload_dir . $file_name;
        
        // Перемещаем загруженный файл
        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            // Удаляем старое изображение, если оно существует
            if (!empty($image_url) && file_exists('../../' . $image_url)) {
                unlink('../../' . $image_url);
            }
            
            $image_url = '/uploads/banners/' . $file_name;
        } else {
            throw new Exception('Failed to upload image');
        }
    }
    
    // Обновление баннера в базе данных
    $stmt = $conn->prepare("UPDATE banners SET title = ?, subtitle = ?, image_url = ?, link = ?, is_active = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$title, $subtitle, $image_url, $link, $is_active, $id]);
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success', 
        'message' => 'Banner updated successfully', 
        'data' => [
            'id' => $id,
            'title' => $title,
            'subtitle' => $subtitle,
            'image_url' => $image_url,
            'link' => $link,
            'is_active' => $is_active
        ]
    ]);
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
