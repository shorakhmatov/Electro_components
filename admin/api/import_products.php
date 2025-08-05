<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Проверка наличия данных
$json_data = file_get_contents('php://input');
if (empty($json_data)) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'No data received']);
    exit;
}

try {
    // Преобразование JSON в массив
    $data = json_decode($json_data, true);
    
    // Запись входящих данных в файл для отладки
    file_put_contents('import_debug.log', "Received data: " . print_r($data, true));
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data: ' . json_last_error_msg()]);
        exit;
    }
    
    // Проверка структуры данных
    if (!isset($data['headers']) || !isset($data['rows']) || empty($data['rows'])) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Invalid data structure']);
        exit;
    }
    
    $headers = $data['headers'];
    $rows = $data['rows'];
    
    // Запись данных в файл для отладки
    file_put_contents('import_headers.log', "Headers: " . print_r($headers, true));
    file_put_contents('import_rows.log', "First 3 rows: " . print_r(array_slice($rows, 0, 3), true));
    
    // Проверка структуры данных
    if (empty($rows)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Data does not contain rows']);
        exit;
    }
    
    // Создаем маппинг заголовков
    $header_mapping = [];
    foreach ($headers as $index => $header) {
        $header_lower = strtolower($header);
        $header_mapping[$header_lower] = $index;
    }
    
    // Запись маппинга в файл для отладки
    file_put_contents('header_mapping.log', "Header mapping: " . print_r($header_mapping, true));
    
    $database = new Database();
    $conn = $database->getConnection();
    
    // Начало транзакции
    $conn->beginTransaction();
    
    $imported_count = 0;
    $errors = [];
    
    // Запись в лог количества строк для обработки
    file_put_contents('rows_count.log', "Total rows to process: " . count($rows));
    
    // Обработка каждой строки данных
    foreach ($rows as $i => $row) {
        // Пропускаем пустые строки
        if (empty($row)) {
            file_put_contents('row_error.log', "Row $i: Empty row", FILE_APPEND);
            continue;
        }
        
        // Запись текущей строки в лог
        file_put_contents('row_data.log', "Row $i: " . print_r($row, true), FILE_APPEND);
        
        // Извлекаем данные из строки
        $name = isset($header_mapping['name']) && isset($row[$header_mapping['name']]) ? trim($row[$header_mapping['name']]) : '';
        $price_str = isset($header_mapping['price']) && isset($row[$header_mapping['price']]) ? $row[$header_mapping['price']] : 0;
        $price = floatval(str_replace(',', '.', $price_str));
        $quantity_str = isset($header_mapping['quantity']) && isset($row[$header_mapping['quantity']]) ? $row[$header_mapping['quantity']] : 0;
        $quantity = intval($quantity_str);
        $description = isset($header_mapping['description']) && isset($row[$header_mapping['description']]) ? trim($row[$header_mapping['description']]) : '';
        $specifications = isset($header_mapping['specifications']) && isset($row[$header_mapping['specifications']]) ? trim($row[$header_mapping['specifications']]) : '';
        
        // Получаем данные о категории
        $category_name = isset($header_mapping['category']) && isset($row[$header_mapping['category']]) ? trim($row[$header_mapping['category']]) : '';
        $category_id_str = isset($header_mapping['category_id']) && isset($row[$header_mapping['category_id']]) ? $row[$header_mapping['category_id']] : 0;
        $category_id = intval($category_id_str);
        
        // Запись извлеченных данных в лог
        file_put_contents('extracted_data.log', "Row $i: name=$name, price=$price, quantity=$quantity, category_name=$category_name, category_id=$category_id\n", FILE_APPEND);
        
        // Проверка обязательных полей
        if (empty($name)) {
            $errors[] = "Row $i: Product name is required";
            file_put_contents('validation_errors.log', "Row $i: Product name is required\n", FILE_APPEND);
            continue;
        }
        
        if ($price <= 0) {
            $errors[] = "Row $i: Price must be greater than zero";
            file_put_contents('validation_errors.log', "Row $i: Price must be greater than zero\n", FILE_APPEND);
            continue;
        }
        
        if ($quantity <= 0) {
            $errors[] = "Row $i: Quantity must be greater than zero";
            file_put_contents('validation_errors.log', "Row $i: Quantity must be greater than zero\n", FILE_APPEND);
            continue;
        }
        
        // Обработка категории
        file_put_contents('category_processing.log', "Row $i: Processing category - category_id=$category_id, category_name=$category_name\n", FILE_APPEND);
        
        try {
            // Если указан ID категории
            if ($category_id > 0) {
                file_put_contents('category_processing.log', "Row $i: Using category ID $category_id\n", FILE_APPEND);
                
                // Проверяем, существует ли категория с таким ID
                $query = "SELECT id, name FROM categories WHERE id = :id";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':id', $category_id);
                $stmt->execute();
                $category = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$category) {
                    // Если категории с таким ID нет, создаем новую
                    file_put_contents('category_processing.log', "Row $i: Category with ID $category_id not found, creating new category\n", FILE_APPEND);
                    
                    $category_name_to_use = !empty($category_name) ? $category_name : "Category " . $category_id;
                    
                    $query = "INSERT INTO categories (id, name, icon) VALUES (:id, :name, 'fas fa-tag')";
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':id', $category_id);
                    $stmt->bindParam(':name', $category_name_to_use);
                    $stmt->execute();
                    
                    file_put_contents('category_processing.log', "Row $i: Created new category with ID $category_id and name '$category_name_to_use'\n", FILE_APPEND);
                } else {
                    file_put_contents('category_processing.log', "Row $i: Found existing category with ID $category_id: {$category['name']}\n", FILE_APPEND);
                }
            } 
            // Если указано только имя категории
            else if (!empty($category_name)) {
                file_put_contents('category_processing.log', "Row $i: Using category name '$category_name'\n", FILE_APPEND);
                
                // Проверяем, существует ли категория с таким именем
                $query = "SELECT id FROM categories WHERE name = :name";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':name', $category_name);
                $stmt->execute();
                $category = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$category) {
                    // Создаем новую категорию
                    file_put_contents('category_processing.log', "Row $i: Category with name '$category_name' not found, creating new category\n", FILE_APPEND);
                    
                    $query = "INSERT INTO categories (name, icon) VALUES (:name, 'fas fa-tag')";
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':name', $category_name);
                    $stmt->execute();
                    $category_id = $conn->lastInsertId();
                    
                    file_put_contents('category_processing.log', "Row $i: Created new category with ID $category_id and name '$category_name'\n", FILE_APPEND);
                } else {
                    $category_id = $category['id'];
                    file_put_contents('category_processing.log', "Row $i: Found existing category with name '$category_name': ID $category_id\n", FILE_APPEND);
                }
            } 
            // Если не указаны ни ID, ни имя категории, используем категорию по умолчанию
            else {
                file_put_contents('category_processing.log', "Row $i: No category information provided, using default category\n", FILE_APPEND);
                
                // Проверяем, существует ли категория по умолчанию (ID 1)
                $query = "SELECT id FROM categories WHERE id = 1";
                $stmt = $conn->prepare($query);
                $stmt->execute();
                $category = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (!$category) {
                    // Создаем категорию по умолчанию
                    file_put_contents('category_processing.log', "Row $i: Default category (ID 1) not found, creating it\n", FILE_APPEND);
                    
                    $default_category_name = "Default Category";
                    $query = "INSERT INTO categories (id, name, icon) VALUES (1, :name, 'fas fa-tag')";
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':name', $default_category_name);
                    $stmt->execute();
                    
                    file_put_contents('category_processing.log', "Row $i: Created default category with ID 1\n", FILE_APPEND);
                }
                
                $category_id = 1; // Используем категорию по умолчанию
            }
            
            file_put_contents('category_processing.log', "Row $i: Final category_id: $category_id\n", FILE_APPEND);
            
            // Добавление товара
            file_put_contents('product_processing.log', "Row $i: Adding product - name=$name, category_id=$category_id, price=$price, quantity=$quantity\n", FILE_APPEND);
            
            // Добавляем новый товар
            $query = "INSERT INTO products (category_id, name, description, price, quantity, specifications) VALUES (:category_id, :name, :description, :price, :quantity, :specifications)";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':category_id', $category_id);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':specifications', $specifications);
            $stmt->execute();
            
            $new_product_id = $conn->lastInsertId();
            file_put_contents('product_processing.log', "Row $i: Successfully added new product with ID $new_product_id\n", FILE_APPEND);
            
            $imported_count++;
        } catch (PDOException $e) {
            $error_message = $e->getMessage();
            file_put_contents('error.log', "Row $i: Error - $error_message\n", FILE_APPEND);
            $errors[] = "Row $i: Error: $error_message";
            continue;
        }
    }
    
    // Фиксация транзакции
    $conn->commit();
    
    // Запись результатов импорта в лог
    file_put_contents('import_result.log', "Import completed. Imported: $imported_count, Errors: " . count($errors) . "\n");
    if (!empty($errors)) {
        file_put_contents('import_errors.log', "Import errors:\n" . implode("\n", $errors));
    }
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Products imported successfully',
        'imported_count' => $imported_count,
        'errors' => $errors
    ]);
} catch (Exception $e) {
    // Откат транзакции в случае ошибки
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    
    $error_message = $e->getMessage();
    file_put_contents('fatal_error.log', "Fatal error: $error_message\n");
    
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $error_message]);
}
?>
