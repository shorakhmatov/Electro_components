
// payment.js
class PaymentSystem {
    constructor() {
        this.paymentUrl = '/payment/api';
    }

    // Пополнение баланса
    async addBalance(userId, amount) {
        try {
            const response = await fetch(`${this.paymentUrl}/balance/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    amount: amount
                })
            });

            const data = await response.json();
            if (data.payment_url) {
                window.location.href = data.payment_url;
            } else {
                throw new Error(data.error || 'Ошибка при создании платежа');
            }
        } catch (error) {
            console.error('Ошибка при пополнении баланса:', error);
            throw error;
        }
    }

    // Оплата заказа
    async processPayment(userId, amount, paymentMethod) {
        try {
            const response = await fetch(`${this.paymentUrl}/payment/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    amount: amount,
                    payment_method: paymentMethod
                })
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                // Если оплата с баланса - показываем успех
                this.showSuccessMessage(`Оплата успешно выполнена. Новый баланс: ${data.new_balance} ₽`);
                return true;
            } else if (data.payment_url) {
                // Если оплата через Сбер - редирект на форму оплаты
                window.location.href = data.payment_url;
            } else {
                throw new Error(data.error || 'Ошибка при обработке платежа');
            }
        } catch (error) {
            console.error('Ошибка при обработке платежа:', error);
            this.showErrorMessage(error.message);
            throw error;
        }
    }

    // Проверка баланса
    async checkBalance(userId) {
        try {
            const response = await fetch(`${this.paymentUrl}/balance/check?user_id=${userId}`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data.balance;
        } catch (error) {
            console.error('Ошибка при проверке баланса:', error);
            throw error;
        }
    }

    // Показ сообщения об успехе
    showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Показ сообщения об ошибке
    showErrorMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Пример использования:
const payment = new PaymentSystem();

// Обработчик формы пополнения баланса
document.getElementById('addBalanceForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const userId = document.getElementById('userId').value;
    
    try {
        await payment.addBalance(userId, amount);
    } catch (error) {
        payment.showErrorMessage(error.message);
    }
});

// Обработчик формы оплаты заказа
document.getElementById('paymentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const userId = document.getElementById('paymentUserId').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    try {
        await payment.processPayment(userId, amount, paymentMethod);
    } catch (error) {
        payment.showErrorMessage(error.message);
    }
});
