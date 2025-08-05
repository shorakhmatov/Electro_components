<?php
require_once __DIR__ . '/../includes/db/database.php';

class Order {
    private $conn;
    private $table_name = "orders";
    private $items_table = "order_items";

    // Properties
    public $id;
    public $user_id;
    public $total_amount;
    public $status;
    public $created_at;
    public $updated_at;
    public $delivery_address;
    public $delivery_address_id;
    public $delivery_type;

    // Constructor
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Create new order
    public function create($user_id, $total_amount, $items, $delivery_data = null) {
        // Логируем данные для отладки
        file_put_contents('../order_creation_log.txt', "\n\n" . date('Y-m-d H:i:s') . " - Creating order for user ID: $user_id\n", FILE_APPEND);
        file_put_contents('../order_creation_log.txt', "Delivery data: " . print_r($delivery_data, true) . "\n", FILE_APPEND);
        
        // Start transaction
        $this->conn->beginTransaction();
        
        try {
            // Insert order
            $query = "INSERT INTO " . $this->table_name . " 
                      (user_id, total_amount, status";
            
            // Добавляем поля адреса доставки, если они предоставлены
            if ($delivery_data) {
                $query .= ", delivery_address, delivery_address_id, delivery_type";
            }
            
            $query .= ") VALUES (:user_id, :total_amount, 'pending'";
            
            // Добавляем значения адреса доставки, если они предоставлены
            if ($delivery_data) {
                $query .= ", :delivery_address, :delivery_address_id, :delivery_type";
            }
            
            $query .= ")";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':total_amount', $total_amount);
            
            // Привязываем параметры адреса доставки, если они предоставлены
            if ($delivery_data) {
                $stmt->bindParam(':delivery_address', $delivery_data['delivery_address']);
                $stmt->bindParam(':delivery_address_id', $delivery_data['delivery_address_id']);
                $stmt->bindParam(':delivery_type', $delivery_data['delivery_type']);
            }
            
            $stmt->execute();

            $order_id = $this->conn->lastInsertId();

            // Insert order items
            foreach ($items as $item) {
                $query = "INSERT INTO " . $this->items_table . " 
                          (order_id, product_id, quantity, price_per_unit) 
                          VALUES (:order_id, :product_id, :quantity, :price_per_unit)";

                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':order_id', $order_id);
                $stmt->bindParam(':product_id', $item['product_id']);
                $stmt->bindParam(':quantity', $item['quantity']);
                $stmt->bindParam(':price_per_unit', $item['price']);
                $stmt->execute();

                // Update product stock
                $query = "UPDATE products 
                          SET quantity = quantity - :quantity 
                          WHERE id = :product_id";

                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':quantity', $item['quantity']);
                $stmt->bindParam(':product_id', $item['product_id']);
                $stmt->execute();
            }

            // Commit transaction
            $this->conn->commit();
            return $order_id;
        } catch (Exception $e) {
            // Rollback transaction
            $this->conn->rollback();
            return false;
        }
    }

    // Get all orders for a user
    public function getUserOrders($user_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id 
                  ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get order by ID
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get order items
    public function getOrderItems($order_id) {
        $query = "SELECT oi.*, p.name, p.image_url 
                  FROM " . $this->items_table . " oi
                  LEFT JOIN products p ON oi.product_id = p.id
                  WHERE oi.order_id = :order_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':order_id', $order_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Update order status
    public function updateStatus($id, $status) {
        $query = "UPDATE " . $this->table_name . " 
                  SET status = :status, updated_at = NOW() 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }
}
?> 