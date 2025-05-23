document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const CONFIG = {
        LAUNCH_DATE: '2025-07-01T00:00:00', // YYYY-MM-DDTHH:mm:ss format
        REDIRECT_URL: 'turbowarp/index.html' // Relative path to your download page
    };

    // DOM Elements
    const elements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        themeToggle: document.getElementById('themeToggle'),
        card: document.querySelector('.card') // Reference to the main card for content change
    };

    // --- Theme Management ---
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (elements.themeToggle) { // Ensure button exists before changing text
            elements.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    function initTheme() {
        // Check local storage first, then system preference, else default to light
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark'); // System prefers dark
        } else {
            setTheme('light'); // Default to light
        }
    }

    function setupThemeToggle() {
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            });
        }
    }

    // --- Countdown Logic ---
    function updateCountdownDisplay(diff) {
        // Only update if elements exist (robustness)
        if (!elements.days || !elements.hours || !elements.minutes || !elements.seconds) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        elements.days.textContent = String(days).padStart(2, '0');
        elements.hours.textContent = String(hours).padStart(2, '0');
        elements.minutes.textContent = String(minutes).padStart(2, '0');
        elements.seconds.textContent = String(seconds).padStart(2, '0');
    }

    // Handle Countdown Completion: Show message then redirect
    function handleCountdownEnd() {
        if (elements.card) {
            elements.card.innerHTML = `
                <div class="header">
                    <div class="logo">LYT</div>
                    <h1>We're Live!</h1>
                    <p class="subtitle">Thanks for waiting. Redirecting you now...</p>
                </div>
            `;
            // Keep theme toggle button
            elements.themeToggle.style.display = 'flex'; // Ensure it's visible if it was hidden
        }
        
        // Redirect after a short delay to allow message to be seen
        setTimeout(() => {
            window.location.href = CONFIG.REDIRECT_URL;
        }, 3000); // 3 seconds delay
    }

    // Main Countdown Function (recursive setTimeout)
    function startCountdown() {
        const launchDate = new Date(CONFIG.LAUNCH_DATE).getTime(); // Get launch date in milliseconds
        const now = new Date().getTime(); // Current time in milliseconds
        const diff = launchDate - now; // Difference in milliseconds

        if (diff <= 0) {
            handleCountdownEnd();
            return; // Stop the countdown
        }

        updateCountdownDisplay(diff);
        // Call itself after 1 second
        setTimeout(startCountdown, 1000);
    }

    // Initialize everything on DOM Load
    function init() {
        initTheme();
        setupThemeToggle();
        startCountdown(); // Start the countdown immediately
    }

    // Start the application
    init();
});
