<?php
require_once __DIR__ . '/../includes/db/database.php';

class Category {
    private $conn;
    private $table_name = "categories";

    // Properties
    public $id;
    public $name;
    public $icon;

    // Constructor
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Get all categories
    public function getAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY name ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get a single category by ID
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get a single category by name
    public function getByName($name) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE name = :name LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get product count by category
    public function getProductCount($category_id) {
        $query = "SELECT COUNT(*) as total FROM products WHERE category_id = :category_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total'];
    }
}
?> 