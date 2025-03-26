document.addEventListener('DOMContentLoaded', () => {
    // Set copyright year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Dark mode toggle
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
    
    function toggleMode() {
        document.body.classList.contains('dark') ? disableDarkMode() : enableDarkMode();
    }
    
    function enableDarkMode() {
        document.body.classList.add('dark');
        modeToggle.innerHTML = '☀️ Light Mode';
        localStorage.setItem('colorMode', 'dark');
    }
    
    function disableDarkMode() {
        document.body.classList.remove('dark');
        modeToggle.innerHTML = '🌙 Dark Mode';
        localStorage.setItem('colorMode', 'light');
    }
});
