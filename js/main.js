document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    
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
    
    // Create animated particles
    createParticles();
    
    function toggleMode() {
        document.body.classList.contains('dark') ? disableDarkMode() : enableDarkMode();
    }
    
    function enableDarkMode() {
        document.body.classList.add('dark');
        modeToggle.innerHTML = '<i class="fas fa-sun mode-icon"></i><span class="mode-text">Light Mode</span>';
        localStorage.setItem('colorMode', 'dark');
        animateModeTransition();
    }
    
    function disableDarkMode() {
        document.body.classList.remove('dark');
        modeToggle.innerHTML = '<i class="fas fa-moon mode-icon"></i><span class="mode-text">Dark Mode</span>';
        localStorage.setItem('colorMode', 'light');
        animateModeTransition();
    }
    
    function animateModeTransition() {
        document.documentElement.style.setProperty('--glass-blur', 'blur(20px)');
        setTimeout(() => {
            document.documentElement.style.setProperty('--glass-blur', 'blur(12px)');
        }, 300);
    }
    
    function createParticles() {
        const particlesContainer = document.querySelector('.particles');
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 15 + 10;
            const opacity = Math.random() * 0.5 + 0.1;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.opacity = opacity;
            
            particlesContainer.appendChild(particle);
        }
    }
});
