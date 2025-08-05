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

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'list':
            $stmt = $conn->query("SELECT p.*, c.name as category_name 
                                FROM products p 
                                JOIN categories c ON p.category_id = c.id 
                                ORDER BY p.id DESC");
            echo json_encode([
                'status' => 'success',
                'products' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ]);
            break;
            
        case 'add':
            // Handle product image upload
            $image_url = null;
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = '../../assets/images/products/';
                $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $file_name = 'product_' . time() . '.' . $file_extension;
                $target_path = $upload_dir . $file_name;
                
                if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
                    $image_url = 'assets/images/products/' . $file_name;
                }
            }
            
            $stmt = $conn->prepare("INSERT INTO products (category_id, name, description, price, stock_quantity, image_url) 
                                  VALUES (:category_id, :name, :description, :price, :stock_quantity, :image_url)");
                                  
            $stmt->execute([
                ':category_id' => $_POST['category_id'],
                ':name' => $_POST['name'],
                ':description' => $_POST['description'],
                ':price' => $_POST['price'],
                ':stock_quantity' => $_POST['stock_quantity'],
                ':image_url' => $image_url
            ]);
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Товар успешно добавлен'
            ]);
            break;
            
        case 'update':
            $query = "UPDATE products SET 
                     category_id = :category_id,
                     name = :name,
                     description = :description,
                     price = :price,
                     stock_quantity = :stock_quantity";
            
            // Handle image update if present
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = '../../assets/images/products/';
                $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $file_name = 'product_' . time() . '.' . $file_extension;
                $target_path = $upload_dir . $file_name;
                
                if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
                    $image_url = 'assets/images/products/' . $file_name;
                    $query .= ", image_url = :image_url";
                }
            }
            
            $query .= " WHERE id = :id";
            $stmt = $conn->prepare($query);
            
            $params = [
                ':id' => $_POST['id'],
                ':category_id' => $_POST['category_id'],
                ':name' => $_POST['name'],
                ':description' => $_POST['description'],
                ':price' => $_POST['price'],
                ':stock_quantity' => $_POST['stock_quantity']
            ];
            
            if (isset($image_url)) {
                $params[':image_url'] = $image_url;
            }
            
            $stmt->execute($params);
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Товар успешно обновлен'
            ]);
            break;
            
        case 'delete':
            $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Товар успешно удален'
            ]);
            break;
            
        case 'export':
            // Generate Excel file
            require '../../vendor/autoload.php'; // You'll need PHPSpreadsheet
            
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            
            // Headers
            $sheet->setCellValue('A1', 'ID');
            $sheet->setCellValue('B1', 'Категория');
            $sheet->setCellValue('C1', 'Название');
            $sheet->setCellValue('D1', 'Описание');
            $sheet->setCellValue('E1', 'Цена');
            $sheet->setCellValue('F1', 'Количество');
            
            // Data
            $stmt = $conn->query("SELECT p.*, c.name as category_name 
                                FROM products p 
                                JOIN categories c ON p.category_id = c.id 
                                ORDER BY p.id");
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $row = 2;
            foreach ($products as $product) {
                $sheet->setCellValue('A'.$row, $product['id']);
                $sheet->setCellValue('B'.$row, $product['category_name']);
                $sheet->setCellValue('C'.$row, $product['name']);
                $sheet->setCellValue('D'.$row, $product['description']);
                $sheet->setCellValue('E'.$row, $product['price']);
                $sheet->setCellValue('F'.$row, $product['stock_quantity']);
                $row++;
            }
            
            // Generate file
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $filename = 'products_export_' . date('Y-m-d_H-i-s') . '.xlsx';
            $filepath = '../../exports/' . $filename;
            $writer->save($filepath);
            
            echo json_encode([
                'status' => 'success',
                'file' => 'exports/' . $filename
            ]);
            break;
            
        default:
            throw new Exception('Invalid action');
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
