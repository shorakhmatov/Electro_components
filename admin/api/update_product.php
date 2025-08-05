<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Получение данных из запроса
$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$category_id = isset($_POST['category_id']) ? intval($_POST['category_id']) : 0;
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$specifications = isset($_POST['specifications']) ? trim($_POST['specifications']) : '';
$price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
$quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 0;

// Проверка валидности данных
if ($id <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid product ID']);
    exit;
}

if (empty($name)) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Product name is required']);
    exit;
}

if ($category_id <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Valid category is required']);
    exit;
}

if ($price <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Price must be greater than zero']);
    exit;
}

if ($quantity < 0) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Stock quantity cannot be negative']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Проверка, существует ли товар
    $query = "SELECT image_url, name FROM products WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$product) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Product not found']);
        exit;
    }
    
    // Проверка, если имя товара изменилось, то проверяем на уникальность
    if ($product['name'] !== $name) {
        // Проверка, существует ли товар с таким именем
        $query = "SELECT id FROM products WHERE name = :name AND id != :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'Товар с таким названием уже существует']);
            exit;
        }
    }
    
    // Проверка, существует ли категория
    $query = "SELECT id FROM categories WHERE id = :category_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Category not found']);
        exit;
    }
    
    // Обработка изображения
    $image_url = $product['image_url']; // Используем существующий URL изображения по умолчанию
    
    // Проверяем, какой вариант выбран: загрузка файла или ссылка
    $image_option = isset($_POST['imageOption']) ? $_POST['imageOption'] : 'upload';
    
    if ($image_option === 'url' && isset($_POST['image_url']) && !empty($_POST['image_url'])) {
        // Используем ссылку на изображение
        $image_url = trim($_POST['image_url']);
    } elseif ($image_option === 'upload' && isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        // Загружаем файл
        $upload_dir = '../../uploads/products/';
        
        // Создаем директорию, если она не существует
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_name = time() . '_' . basename($_FILES['image']['name']);
        $target_file = $upload_dir . $file_name;
        
        // Проверка типа файла
        $file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (!in_array($file_type, $allowed_types)) {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'Only JPG, JPEG, PNG & GIF files are allowed']);
            exit;
        }
        
        // Загрузка файла
        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            // Удаляем старое изображение, если оно существует и находится в нашей директории
            if (!empty($product['image_url']) && strpos($product['image_url'], '/uploads/products/') === 0 && file_exists('../../' . ltrim($product['image_url'], '/'))) {
                unlink('../../' . ltrim($product['image_url'], '/'));
            }
            
            $image_url = '/uploads/products/' . $file_name;
        } else {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'Failed to upload image']);
            exit;
        }
    }
    // Если ни один из вариантов не выбран, оставляем текущий URL изображения
    
    // Обновление товара
    $query = "
        UPDATE products
        SET category_id = :category_id,
            name = :name,
            description = :description,
            specifications = :specifications,
            price = :price,
            quantity = :quantity,
            image_url = :image_url
        WHERE id = :id
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':category_id', $category_id);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':specifications', $specifications);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':quantity', $quantity);
    $stmt->bindParam(':image_url', $image_url);
    $stmt->execute();
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Product updated successfully'
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
