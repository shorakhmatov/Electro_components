<!-- Модальное окно для ввода кода подтверждения платежа -->
<div id="verification-modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Подтверждение платежа</h2>
        <p>На ваш номер телефона отправлен код подтверждения. Введите его для завершения платежа.</p>
        
        <form id="verification-form">
            <div class="form-group">
                <label for="verification-code">Код подтверждения</label>
                <input type="text" id="verification-code" name="verification_code" placeholder="Введите код" maxlength="6" autocomplete="off" required>
            </div>
            
            <div id="verification-error" class="error-message" style="display: none;"></div>
            <div id="attempts-left" class="info-message" style="display: none;"></div>
            
            <div class="timer-container">
                <p>Срок действия кода: <span id="verification-timer">05:00</span></p>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Подтвердить</button>
                <button type="button" id="resend-code-btn" class="btn btn-secondary">Отправить код повторно</button>
            </div>
        </form>
    </div>
</div>

<!-- Модальное окно успешного оформления заказа -->
<div id="success-modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <div class="success-message">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Заказ успешно оформлен!</h3>
            <p>Ваш платеж был успешно обработан. Спасибо за покупку!</p>
            
            <div class="order-details">
                <div class="order-detail">
                    <span class="label">Номер заказа:</span>
                    <span id="order-number" class="value"></span>
                </div>
                <div class="order-detail">
                    <span class="label">Сумма:</span>
                    <span id="order-amount" class="value"></span>
                </div>
                <div class="order-detail">
                    <span class="label">Дата:</span>
                    <span id="order-date" class="value"></span>
                </div>
            </div>
            
            <div class="success-actions">
                <a href="profile.php?tab=orders" class="btn btn-primary">Перейти к моим заказам</a>
                <a href="index.php" class="btn btn-secondary">Вернуться на главную</a>
            </div>
        </div>
    </div>
</div>

<!-- Индикатор загрузки -->
<div id="loading-overlay" style="display: none;">
    <div class="loader"></div>
</div>
