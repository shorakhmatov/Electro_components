/**
 * Скрипт для чата с технической поддержкой и автоматического бота
 */
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация чата
    initChat();
    
    // Обработка отправки сообщений
    initMessageSending();
    
    // Обработка выбора темы
    initTopicSelection();
    
    // Обработка кнопок действий
    initChatActions();
    
    // Инициализация чат-бота
    initChatbot();
});

/**
 * Инициализация чата
 */
function initChat() {
    // Прокрутка чата вниз при загрузке
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Добавляем обработчик события прокрутки для анимации
        chatMessages.addEventListener('scroll', function() {
            // Добавляем класс для анимации при прокрутке
            chatMessages.classList.add('scrolling');
            
            // Удаляем класс через некоторое время
            clearTimeout(chatMessages.scrollTimer);
            chatMessages.scrollTimer = setTimeout(function() {
                chatMessages.classList.remove('scrolling');
            }, 150);
        });
    }
    
    // Автоматическое изменение высоты текстового поля
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            if (this.scrollHeight > 100) {
                this.style.height = '100px';
            }
        });
    }
}

/**
 * Инициализация отправки сообщений
 */
function initMessageSending() {
    const sendButton = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!sendButton || !messageInput || !chatMessages) return;
    
    // Отправка сообщения по клику на кнопку
    sendButton.addEventListener('click', function() {
        sendMessage();
    });
    
    // Отправка сообщения по нажатию Enter (без Shift)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Функция отправки сообщения
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;
        
        // Получаем текущее время
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        // Создаем элемент сообщения пользователя
        const userMessageHTML = `
            <div class="message user-message">
                <div class="message-bubble">
                    <div class="message-content">
                        <p>${escapeHTML(message)}</p>
                    </div>
                    <div class="message-time">${timeString}</div>
                </div>
            </div>
        `;
        
        // Добавляем сообщение пользователя в чат
        chatMessages.insertAdjacentHTML('beforeend', userMessageHTML);
        
        // Очищаем поле ввода
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        // Прокручиваем чат вниз
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Имитация печатания оператором
        setTimeout(() => {
            const typingHTML = `
                <div class="message operator-message" id="typingIndicator">
                    <div class="message-avatar">
                        <img src="assets/img/support/operator.jpg" alt="Оператор">
                    </div>
                    <div class="message-bubble">
                        <div class="message-sender">Оператор Анна</div>
                        <div class="message-content">
                            <p>печатает...</p>
                        </div>
                    </div>
                </div>
            `;
            
            chatMessages.insertAdjacentHTML('beforeend', typingHTML);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Имитация ответа оператора через 2 секунды
            setTimeout(() => {
                // Удаляем индикатор печатания
                document.getElementById('typingIndicator').remove();
                
                // Генерируем ответ в зависимости от сообщения пользователя
                let response = getOperatorResponse(message);
                
                // Создаем элемент сообщения оператора
                const operatorMessageHTML = `
                    <div class="message operator-message">
                        <div class="message-avatar">
                            <img src="assets/img/support/operator.jpg" alt="Оператор">
                        </div>
                        <div class="message-bubble">
                            <div class="message-sender">Оператор Анна</div>
                            <div class="message-content">
                                <p>${response}</p>
                            </div>
                            <div class="message-time">${timeString}</div>
                        </div>
                    </div>
                `;
                
                // Добавляем сообщение оператора в чат
                chatMessages.insertAdjacentHTML('beforeend', operatorMessageHTML);
                
                // Прокручиваем чат вниз
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 2000);
        }, 1000);
    }
    
    // Функция для экранирования HTML
    function escapeHTML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\n/g, '<br>');
    }
    
    // Функция для генерации ответа оператора
    function getOperatorResponse(message) {
        // Используем функцию из файла chatbot-responses.js
        return getBotResponse(message);
    }
}

/**
 * Инициализация выбора темы
 */
function initTopicSelection() {
    const topicButtons = document.querySelectorAll('.topic-item');
    const messageInput = document.getElementById('messageInput');
    
    if (!topicButtons.length || !messageInput) return;
    
    topicButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topic = this.dataset.topic;
            let message = '';
            
            switch (topic) {
                case 'order':
                    message = 'Здравствуйте! У меня вопрос по моему заказу.';
                    break;
                case 'delivery':
                    message = 'Здравствуйте! Подскажите, пожалуйста, сроки доставки в мой регион.';
                    break;
                case 'payment':
                    message = 'Здравствуйте! Какие способы оплаты доступны на вашем сайте?';
                    break;
                case 'return':
                    message = 'Здравствуйте! Подскажите, как оформить возврат товара?';
                    break;
                case 'technical':
                    message = 'Здравствуйте! Мне нужна техническая консультация по товару.';
                    break;
                default:
                    message = 'Здравствуйте! У меня есть вопрос.';
            }
            
            messageInput.value = message;
            messageInput.focus();
        });
    });
}

/**
 * Инициализация кнопок действий
 */
function initChatActions() {
    const clearChatButton = document.getElementById('btnClearChat');
    const saveChatButton = document.getElementById('btnSaveChat');
    const chatMessages = document.getElementById('chatMessages');
    
    if (clearChatButton && chatMessages) {
        clearChatButton.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите очистить историю чата?')) {
                // Оставляем только системное сообщение и приветствие оператора
                const systemMessages = chatMessages.querySelectorAll('.system-message, .operator-message');
                const messagesToKeep = Array.from(systemMessages).slice(0, 2);
                
                // Удаляем все сообщения
                chatMessages.innerHTML = '';
                
                // Добавляем обратно системное сообщение и приветствие оператора
                messagesToKeep.forEach(message => {
                    chatMessages.appendChild(message.cloneNode(true));
                });
            }
        });
    }
    
    if (saveChatButton && chatMessages) {
        saveChatButton.addEventListener('click', function() {
            // Получаем текст всех сообщений
            let chatText = 'История чата с технической поддержкой ElectroStore\n';
            chatText += '=================================================\n\n';
            
            const messages = chatMessages.querySelectorAll('.message');
            messages.forEach(message => {
                const time = message.querySelector('.message-time')?.textContent || '';
                const sender = message.querySelector('.message-sender')?.textContent || 'Система';
                const content = message.querySelector('.message-content p')?.textContent || '';
                
                if (message.classList.contains('system-message')) {
                    chatText += `[${time}] Система: ${content}\n`;
                } else if (message.classList.contains('operator-message')) {
                    chatText += `[${time}] ${sender}: ${content}\n`;
                } else if (message.classList.contains('user-message')) {
                    chatText += `[${time}] Вы: ${content}\n`;
                }
                
                chatText += '\n';
            });
            
            // Создаем файл для скачивания
            const blob = new Blob([chatText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat_history_${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(a);
            a.click();
            
            // Очищаем ресурсы
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        });
    }
}

/**
 * Инициализация чат-бота
 */
function initChatbot() {
    // Проверяем, загружен ли файл с ответами чат-бота
    if (typeof getBotResponse !== 'function') {
        console.error('Функция getBotResponse не найдена. Убедитесь, что файл chatbot-responses.js подключен.');
        return;
    }
    
    // Обновляем информацию об операторе
    const operatorStatus = document.querySelector('.operator-status');
    if (operatorStatus) {
        operatorStatus.textContent = 'Автоматический бот';
    }
    
    const operatorName = document.querySelectorAll('.message-sender');
    operatorName.forEach(element => {
        if (element.textContent === 'Оператор Анна') {
            element.textContent = 'Бот поддержки';
        }
    });
    
    // Обновляем первое сообщение оператора
    const operatorMessages = document.querySelectorAll('.operator-message .message-content p');
    if (operatorMessages.length > 0) {
        operatorMessages[0].textContent = 'Здравствуйте! Я автоматический бот технической поддержки ElectroStore. Я могу ответить на вопросы о товарах, доставке, оплате и других услугах. Чем могу помочь?';
    }
    
    // Обновляем время ответа
    const responseTimeSpan = document.querySelector('.operator-response-time span');
    if (responseTimeSpan) {
        responseTimeSpan.textContent = 'мгновенно';
    }
    
    console.log('Чат-бот успешно инициализирован');
}
