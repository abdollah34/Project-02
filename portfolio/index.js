// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('project-card')) {
                entry.target.style.transitionDelay = `${entry.target.dataset.delay}ms`;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
});

// Custom cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Disable custom cursor on touch devices
if ('ontouchstart' in window) {
    cursor.style.display = 'none';
}

// Enhanced hover effects
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

// Clone images for infinite scroll
const imageTrack = document.querySelector('.image-track');
const originalItems = imageTrack.innerHTML;
imageTrack.innerHTML = originalItems + originalItems; // Duplicate content

// Optional: Add mouse movement parallax effect
document.querySelector('.image-showcase').addEventListener('mousemove', (e) => {
    const images = document.querySelectorAll('.image-item img');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    images.forEach(image => {
        const rect = image.getBoundingClientRect();
        const imageCenterX = rect.left + rect.width / 2;
        const imageCenterY = rect.top + rect.height / 2;

        const moveX = (mouseX - imageCenterX) * 0.01;
        const moveY = (mouseY - imageCenterY) * 0.01;

        image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
    });
});

// Reset transform on mouse leave
document.querySelector('.image-showcase').addEventListener('mouseleave', () => {
    const images = document.querySelectorAll('.image-item img');
    images.forEach(image => {
        image.style.transform = 'none';
    });
});