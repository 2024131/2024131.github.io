// 配置项
const CONFIG = {
    TARGET_DATE: '2025-07-01T00:00:00',  // 目标日期
    REDIRECT_URL: 'https://2024131.github.io/turbowarp/',  // 你的TurboWarp项目地址
    REDIRECT_DELAY: 5000  // 5秒后跳转
};

// 防爬虫邮箱处理
document.getElementById('emailLink').addEventListener('click', function(e) {
    e.preventDefault();
    const user = 's2024131';
    const domain = 'mykwanghua.edu.my';
    window.location.href = 'mailto:' + user + '@' + domain;
});

// 倒计时功能
function updateCountdown() {
    const launchDate = new Date(CONFIG.TARGET_DATE);
    const now = new Date();
    const diff = launchDate - now;

    if (diff <= 0) {
        document.querySelector('h1').textContent = "Redirecting!";
        document.querySelector('p').textContent = "Taking you to TurboWarp...";
        
        // 显示跳转倒计时
        let countdown = CONFIG.REDIRECT_DELAY / 1000;
        const countdownElement = document.createElement('div');
        countdownElement.id = 'redirect-countdown';
        countdownElement.style.marginTop = '15px';
        document.querySelector('.card').appendChild(countdownElement);
        
        const interval = setInterval(() => {
            countdownElement.textContent = `Auto redirect in ${countdown} seconds`;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(interval);
                window.location.href = CONFIG.REDIRECT_URL;
            }
        }, 1000);
        
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

    setTimeout(updateCountdown, 1000);
}

// 主题切换功能
document.getElementById('themeToggle').addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// 初始化主题
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
document.getElementById('themeToggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// 启动倒计时
updateCountdown();