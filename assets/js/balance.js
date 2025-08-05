document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const currentBalance = document.getElementById('currentBalance');
    const bonusPoints = document.getElementById('bonusPoints');
    const transactionForm = document.getElementById('transactionForm');
    const typeButtons = document.querySelectorAll('.type-button');
    const submitButton = document.getElementById('submitTransaction');
    const transactionList = document.getElementById('transactionList');

    // Проверяем, находимся ли мы на странице баланса
    // Если нет необходимых элементов, прекращаем выполнение скрипта
    if (!transactionForm) {
        console.log('Страница баланса не загружена или элементы не найдены');
        return; // Выходим из функции, если мы не на странице баланса
    }

    // Form inputs
    const amountInput = document.getElementById('amount');
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');

    // Load initial data from API
    let balance = 0;
    let transactions = [];

    try {
        const response = await fetch('api/balance.php');
        const data = await response.json();
        balance = data.balance;
        transactions = data.transactions;
        updateDisplay();
        renderTransactions();
    } catch (error) {
        console.error('Failed to load initial data:', error);
    }

    // Type button handlers
    if (typeButtons && typeButtons.length > 0 && submitButton) {
        typeButtons.forEach(button => {
            button.addEventListener('click', () => {
                typeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const type = button.dataset.type;
                submitButton.innerHTML = `
                    <i class="fas fa-${type === 'deposit' ? 'plus' : 'minus'}"></i>
                    <span>${type === 'deposit' ? 'Пополнить' : 'Снять'} баланс</span>
                `;
            });
        });
    }

    // Card number formatting
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }

    // Expiry date formatting
    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0,2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }

    // Form submission
    if (transactionForm) {
        transactionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) return;

            const amount = parseFloat(amountInput.value);
            const typeButton = document.querySelector('.type-button.active');
            
            if (!typeButton) {
                alert('Выберите тип операции');
                return;
            }
            
            const type = typeButton.dataset.type;
            
            if (type === 'withdraw' && amount > balance) {
                showError(amountInput, 'Недостаточно средств');
                return;
            }
            
            try {
                const response = await fetch('api/balance.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type,
                        amount,
                        payment_method: 'card',
                        description: `Card ending in ${cardNumber.value.slice(-4)}`
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    // Update balance and transactions
                    balance = data.new_balance;
                    
                    // Refresh transaction list
                    const historyResponse = await fetch('api/balance.php');
                    const historyData = await historyResponse.json();
                    transactions = historyData.transactions;

                    // Update UI
                    updateDisplay();
                    renderTransactions();
                    transactionForm.reset();

                    // Show success message
                    alert(type === 'deposit' ? 'Баланс успешно пополнен!' : 'Средства успешно выведены!');
                } else {
                    throw new Error(data.error || 'Failed to process transaction');
                }
            } catch (error) {
                alert('Произошла ошибка при обработке транзакции. Пожалуйста, попробуйте снова.');
            }
        });
    }

    // Helper functions
    function validateForm() {
        let isValid = true;

        // Amount validation
        if (!amountInput.value || parseFloat(amountInput.value) < 1) {
            showError(amountInput, 'Введите корректную сумму');
            isValid = false;
        }

        // Card number validation
        if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardNumber.value)) {
            showError(cardNumber, 'Введите корректный номер карты');
            isValid = false;
        }

        // Expiry date validation
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry.value)) {
            showError(cardExpiry, 'Введите корректную дату');
            isValid = false;
        }

        // CVV validation
        if (!/^\d{3}$/.test(cardCvv.value)) {
            showError(cardCvv, 'Введите корректный CVV');
            isValid = false;
        }

        return isValid;
    }

    function showError(input, message) {
        input.classList.add('error');
        const errorDiv = input.parentElement.querySelector('.error-message');
        errorDiv.textContent = message;

        input.addEventListener('input', function removeError() {
            input.classList.remove('error');
            errorDiv.textContent = '';
            input.removeEventListener('input', removeError);
        });
    }

    function updateDisplay() {
        if (currentBalance) {
            currentBalance.textContent = `${formatPrice(balance)} ₽`;
        }
    }

    function renderTransactions() {
        if (transactionList && transactions && transactions.length > 0) {
            transactionList.innerHTML = transactions.slice(0, 10).map(transaction => `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-icon ${transaction.type}">
                            <i class="fas fa-${transaction.type === 'deposit' ? 'plus' : 'minus'}"></i>
                        </div>
                        <div class="transaction-details">
                            <div class="transaction-type">
                                ${transaction.type === 'deposit' ? 'Пополнение' : 'Снятие'}
                            </div>
                            <div class="transaction-date">
                                ${formatDate(transaction.date)}
                            </div>
                        </div>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'deposit' ? '+' : '-'}${formatPrice(transaction.amount)} ₽
                    </div>
                </div>
            `).join('');
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
});
