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
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.dataset.id;
            DOM.projectInput.value = projectId;
            loadProject(projectId);
        });
    });
}

function loadInitialProject() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || CONFIG.DEFAULT_PROJECT;
    loadProject(projectId);
}

function loadProjectFromInput() {
    const projectId = DOM.projectInput.value.trim();
    if (!projectId) return;
    window.history.pushState({}, '', `?id=${projectId}`);
    loadProject(projectId);
}

function loadProject(projectId) {
    if (state.isLoading) return;

    state.currentProject = projectId;
    state.isLoading = true;
    state.retryCount = 0;
    state.loadStartTime = Date.now();

    showLoadingState();
    updateProjectInfo('Loading', projectId, 'TurboWarp', '-', '-');
    animateProgressBar();
    updateIframeSource(projectId);

    setTimeout(() => {
        if (state.isLoading) {
            handleLoadFailure();
        }
    }, CONFIG.LOAD_TIMEOUT);
}

function animateProgressBar() {
    if (DOM.progressFill) {
        DOM.progressFill.style.animation = 'progress-loading 2s infinite ease-in-out';
    }
}

function stopProgressBar() {
    if (DOM.progressFill) {
        DOM.progressFill.style.animation = 'none';
        DOM.progressFill.style.width = '100%';
    }
}

function updateIframeSource(projectId) {
    DOM.iframe.src = CONFIG.TURBOWARP_URL.replace('{id}', projectId);
    DOM.turbowarpBtn.href = `https://turbowarp.org/${projectId}`;
    DOM.scratchBtn.href = `https://scratch.mit.edu/projects/${projectId}`;
}

function showLoadingState() {
    DOM.loading.style.display = 'flex';
    DOM.error.style.display = 'none';
    DOM.iframe.classList.remove('active');
    updateStatusBadge('loading');
}

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

function showErrorState() {
    state.isLoading = false;
    DOM.loading.style.display = 'none';
    DOM.error.style.display = 'flex';
    stopProgressBar();
    updateProjectInfo('Error', state.currentProject, 'TurboWarp', '-', '-');
    updateStatusBadge('error');
    stopFPSMonitoring();
}

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

function updateStatusBadge(status) {
    if (!DOM.projectStatus) return;
    DOM.projectStatus.className = 'status-badge';
    DOM.projectStatus.classList.add(status);
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

function updateTimestamp() {
    if (DOM.projectTimestamp) {
        const now = new Date();
        DOM.projectTimestamp.textContent = now.toLocaleTimeString();
    }
}

