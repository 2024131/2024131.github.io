// Configuration
const CONFIG = {
    DEFAULT_PROJECT: '96708264',  // Sample Scratch project (Paper Minecraft)
    TURBOWARP_URL: 'https://turbowarp.org/{id}/embed',
    SCRATCH_URL: 'https://scratch.mit.edu/projects/{id}/embed',
    LOAD_TIMEOUT: 10000,  // 10 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 3000,  // 3 seconds
    THEME_KEY: 'turboView_theme'
};

// DOM Elements
const DOM = {
    iframe: document.getElementById('projectFrame'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    success: document.querySelector('.success-message'),
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
    viewerContainer: document.getElementById('viewerContainer')
};

// Application State
const state = {
    currentProject: null,
    isLoading: false,
    retryCount: 0,
    currentTheme: 'dark'
};

// Initialize the application
function init() {
    setCurrentYear();
    setupEventListeners();
    loadInitialProject();
    initTheme();
    createParticles();
}

// Set current year in footer
function setCurrentYear() {
    DOM.year.textContent = new Date().getFullYear();
}

// Set up event listeners
function setupEventListeners() {
    // Load project
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

    // Iframe events
    DOM.iframe.addEventListener('load', handleIframeLoad);
    DOM.iframe.addEventListener('error', handleIframeError);

    // Handle browser history changes
    window.addEventListener('popstate', handlePopState);
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

    // Update UI
    showLoadingState();
    updateProjectInfo('Loading...', projectId, 'TurboWarp');
    updateIframeSource(projectId);

    // Set timeout for loading failure
    setTimeout(() => {
        if (state.isLoading) {
            handleLoadFailure();
        }
    }, CONFIG.LOAD_TIMEOUT);
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
    if (DOM.success) DOM.success.style.display = 'none';
    DOM.iframe.classList.remove('active');
}

// Show success state
function showSuccessState() {
    state.isLoading = false;
    DOM.loading.style.display = 'none';
    DOM.error.style.display = 'none';
    if (DOM.success) DOM.success.style.display = 'block';
    DOM.iframe.classList.add('active');
    DOM.projectInput.value = state.currentProject;
    updateProjectInfo('Loaded', state.currentProject, 'TurboWarp');
}

// Show error state
function showErrorState() {
    state.isLoading = false;
    DOM.loading.style.display = 'none';
    DOM.error.style.display = 'flex';
    if (DOM.success) DOM.success.style.display = 'none';
    updateProjectInfo('Error', state.currentProject, 'TurboWarp');
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
    
    // Update toggle button
    const icon = theme === 'dark' ? 'moon' : 'sun';
    DOM.themeToggle.innerHTML = `<i class="fas fa-${icon}"></i> ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
}

// Handle browser history navigation
function handlePopState() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (projectId && projectId !== state.currentProject) {
        loadProject(projectId);
    }
}

// Update project info panel
function updateProjectInfo(status, id, source) {
    if (DOM.projectStatus) DOM.projectStatus.textContent = status;
    if (DOM.projectIdDisplay) DOM.projectIdDisplay.textContent = id;
    if (DOM.projectSource) DOM.projectSource.textContent = source;
    
    // Update status color
    if (DOM.projectStatus) {
        DOM.projectStatus.style.color = 
            status === 'Loaded' ? 'var(--success)' :
            status === 'Error' ? 'var(--error)' : 'var(--warning)';
    }
}

// Create particle effect
function createParticles() {
    const colors = ['rgba(110, 69, 226, 0.5)', 'rgba(136, 211, 206, 0.5)'];
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    const container = document.getElementById('particles');

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 15 + 5;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * -20;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${duration}s linear ${delay}s infinite`,
            opacity: Math.random() * 0.5 + 0.1,
            borderRadius: '50%',
            position: 'absolute',
            zIndex: '-1'
        });
        
        container.appendChild(particle);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
