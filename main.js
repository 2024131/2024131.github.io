document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const CONFIG = {
        LAUNCH_DATE: '2025-07-01T00:00:01',
        REDIRECT_URL: 'turbowarp/'
    };

    // DOM Elements
    const elements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        themeToggle: document.getElementById('themeToggle')
    };

    // Initialize Theme
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (elements.themeToggle) {
            elements.themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Toggle Theme
    function setupThemeToggle() {
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            });
        }
    }

    // Update Countdown Display
    function updateCountdown() {
        const now = new Date();
        const launchDate = new Date(CONFIG.LAUNCH_DATE);
        const diff = launchDate - now;

        if (diff <= 0) {
            window.location.href = CONFIG.REDIRECT_URL;
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (elements.days) elements.days.textContent = String(days).padStart(2, '0');
        if (elements.hours) elements.hours.textContent = String(hours).padStart(2, '0');
        if (elements.minutes) elements.minutes.textContent = String(minutes).padStart(2, '0');
        if (elements.seconds) elements.seconds.textContent = String(seconds).padStart(2, '0');

        setTimeout(updateCountdown, 1000);
    }

    // Initialize
    initTheme();
    setupThemeToggle();
    updateCountdown();
});