document.addEventListener('DOMContentLoaded', function() {
    // Set launch date (December 31, 2024)
    const launchDate = new Date('2024-12-31T00:00:00');
    
    // DOM Elements
    const countdownContainer = document.getElementById('countdown-container');
    const mainTitle = document.getElementById('main-title');
    const mainSubtitle = document.getElementById('main-subtitle');
    const progressFill = document.getElementById('progressFill');
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
    
    // Countdown function
    function updateCountdown() {
        const now = new Date();
        const diff = launchDate - now;
        
        if (diff <= 0) {
            handleLaunch();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        updateProgressBar(diff);
        
        setTimeout(updateCountdown, 1000);
    }
    
    function updateProgressBar(diff) {
        const totalDuration = launchDate - new Date('2023-01-01T00:00:00');
        const elapsed = totalDuration - diff;
        const progressPercent = Math.min(100, (elapsed / totalDuration) * 100);
        progressFill.style.width = `${progressPercent}%`;
    }
    
    function handleLaunch() {
        document.body.classList.add('celebrate');
        mainTitle.textContent = "We're Live!";
        mainSubtitle.textContent = "The wait is over!";
        
        countdownContainer.innerHTML = `
            <div class="launch-message">
                <i class="fas fa-rocket launch-icon"></i>
                <h2>Thank you for waiting!</h2>
                <p>Our project is now live and ready for you to explore.</p>
                <a href="#" class="cta-button">Get Started</a>
            </div>
        `;
        
        progressFill.style.width = '100%';
        document.title = "LYT | We're Live!";
        
        createParticles();
    }
    
    function createParticles() {
        const colors = ['#6c5ce7', '#fd79a8', '#00cec9', '#ffeaa7'];
        const container = document.querySelector('.container');
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'celebration-particle';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                container.appendChild(particle);
                
                setTimeout(() => {
                    particle.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
                    particle.style.opacity = '0';
                    particle.style.transition = 'all 1s ease-out';
                    
                    setTimeout(() => particle.remove(), 1000);
                }, 10);
            }, i * 100);
        }
    }
    
    // Start the countdown
    updateCountdown();
});
