document.addEventListener('DOMContentLoaded', function() {
    // Configuration with additional options
    const CONFIG = {
        LAUNCH_DATE: '2025-07-01T00:00:01',
        REDIRECT_URL: 'turbowarp/',
        ENABLE_ANALYTICS: true,
        DEFAULT_THEME: 'light'
    };

    // DOM Elements with additional selectors
    const elements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        themeToggle: document.getElementById('themeToggle'),
        themeIcon: document.getElementById('themeIcon'),
        ctaButtons: document.querySelectorAll('.cta-button')
    };

    // Initialize Theme with system preference detection
    function initTheme() {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || 
                         (systemPrefersDark ? 'dark' : CONFIG.DEFAULT_THEME);
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    // Update theme icon with emoji or font awesome
    function updateThemeIcon(theme) {
        if (elements.themeIcon) {
            elements.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Setup theme toggle with animation
    function setupThemeToggle() {
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
                
                // Add animation class
                this.classList.add('animate-pulse');
                setTimeout(() => {
                    this.classList.remove('animate-pulse');
                }, 300);
            });
        }
    }

    // Enhanced countdown with progress tracking
    function updateCountdown() {
        const now = new Date();
        const launchDate = new Date(CONFIG.LAUNCH_DATE);
        const diff = launchDate - now;

        if (diff <= 0) {
            if (CONFIG.ENABLE_ANALYTICS) {
                trackEvent('Countdown Complete', 'Redirect to projects');
            }
            window.location.href = CONFIG.REDIRECT_URL;
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update DOM with animation
        animateCountdownChange('days', days);
        animateCountdownChange('hours', hours);
        animateCountdownChange('minutes', minutes);
        animateCountdownChange('seconds', seconds);

        setTimeout(updateCountdown, 1000);
    }

    // Animate countdown number changes
    function animateCountdownChange(id, newValue) {
        const element = document.getElementById(id);
        if (element) {
            const currentValue = parseInt(element.textContent);
            if (newValue !== currentValue) {
                element.classList.add('animate-pop');
                setTimeout(() => {
                    element.textContent = String(newValue).padStart(2, '0');
                    element.classList.remove('animate-pop');
                }, 150);
            }
        }
    }

    // Simple analytics tracking
    function trackEvent(category, action) {
        console.log(`[Analytics] ${category}: ${action}`);
        // Replace with actual analytics implementation
    }

    // Setup button interactions
    function setupButtons() {
        elements.ctaButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (CONFIG.ENABLE_ANALYTICS) {
                    trackEvent('Button Click', this.textContent.trim());
                }
            });
        });
    }

    // Initialize everything
    initTheme();
    setupThemeToggle();
    setupButtons();
    updateCountdown();
}); 