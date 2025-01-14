function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initSidebar();
    // Temporarily disabled functions
    // loadPosts();
    // initFilters();
    // setupImageUpload();

    // Add temporary message
    const postsGrid = document.getElementById('postsGrid');
    postsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px; background: white; border-radius: 10px;">
            <i class="ri-tools-line" style="font-size: 48px; color: var(--primary);"></i>
            <h2 style="margin: 20px 0;">Blog Functionality Coming Soon</h2>
            <p style="color: #666;">We're working on implementing the blog management features.</p>
        </div>
    `;

    // Disable buttons temporarily
    document.querySelector('.new-post-btn').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Blog functionality coming soon!');
    });
});

// Initialize sidebar functionality
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

// Comment out or add placeholder for other functions
function loadPosts() {
    // Coming soon
    console.log('Posts loading functionality coming soon');
}

function initFilters() {
    // Coming soon
    console.log('Filters functionality coming soon');
}

function setupImageUpload() {
    // Coming soon
    console.log('Image upload functionality coming soon');
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Open new post modal
function openNewPostModal() {
    const modal = document.getElementById('postModal');
    modal.style.display = 'block';
    document.getElementById('postForm').reset();
}