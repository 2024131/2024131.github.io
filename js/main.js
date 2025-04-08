const CONFIG = {
    DEFAULT_PROJECT: '96708264',
    TURBOWARP_URL: 'https://turbowarp.org/{id}/embed',
    SCRATCH_URL: 'https://scratch.mit.edu/projects/{id}/embed',
    LOAD_TIMEOUT: 10000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 3000,
    THEME_KEY: 'lytTurboWarp_theme',
    VERSION: '1.0.0'
};

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

const state = {
    currentProject: null,
    isLoading: false,
    retryCount: 0,
    currentTheme: 'dark',
    loadStartTime: null,
    fpsInterval: null
};

function init() {
    setCurrentYear();
    setupEventListeners();
    loadInitialProject();
    initTheme();
    createParticles();
    setupPresetButtons();
    initMatrixRain();
    document.addEventListener('mousemove', updateLightPosition);
}

function setCurrentYear() {
    DOM.year.textContent = new Date().getFullYear();
}

function setupEventListeners() {
    DOM.loadBtn.addEventListener('click', loadProjectFromInput);
    DOM.projectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadProjectFromInput();
    });
    DOM.retryBtn.addEventListener('click', retryLoading);
    DOM.turbowarpBtn.addEventListener('click', openInTurboWarp);
    DOM.scratchBtn.addEventListener('click', openInScratch);
    DOM.fullscreenBtn.addEventListener('click', toggleFullscreen);
    DOM.themeToggle.addEventListener('click', toggleTheme);
    DOM.screenshotBtn.addEventListener('click', takeScreenshot);
    DOM.reloadBtn.addEventListener('click', reloadProject);
    DOM.settingsBtn.addEventListener('click', openSettings);
    DOM.iframe.addEventListener('load', handleIframeLoad);
    DOM.iframe.addEventListener('error', handleIframeError);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('focus', startFPSMonitoring);
    window.addEventListener('blur', stopFPSMonitoring);
}

function setupPresetButtons() {
    document.querySelectorAll('.project-thumb').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.id;
            DOM.projectInput.value = projectId;
            loadProject(projectId);
        });
    });
}

function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    document.getElementById('matrixRain').appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュル
