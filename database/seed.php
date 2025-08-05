<?php
require_once '../config/database.php';

try {
    // Добавляем категории
    $categories = [
        ['name' => 'Микроконтроллеры', 'icon' => 'microchip'],
        ['name' => 'Резисторы', 'icon' => 'bolt'],
        ['name' => 'Конденсаторы', 'icon' => 'battery-full'],
        ['name' => 'Светодиоды', 'icon' => 'lightbulb'],
        ['name' => 'Транзисторы', 'icon' => 'broadcast-tower'],
        ['name' => 'Датчики', 'icon' => 'sensor']
    ];

    $pdo->exec("TRUNCATE TABLE categories");
    foreach ($categories as $category) {
        $stmt = $pdo->prepare("INSERT INTO categories (name, icon) VALUES (:name, :icon)");
        $stmt->execute($category);
    }

    // Добавляем товары
    $products = [
        [
            'name' => 'Arduino Uno R3',
            'price' => 850,
            'image_url' => 'assets/images/products/arduino-uno.jpg',
            'description' => 'Популярная плата для разработки на базе ATmega328P',
            'category_id' => 1
        ],
        [
            'name' => 'Raspberry Pi 4 Model B',
            'price' => 7500,
            'image_url' => 'assets/images/products/raspberry-pi.jpg',
            'description' => 'Мощный одноплатный компьютер с 4GB RAM',
            'category_id' => 1
        ],
        [
            'name' => 'ESP32 DevKit',
            'price' => 450,
            'image_url' => 'assets/images/products/esp32.jpg',
            'description' => 'Wi-Fi + Bluetooth модуль для IoT проектов',
            'category_id' => 1
        ],
        [
            'name' => 'Набор резисторов 600 шт',
            'price' => 390,
            'image_url' => 'assets/images/products/resistors.jpg',
            'description' => '30 номиналов по 20 штук каждого',
            'category_id' => 2
        ],
        [
            'name' => 'LCD Дисплей 1602',
            'price' => 220,
            'image_url' => 'assets/images/products/lcd.jpg',
            'description' => '16x2 символьный дисплей с I2C модулем',
            'category_id' => 6
        ],
        [
            'name' => 'Набор проводов',
            'price' => 350,
            'image_url' => 'assets/images/products/wires.jpg',
            'description' => '120 шт. разноцветных проводов папа-папа, папа-мама, мама-мама',
            'category_id' => 1
        ]
    ];

    $pdo->exec("TRUNCATE TABLE products");
    foreach ($products as $product) {
        $stmt = $pdo->prepare("INSERT INTO products (name, price, image_url, description, category_id) VALUES (:name, :price, :image_url, :description, :category_id)");
        $stmt->execute($product);
    }

    echo "Data imported successfully!\n";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
