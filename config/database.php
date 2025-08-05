
// database.php
<?php
class Database {
    private $host = "localhost";
    private $db_name = "electronic_store";
    private $username = "root";
    private $password = "daler2003";
    public $conn;
    private static $instance = null;
    
    /**
     * Получение экземпляра класса Database (Singleton)
     * 
     * @return Database
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
