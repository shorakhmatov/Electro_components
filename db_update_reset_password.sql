-- Добавляем поля для восстановления пароля в таблицу users
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_token_expires DATETIME DEFAULT NULL;
