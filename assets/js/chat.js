// chat.js
document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chatWidget');
    const chatButton = chatWidget.querySelector('.chat-widget__button');
    const chatContainer = chatWidget.querySelector('.chat-widget__container');
    const closeButton = chatWidget.querySelector('.close');
    const messageInput = chatWidget.querySelector('input');
    const sendButton = chatWidget.querySelector('.chat-widget__input button');
    const messagesContainer = chatWidget.querySelector('.chat-widget__messages');

    // Открыть/закрыть чат
    chatButton.addEventListener('click', () => {
        chatContainer.style.display = 'block';
        messageInput.focus();
    });

    closeButton.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });

    // Отправка сообщения
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // Добавляем сообщение пользователя
            addMessage(message, 'user');
            messageInput.value = '';

            // Имитация ответа бота
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, 'bot');
            }, 1000);
        }
    }

    // Обработка нажатия Enter
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Обработка клика на кнопку отправки
    sendButton.addEventListener('click', sendMessage);

    // Добавление сообщения в чат
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        const icon = type === 'bot' ? 
            '<i class="fas fa-robot"></i>' : 
            '<i class="fas fa-user"></i>';
        
        messageDiv.innerHTML = `
            ${icon}
            <div class="message-content">
                <span class="message-text">${text}</span>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Получение текущего времени
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Простые ответы бота
    function getBotResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('привет') || message.includes('здравствуйте')) {
            return 'Здравствуйте! Чем могу помочь?';
        }
        else if (message.includes('доставка') || message.includes('доставку')) {
            return 'Мы осуществляем доставку по всей России. При заказе от 5000 рублей доставка бесплатная!';
        }
        else if (message.includes('оплата') || message.includes('оплатить')) {
            return 'Мы принимаем оплату картами Visa, MasterCard, МИР, а также наличными при получении.';
        }
        else if (message.includes('скидк') || message.includes('акци')) {
            return 'Сейчас у нас действует скидка 15% на все микроконтроллеры Arduino!';
        }
        else if (message.includes('контакты') || message.includes('телефон') || message.includes('почта')) {
            return 'Вы можете связаться с нами по телефону 8-800-123-45-67 или по email: support@electrostore.ru';
        }
        else {
            return 'Извините, я не совсем понял ваш вопрос. Попробуйте переформулировать или свяжитесь с нашей службой поддержки.';
        }
    }

    // Добавляем приветственное сообщение
    setTimeout(() => {
        addMessage('Здравствуйте! Я виртуальный помощник ElectroStore. Чем могу помочь?', 'bot');
    }, 1000);
});
