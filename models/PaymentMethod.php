<?php
class PaymentMethod {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Получение всех банковских карт пользователя
     * @param int $userId ID пользователя
     * @return array Массив карт пользователя
     */
    public function getUserCards($userId) {
        $query = "SELECT * FROM payment_cards WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        $cards = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $cards[] = [
                'id' => $row['id'],
                'number' => $row['card_number'],
                'expiry' => $row['expiry_date'],
                'holder' => $row['holder_name'],
                'bank' => $row['bank_code'],
                'otherBank' => $row['other_bank'],
                'isDefault' => (bool)$row['is_default'],
                'type' => 'card',
                'last4' => substr($row['card_number'], -4),
                'bankName' => $row['bank_name']
            ];
        }
        
        return $cards;
    }
    
    /**
     * Получение всех электронных кошельков пользователя
     * @param int $userId ID пользователя
     * @return array Массив кошельков пользователя
     */
    public function getUserWallets($userId) {
        $query = "SELECT * FROM payment_wallets WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        $wallets = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $wallets[] = [
                'id' => $row['id'],
                'number' => $row['wallet_number'],
                'type' => $row['wallet_type'],
                'otherType' => $row['other_type'],
                'isDefault' => (bool)$row['is_default'],
                'typeName' => $row['type_name']
            ];
        }
        
        return $wallets;
    }
    
    /**
     * Сохранение банковской карты
     * @param int $userId ID пользователя
     * @param array $cardData Данные карты
     * @return array|bool Данные сохраненной карты или false в случае ошибки
     */
    public function saveCard($userId, $cardData) {
        // Если карта установлена по умолчанию, сбрасываем флаг у других карт
        if (isset($cardData['isDefault']) && $cardData['isDefault']) {
            $this->resetDefaultCards($userId);
        }
        
        $query = "INSERT INTO payment_cards (user_id, card_number, expiry_date, holder_name, bank_code, other_bank, is_default, bank_name) 
                 VALUES (:user_id, :card_number, :expiry_date, :holder_name, :bank_code, :other_bank, :is_default, :bank_name)";
        
        $stmt = $this->conn->prepare($query);
        
        $isDefault = isset($cardData['isDefault']) ? (int)$cardData['isDefault'] : 0;
        $bankName = isset($cardData['bankName']) ? $cardData['bankName'] : $this->getBankName($cardData['bank']);
        $otherBank = isset($cardData['otherBank']) ? $cardData['otherBank'] : '';
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':card_number', $cardData['number']);
        $stmt->bindParam(':expiry_date', $cardData['expiry']);
        $stmt->bindParam(':holder_name', $cardData['holder']);
        $stmt->bindParam(':bank_code', $cardData['bank']);
        $stmt->bindParam(':other_bank', $otherBank);
        $stmt->bindParam(':is_default', $isDefault);
        $stmt->bindParam(':bank_name', $bankName);
        
        if ($stmt->execute()) {
            $cardId = $this->conn->lastInsertId();
            $cardData['id'] = $cardId;
            return $cardData;
        }
        
        return false;
    }
    
    /**
     * Обновление банковской карты
     * @param int $userId ID пользователя
     * @param array $cardData Данные карты
     * @return array|bool Данные обновленной карты или false в случае ошибки
     */
    public function updateCard($userId, $cardData) {
        // Если карта установлена по умолчанию, сбрасываем флаг у других карт
        if (isset($cardData['isDefault']) && $cardData['isDefault']) {
            $this->resetDefaultCards($userId);
        }
        
        $query = "UPDATE payment_cards SET 
                 card_number = :card_number, 
                 expiry_date = :expiry_date, 
                 holder_name = :holder_name, 
                 bank_code = :bank_code, 
                 other_bank = :other_bank, 
                 is_default = :is_default, 
                 bank_name = :bank_name 
                 WHERE id = :id AND user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        
        $isDefault = isset($cardData['isDefault']) ? (int)$cardData['isDefault'] : 0;
        $bankName = isset($cardData['bankName']) ? $cardData['bankName'] : $this->getBankName($cardData['bank']);
        $otherBank = isset($cardData['otherBank']) ? $cardData['otherBank'] : '';
        
        $stmt->bindParam(':card_number', $cardData['number']);
        $stmt->bindParam(':expiry_date', $cardData['expiry']);
        $stmt->bindParam(':holder_name', $cardData['holder']);
        $stmt->bindParam(':bank_code', $cardData['bank']);
        $stmt->bindParam(':other_bank', $otherBank);
        $stmt->bindParam(':is_default', $isDefault);
        $stmt->bindParam(':bank_name', $bankName);
        $stmt->bindParam(':id', $cardData['id']);
        $stmt->bindParam(':user_id', $userId);
        
        if ($stmt->execute()) {
            return $cardData;
        }
        
        return false;
    }
    
    /**
     * Удаление банковской карты
     * @param int $userId ID пользователя
     * @param int $cardId ID карты
     * @return bool Результат удаления
     */
    public function deleteCard($userId, $cardId) {
        $query = "DELETE FROM payment_cards WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':id', $cardId);
        $stmt->bindParam(':user_id', $userId);
        
        return $stmt->execute();
    }
    
    /**
     * Сохранение электронного кошелька
     * @param int $userId ID пользователя
     * @param array $walletData Данные кошелька
     * @return array|bool Данные сохраненного кошелька или false в случае ошибки
     */
    public function saveWallet($userId, $walletData) {
        // Если кошелек установлен по умолчанию, сбрасываем флаг у других кошельков
        if (isset($walletData['isDefault']) && $walletData['isDefault']) {
            $this->resetDefaultWallets($userId);
        }
        
        $query = "INSERT INTO payment_wallets (user_id, wallet_number, wallet_type, other_type, is_default, type_name) 
                 VALUES (:user_id, :wallet_number, :wallet_type, :other_type, :is_default, :type_name)";
        
        $stmt = $this->conn->prepare($query);
        
        $isDefault = isset($walletData['isDefault']) ? (int)$walletData['isDefault'] : 0;
        $typeName = isset($walletData['typeName']) ? $walletData['typeName'] : $this->getWalletTypeName($walletData['type']);
        $otherType = isset($walletData['otherType']) ? $walletData['otherType'] : '';
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':wallet_number', $walletData['number']);
        $stmt->bindParam(':wallet_type', $walletData['type']);
        $stmt->bindParam(':other_type', $otherType);
        $stmt->bindParam(':is_default', $isDefault);
        $stmt->bindParam(':type_name', $typeName);
        
        if ($stmt->execute()) {
            $walletId = $this->conn->lastInsertId();
            $walletData['id'] = $walletId;
            return $walletData;
        }
        
        return false;
    }
    
    /**
     * Обновление электронного кошелька
     * @param int $userId ID пользователя
     * @param array $walletData Данные кошелька
     * @return array|bool Данные обновленного кошелька или false в случае ошибки
     */
    public function updateWallet($userId, $walletData) {
        // Если кошелек установлен по умолчанию, сбрасываем флаг у других кошельков
        if (isset($walletData['isDefault']) && $walletData['isDefault']) {
            $this->resetDefaultWallets($userId);
        }
        
        $query = "UPDATE payment_wallets SET 
                 wallet_number = :wallet_number, 
                 wallet_type = :wallet_type, 
                 other_type = :other_type, 
                 is_default = :is_default, 
                 type_name = :type_name 
                 WHERE id = :id AND user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        
        $isDefault = isset($walletData['isDefault']) ? (int)$walletData['isDefault'] : 0;
        $typeName = isset($walletData['typeName']) ? $walletData['typeName'] : $this->getWalletTypeName($walletData['type']);
        $otherType = isset($walletData['otherType']) ? $walletData['otherType'] : '';
        
        $stmt->bindParam(':wallet_number', $walletData['number']);
        $stmt->bindParam(':wallet_type', $walletData['type']);
        $stmt->bindParam(':other_type', $otherType);
        $stmt->bindParam(':is_default', $isDefault);
        $stmt->bindParam(':type_name', $typeName);
        $stmt->bindParam(':id', $walletData['id']);
        $stmt->bindParam(':user_id', $userId);
        
        if ($stmt->execute()) {
            return $walletData;
        }
        
        return false;
    }
    
    /**
     * Удаление электронного кошелька
     * @param int $userId ID пользователя
     * @param int $walletId ID кошелька
     * @return bool Результат удаления
     */
    public function deleteWallet($userId, $walletId) {
        $query = "DELETE FROM payment_wallets WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':id', $walletId);
        $stmt->bindParam(':user_id', $userId);
        
        return $stmt->execute();
    }
    
    /**
     * Сброс флага "по умолчанию" у всех карт пользователя
     * @param int $userId ID пользователя
     */
    private function resetDefaultCards($userId) {
        $query = "UPDATE payment_cards SET is_default = 0 WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
    }
    
    /**
     * Сброс флага "по умолчанию" у всех кошельков пользователя
     * @param int $userId ID пользователя
     */
    private function resetDefaultWallets($userId) {
        $query = "UPDATE payment_wallets SET is_default = 0 WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
    }
    
    /**
     * Получение названия банка по его коду
     * @param string $bankCode Код банка
     * @return string Название банка
     */
    private function getBankName($bankCode) {
        $banks = [
            'sberbank' => 'Сбербанк',
            'tinkoff' => 'Тинькофф',
            'alfabank' => 'Альфа-Банк',
            'vtb' => 'ВТБ',
            'gazprombank' => 'Газпромбанк',
            'other' => 'Другой'
        ];
        
        return isset($banks[$bankCode]) ? $banks[$bankCode] : 'Банковская карта';
    }
    
    /**
     * Получение названия типа кошелька по его коду
     * @param string $walletType Код типа кошелька
     * @return string Название типа кошелька
     */
    private function getWalletTypeName($walletType) {
        $types = [
            'yoomoney' => 'ЮМани',
            'qiwi' => 'QIWI',
            'webmoney' => 'WebMoney',
            'paypal' => 'PayPal',
            'other' => 'Другой'
        ];
        
        return isset($types[$walletType]) ? $types[$walletType] : 'Электронный кошелек';
    }
}
