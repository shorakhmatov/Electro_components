from app import app, db

def init_db():
    with app.app_context():
        try:
            # Создаем все таблицы
            db.create_all()
            print("База данных успешно инициализирована")
        except Exception as e:
            print(f"Ошибка при инициализации базы данных: {e}")

if __name__ == '__main__':
    init_db()
