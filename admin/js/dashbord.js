// Visitor Analytics Chart
const salesCtx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(salesCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Page Views',
            data: [1200, 1900, 2300, 2800, 2600, 3100],
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
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Project Interactions Chart
const userCtx = document.getElementById('userChart').getContext('2d');
const userChart = new Chart(userCtx, {
    type: 'bar',
    data: {
        labels: ['Website Visits', 'Project Views', 'Contact Forms', 'Downloads', 'Shares', 'Comments'],
        datasets: [{
            label: 'Interactions',
            data: [650, 459, 280, 181, 156, 155],
            backgroundColor: '#4cc9f0'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
    }
}

// Handle logout
document.querySelector('.logout').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
});

// Navigation functionality
document.querySelectorAll('nav ul li').forEach(item => {
    item.addEventListener('click', () => {
        if (!item.classList.contains('logout')) {
            document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
        }
    });
});

// Add navigation to settings page
document.querySelector('nav ul li:nth-child(6)').addEventListener('click', () => {
    window.location.href = 'settings.html';
});

// Search functionality
document.querySelector('.search input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Add your search logic here
});

// Load dynamic data
async function loadDashboardData() {
    try {
        // Simulate API call
        const data = {
            pageViews: 2543,
            messages: 28,
            projects: 15,
            recentMessages: [
                { id: '#1234', name: 'John Smith', subject: 'Project Inquiry', date: '2023-10-15', status: 'unread' },
                { id: '#1235', name: 'Sarah Johnson', subject: 'Collaboration Request', date: '2023-10-14', status: 'replied' }
            ]
        };

        // Update stats
        document.querySelector('.card:nth-child(1) h3').textContent = data.pageViews.toLocaleString();
        document.querySelector('.card:nth-child(2) h3').textContent = data.messages;
        document.querySelector('.card:nth-child(3) h3').textContent = data.projects;

        // Update table
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = data.recentMessages.map(msg => `
            <tr>
                <td>${msg.id}</td>
                <td>${msg.name}</td>
                <td>${msg.subject}</td>
                <td>${msg.date}</td>
                <td><span class="status ${msg.status === 'replied' ? 'completed' : 'pending'}">${msg.status}</span></td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Charts data update
function updateCharts() {
    // Add real-time update every 5 minutes
    setInterval(() => {
        const newData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 1000) + 500);
        salesChart.data.datasets[0].data = newData;
        salesChart.update();

        const newInteractions = Array.from({ length: 6 }, () => Math.floor(Math.random() * 300) + 100);
        userChart.data.datasets[0].data = newInteractions;
        userChart.update();
    }, 300000);
}

// Initialize dashboard
function initDashboard() {
    checkAuth();
    loadDashboardData();
    updateCharts();
}

// Start the dashboard
document.addEventListener('DOMContentLoaded', initDashboard);

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    // Load saved state from localStorage
    const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isSidebarCollapsed) {
        sidebar.classList.add('collapsed');
    }

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
});