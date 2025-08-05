<?php
/**
 * Модель для работы с отзывами пользователей
 */
class Feedback {
    private $db;
    
    /**
     * Конструктор класса
     */
    public function __construct() {
        // Создаем экземпляр класса Database и получаем соединение
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    /**
     * Проверка подключения к базе данных
     * 
     * @return bool Результат проверки
     */
    public function checkDatabaseConnection() {
        try {
            // Проверяем, что соединение существует
            if (!$this->db) {
                error_log('Database connection is null');
                return false;
            }
            
            // Проверяем соединение с помощью простого запроса
            $this->db->query('SELECT 1');
            return true;
        } catch (PDOException $e) {
            error_log('Database connection error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Сохранение отзыва в базу данных
     * 
     * @param array $data Данные отзыва
     * @return bool Результат операции
     */
    public function save($data) {
        try {
            // Проверяем, существует ли таблица feedback
            $checkTableQuery = "SHOW TABLES LIKE 'feedback'";
            $checkTableStmt = $this->db->prepare($checkTableQuery);
            $checkTableStmt->execute();
            
            if ($checkTableStmt->rowCount() === 0) {
                // Таблица не существует, создаем ее
                $createTableQuery = "CREATE TABLE feedback (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL,
                    type VARCHAR(50) NOT NULL,
                    product_id INT NULL,
                    rating INT NOT NULL,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
                    user_id INT NULL
                )";
                
                $this->db->exec($createTableQuery);
                error_log('Created feedback table');
            }
            
            // Подготавливаем запрос для вставки данных
            $query = "INSERT INTO feedback (name, email, type, product_id, rating, message, user_id) 
                     VALUES (:name, :email, :type, :product_id, :rating, :message, :user_id)";
            
            $stmt = $this->db->prepare($query);
            
            // Привязываем параметры
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':type', $data['type']);
            $stmt->bindParam(':product_id', $data['product_id'], PDO::PARAM_INT);
            $stmt->bindParam(':rating', $data['rating'], PDO::PARAM_INT);
            $stmt->bindParam(':message', $data['message']);
            $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_INT);
            
            // Выполняем запрос
            $result = $stmt->execute();
            
            return $result;
        } catch (PDOException $e) {
            // Логируем ошибку
            error_log('Database error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Получение последних отзывов
     * 
     * @param int $limit Количество отзывов
     * @param string|null $type Тип отзывов (опционально)
     * @return array Массив отзывов
     */
    public function getRecent($limit = 5, $type = null) {
        try {
            // Проверяем, существует ли таблица feedback
            $checkTableQuery = "SHOW TABLES LIKE 'feedback'";
            $checkTableStmt = $this->db->prepare($checkTableQuery);
            $checkTableStmt->execute();
            
            if ($checkTableStmt->rowCount() === 0) {
                // Таблица не существует, возвращаем пустой массив
                return [];
            }
            
            // Проверяем, существует ли таблица products
            $checkProductsTableQuery = "SHOW TABLES LIKE 'products'";
            $checkProductsTableStmt = $this->db->prepare($checkProductsTableQuery);
            $checkProductsTableStmt->execute();
            
            if ($checkProductsTableStmt->rowCount() === 0) {
                // Таблица products не существует, используем запрос без JOIN
                $query = "SELECT f.* FROM feedback f WHERE 1=1";
            } else {
                // Базовый запрос с JOIN
                $query = "SELECT f.*, p.name as product_name 
                         FROM feedback f 
                         LEFT JOIN products p ON f.product_id = p.id 
                         WHERE 1=1";
            }
            
            // Добавляем фильтр по типу, если он указан
            if ($type) {
                $query .= " AND f.type = :type";
            }
            
            // Сортировка и лимит
            $query .= " ORDER BY f.created_at DESC LIMIT :limit";
            
            $stmt = $this->db->prepare($query);
            
            // Привязываем параметры
            if ($type) {
                $stmt->bindParam(':type', $type);
            }
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            
            // Выполняем запрос
            $stmt->execute();
            
            // Получаем результаты
            $feedback = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Форматируем данные для вывода
            foreach ($feedback as &$item) {
                // Форматируем дату
                $item['formatted_date'] = date('d.m.Y', strtotime($item['created_at']));
                
                // Маскируем email
                $item['masked_email'] = $this->maskEmail($item['email']);
                
                // Форматируем имя (первая буква + первая буква фамилии, если есть)
                $item['formatted_name'] = $this->formatName($item['name']);
            }
            
            return $feedback;
        } catch (PDOException $e) {
            // Логируем ошибку
            error_log('Database error: ' . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Маскирование email для публичного отображения
     * 
     * @param string $email Email адрес
     * @return string Маскированный email
     */
    private function maskEmail($email) {
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return $email;
        }
        
        $name = $parts[0];
        $domain = $parts[1];
        
        // Маскируем имя, оставляя первые 2 символа
        $maskedName = substr($name, 0, 2) . str_repeat('*', max(strlen($name) - 2, 1));
        
        return $maskedName . '@' . $domain;
    }
    
    /**
     * Форматирование имени для публичного отображения
     * 
     * @param string $name Полное имя
     * @return string Форматированное имя
     */
    private function formatName($name) {
        $parts = explode(' ', $name);
        $firstName = $parts[0];
        
        // Если есть фамилия, добавляем первую букву
        if (count($parts) > 1) {
            $lastName = $parts[1];
            return $firstName . ' ' . mb_substr($lastName, 0, 1, 'UTF-8') . '.';
        }
        
        return $firstName;
    }
    
    /**
     * Получение отзыва по ID
     * 
     * @param int $id ID отзыва
     * @return array|null Данные отзыва или null, если отзыв не найден
     */
    public function getById($id) {
        try {
            $query = "SELECT f.*, p.name as product_name 
                     FROM feedback f 
                     LEFT JOIN products p ON f.product_id = p.id 
                     WHERE f.id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $feedback = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($feedback) {
                // Форматируем дату
                $feedback['formatted_date'] = date('d.m.Y', strtotime($feedback['created_at']));
            }
            
            return $feedback;
        } catch (PDOException $e) {
            error_log('Database error: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Обновление статуса отзыва
     * 
     * @param int $id ID отзыва
     * @param string $status Новый статус
     * @return bool Результат операции
     */
    public function updateStatus($id, $status) {
        try {
            $query = "UPDATE feedback SET status = :status WHERE id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':status', $status);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log('Database error: ' . $e->getMessage());
            return false;
        }
    }
}
