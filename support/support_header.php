// support_header.php<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle : 'Техническая поддержка'; ?> - Electro Components</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <?php echo isset($additionalCss) ? $additionalCss : ''; ?>
    <style>
        body {
            background-color: #f8f9fa;
            padding-bottom: 40px;
        }
        
        .back-button {
            display: inline-flex;
            align-items: center;
            padding: 10px 15px;
            background-color: var(--primary-color);
            color: white;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
            transition: background-color 0.3s;
            font-weight: 500;
        }
        
        .back-button:hover {
            background-color: var(--primary-color-dark);
        }
        
        .back-button i {
            margin-right: 8px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }
        
        .support-header {
            margin-top: 20px;
        }
        
        main {
            margin-top: -20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="../index.php" class="back-button">
            <i class="fas fa-arrow-left"></i> Вернуться на главную
        </a>
