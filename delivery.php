//delivery.php
<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Page title
$pageTitle = 'Доставка';

// Include required models
require_once 'models/Category.php';

// Get categories
$category = new Category();
$categories = $category->getAll();

// Additional CSS
$additionalCss = '<link rel="stylesheet" href="assets/css/toast.css">
<link rel="stylesheet" href="assets/css/category-icons.css">
<link rel="stylesheet" href="assets/css/section-title.css">
<link rel="stylesheet" href="assets/css/delivery-page.css">';

// Additional JS
$additionalJs = '';

// Include header
include 'includes/header/header.php';
?>

<main>
    <div class="container">
        <!-- Delivery Header Section -->
        <section class="delivery-header">
            <div class="section-title-wrapper">
                <h2 class="section-title">Доставка</h2>
                <div class="section-title-decoration"></div>
            </div>
            <div class="delivery-description">
                <p>Мы предлагаем различные способы доставки, чтобы вы могли выбрать наиболее удобный для вас вариант. Наша цель - обеспечить быструю и надежную доставку ваших заказов.</p>
            </div>
        </section>

        <!-- Delivery Options Section -->
        <section class="delivery-options">
            <div class="delivery-grid">
                <div class="delivery-card">
                    <div class="delivery-card-icon">
                        <i class="fas fa-truck"></i>
                    </div>
                    <div class="delivery-card-content">
                        <h3>Курьерская доставка</h3>
                        <p>Доставка курьером до двери в течение 1-3 рабочих дней. Доступна в крупных городах.</p>
                        <div class="delivery-price">от 300 ₽</div>
                    </div>
                </div>
                
                <div class="delivery-card">
                    <div class="delivery-card-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="delivery-card-content">
                        <h3>Почта России</h3>
                        <p>Доставка в любую точку России. Срок доставки 5-14 дней в зависимости от региона.</p>
                        <div class="delivery-price">от 200 ₽</div>
                    </div>
                </div>
                
                <div class="delivery-card">
                    <div class="delivery-card-icon">
                        <i class="fas fa-store-alt"></i>
                    </div>
                    <div class="delivery-card-content">
                        <h3>Самовывоз</h3>
                        <p>Вы можете забрать свой заказ самостоятельно из нашего магазина. Заказ будет готов к выдаче в течение 1-2 дней.</p>
                        <div class="delivery-price">Бесплатно</div>
                    </div>
                </div>
                
                <div class="delivery-card">
                    <div class="delivery-card-icon">
                        <i class="fas fa-shipping-fast"></i>
                    </div>
                    <div class="delivery-card-content">
                        <h3>Экспресс-доставка</h3>
                        <p>Срочная доставка в день заказа или на следующий день. Доступна только в некоторых городах.</p>
                        <div class="delivery-price">от 500 ₽</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Delivery Terms Section -->
        <section class="delivery-terms">
            <h3 class="subsection-title">Условия доставки</h3>
            <div class="delivery-terms-content">
                <div class="delivery-terms-item">
                    <h4><i class="fas fa-clock"></i> Сроки доставки</h4>
                    <p>Сроки доставки зависят от выбранного способа доставки и вашего региона. Обычно доставка занимает от 1 до 14 дней.</p>
                </div>
                
                <div class="delivery-terms-item">
                    <h4><i class="fas fa-money-bill-wave"></i> Стоимость доставки</h4>
                    <p>Стоимость доставки зависит от способа доставки, веса заказа и региона. При заказе на сумму от 5000 ₽ доставка бесплатная (кроме экспресс-доставки).</p>
                </div>
                
                <div class="delivery-terms-item">
                    <h4><i class="fas fa-map-marker-alt"></i> Зона доставки</h4>
                    <p>Мы осуществляем доставку по всей России. Для некоторых отдаленных регионов сроки доставки могут быть увеличены.</p>
                </div>
                
                <div class="delivery-terms-item">
                    <h4><i class="fas fa-exclamation-circle"></i> Важная информация</h4>
                    <p>При получении заказа проверяйте комплектацию и целостность товара. В случае обнаружения повреждений или несоответствий, сообщите об этом курьеру или сотруднику пункта выдачи.</p>
                </div>
            </div>
        </section>

        <!-- Delivery FAQ Section -->
        <section class="delivery-faq">
            <h3 class="subsection-title">Часто задаваемые вопросы</h3>
            <div class="faq-items">
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Как отследить мой заказ?</h4>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>После оформления заказа вы получите трек-номер для отслеживания. Вы можете отслеживать статус доставки в личном кабинете или на сайте транспортной компании.</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Что делать, если я не получил заказ в указанный срок?</h4>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Если вы не получили заказ в указанный срок, пожалуйста, свяжитесь с нашей службой поддержки. Мы проверим статус вашего заказа и предоставим актуальную информацию.</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Можно ли изменить адрес доставки после оформления заказа?</h4>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        <p>Да, вы можете изменить адрес доставки, если заказ еще не передан в службу доставки. Для этого свяжитесь с нашей службой поддержки как можно скорее.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            answer.classList.toggle('active');
            question.querySelector('i').classList.toggle('fa-chevron-up');
            question.querySelector('i').classList.toggle('fa-chevron-down');
        });
    });
});
</script>

<?php
// Include footer
include 'includes/footer/footer.php';
?>
</body>
</html>
