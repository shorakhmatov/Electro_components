-- Таблица для хранения адресов доставки
CREATE TABLE IF NOT EXISTS delivery_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_type VARCHAR(20) NOT NULL, -- 'manual' или 'pickup'
    service VARCHAR(50) NOT NULL, -- 'cdek', 'russian-post', и т.д.
    city VARCHAR(100) NOT NULL,
    street VARCHAR(255),
    building VARCHAR(50),
    apartment VARCHAR(50),
    postal_code VARCHAR(20),
    comment TEXT,
    point_id VARCHAR(100), -- ID пункта выдачи (для pickup)
    point_address TEXT, -- Полный адрес пункта выдачи (для pickup)
    point_name VARCHAR(255), -- Название пункта выдачи (для pickup)
    point_phone VARCHAR(50), -- Телефон пункта выдачи (для pickup)
    point_work_hours TEXT, -- Часы работы пункта выдачи (для pickup)
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
