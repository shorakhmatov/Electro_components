// report.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Сообщить о проблеме';

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="../assets/css/pages/support.css">';

// Additional JS
$additionalJs = '<script src="../assets/js/support.js"></script>';

// Include support header
include 'support_header.php';
?>

<main>
    <div class="container">
        <div class="support-container">
            <div class="support-header">
                <h1><i class="fas fa-exclamation-triangle"></i> Сообщить о проблеме</h1>
                <p>Если вы столкнулись с проблемой при использовании нашего сайта или товаров, пожалуйста, сообщите нам об этом</p>
            </div>

            <div class="report-container">
                <div class="report-form-container">
                    <div class="feedback-form-header">
                        <h2><i class="fas fa-exclamation-circle"></i> Форма сообщения о проблеме</h2>
                    </div>
                    <form id="reportForm" class="report-form">
                        <div class="form-group">
                            <label for="reportName"><i class="fas fa-user"></i> Ваше имя</label>
                            <input type="text" id="reportName" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="reportEmail"><i class="fas fa-envelope"></i> Email для связи</label>
                            <input type="email" id="reportEmail" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="reportPhone"><i class="fas fa-phone"></i> Телефон (необязательно)</label>
                            <input type="tel" id="reportPhone" name="phone">
                        </div>
                        <div class="form-group">
                            <label for="reportOrderNumber"><i class="fas fa-shopping-bag"></i> Номер заказа (если применимо)</label>
                            <input type="text" id="reportOrderNumber" name="orderNumber">
                        </div>
                        <div class="form-group">
                            <label for="reportType"><i class="fas fa-list-alt"></i> Тип проблемы</label>
                            <select id="reportType" name="type" required>
                                <option value="">Выберите тип проблемы</option>
                                <option value="website">Проблема с работой сайта</option>
                                <option value="order">Проблема с заказом</option>
                                <option value="product">Проблема с товаром</option>
                                <option value="delivery">Проблема с доставкой</option>
                                <option value="payment">Проблема с оплатой</option>
                                <option value="other">Другое</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="reportSubject"><i class="fas fa-heading"></i> Тема обращения</label>
                            <input type="text" id="reportSubject" name="subject" required>
                        </div>
                        <div class="form-group">
                            <label for="reportDescription"><i class="fas fa-comment-dots"></i> Описание проблемы</label>
                            <textarea id="reportDescription" name="description" rows="6" required placeholder="Пожалуйста, опишите проблему как можно подробнее. Укажите, когда она возникла, какие действия вы выполняли, и любую другую информацию, которая может помочь нам решить проблему."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="reportAttachment"><i class="fas fa-paperclip"></i> Прикрепить файл (скриншот, фото и т.д.)</label>
                            <div class="file-upload">
                                <input type="file" id="reportAttachment" name="attachment">
                                <label for="reportAttachment" class="file-upload-label">
                                    <i class="fas fa-cloud-upload-alt"></i> Выберите файл
                                </label>
                                <span class="file-name">Файл не выбран</span>
                            </div>
                            <p class="file-info">Максимальный размер файла: 5 МБ. Поддерживаемые форматы: JPG, PNG, PDF.</p>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-container">
                                <input type="checkbox" id="reportConsent" name="consent" required>
                                <span class="checkmark"></span>
                                Я согласен на обработку персональных данных
                            </label>
                        </div>
                        <button type="submit" class="btn-submit"><i class="fas fa-paper-plane"></i> Отправить сообщение</button>
                    </form>
                </div>

                <div class="report-info">
                    <div class="info-card">
                        <div class="info-header">
                            <div class="info-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <h3 class="info-title">Время обработки</h3>
                        </div>
                        <div class="info-content">
                            <p>Мы рассматриваем все обращения в течение 24 часов. В срочных случаях рекомендуем также связаться с нами по телефону.</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-header">
                            <div class="info-icon">
                                <i class="fas fa-clipboard-list"></i>
                            </div>
                            <h3 class="info-title">Как мы обрабатываем обращения</h3>
                        </div>
                        <div class="info-content">
                            <p>После получения вашего сообщения мы:</p>
                            <ol>
                                <li>Присваиваем ему уникальный номер</li>
                                <li>Направляем в соответствующий отдел</li>
                                <li>Связываемся с вами для уточнения деталей (при необходимости)</li>
                                <li>Предлагаем решение проблемы</li>
                            </ol>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-header">
                            <div class="info-icon">
                                <i class="fas fa-phone-alt"></i>
                            </div>
                            <h3 class="info-title">Срочная связь</h3>
                        </div>
                        <div class="info-content">
                            <p>Для срочных вопросов вы можете связаться с нами по телефону:</p>
                            <p class="contact-phone"><i class="fas fa-phone-alt"></i> +7 (385) 223-45-67</p>
                            <p>Время работы: Пн-Пт с 9:00 до 18:00</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="common-issues">
                <h2>Частые проблемы и их решения</h2>
                <div class="issues-list">
                    <div class="issue-item">
                        <h3><i class="fas fa-shopping-cart"></i> Не могу добавить товар в корзину</h3>
                        <div class="issue-solution">
                            <p>Возможные причины и решения:</p>
                            <ul>
                                <li>Товар закончился на складе - проверьте наличие товара</li>
                                <li>Проблемы с JavaScript - очистите кэш браузера или попробуйте другой браузер</li>
                                <li>Не выполнен вход в аккаунт - войдите в свой аккаунт и попробуйте снова</li>
                            </ul>
                        </div>
                    </div>
                    <div class="issue-item">
                        <h3><i class="fas fa-credit-card"></i> Проблемы с оплатой</h3>
                        <div class="issue-solution">
                            <p>Возможные причины и решения:</p>
                            <ul>
                                <li>Недостаточно средств на карте - проверьте баланс карты</li>
                                <li>Банк отклонил операцию - свяжитесь с банком для выяснения причины</li>
                                <li>Технические проблемы платежного шлюза - попробуйте другой способ оплаты или повторите попытку позже</li>
                            </ul>
                        </div>
                    </div>
                    <div class="issue-item">
                        <h3><i class="fas fa-truck"></i> Не получил заказ вовремя</h3>
                        <div class="issue-solution">
                            <p>Возможные причины и решения:</p>
                            <ul>
                                <li>Задержки в работе службы доставки - проверьте статус заказа в личном кабинете</li>
                                <li>Неправильно указан адрес - проверьте правильность адреса в личном кабинете</li>
                                <li>Заказ находится на складе курьерской службы - свяжитесь с курьерской службой</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php
// Include support footer
include 'support_footer.php';
?>
