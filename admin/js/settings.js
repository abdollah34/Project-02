// Handle profile picture upload
document.getElementById('profilePic').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePreview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', 'profile');
    formData.append('name', this.querySelector('input[type="text"]').value);
    formData.append('email', this.querySelector('input[type="email"]').value);

    fetch('api/update_settings.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Profile updated successfully!');
            } else {
                showNotification('Error: ' + data.message);
            }
        })
        .catch(error => {
            showNotification('Error updating profile');
        });
});

// Handle security form submission
document.getElementById('securityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your password change logic here
    showNotification('Password changed successfully!');
});

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Check authentication
function checkAuth() {
    // Check server-side session status
    fetch('auth/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedin) {
                window.location.href = 'index.html';
            }
        })
        .catch(() => {
            window.location.href = 'index.html';
        });
}

// Initialize settings page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    // Handle profile picture upload
    document.getElementById('profilePic').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profilePreview').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Handle profile form submission
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('type', 'profile');
        formData.append('name', this.querySelector('input[type="text"]').value);
        formData.append('email', this.querySelector('input[type="email"]').value);

        fetch('api/update_settings.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Profile updated successfully!');
                } else {
                    showNotification('Error: ' + data.message);
                }
            })
            .catch(error => {
                showNotification('Error updating profile');
            });
    });

    // Handle security form submission
    document.getElementById('securityForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your password change logic here
        showNotification('Password changed successfully!');
    });

    // Update notification settings
    const toggles = document.querySelectorAll('.toggle-group input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const formData = new FormData();
            formData.append('type', 'notifications');
            formData.append('emailNotifications', toggles[0].checked);
            formData.append('browserNotifications', toggles[1].checked);

            fetch('api/update_settings.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showNotification('Notification settings updated!');
                    } else {
                        showNotification('Error: ' + data.message);
                        this.checked = !this.checked; // Revert toggle if failed
                    }
                })
                .catch(error => {
                    showNotification('Error updating settings');
                    this.checked = !this.checked; // Revert toggle if failed
                });
        });
    });
});