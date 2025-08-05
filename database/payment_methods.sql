-- Таблица для хранения банковских карт
CREATE TABLE IF NOT EXISTS payment_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_number VARCHAR(255) NOT NULL,
    expiry_date VARCHAR(10) NOT NULL,
    holder_name VARCHAR(255) NOT NULL,
    bank_code VARCHAR(50) NOT NULL,
    other_bank VARCHAR(100),
    is_default TINYINT(1) DEFAULT 0,
    bank_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица для хранения электронных кошельков
CREATE TABLE IF NOT EXISTS payment_wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    wallet_number VARCHAR(255) NOT NULL,
    wallet_type VARCHAR(50) NOT NULL,
    other_type VARCHAR(100),
    is_default TINYINT(1) DEFAULT 0,
    type_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
