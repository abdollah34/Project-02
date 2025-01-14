function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    // Initialize sidebar functionality
    initSidebar();

    // Load projects
    loadProjects();

    // Initialize filters
    initFilters();
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

async function loadProjects(filter = 'all') {
    try {
        // Simulate API call - Replace with actual API endpoint
        const response = await fetch('/api/projects');
        const projects = await response.json();

        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = projects.map(project => `
            <div class="project-card">
                <h3>${project.project_title}</h3>
                <span class="project-status status-${project.status}">${project.status}</span>
                <div class="project-info">
                    <p><strong>Client:</strong> ${project.full_name}</p>
                    <p><strong>Type:</strong> ${project.project_type}</p>
                    <p><strong>Timeline:</strong> ${project.timeline}</p>
                    <p><strong>Budget:</strong> ${project.currency}${project.budget}</p>
                </div>
                <div class="project-actions">
                    <button class="view-btn" onclick="viewProject(${project.id})">View Details</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function initFilters() {
    document.getElementById('statusFilter').addEventListener('change', (e) => {
        loadProjects(e.target.value);
    });

    document.querySelector('.search input').addEventListener('input', (e) => {
        // Implement search functionality
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const client = card.querySelector('.project-info p').textContent.toLowerCase();
            card.style.display = (title.includes(searchTerm) || client.includes(searchTerm)) ? '' : 'none';
        });
    });
}

function viewProject(id) {
    // Implement modal view functionality
    const modal = document.getElementById('projectModal');
    modal.style.display = 'block';

    // Load project details
    fetchProjectDetails(id);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

document.querySelector('.close').onclick = function() {
    document.getElementById('projectModal').style.display = 'none';
}

async function fetchProjectDetails(id) {
    try {
        // Simulate API call - Replace with actual endpoint
        const response = await fetch(`/api/projects/${id}`);
        const project = await response.json();

        document.querySelector('.modal-body').innerHTML = `
            <div class="detail-group">
                <label>Client Information</label>
                <p>${project.full_name}</p>
                <p>${project.email}</p>
                <p>${project.country_code} ${project.phone_number}</p>
                <p>${project.company || 'No company specified'}</p>
            </div>
            <div class="detail-group">
                <label>Project Details</label>
                <p><strong>Title:</strong> ${project.project_title}</p>
                <p><strong>Type:</strong> ${project.project_type}</p>
                <p><strong>Technologies:</strong> ${project.technologies}</p>
                <p><strong>Timeline:</strong> ${project.timeline}</p>
                <p><strong>Budget:</strong> ${project.currency}${project.budget}</p>
            </div>
            <div class="detail-group">
                <label>Description</label>
                <p>${project.description}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching project details:', error);
    }
}