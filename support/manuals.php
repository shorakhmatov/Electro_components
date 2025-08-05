// manuals.php<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Инструкции и руководства';

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
                <h1><i class="fas fa-book"></i> Инструкции и руководства</h1>
                <p>Полезные материалы для работы с нашими товарами</p>
            </div>

            <div class="manuals-container">
                <div class="manuals-categories">
                    <div class="category-selector active" data-category="all"><span>Все категории</span></div>
                    <div class="category-selector" data-category="microcontrollers"><span>Микроконтроллеры</span></div>
                    <div class="category-selector" data-category="sensors"><span>Датчики</span></div>
                    <div class="category-selector" data-category="displays"><span>Дисплеи</span></div>
                    <div class="category-selector" data-category="development"><span>Платы разработки</span></div>
                    <div class="category-selector" data-category="power"><span>Компоненты питания</span></div>
                </div>

                <div class="manuals-list">
                    <!-- Микроконтроллеры -->
                    <div class="manual-item" data-category="microcontrollers">
                        <div class="manual-icon">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <div class="manual-details">
                            <h3>Руководство по Arduino</h3>
                            <p>Полное руководство по работе с платформой Arduino, включая установку среды разработки, базовые принципы программирования и примеры проектов.</p>
                            <div class="manual-meta">
                                <span class="manual-type"><i class="fas fa-file-pdf"></i> PDF, 5.2 МБ</span>
                                <a href="#" class="manual-download">Скачать <i class="fas fa-download"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="manual-item" data-category="microcontrollers">
                        <div class="manual-icon">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <div class="manual-details">
                            <h3>Программирование ESP32</h3>
                            <p>Руководство по программированию микроконтроллера ESP32, настройке Wi-Fi и Bluetooth, работе с периферийными устройствами.</p>
                            <div class="manual-meta">
                                <span class="manual-type"><i class="fas fa-file-pdf"></i> PDF, 3.8 МБ</span>
                                <a href="#" class="manual-download">Скачать <i class="fas fa-download"></i></a>
                            </div>
                        </div>
                    </div>

                    <!-- Датчики -->
                    <div class="manual-item" data-category="sensors">
                        <div class="manual-icon">
                            <i class="fas fa-wave-square"></i>
                        </div>
                        <div class="manual-details">
                            <h3>Подключение и калибровка датчиков</h3>
                            <p>Инструкция по подключению различных типов датчиков к микроконтроллерам, методы калибровки и обработки данных.</p>
                            <div class="manual-meta">
                                <span class="manual-type"><i class="fas fa-file-pdf"></i> PDF, 2.7 МБ</span>
                                <a href="#" class="manual-download">Скачать <i class="fas fa-download"></i></a>
                            </div>
                        </div>
                    </div>

                    <!-- Дисплеи -->
                    <div class="manual-item" data-category="displays">
                        <div class="manual-icon">
                            <i class="fas fa-desktop"></i>
                        </div>
                        <div class="manual-details">
                            <h3>Работа с OLED и LCD дисплеями</h3>
                            <p>Подробное руководство по подключению и программированию OLED и LCD дисплеев, включая библиотеки и примеры кода.</p>
                            <div class="manual-meta">
                                <span class="manual-type"><i class="fas fa-file-pdf"></i> PDF, 4.1 МБ</span>
                                <a href="#" class="manual-download">Скачать <i class="fas fa-download"></i></a>
                            </div>
                        </div>
                    </div>

                    <!-- Платы разработки -->
                    <div class="manual-item" data-category="development">
                        <div class="manual-icon">
                            <i class="fas fa-memory"></i>
                        </div>
                        <div class="manual-details">
                            <h3>Raspberry Pi для начинающих</h3>
                            <p>Руководство по настройке и использованию Raspberry Pi, установке операционной системы, подключению периферийных устройств.</p>
                            <div class="manual-meta">
                                <span class="manual-type"><i class="fas fa-file-pdf"></i> PDF, 6.3 МБ</span>
                                <a href="#" class="manual-download">Скачать <i class="fas fa-download"></i></a>
                            </div>
                        </div>
                    </div>

                    <!-- Компоненты питания -->
                    <div class="manual-item" data-category="power">
                        <div class="manual-icon">
                            <i class="fas fa-battery-full"></i>
                        </div>
                        <div class="manual-details">
                            <h3>Расчет и выбор источников питания</h3>
                            <p>Руководство по расчету потребляемой мощности, выбору и подключению источников питания для электронных проектов.</p>
                            <div class="manual-meta">
                                <span class="manual-type"><i class="fas fa-file-pdf"></i> PDF, 2.9 МБ</span>
                                <a href="#" class="manual-download">Скачать <i class="fas fa-download"></i></a>
                            </div>
                        </div>
                    </div>

                    <!-- Видеоуроки -->
                    <div class="manual-item" data-category="all">
                        <div class="manual-icon">
                            <i class="fas fa-video"></i>
                        </div>
                        <div class="manual-details">
                            <h3>Видеоуроки по электронике</h3>
                            <p>Серия видеоуроков по основам электроники, схемотехнике и программированию микроконтроллеров.</p>
                            <div class="manual-meta">
                                <span class="manual-type"><i class="fas fa-play-circle"></i> Видео, 15 уроков</span>
                                <a href="#" class="manual-download">Смотреть <i class="fas fa-external-link-alt"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="support-contact">
                <h2>Нужна дополнительная информация?</h2>
                <p>Свяжитесь с нашими специалистами для получения консультации:</p>
                <div class="contact-options">
                    <a href="feedback.php" class="contact-option">
                        <i class="fas fa-envelope"></i>
                        <span>Написать в поддержку</span>
                    </a>
                    <a href="tel:+73852234567" class="contact-option">
                        <i class="fas fa-phone"></i>
                        <span>Позвонить: +7 (385) 223-45-67</span>
                    </a>
                    <a href="chat.php" class="contact-option">
                        <i class="fas fa-comments"></i>
                        <span>Онлайн-чат с оператором</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</main>

<?php
// Include support footer
include 'support_footer.php';
?>
