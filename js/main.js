document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Dark mode functionality
    const modeToggle = document.getElementById('modeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('colorMode');
    
    // Initialize mode
    if (savedMode === 'dark' || (prefersDark && savedMode !== 'light')) {
        enableDarkMode();
    }
    
    // Toggle handler
    modeToggle.addEventListener('click', toggleMode);
    
    // System preference change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('colorMode')) {
            e.matches ? enableDarkMode() : disableDarkMode();
        }
    });
    
    // Create floating stars
    createFloatingStars();
    
    function toggleMode() {
        document.body.classList.contains('dark') ? disableDarkMode() : enableDarkMode();
    }
    
    function enableDarkMode() {
        document.body.classList.add('dark');
        modeToggle.innerHTML = '<span class="mode-icon">☀️</span><span class="mode-text">Light Mode</span>';
        localStorage.setItem('colorMode', 'dark');
        
        // Enhance dark mode transition
        document.documentElement.style.setProperty('--glass-blur', 'blur(20px)');
        setTimeout(() => {
            document.documentElement.style.setProperty('--glass-blur', 'blur(16px)');
        }, 300);
    }
    
    function disableDarkMode() {
        document.body.classList.remove('dark');
        modeToggle.innerHTML = '<span class="mode-icon">🌙</span><span class="mode-text">Dark Mode</span>';
        localStorage.setItem('colorMode', 'light');
        
        // Enhance light mode transition
        document.documentElement.style.setProperty('--glass-blur', 'blur(12px)');
        setTimeout(() => {
            document.documentElement.style.setProperty('--glass-blur', 'blur(16px)');
        }, 300);
    }
    
    function createFloatingStars() {
        const starsContainer = document.querySelector('.stars');
        const starCount = 50;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'floating-star';
            
            // Random properties
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${posX}%`;
            star.style.top = `${posY}%`;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
            
            starsContainer.appendChild(star);
        }
    }
});
