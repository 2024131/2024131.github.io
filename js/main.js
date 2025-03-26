document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
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
    
    // Create floating bubbles
    createBubbles();
    
    function toggleMode() {
        document.body.classList.contains('dark') ? disableDarkMode() : enableDarkMode();
    }
    
    function enableDarkMode() {
        document.body.classList.add('dark');
        modeToggle.innerHTML = '<i class="fas fa-sun mode-icon"></i><span class="mode-text">Light Mode</span>';
        localStorage.setItem('colorMode', 'dark');
    }
    
    function disableDarkMode() {
        document.body.classList.remove('dark');
        modeToggle.innerHTML = '<i class="fas fa-moon mode-icon"></i><span class="mode-text">Dark Mode</span>';
        localStorage.setItem('colorMode', 'light');
    }
    
    function createBubbles() {
        const bubblesContainer = document.querySelector('.floating-bubbles');
        const bubbleCount = 15;
        
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            // Random properties
            const size = Math.random() * 100 + 50;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.1 + 0.05;
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${posX}%`;
            bubble.style.top = `${posY}%`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.opacity = opacity;
            
            bubblesContainer.appendChild(bubble);
        }
    }
});
