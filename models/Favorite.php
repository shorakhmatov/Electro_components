<?php
require_once __DIR__ . '/../includes/db/database.php';

class Favorite {
    private $conn;
    private $table_name = "favorites";

    // Properties
    public $id;
    public $user_id;
    public $product_id;
    public $created_at;

    // Constructor
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Add product to favorites
    public function add($user_id, $product_id) {
        // Check if product already in favorites
        if ($this->exists($user_id, $product_id)) {
            return true;
        }

        $query = "INSERT INTO " . $this->table_name . " (user_id, product_id) 
                  VALUES (:user_id, :product_id)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':product_id', $product_id);

        return $stmt->execute();
    }

    // Remove product from favorites
    public function remove($user_id, $product_id) {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE user_id = :user_id AND product_id = :product_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':product_id', $product_id);

        return $stmt->execute();
    }

    // Check if a product is in favorites
    public function exists($user_id, $product_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id AND product_id = :product_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    // Get all favorite products for a user with product details
    public function getAll($user_id) {
        $query = "SELECT f.*, p.name, p.description, p.price, p.image_url, p.quantity as stock_quantity 
                  FROM " . $this->table_name . " f
                  LEFT JOIN products p ON f.product_id = p.id
                  WHERE f.user_id = :user_id
                  ORDER BY f.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get count of favorite products for a user
    public function getCount($user_id) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['count'] ?? 0;
    }

    // Toggle favorite status
    public function toggle($user_id, $product_id) {
        if ($this->exists($user_id, $product_id)) {
            return $this->remove($user_id, $product_id);
        } else {
            return $this->add($user_id, $product_id);
        }
    }
}
?> 