// Форматирование телефонного номера в формате +7-(XXX)-XXX-XX-XX
document.addEventListener('DOMContentLoaded', function() {
    // Находим все поля ввода телефона
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[data-type="phone"]');
    
    phoneInputs.forEach(input => {
        // Устанавливаем плейсхолдер
        input.placeholder = '+7XXXXXXXXXX';
        
        // Устанавливаем начальное значение +7-
        input.addEventListener('focus', function() {
            if (!this.value) {
                this.value = '+7-';
            }
        });
        
        // Обрабатываем ввод
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            // Если пользователь стер все, включая +7, восстанавливаем +7-
            if (value.length < 1) {
                this.value = '+7-';
                return;
            }
            
            // Форматируем номер
            if (value.length > 0) {
                // Убираем первую цифру, если это 7 (так как мы уже добавили +7-)
                if (value.charAt(0) === '7') {
                    value = value.substring(1);
                }
                
                // Форматируем номер
                let formattedNumber = '+7-';
                
                if (value.length > 0) {
                    formattedNumber += '(' + value.substring(0, Math.min(3, value.length));
                }
                
                if (value.length > 3) {
                    formattedNumber += ')-' + value.substring(3, Math.min(6, value.length));
                } else if (value.length === 3) {
                    formattedNumber += ')';
                }
                
                if (value.length > 6) {
                    formattedNumber += '-' + value.substring(6, Math.min(8, value.length));
                }
                
                if (value.length > 8) {
                    formattedNumber += '-' + value.substring(8, Math.min(10, value.length));
                }
                
                this.value = formattedNumber;
            }
        });
        
        // Проверяем валидность номера при потере фокуса
        input.addEventListener('blur', function() {
            const digitsOnly = this.value.replace(/\D/g, '');
            
            // Если номер неполный, показываем ошибку
            if (digitsOnly.length !== 11) {
                this.classList.add('invalid');
                
                // Находим сообщение об ошибке
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                    errorMessage.textContent = 'Введите полный номер телефона';
                }
            } else {
                this.classList.remove('invalid');
                
                // Скрываем сообщение об ошибке
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
            }
            
            // Если пользователь оставил только +7-, очищаем поле
            if (this.value === '+7-') {
                this.value = '';
            }
        });
    });
    
    // Обновляем обработчики форм для поддержки входа по телефону
    updateLoginForms();
});

// Функция для обновления форм входа
function updateLoginForms() {
    // Находим все формы входа
    const loginForms = document.querySelectorAll('#loginForm, #modalLoginForm');
    
    loginForms.forEach(form => {
        if (!form) return;
        
        // Находим поле email
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput) return;
        
        // Меняем тип поля на text и добавляем атрибут data-type
        emailInput.type = 'text';
        emailInput.setAttribute('data-type', 'email-or-phone');
        
        // Обновляем label и placeholder
        const emailLabel = emailInput.previousElementSibling;
        if (emailLabel && emailLabel.tagName === 'LABEL') {
            emailLabel.textContent = 'Email или телефон';
        }
        
        // Устанавливаем плейсхолдер в формате +7-(XXX)-XXX-XX-XX
        emailInput.placeholder = 'Email или +7-(XXX)-XXX-XX-XX';
        
        // Добавляем обработчик ввода для определения типа вводимых данных
        emailInput.addEventListener('input', function() {
            const value = this.value.trim();
            
            // Если пользователь начинает вводить +7, переключаемся на формат телефона
            if (value.startsWith('+7') || value.startsWith('7') || value.startsWith('8')) {
                this.setAttribute('data-input-type', 'phone');
                
                // Если это начало ввода телефона, форматируем его
                if (value === '+7' || value === '7' || value === '8') {
                    this.value = '+7-';
                } else {
                    // Применяем форматирование телефона
                    let phoneValue = value.replace(/\D/g, '');
                    
                    // Если номер начинается с 8, заменяем на 7
                    if (phoneValue.charAt(0) === '8') {
                        phoneValue = '7' + phoneValue.substring(1);
                    }
                    
                    // Форматируем номер
                    let formattedNumber = '+7-';
                    
                    if (phoneValue.length > 1) {
                        formattedNumber += '(' + phoneValue.substring(1, Math.min(4, phoneValue.length));
                    }
                    
                    if (phoneValue.length > 4) {
                        formattedNumber += ')-' + phoneValue.substring(4, Math.min(7, phoneValue.length));
                    } else if (phoneValue.length === 4) {
                        formattedNumber += ')';
                    }
                    
                    if (phoneValue.length > 7) {
                        formattedNumber += '-' + phoneValue.substring(7, Math.min(9, phoneValue.length));
                    }
                    
                    if (phoneValue.length > 9) {
                        formattedNumber += '-' + phoneValue.substring(9, Math.min(11, phoneValue.length));
                    }
                    
                    this.value = formattedNumber;
                }
            } else {
                // Если это не телефон, это email
                this.setAttribute('data-input-type', 'email');
            }
        });
        
        // Добавляем обработчик фокуса
        emailInput.addEventListener('focus', function() {
            // Если поле пустое, показываем плейсхолдер
            if (!this.value) {
                this.placeholder = 'Email или +7-(XXX)-XXX-XX-XX';
            }
        });
    });
}

// Функция для получения чистого номера телефона (только цифры)
function getCleanPhoneNumber(formattedNumber) {
    return formattedNumber.replace(/\D/g, '');
}

// Функция для проверки, является ли строка email
function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Функция для проверки, является ли строка телефоном
function isPhone(value) {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length === 11;
}
