-- Скрипт для прямого добавления администраторов в базу данных
-- Используйте этот скрипт, если у вас возникают проблемы с входом в админ-панель

-- Проверяем, существует ли таблица superadmins
CREATE TABLE IF NOT EXISTS superadmins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Удаляем существующих администраторов, чтобы избежать дубликатов
DELETE FROM superadmins WHERE username IN ('admin', 'superadmin');

-- Добавляем администратора с захешированным паролем 'admin123'
-- Хеш создан с использованием PASSWORD_DEFAULT в PHP
INSERT INTO superadmins (username, password_hash) VALUES 
('admin', '$2y$10$KHqoYZSLuKlOVZL7DC9Uy.LD1ZXCTjG2VYYlXm3XlxQ6G7UNV0YZq'),
('superadmin', '$2y$10$KHqoYZSLuKlOVZL7DC9Uy.LD1ZXCTjG2VYYlXm3XlxQ6G7UNV0YZq');

-- Проверяем, что администраторы добавлены
SELECT id, username FROM superadmins;

-- Проверяем, существует ли запись в таблице store_settings
CREATE TABLE IF NOT EXISTS store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(100) NOT NULL DEFAULT 'ElectroStore',
    logo_url VARCHAR(255),
    primary_color VARCHAR(7) DEFAULT '#2196F3',
    secondary_color VARCHAR(7) DEFAULT '#FFC107',
    background_color VARCHAR(7) DEFAULT '#f5f5f5',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Добавляем настройки магазина, если их нет
INSERT IGNORE INTO store_settings (id, store_name, primary_color, secondary_color, background_color) 
VALUES (1, 'ElectroStore', '#2196F3', '#FFC107', '#f5f5f5');
