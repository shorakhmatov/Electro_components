<?php
/**
 * Конфигурация для отправки электронной почты
 */
return [
    // API ключ ElasticEmail
    'api_key' => '49527E62DB1C22BFA7826B27239E2FEBB19A0E50A4D9DBCF1A4907A84E64478C80D6F6D0E558A0E45C1E6B23BF20285F',
    
    // Email отправителя
    'from_email' => 'foredcdaler03@gmail.com',
    
    // Имя отправителя
    'from_name' => 'Electro Components',
    
    // Срок действия кода подтверждения (в часах)
    'verification_code_expiry' => 8
];
?>
<!-- тест для локалхост -- C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64>php "C:\Users\mrdal\Desktop\electro_components\test_email.php" daler.shd.03@gmail.com -->