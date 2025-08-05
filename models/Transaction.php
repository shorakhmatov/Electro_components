<?php
require_once __DIR__ . '/../includes/db/database.php';

class Transaction {
    private $conn;
    private $table_name = "transactions";

    // Properties
    public $id;
    public $user_id;
    public $type;
    public $amount;
    public $status;
    public $payment_method;
    public $description;
    public $created_at;

    // Constructor
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Create a new transaction
    public function create($userId, $type, $amount, $paymentMethod, $description = '') {
        $query = "INSERT INTO " . $this->table_name . " 
                  (user_id, type, amount, status, payment_method, description) 
                  VALUES (:user_id, :type, :amount, 'pending', :payment_method, :description)";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $userId = htmlspecialchars(strip_tags($userId));
        $type = htmlspecialchars(strip_tags($type));
        $amount = floatval($amount);
        $paymentMethod = htmlspecialchars(strip_tags($paymentMethod));
        $description = htmlspecialchars(strip_tags($description));

        // Bind values
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':payment_method', $paymentMethod);
        $stmt->bindParam(':description', $description);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }

        return false;
    }

    // Complete a transaction
    public function complete($id) {
        // Start transaction
        $this->conn->beginTransaction();

        try {
            // Get transaction details
            $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id AND status = 'pending' LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $transaction = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$transaction) {
                throw new Exception("Transaction not found or already completed");
            }

            // Update user balance
            $user = new User();
            $amount = $transaction['type'] === 'deposit' ? $transaction['amount'] : -$transaction['amount'];
            if (!$user->updateBalance($transaction['user_id'], $amount)) {
                throw new Exception("Failed to update user balance");
            }

            // Update transaction status
            $query = "UPDATE " . $this->table_name . " SET status = 'completed' WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            
            if (!$stmt->execute()) {
                throw new Exception("Failed to update transaction status");
            }

            // Commit transaction
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            // Rollback transaction on error
            $this->conn->rollBack();
            return false;
        }
    }

    // Get user's transactions
    public function getByUserId($userId, $limit = 10) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id 
                  ORDER BY created_at DESC 
                  LIMIT :limit";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get transaction by ID
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
