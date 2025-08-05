<?php
class Database {
    private $host = "localhost";
    private $db_name = "electronic_store";
    private $username = "root";
    private $password = "daler2003";
    public $conn;

    public function getConnection() {
        if ($this->conn !== null) {
            return $this->conn;
        }

        try {
            // Log connection attempt
            error_log("Attempting database connection to {$this->host}/{$this->db_name}");

            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            error_log("Database connection successful");
            return $this->conn;
        } catch(PDOException $e) {
            error_log("Database connection error: " . $e->getMessage());
            error_log("DSN: mysql:host={$this->host};dbname={$this->db_name}");
            throw new Exception('Could not connect to the database. Please check your credentials.');
        }
    }

    // Function to execute a query and return the result
    public function query($sql, $params = []) {
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch(PDOException $exception) {
            error_log("Database query error: " . $exception->getMessage());
            throw new Exception('Database query failed');
            return false;
        }
    }

    // Function to fetch all results from a query
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        if ($stmt) {
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return [];
    }

    // Function to fetch a single row from a query
    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        if ($stmt) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        return false;
    }

    // Function to get the last inserted ID
    public function lastInsertId() {
        return $this->conn->lastInsertId();
    }
}
?> 