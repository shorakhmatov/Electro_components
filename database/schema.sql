-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 17, 2025 at 11:37 AM
-- Server version: 8.4.2
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `electrostore`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(357, 1, 782, 2, '2025-05-15 17:33:43', '2025-05-15 17:34:19'),
(363, 1, 1094, 5, '2025-05-16 02:23:15', '2025-05-16 02:25:42'),
(364, 1, 830, 5, '2025-05-16 02:27:38', '2025-05-16 02:27:38'),
(365, 1, 922, 3, '2025-05-16 02:27:53', '2025-05-16 02:27:53'),
(366, 1, 1179, 1, '2025-05-16 02:29:07', '2025-05-16 02:29:07'),
(367, 1, 942, 3, '2025-05-16 02:41:32', '2025-05-16 02:41:40'),
(368, 1, 1091, 2, '2025-05-16 11:58:58', '2025-05-16 11:58:58');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Микроконтроллеры'),
(2, 'Резисторы'),
(3, 'Конденсаторы'),
(4, 'Светодиоды'),
(5, 'Транзисторы'),
(6, 'Датчики'),
(7, 'Память'),
(8, 'Разъёмы'),
(9, 'Печатные платы'),
(10, 'Инструменты'),
(11, 'Робототехника'),
(12, 'Литература');

-- --------------------------------------------------------

--
-- Table structure for table `delivery_addresses`
--

CREATE TABLE `delivery_addresses` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `address_type` varchar(20) NOT NULL,
  `service` varchar(50) NOT NULL,
  `city` varchar(100) NOT NULL,
  `street` varchar(255) DEFAULT NULL,
  `building` varchar(50) DEFAULT NULL,
  `apartment` varchar(50) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `comment` text,
  `point_id` varchar(100) DEFAULT NULL,
  `point_address` text,
  `point_name` varchar(255) DEFAULT NULL,
  `point_phone` varchar(50) DEFAULT NULL,
  `point_work_hours` text,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `delivery_addresses`
--

INSERT INTO `delivery_addresses` (`id`, `user_id`, `address_type`, `service`, `city`, `street`, `building`, `apartment`, `postal_code`, `comment`, `point_id`, `point_address`, `point_name`, `point_phone`, `point_work_hours`, `is_default`, `created_at`, `updated_at`) VALUES
(5, 1, 'pickup', 'cdek', '', '', '', '', '', '', 'cdek1', 'г. Москва, ул. Тверская, д. 10', 'СДЭК - Пункт выдачи №1', '+7 (495) 123-45-67', 'Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00', 0, '2025-05-04 16:20:08', '2025-05-04 16:20:08'),
(6, 1, 'pickup', 'russian-post', '', '', '', '', '', '', 'post1', 'г. Москва, ул. Мясницкая, д. 26', 'Почта России - Отделение №101000', '+7 (495) 456-78-90', 'Пн-Пт: 8:00-20:00, Сб: 9:00-18:00, Вс: выходной', 0, '2025-05-07 03:45:48', '2025-05-07 03:45:48'),
(9, 1, 'pickup', 'cdek', '', '', '', '', '', '', 'cdek2', 'вашем городе, ул. Примерная, д. 33', 'СДЭК - Пункт выдачи №2 (вашем городе)', '+7 (469) 312-53-86', 'Пн-Вс: 9:00-21:00', 0, '2025-05-10 16:37:35', '2025-05-10 16:37:35');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(237, 1, 667, '2025-05-10 18:02:00'),
(238, 1, 666, '2025-05-10 18:02:01'),
(239, 1, 672, '2025-05-10 18:07:11'),
(241, 1, 749, '2025-05-10 19:57:23'),
(247, 1, 1153, '2025-05-11 06:17:40'),
(248, 1, 1101, '2025-05-11 13:55:21'),
(258, 1, 808, '2025-05-11 17:30:43'),
(261, 1, 712, '2025-05-13 02:53:39'),
(265, 1, 716, '2025-05-14 09:48:55'),
(267, 7, 899, '2025-05-14 18:47:32'),
(269, 7, 673, '2025-05-14 18:47:33'),
(271, 7, 1151, '2025-05-14 18:47:35'),
(272, 7, 825, '2025-05-14 18:47:39'),
(273, 7, 827, '2025-05-14 18:47:42'),
(274, 7, 1022, '2025-05-14 18:47:48'),
(275, 7, 1062, '2025-05-14 18:47:53'),
(277, 1, 742, '2025-05-15 17:33:38'),
(279, 1, 1091, '2025-05-16 11:58:51'),
(280, 1, 771, '2025-05-16 12:38:39');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `product_id` int DEFAULT NULL,
  `rating` int NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('new','read','replied','archived') DEFAULT 'new',
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `name`, `email`, `type`, `product_id`, `rating`, `message`, `created_at`, `status`, `user_id`) VALUES
(1, 'Daler Shorakhmatov', 'daler.shd.03@gmail.com', 'review', NULL, 4, 'ывцв', '2025-05-09 15:02:17', 'new', 1),
(2, 'Shorakhmatov', 'daler.shd.03@gmail.com', 'product', NULL, 5, 'Отлично', '2025-05-09 15:04:46', 'new', 1),
(3, 'Daler', 'admin@electrostore.ru', 'suggestion', NULL, 4, 'Ещё улучшить', '2025-05-09 15:05:28', 'new', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delivery_address` text,
  `delivery_address_id` int DEFAULT NULL,
  `delivery_type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `created_at`, `updated_at`, `delivery_address`, `delivery_address_id`, `delivery_type`) VALUES
(1, 1, '7651.25', 'pending', '2025-05-03 05:59:52', '2025-05-17 11:34:48', 'Название: СДЭК - Пункт выдачи №1\r\n\r\nАдрес: г. Москва, ул. Тверская, д. 10\r\n\r\nРежим работы: Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00\r\n\r\nТелефон: +7 (495) 123-45-67', 1, 'СДЭК'),
(2, 1, '4007.34', 'cancelled', '2025-05-03 06:00:36', '2025-05-11 08:27:56', 'Название: СДЭК - Пункт выдачи №2\r\n\r\nАдрес: г. Москва, ул. Ленинский проспект, д. 45\r\n\r\nРежим работы: Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-19:00\r\n\r\nТелефон: +7 (495) 765-43-21', 2, 'Почта России'),
(3, 1, '2417.26', 'cancelled', '2025-05-03 10:47:37', '2025-05-10 14:01:50', 'Почта России - Отделение №101000\r\nг. Москва, ул. Мясницкая, д. 26', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price_per_unit` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price_per_unit`) VALUES
(15, 1, 711, 2, '5.50'),
(16, 1, 712, 2, '7.25'),
(17, 1, 713, 1, '15.00'),
(18, 1, 714, 1, '6.00'),
(19, 1, 715, 1, '4.75'),
(22, 1, 1090, 1, '600.00'),
(23, 1, 1091, 1, '2000.00'),
(24, 1, 1094, 2, '2500.00');

-- --------------------------------------------------------

--
-- Table structure for table `payment_cards`
--

CREATE TABLE `payment_cards` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `card_number` varchar(255) NOT NULL,
  `expiry_date` varchar(10) NOT NULL,
  `holder_name` varchar(255) NOT NULL,
  `bank_code` varchar(50) NOT NULL,
  `other_bank` varchar(100) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `bank_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payment_cards`
--

INSERT INTO `payment_cards` (`id`, `user_id`, `card_number`, `expiry_date`, `holder_name`, `bank_code`, `other_bank`, `is_default`, `bank_name`, `created_at`, `updated_at`) VALUES
(5, 1, '2222 2222 2222 8429', '11/11', 'ИВАНОВ ИВАН', 'tinkoff', '', 0, 'Тинькофф', '2025-05-04 17:38:25', '2025-05-04 19:21:30'),
(10, 1, '9999 9999 9999 9999', '12/55', 'ИВАНОВ ИВАН', 'sberbank', '', 0, 'Сбербанк', '2025-05-05 10:35:29', '2025-05-05 10:35:29'),
(11, 1, '2222 2222 2222 2222', '12/33', 'ИВАНОВ ИВАН', 'alfabank', '', 0, 'Альфа-Банк', '2025-05-14 16:09:41', '2025-05-14 16:09:41');

-- --------------------------------------------------------

--
-- Table structure for table `payment_wallets`
--

CREATE TABLE `payment_wallets` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `wallet_number` varchar(255) NOT NULL,
  `wallet_type` varchar(50) NOT NULL,
  `other_type` varchar(100) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `type_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payment_wallets`
--

INSERT INTO `payment_wallets` (`id`, `user_id`, `wallet_number`, `wallet_type`, `other_type`, `is_default`, `type_name`, `created_at`, `updated_at`) VALUES
(4, 1, 'daler.shd.03@gmail.com', 'webmoney', '', 0, 'WebMoney', '2025-05-05 11:13:48', '2025-05-05 11:13:48'),
(5, 1, 'daler.shd.03@gmail.com', 'qiwi', '', 0, 'QIWI', '2025-05-14 16:11:10', '2025-05-14 16:11:10');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `specifications` text,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `specifications`, `price`, `quantity`, `image_url`) VALUES
(660, 1, 'Микроконтроллер STM32F103C8T6', 'Микроконтроллер от STMicroelectronics для высокопроизводительных приложений.', 'Ядро: ARM Cortex-M3; Частота: 72 МГц; Память: 64 КБ Flash, 20 КБ SRAM; Интерфейсы: I2C, SPI, UART', '350.50', 200, 'https://mcustore.ru/img/site/mikrokontroller-stm32f103c8t6_s4.jpg'),
(661, 1, 'Микроконтроллер ATmega328P-PU', 'Популярный микроконтроллер для Arduino-совместимых проектов.', 'Ядро: AVR 8-bit; Частота: 20 МГц; Память: 32 КБ Flash, 2 КБ SRAM; Интерфейсы: I2C, SPI, UART', '250.75', 150, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPakajG6aRGIHMlGhoEPfSgTH0rPeT5dkHjg&s'),
(662, 1, 'Микроконтроллер ESP32-WROOM-32', 'Микроконтроллер с Wi-Fi и Bluetooth для IoT-проектов.', 'Ядро: Dual-Core Xtensa LX6; Частота: 240 МГц; Память: 520 КБ SRAM; Интерфейсы: I2C, SPI, UART', '600.00', 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2ROfkKGn-CyM3Gg18IAsIh6ahwLPNUDoBxw&s'),
(663, 1, 'Микроконтроллер PIC16F877A-I/P', 'Микроконтроллер от Microchip для промышленных и образовательных проектов.', 'Ядро: PIC 8-bit; Частота: 20 МГц; Память: 14 КБ Flash, 368 Б SRAM; Интерфейсы: I2C, SPI, UART', '400.25', 120, 'https://static.rapidonline.com/catalogueimages/product/73/33/s73-3352p01wc.jpg'),
(664, 1, 'Микроконтроллер Raspberry Pi Pico', 'Микроконтроллер на базе RP2040 для компактных проектов.', 'Ядро: Dual-Core ARM Cortex-M0+; Частота: 133 МГц; Память: 264 КБ SRAM; Интерфейсы: I2C, SPI, UART', '450.00', 180, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt2gUHcAyx28iV8fNVmFLlx2zUamC6nnqFXw&s'),
(665, 1, 'Микроконтроллер STM32F407VGT6', 'Мощный микроконтроллер для сложных вычислительных задач.', 'Ядро: ARM Cortex-M4; Частота: 168 МГц; Память: 1 МБ Flash, 192 КБ SRAM; Интерфейсы: I2C, SPI, UART, CAN', '1200.00', 80, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbZ2--olsab7w22ILDbhOL97EngwRwtpr4Eg&s'),
(666, 1, 'Микроконтроллер ATtiny85-20PU', 'Компактный микроконтроллер для небольших проектов.', 'Ядро: AVR 8-bit; Частота: 20 МГц; Память: 8 КБ Flash, 512 Б SRAM; Интерфейсы: I2C, SPI', '180.30', 300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1j6yDda2l5GmbnF1EOdmCSkkJ5h7cEq2d9w&s'),
(667, 1, 'Микроконтроллер ESP8266EX', 'Микроконтроллер с Wi-Fi для IoT-приложений.', 'Ядро: Tensilica L106; Частота: 80 МГц; Память: 4 МБ Flash; Интерфейсы: I2C, SPI, UART', '320.50', 250, 'https://www.mouser.de/images/espressifsystems/lrg/ESP8266EX_t.jpg'),
(668, 1, 'Микроконтроллер PIC18F4550-I/P', 'Микроконтроллер с USB-интерфейсом для универсальных задач.', 'Ядро: PIC 8-bit; Частота: 48 МГц; Память: 32 КБ Flash, 2 КБ SRAM; Интерфейсы: USB, I2C, SPI, UART', '550.75', 90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBzTs5sA8iq61eaqdQdhjPvyBluaIWPpQbxg&s'),
(669, 1, 'Микроконтроллер STM32L432KC', 'Энергоэффективный микроконтроллер для носимых устройств.', 'Ядро: ARM Cortex-M4; Частота: 80 МГц; Память: 256 КБ Flash, 64 КБ SRAM; Интерфейсы: I2C, SPI, UART', '650.00', 110, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6LG0VJddvireVtkQnKXeCRLDwM19TNLCn3A&s'),
(670, 1, 'Микроконтроллер ATmega2560-16AU', 'Мощный микроконтроллер для Arduino Mega.', 'Ядро: AVR 8-bit; Частота: 16 МГц; Память: 256 КБ Flash, 8 КБ SRAM; Интерфейсы: I2C, SPI, UART', '950.25', 70, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw6TTCT3uqHLZrIM5GwazaTVjPb5NJiCvZWQ&s'),
(671, 1, 'Микроконтроллер STM32F030F4P6', 'Бюджетный микроконтроллер для простых приложений.', 'Ядро: ARM Cortex-M0; Частота: 48 МГц; Память: 16 КБ Flash, 4 КБ SRAM; Интерфейсы: I2C, SPI, UART', '150.00', 400, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAj1BPS7DMhUMEQf_6QyX7v6YHx6uqEfT7uQ&s'),
(672, 1, 'Микроконтроллер PIC12F675-I/P', 'Миниатюрный микроконтроллер для компактных устройств.', 'Ядро: PIC 8-bit; Частота: 20 МГц; Память: 1.75 КБ Flash, 64 Б SRAM; Интерфейсы: ADC', '120.50', 500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqq0gTXwOLLo33LEF2tFMBcFb5Iq7yjXGhLw&s'),
(673, 1, 'Микроконтроллер ATmega16A-PU', 'Микроконтроллер для образовательных и хобби-проектов.', 'Ядро: AVR 8-bit; Частота: 16 МГц; Память: 16 КБ Flash, 1 КБ SRAM; Интерфейсы: I2C, SPI, UART', '300.75', 200, 'https://media.distrelec.com/Web/WebShopImages/landscape_large/6-/01/Microchip-ATMEGA16A-PU-30113636-01.jpg'),
(674, 1, 'Микроконтроллер STM32H743VIT6', 'Высокопроизводительный микроконтроллер для сложных систем.', 'Ядро: ARM Cortex-M7; Частота: 480 МГц; Память: 2 МБ Flash, 1 МБ SRAM; Интерфейсы: I2C, SPI, UART, CAN, USB', '2200.00', 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSSJuVGclG5LYo93T_SPb3UkJ51yOjvOZsvg&s'),
(675, 1, 'Микроконтроллер ATtiny2313A-PU', 'Микроконтроллер для маломощных приложений.', 'Ядро: AVR 8-bit; Частота: 20 МГц; Память: 2 КБ Flash, 128 Б SRAM; Интерфейсы: UART, SPI', '140.25', 350, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF1-4mgkJ7BI1_49tF7nq_Uc9HSjcp1S7jBw&s'),
(676, 1, 'Микроконтроллер ESP32-S2-WROOM', 'Микроконтроллер с Wi-Fi для IoT.', 'Ядро: Xtensa LX7; Частота: 240 МГц; Память: 320 КБ SRAM; Интерфейсы: I2C, SPI, UART', '700.50', 120, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMjJlehgX93MHYkeajR5itFKtxo34qzHFyIA&s'),
(677, 1, 'Микроконтроллер PIC16F628A-I/P', 'Микроконтроллер для простых приложений.', 'Ядро: PIC 8-bit; Частота: 20 МГц; Память: 3.5 КБ Flash, 224 Б SRAM; Интерфейсы: UART', '200.00', 300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSflTkd6RHbSrkejX40KZm80ddSPCUhx3u6qg&s'),
(678, 1, 'Микроконтроллер STM32F429ZIT6', 'Микроконтроллер с графическим интерфейсом.', 'Ядро: ARM Cortex-M4; Частота: 180 МГц; Память: 2 МБ Flash, 256 КБ SRAM; Интерфейсы: I2C, SPI, UART, CAN', '1800.75', 60, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcacQ2y4y_-QwiNKFpj0MFtADcJRah8urpfw&s'),
(679, 1, 'Микроконтроллер ATmega644P-20PU', 'Микроконтроллер для сложных хобби-проектов.', 'Ядро: AVR 8-bit; Частота: 20 МГц; Память: 64 КБ Flash, 4 КБ SRAM; Интерфейсы: I2C, SPI, UART', '600.25', 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRojnX9apyBGvm30fj2uTw2Y0B7ymkZYJbRA&s'),
(680, 1, 'Микроконтроллер STM32G030C8T6', 'Бюджетный микроконтроллер для базовых задач.', 'Ядро: ARM Cortex-M0+; Частота: 64 МГц; Память: 64 КБ Flash, 8 КБ SRAM; Интерфейсы: I2C, SPI, UART', '180.50', 400, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD8vvl-dDBRqdL-a_fxC0xr0w_HH_pDYYurA&s'),
(681, 1, 'Микроконтроллер PIC18F4520-I/P', 'Микроконтроллер для универсальных приложений.', 'Ядро: PIC 8-bit; Частота: 40 МГц; Память: 32 КБ Flash, 1.5 КБ SRAM; Интерфейсы: I2C, SPI, UART', '450.00', 150, 'https://www.microchip.com/_images/ics/medium-PIC18F4520-PDIP-40.png'),
(682, 1, 'Микроконтроллер ATmega128A-AU', 'Мощный микроконтроллер для сложных систем.', 'Ядро: AVR 8-bit; Частота: 16 МГц; Память: 128 КБ Flash, 4 КБ SRAM; Интерфейсы: I2C, SPI, UART', '850.75', 80, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjZV6EwTIr0Y7A6-3G8PUFCdtrJqF4vaoG5Q&s'),
(683, 1, 'Микроконтроллер STM32L152RET6', 'Энергоэффективный микроконтроллер для IoT.', 'Ядро: ARM Cortex-M3; Частота: 32 МГц; Память: 512 КБ Flash, 80 КБ SRAM; Интерфейсы: I2C, SPI, UART', '750.25', 110, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrSCfMv5W8BhmuQ-U7yB_Rc9C3lQKkrjd9wA&s'),
(684, 1, 'Микроконтроллер ESP32-C3-WROOM-02', 'Микроконтроллер с Wi-Fi и Bluetooth 5.0.', 'Ядро: RISC-V; Частота: 160 МГц; Память: 400 КБ SRAM; Интерфейсы: I2C, SPI, UART', '650.50', 130, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOrinZqAo7m0jqnjFLkitokfnx9aqBw2JS7g&s'),
(685, 1, 'Микроконтроллер PIC16F887-I/P', 'Микроконтроллер для образовательных проектов.', 'Ядро: PIC 8-bit; Частота: 20 МГц; Память: 14 КБ Flash, 368 Б SRAM; Интерфейсы: I2C, SPI, UART', '350.00', 200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsYX1wFB9fE6Xu4G5dTe9yWgAEgcJZXG39Zw&s'),
(686, 1, 'Микроконтроллер STM32F746NGH6', 'Микроконтроллер для мультимедийных приложений.', 'Ядро: ARM Cortex-M7; Частота: 216 МГц; Память: 1 МБ Flash, 320 КБ SRAM; Интерфейсы: I2C, SPI, UART, CAN', '2000.25', 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM2ocId3-wueBEKdPRLpV-7AyjFzmDJDYXOA&s'),
(687, 1, 'Микроконтроллер ATtiny45-20PU', 'Компактный микроконтроллер для простых задач.', 'Ядро: AVR 8-bit; Частота: 20 МГц; Память: 4 КБ Flash, 256 Б SRAM; Интерфейсы: I2C, SPI', '160.75', 400, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbcBnu4q01ONNJp0ssNtpeyinsy_rXcsmf_w&s'),
(688, 1, 'Микроконтроллер STM32F105RBT6', 'Микроконтроллер с CAN-интерфейсом.', 'Ядро: ARM Cortex-M3; Частота: 72 МГц; Память: 128 КБ Flash, 64 КБ SRAM; Интерфейсы: I2C, SPI, UART, CAN', '550.50', 150, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiIgRNc25_wbweBJhjXygjEY2VcsRNED4NYA&s'),
(689, 1, 'Микроконтроллер PIC18F8722-I/PT', 'Микроконтроллер для сложных приложений.', 'Ядро: PIC 8-bit; Частота: 40 МГц; Память: 128 КБ Flash, 4 КБ SRAM; Интерфейсы: I2C, SPI, UART', '900.00', 90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRInQ1Vmr7l2AvKiuaIP2MKTV9NAQo5b1tkDg&s'),
(690, 1, 'Микроконтроллер ATmega32U4-AU', 'Микроконтроллер с USB для Arduino Leonardo.', 'Ядро: AVR 8-bit; Частота: 16 МГц; Память: 32 КБ Flash, 2.5 КБ SRAM; Интерфейсы: USB, I2C, SPI, UART', '500.25', 120, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2j6GM22aHZK0aUxgMJ1rJ3fWn3b52yaDTmQ&s'),
(691, 1, 'Микроконтроллер STM32G431CBT6', 'Микроконтроллер для аналоговых приложений.', 'Ядро: ARM Cortex-M4; Частота: 170 МГц; Память: 128 КБ Flash, 32 КБ SRAM; Интерфейсы: I2C, SPI, UART, CAN', '700.75', 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFOH1rjSyh4O4dLk045RJLSY0_qpE9-hs6BA&s'),
(692, 1, 'Микроконтроллер ESP32-WROVER-E', 'Микроконтроллер с Wi-Fi и Bluetooth.', 'Ядро: Dual-Core Xtensa LX6; Частота: 240 МГц; Память: 520 КБ SRAM, 4 МБ Flash; Интерфейсы: I2C, SPI, UART', '800.50', 110, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJCaJPaAv3QzamGmuQmOkUiYiV_3d8ChS9Mw&s'),
(693, 1, 'Микроконтроллер PIC16F1827-I/P', 'Микроконтроллер для базовых приложений.', 'Ядро: PIC 8-bit; Частота: 32 МГц; Память: 7 КБ Flash, 384 Б SRAM; Интерфейсы: I2C, SPI, UART', '250.00', 250, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQviuHi_iC9Qk2c7Fj11CBqwzi_q1Pmv2XMWw&s'),
(694, 1, 'Микроконтроллер STM32F303CCT6', 'Микроконтроллер для аналоговых систем.', 'Ядро: ARM Cortex-M4; Частота: 72 МГц; Память: 256 КБ Flash, 40 КБ SRAM; Интерфейсы: I2C, SPI, UART, CAN', '600.25', 130, 'https://media.distrelec.com/Web/WebShopImages/landscape_large/1-/01/ST-STM32F100C8T6B-30170701-01.jpg'),
(695, 1, 'Микроконтроллер ATmega168PA-AU', 'Микроконтроллер для Arduino-совместимых проектов.', 'Ядро: AVR 8-bit; Частота: 20 МГц; Память: 16 КБ Flash, 1 КБ SRAM; Интерфейсы: I2C, SPI, UART', '300.50', 200, 'https://static.insales-cdn.com/images/products/1/6675/751901203/medium_chip-atmega16u2-mu.jpg'),
(696, 1, 'Микроконтроллер STM32L476RGT6', 'Энергоэффективный микроконтроллер для IoT.', 'Ядро: ARM Cortex-M4; Частота: 80 МГц; Память: 1 МБ Flash, 128 КБ SRAM; Интерфейсы: I2C, SPI, UART, CAN', '850.75', 90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJkjafErdBRurQrVIHlFW9kIbbuFMUTT8UMg&s'),
(697, 1, 'Микроконтроллер PIC18F2550-I/SP', 'Микроконтроллер с USB-интерфейсом.', 'Ядро: PIC 8-bit; Частота: 48 МГц; Память: 32 КБ Flash, 2 КБ SRAM; Интерфейсы: USB, I2C, SPI, UART', '550.50', 140, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXmlYXZ0nvz0qu9VL0xfM4462f7KOQ0Iv2nw&s'),
(698, 1, 'Микроконтроллер ATtiny84A-PU', 'Компактный микроконтроллер для небольших устройств.', 'Ядро: AVR 8-bit; Частота: 20 МГц; Память: 8 КБ Flash, 512 Б SRAM; Интерфейсы: I2C, SPI', '180.25', 350, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Zd5Qg7lLqVZ8G_UKyctt1DnQcUQ2idTQhg&s'),
(699, 1, 'Микроконтроллер STM32F070CBT6', 'Бюджетный микроконтроллер с USB.', 'Ядро: ARM Cortex-M0; Частота: 48 МГц; Память: 128 КБ Flash, 16 КБ SRAM; Интерфейсы: USB, I2C, SPI, UART', '250.75', 300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUj6o4uW21OP6FxE0J7Wr8hO5DpFp2Re9okQ&s'),
(700, 1, 'Микроконтроллер PIC16F690-I/P', 'Микроконтроллер для простых приложений.', 'Ядро: PIC 8-bit; Частота: 20 МГц; Память: 7 КБ Flash, 256 Б SRAM; Интерфейсы: I2C, SPI, UART', '220.50', 250, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLq1DOvEjcWCX4VLOomnX1aDUf-VzCsQno6A&s'),
(701, 1, 'Микроконтроллер STM32F446RET6', 'Микроконтроллер для мультимедиа и IoT.', 'Ядро: ARM Cortex-M4; Частота: 180 МГц; Память: 512 КБ Flash, 128 КБ SRAM; Интерфейсы: I2C, SPI, UART, CAN', '950.25', 80, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcSC7HWgznTzhD1EQJhw-AhY5KHIXxi6X8HA&s'),
(702, 1, 'Микроконтроллер ATmega8515-16PU', 'Микроконтроллер для промышленных приложений.', 'Ядро: AVR 8-bit; Частота: 16 МГц; Память: 8 КБ Flash, 512 Б SRAM; Интерфейсы: UART, SPI', '350.00', 200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSskHHwBeCWWlJiDyzit9CBTdhrzVJ51qq25g&s'),
(703, 1, 'Микроконтроллер STM32F205RGT6', 'Микроконтроллер для высокопроизводительных систем.', 'Ядро: ARM Cortex-M3; Частота: 120 МГц; Память: 1 МБ Flash, 128 КБ SRAM; Интерфейсы: I2C, SPI, UART, CAN', '1100.50', 70, 'https://mm.digikey.com/Volume0/opasdata/d220001/medias/images/6255/497~AI14398~T~64.jpg'),
(704, 1, 'Микроконтроллер PIC18F6722-I/PT', 'Микроконтроллер для сложных проектов.', 'Ядро: PIC 8-bit; Частота: 40 МГц; Память: 128 КБ Flash, 4 КБ SRAM; Интерфейсы: I2C, SPI, UART', '1000.75', 60, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVjkojwox8mYcG0guOKhL4RSqgzKi7QuAfNw&s'),
(705, 1, 'Микроконтроллер ATmega324PA-AU', 'Микроконтроллер для универсальных задач.', 'Ядро: AVR 8-bit; Частота: 20 МГц; Память: 32 КБ Flash, 2 КБ SRAM; Интерфейсы: I2C, SPI, UART', '450.25', 150, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9lOj1kiBLM819haqS3LrJNYMzPIJZVXircw&s'),
(706, 1, 'Микроконтроллер STM32L051C8T6', 'Энергоэффективный микроконтроллер для IoT.', 'Ядро: ARM Cortex-M0+; Частота: 32 МГц; Память: 64 КБ Flash, 8 КБ SRAM; Интерфейсы: I2C, SPI, UART', '300.50', 250, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjGqB5SlkUT3--j8YNW7OPlmZyuDt9xTw_Xg&s'),
(707, 1, 'Микроконтроллер ESP32-S3-WROOM-1', 'Микроконтроллер с Wi-Fi и Bluetooth для AIoT.', 'Ядро: Dual-Core Xtensa LX7; Частота: 240 МГц; Память: 512 КБ SRAM; Интерфейсы: I2C, SPI, UART', '900.00', 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMboBxfbLQRAv7b3IZ0bj1odP0bClr49y8dg&s'),
(708, 1, 'Микроконтроллер PIC16F886-I/SP', 'Микроконтроллер для образовательных приложений.', 'Ядро: PIC 8-bit; Частота: 20 МГц; Память: 14 КБ Flash, 368 Б SRAM; Интерфейсы: I2C, SPI, UART', '350.75', 200, 'https://media.distrelec.com/Web/WebShopImages/landscape_large/_t/if/DIL-28-Photo.jpg'),
(709, 1, 'Микроконтроллер STM32F401RET6', 'Микроконтроллер для компактных высокопроизводительных систем.', 'Ядро: ARM Cortex-M4; Частота: 84 МГц; Память: 512 КБ Flash, 96 КБ SRAM; Интерфейсы: I2C, SPI, UART', '650.25', 120, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1nKZe7on7FbFoxv1_9UD9cqAwZ-EkyPcDSA&s'),
(710, 1, 'Микроконтроллер ATmega88PA-AU', 'Микроконтроллер для Arduino-совместимых проектов.', 'Ядро: AVR 8-bit; Частота: 20 МГц; Память: 8 КБ Flash, 1 КБ SRAM; Интерфейсы: I2C, SPI, UART', '250.50', 300, 'https://static.insales-cdn.com/images/products/1/4398/751497518/chip-atmega88pa-au.jpg'),
(711, 2, 'Резистор 10 кОм 0.25 Вт', 'Углеродный резистор для ограничения тока в цепях.', 'Сопротивление: 10 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrN82T3-37aT4t2AxXUC3f3MVcDNFAkYcd8g&s'),
(712, 2, 'Резистор 1 кОм 0.5 Вт', 'Металлооксидный резистор для стабильной работы.', 'Сопротивление: 1 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '7.25', 1500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7u8L1lQEjtxMJh6vUfUy9kytShYXgPa_acQ&s'),
(713, 2, 'Резистор 100 Ом 1 Вт', 'Мощный резистор для высоковольтных схем.', 'Сопротивление: 100 Ом; Мощность: 1 Вт; Тип: проволочный; Допуск: ±5%', '15.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTne3Re6HKOpqE9cEMzfrNUTrtdVnU6cVPAfg&s'),
(714, 2, 'Резистор 4.7 кОм 0.25 Вт', 'Резистор для делителей напряжения и фильтров.', 'Сопротивление: 4.7 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '6.00', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr_PYpVMA0OD6fW1_J9ljMCkhbAQJ1ayIdAQ&s'),
(715, 2, 'Резистор 22 кОм 0.125 Вт', 'Миниатюрный резистор для компактных схем.', 'Сопротивление: 22 кОм; Мощность: 0.125 Вт; Тип: углеродный; Допуск: ±5%', '4.75', 3000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfsNwPRr9CYExfZX-d8z_ZvdwON-SObWXfrQ&s'),
(716, 2, 'Резистор 47 Ом 0.25 Вт', 'Резистор для ограничения тока в светодиодных цепях.', 'Сопротивление: 47 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.00', 2000, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(717, 2, 'Резистор 100 кОм 0.5 Вт', 'Металлооксидный резистор для высокоточных схем.', 'Сопротивление: 100 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '8.50', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFhweVaAIukhq-nFk5-uyKKZaAI4nqoMMPuQ&s'),
(718, 2, 'Резистор 220 Ом 0.25 Вт', 'Углеродный резистор для базовых электронных схем.', 'Сопротивление: 220 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.25', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr_PYpVMA0OD6fW1_J9ljMCkhbAQJ1ayIdAQ&s'),
(719, 2, 'Резистор 1 Мом 0.25 Вт', 'Резистор для высокоомных цепей.', 'Сопротивление: 1 Мом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '6.75', 1800, 'https://docbt.ru/wp-content/uploads/2022/07/Group-11-1.png'),
(720, 2, 'Резистор 330 Ом 0.5 Вт', 'Металлооксидный резистор для стабильного сопротивления.', 'Сопротивление: 330 Ом; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '7.00', 1500, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(721, 2, 'Резистор 2.2 кОм 0.25 Вт', 'Резистор для фильтров и делителей напряжения.', 'Сопротивление: 2.2 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2200, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(722, 2, 'Резистор 15 кОм 0.125 Вт', 'Компактный резистор для низковольтных схем.', 'Сопротивление: 15 кОм; Мощность: 0.125 Вт; Тип: углеродный; Допуск: ±5%', '4.50', 3000, 'https://static.chipdip.ru/lib/537/DOC016537951.jpg'),
(723, 2, 'Резистор 680 Ом 0.25 Вт', 'Резистор для ограничения тока в цепях.', 'Сопротивление: 680 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.00', 2000, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(724, 2, 'Резистор 47 кОм 0.5 Вт', 'Металлооксидный резистор для высокоточных приложений.', 'Сопротивление: 47 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '8.00', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQCLLDiUI5xDIfpe6WIChMIWGo00xv1_CR7w&s'),
(725, 2, 'Резистор 1.5 кОм 0.25 Вт', 'Резистор для базовых электронных схем.', 'Сопротивление: 1.5 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.25', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2VRTb7IGFsXjyjJvW08B5_V51wMxEWqxeKA&s'),
(726, 2, 'Резистор 10 Ом 1 Вт', 'Мощный резистор для силовых цепей.', 'Сопротивление: 10 Ом; Мощность: 1 Вт; Тип: проволочный; Допуск: ±5%', '12.50', 1000, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(727, 2, 'Резистор 33 кОм 0.25 Вт', 'Резистор для высокоомных приложений.', 'Сопротивление: 33 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '6.00', 2000, 'https://avatars.mds.yandex.net/get-mpic/5277279/img_id8481097404916680729.jpeg/orig'),
(728, 2, 'Резистор 470 Ом 0.5 Вт', 'Металлооксидный резистор для стабильной работы.', 'Сопротивление: 470 Ом; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '7.50', 1500, 'https://eltsi.ru/upload/iblock/580/580e8c8ce574478f9d0d862c2c8617f8.jpg'),
(729, 2, 'Резистор 2.7 кОм 0.25 Вт', 'Резистор для фильтров и делителей.', 'Сопротивление: 2.7 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2200, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(730, 2, 'Резистор 220 кОм 0.125 Вт', 'Миниатюрный резистор для компактных схем.', 'Сопротивление: 220 кОм; Мощность: 0.125 Вт; Тип: углеродный; Допуск: ±5%', '4.75', 3000, 'https://static.procontact74.ru/media/product/a6af690f-1aea-11e9-9279-00e04c130b2c_7adc229e-2831-11e9-80c0-e0d55e81e32a.jpeg'),
(731, 2, 'Резистор 560 Ом 0.25 Вт', 'Резистор для ограничения тока в цепях.', 'Сопротивление: 560 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.00', 2000, 'https://docbt.ru/wp-content/uploads/2022/07/Group-11-1.png'),
(732, 2, 'Резистор 68 кОм 0.5 Вт', 'Металлооксидный резистор для высокоточных схем.', 'Сопротивление: 68 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '8.25', 1200, 'https://static.chipdip.ru/lib/294/DOC005294104.jpg'),
(733, 2, 'Резистор 820 Ом 0.25 Вт', 'Углеродный резистор для базовых приложений.', 'Сопротивление: 820 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.25', 2500, 'https://static.chipdip.ru/lib/531/DOC021531154.jpg'),
(734, 2, 'Резистор 3.3 кОм 0.25 Вт', 'Резистор для делителей напряжения.', 'Сопротивление: 3.3 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2200, 'https://roboshop.spb.ru/image/cache/catalog/metalfilm1-800x800.jpg'),
(735, 2, 'Резистор 150 Ом 0.5 Вт', 'Металлооксидный резистор для стабильной работы.', 'Сопротивление: 150 Ом; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '7.00', 1500, 'https://static.chipdip.ru/lib/294/DOC005294104.jpg'),
(736, 2, 'Резистор 5.6 кОм 0.25 Вт', 'Резистор для фильтров и ограничения тока.', 'Сопротивление: 5.6 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2000, 'https://doc.platan.ru/img_base/view/900809.jpg'),
(737, 2, 'Резистор 27 кОм 0.125 Вт', 'Миниатюрный резистор для низковольтных схем.', 'Сопротивление: 27 кОм; Мощность: 0.125 Вт; Тип: углеродный; Допуск: ±5%', '4.50', 3000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGzsKq3AW9tjQZV1MftSBBVX_GjP9Lhdl__w&s'),
(738, 2, 'Резистор 390 Ом 0.25 Вт', 'Резистор для ограничения тока в цепях.', 'Сопротивление: 390 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.00', 2000, 'https://static.chipdip.ru/lib/119/DOC000119999.jpg'),
(739, 2, 'Резистор 82 кОм 0.5 Вт', 'Металлооксидный резистор для высокоточных приложений.', 'Сопротивление: 82 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '8.00', 1200, 'https://ir.ozone.ru/s3/multimedia-d/c1000/6651348529.jpg'),
(740, 2, 'Резистор 1.8 кОм 0.25 Вт', 'Резистор для базовых электронных схем.', 'Сопротивление: 1.8 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.25', 2500, 'https://ir.ozone.ru/s3/multimedia-z/c1000/6541862387.jpg'),
(741, 2, 'Резистор 20 Ом 1 Вт', 'Мощный резистор для силовых цепей.', 'Сопротивление: 20 Ом; Мощность: 1 Вт; Тип: проволочный; Допуск: ±5%', '12.50', 1000, 'https://ampero.ru/assets/images/products/408670/67854567.jpg'),
(742, 2, 'Резистор 39 кОм 0.25 Вт', 'Резистор для высокоомных приложений.', 'Сопротивление: 39 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '6.00', 2000, 'https://oskolchip.ru/_sh/19/1919.webp'),
(743, 2, 'Резистор 680 кОм 0.5 Вт', 'Металлооксидный резистор для стабильной работы.', 'Сопротивление: 680 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '7.50', 1500, 'https://www.radetali.ru/photos/1964/2043-th.webp'),
(744, 2, 'Резистор 3.9 кОм 0.25 Вт', 'Резистор для фильтров и делителей.', 'Сопротивление: 3.9 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2200, 'https://avatars.mds.yandex.net/get-mpic/5277279/img_id8481097404916680729.jpeg/orig'),
(745, 2, 'Резистор 270 кОм 0.125 Вт', 'Миниатюрный резистор для компактных схем.', 'Сопротивление: 270 кОм; Мощность: 0.125 Вт; Тип: углеродный; Допуск: ±5%', '4.75', 3000, 'https://www.yerasov.ru/sites/default/files/styles/300x300/public/mf-0125_5.jpg?itok=xpSQDZzT'),
(746, 2, 'Резистор 750 Ом 0.25 Вт', 'Резистор для ограничения тока в цепях.', 'Сопротивление: 750 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.00', 2000, 'https://ir.ozone.ru/s3/multimedia-d/c1000/6759186961.jpg'),
(747, 2, 'Резистор 120 кОм 0.5 Вт', 'Металлооксидный резистор для высокоточных схем.', 'Сопротивление: 120 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '8.25', 1200, 'https://ampero.ru/assets/images/products/736/pezist-post.jpg'),
(748, 2, 'Резистор 910 Ом 0.25 Вт', 'Углеродный резистор для базовых приложений.', 'Сопротивление: 910 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.25', 2500, 'https://www.vishay.com/images/resistors/cfr_series.jpg'),
(749, 2, 'Резистор 4.3 кОм 0.25 Вт', 'Резистор для делителей напряжения.', 'Сопротивление: 4.3 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2200, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(750, 2, 'Резистор 180 Ом 0.5 Вт', 'Металлооксидный резистор для стабильной работы.', 'Сопротивление: 180 Ом; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '7.00', 1500, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(751, 2, 'Резистор 6.8 кОм 0.25 Вт', 'Резистор для фильтров и ограничения тока.', 'Сопротивление: 6.8 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2000, 'https://elecomp.ru/wa-data/public/shop/products/92/34/403492/images/200340/200340.970.jpg'),
(752, 2, 'Резистор 30 кОм 0.125 Вт', 'Миниатюрный резистор для низковольтных схем.', 'Сопротивление: 30 кОм; Мощность: 0.125 Вт; Тип: углеродный; Допуск: ±5%', '4.50', 3000, 'https://www.yageo.com/images/products/CFR_series.jpg'),
(753, 2, 'Резистор 430 Ом 0.25 Вт', 'Резистор для ограничения тока в цепях.', 'Сопротивление: 430 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.00', 2000, 'https://www.vishay.com/images/resistors/cfr_series.jpg'),
(754, 2, 'Резистор 91 кОм 0.5 Вт', 'Металлооксидный резистор для высокоточных приложений.', 'Сопротивление: 91 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '8.00', 1200, 'https://ir.ozone.ru/s3/multimedia-v/c1000/6139407043.jpg'),
(755, 2, 'Резистор 2.4 кОм 0.25 Вт', 'Резистор для базовых электронных схем.', 'Сопротивление: 2.4 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.25', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMKpYhXoUneVgAbxAbtCMSTAkmYx2sOwP_eg&s'),
(756, 2, 'Резистор 50 Ом 1 Вт', 'Мощный резистор для силовых цепей.', 'Сопротивление: 50 Ом; Мощность: 1 Вт; Тип: проволочный; Допуск: ±5%', '12.50', 1000, 'https://www.panasonic.com/content/dam/pid/resistors/erx_series.jpg'),
(757, 2, 'Резистор 56 кОм 0.25 Вт', 'Резистор для высокоомных приложений.', 'Сопротивление: 56 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '6.00', 2000, 'https://www.yageo.com/images/products/CFR_series.jpg'),
(758, 2, 'Резистор 820 кОм 0.5 Вт', 'Металлооксидный резистор для стабильной работы.', 'Сопротивление: 820 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '7.50', 1500, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(759, 2, 'Резистор 5.1 кОм 0.25 Вт', 'Резистор для фильтров и делителей.', 'Сопротивление: 5.1 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2200, 'https://elecomp.ru/wa-data/public/shop/products/92/34/403492/images/200340/200340.970.jpg'),
(760, 2, 'Резистор 330 кОм 0.125 Вт', 'Миниатюрный резистор для компактных схем.', 'Сопротивление: 330 кОм; Мощность: 0.125 Вт; Тип: углеродный; Допуск: ±5%', '4.75', 3000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMKpYhXoUneVgAbxAbtCMSTAkmYx2sOwP_eg&s'),
(761, 2, 'Резистор 620 Ом 0.25 Вт', 'Резистор для ограничения тока в цепях.', 'Сопротивление: 620 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.00', 2000, 'https://www.vishay.com/images/resistors/cfr_series.jpg'),
(762, 2, 'Резистор 150 кОм 0.5 Вт', 'Металлооксидный резистор для высокоточных схем.', 'Сопротивление: 150 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '8.25', 1200, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(763, 2, 'Резистор 1.2 кОм 0.25 Вт', 'Углеродный резистор для базовых приложений.', 'Сопротивление: 1.2 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.25', 2500, 'https://ir.ozone.ru/s3/multimedia-v/c1000/6139407043.jpg'),
(764, 2, 'Резистор 7.5 кОм 0.25 Вт', 'Резистор для делителей напряжения.', 'Сопротивление: 7.5 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2200, 'https://smdx.ru/uploads/product/1000/1061/resistor-025w-20pcs.jpg'),
(765, 2, 'Резистор 270 Ом 0.5 Вт', 'Металлооксидный резистор для стабильной работы.', 'Сопротивление: 270 Ом; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '7.00', 1500, 'https://cdn1.ozone.ru/s3/multimedia-1-k/7075369964.jpg'),
(766, 2, 'Резистор 8.2 кОм 0.25 Вт', 'Резистор для фильтров и ограничения тока.', 'Сопротивление: 8.2 кОм; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.50', 2000, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(767, 2, 'Резистор 36 кОм 0.125 Вт', 'Миниатюрный резистор для низковольтных схем.', 'Сопротивление: 36 кОм; Мощность: 0.125 Вт; Тип: углеродный; Допуск: ±5%', '4.50', 3000, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(768, 2, 'Резистор 510 Ом 0.25 Вт', 'Резистор для ограничения тока в цепях.', 'Сопротивление: 510 Ом; Мощность: 0.25 Вт; Тип: углеродный; Допуск: ±5%', '5.00', 2000, 'https://static.chipdip.ru/lib/294/DOC005294160.jpg'),
(769, 2, 'Резистор 100 кОм 0.5 Вт', 'Металлооксидный резистор для высокоточных приложений.', 'Сопротивление: 100 кОм; Мощность: 0.5 Вт; Тип: металлооксидный; Допуск: ±1%', '8.00', 1200, 'https://www.avrobot.ru/images/product_images/popup_images/881_0.JPG'),
(770, 3, 'Конденсатор 10 мкФ 50В', 'Электролитический конденсатор для источников питания.', 'Ёмкость: 10 мкФ; Напряжение: 50 В; Тип: электролитический; Допуск: ±20%', '8.50', 2000, 'https://electronov.net/wp-content/uploads/2016/12/10uf-50v.jpg'),
(771, 3, 'Конденсатор 100 мкФ 25В', 'Электролитический конденсатор для фильтров.', 'Ёмкость: 100 мкФ; Напряжение: 25 В; Тип: электролитический; Допуск: ±20%', '10.25', 1500, 'https://mcustore.ru/img/site/kondensator-elektroliticheskij-100-mkf-25-v_s4.jpg'),
(772, 3, 'Конденсатор 1 мкФ 50В', 'Керамический конденсатор для высокочастотных цепей.', 'Ёмкость: 1 мкФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '6.00', 3000, 'https://www.avrobot.ru/images/product_images/popup_images/424_0.JPG'),
(773, 3, 'Конденсатор 22 мкФ 16В', 'Электролитический конденсатор для портативной электроники.', 'Ёмкость: 22 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '7.75', 2500, 'https://ir.ozone.ru/s3/multimedia-r/c1000/6226023435.jpg'),
(774, 3, 'Конденсатор 470 мкФ 35В', 'Электролитический конденсатор для силовых цепей.', 'Ёмкость: 470 мкФ; Напряжение: 35 В; Тип: электролитический; Допуск: ±20%', '15.50', 1000, 'https://www.elirit.ru/data/catalog/709208.JPG'),
(775, 3, 'Конденсатор 1000 мкФ 25В', 'Электролитический конденсатор для источников питания.', 'Ёмкость: 1000 мкФ; Напряжение: 25 В; Тип: электролитический; Допуск: ±20%', '25.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFSmnlT1FvjFPalAHFf_pFtOIoOsyj7_kWDQ&s'),
(776, 3, 'Конденсатор 0.1 мкФ 50В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.1 мкФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '5.25', 4000, 'https://smdx.ru/uploads/product/500/514/capacitor.jpg'),
(777, 3, 'Конденсатор 47 мкФ 50В', 'Электролитический конденсатор для фильтров.', 'Ёмкость: 47 мкФ; Напряжение: 50 В; Тип: электролитический; Допуск: ±20%', '12.00', 1800, 'https://static.chipdip.ru/lib/635/DOC005635928.jpg'),
(778, 3, 'Конденсатор 220 мкФ 16В', 'Электролитический конденсатор для низковольтных схем.', 'Ёмкость: 220 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '10.50', 2000, 'https://oskolchip.ru/_sh/5/554.jpg'),
(779, 3, 'Конденсатор 4.7 мкФ 50В', 'Керамический конденсатор для высокочастотных приложений.', 'Ёмкость: 4.7 мкФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '7.00', 3000, 'https://www.avrobot.ru/images/product_images/popup_images/426_0.jpg'),
(780, 3, 'Конденсатор 330 мкФ 25В', 'Электролитический конденсатор для источников питания.', 'Ёмкость: 330 мкФ; Напряжение: 25 В; Тип: электролитический; Допуск: ±20%', '14.25', 1500, 'https://www.avrobot.ru/images/product_images/popup_images/5528_2.jpg'),
(781, 3, 'Конденсатор 0.01 мкФ 100В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.01 мкФ; Напряжение: 100 В; Тип: керамический; Допуск: ±10%', '5.00', 5000, 'https://ir.ozone.ru/s3/multimedia-w/c1000/6828804896.jpg'),
(782, 3, 'Конденсатор 100 пФ 50В', 'Керамический конденсатор для ВЧ-фильтров.', 'Ёмкость: 100 пФ; Напряжение: 50 В; Тип: керамический; Допуск: ±5%', '4.50', 4000, 'https://payalnik-on.ru/d/kondensator_keramicheskiy.jpg'),
(783, 3, 'Конденсатор 2200 мкФ 16В', 'Электролитический конденсатор для силовых цепей.', 'Ёмкость: 2200 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '30.00', 600, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRST5coHX3KWSsCoh-5DbTSRel7wxwbhf7Kig&s'),
(784, 3, 'Конденсатор 1 нФ 50В', 'Керамический конденсатор для высокочастотных схем.', 'Ёмкость: 1 нФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '4.75', 4500, 'https://payalnik-on.ru/d/mnogosloynyye_kondensatory.jpg'),
(785, 3, 'Конденсатор 680 мкФ 35В', 'Электролитический конденсатор для фильтров.', 'Ёмкость: 680 мкФ; Напряжение: 35 В; Тип: электролитический; Допуск: ±20%', '18.50', 1200, 'https://www.elirit.ru/data/catalog/720677.JPG'),
(786, 3, 'Конденсатор 0.047 мкФ 50В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.047 мкФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '5.50', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9VCpfdlDSLSGhdFQlXhu_26Op1QvR8NNNyQ&s'),
(787, 3, 'Конденсатор 33 мкФ 25В', 'Электролитический конденсатор для портативной электроники.', 'Ёмкость: 33 мкФ; Напряжение: 25 В; Тип: электролитический; Допуск: ±20%', '8.00', 2500, 'https://asenergi.com/assets/images/kondesatory/kondensatory-electroliticheskie/kondensatory-electroliticheskie-1-82mkf_m.jpg'),
(788, 3, 'Конденсатор 2.2 мкФ 50В', 'Керамический конденсатор для высокочастотных цепей.', 'Ёмкость: 2.2 мкФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '6.50', 3000, 'https://ir.ozone.ru/s3/multimedia-o/c1000/6315119760.jpg'),
(789, 3, 'Конденсатор 470 пФ 50В', 'Керамический конденсатор для ВЧ-фильтров.', 'Ёмкость: 470 пФ; Напряжение: 50 В; Тип: керамический; Допуск: ±5%', '4.50', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtRyn13fKUbOvSvy4MJCl3Zx9saWCF1zD6yA&s'),
(790, 3, 'Конденсатор 100 мкФ 16В', 'Электролитический конденсатор для низковольтных схем.', 'Ёмкость: 100 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '9.00', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRal0MdDOHOn0QyQNbhmBCmaJNRtxbSR0f1rQ&s'),
(791, 3, 'Конденсатор 0.22 мкФ 50В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.22 мкФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '5.75', 3500, 'https://cdn.vseinstrumenti.ru/images/goods/elektrika-i-svet/ustrojstva-zaschity-kontrolya-i-upravleniya/9537188/1200x800/131221124.jpg'),
(792, 3, 'Конденсатор 220 мкФ 25В', 'Электролитический конденсатор для источников питания.', 'Ёмкость: 220 мкФ; Напряжение: 25 В; Тип: электролитический; Допуск: ±20%', '11.50', 1800, 'https://radiodar.ru/wa-data/public/shop/products/46/19/1946/images/5471/5471.970.webp'),
(793, 3, 'Конденсатор 10 нФ 50В', 'Керамический конденсатор для высокочастотных схем.', 'Ёмкость: 10 нФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '5.00', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtdGQphTH75Ux_F18rQhJlp0h0WmyAXxbQEA&s'),
(794, 3, 'Конденсатор 330 мкФ 16В', 'Электролитический конденсатор для фильтров.', 'Ёмкость: 330 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '12.75', 1500, 'https://ir.ozone.ru/s3/multimedia-9/c1000/6812484489.jpg'),
(795, 3, 'Конденсатор 0.033 мкФ 100В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.033 мкФ; Напряжение: 100 В; Тип: керамический; Допуск: ±10%', '5.50', 4000, 'https://ruelt.ru/images/shop/product/79201.jpg'),
(796, 3, 'Конденсатор 47 мкФ 25В', 'Электролитический конденсатор для портативной электроники.', 'Ёмкость: 47 мкФ; Напряжение: 25 В; Тип: электролитический; Допуск: ±20%', '8.50', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcvxEdMkHHHUr6Rgo6pqqxKaF1B30T63pZ7w&s'),
(797, 3, 'Конденсатор 1 мкФ 100В', 'Керамический конденсатор для высокочастотных цепей.', 'Ёмкость: 1 мкФ; Напряжение: 100 В; Тип: керамический; Допуск: ±10%', '7.25', 3000, 'https://ampero.ru/assets/images/products/411663/123.jpg'),
(798, 3, 'Конденсатор 220 пФ 50В', 'Керамический конденсатор для ВЧ-фильтров.', 'Ёмкость: 220 пФ; Напряжение: 50 В; Тип: керамический; Допуск: ±5%', '4.50', 4000, 'https://radioluch.ru/upload/iblock/6d9/6d9392492def51baa845d0f901f36aa3.jpg'),
(799, 3, 'Конденсатор 470 мкФ 16В', 'Электролитический конденсатор для низковольтных схем.', 'Ёмкость: 470 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '14.00', 1200, 'https://mcustore.ru/img/site/kondensator-elektroliticheskij-470-mkf-16-v.jpg'),
(800, 3, 'Конденсатор 0.068 мкФ 50В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.068 мкФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '5.50', 4000, 'https://roboparts.ru/upload/iblock/7d0/7d06e12c6c3b6ddcd5e5e16cc6bcf7dd.jpg'),
(801, 3, 'Конденсатор 100 мкФ 50В', 'Электролитический конденсатор для источников питания.', 'Ёмкость: 100 мкФ; Напряжение: 50 В; Тип: электролитический; Допуск: ±20%', '11.00', 2000, 'https://ampero.ru/assets/images/products/411663/123.jpg'),
(802, 3, 'Конденсатор 2.2 нФ 50В', 'Керамический конденсатор для высокочастотных схем.', 'Ёмкость: 2.2 нФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '4.75', 4500, 'https://ir.ozone.ru/s3/multimedia-9/c1000/6812484489.jpg'),
(803, 3, 'Конденсатор 680 мкФ 25В', 'Электролитический конденсатор для фильтров.', 'Ёмкость: 680 мкФ; Напряжение: 25 В; Тип: электролитический; Допуск: ±20%', '16.50', 1000, 'https://radiodar.ru/wa-data/public/shop/products/46/19/1946/images/5471/5471.970.webp'),
(804, 3, 'Конденсатор 0.015 мкФ 50В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.015 мкФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '5.00', 4000, 'https://mcustore.ru/img/site/kondensator-elektroliticheskij-470-mkf-16-v.jpg'),
(805, 3, 'Конденсатор 33 мкФ 16В', 'Электролитический конденсатор для портативной электроники.', 'Ёмкость: 33 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '7.50', 2500, 'https://mcustore.ru/img/site/kondensator-elektroliticheskij-470-mkf-16-v.jpg'),
(806, 3, 'Конденсатор 4.7 мкФ 100В', 'Керамический конденсатор для высокочастотных цепей.', 'Ёмкость: 4.7 мкФ; Напряжение: 100 В; Тип: керамический; Допуск: ±10%', '8.00', 3000, 'https://roboparts.ru/upload/iblock/7d0/7d06e12c6c3b6ddcd5e5e16cc6bcf7dd.jpg'),
(807, 3, 'Конденсатор 330 пФ 50В', 'Керамический конденсатор для ВЧ-фильтров.', 'Ёмкость: 330 пФ; Напряжение: 50 В; Тип: керамический; Допуск: ±5%', '4.50', 4000, 'https://ekits.ru/upload/iblock/224/224207fadc6fb870cc78f2b36b4d3986.jpg'),
(808, 3, 'Конденсатор 220 мкФ 50В', 'Электролитический конденсатор для источников питания.', 'Ёмкость: 220 мкФ; Напряжение: 50 В; Тип: электролитический; Допуск: ±20%', '13.50', 1500, 'https://ir.ozone.ru/s3/multimedia-l/c1000/6376811049.jpg'),
(809, 3, 'Конденсатор 0.1 мкФ 100В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.1 мкФ; Напряжение: 100 В; Тип: керамический; Допуск: ±10%', '6.00', 3500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTjxgeTlVroQMDVq4ZLNFykLRp04azhFSIBg&s'),
(810, 3, 'Конденсатор 100 мкФ 25В', 'Электролитический конденсатор для низковольтных схем.', 'Ёмкость: 100 мкФ; Напряжение: 25 В; Тип: электролитический; Допуск: ±20%', '9.50', 2000, 'https://oskolchip.ru/_sh/1/147.jpg'),
(811, 3, 'Конденсатор 22 нФ 50В', 'Керамический конденсатор для высокочастотных схем.', 'Ёмкость: 22 нФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '5.25', 4000, 'https://ampero.ru/assets/images/products/411663/123.jpg'),
(812, 3, 'Конденсатор 470 мкФ 25В', 'Электролитический конденсатор для фильтров.', 'Ёмкость: 470 мкФ; Напряжение: 25 В; Тип: электролитический; Допуск: ±20%', '15.00', 1200, 'https://ampero.ru/assets/images/products/411663/123.jpg'),
(813, 3, 'Конденсатор 0.022 мкФ 50В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.022 мкФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '5.00', 4000, 'https://ekits.ru/upload/iblock/224/224207fadc6fb870cc78f2b36b4d3986.jpg'),
(814, 3, 'Конденсатор 47 мкФ 16В', 'Электролитический конденсатор для портативной электроники.', 'Ёмкость: 47 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '8.00', 2500, 'https://ir.ozone.ru/s3/multimedia-9/c1000/6812484489.jpg'),
(815, 3, 'Конденсатор 2.2 мкФ 100В', 'Керамический конденсатор для высокочастотных цепей.', 'Ёмкость: 2.2 мкФ; Напряжение: 100 В; Тип: керамический; Допуск: ±10%', '7.50', 3000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcvxEdMkHHHUr6Rgo6pqqxKaF1B30T63pZ7w&s'),
(816, 3, 'Конденсатор 680 пФ 50В', 'Керамический конденсатор для ВЧ-фильтров.', 'Ёмкость: 680 пФ; Напряжение: 50 В; Тип: керамический; Допуск: ±5%', '4.50', 4000, 'https://rm-tver.ru/upload/iblock/eba/rfi3wiomnh0i547ctud51ebygdp1b84l.jpg'),
(817, 3, 'Конденсатор 330 мкФ 35В', 'Электролитический конденсатор для источников питания.', 'Ёмкость: 330 мкФ; Напряжение: 35 В; Тип: электролитический; Допуск: ±20%', '14.50', 1500, 'https://ae04.alicdn.com/kf/S392b8fbd8e1e45fab9644b7d882d712fu.jpg'),
(818, 3, 'Конденсатор 0.047 мкФ 100В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.047 мкФ; Напряжение: 100 В; Тип: керамический; Допуск: ±10%', '5.75', 3500, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.zone4game.ru%2F821%2F&psig=AOvVaw3wKQlDFPM3ULqBCsysb6oG&ust=1746989465906000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJink4bJmY0DFQAAAAAdAAAAABAE'),
(819, 3, 'Конденсатор 100 мкФ 16В', 'Электролитический конденсатор для низковольтных схем.', 'Ёмкость: 100 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '9.00', 2000, 'https://static.chipdip.ru/lib/175/DOC000175437.jpg'),
(820, 3, 'Конденсатор 4.7 нФ 50В', 'Керамический конденсатор для высокочастотных схем.', 'Ёмкость: 4.7 нФ; Напряжение: 50 В; Тип: керамический; Допуск: ±10%', '5.00', 4000, 'https://oskolchip.ru/_sh/7/721.jpg'),
(821, 3, 'Конденсатор 220 мкФ 16В', 'Электролитический конденсатор для фильтров.', 'Ёмкость: 220 мкФ; Напряжение: 16 В; Тип: электролитический; Допуск: ±20%', '11.00', 1800, 'https://ir.ozone.ru/s3/multimedia-l/c1000/6376811049.jpg'),
(822, 3, 'Конденсатор 0.068 мкФ 100В', 'Керамический конденсатор для развязки.', 'Ёмкость: 0.068 мкФ; Напряжение: 100 В; Тип: керамический; Допуск: ±10%', '6.00', 3500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdrudsr_v-coXD33W5RtjbxPdZ8D1AkARlCg&s'),
(823, 4, 'Светодиод LED 5мм Красный', 'Круглый светодиод для индикации и подсветки.', 'Цвет: красный; Напряжение: 2.0 В; Ток: 20 мА; Размер: 5 мм; Тип: круглый', '3.50', 5000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpiY_jGTVlwsdMKObKWBCdCdB9Uwt7o6-pWg&s'),
(824, 4, 'Светодиод LED 5мм Зеленый', 'Круглый светодиод для сигнальных устройств.', 'Цвет: зеленый; Напряжение: 2.2 В; Ток: 20 мА; Размер: 5 мм; Тип: круглый', '3.75', 4500, 'https://smdx.ru/uploads/product/200/264/led-5mm-10pcs-color-green.jpg'),
(825, 4, 'Светодиод LED 3мм Синий', 'Компактный светодиод для декоративной подсветки.', 'Цвет: синий; Напряжение: 3.2 В; Ток: 20 мА; Размер: 3 мм; Тип: круглый', '5.00', 4000, 'https://voltiq.ru/wp-content/uploads/blue-led-3mm.jpg'),
(826, 4, 'Светодиод LED 5мм Белый', 'Яркий светодиод для освещения и индикации.', 'Цвет: белый; Напряжение: 3.4 В; Ток: 20 мА; Размер: 5 мм; Тип: круглый', '6.25', 3500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQdmYL9B5JDMf1OR3lM_55X3zFL5V9Jm42Q&s'),
(827, 4, 'Светодиод LED SMD 0805 Красный', 'Поверхностный светодиод для компактных схем.', 'Цвет: красный; Напряжение: 2.0 В; Ток: 20 мА; Размер: 0805; Тип: SMD', '4.00', 5000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZdDijf72gNd-F0Muzolwi1UIN36si00eiHQ&s'),
(828, 4, 'Светодиод LED SMD 0603 Зеленый', 'Миниатюрный светодиод для электроники.', 'Цвет: зеленый; Напряжение: 2.2 В; Ток: 20 мА; Размер: 0603; Тип: SMD', '4.50', 4500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6_uOB0tBo0IR13G7kowUw9fHaHyOvR5npqg&s'),
(829, 4, 'Светодиод LED 10мм Красный', 'Мощный светодиод для яркой индикации.', 'Цвет: красный; Напряжение: 2.0 В; Ток: 30 мА; Размер: 10 мм; Тип: круглый', '8.50', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJWpsu3UVAuTSM4x2JLl_bxUmWBsKKkStchw&s'),
(830, 4, 'Светодиод LED 5мм Желтый', 'Круглый светодиод для сигнальных панелей.', 'Цвет: желтый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 5 мм; Тип: круглый', '3.50', 5000, 'https://static.insales-cdn.com/images/products/1/6658/36739586/led-5mm.3.jpg'),
(831, 4, 'Светодиод LED SMD 1206 Белый', 'Поверхностный светодиод для подсветки дисплеев.', 'Цвет: белый; Напряжение: 3.4 В; Ток: 20 мА; Размер: 1206; Тип: SMD', '6.75', 3000, 'https://vsekomponenti.ru/upload/iblock/cf3/j1rbwnl0crshpvqiqo5cvbzrobyhwtac/svetodiod_belyy_1206_smd.jpg'),
(832, 4, 'Светодиод LED 3мм Красный', 'Компактный светодиод для индикации.', 'Цвет: красный; Напряжение: 2.0 В; Ток: 20 мА; Размер: 3 мм; Тип: круглый', '3.25', 5000, 'https://shop.robotclass.ru/image/cache/data/RParts/Led/PART-LED-3-RED-5Q-1024x768.jpg'),
(833, 4, 'Светодиод LED 5мм RGB', 'Многоцветный светодиод для декоративной подсветки.', 'Цвет: RGB; Напряжение: 2.0-3.4 В; Ток: 20 мА; Размер: 5 мм; Тип: круглый', '12.00', 1500, 'https://good-kits.ru/wa-data/public/shop/products/43/04/443/images/999/999.750.jpg'),
(834, 4, 'Светодиод LED SMD 0805 Синий', 'Поверхностный светодиод для электроники.', 'Цвет: синий; Напряжение: 3.2 В; Ток: 20 мА; Размер: 0805; Тип: SMD', '5.50', 4000, 'https://static.chipdip.ru/lib/740/DOC043740046.jpg'),
(835, 4, 'Светодиод LED 8мм Зеленый', 'Яркий светодиод для наружной индикации.', 'Цвет: зеленый; Напряжение: 2.2 В; Ток: 30 мА; Размер: 8 мм; Тип: круглый', '7.50', 2500, 'https://cdn.vseinstrumenti.ru/images/goods/elektrika-i-svet/osveschenie/3900582/1200x800/61208646.jpg'),
(836, 4, 'Светодиод LED SMD 0603 Желтый', 'Миниатюрный светодиод для компактных устройств.', 'Цвет: желтый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 0603; Тип: SMD', '4.25', 4500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsmwxMvhgIhOCuES9MEe5B9_3zF5jrT29KOg&s'),
(837, 4, 'Светодиод LED 5мм Оранжевый', 'Круглый светодиод для сигнальных устройств.', 'Цвет: оранжевый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 5 мм; Тип: круглый', '3.50', 5000, 'https://smdx.ru/uploads/product/200/266/led-5mm-10pcs-color-orange.jpg'),
(838, 4, 'Светодиод LED SMD 1206 Красный', 'Поверхностный светодиод для индикации.', 'Цвет: красный; Напряжение: 2.0 В; Ток: 20 мА; Размер: 1206; Тип: SMD', '4.50', 4000, 'https://cdn1.ozone.ru/s3/multimedia-f/c600/6692903079.jpg'),
(839, 4, 'Светодиод LED 3мм Зеленый', 'Компактный светодиод для электроники.', 'Цвет: зеленый; Напряжение: 2.2 В; Ток: 20 мА; Размер: 3 мм; Тип: круглый', '3.25', 5000, 'https://smdx.ru/uploads/product/700/769/led-5mm-10pcs-color-green.jpg'),
(840, 4, 'Светодиод LED 5мм УФ', 'Ультрафиолетовый светодиод для специальных приложений.', 'Цвет: ультрафиолет; Напряжение: 3.6 В; Ток: 20 мА; Размер: 5 мм; Тип: круглый', '15.00', 1000, 'https://voltiq.ru/wp-content/uploads/uv-led-200mcd-3.jpg'),
(841, 4, 'Светодиод LED SMD 0805 Белый', 'Поверхностный светодиод для подсветки.', 'Цвет: белый; Напряжение: 3.4 В; Ток: 20 мА; Размер: 0805; Тип: SMD', '6.50', 3500, 'https://static.chipdip.ru/lib/740/DOC043740046.jpg'),
(842, 4, 'Светодиод LED 10мм Белый', 'Мощный светодиод для освещения.', 'Цвет: белый; Напряжение: 3.4 В; Ток: 30 мА; Размер: 10 мм; Тип: круглый', '10.00', 2000, 'https://ir.ozone.ru/s3/multimedia-4/c1000/6820896100.jpg'),
(843, 4, 'Светодиод LED SMD 0603 Синий', 'Миниатюрный светодиод для электроники.', 'Цвет: синий; Напряжение: 3.2 В; Ток: 20 мА; Размер: 0603; Тип: SMD', '5.25', 4000, 'https://static.procontact74.ru/media/product/e083a848-470e-11ea-80cb-e0d55e81e32a_c1584e50-734f-11ea-80d0-e0d55e81e32a.jpeg'),
(844, 4, 'Светодиод LED 5мм ИК', 'Инфракрасный светодиод для пультов ДУ.', 'Цвет: инфракрасный; Напряжение: 1.2 В; Ток: 50 мА; Размер: 5 мм; Тип: круглый', '8.00', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-LQJoNNIDUqX7DtvAn29bIuBG7dYudvKUxg&s'),
(845, 4, 'Светодиод LED SMD 1206 Зеленый', 'Поверхностный светодиод для индикации.', 'Цвет: зеленый; Напряжение: 2.2 В; Ток: 20 мА; Размер: 1206; Тип: SMD', '4.75', 4000, 'https://cdn1.ozone.ru/s3/multimedia-o/6692691876.jpg'),
(846, 4, 'Светодиод LED 3мм Желтый', 'Компактный светодиод для сигнальных панелей.', 'Цвет: желтый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 3 мм; Тип: круглый', '3.25', 5000, 'https://voltiq.ru/wp-content/uploads/yellow-led-3mm.jpg'),
(847, 4, 'Светодиод LED 8мм Красный', 'Яркий светодиод для наружной индикации.', 'Цвет: красный; Напряжение: 2.0 В; Ток: 30 мА; Размер: 8 мм; Тип: круглый', '7.00', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd11_cNdJmbbQ_tQqF2ilxrOGtdv8Y6HTDCQ&s'),
(848, 4, 'Светодиод LED SMD 0805 Желтый', 'Поверхностный светодиод для электроники.', 'Цвет: желтый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 0805; Тип: SMD', '4.50', 4000, 'https://ir.ozone.ru/s3/multimedia-f/c1000/6693035271.jpg'),
(849, 4, 'Светодиод LED 5мм Синий', 'Круглый светодиод для декоративной подсветки.', 'Цвет: синий; Напряжение: 3.2 В; Ток: 20 мА; Размер: 5 мм; Тип: круглый', '5.50', 3500, 'https://oskolchip.ru/_sh/12/1278.jpg'),
(850, 4, 'Светодиод LED SMD 0603 Белый', 'Миниатюрный светодиод для подсветки.', 'Цвет: белый; Напряжение: 3.4 В; Ток: 20 мА; Размер: 0603; Тип: SMD', '6.25', 3500, 'https://basket-12.wbbasket.ru/vol1904/part190457/190457844/images/big/1.webp');
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `specifications`, `price`, `quantity`, `image_url`) VALUES
(851, 4, 'Светодиод LED 10мм Зеленый', 'Мощный светодиод для яркой индикации.', 'Цвет: зеленый; Напряжение: 2.2 В; Ток: 30 мА; Размер: 10 мм; Тип: круглый', '9.00', 2000, 'https://www.radioexpert.ru/upload/iblock/fd1/image.jpeg'),
(852, 4, 'Светодиод LED SMD 1206 Синий', 'Поверхностный светодиод для электроники.', 'Цвет: синий; Напряжение: 3.2 В; Ток: 20 мА; Размер: 1206; Тип: SMD', '5.75', 3500, 'https://cdn1.ozone.ru/s3/multimedia-8/6745727564.jpg'),
(853, 4, 'Светодиод LED 3мм Белый', 'Компактный светодиод для освещения.', 'Цвет: белый; Напряжение: 3.4 В; Ток: 20 мА; Размер: 3 мм; Тип: круглый', '5.75', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSARmByHMbPXvWhWL6N4d38Z-DAaO5WQwnE1w&s'),
(854, 4, 'Светодиод LED 5мм Красный Пиранья', 'Светодиод \"Пиранья\" для автомобильной подсветки.', 'Цвет: красный; Напряжение: 2.0 В; Ток: 30 мА; Размер: 7.6 мм; Тип: пиранья', '10.00', 2000, 'https://voltiq.ru/wp-content/uploads/piranha-led-red.jpg'),
(855, 4, 'Светодиод LED SMD 0805 Оранжевый', 'Поверхностный светодиод для индикации.', 'Цвет: оранжевый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 0805; Тип: SMD', '4.50', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7BPtvBJ-WkH8dL0jH_HZ_qz7srxe9qHgTEA&s'),
(856, 4, 'Светодиод LED 8мм Белый', 'Яркий светодиод для освещения.', 'Цвет: белый; Напряжение: 3.4 В; Ток: 30 мА; Размер: 8 мм; Тип: круглый', '8.50', 2500, 'https://shop.robotclass.ru/image/cache/data/RParts/Led/PART-LED-8-WA-W-1024x768.jpg'),
(857, 4, 'Светодиод LED 5мм Зеленый Пиранья', 'Светодиод \"Пиранья\" для яркой подсветки.', 'Цвет: зеленый; Напряжение: 2.2 В; Ток: 30 мА; Размер: 7.6 мм; Тип: пиранья', '10.50', 2000, 'https://static.insales-cdn.com/images/products/1/6659/36739587/led-5mm.4.jpg'),
(858, 4, 'Светодиод LED SMD 0603 Оранжевый', 'Миниатюрный светодиод для электроники.', 'Цвет: оранжевый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 0603; Тип: SMD', '4.25', 4500, 'https://ae04.alicdn.com/kf/H8b4444d25ecc4f17a639c90708a957a1K.jpg'),
(859, 4, 'Светодиод LED 3мм Оранжевый', 'Компактный светодиод для индикации.', 'Цвет: оранжевый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 3 мм; Тип: круглый', '3.25', 5000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaXKnEx-rGJc6jyIzsBwxdXCWG9GEnVvAJCw&s'),
(860, 4, 'Светодиод LED SMD 1206 Желтый', 'Поверхностный светодиод для индикации.', 'Цвет: желтый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 1206; Тип: SMD', '4.75', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSCSYPMBDcDys58mCxEE0jP3-gr4L3AA795Q&s'),
(861, 4, 'Светодиод LED 5мм Белый Пиранья', 'Светодиод \"Пиранья\" для мощной подсветки.', 'Цвет: белый; Напряжение: 3.4 В; Ток: 30 мА; Размер: 7.6 мм; Тип: пиранья', '12.00', 1500, 'https://oskolchip.ru/_sh/13/1337.jpg'),
(862, 4, 'Светодиод LED 10мм Синий', 'Мощный светодиод для декоративной подсветки.', 'Цвет: синий; Напряжение: 3.2 В; Ток: 30 мА; Размер: 10 мм; Тип: круглый', '9.50', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdXF5eyeEvzAkTKQoFWrxC179aZx8SLLxaLg&s'),
(863, 4, 'Светодиод LED SMD 0805 Зеленый', 'Поверхностный светодиод для электроники.', 'Цвет: зеленый; Напряжение: 2.2 В; Ток: 20 мА; Размер: 0805; Тип: SMD', '4.50', 4000, 'https://static.insales-cdn.com/images/products/1/6659/36739587/led-5mm.4.jpg'),
(864, 4, 'Светодиод LED 3мм ИК', 'Инфракрасный светодиод для ИК-устройств.', 'Цвет: инфракрасный; Напряжение: 1.2 В; Ток: 50 мА; Размер: 3 мм; Тип: круглый', '7.50', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSARmByHMbPXvWhWL6N4d38Z-DAaO5WQwnE1w&s'),
(865, 4, 'Светодиод LED 8мм Желтый', 'Яркий светодиод для сигнальных панелей.', 'Цвет: желтый; Напряжение: 2.1 В; Ток: 30 мА; Размер: 8 мм; Тип: круглый', '7.00', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7BPtvBJ-WkH8dL0jH_HZ_qz7srxe9qHgTEA&s'),
(866, 4, 'Светодиод LED SMD 0603 Красный', 'Миниатюрный светодиод для индикации.', 'Цвет: красный; Напряжение: 2.0 В; Ток: 20 мА; Размер: 0603; Тип: SMD', '4.00', 4500, 'https://voltiq.ru/wp-content/uploads/piranha-led-red.jpg'),
(867, 4, 'Светодиод LED 5мм Оранжевый Пиранья', 'Светодиод \"Пиранья\" для подсветки.', 'Цвет: оранжевый; Напряжение: 2.1 В; Ток: 30 мА; Размер: 7.6 мм; Тип: пиранья', '10.50', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhariTl_Az_4b_U2BM-YtIgdfCTaWxpVb7hQ&s'),
(868, 4, 'Светодиод LED 3мм Синий', 'Компактный светодиод для электроники.', 'Цвет: синий; Напряжение: 3.2 В; Ток: 20 мА; Размер: 3 мм; Тип: круглый', '5.00', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYF4YFxi3WoSiFWliwIBsVqvEY0q9tzdrCEg&s'),
(869, 4, 'Светодиод LED SMD 1206 Оранжевый', 'Поверхностный светодиод для индикации.', 'Цвет: оранжевый; Напряжение: 2.1 В; Ток: 20 мА; Размер: 1206; Тип: SMD', '4.75', 4000, 'https://cdn1.ozone.ru/s3/multimedia-f/6745754103.jpg'),
(870, 4, 'Светодиод LED 10мм Желтый', 'Мощный светодиод для сигнальных устройств.', 'Цвет: желтый; Напряжение: 2.1 В; Ток: 30 мА; Размер: 10 мм; Тип: круглый', '8.50', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzNLLioTUUe9_vsq3RZ2r-ZtnrrPtzU1hKKg&s'),
(871, 4, 'Светодиод LED 5мм УФ', 'Ультрафиолетовый светодиод для специальных приложений.', 'Цвет: ультрафиолет; Напряжение: 3.6 В; Ток: 20 мА; Размер: 5 мм; Тип: круглый', '15.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcq67J9QSbrahZYqu_AOISsZ7sxKYMxrJ4yQ&s'),
(872, 4, 'Светодиод LED SMD 0805 Красный', 'Поверхностный светодиод для компактных схем.', 'Цвет: красный; Напряжение: 2.0 В; Ток: 20 мА; Размер: 0805; Тип: SMD', '4.00', 5000, 'https://ae04.alicdn.com/kf/H44ebd186493e45ac9dc3a9305836bbbcS.jpg'),
(873, 4, 'Светодиод LED 8мм Синий', 'Яркий светодиод для декоративной подсветки.', 'Цвет: синий; Напряжение: 3.2 В; Ток: 30 мА; Размер: 8 мм; Тип: круглый', '8.00', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjEFJLqvBms4pTuvXAye6MCbu_9Qob0q8p4Q&s'),
(874, 5, 'Транзистор 2N3904', 'NPN транзистор для усилителей и переключателей.', 'Тип: NPN; Напряжение: 40 В; Ток: 200 мА; Корпус: TO-92; Частота: 300 МГц', '5.50', 5000, 'https://roboparts.ru/upload/iblock/67d/67ddd0628ac24f76f4b594d78c261b89.jpg'),
(875, 5, 'Транзистор BC547B', 'NPN транзистор для низкочастотных приложений.', 'Тип: NPN; Напряжение: 45 В; Ток: 100 мА; Корпус: TO-92; Частота: 300 МГц', '4.75', 4500, 'https://ir.ozone.ru/s3/multimedia-g/c1000/6272946760.jpg'),
(876, 5, 'Транзистор IRF540N', 'N-канальный MOSFET для силовых цепей.', 'Тип: N-MOSFET; Напряжение: 100 В; Ток: 33 А; Корпус: TO-220; Сопротивление: 44 мОм', '25.00', 1500, 'https://shop.robotclass.ru/image/cache/data/RParts/irf540npbf-1024x768.jpg'),
(877, 5, 'Транзистор BC337-40', 'NPN транзистор для усиления сигналов.', 'Тип: NPN; Напряжение: 45 В; Ток: 500 мА; Корпус: TO-92; Частота: 100 МГц', '6.00', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoqrJuBYi__IYytvOf0pZoqRlw9UVlNZ_kZw&s'),
(878, 5, 'Транзистор 2N2222A', 'NPN транзистор для переключательных схем.', 'Тип: NPN; Напряжение: 40 В; Ток: 600 мА; Корпус: TO-18; Частота: 300 МГц', '7.25', 3500, 'https://pacpac.ru/published/publicdata/WWWTPGSHOPRUPACPAC/attachments/SC/products_pictures/PKP-00012-2_enl.jpg'),
(879, 5, 'Транзистор IRF3205', 'N-канальный MOSFET для высокоточных приложений.', 'Тип: N-MOSFET; Напряжение: 55 В; Ток: 110 А; Корпус: TO-220; Сопротивление: 8 мОм', '30.00', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9HsM4Mcg8qQA-vSF0ferD3RqJpDPwsDnOjA&s'),
(880, 5, 'Транзистор BC557B', 'PNP транзистор для низкочастотных схем.', 'Тип: PNP; Напряжение: 45 В; Ток: 100 мА; Корпус: TO-92; Частота: 150 МГц', '5.00', 4500, 'https://roboparts.ru/upload/iblock/c50/c50c430d55fae6ec5071d00afd2dd837.png'),
(881, 5, 'Транзистор TIP41C', 'NPN транзистор для силовых усилителей.', 'Тип: NPN; Напряжение: 100 В; Ток: 6 А; Корпус: TO-220; Частота: 3 МГц', '15.50', 2000, 'https://basket-15.wbbasket.ru/vol2242/part224255/224255457/images/big/1.webp'),
(882, 5, 'Транзистор TIP42C', 'PNP транзистор для силовых приложений.', 'Тип: PNP; Напряжение: 100 В; Ток: 6 А; Корпус: TO-220; Частота: 3 МГц', '16.00', 2000, 'https://oskolchip.ru/_sh/3/357.jpg'),
(883, 5, 'Транзистор IRFZ44N', 'N-канальный MOSFET для силовых цепей.', 'Тип: N-MOSFET; Напряжение: 55 В; Ток: 49 А; Корпус: TO-220; Сопротивление: 17.5 мОм', '22.50', 1800, 'https://vek-elektroniki.ru/d/irfz44n_tranzistor.gif'),
(884, 5, 'Транзистор 2N3906', 'PNP транзистор для усиления сигналов.', 'Тип: PNP; Напряжение: 40 В; Ток: 200 мА; Корпус: TO-92; Частота: 250 МГц', '5.25', 5000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpBaDM8AJn1RifCQIhSn2G5Itbgy1oYbn-Jw&s'),
(885, 5, 'Транзистор MJE3055T', 'NPN транзистор для источников питания.', 'Тип: NPN; Напряжение: 60 В; Ток: 10 А; Корпус: TO-220; Частота: 2 МГц', '18.75', 1500, 'https://static.chipdip.ru/lib/047/DOC026047171.jpg'),
(886, 5, 'Транзистор MJE2955T', 'PNP транзистор для силовых цепей.', 'Тип: PNP; Напряжение: 60 В; Ток: 10 А; Корпус: TO-220; Частота: 2 МГц', '19.00', 1500, 'https://ae04.alicdn.com/kf/H8773aaa3eb77464e8b9907af2aece3d8R.jpg'),
(887, 5, 'Транзистор BSS138', 'N-канальный MOSFET для низковольтных схем.', 'Тип: N-MOSFET; Напряжение: 50 В; Ток: 220 мА; Корпус: SOT-23; Сопротивление: 3.5 Ом', '8.50', 4000, 'https://static.procontact74.ru/media/product/423e7b8f-1758-11e7-8f9d-00e04c130b2c_0008fb0f-cce5-11ea-80d1-e0d55e81e32a.jpeg'),
(888, 5, 'Транзистор BC817-40', 'NPN транзистор для общего применения.', 'Тип: NPN; Напряжение: 45 В; Ток: 500 мА; Корпус: SOT-23; Частота: 100 МГц', '6.25', 4500, 'https://ir.ozone.ru/s3/multimedia-i/c1000/6133205058.jpg'),
(889, 5, 'Транзистор BC807-40', 'PNP транзистор для низкочастотных схем.', 'Тип: PNP; Напряжение: 45 В; Ток: 500 мА; Корпус: SOT-23; Частота: 100 МГц', '6.00', 4500, 'https://ir.ozone.ru/s3/multimedia-i/c1000/6133205058.jpg'),
(890, 5, 'Транзистор IRF9540N', 'P-канальный MOSFET для силовых приложений.', 'Тип: P-MOSFET; Напряжение: 100 В; Ток: 23 А; Корпус: TO-220; Сопротивление: 117 мОм', '28.00', 1200, 'https://static.chipdip.ru/lib/219/DOC000219243.jpg'),
(891, 5, 'Транзистор 2N7000', 'N-канальный MOSFET для переключательных схем.', 'Тип: N-MOSFET; Напряжение: 60 В; Ток: 200 мА; Корпус: TO-92; Сопротивление: 5 Ом', '7.50', 4000, 'https://static.chipdip.ru/lib/299/DOC005299942.jpg'),
(892, 5, 'Транзистор TIP120', 'NPN транзистор Дарлингтона для силовых цепей.', 'Тип: NPN Дарлингтон; Напряжение: 60 В; Ток: 5 А; Корпус: TO-220; Частота: 1 МГц', '15.00', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREaZwggjnl95-CE7Sz0qlp0DGKP2PLT4MNlQ&s'),
(893, 5, 'Транзистор TIP127', 'PNP транзистор Дарлингтона для силовых цепей.', 'Тип: PNP Дарлингтон; Напряжение: 100 В; Ток: 5 А; Корпус: TO-220; Частота: 1 МГц', '16.50', 2000, 'https://static.procontact74.ru/media/product/655f642f-c740-11ed-8112-e0d55e81e32a_0ed46d00-1f57-11ee-811f-e0d55e81e32a.jpeg'),
(894, 5, 'Транзистор IRFP260N', 'N-канальный MOSFET для высоковольтных схем.', 'Тип: N-MOSFET; Напряжение: 200 В; Ток: 50 А; Корпус: TO-247; Сопротивление: 40 мОм', '35.00', 1000, 'https://static.chipdip.ru/lib/221/DOC000221958.jpg'),
(895, 5, 'Транзистор BC846B', 'NPN транзистор для общего применения.', 'Тип: NPN; Напряжение: 65 В; Ток: 100 мА; Корпус: SOT-23; Частота: 100 МГц', '5.75', 4500, 'https://chip-center.ru/storage/photo/resized/xy_800x600/g/a7fg7l0wmu6bqw1_901aafa1.jpg'),
(896, 5, 'Транзистор BC856B', 'PNP транзистор для низкочастотных схем.', 'Тип: PNP; Напряжение: 65 В; Ток: 100 мА; Корпус: SOT-23; Частота: 100 МГц', '5.50', 4500, 'https://elecomp.ru/wa-data/public/shop/products/88/15/431588/images/216868/216868.970.jpg'),
(897, 5, 'Транзистор IRF740', 'N-канальный MOSFET для силовых приложений.', 'Тип: N-MOSFET; Напряжение: 400 В; Ток: 10 А; Корпус: TO-220; Сопротивление: 550 мОм', '20.00', 1500, 'https://oskolchip.ru/_sh/1/194.jpg'),
(898, 5, 'Транзистор 2N4401', 'NPN транзистор для усиления сигналов.', 'Тип: NPN; Напряжение: 40 В; Ток: 600 мА; Корпус: TO-92; Частота: 250 МГц', '6.50', 4000, 'https://vsekomponenti.ru/upload/iblock/b98/seywhbejqhfgh326fuzr6mkkypr9mbnn/tranzistor_2n4401_npn.jpg'),
(899, 5, 'Транзистор 2N4403', 'PNP транзистор для усиления сигналов.', 'Тип: PNP; Напряжение: 40 В; Ток: 600 мА; Корпус: TO-92; Частота: 200 МГц', '6.25', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcwbNkourysGi7_RerJH9_kiCe_USma2ugnQ&s'),
(900, 5, 'Транзистор IRF630', 'N-канальный MOSFET для силовых цепей.', 'Тип: N-MOSFET; Напряжение: 200 В; Ток: 9 А; Корпус: TO-220; Сопротивление: 400 мОм', '18.50', 1800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLoGyrmHk892eSUqGrcGr6y9zWXGUbccDfNQ&s'),
(901, 5, 'Транзистор BD139', 'NPN транзистор для аудиоусилителей.', 'Тип: NPN; Напряжение: 80 В; Ток: 1.5 А; Корпус: TO-126; Частота: 50 МГц', '10.00', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe7sP_rTinquzbegTtlnv9NO_Nko5AbBQvug&s'),
(902, 5, 'Транзистор BD140', 'PNP транзистор для аудиоусилителей.', 'Тип: PNP; Напряжение: 80 В; Ток: 1.5 А; Корпус: TO-126; Частота: 50 МГц', '10.25', 2500, 'https://www.promelec.ru/fs/cache/41/18/90/b2/ba6d2c4e6f447842569357df.jpg'),
(903, 5, 'Транзистор IRF840', 'N-канальный MOSFET для высоковольтных цепей.', 'Тип: N-MOSFET; Напряжение: 500 В; Ток: 8 А; Корпус: TO-220; Сопротивление: 850 мОм', '22.00', 1500, 'https://www.elirit.ru/data/catalog/708962.jpg'),
(904, 5, 'Транзистор BC327-25', 'PNP транзистор для общего применения.', 'Тип: PNP; Напряжение: 45 В; Ток: 500 мА; Корпус: TO-92; Частота: 100 МГц', '5.75', 4500, 'https://roboparts.ru/upload/iblock/0c3/0c3f83ebc222bbcb7969a21faf1cdfb0.jpg'),
(905, 5, 'Транзистор BC517', 'NPN транзистор Дарлингтона для усиления.', 'Тип: NPN Дарлингтон; Напряжение: 30 В; Ток: 1.2 А; Корпус: TO-92; Частота: 200 МГц', '8.00', 3500, 'https://www.chip-center.ru/storage/photo/resized/xy_800x600/g/4ham2631habnq38_dbcafad5.jpg'),
(906, 5, 'Транзистор IRF3710', 'N-канальный MOSFET для силовых цепей.', 'Тип: N-MOSFET; Напряжение: 100 В; Ток: 57 А; Корпус: TO-220; Сопротивление: 23 мОм', '27.50', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcwbNkourysGi7_RerJH9_kiCe_USma2ugnQ&s'),
(907, 5, 'Транзистор BF998', 'N-канальный MOSFET для ВЧ-приложений.', 'Тип: N-MOSFET; Напряжение: 12 В; Ток: 30 мА; Корпус: SOT-143; Частота: 1 ГГц', '12.50', 3000, 'https://static.procontact74.ru/media/product/655f642f-c740-11ed-8112-e0d55e81e32a_0ed46d00-1f57-11ee-811f-e0d55e81e32a.jpeg'),
(908, 5, 'Транзистор 2SC1815', 'NPN транзистор для аудиоусилителей.', 'Тип: NPN; Напряжение: 50 В; Ток: 150 мА; Корпус: TO-92; Частота: 80 МГц', '6.00', 4000, 'https://www.promelec.ru/fs/cache/41/18/90/b2/ba6d2c4e6f447842569357df.jpg'),
(909, 5, 'Транзистор 2SA1015', 'PNP транзистор для аудиоусилителей.', 'Тип: PNP; Напряжение: 50 В; Ток: 150 мА; Корпус: TO-92; Частота: 80 МГц', '5.75', 4000, 'https://elecomp.ru/wa-data/public/shop/products/88/15/431588/images/216868/216868.970.jpg'),
(910, 5, 'Транзистор IRF510', 'N-канальный MOSFET для силовых цепей.', 'Тип: N-MOSFET; Напряжение: 100 В; Ток: 5.6 А; Корпус: TO-220; Сопротивление: 540 мОм', '15.50', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZN7Ctq88la28PoC0GGyLfMjj_B8tDk8ZIYA&s'),
(911, 5, 'Транзистор MJL3281A', 'NPN транзистор для аудиоусилителей.', 'Тип: NPN; Напряжение: 200 В; Ток: 15 А; Корпус: TO-264; Частота: 30 МГц', '45.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjuvJRoKp49Z6XZz7HpFGw69Rk6QC3ikXTwQ&s'),
(912, 5, 'Транзистор MJL1302A', 'PNP транзистор для аудиоусилителей.', 'Тип: PNP; Напряжение: 200 В; Ток: 15 А; Корпус: TO-264; Частота: 30 МГц', '46.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf02FYuHW_7nDf6tB9ubZIyNqNkX6g1zKMYA&s'),
(913, 5, 'Транзистор IRF4905', 'P-канальный MOSFET для силовых цепей.', 'Тип: P-MOSFET; Напряжение: 55 В; Ток: 74 А; Корпус: TO-220; Сопротивление: 20 мОм', '30.00', 1200, 'https://vsekomponenti.ru/upload/iblock/698/lrchos4wwn8bd853vzokyzyiy81cm4h2/tranzistor_irf4905_p_kanal.jpg'),
(914, 5, 'Транзистор BC639', 'NPN транзистор для усиления сигналов.', 'Тип: NPN; Напряжение: 80 В; Ток: 1 А; Корпус: TO-92; Частота: 200 МГц', '7.00', 3500, 'https://radioremont.com/wa-data/public/shop/products/00/webp/37/38/3837/images/347017/TO-92.970.webp'),
(915, 5, 'Транзистор BC640', 'PNP транзистор для усиления сигналов.', 'Тип: PNP; Напряжение: 80 В; Ток: 1 А; Корпус: TO-92; Частота: 150 МГц', '6.75', 3500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkaXTHuuRU3L16gykS2Bv65KHP9C8XBYt0nQ&s'),
(916, 5, 'Транзистор IRF2807', 'N-канальный MOSFET для силовых приложений.', 'Тип: N-MOSFET; Напряжение: 75 В; Ток: 82 А; Корпус: TO-220; Сопротивление: 13 мОм', '32.50', 1000, 'https://static.chipdip.ru/lib/218/DOC000218176.jpg'),
(917, 5, 'Транзистор 2N5551', 'NPN транзистор для высокочастотных схем.', 'Тип: NPN; Напряжение: 160 В; Ток: 600 мА; Корпус: TO-92; Частота: 300 МГц', '6.50', 4000, 'https://s.alicdn.com/@sc04/kf/H6aa08b7e5eb54b3fa83aa7b56963a300M.jpg_720x720q50.jpg'),
(918, 5, 'Транзистор 2N5401', 'PNP транзистор для высокочастотных схем.', 'Тип: PNP; Напряжение: 150 В; Ток: 600 мА; Корпус: TO-92; Частота: 300 МГц', '6.25', 4000, 'https://radiosfera.net/files/catalog/tranzistor-2n5401.jpg'),
(919, 5, 'Транзистор IRF530', 'N-канальный MOSFET для силовых цепей.', 'Тип: N-MOSFET; Напряжение: 100 В; Ток: 14 А; Корпус: TO-220; Сопротивление: 160 мОм', '17.50', 1800, 'https://doc.platan.ru/img_base/view/901640.jpg'),
(920, 5, 'Транзистор TIP31C', 'NPN транзистор для силовых приложений.', 'Тип: NPN; Напряжение: 100 В; Ток: 3 А; Корпус: TO-220; Частота: 3 МГц', '12.50', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrPLTBvN5mqoJ4W3RND7VNk0jHylUFDoHedg&s'),
(921, 5, 'Транзистор TIP32C', 'PNP транзистор для силовых приложений.', 'Тип: PNP; Напряжение: 100 В; Ток: 3 А; Корпус: TO-220; Частота: 3 МГц', '12.75', 2500, 'https://ampero.ru/assets/images/products/570580/10094.jpg'),
(922, 5, 'Транзистор IRFBC40', 'N-канальный MOSFET для высоковольтных схем.', 'Тип: N-MOSFET; Напряжение: 600 В; Ток: 6.2 А; Корпус: TO-220; Сопротивление: 1.2 Ом', '25.00', 1500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJKvi3wrs4ps3icFLE446bkAarl8yjCmNaNA&s'),
(923, 5, 'Транзистор 2SC945', 'NPN транзистор для аудиоусилителей.', 'Тип: NPN; Напряжение: 50 В; Ток: 100 мА; Корпус: TO-92; Частота: 150 МГц', '5.50', 4500, 'https://www.joyta.ru/uploads/2022/01/tranzistor-c945-parametry-cokolevka-analog-datasheet.jpg'),
(924, 5, 'Транзистор 2SA733', 'PNP транзистор для аудиоусилителей.', 'Тип: PNP; Напряжение: 50 В; Ток: 100 мА; Корпус: TO-92; Частота: 180 МГц', '5.25', 4500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsU5RhOns83w9qkhcvPKVmZi2P3j0WLXU9ZQ&s'),
(925, 5, 'Транзистор IRF640', 'N-канальный MOSFET для силовых цепей.', 'Тип: N-MOSFET; Напряжение: 200 В; Ток: 18 А; Корпус: TO-220; Сопротивление: 180 мОм', '20.50', 1800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfH_-pU0A0W-5SEubciJMXdh-T7a__n4y9jA&s'),
(926, 6, 'Датчик температуры TMP36', 'Аналоговый датчик температуры для измерения в диапазоне от -40°C до +125°C.', 'Тип: температурный; Диапазон: -40°C..+125°C; Питание: 2.7-5.5 В; Интерфейс: аналоговый; Корпус: TO-92', '75.00', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqE9uxqmWp80Wd5eMsHn_NXTOyRm4iIAKBYg&s'),
(927, 6, 'Датчик влажности DHT11', 'Цифровой датчик для измерения влажности и температуры.', 'Тип: влажность/температура; Диапазон: 20-80% RH, 0-50°C; Питание: 3.3-5 В; Интерфейс: цифровой; Корпус: модуль', '120.00', 1500, 'https://3d-diy.ru/upload/cssinliner_webp/iblock/7b7/rqpm1n0rgjk486prt09t9xg5c74tgfcx/cifrovoj_datchik_temperatury_i_vlazhnosti_dht11.webp'),
(928, 6, 'Датчик движения PIR HC-SR501', 'Инфракрасный датчик движения для систем безопасности.', 'Тип: движение; Диапазон: до 7 м; Питание: 4.5-20 В; Интерфейс: цифровой; Корпус: модуль', '150.00', 1000, 'https://asenergi.ru/assets/images/detector/hc-sr501/dp-102-fms-full.jpg'),
(929, 6, 'Датчик Холла A3144', 'Магнитный датчик для обнаружения магнитных полей.', 'Тип: Холл; Диапазон: ±500 Гс; Питание: 4.5-24 В; Интерфейс: цифровой; Корпус: TO-92', '45.00', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Ng0V4HAjq44mBTaGAwhx3mrz54gfeXuarg&s'),
(930, 6, 'Датчик давления BMP280', 'Барометрический датчик для измерения давления и температуры.', 'Тип: давление/температура; Диапазон: 300-1100 гПа; Питание: 1.8-3.6 В; Интерфейс: I2C/SPI; Корпус: LGA', '180.00', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv6yBL9ZVCDe5smvqpJQDn18y_cy-th91hMw&s'),
(931, 6, 'Датчик освещенности BH1750', 'Цифровой датчик для измерения уровня освещенности.', 'Тип: освещенность; Диапазон: 0-65535 лк; Питание: 2.4-3.6 В; Интерфейс: I2C; Корпус: модуль', '140.00', 1500, 'https://www.ultrarobox.ru/wa-data/public/shop/products/52/24/2452/images/5901/5901.970.jpg'),
(932, 6, 'Датчик газа MQ-2', 'Датчик для обнаружения горючих газов и дыма.', 'Тип: газ; Диапазон: 300-10000 ppm; Питание: 5 В; Интерфейс: аналоговый; Корпус: модуль', '200.00', 800, 'https://voltiq.ru/wp-content/uploads/smoke-sensor-MQ2-1.jpg'),
(933, 6, 'Датчик температуры DS18B20', 'Цифровой датчик температуры с высокой точностью.', 'Тип: температурный; Диапазон: -55°C..+125°C; Питание: 3.0-5.5 В; Интерфейс: 1-Wire; Корпус: TO-92', '90.00', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3zRza0YOKxn_jdEaInC7H832UHCi-VnqS1Q&s'),
(934, 6, 'Датчик ускорения ADXL345', '3-осевой акселерометр для измерения ускорения.', 'Тип: акселерометр; Диапазон: ±16g; Питание: 2.0-3.6 В; Интерфейс: I2C/SPI; Корпус: LGA', '250.00', 1000, 'https://static.chipdip.ru/lib/694/DOC013694630.jpg'),
(935, 6, 'Датчик угла MPU-6050', '6-осевой гироскоп и акселерометр для ориентации.', 'Тип: гироскоп/акселерометр; Диапазон: ±2000°/с, ±16g; Питание: 2.3-3.4 В; Интерфейс: I2C; Корпус: QFN', '280.00', 900, 'https://3d-diy.ru/upload/cssinliner_webp/iblock/cd4/Datchik-ugla-naklona-MPU6050-_GY_25_.webp'),
(936, 6, 'Датчик тока ACS712', 'Датчик тока для измерения постоянного и переменного тока.', 'Тип: ток; Диапазон: ±5 А; Питание: 5 В; Интерфейс: аналоговый; Корпус: SOIC-8', '220.00', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Sy_1mNyl6GO0gjwh0bwLP60YrFJlHQmMhw&s'),
(937, 6, 'Датчик ультразвука HC-SR04', 'Ультразвуковой датчик для измерения расстояния.', 'Тип: расстояние; Диапазон: 2-400 см; Питание: 5 В; Интерфейс: цифровой; Корпус: модуль', '130.00', 1500, 'https://static.insales-cdn.com/images/products/1/4577/441561569/rangefinder-ultrasonic-hc-sr04.1.jpg'),
(938, 6, 'Датчик влажности HIH-4030', 'Аналоговый датчик влажности для точных измерений.', 'Тип: влажность; Диапазон: 0-100% RH; Питание: 4-5.8 В; Интерфейс: аналоговый; Корпус: SMD', '450.00', 600, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD9L8RM1jV9zv8Uvdj0FaluayO6shQAQFdHQ&s'),
(939, 6, 'Датчик газа MQ-135', 'Датчик для обнаружения аммиака, серы и бензола.', 'Тип: газ; Диапазон: 10-1000 ppm; Питание: 5 В; Интерфейс: аналоговый; Корпус: модуль', '210.00', 800, 'https://static.insales-cdn.com/images/products/1/4654/425062958/DSCN5337.jpg'),
(940, 6, 'Датчик температуры LM35', 'Аналоговый датчик температуры с линейным выходом.', 'Тип: температурный; Диапазон: -55°C..+150°C; Питание: 4-30 В; Интерфейс: аналоговый; Корпус: TO-92', '80.00', 2000, 'https://static.insales-cdn.com/images/products/1/2084/11626532/E-LM35.2.jpg'),
(941, 6, 'Датчик магнитного поля SS495A', 'Линейный датчик Холла для измерения магнитных полей.', 'Тип: Холл; Диапазон: ±670 Гс; Питание: 4.5-10.5 В; Интерфейс: аналоговый; Корпус: TO-92', '100.00', 1800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvfwohLU13JYQ-MexbNAM96VpYSXl6Y9XzTg&s'),
(942, 6, 'Датчик давления MPX5700AP', 'Аналоговый датчик давления для промышленных приложений.', 'Тип: давление; Диапазон: 15-700 кПа; Питание: 4.75-5.25 В; Интерфейс: аналоговый; Корпус: SIP', '600.00', 500, 'https://www.promelec.ru/fs/cache/b6/87/f8/04/6b158f103b025515ceeb60e7.jpg'),
(943, 6, 'Датчик освещенности TSL2561', 'Цифровой датчик для измерения освещенности.', 'Тип: освещенность; Диапазон: 0.1-40000 лк; Питание: 2.7-3.6 В; Интерфейс: I2C; Корпус: TMB-6', '200.00', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhgQiGITwDL9mg5fDe3vr8RxHg9je_RHlQBw&s'),
(944, 6, 'Датчик газа MQ-7', 'Датчик для обнаружения угарного газа.', 'Тип: газ; Диапазон: 20-2000 ppm; Питание: 5 В; Интерфейс: аналоговый; Корпус: модуль', '190.00', 900, 'https://shop.robotclass.ru/image/cache/data/Sensors/SENS-GAS-MQ7-1024x768.JPG'),
(945, 6, 'Датчик температуры NTC 10K', 'Термистор для измерения температуры.', 'Тип: температурный; Диапазон: -50°C..+110°C; Питание: пассивный; Интерфейс: аналоговый; Корпус: DO-35', '30.00', 3000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFuPgGnsMnSzX7vqgyAUnEMbbNBCWLmepBRQ&s'),
(946, 6, 'Датчик движения MW0582TR', 'Микроволновый датчик движения для автоматизации.', 'Тип: движение; Диапазон: до 10 м; Питание: 5 В; Интерфейс: цифровой; Корпус: модуль', '300.00', 700, 'https://static.insales-cdn.com/images/products/1/2084/11626532/E-LM35.2.jpg'),
(947, 6, 'Датчик угла VL53L0X', 'Лазерный датчик расстояния и угла.', 'Тип: расстояние; Диапазон: 50-2000 мм; Питание: 2.6-3.5 В; Интерфейс: I2C; Корпус: LGA', '350.00', 800, 'https://ae01.alicdn.com/kf/H54f7db95032f425892ffb2f11b93c632t.jpg'),
(948, 6, 'Датчик тока INA219', 'Цифровой датчик тока и напряжения.', 'Тип: ток/напряжение; Диапазон: ±3.2 А; Питание: 3.0-5.5 В; Интерфейс: I2C; Корпус: SOT-23', '250.00', 1000, 'https://roboshop.spb.ru/image/cache/catalog/demo/product/INA219-2-800x800.jpg'),
(949, 6, 'Датчик газа MQ-3', 'Датчик для обнаружения алкоголя.', 'Тип: газ; Диапазон: 0.05-10 мг/л; Питание: 5 В; Интерфейс: аналоговый; Корпус: модуль', '200.00', 900, 'https://static.insales-cdn.com/images/products/1/179/103784627/troyka-mq-3.1.jpg'),
(950, 6, 'Датчик ускорения MMA8452Q', '3-осевой акселерометр для портативных устройств.', 'Тип: акселерометр; Диапазон: ±8g; Питание: 1.95-3.6 В; Интерфейс: I2C; Корпус: QFN', '220.00', 1100, 'https://ae04.alicdn.com/kf/HTB1hzYISpXXXXX9apXXq6xXFXXXb.jpg'),
(951, 6, 'Датчик температуры MCP9808', 'Цифровой датчик температуры с высокой точностью.', 'Тип: температурный; Диапазон: -40°C..+125°C; Питание: 2.7-5.5 В; Интерфейс: I2C; Корпус: MSOP-8', '160.00', 1500, 'https://static.chipdip.ru/lib/030/DOC033030922.jpg'),
(952, 6, 'Датчик магнитного поля HMC5883L', '3-осевой магнитометр для навигации.', 'Тип: магнитометр; Диапазон: ±8 Гс; Питание: 1.8-3.6 В; Интерфейс: I2C; Корпус: LCC-16', '200.00', 1200, 'https://shop.robotclass.ru/image/cache/data/Sensors/Other/SENS-MAG-HMC5883L-3-1024x768.jpg'),
(953, 6, 'Датчик давления LPS25HB', 'Барометрический датчик для мобильных устройств.', 'Тип: давление; Диапазон: 260-1260 гПа; Питание: 1.7-3.6 В; Интерфейс: I2C/SPI; Корпус: HCLGA', '300.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaivWYR5slvMGkJXllg9UZjpj9GS9LZa9Hwg&s'),
(954, 6, 'Датчик освещенности OPT3001', 'Цифровой датчик для точного измерения света.', 'Тип: освещенность; Диапазон: 0.01-83000 лк; Питание: 1.6-3.6 В; Интерфейс: I2C; Корпус: USON-6', '180.00', 1300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiYqYP81xc_1X1MJjcWH4JTapRn37XDG5YEQ&s'),
(955, 6, 'Датчик газа MQ-4', 'Датчик для обнаружения метана.', 'Тип: газ; Диапазон: 300-10000 ppm; Питание: 5 В; Интерфейс: аналоговый; Корпус: модуль', '190.00', 900, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDt4ssaf5zPsgoO7uD-lt8ANcFdJrSQcYdvQ&s'),
(956, 6, 'Датчик температуры PT100', 'Платиновый термометр сопротивления.', 'Тип: температурный; Диапазон: -50°C..+500°C; Питание: пассивный; Интерфейс: аналоговый; Корпус: зонд', '400.00', 600, 'https://roboshop.spb.ru/image/cache/catalog/demo/product/INA219-2-800x800.jpg'),
(957, 6, 'Датчик движения AMG8833', 'Инфракрасный датчик теплового изображения.', 'Тип: тепловизионный; Диапазон: 0-80°C; Питание: 3.3-5 В; Интерфейс: I2C; Корпус: QFN', '1500.00', 300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFLOYb4QCosnAW7hEv6VqwdssGgy49sbfiAQ&s'),
(958, 6, 'Датчик тока ACS758', 'Датчик тока для высокоточных измерений.', 'Тип: ток; Диапазон: ±50 А; Питание: 3.0-5.5 В; Интерфейс: аналоговый; Корпус: CB-5', '350.00', 700, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3VJAlztfArmyMC55RcQqG9AGpG8vbXg6-Eg&s'),
(959, 6, 'Датчик газа MQ-8', 'Датчик для обнаружения водорода.', 'Тип: газ; Диапазон: 100-10000 ppm; Питание: 5 В; Интерфейс: аналоговый; Корпус: модуль', '210.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD4ltqdaGe7rieyC1v0hz91XZtz2xzNvr1mA&s'),
(960, 6, 'Датчик ускорения LIS3DH', '3-осевой акселерометр для носимых устройств.', 'Тип: акселерометр; Диапазон: ±16g; Питание: 1.7-3.6 В; Интерфейс: I2C/SPI; Корпус: LGA', '200.00', 1200, 'https://cdn.compacttool.ru/images/tovar/189_3.jpg'),
(961, 6, 'Датчик температуры SHT31', 'Цифровой датчик температуры и влажности.', 'Тип: влажность/температура; Диапазон: 0-100% RH, -40°C..+125°C; Питание: 2.4-5.5 В; Интерфейс: I2C; Корпус: DFN', '400.00', 600, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtSFAeQTSN30wpXnuTq__-elryCGcL1qEa3g&s'),
(962, 6, 'Датчик магнитного поля DRV5053', 'Линейный датчик Холла для точных измерений.', 'Тип: Холл; Диапазон: ±73 мТ; Питание: 2.5-38 В; Интерфейс: аналоговый; Корпус: SOT-23', '120.00', 1500, 'https://www.promelec.ru/fs/cache/e4/4e/3a/88/4979fb834ac28d248b96ae6c.jpg'),
(963, 6, 'Датчик давления MS5611', 'Высокоточный барометрический датчик.', 'Тип: давление; Диапазон: 10-1200 мбар; Питание: 1.8-3.6 В; Интерфейс: I2C/SPI; Корпус: QFN', '500.00', 500, 'https://robot-kit.ru/wa-data/public/shop/products/76/30/3076/images/10636/RKP-GY-63-MS5611.96x96@2x.jpg'),
(964, 6, 'Датчик освещенности APDS-9960', 'Датчик для жестов, света и расстояния.', 'Тип: освещенность/жесты; Диапазон: 0-1000 лк; Питание: 2.4-3.6 В; Интерфейс: I2C; Корпус: SMD', '300.00', 800, 'https://static.insales-cdn.com/images/products/1/1325/294675757/large_apds-9960.jpg'),
(965, 6, 'Датчик газа MQ-9', 'Датчик для обнаружения угарного газа и метана.', 'Тип: газ; Диапазон: 10-1000 ppm; Питание: 5 В; Интерфейс: аналоговый; Корпус: модуль', '220.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDt4ssaf5zPsgoO7uD-lt8ANcFdJrSQcYdvQ&s'),
(966, 6, 'Датчик температуры BME680', 'Многофункциональный датчик температуры, влажности, давления и газа.', 'Тип: температура/влажность/давление/газ; Диапазон: -40°C..+85°C, 0-100% RH, 300-1100 гПа; Питание: 1.7-3.6 В; Интерфейс: I2C/SPI; Корпус: LGA', '600.00', 500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtSFAeQTSN30wpXnuTq__-elryCGcL1qEa3g&s'),
(967, 6, 'Датчик тока INA226', 'Цифровой датчик тока и мощности.', 'Тип: ток/мощность; Диапазон: ±36 В; Питание: 2.7-5.5 В; Интерфейс: I2C; Корпус: MSOP-10', '280.00', 900, 'https://ae04.alicdn.com/kf/S052a903c2dfb4b708c50a36c825889c2t.jpg_640x640.jpg'),
(968, 6, 'Датчик ускорения MPU-9250', '9-осевой датчик для ориентации и движения.', 'Тип: акселерометр/гироскоп/магнитометр; Диапазон: ±16g, ±2000°/с; Питание: 2.4-3.6 В; Интерфейс: I2C/SPI; Корпус: QFN', '400.00', 600, 'https://robot-kit.ru/wa-data/public/shop/products/21/59/5921/images/23506/GY-9250-MPU-9250-1.970.jpg'),
(969, 6, 'Датчик температуры LM75A', 'Цифровой датчик температуры с интерфейсом I2C.', 'Тип: температурный; Диапазон: -55°C..+125°C; Питание: 2.8-5.5 В; Интерфейс: I2C; Корпус: SOIC-8', '100.00', 1800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmsCIuUibVgYZeLdKAmSkOGEc59m5KaNp8rQ&s'),
(970, 6, 'Датчик магнитного поля MLX90393', '3D магнитометр для высокоточных приложений.', 'Тип: магнитометр; Диапазон: ±50 мТ; Питание: 2.2-3.6 В; Интерфейс: I2C/SPI; Корпус: QFN', '350.00', 700, 'https://ae04.alicdn.com/kf/S8a82876aeffa48e59c35138b404c7300O.jpg'),
(971, 6, 'Датчик давления DPS310', 'Высокоточный барометрический датчик.', 'Тип: давление/температура; Диапазон: 300-1200 гПа; Питание: 1.7-3.6 В; Интерфейс: I2C/SPI; Корпус: LGA', '250.00', 1000, 'https://ae04.alicdn.com/kf/S28cd958406d74d52bcaa52d449a18728P.jpg_480x480.jpg'),
(972, 7, 'Оперативная память DDR4 8GB Kingston Fury Beast', 'Модуль оперативной памяти для настольных ПК с высокой производительностью.', 'Тип: DDR4; Объём: 8 ГБ; Частота: 3200 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '3500.00', 500, 'https://cdn.citilink.ru/YRZ1o9hox0EpDL86OgAZVsWem8lOTV7lVUQrE4UDqYU/resizing_type:fit/gravity:sm/width:400/height:400/plain/product-images/cd10d570-acf2-40ce-a8cd-a4d480b3d502.jpg'),
(973, 7, 'Оперативная память DDR4 16GB Corsair Vengeance LPX', 'Надёжный модуль памяти для игровых систем.', 'Тип: DDR4; Объём: 16 ГБ; Частота: 3600 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '6500.00', 300, 'https://cdn.citilink.ru/h4peSSvrl1JK7LpWa2SbGTHC8t2WrOS3uUqHGt3ZrWs/resizing_type:fit/gravity:sm/width:400/height:400/plain/product-images/e450b46d-a422-4d7c-9357-ed5b6dd2bd04.jpg'),
(974, 7, 'SSD 500GB Samsung 870 EVO', 'Твердотельный накопитель для быстрой загрузки и хранения данных.', 'Тип: SSD; Объём: 500 ГБ; Интерфейс: SATA III; Скорость чтения: 560 МБ/с; Скорость записи: 530 МБ/с', '6000.00', 400, 'https://cdn.idealo.com/folder/Product/201032/8/201032817/s1_produktbild_gross_11/samsung-870-evo-500gb.jpg'),
(975, 7, 'USB флеш-накопитель 64GB SanDisk Ultra', 'Компактный USB-накопитель для передачи данных.', 'Тип: USB Flash; Объём: 64 ГБ; Интерфейс: USB 3.0; Скорость чтения: 130 МБ/с', '1200.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnPHBxQQH-XNSUEOnxkf2Xbs6hQc2kuc8UoA&s'),
(976, 7, 'Оперативная память DDR5 16GB G.Skill Trident Z5', 'Модуль памяти нового поколения для высокопроизводительных ПК.', 'Тип: DDR5; Объём: 16 ГБ; Частота: 6000 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '10000.00', 200, 'https://www.gskill.com/images/products/trident-z5-ddr5.jpg'),
(977, 7, 'SSD 1TB WD Blue SN550', 'NVMe SSD для быстрого доступа к данным.', 'Тип: SSD; Объём: 1 ТБ; Интерфейс: NVMe PCIe 3.0; Скорость чтения: 2400 МБ/с; Скорость записи: 1950 МБ/с', '9000.00', 250, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYZ07HV1Dh2Tm22lVPxFprQ68t4OvmoD3XFQ&s'),
(978, 7, 'Оперативная память DDR4 32GB Crucial Ballistix', 'Модуль памяти для профессиональных задач.', 'Тип: DDR4; Объём: 32 ГБ; Частота: 3200 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '12000.00', 150, 'https://main-cdn.sbermegamarket.ru/big1/hlr-system/-16/922/785/092/151/832/100028102586b0.jpg'),
(979, 7, 'USB флеш-накопитель 128GB Kingston DataTraveler', 'Высокоскоростной USB-накопитель для хранения данных.', 'Тип: USB Flash; Объём: 128 ГБ; Интерфейс: USB 3.2; Скорость чтения: 200 МБ/с', '2000.00', 800, 'https://cdn.citilink.ru/YRZ1o9hox0EpDL86OgAZVsWem8lOTV7lVUQrE4UDqYU/resizing_type:fit/gravity:sm/width:400/height:400/plain/product-images/cd10d570-acf2-40ce-a8cd-a4d480b3d502.jpg'),
(980, 7, 'SSD 250GB Samsung 970 EVO Plus', 'NVMe SSD с высокой скоростью для ПК и ноутбуков.', 'Тип: SSD; Объём: 250 ГБ; Интерфейс: NVMe PCIe 3.0; Скорость чтения: 3500 МБ/с; Скорость записи: 2300 МБ/с', '5000.00', 600, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpkXOvuZ_7Y1Zzz9-mRqLM7rDyoK8n9xgjJF4rQydDyZkh_ifj5GPZtcSXFkPvcKiG&usqp=CAU'),
(981, 7, 'Оперативная память DDR4 8GB HyperX Fury', 'Модуль памяти для игровых и мультимедийных систем.', 'Тип: DDR4; Объём: 8 ГБ; Частота: 2666 МГц; Форм-фактор: DIMM; Напряжение: 1.2 В', '3200.00', 700, 'https://img.mvideo.ru/Pdb/30054402b.jpg'),
(982, 7, 'SSD 2TB Crucial MX500', 'Надёжный SATA SSD для больших объёмов данных.', 'Тип: SSD; Объём: 2 ТБ; Интерфейс: SATA III; Скорость чтения: 560 МБ/с; Скорость записи: 510 МБ/с', '15000.00', 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz2TrLGcEqsmwUQ790dUakVOIk-WxX7RfoPQ&s'),
(983, 7, 'USB флеш-накопитель 32GB Transcend JetFlash', 'Компактный накопитель для повседневного использования.', 'Тип: USB Flash; Объём: 32 ГБ; Интерфейс: USB 3.0; Скорость чтения: 90 МБ/с', '800.00', 1200, 'https://www.transcend-info.com/images/products/jetflash.jpg'),
(984, 7, 'Оперативная память DDR5 32GB Corsair Dominator Platinum', 'Премиальный модуль памяти для энтузиастов.', 'Тип: DDR5; Объём: 32 ГБ; Частота: 5200 МГц; Форм-фактор: DIMM; Напряжение: 1.25 В', '18000.00', 80, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOr4_2XHAkoNFEhqJ-qU0GUd1Ky6d1FAlHbg&s'),
(985, 7, 'SSD 500GB WD Black SN850', 'NVMe SSD для игровых систем с высокой скоростью.', 'Тип: SSD; Объём: 500 ГБ; Интерфейс: NVMe PCIe 4.0; Скорость чтения: 7000 МБ/с; Скорость записи: 5300 МБ/с', '8000.00', 300, 'https://c.dns-shop.ru/thumb/st4/fit/300/300/770b5bc4ef86a458292aafc572ad5b6b/daad62fd8ce992741564421284b19ff0ecff32e558aec919648888cd23984474.jpg'),
(986, 7, 'Оперативная память DDR4 16GB TeamGroup T-Force', 'Модуль памяти с RGB-подсветкой для игровых ПК.', 'Тип: DDR4; Объём: 16 ГБ; Частота: 3600 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '6800.00', 250, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSm5ZLkuUPKfJcvnMTnuKka94gXsB-LFS8PQ&s'),
(987, 7, 'USB флеш-накопитель 256GB SanDisk Extreme Pro', 'Высокоскоростной USB-накопитель для профессионалов.', 'Тип: USB Flash; Объём: 256 ГБ; Интерфейс: USB 3.2; Скорость чтения: 420 МБ/с', '4500.00', 200, 'https://www.sandisk.com/images/products/extreme-pro-usb.jpg'),
(988, 7, 'SSD 1TB Kingston NV2', 'Доступный NVMe SSD для повседневных задач.', 'Тип: SSD; Объём: 1 ТБ; Интерфейс: NVMe PCIe 4.0; Скорость чтения: 3500 МБ/с; Скорость записи: 2800 МБ/с', '8500.00', 350, 'https://www.kingston.com/images/products/nv2.jpg'),
(989, 7, 'Оперативная память DDR4 8GB Patriot Viper Steel', 'Модуль памяти для бюджетных игровых систем.', 'Тип: DDR4; Объём: 8 ГБ; Частота: 3000 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '3400.00', 600, 'https://www.patriotmemory.com/images/products/viper-steel-ddr4.jpg'),
(990, 7, 'SSD 250GB Crucial BX500', 'Бюджетный SATA SSD для базовых задач.', 'Тип: SSD; Объём: 250 ГБ; Интерфейс: SATA III; Скорость чтения: 540 МБ/с; Скорость записи: 500 МБ/с', '3000.00', 800, 'https://www.crucial.com/images/products/bx500.jpg'),
(991, 7, 'USB флеш-накопитель 16GB Kingston DataTraveler Micro', 'Ультракомпактный USB-накопитель.', 'Тип: USB Flash; Объём: 16 ГБ; Интерфейс: USB 3.2; Скорость чтения: 200 МБ/с', '600.00', 1500, 'https://www.kingston.com/images/products/datatraveler-micro.jpg'),
(992, 7, 'Оперативная память DDR5 16GB Kingston Fury Renegade', 'Модуль памяти для высокопроизводительных систем.', 'Тип: DDR5; Объём: 16 ГБ; Частота: 6400 МГц; Форм-фактор: DIMM; Напряжение: 1.4 В', '11000.00', 150, 'https://www.kingston.com/images/products/fury-renegade-ddr5.jpg'),
(993, 7, 'SSD 500GB Samsung 980', 'NVMe SSD для быстрой работы приложений.', 'Тип: SSD; Объём: 500 ГБ; Интерфейс: NVMe PCIe 3.0; Скорость чтения: 3500 МБ/с; Скорость записи: 3000 МБ/с', '6500.00', 400, 'https://www.samsung.com/images/products/980.jpg'),
(994, 7, 'Оперативная память DDR4 16GB ADATA XPG Spectrix', 'Модуль памяти с RGB-подсветкой.', 'Тип: DDR4; Объём: 16 ГБ; Частота: 3200 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '6700.00', 300, 'https://www.adata.com/images/products/xpg-spectrix-ddr4.jpg'),
(995, 7, 'USB флеш-накопитель 64GB Transcend JetFlash 790', 'Сдвижной USB-накопитель для удобства.', 'Тип: USB Flash; Объём: 64 ГБ; Интерфейс: USB 3.0; Скорость чтения: 90 МБ/с', '1000.00', 1000, 'https://www.transcend-info.com/images/products/jetflash-790.jpg'),
(996, 7, 'SSD 1TB WD Green SN350', 'NVMe SSD для повседневного использования.', 'Тип: SSD; Объём: 1 ТБ; Интерфейс: NVMe PCIe 3.0; Скорость чтения: 2400 МБ/с; Скорость записи: 1900 МБ/с', '8000.00', 350, 'https://www.westerndigital.com/images/products/wd-green-sn350.jpg'),
(997, 7, 'Оперативная память DDR4 32GB Corsair Vengeance RGB Pro', 'Модуль памяти с настраиваемой подсветкой.', 'Тип: DDR4; Объём: 32 ГБ; Частота: 3600 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '13000.00', 100, 'https://www.corsair.com/images/products/vengeance-rgb-pro-ddr4.jpg'),
(998, 7, 'SSD 500GB Kingston A2000', 'NVMe SSD для оптимальной производительности.', 'Тип: SSD; Объём: 500 ГБ; Интерфейс: NVMe PCIe 3.0; Скорость чтения: 2200 МБ/с; Скорость записи: 2000 МБ/с', '5500.00', 500, 'https://www.kingston.com/images/products/a2000.jpg'),
(999, 7, 'USB флеш-накопитель 128GB SanDisk Ultra Fit', 'Миниатюрный USB-накопитель для ноутбуков.', 'Тип: USB Flash; Объём: 128 ГБ; Интерфейс: USB 3.1; Скорость чтения: 130 МБ/с', '1800.00', 900, 'https://www.sandisk.com/images/products/ultra-fit.jpg'),
(1000, 7, 'Оперативная память DDR5 16GB Crucial Pro', 'Модуль памяти для профессиональных ПК.', 'Тип: DDR5; Объём: 16 ГБ; Частота: 5600 МГц; Форм-фактор: DIMM; Напряжение: 1.25 В', '9500.00', 200, 'https://www.crucial.com/images/products/crucial-pro-ddr5.jpg'),
(1001, 7, 'SSD 2TB Samsung 870 QVO', 'SATA SSD для хранения больших объёмов данных.', 'Тип: SSD; Объём: 2 ТБ; Интерфейс: SATA III; Скорость чтения: 560 МБ/с; Скорость записи: 530 МБ/с', '16000.00', 80, 'https://www.samsung.com/images/products/870-qvo.jpg'),
(1002, 7, 'Оперативная память DDR4 8GB TeamGroup Elite', 'Бюджетный модуль памяти для офисных ПК.', 'Тип: DDR4; Объём: 8 ГБ; Частота: 2666 МГц; Форм-фактор: DIMM; Напряжение: 1.2 В', '3000.00', 800, 'https://www.teamgroupinc.com/images/products/elite-ddr4.jpg'),
(1003, 7, 'USB флеш-накопитель 32GB Kingston DataTraveler Exodia', 'Прочный USB-накопитель с защитным колпачком.', 'Тип: USB Flash; Объём: 32 ГБ; Интерфейс: USB 3.2; Скорость чтения: 100 МБ/с', '700.00', 1200, 'https://www.kingston.com/images/products/datatraveler-exodia.jpg'),
(1004, 7, 'SSD 500GB Crucial P3', 'NVMe SSD для повседневных задач.', 'Тип: SSD; Объём: 500 ГБ; Интерфейс: NVMe PCIe 3.0; Скорость чтения: 3500 МБ/с; Скорость записи: 3000 МБ/с', '6000.00', 400, 'https://www.crucial.com/images/products/p3.jpg'),
(1005, 7, 'Оперативная память DDR4 16GB Patriot Signature', 'Модуль памяти для универсальных систем.', 'Тип: DDR4; Объём: 16 ГБ; Частота: 3200 МГц; Форм-фактор: DIMM; Напряжение: 1.2 В', '6200.00', 350, 'https://www.patriotmemory.com/images/products/signature-ddr4.jpg'),
(1006, 7, 'SSD 1TB Samsung 990 PRO', 'NVMe SSD для профессиональных задач.', 'Тип: SSD; Объём: 1 ТБ; Интерфейс: NVMe PCIe 4.0; Скорость чтения: 7450 МБ/с; Скорость записи: 6900 МБ/с', '12000.00', 200, 'https://www.samsung.com/images/products/990-pro.jpg'),
(1007, 7, 'USB флеш-накопитель 64GB Samsung BAR Plus', 'Металлический USB-накопитель с высокой скоростью.', 'Тип: USB Flash; Объём: 64 ГБ; Интерфейс: USB 3.1; Скорость чтения: 300 МБ/с', '1500.00', 800, 'https://www.samsung.com/images/products/bar-plus.jpg'),
(1008, 7, 'Оперативная память DDR5 32GB G.Skill Ripjaws S5', 'Модуль памяти для игровых и рабочих станций.', 'Тип: DDR5; Объём: 32 ГБ; Частота: 6000 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '17000.00', 100, 'https://www.gskill.com/images/products/ripjaws-s5-ddr5.jpg'),
(1009, 7, 'SSD 500GB WD Blue SA510', 'SATA SSD для ноутбуков и ПК.', 'Тип: SSD; Объём: 500 ГБ; Интерфейс: SATA III; Скорость чтения: 560 МБ/с; Скорость записи: 510 МБ/с', '5800.00', 450, 'https://www.westerndigital.com/images/products/wd-blue-sa510.jpg'),
(1010, 7, 'Оперативная память DDR4 8GB ADATA Premier', 'Бюджетный модуль памяти для ноутбуков.', 'Тип: DDR4; Объём: 8 ГБ; Частота: 2666 МГц; Форм-фактор: SO-DIMM; Напряжение: 1.2 В', '3100.00', 700, 'https://www.adata.com/images/products/premier-ddr4.jpg'),
(1011, 7, 'USB флеш-накопитель 256GB Kingston DataTraveler Max', 'Высокоскоростной USB-накопитель с Type-C.', 'Тип: USB Flash; Объём: 256 ГБ; Интерфейс: USB 3.2 Type-C; Скорость чтения: 1000 МБ/с', '5000.00', 150, 'https://www.kingston.com/images/products/datatraveler-max.jpg'),
(1012, 7, 'SSD 1TB Crucial P3 Plus', 'NVMe SSD для высокоскоростных задач.', 'Тип: SSD; Объём: 1 ТБ; Интерфейс: NVMe PCIe 4.0; Скорость чтения: 5000 МБ/с; Скорость записи: 4200 МБ/с', '9000.00', 300, 'https://www.crucial.com/images/products/p3-plus.jpg'),
(1013, 7, 'Оперативная память DDR4 16GB Kingston ValueRAM', 'Модуль памяти для серверов и рабочих станций.', 'Тип: DDR4; Объём: 16 ГБ; Частота: 2666 МГц; Форм-фактор: DIMM; Напряжение: 1.2 В', '6000.00', 400, 'https://www.kingston.com/images/products/valueram-ddr4.jpg'),
(1014, 7, 'SSD 250GB Samsung 860 EVO', 'SATA SSD для надёжного хранения данных.', 'Тип: SSD; Объём: 250 ГБ; Интерфейс: SATA III; Скорость чтения: 550 МБ/с; Скорость записи: 520 МБ/с', '4000.00', 600, 'https://www.samsung.com/images/products/860-evo.jpg'),
(1015, 7, 'USB флеш-накопитель 128GB Transcend JetFlash 920', 'Прочный USB-накопитель с высокой скоростью.', 'Тип: USB Flash; Объём: 128 ГБ; Интерфейс: USB 3.2; Скорость чтения: 420 МБ/с', '2200.00', 700, 'https://www.transcend-info.com/images/products/jetflash-920.jpg'),
(1016, 7, 'Оперативная память DDR5 16GB TeamGroup Delta RGB', 'Модуль памяти с RGB-подсветкой.', 'Тип: DDR5; Объём: 16 ГБ; Частота: 6200 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '10500.00', 200, 'https://www.teamgroupinc.com/images/products/delta-rgb-ddr5.jpg'),
(1017, 7, 'SSD 500GB Kingston KC3000', 'NVMe SSD для профессиональных приложений.', 'Тип: SSD; Объём: 500 ГБ; Интерфейс: NVMe PCIe 4.0; Скорость чтения: 7000 МБ/с; Скорость записи: 3900 МБ/с', '7500.00', 350, 'https://www.kingston.com/images/products/kc3000.jpg'),
(1018, 7, 'Оперативная память DDR4 32GB Patriot Viper Elite II', 'Модуль памяти для многозадачных систем.', 'Тип: DDR4; Объём: 32 ГБ; Частота: 3600 МГц; Форм-фактор: DIMM; Напряжение: 1.35 В', '12500.00', 120, 'https://www.patriotmemory.com/images/products/viper-elite-ii-ddr4.jpg'),
(1019, 7, 'USB флеш-накопитель 64GB SanDisk Ultra Luxe', 'Стильный металлический USB-накопитель.', 'Тип: USB Flash; Объём: 64 ГБ; Интерфейс: USB 3.2; Скорость чтения: 150 МБ/с', '1300.00', 900, 'https://www.sandisk.com/images/products/ultra-luxe.jpg'),
(1020, 8, 'Разъём USB Type-A Male', 'Надёжный USB разъём для подключения периферийных устройств.', 'Тип: USB Type-A; Контакты: 4; Ток: 1.5 А; Напряжение: 5 В; Корпус: пластик/металл', '25.00', 5000, 'https://voltiq.ru/wp-content/uploads/usb-male-connector-with-plastic-cover-2.jpg'),
(1021, 8, 'Разъём USB Type-C Female', 'Универсальный разъём для современных устройств с поддержкой быстрой зарядки.', 'Тип: USB Type-C; Контакты: 24; Ток: 3 А; Напряжение: 20 В; Корпус: SMD', '50.00', 3000, 'https://voltiq.ru/wp-content/uploads/usb-type-c-female-4-pin-connector-00.jpg'),
(1022, 8, 'Разъём RJ45 Male', 'Сетевой разъём для подключения витой пары в компьютерных сетях.', 'Тип: RJ45; Контакты: 8; Категория: Cat5e; Корпус: пластик; Экранирование: нет', '30.00', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbv7thhEZKKSERDNnDoMz3Ej1ATAsUmT2UQ&s'),
(1023, 8, 'Разъём Mini USB Female', 'Компактный разъём для портативных устройств.', 'Тип: Mini USB; Контакты: 5; Ток: 1 А; Напряжение: 5 В; Корпус: SMD', '20.00', 4500, 'https://voltiq.ru/wp-content/uploads/mini-usb-type-b-0-720x720.jpg'),
(1024, 8, 'Разъём Micro USB Female', 'Широко используемый разъём для зарядки и передачи данных.', 'Тип: Micro USB; Контакты: 5; Ток: 1.8 А; Напряжение: 5 В; Корпус: SMD', '22.00', 4500, 'https://roboshop.spb.ru/image/cache/catalog/micro-usb-5SDIP-800x800.jpg'),
(1025, 8, 'Разъём DB9 Male', 'Серийный разъём для промышленных и коммуникационных устройств.', 'Тип: DB9; Контакты: 9; Ток: 5 А; Напряжение: 300 В; Корпус: металлический', '60.00', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbGxAA8-GIySefhUoO1B4mcCFgZMa4Q3jrkg&s'),
(1026, 8, 'Разъём DB25 Female', 'Разъём для параллельных портов и промышленного оборудования.', 'Тип: DB25; Контакты: 25; Ток: 5 А; Напряжение: 300 В; Корпус: металлический', '80.00', 1500, 'https://img.audiomania.ru/pics/goods/big/supra_db25_female1.jpg'),
(1027, 8, 'Разъём HDMI Female', 'Разъём для передачи аудио- и видеосигналов высокого качества.', 'Тип: HDMI; Контакты: 19; Версия: 2.0; Корпус: SMD; Экранирование: да', '100.00', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8U5mX-Smy47MWkGJbKX_7IY2Exa3cn9H-Q&s'),
(1028, 8, 'Разъём Jack 3.5 мм Stereo', 'Аудиоразъём для наушников и микрофонов.', 'Тип: Jack 3.5 мм; Контакты: 3; Ток: 1 А; Напряжение: 12 В; Корпус: пластик', '35.00', 3500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU9Sys-Lo-MOyci3x9C8AWzn7u2a2nq5xVyg&s'),
(1029, 8, 'Разъём Molex Mini-Fit Jr.', 'Разъём питания для материнских плат и периферии.', 'Тип: Molex Mini-Fit Jr.; Контакты: 4; Ток: 9 А; Напряжение: 600 В; Корпус: пластик', '45.00', 3000, 'https://image.made-in-china.com/2f0j00kzsftwdgLWom/Molex-Mini-Fit-Jr-39-01-4031-5557-Series-2-3-4-6-8-Pin-Connector-Wire-Harness.webp'),
(1030, 8, 'Разъём Phoenix Contact MSTB 2.5', 'Клеммный разъём для промышленных приложений.', 'Тип: клеммный; Контакты: 2; Ток: 12 А; Напряжение: 320 В; Корпус: пластик', '70.00', 2000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb9HNF040HAx0uprJCNryJBr53y9IKLwyGOQ&s'),
(1031, 8, 'Разъём D-Sub VGA Female', 'Разъём для подключения мониторов и проекторов.', 'Тип: VGA; Контакты: 15; Ток: 3 А; Напряжение: 300 В; Корпус: металлический', '65.00', 1800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ZQo_hV5adA40HMZDlabObgjnKQp5nimlxw&s'),
(1032, 8, 'Разъём SMA Male', 'Радиочастотный разъём для антенн и коаксиальных кабелей.', 'Тип: SMA; Контакты: 1; Частота: до 18 ГГц; Импеданс: 50 Ом; Корпус: металл', '120.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBr9CN0eHhU09cnfSUUAUBKsmmIXrmFFZtEg&s'),
(1033, 8, 'Разъём BNC Male', 'Коаксиальный разъём для видеосигналов и RF-оборудования.', 'Тип: BNC; Контакты: 2; Частота: до 4 ГГц; Импеданс: 75 Ом; Корпус: металл', '80.00', 1500, 'https://kzn-gps.ru/uploads/product/3700/3719/BNC(male)_2018-09-16_05-27-03.jpg'),
(1034, 8, 'Разъём RJ11 Male', 'Телефонный разъём для подключения аналоговых линий.', 'Тип: RJ11; Контакты: 4; Категория: телефонный; Корпус: пластик; Экранирование: нет', '25.00', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH3ODkmQe4JaXEInhHCxCcF5pYLWwT9CPsng&s'),
(1035, 8, 'Разъём Molex ATX 24-pin', 'Разъём питания для материнских плат.', 'Тип: ATX; Контакты: 24; Ток: 6 А; Напряжение: 250 В; Корпус: пластик', '150.00', 800, 'https://s.alicdn.com/@sc04/kf/Hb5c4d29ed97344fdb287de049012570fX.jpg_720x720q50.jpg');
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `specifications`, `price`, `quantity`, `image_url`) VALUES
(1036, 8, 'Разъём DIN 5-pin Male', 'Разъём для MIDI-устройств и аудиооборудования.', 'Тип: DIN; Контакты: 5; Ток: 2 А; Напряжение: 100 В; Корпус: пластик', '40.00', 3000, 'https://ir.ozone.ru/s3/multimedia-9/c1000/6787393245.jpg'),
(1037, 8, 'Разъём XLR 3-pin Female', 'Профессиональный аудиоразъём для микрофонов.', 'Тип: XLR; Контакты: 3; Ток: 16 А; Напряжение: 50 В; Корпус: металл', '200.00', 600, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoWKgPs9Gtt1D8QKOSUnnLh1tHTCn-Z3gYuA&s'),
(1038, 8, 'Разъём Molex Micro-Fit 3.0', 'Компактный разъём питания для электроники.', 'Тип: Micro-Fit; Контакты: 4; Ток: 8.5 А; Напряжение: 600 В; Корпус: пластик', '55.00', 2500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb60m5NyZJhhkmqzkhO35phQU-Zd0rtqPvpg&s'),
(1039, 8, 'Разъём Phoenix Contact Combicon 5.08', 'Клеммный разъём для модульного оборудования.', 'Тип: клеммный; Контакты: 3; Ток: 12 А; Напряжение: 400 В; Корпус: пластик', '90.00', 1500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaxbju7fEH9WXg8k6P97uDIThNtK4c-BI70g&s'),
(1040, 8, 'Разъём USB Type-B Male', 'Разъём для принтеров и внешних устройств.', 'Тип: USB Type-B; Контакты: 4; Ток: 1.5 А; Напряжение: 5 В; Корпус: пластик', '30.00', 4000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2CfO9wgNBM5P3CoLJ9KUnVtExaMSXHghsFQ&s'),
(1041, 8, 'Разъём RCA Male', 'Аудио-видео разъём для бытовой техники.', 'Тип: RCA; Контакты: 2; Ток: 1 А; Напряжение: 50 В; Корпус: пластик/металл', '35.00', 3500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzSx3U6Z93FKh9oTgMKyvs_f728LO7vzJ5zQ&s'),
(1042, 8, 'Разъём Molex Mini-SPOX', 'Миниатюрный разъём для компактных устройств.', 'Тип: Mini-SPOX; Контакты: 3; Ток: 3 А; Напряжение: 250 В; Корпус: пластик', '40.00', 3000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUz6kwQDdyDHUXbMGIOaTN0IWl1Z2KHQ127w&s'),
(1043, 8, 'Разъём DVI-D Female', 'Разъём для цифровых видеосигналов.', 'Тип: DVI-D; Контакты: 24; Версия: Dual Link; Корпус: металлический; Экранирование: да', '120.00', 1000, 'https://www.elecbee.com/image/cache/catalog/Connectors/D-shaped-Connector/DVI-Connectors/dvi-d-241-pin-connector-female-straight-though-hole-for-pcb-mount-1018-0-500x500.jpg'),
(1044, 8, 'Разъём F-Type Male', 'Коаксиальный разъём для кабельного ТВ.', 'Тип: F-Type; Контакты: 1; Частота: до 3 ГГц; Импеданс: 75 Ом; Корпус: металл', '50.00', 2500, 'https://bezlimitik.ru/wp-content/uploads/2025/03/fmale_rg-6u_sat-703.webp'),
(1045, 8, 'Разъём Molex Mini-Latch', 'Разъём для соединения проводов в электронике.', 'Тип: Mini-Latch; Контакты: 2; Ток: 3 А; Напряжение: 250 В; Корпус: пластик', '35.00', 3500, 'https://rs-catalog.ru/images/thumbnails/400/400/detailed/270/6877235.jpg'),
(1046, 8, 'Разъём Phoenix Contact MC 1.5', 'Компактный клеммный разъём для автоматизации.', 'Тип: клеммный; Контакты: 4; Ток: 8 А; Напряжение: 160 В; Корпус: пластик', '85.00', 1800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVvZU9aw1-4A5l9W4D_jz3KfK81LrA_iIBHw&s'),
(1047, 8, 'Разъём Molex Mini-Fit Sigma', 'Разъём питания с повышенной надёжностью.', 'Тип: Mini-Fit Sigma; Контакты: 6; Ток: 9 А; Напряжение: 600 В; Корпус: пластик', '60.00', 2000, 'https://static.chipdip.ru/lib/881/DOC034881430.jpg'),
(1048, 8, 'Разъём SMA Female', 'Радиочастотный разъём для антенн.', 'Тип: SMA; Контакты: 1; Частота: до 18 ГГц; Импеданс: 50 Ом; Корпус: металл', '130.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZVkqTX79PKM_kZGhOkK19fhtaWvN_6VvUeA&s'),
(1049, 8, 'Разъём Molex Mini-Fit Max', 'Высокотоковый разъём для силовых цепей.', 'Тип: Mini-Fit Max; Контакты: 4; Ток: 12 А; Напряжение: 600 В; Корпус: пластик', '70.00', 1800, 'https://s.alicdn.com/@sc04/kf/Hbc569baa3c784d63bafaccb8bac746aau.jpg_720x720q50.jpg'),
(1050, 8, 'Разъём Molex Mini-Lock', 'Разъём для проводов с фиксацией.', 'Тип: Mini-Lock; Контакты: 3; Ток: 3 А; Напряжение: 250 В; Корпус: пластик', '45.00', 3000, 'https://www.molex.com/images/products/mini-lock.jpg'),
(1051, 8, 'Разъём Phoenix Contact PC 4', 'Клеммный разъём для силовых приложений.', 'Тип: клеммный; Контакты: 2; Ток: 20 А; Напряжение: 800 В; Корпус: пластик', '100.00', 1500, 'https://bezlimitik.ru/wp-content/uploads/2025/03/fmale_rg-6u_sat-703.webp'),
(1052, 8, 'Разъём Molex Mini-Fit TPA', 'Разъём с защитой от случайного отключения.', 'Тип: Mini-Fit TPA; Контакты: 4; Ток: 9 А; Напряжение: 600 В; Корпус: пластик', '65.00', 2000, 'https://static.chipdip.ru/lib/544/DOC005544899.jpg'),
(1053, 8, 'Разъём Molex Mini-Fit Blind Mate', 'Разъём для скрытого монтажа.', 'Тип: Mini-Fit Blind Mate; Контакты: 4; Ток: 9 А; Напряжение: 600 В; Корпус: пластик', '75.00', 1800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjD7ZVfGMwDKSGBg5ow2HCA7oWzB0meb3TcQ&s'),
(1054, 8, 'Разъём Molex Mini-Fit Sr.', 'Высокотоковый разъём для силовых систем.', 'Тип: Mini-Fit Sr.; Контакты: 2; Ток: 50 А; Напряжение: 600 В; Корпус: пластик', '150.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlFYE3stohY_KM6fYrpudgIHiEb2wP_4354A&s'),
(1055, 8, 'Разъём Molex Mini-Fit Plus', 'Улучшенный разъём для высокоточных соединений.', 'Тип: Mini-Fit Plus; Контакты: 4; Ток: 13 А; Напряжение: 600 В; Корпус: пластик', '80.00', 1500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNqvxflFwUeHm14IvW2Zoy6LLJDXk-qDhqNg&s'),
(1056, 8, 'Разъём Molex Mini-Fit HCS', 'Разъём для высокоточных силовых цепей.', 'Тип: Mini-Fit HCS; Контакты: 4; Ток: 11 А; Напряжение: 600 В; Корпус: пластик', '70.00', 1800, 'https://definum.ru/system/files/imagecache/product_full/products/molex-3901-2040-mf-2x2f-mini-fit-jr-housing.jpg'),
(1057, 8, 'Разъём Molex Mini-Fit RTC', 'Разъём для высокотемпературных приложений.', 'Тип: Mini-Fit RTC; Контакты: 4; Ток: 9 А; Напряжение: 600 В; Корпус: пластик', '90.00', 1500, 'https://static.chipdip.ru/lib/546/DOC049546444.jpg'),
(1058, 8, 'Разъём Molex Mini-Fit Clip', 'Разъём с клипсовым креплением для надёжности.', 'Тип: Mini-Fit Clip; Контакты: 4; Ток: 9 А; Напряжение: 600 В; Корпус: пластик', '85.00', 1500, 'https://ir.ozone.ru/s3/multimedia-o/c1000/6366185220.jpg'),
(1059, 8, 'Разъём Phoenix Contact GMSTB 2.5', 'Клеммный разъём для промышленной автоматизации.', 'Тип: клеммный; Контакты: 2; Ток: 12 А; Напряжение: 400 В; Корпус: пластик', '95.00', 1500, 'https://ir.ozone.ru/s3/multimedia-1-3/c1000/6995685567.jpg'),
(1060, 9, 'Однослойная плата FR4 100x100 мм', 'Однослойная печатная плата для простых электронных проектов.', 'Материал: FR4; Слои: 1; Размер: 100x100 мм; Толщина: 1.6 мм; Покрытие: HASL', '150.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSubWqPfeX-hjgymVbntsBaenTPFvEHh6dDng&s'),
(1061, 9, 'Двухслойная плата FR4 150x100 мм', 'Двухслойная плата для сложных схем с высокой плотностью компонентов.', 'Материал: FR4; Слои: 2; Размер: 150x100 мм; Толщина: 1.6 мм; Покрытие: ENIG', '300.00', 800, 'https://ae04.alicdn.com/kf/S28358cbcc7e9450ba48ad98fd2d58edfS.jpg_480x480.jpg'),
(1062, 9, 'Многослойная плата FR4 4 слоя 200x150 мм', 'Четырёхслойная плата для профессиональных электронных устройств.', 'Материал: FR4; Слои: 4; Размер: 200x150 мм; Толщина: 1.6 мм; Покрытие: ENIG', '600.00', 500, 'https://www.ipcb.com/public/upload/image/20220115/8a34ccb8ff4e98c2cab86358f0c9707a.jpg'),
(1063, 9, 'Однослойная плата CEM-1 50x50 мм', 'Компактная однослойная плата для недорогих проектов.', 'Материал: CEM-1; Слои: 1; Размер: 50x50 мм; Толщина: 1.0 мм; Покрытие: HASL', '80.00', 1500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9MWlN687Tc712QwYn5uS4MrJM-APP8wO7Hg&s'),
(1064, 9, 'Двухслойная плата FR4 100x50 мм', 'Двухслойная плата для компактных электронных модулей.', 'Материал: FR4; Слои: 2; Размер: 100x50 мм; Толщина: 1.6 мм; Покрытие: HASL', '200.00', 1000, 'https://cdnus.globalso.com/fastlinepcb/1.1.png'),
(1065, 9, 'Алюминиевая плата 100x100 мм', 'Плата на алюминиевой основе для светодиодных приложений.', 'Материал: алюминий; Слои: 1; Размер: 100x100 мм; Толщина: 1.6 мм; Покрытие: HASL', '400.00', 600, 'https://ae04.alicdn.com/kf/S642bbaf63bb045c8a209c7f042cd2dbe8.png_480x480.png'),
(1066, 9, 'Многослойная плата FR4 6 слоев 150x150 мм', 'Шестислойная плата для высокотехнологичных устройств.', 'Материал: FR4; Слои: 6; Размер: 150x150 мм; Толщина: 1.6 мм; Покрытие: ENIG', '900.00', 300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIsqS5HD-JUhbO3B9y09ahvHKcj75pxAlKHA&s'),
(1067, 9, 'Однослойная плата FR2 80x80 мм', 'Экономичная однослойная плата для простых схем.', 'Материал: FR2; Слои: 1; Размер: 80x80 мм; Толщина: 1.0 мм; Покрытие: OSP', '100.00', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ1LfP08uGXAYLBsNnCy_sqw_HKOqvTYpOJw&s'),
(1068, 9, 'Двухслойная плата High Tg FR4 120x80 мм', 'Плата с повышенной термостойкостью для надёжных приложений.', 'Материал: High Tg FR4; Слои: 2; Размер: 120x80 мм; Толщина: 1.6 мм; Покрытие: ENIG', '350.00', 700, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbjNYBvrLb9PgTfUr5_CYx3KYSXXoDSu9cpA&s'),
(1069, 9, 'Многослойная плата FR4 8 слоев 200x200 мм', 'Восьмислойная плата для сложных электронных систем.', 'Материал: FR4; Слои: 8; Размер: 200x200 мм; Толщина: 1.6 мм; Покрытие: ENIG', '1200.00', 200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2D8GdOi7gFdC6n_4h9CWFKp6AMFfL_8-u0g&s'),
(1070, 9, 'Однослойная плата FR4 200x100 мм', 'Однослойная плата для прототипирования крупных схем.', 'Материал: FR4; Слои: 1; Размер: 200x100 мм; Толщина: 1.6 мм; Покрытие: HASL', '250.00', 800, 'https://ae04.alicdn.com/kf/Sc7cb89e282af4705af88fbaa81c3d327U.jpg_480x480.jpg'),
(1071, 9, 'Двухслойная плата FR4 80x60 мм', 'Компактная двухслойная плата для носимых устройств.', 'Материал: FR4; Слои: 2; Размер: 80x60 мм; Толщина: 0.8 мм; Покрытие: HASL', '180.00', 1000, 'https://cdnus.globalso.com/fastlinepcb/1.1.png'),
(1072, 9, 'Алюминиевая плата 150x100 мм', 'Алюминиевая плата для высокомощных светодиодов.', 'Материал: алюминий; Слои: 1; Размер: 150x100 мм; Толщина: 2.0 мм; Покрытие: HASL', '500.00', 500, 'https://ae04.alicdn.com/kf/S0aad0971e2f2448ba056c41fc159b502H.png_480x480.png'),
(1073, 9, 'Многослойная плата FR4 4 слоя 100x100 мм', 'Четырёхслойная плата для компактных сложных схем.', 'Материал: FR4; Слои: 4; Размер: 100x100 мм; Толщина: 1.6 мм; Покрытие: ENIG', '550.00', 600, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaeDHQkwjIpMbQW7z_kuA1Hzd5R-DHkJF4bA&s'),
(1074, 9, 'Однослойная плата CEM-3 100x80 мм', 'Однослойная плата для недорогих электронных устройств.', 'Материал: CEM-3; Слои: 1; Размер: 100x80 мм; Толщина: 1.6 мм; Покрытие: HASL', '120.00', 1200, 'https://www.pcbtok.com/wp-content/uploads/2022/06/Rigid-CEM-3-PCB.jpg'),
(1075, 9, 'Двухслойная плата FR4 200x150 мм', 'Двухслойная плата для крупных электронных проектов.', 'Материал: FR4; Слои: 2; Размер: 200x150 мм; Толщина: 1.6 мм; Покрытие: HASL', '400.00', 600, 'https://ae04.alicdn.com/kf/S0fac079d669d4af18f6f17ae2e414158y.jpg_480x480.jpg'),
(1076, 9, 'Многослойная плата Rogers 4 слоя 100x100 мм', 'Плата на основе Rogers для высокочастотных приложений.', 'Материал: Rogers; Слои: 4; Размер: 100x100 мм; Толщина: 1.6 мм; Покрытие: ENIG', '1000.00', 300, 'https://image.made-in-china.com/2f0j00RIMYSTAdLykW/2-4-Layers-Rogers-5880-PCB-with-PCB-Assembly-Service.webp'),
(1077, 9, 'Однослойная плата FR4 50x50 мм', 'Миниатюрная однослойная плата для простых схем.', 'Материал: FR4; Слои: 1; Размер: 50x50 мм; Толщина: 1.0 мм; Покрытие: OSP', '90.00', 1500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkLLp2H1kiYvr_tpdeuRcNRgk7oi92Q6fJmA&s'),
(1078, 9, 'Двухслойная плата FR4 120x120 мм', 'Двухслойная плата для универсальных электронных проектов.', 'Материал: FR4; Слои: 2; Размер: 120x120 мм; Толщина: 1.6 мм; Покрытие: ENIG', '320.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr_asMElpacTxYZwly-5P7mqlM9cjovAtjTQ&s'),
(1079, 9, 'Многослойная плата FR4 6 слоев 100x80 мм', 'Шестислойная плата для компактных высокотехнологичных устройств.', 'Материал: FR4; Слои: 6; Размер: 100x80 мм; Толщина: 1.6 мм; Покрытие: ENIG', '850.00', 400, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlmC7E3Zx_9mXvaf2jhZC9sJsse8f-G1G8ug&s'),
(1080, 9, 'Алюминиевая плата 80x80 мм', 'Плата на алюминиевой основе для теплоотвода.', 'Материал: алюминий; Слои: 1; Размер: 80x80 мм; Толщина: 1.6 мм; Покрытие: HASL', '350.00', 700, 'https://cdn.prodiel.ru/images/tovar/679_1.jpg'),
(1081, 9, 'Однослойная плата FR4 150x100 мм', 'Однослойная плата для прототипов и учебных проектов.', 'Материал: FR4; Слои: 1; Размер: 150x100 мм; Толщина: 1.6 мм; Покрытие: HASL', '200.00', 1000, 'https://www.ipcb.com/public/upload/image/20220115/b4ecb9eae2e0d768974067280e5a81b5.jpg'),
(1082, 9, 'Двухслойная плата High Tg FR4 100x100 мм', 'Плата с высокой термостойкостью для надёжных схем.', 'Материал: High Tg FR4; Слои: 2; Размер: 100x100 мм; Толщина: 1.6 мм; Покрытие: ENIG', '340.00', 800, 'https://image.made-in-china.com/202f0j00NeIbRvQgbqkW/Quality-Fr4-High-Tg-OEM-ODM-Shenzhen-Trusted-Professional-Top-Quality-Custom-PCB-Circuit-Board.webp'),
(1083, 9, 'Многослойная плата FR4 4 слоя 80x80 мм', 'Четырёхслойная плата для компактных устройств.', 'Материал: FR4; Слои: 4; Размер: 80x80 мм; Толщина: 1.6 мм; Покрытие: ENIG', '500.00', 600, 'https://image.made-in-china.com/202f0j00NKRWDoYqHizP/Multilayer-PCB-Circuit-Board-Fr4-PCB-Printed-Circuit-Board-Motherboard-HDI-PCB-PCB-Board-Half-Pth-0-4mm.webp'),
(1084, 9, 'Однослойная плата CEM-1 120x80 мм', 'Экономичная однослойная плата для массового производства.', 'Материал: CEM-1; Слои: 1; Размер: 120x80 мм; Толщина: 1.6 мм; Покрытие: HASL', '130.00', 1200, 'https://www.pcbtok.com/wp-content/uploads/2022/06/Medical-Equipment-CEM-1-PCB.jpg'),
(1085, 9, 'Двухслойная плата FR4 50x50 мм', 'Миниатюрная двухслойная плата для компактных схем.', 'Материал: FR4; Слои: 2; Размер: 50x50 мм; Толщина: 0.8 мм; Покрытие: HASL', '160.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3fxEbgRXHC0-yUK33O7FUvL3-BRhpBcStMA&s'),
(1086, 9, 'Многослойная плата FR4 8 слоев 150x100 мм', 'Восьмислойная плата для сложных высокоточных систем.', 'Материал: FR4; Слои: 8; Размер: 150x100 мм; Толщина: 1.6 мм; Покрытие: ENIG', '1100.00', 250, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUB8HzG7v4P25TTShj2Ey19f7FQWc6W06Fbw&s'),
(1087, 9, 'Алюминиевая плата 200x150 мм', 'Алюминиевая плата для мощных светодиодных систем.', 'Материал: алюминий; Слои: 1; Размер: 200x150 мм; Толщина: 2.0 мм; Покрытие: HASL', '600.00', 400, 'https://st20.stblizko.ru/images/product/676/126/915_medium.jpg'),
(1088, 9, 'Однослойная плата FR4 80x60 мм', 'Однослойная плата для небольших электронных проектов.', 'Материал: FR4; Слои: 1; Размер: 80x60 мм; Толщина: 1.0 мм; Покрытие: OSP', '110.00', 1200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyM7h2Cbz_R0RCbFOAaHF_XlKNbqexw39fSQ&s'),
(1089, 9, 'Двухслойная плата FR4 150x150 мм', 'Двухслойная плата для крупных универсальных схем.', 'Материал: FR4; Слои: 2; Размер: 150x150 мм; Толщина: 1.6 мм; Покрытие: ENIG', '380.00', 700, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK27d-1dI1k2IUNY6Fl5DkE3msOrVMMXjNMQ&s'),
(1090, 10, 'Отвёртка крестовая PH2 Wera', 'Профессиональная отвёртка для точных работ с крестовыми винтами.', 'Тип: крестовая; Профиль: PH2; Длина: 200 мм; Материал: хром-ванадиевая сталь; Рукоятка: эргономичная', '600.00', 500, 'https://www.elite-instrument.ru/upload/iblock/6a2/3s1f0anuqxmdj1gz15zzsli4dxqwtdrj.jpg'),
(1091, 10, 'Плоскогубцы Knipex 180 мм', 'Универсальные плоскогубцы для захвата и резки проводов.', 'Тип: плоскогубцы; Длина: 180 мм; Материал: хром-ванадиевая сталь; Режущая способность: до 2.5 мм', '2000.00', 300, 'https://knipex-pro.ru/image/cache/data/product/knipex/KN-0306180-800x531.jpg'),
(1092, 10, 'Паяльная станция Hakko FX-888D', 'Цифровая паяльная станция для профессиональной пайки.', 'Тип: паяльная станция; Мощность: 70 Вт; Температура: 200-480°C; Наконечник: сменный', '15000.00', 100, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDWpvBDNzGgcJkD9BEQO3ZaNt84AQ_K3klug&s'),
(1093, 10, 'Мультиметр Fluke 117', 'Надёжный мультиметр для измерения напряжения, тока и сопротивления.', 'Тип: мультиметр; Диапазон: 600 В (AC/DC); Точность: 0.5%; Функции: True RMS', '25000.00', 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt7PUD0eMpemPgzj0BaPX4Pbh0-q7WSPsdYw&s'),
(1094, 10, 'Бокорезы для электроники Knipex 125 мм', 'Прецизионные бокорезы для работы с мелкими проводами.', 'Тип: бокорезы; Длина: 125 мм; Материал: хром-ванадиевая сталь; Режущая способность: до 1.6 мм', '2500.00', 400, 'https://cdn.vseinstrumenti.ru/images/goods/ruchnoj-instrument/sharnirno-gubtsevyj-instrument/506158/1200x800/52635298.jpg'),
(1095, 10, 'Отвёртка шлицевая SL5 Wera', 'Отвёртка для винтов с плоским шлицем.', 'Тип: шлицевая; Профиль: SL5; Длина: 200 мм; Материал: хром-ванадиевая сталь; Рукоятка: эргономичная', '500.00', 600, 'https://ir.ozone.ru/s3/multimedia-1-7/c1000/7180114039.jpg'),
(1096, 10, 'Пинцет антистатический ESD-12', 'Антистатический пинцет для работы с мелкими компонентами.', 'Тип: пинцет; Длина: 120 мм; Материал: нержавеющая сталь; Покрытие: антистатическое', '300.00', 800, 'https://ir.ozone.ru/s3/multimedia-y/c1000/6392676658.jpg'),
(1097, 10, 'Стриппер для снятия изоляции Knipex 160 мм', 'Инструмент для аккуратной зачистки проводов.', 'Тип: стриппер; Длина: 160 мм; Диаметр провода: 0.2-6 мм; Материал: хром-ванадиевая сталь', '3500.00', 200, 'https://shop220.ru/images/data/cat/261718_big.jpg'),
(1098, 10, 'Паяльник ZD-30C 40 Вт', 'Компактный паяльник для бытовых и полупрофессиональных работ.', 'Тип: паяльник; Мощность: 40 Вт; Температура: до 400°C; Наконечник: сменный', '800.00', 700, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAwJMI_Vju_BAo2D8ZarZxpIAFN3bsmup3Jg&s'),
(1099, 10, 'Круглогубцы Knipex 130 мм', 'Круглогубцы для работы с проводами и мелкими деталями.', 'Тип: круглогубцы; Длина: 130 мм; Материал: хром-ванадиевая сталь; Диаметр губок: 1.5 мм', '2200.00', 300, 'https://shop220.ru/images/data/cat/262971_big.jpg'),
(1100, 10, 'Набор шестигранников Wera 9 шт.', 'Набор шестигранных ключей для работы с винтами.', 'Тип: шестигранники; Количество: 9 шт.; Размеры: 1.5-10 мм; Материал: хром-ванадиевая сталь', '1500.00', 400, 'https://media.garwin.ru/images/products/53/30/533079d9-2729-4904-85eb-da73d391506c-w488r.jpeg'),
(1101, 10, 'Тестер напряжения Fluke T150', 'Контактный тестер для проверки напряжения и целостности цепи.', 'Тип: тестер; Диапазон: 12-690 В; Функции: индикация, фонарик; Корпус: ударопрочный', '10000.00', 100, 'https://fluke-russia.ru/upload/resize_cache/iblock/0de/220_200_1/0de64a4f92af65ff7998a68e4056afcd.jpg'),
(1102, 10, 'Паяльная лента 2 мм', 'Лента для удаления припоя с печатных плат.', 'Тип: паяльная лента; Ширина: 2 мм; Длина: 1.5 м; Материал: медь', '200.00', 1000, 'https://nsk.mc-e.ru/image/cache/catalog/pripoy/25475-800x800.png'),
(1103, 10, 'Набор отвёрток диэлектрических Wera 6 шт.', 'Набор отвёрток для работы под напряжением до 1000 В.', 'Тип: отвёртки; Количество: 6 шт.; Профили: PH1, PH2, SL3, SL4; Материал: хром-ванадиевая сталь', '4000.00', 200, 'https://ae04.alicdn.com/kf/A4155954c0c754b5bac496310a688704dR.jpeg'),
(1104, 10, 'Плоскогубцы для электроники Knipex 115 мм', 'Прецизионные плоскогубцы для мелких работ.', 'Тип: плоскогубцы; Длина: 115 мм; Материал: хром-ванадиевая сталь; Губки: гладкие', '2800.00', 300, 'https://tools-markets.ru/image/cache/data/5/Ploskogubcy_zahvatnye_dlja_jelektroniki_35_32_115-260x260_0.jpg'),
(1105, 10, 'Паяльная станция ZD-929C', 'Паяльная станция с цифровым дисплеем для точной пайки.', 'Тип: паяльная станция; Мощность: 48 Вт; Температура: 150-450°C; Наконечник: сменный', '6000.00', 150, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6q_V4UIAEG5B-uHNKk5-1pdOTpgH-g4d5qQ&s'),
(1106, 10, 'Мультиметр Mastech MAS830L', 'Компактный мультиметр для базовых измерений.', 'Тип: мультиметр; Диапазон: 600 В (AC/DC); Точность: 1%; Функции: подсветка', '1500.00', 500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWIM9sw0lzTvZC7nrSoPr0FR6pMNaPhy59yw&s'),
(1107, 10, 'Бокорезы NWS 128 мм', 'Бокорезы для точной резки проводов в электронике.', 'Тип: бокорезы; Длина: 128 мм; Материал: инструментальная сталь; Режущая способность: до 1.8 мм', '1800.00', 400, 'https://www.nws-tools.de/images/products/cutters-128mm.jpg'),
(1108, 10, 'Пинцет прецизионный ESD-15', 'Антистатический пинцет с изогнутым концом.', 'Тип: пинцет; Длина: 120 мм; Материал: нержавеющая сталь; Покрытие: антистатическое', '350.00', 800, 'https://ae01.alicdn.com/kf/S7b23ccfce915445aacdeb04114bbd3f05.jpg'),
(1109, 10, 'Стриппер автоматический WS-04', 'Автоматический стриппер для снятия изоляции.', 'Тип: стриппер; Диаметр провода: 0.5-6 мм; Длина: 175 мм; Материал: сталь', '1200.00', 600, 'https://imgproxy.kuper.ru/imgproxy/size-500-500/czM6Ly9jb250ZW50LWltYWdlcy1wcm9kL3Byb2R1Y3RzLzM2MzM1MDEyL29yaWdpbmFsLzEvMjAyNC0wOC0xNVQxNSUzQTE3JTNBMzMuMTc1OTc5JTJCMDAlM0EwMC8zNjMzNTAxMl8xLmpwZw==.jpg'),
(1110, 10, 'Паяльник с терморегулятором 60 Вт', 'Паяльник с регулируемой температурой для универсальных работ.', 'Тип: паяльник; Мощность: 60 Вт; Температура: 200-450°C; Наконечник: сменный', '1000.00', 700, 'https://www.payalniki.ru/i/o/9a15ab56ac31acfe89bf817df8541899.jpg'),
(1111, 10, 'Набор надфилей 6 шт.', 'Набор надфилей для обработки мелких деталей.', 'Тип: надфили; Количество: 6 шт.; Длина: 140 мм; Материал: инструментальная сталь', '800.00', 500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4aqoFDrbTJCm99yiFkDF1mUUc0LfRFz0GoQ&s'),
(1112, 10, 'Клеевой пистолет 40 Вт', 'Горячий клеевой пистолет для фиксации компонентов.', 'Тип: клеевой пистолет; Мощность: 40 Вт; Диаметр стержня: 7 мм; Температура: 190°C', '600.00', 800, 'https://ae01.alicdn.com/kf/H17b9425723194f7fbd40d52aa2e3d314y.jpg'),
(1113, 10, 'Тестер сети RJ45', 'Тестер для проверки сетевых кабелей.', 'Тип: тестер; Совместимость: RJ45, RJ11; Функции: проверка целостности; Корпус: пластик', '1500.00', 400, 'https://cdn.vseinstrumenti.ru/images/goods/stroitelnyj-instrument/izmeritelnye-pribory-i-instrument/7479781/560x504/85842961.jpg'),
(1114, 10, 'Отвёртка Torx T10 Wera', 'Отвёртка для винтов с профилем Torx.', 'Тип: Torx; Профиль: T10; Длина: 150 мм; Материал: хром-ванадиевая сталь; Рукоятка: эргономичная', '700.00', 500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqVrmy3qPXJBiId3Bp3GiC-AsI7a55G3NZ3Q&s'),
(1115, 10, 'Паяльная лента 3 мм', 'Лента для удаления припоя с высокой впитываемостью.', 'Тип: паяльная лента; Ширина: 3 мм; Длина: 1.5 м; Материал: медь', '250.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmrQY9tuf_7VDMYGB6ZO1TzLhr2cR15m0y0w&s'),
(1116, 10, 'Кусачки для электроники NWS 120 мм', 'Прецизионные кусачки для работы с мелкими проводами.', 'Тип: кусачки; Длина: 120 мм; Материал: инструментальная сталь; Режущая способность: до 1.5 мм', '2000.00', 400, 'https://tools-markets.ru/image/cache/data/6/Kusachki-bokovye-dlja-jelektroniki-77-22-120-h-600x600_0.jpg'),
(1117, 10, 'Набор бит Wera 32 шт.', 'Набор бит для шуруповёрта с различными профилями.', 'Тип: биты; Количество: 32 шт.; Профили: PH, PZ, SL, Torx; Материал: хром-ванадиевая сталь', '2500.00', 300, 'https://cdn.vseinstrumenti.ru/images/goods/ruchnoj-instrument/otvertki/1877925/1200x800/53652282.jpg'),
(1118, 10, 'Паяльная станция AOYUE 968A+', 'Многофункциональная станция с феном и паяльником.', 'Тип: паяльная станция; Мощность: 550 Вт; Температура: 100-480°C; Функции: термофен', '20000.00', 80, 'https://copterparts.ru/wp-content/uploads/2023/09/256377a.jpg'),
(1119, 10, 'Мультиметр UNI-T UT33D+', 'Компактный мультиметр с функцией бесконтактного детектора.', 'Тип: мультиметр; Диапазон: 600 В (AC/DC); Точность: 0.7%; Функции: NCV, подсветка', '2000.00', 500, 'https://www.danomsk.ru/upload/iblock/0ab/186776_df1b7f38672a784986bcf3014404c01f.jpg'),
(1120, 11, 'Микроконтроллер Arduino Uno R3', 'Популярная плата для разработки робототехнических проектов.', 'Микроконтроллер: ATmega328; Напряжение: 5 В; Порты: 14 цифровых, 6 аналоговых; Интерфейс: USB', '2000.00', 500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvA78CKHU9FwZ0RvO0HgrFXNoSRYogq2XD6Q&s'),
(1121, 11, 'Микроконтроллер Arduino Nano', 'Компактная плата для небольших робототехнических систем.', 'Микроконтроллер: ATmega328; Напряжение: 5 В; Порты: 14 цифровых, 8 аналоговых; Интерфейс: USB Mini-B', '1500.00', 600, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRsbNphWkWMQz3MfRKNIQVpRXGwP01zDmWKA&s'),
(1122, 11, 'Raspberry Pi 4 Model B 4GB', 'Мощный одноплатный компьютер для сложных робототехнических задач.', 'Процессор: 4 ядра, 1.5 ГГц; ОЗУ: 4 ГБ; Порты: USB 3.0, HDMI; Wi-Fi, Bluetooth', '6000.00', 300, 'https://ir-3.ozone.ru/s3/multimedia-p/c1000/6556683253.jpg'),
(1123, 11, 'Сервопривод Feetech FS5103B', 'Надёжный сервопривод для управления движением роботов.', 'Тип: аналоговый; Угол: 180°; Напряжение: 4.8-6 В; Крутящий момент: 3.2 кг·см', '800.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1gtGUTnQYpxYrogNPWdmKBJhqLuHLavg6TQ&s'),
(1124, 11, 'Мотор-редуктор Pololu 100:1', 'Мотор с редуктором для мобильных роботов.', 'Тип: DC; Напряжение: 3-12 В; Скорость: 120 об/мин; Крутящий момент: 5 кг·см', '1200.00', 500, 'https://robot-kit.ru/wa-data/public/shop/products/95/31/3195/images/10463/RKP-TT09220-100-5.970.jpg'),
(1125, 11, 'Датчик ультразвуковой HC-SR04', 'Сенсор для измерения расстояния в роботах.', 'Тип: ультразвуковой; Диапазон: 2-400 см; Напряжение: 5 В; Интерфейс: цифровой', '200.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwbAE-9ZRHOXOs3AnLZfOt91V692NjiBQDkw&s'),
(1126, 11, 'Датчик инфракрасный Sharp GP2Y0A21', 'Сенсор для обнаружения препятствий.', 'Тип: инфракрасный; Диапазон: 10-80 см; Напряжение: 4.5-5.5 В; Интерфейс: аналоговый', '600.00', 700, 'https://avatars.mds.yandex.net/get-mpic/4612208/img_id8928765110831623965.jpeg/orig'),
(1127, 11, 'Модуль Wi-Fi ESP8266 NodeMCU', 'Модуль для беспроводного управления роботами.', 'Микроконтроллер: ESP8266; Частота: 2.4 ГГц; Напряжение: 3.3 В; Порты: 11 GPIO', '500.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8iJG5MW4PRmkfT1oHxso-BEx4SjyrGefoqg&s'),
(1128, 11, 'Шасси для робота Pololu Zumo', 'Платформа для создания мобильных роботов.', 'Тип: гусеничное; Размер: 100x100 мм; Материал: пластик/металл; Совместимость: Arduino', '3000.00', 200, 'https://robototehnika.ru/upload/iblock/f5b/efoqa9qe6x180fhc6r9h3e3pi80568kq/26677240-0b47-11e9-b14d-047d7b09e6c7_26677247-0b47-11e9-b14d-047d7b09e6c7.resize1.jpeg'),
(1129, 11, 'Драйвер моторов L298N', 'Модуль для управления двигателями в роботах.', 'Тип: H-мост; Напряжение: 5-35 В; Ток: до 2 А; Интерфейс: цифровой', '400.00', 900, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEpojiwMSv88WEiEiOuXEbCXgM2C7b4UDckg&s'),
(1130, 11, 'Микроконтроллер DFRobot Romeo V2', 'Плата с интегрированным драйвером моторов.', 'Микроконтроллер: ATmega32U4; Напряжение: 5 В; Порты: 8 аналоговых, 14 цифровых; Интерфейс: USB', '2500.00', 400, 'https://rs-catalog.ru/images/detailed/544/1244690-1.jpg'),
(1131, 11, 'Сервопривод MG996R', 'Мощный сервопривод для крупных робототехнических проектов.', 'Тип: цифровой; Угол: 180°; Напряжение: 4.8-7.2 В; Крутящий момент: 11 кг·см', '1000.00', 600, 'https://iarduino.ru/img/catalog/2e9e48f845807d2a73c4375c268b6558.jpg'),
(1132, 11, 'Датчик линии TCRT5000', 'Сенсор для отслеживания линий в роботах.', 'Тип: инфракрасный; Диапазон: 0.5-2 см; Напряжение: 5 В; Интерфейс: аналоговый/цифровой', '150.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3qPlzul0GXXhk7xt5ojmFA2f1I0rH1KaLvg&s'),
(1133, 11, 'Мотор-редуктор Tamiya 70168', 'Компактный мотор для учебных роботов.', 'Тип: DC; Напряжение: 3-6 В; Скорость: 150 об/мин; Крутящий момент: 2 кг·см', '700.00', 700, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDcfoxnFlNL5kAhNEnI9dd6lCa5zpxvVCsQw&s'),
(1134, 11, 'Модуль Bluetooth HC-05', 'Модуль для беспроводной связи в роботах.', 'Тип: Bluetooth 2.0; Диапазон: 10 м; Напряжение: 3.3-5 В; Интерфейс: UART', '600.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm0qZitI8bAtXlNq5le7QuxlW7-sLOEjnjbA&s'),
(1135, 11, 'Датчик температуры DS18B20', 'Сенсор для измерения температуры в робототехнике.', 'Тип: цифровой; Диапазон: -55...+125°C; Напряжение: 3-5 В; Интерфейс: 1-Wire', '250.00', 900, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdI1fRr9HtCXmDETU2e4H1NHDqBWUmr4IdGQ&s'),
(1136, 11, 'Платформа для робота DFRobot 4WD', 'Четырёхколёсная платформа для мобильных роботов.', 'Тип: колёсная; Размер: 200x150 мм; Материал: акрил; Совместимость: Arduino', '2500.00', 300, 'https://robototehnika.ru/upload/resize_cache/iblock/9bf/apvs0za4s5ul0m5h0pm93hh14qaj0ap0/280_280_140cd750bba9870f18aada2478b24840a/ecc2dc7f-4037-11e2-9ed5-047d7b09e6c7_b7f13a02-73e7-11ea-b189-047d7b09e6c7.resize1.jpeg'),
(1137, 11, 'Микроконтроллер ESP32 DevKitC', 'Модуль для IoT и робототехнических приложений.', 'Микроконтроллер: ESP32; Частота: 2.4 ГГц; Напряжение: 3.3 В; Порты: 38 GPIO', '800.00', 700, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJQasK5n_FGIWjSlQcR3yXE2Xxex77bscpgQ&s'),
(1138, 11, 'Датчик гироскоп MPU-6050', 'Сенсор для измерения ускорения и ориентации.', 'Тип: 6-осевой; Диапазон: ±250...±2000°/с; Напряжение: 3.3-5 В; Интерфейс: I2C', '400.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4hwWXYcinPZ56EnTg0V4QHt3EJ9S4LLx74g&s'),
(1139, 11, 'Мотор-редуктор Pololu 50:1', 'Мотор с редуктором для точных движений.', 'Тип: DC; Напряжение: 3-12 В; Скорость: 250 об/мин; Крутящий момент: 3 кг·см', '1100.00', 500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1UcC2WJbqc3MEevQYZ_xL7OUMzXzBQpRikw&s'),
(1140, 11, 'Датчик цвета TCS34725', 'Сенсор для распознавания цветов в роботах.', 'Тип: RGB; Напряжение: 3.3-5 В; Интерфейс: I2C; Точность: 16 бит', '600.00', 700, 'https://shop.robotclass.ru/image/cache/data/Sensors/Light/SENS-TCS34725_1-1024x768.jpg'),
(1141, 11, 'Модуль камеры OV7670', 'Камера для робототехнических систем с обработкой изображений.', 'Тип: CMOS; Разрешение: 640x480; Напряжение: 3.3 В; Интерфейс: цифровой', '800.00', 600, 'https://ir.ozone.ru/s3/multimedia-l/w500/6895166421.jpg'),
(1142, 11, 'Шасси для робота Tamiya 70108', 'Гусеничная платформа для учебных роботов.', 'Тип: гусеничное; Размер: 150x100 мм; Материал: пластик; Совместимость: Arduino', '2000.00', 400, 'https://tamiyarus.ru/wp-content/uploads/2022/09/70108_p1.jpg'),
(1143, 11, 'Драйвер сервоприводов PCA9685', 'Модуль для управления до 16 сервоприводами.', 'Тип: PWM; Напряжение: 2.3-5.5 В; Каналы: 16; Интерфейс: I2C', '500.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnV2sTvKXga9Xd3dNiXjaHrWi7VZdibOAYTw&s'),
(1144, 11, 'Микроконтроллер Seeed Studio XIAO', 'Миниатюрная плата для компактных роботов.', 'Микроконтроллер: SAMD21; Напряжение: 3.3 В; Порты: 11 цифровых, 7 аналоговых; Интерфейс: USB-C', '1000.00', 600, 'https://ae04.alicdn.com/kf/Sd3fb0e2aac38443181ed1fc68c75e6ebq.jpg'),
(1145, 11, 'Датчик давления BMP280', 'Сенсор для измерения атмосферного давления и высоты.', 'Тип: цифровой; Диапазон: 300-1100 гПа; Напряжение: 1.8-3.6 В; Интерфейс: I2C/SPI', '300.00', 900, 'https://static.insales-cdn.com/images/products/1/2345/294676777/bmp280.jpg'),
(1146, 11, 'Мотор-редуктор DFRobot 75:1', 'Мотор для мобильных робототехнических платформ.', 'Тип: DC; Напряжение: 6-12 В; Скорость: 200 об/мин; Крутящий момент: 4 кг·см', '1300.00', 500, 'https://static.chipdip.ru/lib/358/DOC004358881.jpg'),
(1147, 11, 'Модуль GPS NEO-6M', 'Модуль для навигации в робототехнических системах.', 'Тип: GPS; Частота: 1 Гц; Напряжение: 3.3-5 В; Интерфейс: UART', '1000.00', 600, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0NfPallHFBPuT1FPm6dcRmOKvTc5spHe_QA&s'),
(1148, 11, 'Датчик магнитного поля HMC5883L', 'Сенсор для определения направления магнитного поля.', 'Тип: 3-осевой; Напряжение: 2.16-3.6 В; Интерфейс: I2C; Точность: ±8 Гаусс', '400.00', 800, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx7eJ8yr9zm--_YTkfU_IUC7wRQ7QAoMvZGA&s'),
(1149, 11, 'Колёса для робота Pololu 60x8 мм', 'Колёса для мобильных робототехнических платформ.', 'Тип: пластиковые; Диаметр: 60 мм; Толщина: 8 мм; Совместимость: моторы Pololu', '300.00', 1000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUALIG57BI1mUntow2X0YPA2_gBk6ScpOxGQ&s'),
(1150, 12, 'Электроника для начинающих', 'Практическое руководство для изучения основ электроники через эксперименты.', 'Автор: Чарльз Платт; Издательство: БХВ; Год: 2019; Страниц: 432; ISBN: 978-5-9775-3897-8', '1200.00', 300, 'https://электротехника.рф/upload/iblock/10e/45a7f13d1e9aa820ad47d1ac4c86df52047ce71c.jpg.png'),
(1151, 12, 'Искусство схемотехники', 'Классический учебник по аналоговой и цифровой схемотехнике.', 'Авторы: Пол Хоровиц, Уинфилд Хилл; Издательство: ДМК Пресс; Год: 2017; Страниц: 1152; ISBN: 978-5-97060-514-1', '3500.00', 150, 'https://bhv.ru/wp-content/uploads/2021/12/2671_978-5-9775-6689-6-1.jpg'),
(1152, 12, 'Занимательная электроника', 'Популярное пособие по электронике для начинающих и любителей.', 'Автор: Юрий Ревич; Издательство: БХВ; Год: 2021; Страниц: 512; ISBN: 978-5-9775-4165-7', '900.00', 400, 'https://ir.ozone.ru/s3/multimedia-1-p/c1000/7104097249.jpg'),
(1153, 12, 'Электроника шаг за шагом', 'Переизданный классический учебник для начинающих электронщиков.', 'Автор: Рудольф Сворень; Издательство: ДМК Пресс; Год: 2020; Страниц: 464; ISBN: 978-5-97060-789-3', '1000.00', 350, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSldId-eei2tkEM8DQGJnF81Nw1-rey-_WeHg&s'),
(1154, 12, 'Изучаем Arduino', 'Руководство по созданию проектов на платформе Arduino.', 'Автор: Джереми Блум; Издательство: Питер; Год: 2022; Страниц: 448; ISBN: 978-5-4461-1918-9', '700.00', 500, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUaOEXJWi8MZKmrhk3vpcDFTnb1GE3pDtb1g&s\r\n'),
(1155, 12, 'Цифровая схемотехника и архитектура компьютера', 'Учебник по цифровой электронике и компьютерной архитектуре.', 'Авторы: Дэвид Харрис, Сара Харрис; Издательство: ДМК Пресс; Год: 2017; Страниц: 784; ISBN: 978-5-97060-487-8', '2000.00', 200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRSQv-d4Z6txqXSdJxQE_84Xg5F1tN4zXiA&s'),
(1156, 12, 'Основы электроники', 'Базовый учебник для студентов технических специальностей.', 'Автор: Игорь Жеребцов; Издательство: Лань; Год: 2020; Страниц: 512; ISBN: 978-5-8114-5232-3', '800.00', 400, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQULbt349h223P8FvtXfNv_DgT3FgSbPL4jg&s'),
(1157, 12, 'Радиоэлектроника для чайников', 'Простое введение в электронику для новичков.', 'Авторы: Гордон Мак-Комб, Эрл Бойсен; Издательство: Вильямс; Год: 2018; Страниц: 384; ISBN: 978-5-8459-2113-0', '600.00', 450, 'https://ir.ozone.ru/multimedia/c1000/1027413635.jpg'),
(1158, 12, 'Архитектура компьютера', 'Классическое руководство по устройству компьютеров.', 'Автор: Эндрю Таненбаум; Издательство: Питер; Год: 2019; Страниц: 816; ISBN: 978-5-4461-1147-3', '2500.00', 200, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsIojo3gDLxSyYuSwK7W9P6LVMUm-YZFVoSA&s'),
(1159, 12, 'Практическая электроника', 'Руководство по созданию электронных устройств.', 'Авторы: Саймон Монк, Пауль Шерц; Издательство: БХВ; Год: 2020; Страниц: 704; ISBN: 978-5-9775-4166-4', '1500.00', 250, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaW_ectiAkkEgCtbo_CxGjTrUHFqicCMxNxQ&s'),
(1160, 12, 'Микроконтроллеры AVR для начинающих', 'Пособие по программированию микроконтроллеров AVR.', 'Автор: М.Б. Лебедев; Издательство: Додэка; Год: 2019; Страниц: 256; ISBN: 978-5-94057-123-0', '500.00', 500, 'https://cdn1.ozone.ru/s3/multimedia-v/6619935883.jpg'),
(1161, 12, 'Полупроводниковая схемотехника', 'Фундаментальный труд по схемотехнике.', 'Авторы: Ульрих Титце, Кристоф Шенк; Издательство: ДМК Пресс; Год: 2018; Страниц: 1488; ISBN: 978-5-97060-589-9', '4000.00', 100, 'https://sun9-36.userapi.com/impg/GMs_WjR851ZowdBEXA-sv8NMbzQ_biKnaNGrhw/Rl3XsDYKJ7k.jpg?size=414x604&quality=96&sign=7bda0cd1dc60ef392d10e73122a62437&type=album'),
(1162, 12, 'Электротехника и основы электроники', 'Учебник для вузов по электротехнике и электронике.', 'Авторы: И.И. Иванов, Г.И. Соловьёв; Издательство: Лань; Год: 2021; Страниц: 737; ISBN: 978-5-8114-6789-1', '1300.00', 300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlWzkXi5oppyQXaIiv0CwMmrFu_hvySJx-hA&s'),
(1163, 12, 'Занимательная микроэлектроника', 'Популярное руководство по микроэлектронике.', 'Автор: Юрий Ревич; Издательство: БХВ; Год: 2020; Страниц: 496; ISBN: 978-5-9775-4164-0', '850.00', 400, 'https://bhv.ru/images/products/zanimatelnaya-mikroelektronika.jpg'),
(1164, 12, 'Arduino. Большая книга рецептов', 'Справочник по проектам на Arduino.', 'Автор: Майкл Марголис; Издательство: БХВ; Год: 2021; Страниц: 784; ISBN: 978-5-9775-4167-1', '1800.00', 200, 'https://bhv.ru/images/products/arduino-recipes.jpg'),
(1165, 12, 'Основы цифровой электроники', 'Учебник по основам цифровой схемотехники.', 'Автор: Роджер Токхейм; Издательство: Вильямс; Год: 2017; Страниц: 592; ISBN: 978-5-8459-2114-7', '1100.00', 350, 'https://litres.ru/images/products/osnovy-tsifrovoy-elektroniki.jpg'),
(1166, 12, 'Компьютерные системы: архитектура и программирование', 'Руководство по архитектуре и программированию.', 'Авторы: Рэндал Брайант, Дэвид О’Халларон; Издательство: ДМК Пресс; Год: 2018; Страниц: 672; ISBN: 978-5-97060-590-5', '2200.00', 200, 'https://dmkpress.com/images/products/computer-systems.jpg'),
(1167, 12, 'Простая электроника для детей', 'Книга для детей по основам электроники.', 'Автор: Нидал Д.Э.; Издательство: Питер; Год: 2021; Страниц: 208; ISBN: 978-5-4461-1920-2', '500.00', 500, 'https://litres.ru/images/products/prostaya-elektronika-dlya-detey.jpg'),
(1168, 12, 'Проекты с использованием контроллера Arduino', 'Практическое руководство по Arduino-проектам.', 'Автор: В. Петин; Издательство: БХВ; Год: 2021; Страниц: 512; ISBN: 978-5-9775-4168-8', '1000.00', 400, 'https://bhv.ru/images/products/arduino-projects.jpg'),
(1169, 12, 'Основы промышленной электроники', 'Учебное пособие по промышленной электронике.', 'Автор: Д.А. Кушнер; Издательство: Лань; Год: 2020; Страниц: 432; ISBN: 978-5-8114-5233-0', '900.00', 350, 'https://lanbook.com/images/products/osnovy-promyshlennoj-elektroniki.jpg'),
(1170, 12, 'Электроника. Теория и практика', 'Практическое руководство по электронике.', 'Авторы: Саймон Монк, Пауль Шерц; Издательство: БХВ; Год: 2020; Страниц: 704; ISBN: 978-5-9775-4166-4', '1500.00', 250, 'https://bhv.ru/images/products/elektronika-teoriya-i-praktika.jpg'),
(1171, 12, 'Основы конструирования радиоэлектронных средств', 'Учебник по конструированию электроники.', 'Авторы: Г.М. Алдонин, А.К. Дашкова; Издательство: Лань; Год: 2019; Страниц: 496; ISBN: 978-5-8114-5234-7', '1200.00', 300, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSifeOtMpqV52sJmtKcsI7f6pfYPL7yeMRnlQ&s'),
(1172, 12, 'Мобильные роботы на базе Arduino', 'Руководство по созданию роботов с Arduino.', 'Автор: М. Марголис; Издательство: БХВ; Год: 2020; Страниц: 384; ISBN: 978-5-9775-4169-5', '900.00', 400, 'https://cdn1.ozone.ru/s3/multimedia-1-c/6998530656.jpg'),
(1173, 12, 'Первые шаги в радиоэлектронике', 'Введение в радиоэлектронику для новичков.', 'Автор: Атанас Шишков; Издательство: СОЛОН-ПРЕСС; Год: 2019; Страниц: 256; ISBN: 978-5-91359-234-7', '600.00', 450, 'https://cdn1.ozone.ru/multimedia/1011043474.jpg'),
(1174, 12, 'Юный радиолюбитель', 'Классическое пособие для начинающих радиолюбителей.', 'Автор: В.Г. Борисов; Издательство: РадиоСофт; Год: 2018; Страниц: 384; ISBN: 978-5-93037-345-5', '700.00', 400, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStw_eaMlfr4PckkmKkWTKLF8hliWz2iDmhYQ&s'),
(1175, 12, 'Основы компьютерного проектирования', 'Учебник по компьютерному моделированию электроники.', 'Автор: М.П. Трухин; Издательство: Лань; Год: 2019; Страниц: 320; ISBN: 978-5-8114-5235-4', '800.00', 350, 'https://ir.ozone.ru/s3/multimedia-6/c1000/6836898534.jpg'),
(1176, 12, 'Электроника в вопросах и ответах', 'Пособие по электронике в формате вопросов и ответов.', 'Авторы: И. Хабловски, В. Скулимовски; Издательство: ДМК Пресс; Год: 2018; Страниц: 288; ISBN: 978-5-97060-591-2', '500.00', 500, 'https://cdn1.ozone.ru/multimedia/c600/1003866717.jpg'),
(1177, 12, 'Цифровая электроника для начинающих', 'Введение в цифровую электронику.', 'Автор: Дмитрий Елисеев; Издательство: Питер; Год: 2021; Страниц: 336; ISBN: 978-5-4461-1921-9', '600.00', 450, 'https://bhv.ru/wp-content/uploads/2021/11/2828_978-5-9775-6813-5.jpg'),
(1178, 12, 'Основы технологий создания радиоэлектронных систем', 'Учебное пособие по радиоэлектронным системам.', 'Автор: Д.В. Фомин; Издательство: Лань; Год: 2021; Страниц: 352; ISBN: 978-5-8114-5236-1', '900.00', 350, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyeFwCzy-3G89DcnfPrzUsgQOGQaKgz8mZfw&s'),
(1179, 12, 'Энциклопедия радиолюбителя', 'Справочник по радиоэлектронике для любителей.', 'Автор: Виктор Пестриков; Издательство: Наука и Техника; Год: 2020; Страниц: 512; ISBN: 978-5-94387-987-6', '1000.00', 400, 'https://avidreaders.ru/pics/8/1/803181.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `store_settings`
--

CREATE TABLE `store_settings` (
  `id` int NOT NULL DEFAULT '1',
  `store_name` varchar(100) NOT NULL DEFAULT 'ElectroStore',
  `logo_url` varchar(255) DEFAULT NULL,
  `primary_color` varchar(7) DEFAULT '#2196F3',
  `secondary_color` varchar(7) DEFAULT '#FFC107',
  `background_color` varchar(7) DEFAULT '#f5f5f5',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `store_settings`
--

INSERT INTO `store_settings` (`id`, `store_name`, `logo_url`, `primary_color`, `secondary_color`, `background_color`, `updated_at`) VALUES
(1, 'ElectroStore', NULL, '#2196F3', '#FFC107', '#f5f5f5', '2025-05-10 07:54:19');

-- --------------------------------------------------------

--
-- Table structure for table `superadmins`
--

CREATE TABLE `superadmins` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `superadmins`
--

INSERT INTO `superadmins` (`id`, `username`, `password_hash`, `created_at`) VALUES
(10, 'admin', '$2y$10$KHqoYZSLuKlOVZL7DC9Uy.LD1ZXCTjG2VYYlXm3XlxQ6G7UNV0YZq', '2025-05-10 08:28:38'),
(11, 'superadmin', '$2y$10$KHqoYZSLuKlOVZL7DC9Uy.LD1ZXCTjG2VYYlXm3XlxQ6G7UNV0YZq', '2025-05-10 08:28:38');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` enum('deposit','withdraw') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text,
  `balance` decimal(10,2) DEFAULT '0.00',
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `email_verification_code` varchar(10) DEFAULT NULL,
  `email_verification_expires` datetime DEFAULT NULL,
  `password_reset_code` varchar(10) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `middle_name`, `email`, `phone`, `password`, `address`, `balance`, `avatar_url`, `created_at`, `updated_at`, `email_verified`, `email_verification_code`, `email_verification_expires`, `password_reset_code`, `password_reset_expires`, `reset_token`, `reset_token_expires`) VALUES
(1, 'Далер', 'Шорахматов', 'Исмоналиевич', 'daler.shd.03@gmail.com', '+79964594525', '$2y$10$Rsq2WnP3RMBFjX9jVDtAju3iN18XSTTA9UCKBwUaD4sV80UgM.Yqu', '', '0.00', NULL, '2025-05-01 20:30:20', '2025-05-14 17:11:37', 1, '967457', '2025-05-14 22:09:06', NULL, NULL, 'e8846ce5581a3b38134df34d0de7f09186da0970e49446f33a06f4cef1af0718', '2025-05-15 12:32:57'),
(7, 'Иван', 'Иванов', '', 'web@mail.ru', '+7-(999)-999-99-99', '$2y$10$nmrd.chhDWpM.JbCGHA6Pum3gmBq09IQ9BicfM3wjpo/fEwWqXVo.', NULL, '0.00', NULL, '2025-05-14 18:38:18', '2025-05-14 18:49:07', 0, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart_item` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `delivery_addresses`
--
ALTER TABLE `delivery_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payment_cards`
--
ALTER TABLE `payment_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payment_wallets`
--
ALTER TABLE `payment_wallets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `store_settings`
--
ALTER TABLE `store_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `superadmins`
--
ALTER TABLE `superadmins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=369;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `delivery_addresses`
--
ALTER TABLE `delivery_addresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=281;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `payment_cards`
--
ALTER TABLE `payment_cards`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `payment_wallets`
--
ALTER TABLE `payment_wallets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1182;

--
-- AUTO_INCREMENT for table `superadmins`
--
ALTER TABLE `superadmins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `delivery_addresses`
--
ALTER TABLE `delivery_addresses`
  ADD CONSTRAINT `delivery_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payment_cards`
--
ALTER TABLE `payment_cards`
  ADD CONSTRAINT `payment_cards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_wallets`
--
ALTER TABLE `payment_wallets`
  ADD CONSTRAINT `payment_wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
