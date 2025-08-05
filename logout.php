//logout.php
<?php
// Начинаем сессию, если она еще не начата
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Запоминаем сообщение о выходе для отображения на следующей странице
$_SESSION['logout_message'] = 'Вы успешно вышли из системы';

// Удаляем все переменные сессии, кроме сообщения о выходе
$logout_message = $_SESSION['logout_message'];
session_unset();
$_SESSION['logout_message'] = $logout_message;

// Удаляем куки
setcookie('user_id', '', time() - 3600, '/');
setcookie('user_email', '', time() - 3600, '/');
setcookie('user_name', '', time() - 3600, '/');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Выход из системы</title>
    <script>
        // Очищаем localStorage при выходе
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Перенаправляем на главную страницу
        window.location.href = 'index.php';
    </script>
</head>
<body>
    <p>Выход из системы...</p>
</body>
</html>
