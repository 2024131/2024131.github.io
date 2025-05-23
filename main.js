// 配置
const CONFIG = {
    LAUNCH_DATE: '2025-07-01T00:00:00',
    REDIRECT_URL: '/turbowarp/',
    GDRIVE_ID: '1v0flUz9yYUevio1xke6Mb1nFx6CMeIwf',
    EMAIL: ['s2024131', 'mykwanghua.edu.my']
};

// 初始化
function init() {
    setupCountdown();
    setupEmail();
    setupTheme();
    detectMobile();
}

function setupCountdown() {
    function update() {
        const now = new Date();
        const diff = new Date(CONFIG.LAUNCH_DATE) - now;
        
        if (diff <= 0) {
            window.location.href = CONFIG.REDIRECT_URL;
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
        
        setTimeout(update, 1000);
    }
    update();
}

function setupEmail() {
    const emailLink = document.getElementById('emailLink');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `mailto:${CONFIG.EMAIL[0]}@${CONFIG.EMAIL[1]}`;
        });
    }
}

function setupTheme() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

function detectMobile() {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        document.documentElement.classList.add('mobile');
    }
}

document.addEventListener('DOMContentLoaded', init);
