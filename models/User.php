<?php
require_once __DIR__ . '/../includes/db/database.php';

class User {
    private $conn;
    private $table_name = "users";

    // Properties
    public $id;
    public $first_name;
    public $last_name;
    public $middle_name;
    public $email;
    public $phone;
    public $password;
    public $address;
    public $balance;
    public $avatar_url;
    public $created_at;
    public $updated_at;

    // Constructor
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Register a new user
    public function register($firstName, $lastName, $middleName, $email, $phone, $password) {
        try {
            error_log("Starting registration process for email: $email, phone: $phone");
            
            // Проверка соединения с базой данных
            if (!$this->conn) {
                error_log("Registration failed: No database connection");
                return false;
            }
            
            // Hash password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            error_log("Password hashed successfully");
            
            // Check if email already exists
            if ($this->emailExists($email)) {
                error_log("Registration failed: Email already exists - $email");
                return false;
            }
            error_log("Email check passed: $email is available");
            
            // Check if phone already exists
            if ($this->phoneExists($phone)) {
                error_log("Registration failed: Phone already exists - $phone");
                return false;
            }
            error_log("Phone check passed: $phone is available");
            
            // Prepare query
            $query = "INSERT INTO " . $this->table_name . " (first_name, last_name, middle_name, email, phone, password, balance) VALUES (:first_name, :last_name, :middle_name, :email, :phone, :password, 0)";
            error_log("Prepared query: $query");
            
            // Prepare statement
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                error_log("Registration failed: Could not prepare statement. Error: " . print_r($this->conn->errorInfo(), true));
                return false;
            }
            
            // Sanitize input
            $firstName = htmlspecialchars(strip_tags($firstName));
            $lastName = htmlspecialchars(strip_tags($lastName));
            $middleName = htmlspecialchars(strip_tags($middleName));
            $email = htmlspecialchars(strip_tags($email));
            $phone = htmlspecialchars(strip_tags($phone));
            
            // Bind parameters
            $stmt->bindParam(':first_name', $firstName);
            $stmt->bindParam(':last_name', $lastName);
            $stmt->bindParam(':middle_name', $middleName);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':password', $hashed_password);
            error_log("Parameters bound successfully");
            
            // Execute query
            try {
                if ($stmt->execute()) {
                    $userId = $this->conn->lastInsertId();
                    error_log("User registered successfully: $email with ID: $userId");
                    return $userId;
                } else {
                    error_log("Registration failed: Execute error. Error info: " . print_r($stmt->errorInfo(), true));
                    return false;
                }
            } catch (PDOException $e) {
                error_log("Registration execute error: " . $e->getMessage());
                error_log("SQL State: " . $e->getCode());
                return false;
            }
        } catch (PDOException $e) {
            error_log("Database error during registration: " . $e->getMessage());
            throw new Exception('Database error during registration');
        } catch (Exception $e) {
            error_log("Error during registration: " . $e->getMessage());
            throw $e;
        }
    }

    // Login a user
    public function login($email, $password) {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE email = :email LIMIT 0,1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Log login attempt
            error_log("Login attempt for email: " . $email);
            error_log("User found: " . ($user ? 'yes' : 'no'));

            // If user exists, verify password
            if ($user && password_verify($password, $user['password'])) {
                error_log("Password verified successfully");
                return $user;
            }

            error_log("Password verification failed");
            return false;
        } catch (PDOException $e) {
            error_log("Database error during login: " . $e->getMessage());
            throw new Exception('Database error during login');
        } catch (Exception $e) {
            error_log("Error during login: " . $e->getMessage());
            throw $e;
        }
    }
    
    // Login a user with phone
    public function loginWithPhone($phone, $password) {
        try {
            // Очищаем телефон от всех нецифровых символов
            $cleanPhone = preg_replace('/\D/', '', $phone);
            
            // Если номер начинается с 7 и длина 11 цифр, форматируем в +7...
            if (strlen($cleanPhone) === 11 && $cleanPhone[0] === '7') {
                $formattedPhone = '+' . $cleanPhone;
            } else {
                $formattedPhone = $phone; // Используем оригинальный формат
            }
            
            error_log("Attempting to login with phone: $formattedPhone");
            
            // Пробуем найти пользователя по телефону
            $query = "SELECT * FROM " . $this->table_name . " WHERE phone = :phone LIMIT 0,1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':phone', $formattedPhone);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Если не нашли по точному формату, пробуем по чистому номеру
            if (!$user) {
                error_log("User not found with exact phone format, trying with clean phone: $cleanPhone");
                
                // Ищем по номеру без форматирования, используя LIKE
                $query = "SELECT * FROM " . $this->table_name . " WHERE REPLACE(REPLACE(REPLACE(REPLACE(phone, '+', ''), '-', ''), '(', ''), ')', '') LIKE :phone LIMIT 0,1";

                $stmt = $this->conn->prepare($query);
                $phonePattern = '%' . $cleanPhone . '%';
                $stmt->bindParam(':phone', $phonePattern);
                $stmt->execute();

                $user = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            
            // Log login attempt
            error_log("Login attempt for phone: " . $formattedPhone);
            error_log("User found: " . ($user ? 'yes' : 'no'));
            
            // If user exists, verify password
            if ($user && password_verify($password, $user['password'])) {
                error_log("Password verified successfully for phone login");
                return $user;
            }
            
            error_log("Password verification failed for phone login");
            return false;
        } catch (PDOException $e) {
            error_log("Database error during phone login: " . $e->getMessage());
            throw new Exception('Database error during phone login');
        } catch (Exception $e) {
            error_log("Error during phone login: " . $e->getMessage());
            throw $e;
        }
    }

    // Check if email exists
    public function emailExists($email) {
        try {
            error_log("Checking if email exists: $email");
            $query = "SELECT id FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                error_log("Failed to prepare email check statement: " . print_r($this->conn->errorInfo(), true));
                return false;
            }
            
            $stmt->bindParam(1, $email);
            $stmt->execute();
            
            $exists = $stmt->rowCount() > 0;
            error_log("Email check result for $email: " . ($exists ? 'exists' : 'does not exist'));
            return $exists;
        } catch (PDOException $e) {
            error_log("Error checking email existence: " . $e->getMessage());
            // В случае ошибки считаем, что email не существует
            return false;
        }
    }

    // Check if phone exists
    public function phoneExists($phone) {
        try {
            error_log("Checking if phone exists: $phone");
            $query = "SELECT id FROM " . $this->table_name . " WHERE phone = ? LIMIT 0,1";
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                error_log("Failed to prepare phone check statement: " . print_r($this->conn->errorInfo(), true));
                return false;
            }
            
            $stmt->bindParam(1, $phone);
            $stmt->execute();
            
            $exists = $stmt->rowCount() > 0;
            error_log("Phone check result for $phone: " . ($exists ? 'exists' : 'does not exist'));
            return $exists;
        } catch (PDOException $e) {
            error_log("Error checking phone existence: " . $e->getMessage());
            // В случае ошибки считаем, что телефон не существует
            return false;
        }
    }

    // Get user by ID
    public function getById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Update user profile
    public function updateProfile($id, $firstName, $lastName, $middleName, $email, $phone, $address) {
        $query = "UPDATE " . $this->table_name . " 
                  SET first_name = :first_name, 
                      last_name = :last_name, 
                      middle_name = :middle_name, 
                      email = :email, 
                      phone = :phone, 
                      address = :address 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $firstName = htmlspecialchars(strip_tags($firstName));
        $lastName = htmlspecialchars(strip_tags($lastName));
        $middleName = htmlspecialchars(strip_tags($middleName));
        $email = htmlspecialchars(strip_tags($email));
        $phone = htmlspecialchars(strip_tags($phone));
        $address = htmlspecialchars(strip_tags($address));

        // Bind values
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->bindParam(':middle_name', $middleName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    // Update user balance
    public function updateBalance($id, $amount) {
        $query = "UPDATE " . $this->table_name . " SET balance = balance + :amount WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    // Change password
    public function changePassword($id, $newPassword) {
        $query = "UPDATE " . $this->table_name . " SET password = :password WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $password_hash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt->bindParam(':password', $password_hash);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }
    
    // Verify password for a user
    public function verifyPassword($id, $password) {
        $query = "SELECT password FROM " . $this->table_name . " WHERE id = :id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            return true;
        }
        
        return false;
    }
    
    // Update password
    public function updatePassword($id, $newPassword) {
        return $this->changePassword($id, $newPassword);
    }
    
    // Get user by ID (alias for getById with more descriptive name)
    public function getUserById($id) {
        return $this->getById($id);
    }
    
    // Update user profile without address
    public function updateUserProfile($id, $firstName, $lastName, $middleName, $email, $phone) {
        // Получаем текущие данные пользователя
        $currentUser = $this->getById($id);
        
        // Проверяем, изменился ли email
        $emailChanged = $currentUser['email'] !== $email;
        
        // Если email изменился, сбрасываем статус подтверждения
        $emailVerificationReset = $emailChanged ? ", email_verified = 0, email_verification_code = NULL, email_verification_expires = NULL" : "";
        
        $query = "UPDATE " . $this->table_name . " 
                  SET first_name = :first_name, 
                      last_name = :last_name, 
                      middle_name = :middle_name, 
                      email = :email, 
                      phone = :phone,
                      updated_at = NOW()
                      $emailVerificationReset 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $firstName = htmlspecialchars(strip_tags($firstName));
        $lastName = htmlspecialchars(strip_tags($lastName));
        $middleName = htmlspecialchars(strip_tags($middleName));
        $email = htmlspecialchars(strip_tags($email));
        $phone = htmlspecialchars(strip_tags($phone));

        // Bind values
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->bindParam(':middle_name', $middleName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }
    
    // Генерация кода подтверждения для почты
    public function generateEmailVerificationCode($userId) {
        // Загружаем конфигурацию электронной почты
        $emailConfig = require_once __DIR__ . '/../config/email_config.php';
        $expiryHours = isset($emailConfig['verification_code_expiry']) ? $emailConfig['verification_code_expiry'] : 8;
        
        // Генерируем 6-значный код
        $code = sprintf('%06d', mt_rand(1, 999999));
        
        // Устанавливаем срок действия кода (8 часов)
        $expiresAt = date('Y-m-d H:i:s', strtotime("+{$expiryHours} hours"));
        
        // Сохраняем код в базе данных
        $query = "UPDATE " . $this->table_name . " 
                  SET email_verification_code = :code, 
                      email_verification_expires = :expires 
                  WHERE id = :id";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':code', $code);
        $stmt->bindParam(':expires', $expiresAt);
        $stmt->bindParam(':id', $userId);
        
        if ($stmt->execute()) {
            return $code;
        }
        
        return false;
    }
    
    // Проверка кода подтверждения почты
    public function verifyEmailCode($userId, $code) {
        $query = "SELECT email_verification_code, email_verification_expires FROM " . $this->table_name . " 
                  WHERE id = :id LIMIT 1";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Проверяем, что код существует и не истек срок его действия
        if ($user && 
            $user['email_verification_code'] === $code && 
            strtotime($user['email_verification_expires']) > time()) {
            
            // Обновляем статус подтверждения почты
            $updateQuery = "UPDATE " . $this->table_name . " 
                           SET email_verified = 1, 
                               email_verification_code = NULL, 
                               email_verification_expires = NULL 
                           WHERE id = :id";
                           
            $updateStmt = $this->conn->prepare($updateQuery);
            $updateStmt->bindParam(':id', $userId);
            
            return $updateStmt->execute();
        }
        
        return false;
    }
    
    // Проверка статуса подтверждения почты
    public function isEmailVerified($userId) {
        $query = "SELECT email_verified FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return ($user && $user['email_verified'] == 1);
    }
    
    // Поиск пользователя по email или телефону
    public function findByEmailOrPhone($emailOrPhone) {
        // Проверяем, что передано - email или телефон
        $isEmail = filter_var($emailOrPhone, FILTER_VALIDATE_EMAIL);
        
        // Формируем запрос
        if ($isEmail) {
            $query = "SELECT * FROM " . $this->table_name . " WHERE email = :value LIMIT 1";
        } else {
            $query = "SELECT * FROM " . $this->table_name . " WHERE phone = :value LIMIT 1";
        }
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':value', $emailOrPhone);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Генерация токена для сброса пароля
    public function generateResetToken($userId) {
        // Генерируем уникальный токен
        $token = bin2hex(random_bytes(32));
        
        // Устанавливаем срок действия токена (24 часа)
        $expiresAt = date('Y-m-d H:i:s', strtotime("+24 hours"));
        
        // Сохраняем токен в базе данных
        $query = "UPDATE " . $this->table_name . " 
                  SET reset_token = :token, 
                      reset_token_expires = :expires 
                  WHERE id = :id";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expires', $expiresAt);
        $stmt->bindParam(':id', $userId);
        
        if ($stmt->execute()) {
            return $token;
        }
        
        return false;
    }
    
    // Проверка токена для сброса пароля
    public function validateResetToken($token) {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE reset_token = :token 
                  AND reset_token_expires > NOW() 
                  LIMIT 1";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return ($user && isset($user['id'])) ? $user['id'] : false;
    }
    
    // Сброс пароля с использованием токена
    public function resetPasswordWithToken($token, $newPassword) {
        // Проверяем токен
        $userId = $this->validateResetToken($token);
        
        if (!$userId) {
            return false;
        }
        
        // Хешируем новый пароль
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        // Обновляем пароль и сбрасываем токен
        $query = "UPDATE " . $this->table_name . " 
                  SET password = :password, 
                      reset_token = NULL, 
                      reset_token_expires = NULL 
                  WHERE id = :id";
                  
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':id', $userId);
        
        return $stmt->execute();
    }
    
    // Проверка наличия активных заказов у пользователя
    public function hasActiveOrders($userId) {
        try {
            // Сначала проверим, существует ли таблица orders
            $tableCheckQuery = "SHOW TABLES LIKE 'orders'";
            $tableCheckStmt = $this->conn->prepare($tableCheckQuery);
            $tableCheckStmt->execute();
            
            // Если таблица не существует, возвращаем false
            if ($tableCheckStmt->rowCount() === 0) {
                error_log("Table 'orders' does not exist");
                return false;
            }
            
            // Таблица существует, проверяем наличие активных заказов
            $query = "SELECT COUNT(*) as count FROM orders 
                      WHERE user_id = :user_id 
                      AND status IN ('pending', 'processing', 'shipped')";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $hasActiveOrders = $result['count'] > 0;
            error_log("User $userId has active orders: " . ($hasActiveOrders ? 'yes' : 'no'));
            return $hasActiveOrders;
        } catch (PDOException $e) {
            error_log("Error checking active orders: " . $e->getMessage());
            error_log("SQL State: " . $e->getCode());
            // В случае ошибки возвращаем false, чтобы позволить удаление аккаунта
            return false;
        }
    }
    
    // Удаление аккаунта пользователя
    public function deleteAccount($userId) {
        error_log("Starting account deletion for user ID: $userId");
        
        try {
            // Начинаем транзакцию
            error_log("Beginning transaction for account deletion");
            $this->conn->beginTransaction();
            
            // Удаляем адреса доставки пользователя
            error_log("Deleting delivery addresses for user ID: $userId");
            try {
                $query = "DELETE FROM delivery_addresses WHERE user_id = :user_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();
                error_log("Delivery addresses deleted successfully");
            } catch (PDOException $e) {
                error_log("Error deleting delivery addresses: " . $e->getMessage());
                // Продолжаем удаление, если таблица не существует
            }
            
            // Удаляем записи из корзины пользователя
            error_log("Deleting cart items for user ID: $userId");
            try {
                $query = "DELETE FROM cart_items WHERE user_id = :user_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();
                error_log("Cart items deleted successfully");
            } catch (PDOException $e) {
                error_log("Error deleting cart items: " . $e->getMessage());
                // Продолжаем удаление, если таблица не существует
            }
            
            // Удаляем избранные товары пользователя
            error_log("Deleting favorites for user ID: $userId");
            try {
                $query = "DELETE FROM favorites WHERE user_id = :user_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();
                error_log("Favorites deleted successfully");
            } catch (PDOException $e) {
                error_log("Error deleting favorites: " . $e->getMessage());
                // Продолжаем удаление, если таблица не существует
            }
            
            // Обновляем заказы пользователя (анонимизируем)
            error_log("Anonymizing orders for user ID: $userId");
            try {
                $query = "UPDATE orders SET user_id = NULL, delivery_address = 'Аккаунт удален' WHERE user_id = :user_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();
                error_log("Orders anonymized successfully");
            } catch (PDOException $e) {
                error_log("Error anonymizing orders: " . $e->getMessage());
                // Продолжаем удаление, если таблица не существует
            }
            
            // Удаляем самого пользователя
            error_log("Deleting user with ID: $userId");
            $query = "DELETE FROM " . $this->table_name . " WHERE id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            error_log("User deleted successfully");
            
            // Завершаем транзакцию
            error_log("Committing transaction for account deletion");
            $this->conn->commit();
            error_log("Account deletion completed successfully for user ID: $userId");
            
            return true;
        } catch (PDOException $e) {
            // В случае ошибки откатываем все изменения
            error_log("Error during account deletion, rolling back transaction: " . $e->getMessage());
            error_log("SQL State: " . $e->getCode());
            error_log("Error Trace: " . $e->getTraceAsString());
            
            try {
                $this->conn->rollBack();
                error_log("Transaction rolled back successfully");
            } catch (Exception $rollbackError) {
                error_log("Error during rollback: " . $rollbackError->getMessage());
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Unexpected error during account deletion: " . $e->getMessage());
            error_log("Error Trace: " . $e->getTraceAsString());
            
            try {
                $this->conn->rollBack();
                error_log("Transaction rolled back successfully");
            } catch (Exception $rollbackError) {
                error_log("Error during rollback: " . $rollbackError->getMessage());
            }
            
            return false;
        }
    }
}
?> 