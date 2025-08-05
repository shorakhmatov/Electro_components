from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config
import requests
import json
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'deposit' или 'payment'
    status = db.Column(db.String(20), nullable=False)  # 'pending', 'completed', 'failed'
    payment_method = db.Column(db.String(20), nullable=False)  # 'sber' или 'balance'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    order_id = db.Column(db.String(50), nullable=True)

@app.route('/api/balance/add', methods=['POST'])
def add_balance():
    data = request.json
    user_id = data.get('user_id')
    amount = data.get('amount')
    
    if not user_id or not amount:
        return jsonify({'error': 'Missing required parameters'}), 400
    
    # Создаем транзакцию
    transaction = Transaction(
        user_id=user_id,
        amount=amount,
        type='deposit',
        status='pending',
        payment_method='sber'
    )
    db.session.add(transaction)
    db.session.commit()
    
    # Создаем платеж в Сбербанке
    sber_data = {
        'amount': amount * 100,  # Сбербанк принимает копейки
        'currency': 'RUB',
        'orderNumber': f'deposit_{transaction.id}',
        'returnUrl': f'{request.host_url}api/payment/callback',
        'failUrl': f'{request.host_url}api/payment/callback'
    }
    
    headers = {
        'Authorization': f'Bearer {app.config["SBER_API_TOKEN"]}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(
        f'{app.config["SBER_API_URL"]}register',
        json=sber_data,
        headers=headers
    )
    
    if response.status_code == 200:
        payment_data = response.json()
        transaction.order_id = payment_data.get('orderId')
        db.session.commit()
        return jsonify({
            'payment_url': payment_data.get('formUrl'),
            'transaction_id': transaction.id
        })
    
    return jsonify({'error': 'Payment initialization failed'}), 500

@app.route('/api/payment/process', methods=['POST'])
def process_payment():
    data = request.json
    user_id = data.get('user_id')
    amount = data.get('amount')
    payment_method = data.get('payment_method')  # 'sber' или 'balance'
    
    if not all([user_id, amount, payment_method]):
        return jsonify({'error': 'Missing required parameters'}), 400
    
    # Проверяем баланс если оплата с баланса
    if payment_method == 'balance':
        cursor = db.session.execute('SELECT balance FROM users WHERE id = :user_id', {'user_id': user_id})
        user_balance = cursor.scalar()
        
        if user_balance < amount:
            return jsonify({'error': 'Insufficient balance'}), 400
        
        # Создаем транзакцию
        transaction = Transaction(
            user_id=user_id,
            amount=amount,
            type='payment',
            status='completed',
            payment_method='balance'
        )
        db.session.add(transaction)
        
        # Обновляем баланс пользователя
        db.session.execute(
            'UPDATE users SET balance = balance - :amount WHERE id = :user_id',
            {'amount': amount, 'user_id': user_id}
        )
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'transaction_id': transaction.id,
            'new_balance': user_balance - amount
        })
    
    # Если оплата через Сбер
    elif payment_method == 'sber':
        transaction = Transaction(
            user_id=user_id,
            amount=amount,
            type='payment',
            status='pending',
            payment_method='sber'
        )
        db.session.add(transaction)
        db.session.commit()
        
        # Создаем платеж в Сбербанке
        sber_data = {
            'amount': amount * 100,
            'currency': 'RUB',
            'orderNumber': f'payment_{transaction.id}',
            'returnUrl': f'{request.host_url}api/payment/callback',
            'failUrl': f'{request.host_url}api/payment/callback'
        }
        
        headers = {
            'Authorization': f'Bearer {app.config["SBER_API_TOKEN"]}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            f'{app.config["SBER_API_URL"]}register',
            json=sber_data,
            headers=headers
        )
        
        if response.status_code == 200:
            payment_data = response.json()
            transaction.order_id = payment_data.get('orderId')
            db.session.commit()
            return jsonify({
                'payment_url': payment_data.get('formUrl'),
                'transaction_id': transaction.id
            })
    
    return jsonify({'error': 'Invalid payment method'}), 400

@app.route('/api/payment/callback', methods=['GET', 'POST'])
def payment_callback():
    order_id = request.args.get('orderId')
    
    if not order_id:
        return jsonify({'error': 'Missing orderId'}), 400
    
    # Проверяем статус платежа в Сбербанке
    headers = {
        'Authorization': f'Bearer {app.config["SBER_API_TOKEN"]}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(
        f'{app.config["SBER_API_URL"]}getOrderStatus',
        params={'orderId': order_id},
        headers=headers
    )
    
    if response.status_code != 200:
        return jsonify({'error': 'Failed to check payment status'}), 500
    
    payment_status = response.json()
    transaction = Transaction.query.filter_by(order_id=order_id).first()
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    # Обрабатываем статус платежа
    if payment_status.get('OrderStatus') == 2:  # Успешный платеж
        transaction.status = 'completed'
        
        if transaction.type == 'deposit':
            # Пополняем баланс пользователя
            db.session.execute(
                'UPDATE users SET balance = balance + :amount WHERE id = :user_id',
                {'amount': transaction.amount, 'user_id': transaction.user_id}
            )
        
        db.session.commit()
        return jsonify({'status': 'success', 'transaction_id': transaction.id})
    else:
        transaction.status = 'failed'
        db.session.commit()
        return jsonify({'status': 'failed', 'transaction_id': transaction.id})

@app.route('/api/balance/check', methods=['GET'])
def check_balance():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400
    
    cursor = db.session.execute('SELECT balance FROM users WHERE id = :user_id', {'user_id': user_id})
    balance = cursor.scalar()
    
    if balance is None:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'balance': balance})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
