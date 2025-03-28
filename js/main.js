// Configuration
const CONFIG = {
    DEFAULT_PROJECT: '96708264',  // Paper Minecraft
    TURBOWARP_URL: 'https://turbowarp.org/{id}/embed',
    SCRATCH_URL: 'https://scratch.mit.edu/projects/{id}/embed',
    LOAD_TIMEOUT: 10000,  // 10 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 3000,  // 3 seconds
    THEME_KEY: 'lytTurboWarp_theme',
    VERSION: '1.0.0'
};

// DOM Elements
const DOM = {
    iframe: document.getElementById('projectFrame'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    projectInput: document.getElementById('projectIdInput'),
    loadBtn: document.getElementById('loadBtn'),
    retryBtn: document.getElementById('retryBtn'),
    turbowarpBtn: document.getElementById('turbowarpBtn'),
    scratchBtn: document.getElementById('scratchBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    themeToggle: document.getElementById('themeToggle'),
    year: document.getElementById('year'),
    projectStatus: document.getElementById('projectStatus'),
    projectIdDisplay: document.getElementById('projectIdDisplay'),
    projectSource: document.getElementById('projectSource'),
    projectFPS: document.getElementById('projectFPS'),
    projectLoadTime: document.getElementById('projectLoadTime'),
    projectTimestamp: document.getElementById('projectTimestamp'),
    viewerContainer: document.getElementById('viewerContainer'),
    progressFill: document.querySelector('.progress-fill'),
    screenshotBtn: document.getElementById('screenshotBtn'),
    reloadBtn: document.getElementById('reloadBtn'),
    settingsBtn: document.getElementById('settingsBtn')
};

// Application State
const state = {
    currentProject: null,
    isLoading: false,
    retryCount: 0,
    currentTheme: 'dark',
    loadStartTime: null,
    fpsInterval: null
};

// Initialize the application
function init() {
    setCurrentYear();
    setupEventListeners();
    loadInitialProject();
    initTheme();
    createParticles();
    setupPresetButtons();
}

// Set current year in footer
function setCurrentYear() {
    DOM.year.textContent = new Date().getFullYear();
}

// Set up event listeners
function setupEventListeners() {
    // Project loading
    DOM.loadBtn.addEventListener('click', loadProjectFromInput);
    DOM.projectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadProjectFromInput();
    });

    // Error handling
    DOM.retryBtn.addEventListener('click', retryLoading);
    DOM.turbowarpBtn.addEventListener('click', openInTurboWarp);
    DOM.scratchBtn.addEventListener('click', openInScratch);

    // UI controls
    DOM.fullscreenBtn.addEventListener('click', toggleFullscreen);
    DOM.themeToggle.addEventListener('click', toggleTheme);
    DOM.screenshotBtn.addEventListener('click', takeScreenshot);
    DOM.reloadBtn.addEventListener('click', reloadProject);
    DOM.settingsBtn.addEventListener('click', openSettings);

    // Iframe events
    DOM.iframe.addEventListener('load', handleIframeLoad);
    DOM.iframe.addEventListener('error', handleIframeError);

    // Handle browser history changes
    window.addEventListener('popstate', handlePopState);

    // Performance monitoring
    window.addEventListener('focus', startFPSMonitoring);
    window.addEventListener('blur', stopFPSMonitoring);
}

// Setup preset project buttons
function setupPresetButtons() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.id;
            DOM.projectInput.value = projectId;
            loadProject(projectId);
        });
    });
}

// Load initial project from URL or default
function loadInitialProject() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || CONFIG.DEFAULT_PROJECT;
    loadProject(projectId);
}

// Load project from input field
function loadProjectFromInput() {
    const projectId = DOM.projectInput.value.trim();
    if (!projectId) return;

    // Update URL without reload
    window.history.pushState({}, '', `?id=${projectId}`);
    loadProject(projectId);
}

// Main project loading function
function loadProject(projectId) {
    if (state.isLoading) return;

    state.currentProject = projectId;
    state.isLoading = true;
    state.retryCount = 0;
    state.loadStartTime = Date.now();

    // Update UI
    showLoadingState();
    updateProjectInfo('Loading', projectId, 'TurboWarp', '-', '-');
    animateProgressBar();
    updateIframeSource(projectId);

    // Set timeout for loading failure
    setTimeout(() => {
        if (state.isLoading) {
            handleLoadFailure();
        }
    }, CONFIG.LOAD_TIMEOUT);
}

// Animate progress bar during loading
function animateProgressBar() {
    if (DOM.progressFill) {
        DOM.progressFill.style.animation = 'progress-loading 2s infinite ease-in-out';
    }
}

// Stop progress bar animation
function stopProgressBar() {
    if (DOM.progressFill) {
        DOM.progressFill.style.animation = 'none';
        DOM.progressFill.style.width = '100%';
    }
}

// Update iframe source URL
function updateIframeSource(projectId) {
    DOM.iframe.src = CONFIG.TURBOWARP_URL.replace('{id}', projectId);
    DOM.turbowarpBtn.href = `https://turbowarp.org/${projectId}`;
    DOM.scratchBtn.href = `https://scratch.mit.edu/projects/${projectId}`;
}

// Show loading state
function showLoadingState() {
    DOM.loading.style.display = 'flex';
    DOM.error.style.display = 'none';
    DOM.iframe.classList.remove('active');
    updateStatusBadge('loading');
}

// Show success state
function showSuccessState() {
    state.isLoading = false;
    DOM.loading.style.display = 'none';
    DOM.error.style.display = 'none';
    DOM.iframe.classList.add('active');
    DOM.projectInput.value = state.currentProject;
    stopProgressBar();
    
    const loadTime = ((Date.now() - state.loadStartTime) / 1000).toFixed(2);
    updateProjectInfo('Loaded', state.currentProject, 'TurboWarp', '-', `${loadTime}s`);
    updateStatusBadge('success');
    updateTimestamp();
    startFPSMonitoring();
}

// Show error state
function showErrorState() {
    state.isLoading = false;
    DOM.loading.style.display = 'none';
    DOM.error.style.display = 'flex';
    stopProgressBar();
    updateProjectInfo('Error', state.currentProject, 'TurboWarp', '-', '-');
    updateStatusBadge('error');
    stopFPSMonitoring();
}

// Update project info panel
function updateProjectInfo(status, id, source, fps, loadTime) {
    if (DOM.projectStatus) {
        DOM.projectStatus.textContent = status;
        updateStatusBadge(status.toLowerCase());
    }
    if (DOM.projectIdDisplay) DOM.projectIdDisplay.textContent = id;
    if (DOM.projectSource) DOM.projectSource.textContent = source;
    if (DOM.projectFPS) DOM.projectFPS.textContent = fps;
    if (DOM.projectLoadTime) DOM.projectLoadTime.textContent = loadTime;
}

// Update status badge
function updateStatusBadge(status) {
    if (!DOM.projectStatus) return;
    
    DOM.projectStatus.className = 'status-badge';
    DOM.projectStatus.classList.add(status);
    
    // Update colors based on status
    switch(status) {
        case 'loading':
            DOM.projectStatus.style.color = 'var(--warning)';
            break;
        case 'loaded':
        case 'success':
            DOM.projectStatus.style.color = 'var(--success)';
            break;
        case 'error':
            DOM.projectStatus.style.color = 'var(--error)';
            break;
        default:
            DOM.projectStatus.style.color = 'var(--text-secondary)';
    }
}

// Update last loaded timestamp
function updateTimestamp() {
    if (DOM.projectTimestamp) {
        const now = new Date();
        DOM.projectTimestamp.textContent = now.toLocaleTimeString();
    }
}

// Handle iframe load event
function handleIframeLoad() {
    // Additional verification for error pages
    try {
        // Check for TurboWarp error messages
        if (DOM.iframe.contentDocument?.body?.innerText.includes("Couldn't load project")) {
            handleLoadFailure();
        } else {
            handleLoadSuccess();
        }
    } catch (e) {
        // Cross-origin error usually means it loaded successfully
        handleLoadSuccess();
    }
}

// Handle iframe error event
function handleIframeError() {
    handleLoadFailure();
}

// Handle successful load
function handleLoadSuccess() {
    state.retryCount = 0;
    showSuccessState();
}

// Handle failed load
function handleLoadFailure() {
    state.retryCount++;
    
    if (state.retryCount < CONFIG.MAX_RETRIES) {
        setTimeout(() => {
            updateIframeSource(state.currentProject);
        }, CONFIG.RETRY_DELAY);
    } else {
        showErrorState();
    }
}

// Retry loading current project
function retryLoading() {
    loadProject(state.currentProject);
}

// Open project in TurboWarp
function openInTurboWarp() {
    window.open(`https://turbowarp.org/${state.currentProject}`, '_blank');
}

// Open project in Scratch
function openInScratch() {
    window.open(`https://scratch.mit.edu/projects/${state.currentProject}`, '_blank');
}

// Reload current project
function reloadProject() {
    loadProject(state.currentProject);
}

// Take screenshot of the project
function takeScreenshot() {
    if (!DOM.iframe.classList.contains('active')) return;
    
    try {
        // This only works if the iframe is from the same origin
        const canvas = document.createElement('canvas');
        const iframeDoc = DOM.iframe.contentDocument || DOM.iframe.contentWindow.document;
        const iframeBody = iframeDoc.body;
        
        canvas.width = iframeBody.scrollWidth;
        canvas.height = iframeBody.scrollHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawWindow(DOM.iframe.contentWindow, 0, 0, canvas.width, canvas.height, 'white');
        
        const link = document.createElement('a');
        link.download = `lyt-turbowarp-${state.currentProject}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (e) {
        // Fallback for cross-origin iframes
        alert('Screenshot not available for cross-origin projects. Use the browser\'s screenshot tool instead.');
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        DOM.viewerContainer.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'dark';
    setTheme(savedTheme);
}

function toggleTheme() {
    const newTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem(CONFIG.THEME_KEY, newTheme);
}

function setTheme(theme) {
    state.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle button icon
    const icon = theme === 'dark' ? 'moon' : 'sun';
    DOM.themeToggle.innerHTML = `<i class="fas fa-${icon}"></i>`;
}

// Handle browser history navigation
function handlePopState() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (projectId && projectId !== state.currentProject) {
        loadProject(projectId);
    }
}

// FPS monitoring
function startFPSMonitoring() {
    if (!DOM.iframe.classList.contains('active') || state.fpsInterval) return;
    
    let lastTime = Date.now();
    let frameCount = 0;
    let fps = 0;
    
    state.fpsInterval = setInterval(() => {
        const now = Date.now();
        frameCount++;
        
        if (now - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (now - lastTime));
            if (DOM.projectFPS) DOM.projectFPS.textContent = fps;
            frameCount = 0;
            lastTime = now;
        }
    }, 100);
}

function stopFPSMonitoring() {
    if (state.fpsInterval) {
        clearInterval(state.fpsInterval);
        state.fpsInterval = null;
    }
    if (DOM.projectFPS) DOM.projectFPS.textContent = '-';
}

// Open settings dialog
function openSettings() {
    // Placeholder for settings functionality
    alert('Settings panel will be implemented in a future version');
}

// Create particle effect
function createParticles() {
    const colors = ['rgba(123, 44, 191, 0.3)', 'rgba(0, 187, 249, 0.3)'];
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    const container = document.getElementById('particles');

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * -20;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${duration}s linear ${delay}s infinite`,
            opacity: Math.random() * 0.3 + 0.1,
            borderRadius: '50%',
            position: 'absolute',
            zIndex: '-1'
        });
        
        container.appendChild(particle);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
