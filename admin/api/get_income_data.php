<?php
session_start();
require_once '../../config/database.php';

// Проверка авторизации
if (!isset($_SESSION['superadmin_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

// Получение параметров из запроса
$startDate = isset($_GET['start_date']) ? $_GET['start_date'] : date('Y-m-d', strtotime('-7 days'));
$endDate = isset($_GET['end_date']) ? $_GET['end_date'] : date('Y-m-d');

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Статистика
    $statistics = getStatistics($conn, $startDate, $endDate);
    
    // Данные для графиков
    $chartData = getChartData($conn, $startDate, $endDate);
    
    // Последние заказы
    $recentOrders = getRecentOrders($conn, $startDate, $endDate);
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'statistics' => $statistics,
        'chart_data' => $chartData,
        'recent_orders' => $recentOrders
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}

// Функция для получения статистики
function getStatistics($conn, $startDate, $endDate) {
    // Общее количество заказов
    $query = "
        SELECT COUNT(*) as total_orders
        FROM orders
        WHERE created_at BETWEEN :start_date AND :end_date
    ";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':start_date', $startDate);
    $stmt->bindParam(':end_date', $endDate);
    $stmt->execute();
    $totalOrders = $stmt->fetch(PDO::FETCH_ASSOC)['total_orders'];
    
    // Общий доход
    $query = "
        SELECT SUM(total_amount) as total_income
        FROM orders
        WHERE created_at BETWEEN :start_date AND :end_date
    ";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':start_date', $startDate);
    $stmt->bindParam(':end_date', $endDate);
    $stmt->execute();
    $totalIncome = $stmt->fetch(PDO::FETCH_ASSOC)['total_income'] ?? 0;
    
    // Средний чек
    $averageOrder = $totalOrders > 0 ? $totalIncome / $totalOrders : 0;
    
    // Количество клиентов
    $query = "
        SELECT COUNT(DISTINCT user_id) as total_customers
        FROM orders
        WHERE created_at BETWEEN :start_date AND :end_date
    ";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':start_date', $startDate);
    $stmt->bindParam(':end_date', $endDate);
    $stmt->execute();
    $totalCustomers = $stmt->fetch(PDO::FETCH_ASSOC)['total_customers'];
    
    return [
        'total_orders' => $totalOrders,
        'total_income' => $totalIncome,
        'average_order' => $averageOrder,
        'total_customers' => $totalCustomers
    ];
}

// Функция для получения данных для графиков
function getChartData($conn, $startDate, $endDate) {
    // Доходы по дням
    $query = "
        SELECT DATE(created_at) as date, SUM(total_amount) as income
        FROM orders
        WHERE created_at BETWEEN :start_date AND :end_date
        GROUP BY DATE(created_at)
        ORDER BY date
    ";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':start_date', $startDate);
    $stmt->bindParam(':end_date', $endDate);
    $stmt->execute();
    $incomeByDate = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Топ-5 категорий по продажам
    $query = "
        SELECT c.name as category_name, SUM(oi.price_per_unit * oi.quantity) as sales
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at BETWEEN :start_date AND :end_date
        GROUP BY c.id
        ORDER BY sales DESC
        LIMIT 5
    ";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':start_date', $startDate);
    $stmt->bindParam(':end_date', $endDate);
    $stmt->execute();
    $topCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    return [
        'income_by_date' => $incomeByDate,
        'top_categories' => $topCategories
    ];
}

// Функция для получения последних заказов
function getRecentOrders($conn, $startDate, $endDate) {
    $query = "
        SELECT o.*, CONCAT(u.first_name, ' ', u.last_name) as user_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.created_at BETWEEN :start_date AND :end_date
        ORDER BY o.created_at DESC
        LIMIT 10
    ";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':start_date', $startDate);
    $stmt->bindParam(':end_date', $endDate);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>
