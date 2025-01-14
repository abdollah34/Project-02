document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: '#64ffda' },
            shape: { type: 'circle' },
            opacity: {
                value: 0.5,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#64ffda',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                out_mode: 'out'
            }
        }
    });

    // Mobile Menu Toggle
    const menuButton = document.getElementById('menuButton');
    const navLinks = document.getElementById('navLinks');

    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuButton.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-content')) {
            navLinks.classList.remove('active');
            menuButton.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuButton.classList.remove('active');
        });
    });

    // Form sections animation
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.2}s`;
    });

    // Form handling
    const form = document.getElementById('projectRequestForm');

    if (!form) {
        console.error('Form not found!');
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');

        if (validateForm()) {
            const formData = new FormData(form);

            // Debug form data
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            fetch('handle_request.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    console.log('Response status:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('Server response:', data);
                    if (data.success) {
                        showSuccessAlert();
                        form.reset();
                    } else {
                        showNotification(data.message || 'An error occurred', 'error');
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    showNotification('Network error occurred: ' + error.message, 'error');
                })
                .finally(() => {
                    submitBtn.innerHTML = 'Submit Request';
                    submitBtn.disabled = false;
                });
        } else {
            console.log('Form validation failed');
        }
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        // Reset previous errors
        form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

        // Mark all fields as touched on form submission
        requiredFields.forEach(field => {
            field.classList.add('touched');
            if (!field.value.trim()) {
                isValid = false;
                field.parentNode.classList.add('error');
            }
        });

        // Validate email and phone
        const emailField = form.querySelector('#email');
        const phoneField = form.querySelector('#phone');

        if (emailField.value && !isValidEmail(emailField.value)) {
            isValid = false;
            emailField.parentNode.classList.add('error');
        }

        if (phoneField.value && !isValidPhone(phoneField.value)) {
            isValid = false;
            phoneField.parentNode.classList.add('error');
        }

        return isValid;
    }

    // Helper functions
    function showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[\d\s+()-]{10,}$/.test(phone);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function showSuccessAlert() {
        // Create alert overlay
        const alertOverlay = document.createElement('div');
        alertOverlay.className = 'alert-overlay';
        alertOverlay.innerHTML = `
            <div class="alert-box">
                <i class="fas fa-check-circle"></i>
                <h3>Request Submitted!</h3>
                <p>Thank you for your project request. We'll review it and get back to you within 24-48 hours.</p>
                <button class="alert-btn">Close</button>
            </div>
        `;

        // Add to document
        document.body.appendChild(alertOverlay);

        // Show alert with animation
        setTimeout(() => alertOverlay.classList.add('show'), 10);

        // Handle close button
        const closeBtn = alertOverlay.querySelector('.alert-btn');
        closeBtn.addEventListener('click', () => {
            alertOverlay.classList.remove('show');
            setTimeout(() => alertOverlay.remove(), 300);
        });
    }

    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(field => {
        // Only show error when field loses focus and has been interacted with
        field.addEventListener('blur', () => {
            if (field.required && field.value.trim() === '' && field.classList.contains('touched')) {
                field.parentNode.classList.add('error');
            }
        });

        // Mark field as touched on first interaction
        field.addEventListener('input', () => {
            field.classList.add('touched');
            field.parentNode.classList.remove('error');
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });

    // Handle file uploads (if added later)
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

            const invalidFiles = files.filter(file => {
                return file.size > maxSize || !allowedTypes.includes(file.type);
            });

            if (invalidFiles.length > 0) {
                showNotification('Please upload only images (JPG, PNG) or PDFs under 5MB', 'error');
                fileInput.value = '';
            }
        });
    }

    // Reset form handler
    form.querySelector('.reset-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to reset the form?')) {
            form.reset();
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
            form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        }
    });

    // Currency and budget handling
    const currencySelect = document.getElementById('currency');
    const budgetSelect = document.getElementById('budget');

    currencySelect.addEventListener('change', updateBudgetRanges);

    function updateBudgetRanges() {
        const currency = currencySelect.value;
        const budgetOptions = budgetSelect.options;

        for (let i = 1; i < budgetOptions.length; i++) {
            const option = budgetOptions[i];
            const range = option.dataset[currency.toLowerCase()];
            const packageType = option.value;

            switch (packageType) {
                case 'basic':
                    option.textContent = `Basic Package (${range} ${currency})`;
                    break;
                case 'standard':
                    option.textContent = `Standard Package (${range} ${currency})`;
                    break;
                case 'premium':
                    option.textContent = `Premium Package (${range} ${currency})`;
                    break;
            }
        }
    }

    // Initialize with default currency if selected
    if (currencySelect.value) {
        updateBudgetRanges();
    }
});