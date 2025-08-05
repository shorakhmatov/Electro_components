//reset_password.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Восстановление пароля';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/pages/profile-improved.css">
<link rel="stylesheet" href="assets/css/toast.css">
<link rel="stylesheet" href="assets/css/reset-password.css">';

// Additional JS
$additionalJs = '<script src="assets/js/reset-password.js"></script>';

// Check if token is provided
$token = isset($_GET['token']) ? $_GET['token'] : '';
$validToken = false;

if (!empty($token)) {
    // Проверяем токен
    require_once 'models/User.php';
    $user = new User();
    $validToken = $user->validateResetToken($token);
}

// Если токен не предоставлен, перенаправляем на страницу профиля
if (empty($token)) {
    header('Location: profile.php');
    exit;
}

// Include header
include 'includes/header/header.php';
?>

<main class="reset-password-page">
    <div class="container">
        <?php if ($validToken): ?>
        <!-- Форма установки нового пароля -->
        <div class="reset-password-container">
            <h2>Создание нового пароля</h2>
            <p class="reset-description">Придумайте новый пароль для вашей учетной записи.</p>
            
            <form id="setNewPasswordForm" class="reset-form">
                <input type="hidden" id="resetToken" name="resetToken" value="<?= htmlspecialchars($token) ?>">
                <div class="form-group">
                    <label for="newPassword">Новый пароль</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                    <div class="error-message"></div>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Подтверждение пароля</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                    <div class="error-message"></div>
                </div>
                <button type="submit" class="btn-submit">Сохранить новый пароль</button>
            </form>
        </div>
        <?php else: ?>
        <!-- Недействительный или истекший токен -->
        <div class="reset-password-container">
            <h2>Ошибка восстановления пароля</h2>
            <p class="reset-description error">Ссылка для восстановления пароля недействительна или срок её действия истек.</p>
            <div class="form-footer">
                <a href="reset_password.php" class="btn-link">Запросить новую ссылку</a>
                <a href="profile.php" class="btn-link">Вернуться на страницу входа</a>
            </div>
        </div>
        <?php endif; ?>
    </div>
</main>

<?php
// Include footer
include 'includes/footer/footer.php';
?>
