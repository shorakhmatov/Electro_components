<?php
class DeliveryAddress {
    private $conn;

    /**
     * Конструктор класса
     * @param PDO $db Соединение с базой данных
     */
    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Получение всех адресов доставки пользователя
     * @param int $userId ID пользователя
     * @return array Массив адресов пользователя
     */
    public function getUserAddresses($userId) {
        $query = "SELECT * FROM delivery_addresses WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        $addresses = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $addresses[] = [
                'id' => $row['id'],
                'type' => $row['address_type'],
                'service' => $row['service'],
                'city' => $row['city'],
                'street' => $row['street'],
                'building' => $row['building'],
                'apartment' => $row['apartment'],
                'postalCode' => $row['postal_code'],
                'comment' => $row['comment'],
                'pointId' => $row['point_id'],
                'pointAddress' => $row['point_address'],
                'pointName' => $row['point_name'],
                'pointPhone' => $row['point_phone'],
                'pointWorkHours' => $row['point_work_hours'],
                'isDefault' => (bool)$row['is_default'],
                'createdAt' => $row['created_at']
            ];
        }
        
        return $addresses;
    }

    /**
     * Сохранение адреса доставки
     * @param int $userId ID пользователя
     * @param array $addressData Данные адреса
     * @return array|bool Данные сохраненного адреса или false в случае ошибки
     */
    public function saveAddress($userId, $addressData) {
        // Если адрес установлен по умолчанию, сбрасываем флаг у других адресов
        if (isset($addressData['isDefault']) && $addressData['isDefault']) {
            $this->resetDefaultAddresses($userId);
        }
        
        $query = "INSERT INTO delivery_addresses (
                    user_id, address_type, service, city, street, building, apartment, 
                    postal_code, comment, point_id, point_address, point_name, 
                    point_phone, point_work_hours, is_default
                ) VALUES (
                    :user_id, :address_type, :service, :city, :street, :building, :apartment, 
                    :postal_code, :comment, :point_id, :point_address, :point_name, 
                    :point_phone, :point_work_hours, :is_default
                )";
        
        $stmt = $this->conn->prepare($query);
        
        $isDefault = isset($addressData['isDefault']) ? (int)$addressData['isDefault'] : 0;
        $addressType = isset($addressData['type']) ? $addressData['type'] : 'manual';
        $service = isset($addressData['service']) ? $addressData['service'] : '';
        $city = isset($addressData['city']) ? $addressData['city'] : '';
        $street = isset($addressData['street']) ? $addressData['street'] : '';
        $building = isset($addressData['building']) ? $addressData['building'] : '';
        $apartment = isset($addressData['apartment']) ? $addressData['apartment'] : '';
        $postalCode = isset($addressData['postalCode']) ? $addressData['postalCode'] : '';
        $comment = isset($addressData['comment']) ? $addressData['comment'] : '';
        $pointId = isset($addressData['pointId']) ? $addressData['pointId'] : '';
        $pointAddress = isset($addressData['pointAddress']) ? $addressData['pointAddress'] : '';
        $pointName = isset($addressData['pointName']) ? $addressData['pointName'] : '';
        $pointPhone = isset($addressData['pointPhone']) ? $addressData['pointPhone'] : '';
        $pointWorkHours = isset($addressData['pointWorkHours']) ? $addressData['pointWorkHours'] : '';
        
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':address_type', $addressType);
        $stmt->bindParam(':service', $service);
        $stmt->bindParam(':city', $city);
        $stmt->bindParam(':street', $street);
        $stmt->bindParam(':building', $building);
        $stmt->bindParam(':apartment', $apartment);
        $stmt->bindParam(':postal_code', $postalCode);
        $stmt->bindParam(':comment', $comment);
        $stmt->bindParam(':point_id', $pointId);
        $stmt->bindParam(':point_address', $pointAddress);
        $stmt->bindParam(':point_name', $pointName);
        $stmt->bindParam(':point_phone', $pointPhone);
        $stmt->bindParam(':point_work_hours', $pointWorkHours);
        $stmt->bindParam(':is_default', $isDefault);
        
        if ($stmt->execute()) {
            $addressId = $this->conn->lastInsertId();
            $addressData['id'] = $addressId;
            return $addressData;
        }
        
        return false;
    }

    /**
     * Обновление адреса доставки
     * @param int $userId ID пользователя
     * @param array $addressData Данные адреса
     * @return array|bool Данные обновленного адреса или false в случае ошибки
     */
    public function updateAddress($userId, $addressData) {
        // Если адрес установлен по умолчанию, сбрасываем флаг у других адресов
        if (isset($addressData['isDefault']) && $addressData['isDefault']) {
            $this->resetDefaultAddresses($userId);
        }
        
        $query = "UPDATE delivery_addresses SET 
                    address_type = :address_type, 
                    service = :service, 
                    city = :city, 
                    street = :street, 
                    building = :building, 
                    apartment = :apartment, 
                    postal_code = :postal_code, 
                    comment = :comment, 
                    point_id = :point_id, 
                    point_address = :point_address, 
                    point_name = :point_name, 
                    point_phone = :point_phone, 
                    point_work_hours = :point_work_hours, 
                    is_default = :is_default 
                WHERE id = :id AND user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        
        $isDefault = isset($addressData['isDefault']) ? (int)$addressData['isDefault'] : 0;
        $addressType = isset($addressData['type']) ? $addressData['type'] : 'manual';
        $service = isset($addressData['service']) ? $addressData['service'] : '';
        $city = isset($addressData['city']) ? $addressData['city'] : '';
        $street = isset($addressData['street']) ? $addressData['street'] : '';
        $building = isset($addressData['building']) ? $addressData['building'] : '';
        $apartment = isset($addressData['apartment']) ? $addressData['apartment'] : '';
        $postalCode = isset($addressData['postalCode']) ? $addressData['postalCode'] : '';
        $comment = isset($addressData['comment']) ? $addressData['comment'] : '';
        $pointId = isset($addressData['pointId']) ? $addressData['pointId'] : '';
        $pointAddress = isset($addressData['pointAddress']) ? $addressData['pointAddress'] : '';
        $pointName = isset($addressData['pointName']) ? $addressData['pointName'] : '';
        $pointPhone = isset($addressData['pointPhone']) ? $addressData['pointPhone'] : '';
        $pointWorkHours = isset($addressData['pointWorkHours']) ? $addressData['pointWorkHours'] : '';
        
        $stmt->bindParam(':address_type', $addressType);
        $stmt->bindParam(':service', $service);
        $stmt->bindParam(':city', $city);
        $stmt->bindParam(':street', $street);
        $stmt->bindParam(':building', $building);
        $stmt->bindParam(':apartment', $apartment);
        $stmt->bindParam(':postal_code', $postalCode);
        $stmt->bindParam(':comment', $comment);
        $stmt->bindParam(':point_id', $pointId);
        $stmt->bindParam(':point_address', $pointAddress);
        $stmt->bindParam(':point_name', $pointName);
        $stmt->bindParam(':point_phone', $pointPhone);
        $stmt->bindParam(':point_work_hours', $pointWorkHours);
        $stmt->bindParam(':is_default', $isDefault);
        $stmt->bindParam(':id', $addressData['id']);
        $stmt->bindParam(':user_id', $userId);
        
        if ($stmt->execute()) {
            return $addressData;
        }
        
        return false;
    }

    /**
     * Удаление адреса доставки
     * @param int $userId ID пользователя
     * @param int $addressId ID адреса
     * @return bool Результат удаления
     */
    public function deleteAddress($userId, $addressId) {
        $query = "DELETE FROM delivery_addresses WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':id', $addressId);
        $stmt->bindParam(':user_id', $userId);
        
        return $stmt->execute();
    }

    /**
     * Сброс флага "по умолчанию" у всех адресов пользователя
     * @param int $userId ID пользователя
     */
    private function resetDefaultAddresses($userId) {
        $query = "UPDATE delivery_addresses SET is_default = 0 WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
    }
}
?>
