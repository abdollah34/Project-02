function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initSidebar();
    loadMessages();
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

async function loadMessages(filters = {}) {
    try {
        const queryParams = new URLSearchParams({
            status: filters.status || 'all',
            contact: filters.contact || 'all',
            search: filters.search || ''
        });

        // Use absolute path from root
        const response = await fetch('/admin/api/get_messages.php?' + queryParams.toString());

        // Log raw response for debugging
        const text = await response.text();
        console.log('Raw API Response:', text);

        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error('Invalid JSON response from server: ' + text.substring(0, 100));
        }

        if (!data.success) {
            throw new Error(data.error || 'Failed to load messages');
        }

        const messagesList = document.getElementById('messagesList');
        if (!messagesList) {
            throw new Error('Messages list element not found');
        }

        messagesList.innerHTML = data.messages.map(message => `
            <div class="message-card ${parseInt(message.read_status) === 0 ? 'unread' : ''}" 
                 data-message-id="${message.id}"
                 onclick="viewMessage(${message.id})">
                <div class="message-icon">
                    <i class="ri-mail-${parseInt(message.read_status) === 0 ? '' : 'open-'}line"></i>
                </div>
                <div class="message-info">
                    <h3>${message.name || 'No Name'}</h3>
                    <p>${message.subject || 'No Subject'}</p>
                </div>
                <div class="message-meta">
                    <div class="message-date">${formatDate(message.created_at)}</div>
                    <span class="contact-method contact-${message.contact_preference}">
                        ${message.contact_preference}
                    </span>
                </div>
            </div>
        `).join('');

        updateUnreadCount();

    } catch (error) {
        console.error('Error loading messages:', error);
        const messagesList = document.getElementById('messagesList');
        messagesList.innerHTML = `<div class="error-message">Failed to load messages: ${error.message}</div>`;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

async function viewMessage(id) {
    try {
        const response = await fetch(`api/messages.php?id=${id}`);
        const data = await response.json();

        if (!data.success || !data.message) {
            throw new Error(data.error || 'Failed to load message');
        }

        const message = data.message;
        const modal = document.getElementById('messageModal');
        const modalContent = modal.querySelector('.message-body');

        modalContent.innerHTML = `
            <div class="detail-group">
                <h3>${message.name}</h3>
                <p>${message.email} | ${message.phone}</p>
            </div>
            <div class="detail-group">
                <h4>${message.subject}</h4>
                <p>${message.message}</p>
            </div>
            <div class="detail-group">
                <p><strong>Preferred Contact:</strong> ${message.contact_preference}</p>
                <p><strong>Sent:</strong> ${formatDate(message.created_at)}</p>
            </div>
        `;

        modal.style.display = 'block';
        modal.dataset.messageId = id;

        if (parseInt(message.read_status) === 0) {
            markAsRead(id);
        }
    } catch (error) {
        console.error('Error viewing message:', error);
    }
}

function initFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const contactFilter = document.getElementById('contactFilter');
    const searchInput = document.querySelector('.search input');

    const applyFilters = () => {
        const filters = {
            status: statusFilter.value,
            contact: contactFilter.value,
            search: searchInput.value
        };
        loadMessages(filters);
    };

    statusFilter.addEventListener('change', applyFilters);
    contactFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', debounce(applyFilters, 300));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('messageModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

document.querySelector('.close').onclick = function() {
    document.getElementById('messageModal').style.display = 'none';
}

async function markAsRead(id) {
    try {
        const response = await fetch(`api/messages.php?id=${id}`, {
            method: 'PUT'
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to mark message as read');
        }
        const messageCard = document.querySelector(`[data-message-id="${id}"]`);
        if (messageCard) {
            messageCard.classList.remove('unread');
        }
        updateUnreadCount();
    } catch (error) {
        console.error('Error marking message as read:', error);
    }
}

async function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            const response = await fetch(`api/messages.php?id=${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to delete message');
            }
            document.getElementById('messageModal').style.display = 'none';
            loadMessages(); // Reload messages list
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }
}

function openReplyModal(message) {
    const modal = document.getElementById('messageModal');
    const modalContent = modal.querySelector('.message-body');

    modalContent.innerHTML = `
        <form id="replyForm">
            <div class="form-group">
                <label>To: ${message.name} (${message.email})</label>
            </div>
            <div class="form-group">
                <label>Subject</label>
                <input type="text" value="Re: ${message.subject}" class="reply-input">
            </div>
            <div class="form-group">
                <label>Message</label>
                <textarea class="reply-input" rows="6"></textarea>
            </div>
        </form>
    `;

    const actions = modal.querySelector('.message-actions');
    actions.innerHTML = `
        <button onclick="sendReply(${message.id})" class="reply-btn">
            <i class="ri-send-plane-line"></i> Send Reply
        </button>
        <button onclick="closeReplyMode(${message.id})" class="cancel-btn">
            <i class="ri-close-line"></i> Cancel
        </button>
    `;
}

async function sendReply(messageId) {
    const form = document.getElementById('replyForm');
    const subject = form.querySelector('input').value;
    const content = form.querySelector('textarea').value;

    if (!content.trim()) {
        alert('Please enter a reply message');
        return;
    }

    try {
        // Replace with your actual API endpoint
        await fetch(`/api/messages/${messageId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject,
                content
            })
        });

        document.getElementById('messageModal').style.display = 'none';
        loadMessages(); // Reload messages list
    } catch (error) {
        console.error('Error sending reply:', error);
    }
}

function updateUnreadCount() {
    fetch('api/messages.php?unread-count')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const unreadBadge = document.querySelector('.messages-badge');
                if (unreadBadge) {
                    unreadBadge.textContent = data.count;
                    unreadBadge.style.display = data.count > 0 ? 'block' : 'none';
                }
            }
        })
        .catch(error => console.error('Error updating unread count:', error));
}

// Add event listeners for message actions
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initSidebar();
    loadMessages();
    initFilters();

    // Add action button event listeners
    document.querySelector('.message-actions .reply-btn').addEventListener('click', function() {
        const messageId = this.closest('.modal').dataset.messageId;
        const message = getCurrentMessageData(messageId);
        openReplyModal(message);
    });

    document.querySelector('.message-actions .mark-btn').addEventListener('click', function() {
        const messageId = this.closest('.modal').dataset.messageId;
        markAsRead(messageId);
    });

    document.querySelector('.message-actions .delete-btn').addEventListener('click', function() {
        const messageId = this.closest('.modal').dataset.messageId;
        deleteMessage(messageId);
    });
});