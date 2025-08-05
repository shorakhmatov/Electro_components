<?php
/**
 * Класс для отправки электронных писем через ElasticEmail API
 */
class EmailSender {
    private $apiKey;
    private $fromEmail;
    private $fromName;

    /**
     * Конструктор класса
     * 
     * @param string $apiKey API ключ ElasticEmail
     * @param string $fromEmail Email отправителя
     * @param string $fromName Имя отправителя
     */
    public function __construct($apiKey, $fromEmail, $fromName) {
        $this->apiKey = $apiKey;
        $this->fromEmail = $fromEmail;
        $this->fromName = $fromName;
    }

    /**
     * Отправка письма с кодом подтверждения
     * 
     * @param string $toEmail Email получателя
     * @param string $toName Имя получателя
     * @param string $verificationCode Код подтверждения
     * @return bool Результат отправки
     */
    public function sendVerificationEmail($toEmail, $toName, $verificationCode) {
        error_log("EmailSender: Sending verification email to {$toEmail} with code {$verificationCode}");
        $subject = 'Подтверждение электронной почты';
        
        // Создаем HTML-версию письма
        $htmlContent = $this->getVerificationEmailTemplate($toName, $verificationCode);
        
        // Создаем текстовую версию письма
        $textContent = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlContent));
        
        // Отправляем письмо через ElasticEmail API
        $result = $this->sendEmail($toEmail, $toName, $subject, $htmlContent, $textContent);
        error_log("EmailSender: Email sending result: " . ($result ? 'success' : 'failed'));
        return $result;
    }
    
    /**
     * Отправка письма со ссылкой для сброса пароля
     * 
     * @param string $toEmail Email получателя
     * @param string $toName Имя получателя
     * @param string $resetLink Ссылка для сброса пароля
     * @return bool Результат отправки
     */
    public function sendPasswordResetEmail($toEmail, $toName, $resetLink) {
        error_log("EmailSender: Sending password reset email to {$toEmail}");
        $subject = 'Восстановление пароля';
        
        // Создаем HTML-версию письма
        $htmlContent = $this->getPasswordResetEmailTemplate($toName, $resetLink);
        
        // Создаем текстовую версию письма
        $textContent = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlContent));
        
        // Отправляем письмо через ElasticEmail API
        $result = $this->sendEmail($toEmail, $toName, $subject, $htmlContent, $textContent);
        error_log("EmailSender: Email sending result: " . ($result ? 'success' : 'failed'));
        return $result;
    }

    /**
     * Отправка письма через ElasticEmail API или PHP mail()
     * 
     * @param string $toEmail Email получателя
     * @param string $toName Имя получателя
     * @param string $subject Тема письма
     * @param string $htmlContent HTML-версия письма
     * @param string $textContent Текстовая версия письма
     * @return bool Результат отправки
     */
    private function sendEmail($toEmail, $toName, $subject, $htmlContent, $textContent) {
        error_log("EmailSender: Preparing to send email to {$toEmail}");
        
        // Сначала пробуем отправить через ElasticEmail API
        $apiResult = $this->sendViaElasticEmail($toEmail, $toName, $subject, $htmlContent, $textContent);
        
        // Если отправка через API не удалась, пробуем отправить через PHP mail()
        if (!$apiResult) {
            error_log("EmailSender: ElasticEmail API failed, trying PHP mail() function");
            return $this->sendViaPhpMail($toEmail, $toName, $subject, $htmlContent, $textContent);
        }
        
        return $apiResult;
    }
    
    /**
     * Отправка письма через ElasticEmail API
     * 
     * @param string $toEmail Email получателя
     * @param string $toName Имя получателя
     * @param string $subject Тема письма
     * @param string $htmlContent HTML-версия письма
     * @param string $textContent Текстовая версия письма
     * @return bool Результат отправки
     */
    private function sendViaElasticEmail($toEmail, $toName, $subject, $htmlContent, $textContent) {
        // Формируем данные для запроса
        $data = [
            'apikey' => $this->apiKey,
            'from' => $this->fromEmail,
            'fromName' => $this->fromName,
            'to' => $toEmail,
            'subject' => $subject,
            'bodyHtml' => $htmlContent,
            'bodyText' => $textContent,
            'isTransactional' => true
        ];
        
        error_log("EmailSender: API data prepared. From: {$this->fromEmail}, To: {$toEmail}, Subject: {$subject}");
        
        // Проверяем, доступна ли функция curl
        if (!function_exists('curl_init')) {
            error_log("EmailSender: cURL is not available");
            return false;
        }
        
        // Инициализируем cURL сессию
        $ch = curl_init('https://api.elasticemail.com/v2/email/send');
        
        // Устанавливаем параметры cURL
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10); // Таймаут 10 секунд
        
        // Добавляем отладочную информацию
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        $verbose = fopen('php://temp', 'w+');
        curl_setopt($ch, CURLOPT_STDERR, $verbose);
        
        error_log("EmailSender: Executing cURL request to ElasticEmail API");
        
        // Выполняем запрос
        $response = curl_exec($ch);
        
        // Получаем информацию об ошибке, если она есть
        $curlError = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        // Получаем отладочную информацию
        rewind($verbose);
        $verboseLog = stream_get_contents($verbose);
        
        // Закрываем cURL сессию
        curl_close($ch);
        
        error_log("EmailSender: cURL response code: {$httpCode}");
        
        // Проверяем результат
        if ($response === false) {
            error_log("EmailSender: cURL error: {$curlError}");
            error_log("EmailSender: Verbose log: {$verboseLog}");
            return false;
        }
        
        // Логируем ответ
        error_log("EmailSender: API response: {$response}");
        
        // Декодируем ответ
        $result = json_decode($response, true);
        
        // Проверяем успешность отправки
        if (isset($result['success']) && $result['success']) {
            error_log("EmailSender: Email sent successfully via ElasticEmail API to {$toEmail}");
            return true;
        } else {
            error_log("EmailSender: Failed to send email via ElasticEmail API. Response: " . json_encode($result));
            return false;
        }
    }
    
    /**
     * Отправка письма через PHP mail() функцию
     * 
     * @param string $toEmail Email получателя
     * @param string $toName Имя получателя
     * @param string $subject Тема письма
     * @param string $htmlContent HTML-версия письма
     * @param string $textContent Текстовая версия письма
     * @return bool Результат отправки
     */
    private function sendViaPhpMail($toEmail, $toName, $subject, $htmlContent, $textContent) {
        error_log("EmailSender: Trying to send email via PHP mail() function");
        
        // Проверяем, доступна ли функция mail
        if (!function_exists('mail')) {
            error_log("EmailSender: PHP mail() function is not available");
            return false;
        }
        
        // Формируем заголовки письма
        $headers = "From: {$this->fromName} <{$this->fromEmail}>\r\n";
        $headers .= "Reply-To: {$this->fromEmail}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        
        // Пытаемся отправить письмо
        $mailResult = mail($toEmail, $subject, $htmlContent, $headers);
        
        if ($mailResult) {
            error_log("EmailSender: Email sent successfully via PHP mail() to {$toEmail}");
            return true;
        } else {
            error_log("EmailSender: Failed to send email via PHP mail() to {$toEmail}");
            return false;
        }
    }

    /**
     * Получение шаблона письма с кодом подтверждения
     * 
     * @param string $name Имя получателя
     * @param string $code Код подтверждения
     * @return string HTML-шаблон письма
     */
    private function getVerificationEmailTemplate($name, $code) {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Подтверждение электронной почты</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #007bff;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .verification-code {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    padding: 10px;
                    background-color: #eee;
                    border-radius: 5px;
                    letter-spacing: 5px;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Подтверждение электронной почты</h1>
                </div>
                <div class="content">
                    <p>Здравствуйте, ' . htmlspecialchars($name) . '!</p>
                    <p>Для подтверждения вашей электронной почты, пожалуйста, введите следующий код на сайте:</p>
                    <div class="verification-code">' . $code . '</div>
                    <p>Код действителен в течение 8 часов.</p>
                    <p>Если вы не запрашивали подтверждение электронной почты, пожалуйста, проигнорируйте это письмо.</p>
                </div>
                <div class="footer">
                    <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
                    <p>&copy; ' . date('Y') . ' Electro Components. Все права защищены.</p>
                </div>
            </div>
        </body>
        </html>';
    }
    
    /**
     * Получение шаблона письма для восстановления пароля
     * 
     * @param string $name Имя получателя
     * @param string $resetLink Ссылка для сброса пароля
     * @return string HTML-шаблон письма
     */
    private function getPasswordResetEmailTemplate($name, $resetLink) {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Восстановление пароля</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #007bff;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .reset-button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 25px;
                    border-radius: 4px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .reset-link {
                    word-break: break-all;
                    color: #007bff;
                    margin: 15px 0;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Восстановление пароля</h1>
                </div>
                <div class="content">
                    <p>Здравствуйте, ' . htmlspecialchars($name) . '!</p>
                    <p>Вы получили это письмо, потому что запросили восстановление пароля для вашей учетной записи.</p>
                    <p>Для создания нового пароля, пожалуйста, нажмите на кнопку ниже:</p>
                    <div style="text-align: center;">
                        <a href="' . $resetLink . '" class="reset-button">Сбросить пароль</a>
                    </div>
                    <p>Или перейдите по следующей ссылке:</p>
                    <p class="reset-link">' . $resetLink . '</p>
                    <p>Ссылка действительна в течение 24 часов.</p>
                    <p>Если вы не запрашивали сброс пароля, пожалуйста, проигнорируйте это письмо или свяжитесь с нами, если у вас есть вопросы.</p>
                </div>
                <div class="footer">
                    <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
                    <p>&copy; ' . date('Y') . ' Electro Components. Все права защищены.</p>
                </div>
            </div>
        </body>
        </html>';
    }
}
?>
