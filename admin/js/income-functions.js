/**
 * Функции для работы с разделом доходов в админ-панели
 */

// Глобальные переменные для графиков
let incomeChart;
let categoriesChart;

// Загрузка данных о доходах
function loadIncomeData(period = 'week') {
    // Показываем индикатор загрузки
    showLoadingIndicators();
    
    // Получаем даты для выбранного периода
    const { startDate, endDate } = getPeriodDates(period);
    
    $.ajax({
        url: 'api/get_income_data.php',
        type: 'GET',
        data: { 
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
        },
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                // Обновляем статистику
                updateStatistics(response.statistics);
                
                // Обновляем графики
                updateCharts(response.chart_data);
                
                // Обновляем таблицу последних заказов
                updateRecentOrders(response.recent_orders);
            } else {
                showNotification('Ошибка: ' + response.message, 'error');
            }
        },
        error: function() {
            showNotification('Произошла ошибка при загрузке данных о доходах', 'error');
        }
    });
}

// Получение дат для выбранного периода
function getPeriodDates(period) {
    const endDate = new Date();
    let startDate = new Date();
    
    switch(period) {
        case 'week':
            startDate.setDate(endDate.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(endDate.getMonth() - 1);
            break;
        case 'year':
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        case 'all':
            startDate = new Date(2020, 0, 1); // Начало 2020 года как условное начало
            break;
        case 'custom':
            startDate = new Date($('#startDate').val());
            endDate = new Date($('#endDate').val());
            break;
    }
    
    return { startDate, endDate };
}

// Показать индикаторы загрузки
function showLoadingIndicators() {
    $('#totalOrders').html('<div class="loading-spinner small"></div>');
    $('#totalIncome').html('<div class="loading-spinner small"></div>');
    $('#averageOrder').html('<div class="loading-spinner small"></div>');
    $('#totalCustomers').html('<div class="loading-spinner small"></div>');
    $('#recentOrdersTable').html('<tr><td colspan="6" class="loading-cell"><div class="loading-spinner"></div></td></tr>');
}

// Обновление статистики
function updateStatistics(statistics) {
    $('#totalOrders').text(statistics.total_orders);
    $('#totalIncome').text(formatCurrency(statistics.total_income));
    $('#averageOrder').text(formatCurrency(statistics.average_order));
    $('#totalCustomers').text(statistics.total_customers);
}

// Обновление графиков
function updateCharts(chartData) {
    // Обновляем график доходов по дням
    updateIncomeChart(chartData.income_by_date);
    
    // Обновляем график категорий
    updateCategoriesChart(chartData.top_categories);
}

// Обновление графика доходов по дням
function updateIncomeChart(data) {
    const ctx = document.getElementById('incomeChart').getContext('2d');
    
    // Если график уже существует, уничтожаем его
    if (incomeChart) {
        incomeChart.destroy();
    }
    
    // Создаем новый график
    incomeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => formatDate(item.date)),
            datasets: [{
                label: 'Доход (₽)',
                data: data.map(item => item.income),
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderColor: 'rgba(33, 150, 243, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(33, 150, 243, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' ₽';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw.toLocaleString() + ' ₽';
                        }
                    }
                }
            }
        }
    });
}

// Обновление графика категорий
function updateCategoriesChart(data) {
    const ctx = document.getElementById('categoriesChart').getContext('2d');
    
    // Если график уже существует, уничтожаем его
    if (categoriesChart) {
        categoriesChart.destroy();
    }
    
    // Создаем новый график
    categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(item => item.category_name),
            datasets: [{
                data: data.map(item => item.sales),
                backgroundColor: [
                    'rgba(33, 150, 243, 0.7)',
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(156, 39, 176, 0.7)',
                    'rgba(244, 67, 54, 0.7)'
                ],
                borderColor: [
                    'rgba(33, 150, 243, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(156, 39, 176, 1)',
                    'rgba(244, 67, 54, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return label + ': ' + value.toLocaleString() + ' ₽ (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Обновление таблицы последних заказов
function updateRecentOrders(orders) {
    const tbody = $('#recentOrdersTable');
    tbody.empty();
    
    if (orders.length === 0) {
        tbody.append('<tr><td colspan="6" class="no-data">Заказов пока нет</td></tr>');
        return;
    }
    
    orders.forEach(function(order) {
        // Форматирование даты
        const date = new Date(order.created_at);
        const formattedDate = date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
        
        // Определение класса для статуса
        const statusClass = getStatusClass(order.status);
        
        // Получение текста статуса на русском
        const statusText = getStatusText(order.status);
        
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${order.user_name}</td>
                <td>${formattedDate}</td>
                <td>${parseFloat(order.total_amount).toFixed(2)} ₽</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn view-btn" onclick="viewOrderDetails(${order.id})" title="Просмотр деталей">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Форматирование валюты
function formatCurrency(value) {
    return parseFloat(value).toLocaleString('ru-RU') + ' ₽';
}

// Форматирование даты
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

// Инициализация обработчиков событий
$(document).ready(function() {
    // Загрузка данных о доходах при загрузке страницы
    loadIncomeData('week');
    
    // Обработчик клика по кнопкам периода
    $('.period-btn').click(function() {
        $('.period-btn').removeClass('active');
        $(this).addClass('active');
        
        const period = $(this).data('period');
        loadIncomeData(period);
    });
    
    // Обработчик клика по кнопке применения пользовательского периода
    $('#applyCustomPeriod').click(function() {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        
        if (!startDate || !endDate) {
            showNotification('Пожалуйста, выберите начальную и конечную даты', 'error');
            return;
        }
        
        $('.period-btn').removeClass('active');
        loadIncomeData('custom');
    });
    
    // Установка текущей даты в поле конечной даты
    const today = new Date().toISOString().split('T')[0];
    $('#endDate').val(today);
    
    // Установка даты неделю назад в поле начальной даты
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    $('#startDate').val(weekAgo.toISOString().split('T')[0]);
});
