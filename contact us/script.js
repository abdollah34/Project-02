// Update availability status based on working hours
function updateAvailabilityStatus() {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();

    const statusEl = document.getElementById('availability-status');
    const statusDot = document.querySelector('.status-dot');

    // Check if current time is within working hours (9 AM - 6 PM, Monday-Friday)
    const isWorkingHours = hours >= 9 && hours < 18;
    const isWorkDay = day >= 1 && day <= 5;

    if (isWorkingHours && isWorkDay) {
        statusEl.textContent = 'Available';
        statusDot.style.background = '#64ffda';
    } else {
        statusEl.textContent = 'Away';
        statusDot.style.background = '#8892b0';
        statusDot.style.animation = 'none';
    }
}

// Auto-detect user's timezone
function detectAndSetTimezone() {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offset = new Date().getTimezoneOffset();
        const hours = Math.abs(Math.floor(offset / 60));
        const gmt = offset > 0 ? `-${hours}` : `+${hours}`;

        const timezoneSelect = document.getElementById('timezone');
        const gmtOption = `GMT${gmt}`;

        if (timezoneSelect) {
            // Try to select the detected timezone
            const options = Array.from(timezoneSelect.options);
            const matchingOption = options.find(option =>
                option.value.startsWith(gmtOption)
            );

            if (matchingOption) {
                timezoneSelect.value = matchingOption.value;
            }
        }
    } catch (error) {
        console.log('Error detecting timezone:', error);
    }
}

// Form submission handler
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';

    try {
        const formData = new FormData(this);

        // Debug: Log form data
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const response = await fetch('process_form.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Server response:', data);

        if (data.status === 'success') {
            showAnimatedAlert({
                type: 'success',
                title: '',
                message: '' // Removed success message text
            });
            this.reset();
        } else {
            throw new Error(data.message || '');
        }

    } catch (error) {
        console.error('Error:', error);
        showAnimatedAlert({
            type: 'error',
            title: '',
            message: error.message || '' // Removed error message text
        });
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
    }
});

// Enhanced animated alert function
function showAnimatedAlert({ type }) {
    // Add class to body to prevent scrolling
    document.body.classList.add('showing-alert');

    const existingAlerts = document.querySelectorAll('.cool-alert');
    existingAlerts.forEach(alert => alert.remove());

    // Move the alert to be a direct child of body
    const alertHTML = `
        <div class="cool-alert">
            <div class="alert-rings">
                <div class="ring"></div>
                <div class="ring"></div>
                <div class="ring"></div>
            </div>
            <div class="alert-circle">
                <svg class="checkmark" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <div class="alert-text">
                <span class="text-line">Message Sent</span>
                <span class="text-line">Successfully!</span>
            </div>
        </div>
    `;

    // Insert alert at the end of body
    document.body.insertAdjacentHTML('beforeend', alertHTML);

    requestAnimationFrame(() => {
        const alert = document.querySelector('.cool-alert');
        alert.classList.add('show');
    });

    setTimeout(() => {
        const alert = document.querySelector('.cool-alert');
        if (alert) {
            alert.classList.add('hide');
            setTimeout(() => {
                alert.remove();
                // Remove body class after alert is gone
                document.body.classList.remove('showing-alert');
            }, 500);
        }
    }, 2500);
}

// Handle select element interactions
document.querySelectorAll('.select-wrapper select').forEach(select => {
    select.addEventListener('focus', () => {
        select.parentElement.classList.add('active');
    });

    select.addEventListener('blur', () => {
        select.parentElement.classList.remove('active');
    });

    select.addEventListener('change', () => {
        if (select.value) {
            select.style.color = '#fff';
        } else {
            select.style.color = '#8892b0';
        }
    });
});

// Initialize
updateAvailabilityStatus();
setInterval(updateAvailabilityStatus, 60000); // Update every minute
window.addEventListener('load', detectAndSetTimezone);