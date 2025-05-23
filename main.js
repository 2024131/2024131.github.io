document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const CONFIG = {
        LAUNCH_DATE: '2025-07-01T00:00:00',
        REDIRECT_URL: '/turbowarp/'
    };

    // Initialize Theme
    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // Toggle Theme
    function setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // Update Countdown Display
    function updateCountdownDisplay(diff) {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Handle Countdown Completion
    function handleCountdownEnd() {
        window.location.href = CONFIG.REDIRECT_URL;
    }

    // Main Countdown Function
    function startCountdown() {
        const launchDate = new Date(CONFIG.LAUNCH_DATE);
        const now = new Date();
        const diff = launchDate - now;

        if (diff <= 0) {
            handleCountdownEnd();
            return;
        }

        updateCountdownDisplay(diff);
        setTimeout(startCountdown, 1000);
    }

    // Initialize everything
    function init() {
        initTheme();
        setupThemeToggle();
        startCountdown();
    }

    // Start the application
    init();
});
