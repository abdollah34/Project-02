function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initSidebar();
    initCharts();
    loadPopularPages();
    initDateRange();
});

function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isSidebarCollapsed) {
        sidebar.classList.add('collapsed');
    }

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
}

function initCharts() {
    // Traffic Overview Chart
    const trafficCtx = document.getElementById('trafficChart').getContext('2d');
    const trafficChart = new Chart(trafficCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Page Views',
                data: generateRandomData(30, 1000, 5000),
                borderColor: '#4361ee',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(67, 97, 238, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Traffic Sources Chart
    const sourcesCtx = document.getElementById('sourcesChart').getContext('2d');
    const sourcesChart = new Chart(sourcesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Direct', 'Social', 'Search', 'Referral'],
            datasets: [{
                data: [35, 25, 22, 18],
                backgroundColor: ['#4361ee', '#4cc9f0', '#3f37c9', '#4895ef']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Device Distribution Chart
    const deviceCtx = document.getElementById('deviceChart').getContext('2d');
    const deviceChart = new Chart(deviceCtx, {
        type: 'pie',
        data: {
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: [{
                data: [45, 40, 15],
                backgroundColor: ['#4361ee', '#4cc9f0', '#3f37c9']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function generateRandomData(points, min, max) {
    return Array.from({ length: points }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

function loadPopularPages() {
    const popularPages = document.querySelector('.popular-pages');
    const pages = [
        { path: '/portfolio', views: 12453 },
        { path: '/about', views: 8234 },
        { path: '/projects/web-development', views: 6543 },
        { path: '/contact', views: 4322 },
        { path: '/blog/latest-trends', views: 3211 }
    ];

    popularPages.innerHTML = pages.map(page => `
        <div class="page-item">
            <span class="page-path">${page.path}</span>
            <span class="page-views">${page.views.toLocaleString()} views</span>
        </div>
    `).join('');
}

function initDateRange() {
    const timeRange = document.getElementById('timeRange');
    timeRange.addEventListener('change', updateCharts);
}

function updateCharts() {
    // Add functionality to update charts based on date range
    console.log('Updating charts...');
}