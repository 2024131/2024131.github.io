document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('modeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('colorMode');
    
    // Initialize mode
    if (savedMode === 'dark' || (prefersDark && savedMode !== 'light')) {
        enableDarkMode();
    }
    
    // Toggle handler
    modeToggle.addEventListener('click', () => {
        document.body.classList.contains('dark') ? disableDarkMode() : enableDarkMode();
    });
    
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
    
    // System preference change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('colorMode') === null) {
            e.matches ? enableDarkMode() : disableDarkMode();
        }
    });
});
