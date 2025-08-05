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
            $stmt = $conn->query("SELECT id, full_name, email, phone, created_at FROM users ORDER BY id DESC");
            echo json_encode([
                'status' => 'success',
                'users' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ]);
            break;
            
        case 'search':
            $search = '%' . ($_GET['query'] ?? '') . '%';
            $stmt = $conn->prepare("SELECT id, full_name, email, phone, created_at 
                                  FROM users 
                                  WHERE full_name LIKE :search 
                                  OR email LIKE :search 
                                  OR phone LIKE :search");
            $stmt->execute([':search' => $search]);
            
            echo json_encode([
                'status' => 'success',
                'users' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ]);
            break;
            
        case 'reset_password':
            // Generate new random password
            $new_password = bin2hex(random_bytes(8));
            $password_hash = password_hash($new_password, PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("UPDATE users SET password_hash = :password_hash WHERE id = :id");
            $stmt->execute([
                ':password_hash' => $password_hash,
                ':id' => $_POST['user_id']
            ]);
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Пароль успешно сброшен',
                'new_password' => $new_password // This should be sent to user via secure channel
            ]);
            break;
            
        case 'export':
            require '../../vendor/autoload.php';
            
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            
            // Headers
            $sheet->setCellValue('A1', 'ID');
            $sheet->setCellValue('B1', 'ФИО');
            $sheet->setCellValue('C1', 'Email');
            $sheet->setCellValue('D1', 'Телефон');
            $sheet->setCellValue('E1', 'Дата регистрации');
            
            // Data
            $stmt = $conn->query("SELECT id, full_name, email, phone, created_at FROM users ORDER BY id");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $row = 2;
            foreach ($users as $user) {
                $sheet->setCellValue('A'.$row, $user['id']);
                $sheet->setCellValue('B'.$row, $user['full_name']);
                $sheet->setCellValue('C'.$row, $user['email']);
                $sheet->setCellValue('D'.$row, $user['phone']);
                $sheet->setCellValue('E'.$row, $user['created_at']);
                $row++;
            }
            
            // Generate file
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $filename = 'users_export_' . date('Y-m-d_H-i-s') . '.xlsx';
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
