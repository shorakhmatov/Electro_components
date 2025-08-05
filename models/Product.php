<?php
require_once __DIR__ . '/../includes/db/database.php';

class Product {
    private $conn;
    private $table_name = "products";

    // Properties
    public $id;
    public $category_id;
    public $name;
    public $description;
    public $specifications;
    public $price;
    public $quantity;
    public $image_url;

    // Constructor
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Get all products
    public function getAll($limit = 12, $offset = 0) {
        $query = "SELECT p.*, c.name as category_name 
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  ORDER BY p.id ASC
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get popular products (random selection from all categories)
    public function getPopular($limit = 6) {
        $query = "SELECT p.*, c.name as category_name 
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  ORDER BY RAND()
                  LIMIT :limit";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get products by category
    public function getByCategory($category_id, $limit = 12, $offset = 0) {
        $query = "SELECT p.*, c.name as category_name 
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.category_id = :category_id
                  ORDER BY p.id ASC
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get a single product by ID
    public function getById($id) {
        $query = "SELECT p.*, c.name as category_name 
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Search for products
    public function search($keyword, $limit = 12, $offset = 0) {
        // Проверяем подключение к базе данных
        if (!$this->conn) {
            $database = new Database();
            $this->conn = $database->getConnection();
        }
        
        // Преобразуем ключевое слово для поиска
        $keyword = trim($keyword);
        
        // Если ключевое слово пустое, возвращаем пустой массив
        if (empty($keyword)) {
            return [];
        }
        
        // Поиск только по названию товара
        $query = "SELECT p.*, c.name as category_name 
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE p.name LIKE :keyword
                  ORDER BY p.name ASC
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        
        // Привязываем параметры
        $searchKeyword = "%{$keyword}%";
        $stmt->bindParam(':keyword', $searchKeyword, PDO::PARAM_STR);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        
        // Добавляем отладочную информацию
        error_log("Search query: {$query} with keyword: {$searchKeyword}");
        
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Если ничего не нашли, пробуем вернуть все товары
        if (empty($results)) {
            error_log("No results found, returning all products");
            // Возвращаем все товары с ограничением
            $query = "SELECT p.*, c.name as category_name 
                      FROM " . $this->table_name . " p
                      LEFT JOIN categories c ON p.category_id = c.id
                      ORDER BY p.name ASC
                      LIMIT :limit OFFSET :offset";
                      
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        return $results;
    }

    // Get count of search results
    public function countSearchResults($keyword) {
        // Проверяем подключение к базе данных
        if (!$this->conn) {
            $database = new Database();
            $this->conn = $database->getConnection();
        }
        
        // Преобразуем ключевое слово для поиска
        $keyword = trim($keyword);
        
        // Если ключевое слово пустое, возвращаем 0
        if (empty($keyword)) {
            return 0;
        }
        
        // Поиск только по названию товара
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name . " WHERE name LIKE :keyword";
        
        $stmt = $this->conn->prepare($query);
        
        // Привязываем параметры
        $searchKeyword = "%{$keyword}%";
        $stmt->bindParam(':keyword', $searchKeyword, PDO::PARAM_STR);
        
        // Добавляем отладочную информацию
        error_log("Count search query: {$query} with keyword: {$searchKeyword}");
        
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $count = (int)$row['total'];
        
        // Если ничего не нашли, возвращаем общее количество товаров
        if ($count == 0) {
            error_log("No count results found, returning total product count");
            $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = (int)$row['total'];
        }
        
        return $count;
    }
    
    // Get count of products by category
    public function countByCategory($category_id) {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name . " WHERE category_id = :category_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total'];
    }
    
    // Get products on sale (with discount)
    public function getOnSale($limit = 12, $offset = 0) {
        // Так как в базе данных может не быть поля discount,
        // мы будем симулировать скидки для некоторых товаров
        $query = "SELECT p.*, c.name as category_name,
                  CASE 
                    WHEN p.id % 3 = 0 THEN ROUND(p.price * 0.85) 
                    WHEN p.id % 5 = 0 THEN ROUND(p.price * 0.9) 
                    ELSE p.price 
                  END as sale_price,
                  CASE 
                    WHEN p.id % 3 = 0 THEN 15 
                    WHEN p.id % 5 = 0 THEN 10 
                    ELSE 0 
                  END as discount,
                  CASE 
                    WHEN p.id % 3 = 0 OR p.id % 5 = 0 THEN p.price 
                    ELSE 0 
                  END as old_price
                  FROM " . $this->table_name . " p
                  LEFT JOIN categories c ON p.category_id = c.id
                  HAVING discount > 0
                  ORDER BY discount DESC, p.name ASC
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Обновляем цены с учетом скидок
        foreach ($products as &$product) {
            $product['price'] = $product['sale_price'];
            unset($product['sale_price']);
        }
        
        return $products;
    }
}
?> 