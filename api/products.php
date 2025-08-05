<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../database/config.php';

// Функция для получения списка товаров
function getProducts($category_id = null, $page = 1, $limit = 12) {
    try {
        $offset = ($page - 1) * $limit;
        $params = [];
        
        // Базовый SQL запрос
        $sql = "SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE 1=1";
        
        // Фильтр по категории
        if ($category_id) {
            $sql .= " AND p.category_id = :category_id";
            $params[':category_id'] = $category_id;
        }
        
        // Получаем общее количество товаров
        $countSql = str_replace("SELECT p.*, c.name as category_name", "SELECT COUNT(*)", $sql);
        $stmt = executeQuery($countSql, $params);
        $total = $stmt->fetchColumn();
        
        // Добавляем пагинацию
        $sql .= " ORDER BY p.name ASC LIMIT :limit OFFSET :offset";
        $params[':limit'] = $limit;
        $params[':offset'] = $offset;
        
        // Получаем товары
        $stmt = executeQuery($sql, $params);
        $products = $stmt->fetchAll();
        
        // Форматируем данные
        foreach ($products as &$product) {
            // Форматируем цену
            $product['price'] = number_format($product['price'], 0, '.', ' ');
            
            // Проверяем URL изображения
            if (!empty($product['image_url'])) {
                if (!filter_var($product['image_url'], FILTER_VALIDATE_URL)) {
                    $product['image_url'] = '/assets/images/products/' . $product['image_url'];
                }
            } else {
                $product['image_url'] = '/assets/images/products/default.jpg';
            }
            
            // Добавляем статус наличия
            $product['stock_status'] = $product['quantity'] > 0 ? 'В наличии' : 'Нет в наличии';
        }
        
        return [
            'status' => 'success',
            'data' => [
                'products' => $products,
                'pagination' => [
                    'page' => (int)$page,
                    'limit' => (int)$limit,
                    'total' => (int)$total,
                    'pages' => ceil($total / $limit)
                ]
            ]
        ];
    } catch (Exception $e) {
        error_log("Error in getProducts: " . $e->getMessage());
        return [
            'status' => 'error',
            'message' => 'Ошибка при получении товаров'
        ];
    }
}

// Функция для получения данных о конкретном товаре по ID
function getProductById($id) {
    try {
        $sql = "SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.id = :id";
        
        $params = [':id' => $id];
        $stmt = executeQuery($sql, $params);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            return [
                'success' => false,
                'message' => 'Товар не найден'
            ];
        }
        
        // Форматируем цену
        $product['price_formatted'] = number_format($product['price'], 0, '.', ' ');
        
        // Проверяем URL изображения
        if (!empty($product['image_url'])) {
            if (!filter_var($product['image_url'], FILTER_VALIDATE_URL)) {
                $product['image_url'] = '/assets/images/products/' . $product['image_url'];
            }
        } else {
            $product['image_url'] = '/assets/images/products/default.jpg';
        }
        
        // Добавляем статус наличия
        $product['stock_status'] = $product['quantity'] > 0 ? 'В наличии' : 'Нет в наличии';
        
        // Обрабатываем спецификации и характеристики
        if (!empty($product['specifications'])) {
            // Пытаемся декодировать JSON
            $specifications = json_decode($product['specifications'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $product['specifications'] = $specifications;
            }
        }
        
        if (!empty($product['characteristics'])) {
            // Пытаемся декодировать JSON
            $characteristics = json_decode($product['characteristics'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $product['characteristics'] = $characteristics;
            }
        }
        
        return [
            'success' => true,
            'product' => $product
        ];
    } catch (Exception $e) {
        error_log("Error in getProductById: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Ошибка при получении данных о товаре'
        ];
    }
}

// Функция для получения категорий
function getCategories() {
    try {
        $sql = "SELECT c.*, COUNT(p.id) as products_count 
                FROM categories c 
                LEFT JOIN products p ON c.id = p.category_id 
                GROUP BY c.id 
                ORDER BY c.name ASC";
        
        $stmt = executeQuery($sql);
        $categories = $stmt->fetchAll();
        
        // Добавляем иконки для категорий
        $icons = [
            'Микроконтроллеры' => 'fas fa-microchip',
            'Резисторы' => 'fas fa-bolt',
            'Конденсаторы' => 'fas fa-battery-full',
            'Светодиоды' => 'fas fa-lightbulb',
            'Транзисторы' => 'fas fa-broadcast-tower',
            'Датчики' => 'fas fa-wave-square',
            'Память' => 'fas fa-memory',
            'Разъёмы' => 'fas fa-plug',
            'Печатные платы' => 'fas fa-server',
            'Инструменты' => 'fas fa-tools',
            'Роботехника' => 'fas fa-robot',
            'Литература' => 'fas fa-book'
        ];
        
        foreach ($categories as &$category) {
            $category['icon'] = $icons[$category['name']] ?? 'fas fa-folder';
        }
        
        return [
            'status' => 'success',
            'data' => $categories
        ];
    } catch (Exception $e) {
        error_log("Error in getCategories: " . $e->getMessage());
        return [
            'status' => 'error',
            'message' => 'Ошибка при получении категорий'
        ];
    }
}

// Обработка запроса
$action = $_GET['action'] ?? 'list';
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 12;
$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;

switch ($action) {
    case 'list':
        $response = getProducts($category_id, $page, $limit);
        break;
        
    case 'categories':
        $response = getCategories();
        break;
        
    case 'getById':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $response = getProductById($id);
        break;
        
    case 'getByCategory':
        $response = getProducts($category_id, $page, $limit);
        break;
        
    default:
        $response = [
            'status' => 'error',
            'message' => 'Неизвестное действие'
        ];
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);