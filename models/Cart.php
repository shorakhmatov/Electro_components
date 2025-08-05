<?php
require_once __DIR__ . '/../includes/db/database.php';

class Cart {
    private $conn;
    private $table_name = "cart";

    // Properties
    public $id;
    public $user_id;
    public $product_id;
    public $quantity;
    public $created_at;
    public $updated_at;

    // Constructor
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Add item to cart or update quantity if it already exists
    public function addItem($user_id, $product_id, $quantity = 1) {
        // Check if product exists in cart
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id AND product_id = :product_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':product_id', $product_id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // Update quantity
            $query = "UPDATE " . $this->table_name . " 
                      SET quantity = quantity + :quantity, updated_at = NOW() 
                      WHERE user_id = :user_id AND product_id = :product_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':product_id', $product_id);

            return $stmt->execute();
        } else {
            // Insert new item
            $query = "INSERT INTO " . $this->table_name . " 
                      (user_id, product_id, quantity) 
                      VALUES (:user_id, :product_id, :quantity)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':product_id', $product_id);
            $stmt->bindParam(':quantity', $quantity);

            return $stmt->execute();
        }
    }

    // Get all items in a user's cart with product details
    public function getItems($user_id) {
        $query = "SELECT c.*, p.name, p.price, p.image_url, p.quantity as stock_quantity 
                  FROM " . $this->table_name . " c
                  LEFT JOIN products p ON c.product_id = p.id
                  WHERE c.user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Update item quantity
    public function updateQuantity($user_id, $product_id, $quantity) {
        $query = "UPDATE " . $this->table_name . " 
                  SET quantity = :quantity, updated_at = NOW() 
                  WHERE user_id = :user_id AND product_id = :product_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':product_id', $product_id);

        return $stmt->execute();
    }

    // Remove item from cart
    public function removeItem($user_id, $product_id) {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE user_id = :user_id AND product_id = :product_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':product_id', $product_id);

        return $stmt->execute();
    }

    // Clear user's cart
    public function clearCart($user_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);

        return $stmt->execute();
    }

    // Get cart item count
    public function getItemCount($user_id) {
        $query = "SELECT SUM(quantity) as count FROM " . $this->table_name . " WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['count'] ?? 0;
    }

    // Calculate cart total
    public function getTotal($user_id) {
        $query = "SELECT SUM(c.quantity * p.price) as total 
                  FROM " . $this->table_name . " c
                  LEFT JOIN products p ON c.product_id = p.id
                  WHERE c.user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total'] ?? 0;
    }
}
?> 