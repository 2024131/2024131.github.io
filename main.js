// 配置项
const CONFIG = {
    LAUNCH_DATE: '2025-07-01T00:00:00',
    REDIRECT_URL: '/turbowarp/',
    EMAIL_USER: 's2024131',
    EMAIL_DOMAIN: 'mykwanghua.edu.my'
};

// DOM 元素
const elements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    emailLink: document.getElementById('emailLink'),
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.querySelector('.theme-icon'),
    mainTitle: document.getElementById('main-title'),
    subtitle: document.querySelector('.subtitle')
};

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    elements.themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// 切换主题
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    elements.themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // 添加切换动画
    elements.themeIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        elements.themeIcon.style.transform = 'scale(1)';
    }, 200);
}

// 防爬虫邮箱处理
function setupEmail() {
    elements.emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `mailto:${CONFIG.EMAIL_USER}@${CONFIG.EMAIL_DOMAIN}`;
    });
}

// 更新倒计时显示
function updateCountdownDisplay(diff) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elements.days.textContent = days.toString().padStart(2, '0');
    elements.hours.textContent = hours.toString().padStart(2, '0');
    elements.minutes.textContent = minutes.toString().padStart(2, '0');
    elements.seconds.textContent = seconds.toString().padStart(2, '0');
}

// 处理倒计时结束
function handleLaunch() {
    elements.mainTitle.textContent = "We're Live!";
    elements.subtitle.textContent = "Redirecting to TurboWarp...";
    
    // 添加庆祝样式
    document.body.classList.add('launched');
    
    // 5秒后跳转
    setTimeout(() => {
        window.location.href = CONFIG.REDIRECT_URL;
    }, 5000);
}

// 主倒计时函数
function startCountdown() {
    const launchDate = new Date(CONFIG.LAUNCH_DATE);
    const now = new Date();
    const diff = launchDate - now;

    if (diff <= 0) {
        handleLaunch();
        return;
    }

    updateCountdownDisplay(diff);
    setTimeout(startCountdown, 1000);
}

// 检测移动设备
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 移动设备优化
function optimizeForMobile() {
    if (isMobile()) {
        document.documentElement.classList.add('mobile');
        // 可以添加移动端专属优化
    }
}

// 初始化
function init() {
    initTheme();
    setupEmail();
    optimizeForMobile();
    startCountdown();
    
    // 主题切换事件
    elements.themeToggle.addEventListener('click', toggleTheme);
}

// 启动
document.addEventListener('DOMContentLoaded', init);