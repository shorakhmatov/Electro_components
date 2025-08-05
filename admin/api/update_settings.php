<?php
session_start();
header('Content-Type: application/json');

require_once '../../config/database.php';

// Check if superadmin is logged in
if (!isset($_SESSION['superadmin_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$database = new Database();
$conn = $database->getConnection();

try {
    // Handle logo upload if present
    $logo_url = null;
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../../assets/images/';
        $file_extension = pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION);
        $file_name = 'logo_' . time() . '.' . $file_extension;
        $target_path = $upload_dir . $file_name;
        
        // Check if file is an image
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($_FILES['logo']['type'], $allowed_types)) {
            throw new Exception('Неверный формат файла. Разрешены только JPEG, PNG и GIF');
        }
        
        if (move_uploaded_file($_FILES['logo']['tmp_name'], $target_path)) {
            $logo_url = 'assets/images/' . $file_name;
        }
    }
    
    // Получаем дополнительные настройки
    $email = isset($_POST['contact_email']) ? $_POST['contact_email'] : '';
    $phone = isset($_POST['contact_phone']) ? $_POST['contact_phone'] : '';
    $address = isset($_POST['contact_address']) ? $_POST['contact_address'] : '';
    $delivery_cost = isset($_POST['delivery_cost']) ? floatval($_POST['delivery_cost']) : 0;
    $free_delivery_threshold = isset($_POST['free_delivery_threshold']) ? floatval($_POST['free_delivery_threshold']) : 0;
    $meta_description = isset($_POST['meta_description']) ? $_POST['meta_description'] : '';
    $meta_keywords = isset($_POST['meta_keywords']) ? $_POST['meta_keywords'] : '';
    
    // Обновляем таблицу store_settings
    // Сначала проверим, есть ли необходимые столбцы
    $columnsQuery = "SHOW COLUMNS FROM store_settings LIKE 'contact_email'";
    $stmt = $conn->query($columnsQuery);
    
    // Если столбцы не существуют, добавляем их
    if ($stmt->rowCount() == 0) {
        $alterQuery = "ALTER TABLE store_settings 
                       ADD COLUMN contact_email VARCHAR(100) DEFAULT '',
                       ADD COLUMN contact_phone VARCHAR(20) DEFAULT '',
                       ADD COLUMN contact_address TEXT,
                       ADD COLUMN delivery_cost DECIMAL(10,2) DEFAULT 0.00,
                       ADD COLUMN free_delivery_threshold DECIMAL(10,2) DEFAULT 0.00,
                       ADD COLUMN meta_description TEXT,
                       ADD COLUMN meta_keywords VARCHAR(255) DEFAULT ''";
        $conn->exec($alterQuery);
    }
    
    // Теперь обновляем настройки
    $query = "UPDATE store_settings SET 
              store_name = :store_name,
              primary_color = :primary_color,
              secondary_color = :secondary_color,
              background_color = :background_color,
              contact_email = :contact_email,
              contact_phone = :contact_phone,
              contact_address = :contact_address,
              delivery_cost = :delivery_cost,
              free_delivery_threshold = :free_delivery_threshold,
              meta_description = :meta_description,
              meta_keywords = :meta_keywords";
    
    if ($logo_url) {
        $query .= ", logo_url = :logo_url";
    }
    
    $query .= " WHERE id = 1";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':store_name', $_POST['store_name']);
    $stmt->bindParam(':primary_color', $_POST['primary_color']);
    $stmt->bindParam(':secondary_color', $_POST['secondary_color']);
    $stmt->bindParam(':background_color', $_POST['background_color']);
    $stmt->bindParam(':contact_email', $email);
    $stmt->bindParam(':contact_phone', $phone);
    $stmt->bindParam(':contact_address', $address);
    $stmt->bindParam(':delivery_cost', $delivery_cost);
    $stmt->bindParam(':free_delivery_threshold', $free_delivery_threshold);
    $stmt->bindParam(':meta_description', $meta_description);
    $stmt->bindParam(':meta_keywords', $meta_keywords);
    
    if ($logo_url) {
        $stmt->bindParam(':logo_url', $logo_url);
    }
    
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Настройки успешно обновлены'
        ]);
    } else {
        throw new Exception('Ошибка при обновлении настроек');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
