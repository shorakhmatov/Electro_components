-- Обновление таблицы категорий
ALTER TABLE categories ADD COLUMN description TEXT AFTER name;
ALTER TABLE categories ADD COLUMN icon VARCHAR(50) AFTER description;
