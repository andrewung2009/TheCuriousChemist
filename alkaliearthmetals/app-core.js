// Global variables
let currentUser = null;
let userData = null;
let currentSection = 'overview';
let completedSections = [];
let soundEnabled = true;

// Sound effects
const correctSound = new Howl({
    src: ['https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3']
});

const incorrectSound = new Howl({
    src: ['https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3']
});

const completeSound = new Howl({
    src: ['https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3']
});

const badgeSound = new Howl({
    src: ['https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3']
});

// Initialize app
function initApp() {
    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            loadUserData();
        } else {
            showLandingPage();
        }
    });
    
    // Check for saved sound preference
    if (localStorage.getItem('soundEnabled') === 'false') {
        soundEnabled = false;
    }
    
    // Initialize section features
    initializeSectionFeatures();
}

// Navigation functions
function navigateToSection(sectionName) {
    // Check if section is locked
    const navItem = document.getElementById(`nav-${sectionName}`);
    if (navItem && navItem.classList.contains('locked')) {
        showToast('info', 'Section Locked', 'Please complete previous sections first.');
        return;
    }
    
    // Handle reactions section separately
    if (sectionName === 'reactions') {
        showReactionsSection();
        return;
    }
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const sectionElement = document.getElementById(`${sectionName}-section`);
    if (sectionElement) {
        sectionElement.style.display = 'block';
    }
    
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    if (navItem) {
        navItem.classList.add('active');
    }
    
    currentSection = sectionName;
    
    // Initialize graphs if data visualization tab is selected
    if (sectionName === 'properties' && !mainChart) {
        setTimeout(() => {
            const dataVizTab = document.getElementById('data-visualization');
            if (dataVizTab && dataVizTab.classList.contains('active')) {
                initializeGraphs();
            }
        }, 100);
    }
    
    // Initialize section-specific features
    setTimeout(() => {
        initializeSectionFeatures();
    }, 100);
}

// Show main app
function showMainApp() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Update user info
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    if (userNameElement) userNameElement.textContent = userData.displayName || 'User';
    if (userEmailElement) userEmailElement.textContent = currentUser.email || 'user@example.com';
    
    // Update XP and badges
    updateUserXP();
    updateUserBadges();
    
    // Update progress
    updateProgressTracker();
    updateSectionCompletionStatus();
}

// Show landing page
function showLandingPage() {
    document.getElementById('landingPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

// Tab functions
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Add active class to clicked tab
    const activeTab = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Initialize graphs if data visualization tab is selected
    if (tabName === 'data-visualization' && !mainChart) {
        setTimeout(() => {
            initializeGraphs();
        }, 100);
    }
}

// Toast notification function
function showToast(type, title, message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') {
        icon = '<i class="fas fa-check-circle toast-icon"></i>';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle toast-icon"></i>';
    } else if (type === 'info') {
        icon = '<i class="fas fa-info-circle toast-icon"></i>';
    }
    
    toast.innerHTML = `
        ${icon}
        <div class="toast-message">
            <div class="toast-title">${title}</div>
            <div class="toast-description">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 400);
    }, 4000);
}

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Initialize the app when the page loads
window.addEventListener('DOMContentLoaded', function() {
    initApp();
    
    // Add mobile menu toggle
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.onclick = toggleSidebar;
        mainContent.prepend(mobileMenuBtn);
    }
});
