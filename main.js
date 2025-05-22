// 配置设置
const CONFIG = {
    LAUNCH_DATE: new Date('2025-07-01T00:00:00'),
    REDIRECT_URL: '/turbowarp/',  // 指向子目录
    COUNTDOWN_END_MESSAGE: 'Redirecting to TurboWarp...'
};

// 防爬虫邮箱处理
document.getElementById('emailLink').addEventListener('click', function(e) {
    e.preventDefault();
    const parts = ['s2024131', 'mykwanghua.edu.my'];
    window.location.href = `mailto:${parts[0]}@${parts[1]}`;
});

// 倒计时主函数
function updateCountdown() {
    const now = new Date();
    const diff = CONFIG.LAUNCH_DATE - now;

    if (diff <= 0) {
        handleCountdownEnd();
        return;
    }

    updateDisplay(diff);
    setTimeout(updateCountdown, 1000);
}

function updateDisplay(diff) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

function handleCountdownEnd() {
    document.querySelector('h1').textContent = 'We Are Live!';
    document.querySelector('p').textContent = CONFIG.COUNTDOWN_END_MESSAGE;
    
    // 3秒后跳转
    setTimeout(() => {
        window.location.href = CONFIG.REDIRECT_URL;
    }, 3000);
}

// 启动倒计时
updateCountdown();