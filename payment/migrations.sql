-- Добавляем поле balance в таблицу users, если его еще нет
ALTER TABLE users ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0.00;

-- Создаем таблицу для транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'deposit' или 'payment'
    status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed'
    payment_method VARCHAR(20) NOT NULL, -- 'sber' или 'balance'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_id VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
