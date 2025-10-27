// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOp4x0lTFvmt2s3MQKBRYmZT9IJ2ZaRi8",
    authDomain: "group-1-alkali-metals.firebaseapp.com",
    databaseURL: "https://group-1-alkali-metals-default-rtdb.firebaseio.com",
    projectId: "group-1-alkali-metals",
    storageBucket: "group-1-alkali-metals.firebasestorage.app",
    messagingSenderId: "806417495419",
    appId: "1:806417495419:web:5b80607e8a23e96da4f9de",
    measurementId: "G-S76E52MQ37"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Create a dedicated reference for Group 2 Metals data
const group2MetalsRef = database.ref('Group2Metals');

// Global variables
let currentUser = null;
let userData = null;
let currentSection = 'overview';
let completedSections = [];
let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let answerSubmitted = false;
let quizAnswers = [];
let soundEnabled = true;

// Graph Data and Configuration
const elementData = {
    'Be': {
        name: 'Beryllium',
        atomicNumber: 4,
        meltingPoint: 1287,
        density: 1.85,
        reactivity: 1,
        atomicRadius: 112,
        color: '#FF6384'
    },
    'Mg': {
        name: 'Magnesium',
        atomicNumber: 12,
        meltingPoint: 650,
        density: 1.74,
        reactivity: 3,
        atomicRadius: 150,
        color: '#36A2EB'
    },
    'Ca': {
        name: 'Calcium',
        atomicNumber: 20,
        meltingPoint: 842,
        density: 1.55,
        reactivity: 5,
        atomicRadius: 180,
        color: '#FFCE56'
    },
    'Sr': {
        name: 'Strontium',
        atomicNumber: 38,
        meltingPoint: 777,
        density: 2.64,
        reactivity: 7,
        atomicRadius: 200,
        color: '#4BC0C0'
    },
    'Ba': {
        name: 'Barium',
        atomicNumber: 56,
        meltingPoint: 727,
        density: 3.62,
        reactivity: 9,
        atomicRadius: 215,
        color: '#9966FF'
    },
    'Ra': {
        name: 'Radium',
        atomicNumber: 88,
        meltingPoint: 700,
        density: 5.5,
        reactivity: 10,
        atomicRadius: 221,
        color: '#FF9F40'
    }
};

// Global chart variables
let mainChart = null;
let currentGraphType = 'melting-point';
let selectedElements = ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'];
let animationEnabled = true;

// Graph Quiz Questions
const graphQuizQuestions = [
    {
        question: "Based on the melting point graph, which element has the highest melting point?",
        options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
        correct: 0,
        explanation: "Beryllium has the highest melting point (1287°C) due to its small atomic size and strong metallic bonding."
    },
    {
        question: "What trend do you observe in the density graph as you move down Group 2?",
        options: ["Density decreases", "Density increases", "Density remains constant", "No clear pattern"],
        correct: 1,
        explanation: "Density generally increases down Group 2 as atomic mass increases more significantly than atomic volume."
    },
    {
        question: "Which element shows the most dramatic change in reactivity compared to the others?",
        options: ["Beryllium", "Magnesium", "Strontium", "Barium"],
        correct: 0,
        explanation: "Beryllium shows the lowest reactivity (index 1) compared to other elements, making it an exception in the group."
    },
    {
        question: "In the correlation graph, what relationship exists between atomic radius and reactivity?",
        options: ["No correlation", "Positive correlation", "Negative correlation", "Inverse relationship"],
        correct: 1,
        explanation: "There's a positive correlation between atomic radius and reactivity - as atomic radius increases, reactivity increases."
    }
];

let currentQuizQuestion = null;

// Quiz questions for terms
const termQuizQuestions = {
    'beryllium': {
        question: "What is the atomic number of Beryllium?",
        options: ["2", "3", "4", "5"],
        correct: 2,
        explanation: "Beryllium has an atomic number of 4, meaning it has 4 protons in its nucleus."
    },
    'magnesium': {
        question: "What color flame does Magnesium produce when burned?",
        options: ["Red", "Yellow", "Green", "Bright white"],
        correct: 3,
        explanation: "Magnesium produces a bright white flame when burned, which is why it's used in fireworks and flares."
    },
    'calcium': {
        question: "How does Calcium react with cold water?",
        options: ["No reaction", "Fizzes slowly", "Fizzes steadily", "Fizzes violently"],
        correct: 2,
        explanation: "Calcium reacts steadily with cold water, producing calcium hydroxide and hydrogen gas."
    },
    'alkaline-earth-metals': {
        question: "Why are Group 2 elements called alkaline earth metals?",
        options: ["They are alkaline in nature", "They form alkaline solutions with water", "Their oxides form alkaline solutions in water", "They react with alkalis"],
        correct: 2,
        explanation: "Group 2 elements are called alkaline earth metals because their oxides react with water to form alkaline (basic) solutions."
    },
    'valence-electrons': {
        question: "How many valence electrons do Group 2 elements have?",
        options: ["1", "2", "3", "7"],
        correct: 1,
        explanation: "All Group 2 elements have 2 valence electrons in their outer shell, which they readily lose to form +2 ions."
    }
};

// Element details
const elementDetails = {
    'Beryllium': {
        symbol: 'Be',
        atomicNumber: 4,
        electronConfig: '2,2',
        meltingPoint: '1287°C',
        density: '1.85 g/cm³',
        reactivity: 'Lowest in group',
        uses: 'Aerospace alloys, X-ray windows, nuclear reactors',
        fact: 'Beryllium is transparent to X-rays and is used in X-ray windows.',
        quizQuestion: "What is the primary use of Beryllium in aerospace applications?",
        quizOptions: [
            "Fuel for rockets",
            "Lightweight structural alloys",
            "Thermal insulation",
            "Electrical wiring"
        ],
        quizCorrect: 1,
        quizExplanation: "Beryllium is used in lightweight structural alloys for aerospace applications due to its high strength-to-weight ratio and stiffness."
    },
    'Magnesium': {
        symbol: 'Mg',
        atomicNumber: 12,
        electronConfig: '2,8,2',
        meltingPoint: '650°C',
        density: '1.74 g/cm³',
        reactivity: 'Moderate',
        uses: 'Alloys, fireworks, medicine',
        fact: 'Magnesium is essential for human health and is involved in over 300 biochemical reactions.',
        quizQuestion: "What compound of Magnesium is commonly used as a supplement?",
        quizOptions: [
            "Magnesium hydroxide",
            "Magnesium carbonate",
            "Magnesium oxide",
            "Magnesium sulfate"
        ],
        quizCorrect: 2,
        explanation: "Magnesium oxide is commonly used as a dietary supplement to prevent and treat low levels of magnesium in the blood."
    },
    'Calcium': {
        symbol: 'Ca',
        atomicNumber: 20,
        electronConfig: '2,8,8,2',
        meltingPoint: '842°C',
        density: '1.55 g/cm³',
        reactivity: 'Moderate to high',
        uses: 'Building materials, cement, bones',
        fact: 'Calcium is the most abundant mineral in the human body and is essential for bone health.',
        quizQuestion: "Why is Calcium important for the human body?",
        quizOptions: [
            "It strengthens bones and teeth",
            "It aids in muscle contraction and nerve function",
            "It helps in blood clotting",
            "All of the above"
        ],
        quizCorrect: 3,
        quizExplanation: "Calcium is essential for all these functions: strengthening bones and teeth, muscle contraction, nerve function, and blood clotting."
    },
    'Strontium': {
        symbol: 'Sr',
        atomicNumber: 38,
        electronConfig: '2,8,18,8,2',
        meltingPoint: '777°C',
        density: '2.64 g/cm³',
        reactivity: 'High',
        uses: 'Fireworks, ceramics, magnets',
        fact: 'Strontium-90 is a radioactive isotope used in medical applications and nuclear power.',
        quizQuestion: "What is Strontium primarily used for in fireworks?",
        quizOptions: [
            "Creating white sparks",
            "Creating red color",
            "Creating blue color",
            "Creating sound effects"
        ],
        quizCorrect: 1,
        quizExplanation: "Strontium compounds are used in fireworks to create a brilliant red color due to their characteristic crimson flame."
    },
    'Barium': {
        symbol: 'Ba',
        atomicNumber: 56,
        electronConfig: '2,8,18,18,8,2',
        meltingPoint: '727°C',
        density: '3.62 g/cm³',
        reactivity: 'Very high',
        uses: 'Medical imaging, drilling fluids, vacuum tubes',
        fact: 'Barium sulfate is used in medical imaging because it\'s opaque to X-rays but safe to ingest.',
        quizQuestion: "Why is Barium sulfate used in medical imaging?",
        quizOptions: [
            "It's radioactive and can be tracked",
            "It's opaque to X-rays but safe to ingest",
            "It enhances MRI contrast",
            "It's fluorescent under UV light"
        ],
        quizCorrect: 1,
        quizExplanation: "Barium sulfate is used in medical imaging because it's opaque to X-rays, allowing doctors to see the digestive tract, but it's insoluble and safe to ingest."
    },
    'Radium': {
        symbol: 'Ra',
        atomicNumber: 88,
        electronConfig: '2,8,18,32,18,8,2',
        meltingPoint: '700°C',
        density: '5.5 g/cm³',
        reactivity: 'Highest',
        uses: 'Cancer treatment, research',
        fact: 'Radium is highly radioactive and was discovered by Marie and Pierre Curie in 1898.',
        quizQuestion: "Why is Radium rarely used today?",
        quizOptions: [
            "It's too expensive to extract",
            "It's highly radioactive and dangerous",
            "It's not reactive enough",
            "It's toxic to humans"
        ],
        quizCorrect: 1,
        quizExplanation: "Radium is highly radioactive and dangerous to handle, which limits its use to specialized medical and research applications."
    }
};

// All MCQ Quiz Questions
quizQuestions = [
    {
        question: "What is the electron configuration of the outer shell of all Group 2 elements?",
        options: ["1 electron", "2 electrons", "8 electrons", "Variable number of electrons"],
        correct: 1,
        explanation: "All Group 2 elements have two electrons in their outer shell, which they readily lose to form +2 ions."
    },
    {
        question: "Which of the following statements about the reactivity of Group 2 metals is correct?",
        options: ["Reactivity decreases down the group", "Reactivity increases down the group", "Reactivity stays the same down the group", "Reactivity is highest for beryllium"],
        correct: 1,
        explanation: "Reactivity increases down Group 2 because the outer electrons are further from the nucleus and easier to lose."
    },
    {
        question: "When Group 2 metals react with water, what products are formed?",
        options: ["Metal oxide and hydrogen", "Metal hydroxide and hydrogen", "Metal oxide and oxygen", "Metal hydroxide and oxygen"],
        correct: 1,
        explanation: "The general equation is: M(s) + 2H₂O(l) → M(OH)₂(aq) + H₂(g)"
    },
    {
        question: "Which Group 2 metal does not react with water at room temperature?",
        options: ["Magnesium", "Calcium", "Strontium", "Barium"],
        correct: 0,
        explanation: "Beryllium does not react with water at room temperature due to its protective oxide layer and high ionization energy."
    },
    {
        question: "What color flame does calcium produce in a flame test?",
        options: ["Red", "Yellow", "Green", "Brick-red"],
        correct: 3,
        explanation: "Calcium produces a brick-red flame in flame tests, which is characteristic of calcium ions."
    },
    {
        question: "Which statement about the melting point of Group 2 metals is correct?",
        options: ["Melting point increases down the group", "Melting point decreases down the group", "Melting point is highest for barium", "Melting point is constant across the group"],
        correct: 1,
        explanation: "The melting point decreases down Group 2 due to increasing atomic size and weaker metallic bonding."
    },
    {
        question: "Which Group 2 metal is used in medical imaging as a contrast agent?",
        options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
        correct: 3,
        explanation: "Barium sulfate is used as a contrast agent in medical imaging because it's opaque to X-rays but safe to ingest."
    },
    {
        question: "What happens when magnesium ribbon is burned in oxygen?",
        options: ["It produces a red flame and forms MgO", "It produces a bright white flame and forms MgO", "It produces a green flame and forms MgO", "It doesn't burn in oxygen"],
        correct: 1,
        explanation: "Magnesium burns with a bright white flame in oxygen to form white magnesium oxide powder."
    },
    {
        question: "Which Group 2 metal is essential for plant growth?",
        options: ["Beryllium", "Magnesium", "Strontium", "Barium"],
        correct: 1,
        explanation: "Magnesium is essential for plant growth as it's the central atom in chlorophyll, the molecule responsible for photosynthesis."
    },
    {
        question: "Which Group 2 metal is used in fireworks to produce a red color?",
        options: ["Beryllium", "Magnesium", "Strontium", "Barium"],
        correct: 2,
        explanation: "Strontium compounds are used in fireworks to produce a brilliant red color due to their characteristic crimson flame."
    }
];

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

// Load user data from Firebase
function loadUserData() {
    const userRef = group2MetalsRef.child('users').child(currentUser.uid);
    userRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            userData = snapshot.val();
            completedSections = userData.completedSections || [];
            showMainApp();
        } else {
            // Create new user profile
            const newUser = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || 'User',
                photoURL: currentUser.photoURL || '',
                completedSections: [],
                xp: 0,
                badges: [],
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            
            userRef.set(newUser).then(() => {
                userData = newUser;
                completedSections = [];
                showMainApp();
            });
        }
    }).catch((error) => {
        console.error("Error loading user data:", error);
        showToast('error', 'Error', 'Failed to load your data.');
    });
}

// Show landing page
function showLandingPage() {
    document.getElementById('landingPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

// Update user XP display
function updateUserXP() {
    const xp = userData.xp || 0;
    const userXPElement = document.getElementById('userXP');
    if (userXPElement) userXPElement.textContent = xp;
}

// Update user badges display
function updateUserBadges() {
    const badges = userData.badges || [];
    const badgesContainer = document.getElementById('userBadges');
    if (!badgesContainer) return;
    
    badgesContainer.innerHTML = '';
    
    if (badges.length === 0) {
        badgesContainer.innerHTML = '<span class="text-sm text-gray-500">No badges yet</span>';
        return;
    }
    
    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge';
        badgeElement.innerHTML = `<i class="fas fa-medal"></i>`;
        badgeElement.title = badge;
        badgesContainer.appendChild(badgeElement);
    });
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

function completeSection(sectionName) {
    if (completedSections.includes(sectionName)) {
        // If already completed, unmark as complete
        unmarkSectionComplete(sectionName);
        return;
    }
    
    completedSections.push(sectionName);
    
    // Award XP
    const xpAwarded = 10;
    const newXp = (userData.xp || 0) + xpAwarded;
    
    // Check for badges
    const newBadges = [...(userData.badges || [])];
    let badgeEarned = false;
    
    if (completedSections.length === 1 && !newBadges.includes('First Steps')) {
        newBadges.push('First Steps');
        badgeEarned = true;
    }
    
    if (completedSections.length === 3 && !newBadges.includes('Metal Master')) {
        newBadges.push('Metal Master');
        badgeEarned = true;
    }
    
    // Save to Firebase
    if (currentUser && userData) {
        const userRef = group2MetalsRef.child('users').child(currentUser.uid);
        const updates = {
            completedSections: completedSections,
            xp: newXp
        };
        
        if (badgeEarned) {
            updates.badges = newBadges;
        }
        
        userRef.update(updates).then(() => {
            userData.xp = newXp;
            if (badgeEarned) {
                userData.badges = newBadges;
            }
            
            updateUserXP();
            updateUserBadges();
            
            if (soundEnabled) {
                completeSound.play();
                if (badgeEarned) badgeSound.play();
            }
            
            showToast('success', 'Section Complete!', `Great job! You've completed this section and earned ${xpAwarded} XP.`);
            
            if (badgeEarned) {
                showToast('success', 'Badge Earned!', `You've earned a new badge: ${newBadges[newBadges.length - 1]}`);
            }
            
            updateSectionCompletionStatus();
            updateProgressTracker();
            
            // Navigate to next section if available
            const sectionOrder = ['overview', 'elements', 'properties', 'quiz'];
            const currentIndex = sectionOrder.indexOf(sectionName);
            if (currentIndex < sectionOrder.length - 1) {
                const nextSection = sectionOrder[currentIndex + 1];
                navigateToSection(nextSection);
            }
        }).catch((error) => {
            console.error("Error saving progress:", error);
            showToast('error', 'Error', 'Failed to save your progress.');
        });
    }
}

function unmarkSectionComplete(sectionName) {
    // Remove from completed sections
    completedSections = completedSections.filter(section => section !== sectionName);
    
    // Update UI
    updateSectionCompletionStatus();
    updateProgressTracker();
    
    // Save to Firebase
    if (currentUser && userData) {
        const userRef = group2MetalsRef.child('users').child(currentUser.uid);
        userRef.update({
            completedSections: completedSections
        }).then(() => {
            showToast('info', 'Section Unmarked', `You've unmarked ${sectionName} as complete.`);
        }).catch((error) => {
            console.error("Error updating progress:", error);
            showToast('error', 'Error', 'Failed to update your progress.');
        });
    }
}

function updateSectionCompletionStatus() {
    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const section = item.id.replace('nav-', '');
        if (completedSections.includes(section)) {
            item.classList.remove('locked');
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    });
    
    // Unlock next sections
    const sectionOrder = ['overview', 'elements', 'properties', 'quiz'];
    sectionOrder.forEach((section, index) => {
        if (completedSections.includes(section) && index < sectionOrder.length - 1) {
            const nextSection = sectionOrder[index + 1];
            const nextNavItem = document.getElementById(`nav-${nextSection}`);
            if (nextNavItem) {
                nextNavItem.classList.remove('locked');
            }
        }
    });
    
    // Check if all sections are completed to unlock quiz
    const allSectionsCompleted = ['overview', 'elements', 'properties'].every(section => 
        completedSections.includes(section)
    );
    
    if (allSectionsCompleted) {
        const quizNavItem = document.getElementById('nav-quiz');
        if (quizNavItem) {
            quizNavItem.classList.remove('locked');
        }
    }
    
    // Update section buttons
    updateSectionButtons();
}

function updateSectionButtons() {
    // Update each section's complete button
    const sections = ['overview', 'elements', 'properties', 'quiz'];
    sections.forEach(section => {
        const button = document.getElementById(`${section}-complete-btn`);
        if (button) {
            if (completedSections.includes(section)) {
                button.innerHTML = '<i class="fas fa-times mr-2"></i>Unmark as Complete';
                button.classList.remove('btn-success');
                button.classList.add('btn-unmark');
            } else {
                button.innerHTML = '<i class="fas fa-check mr-2"></i>Mark as Complete';
                button.classList.remove('btn-unmark');
                button.classList.add('btn-success');
            }
        }
    });
}

function updateProgressTracker() {
    const totalSections = 3; // overview, elements, properties
    const completedCount = completedSections.length;
    const percentage = Math.round((completedCount / totalSections) * 100);
    
    const progressPercentageElement = document.getElementById('progressPercentage');
    const overallProgressFillElement = document.getElementById('overallProgressFill');
    
    if (progressPercentageElement) progressPercentageElement.textContent = `${percentage}%`;
    if (overallProgressFillElement) overallProgressFillElement.style.width = `${percentage}%`;
    
    // Update progress items
    const sections = ['overview', 'elements', 'properties', 'quiz'];
    sections.forEach(section => {
        const progressItem = document.getElementById(`progress-${section}`);
        if (progressItem) {
            const statusElement = progressItem.querySelector('.text-xs');
            if (statusElement) {
                if (completedSections.includes(section)) {
                    progressItem.classList.add('bg-green-100');
                    statusElement.textContent = 'Completed';
                    statusElement.classList.remove('text-gray-500');
                    statusElement.classList.add('text-green-600');
                } else if (section === 'quiz' && completedSections.length === 3) {
                    progressItem.classList.remove('bg-gray-100');
                    progressItem.classList.add('bg-blue-100');
                    statusElement.textContent = 'Available';
                    statusElement.classList.remove('text-gray-500');
                    statusElement.classList.add('text-blue-600');
                }
            }
        }
    });
}

// Interactive element quiz functions
function showElementQuiz(element) {
    const question = termQuizQuestions[element];
    if (!question) return;
    
    const modal = document.getElementById('elementDetailsModal');
    const title = document.getElementById('elementDetailsName');
    const content = document.getElementById('elementDetailsContent');
    
    if (!modal || !title || !content) return;
    
    title.textContent = `${element.charAt(0).toUpperCase() + element.slice(1)} Quiz`;
    
    content.innerHTML = `
        <div class="mb-6">
            <p class="text-lg mb-4">${question.question}</p>
            <div class="space-y-2">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="checkElementQuizAnswer(${index}, ${question.correct}, '${question.explanation}')">
                        <label>${option}</label>
                    </div>
                `).join('')}
            </div>
            <div id="elementQuizFeedback" class="mt-4 p-3 rounded-lg hidden"></div>
        </div>
        <button onclick="closeElementDetails()" class="btn btn-secondary w-full">Close</button>
    `;
    
    modal.classList.add('active');
}

function checkElementQuizAnswer(selectedIndex, correctIndex, explanation) {
    const options = document.querySelectorAll('#elementDetailsContent .quiz-option');
    const feedback = document.getElementById('elementQuizFeedback');
    
    if (!feedback) return;
    
    options.forEach((option, index) => {
        option.onclick = null; // Disable further clicks
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === correctIndex) {
        feedback.className = 'mt-4 p-3 rounded-lg bg-green-100 text-green-800';
        feedback.textContent = 'Correct! ' + explanation;
        if (soundEnabled) correctSound.play();
    } else {
        feedback.className = 'mt-4 p-3 rounded-lg bg-red-100 text-red-800';
        feedback.textContent = 'Incorrect. ' + explanation;
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
}

function showElementDetails(name, symbol, atomicNumber, electronConfig) {
    const details = elementDetails[name];
    if (!details) return;
    
    const modal = document.getElementById('elementDetailsModal');
    const title = document.getElementById('elementDetailsName');
    const content = document.getElementById('elementDetailsContent');
    
    if (!modal || !title || !content) return;
    
    title.textContent = name;
    
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <div class="bg-gray-100 p-5 rounded-lg mb-5">
                    <h3 class="font-semibold text-gray-800 mb-3">Atomic Information</h3>
                    <p><strong>Symbol:</strong> ${details.symbol}</p>
                    <p><strong>Atomic Number:</strong> ${details.atomicNumber}</p>
                    <p><strong>Electron Configuration:</strong> ${details.electronConfig}</p>
                </div>
                <div class="bg-gray-100 p-5 rounded-lg">
                    <h3 class="font-semibold text-gray-800 mb-3">Properties</h3>
                    <p><strong>Melting Point:</strong> ${details.meltingPoint}</p>
                    <p><strong>Density:</strong> ${details.density}</p>
                    <p><strong>Reactivity:</strong> ${details.reactivity}</p>
                </div>
            </div>
            <div>
                <div class="bg-gray-100 p-5 rounded-lg mb-5">
                    <h3 class="font-semibold text-gray-800 mb-3">Uses</h3>
                    <p>${details.uses}</p>
                </div>
                <div class="bg-gray-100 p-5 rounded-lg">
                    <h3 class="font-semibold text-gray-800 mb-3">Fun Fact</h3>
                    <p>${details.fact}</p>
                </div>
            </div>
        </div>
        <div class="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
            <h3 class="font-semibold text-blue-800 mb-3">Quick Quiz</h3>
            <p class="mb-3">${details.quizQuestion}</p>
            <div class="space-y-2">
                ${details.quizOptions.map((option, index) => `
                    <div class="quiz-option" onclick="checkElementDetailsQuizAnswer(${index}, ${details.quizCorrect}, '${details.quizExplanation}')">
                        <label>${option}</label>
                    </div>
                `).join('')}
            </div>
            <div id="elementDetailsQuizFeedback" class="mt-3 p-3 rounded-lg hidden"></div>
        </div>
        <button onclick="closeElementDetails()" class="btn btn-secondary w-full mt-4">Close</button>
    `;
    
    modal.classList.add('active');
}

function checkElementDetailsQuizAnswer(selectedIndex, correctIndex, explanation) {
    const options = document.querySelectorAll('#elementDetailsContent .quiz-option');
    const feedback = document.getElementById('elementDetailsQuizFeedback');
    
    if (!feedback) return;
    
    options.forEach((option, index) => {
        option.onclick = null; // Disable further clicks
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === correctIndex) {
        feedback.className = 'mt-3 p-3 rounded-lg bg-green-100 text-green-800';
        feedback.textContent = 'Correct! ' + explanation;
        if (soundEnabled) correctSound.play();
    } else {
        feedback.className = 'mt-3 p-3 rounded-lg bg-red-100 text-red-800';
        feedback.textContent = 'Incorrect. ' + explanation;
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
}

function closeElementDetails() {
    const modal = document.getElementById('elementDetailsModal');
    if (modal) modal.classList.remove('active');
}

function showTermQuiz(term) {
    const question = termQuizQuestions[term];
    if (!question) return;
    
    const modal = document.getElementById('elementDetailsModal');
    const title = document.getElementById('elementDetailsName');
    const content = document.getElementById('elementDetailsContent');
    
    if (!modal || !title || !content) return;
    
    title.textContent = `Quick Quiz: ${term.replace('-', ' ')}`;
    
    content.innerHTML = `
        <div class="mb-6">
            <p class="text-lg mb-4">${question.question}</p>
            <div class="space-y-2">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="checkTermQuizAnswer(${index}, ${question.correct}, '${question.explanation}')">
                        <label>${option}</label>
                    </div>
                `).join('')}
            </div>
            <div id="termQuizFeedback" class="mt-4 p-3 rounded-lg hidden"></div>
        </div>
        <button onclick="closeElementDetails()" class="btn btn-secondary w-full">Close</button>
    `;
    
    modal.classList.add('active');
}

function checkTermQuizAnswer(selectedIndex, correctIndex, explanation) {
    const options = document.querySelectorAll('#elementDetailsContent .quiz-option');
    const feedback = document.getElementById('termQuizFeedback');
    
    if (!feedback) return;
    
    options.forEach((option, index) => {
        option.onclick = null; // Disable further clicks
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === correctIndex) {
        feedback.className = 'mt-4 p-3 rounded-lg bg-green-100 text-green-800';
        feedback.textContent = 'Correct! ' + explanation;
        if (soundEnabled) correctSound.play();
    } else {
        feedback.className = 'mt-4 p-3 rounded-lg bg-red-100 text-red-800';
        feedback.textContent = 'Incorrect. ' + explanation;
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
}

// =================== //
// GRAPH FUNCTIONS    //
// =================== //

// Initialize graphs when page loads
function initializeGraphs() {
    createMainChart('melting-point');
    populateDataTable();
    loadGraphQuiz();
}

// Create main chart
function createMainChart(type) {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (mainChart) {
        mainChart.destroy();
    }

    const chartConfig = getChartConfig(type);
    mainChart = new Chart(ctx, chartConfig);

    // Update title
    const titles = {
        'melting-point': 'Melting Point Trend',
        'density': 'Density Trend',
        'reactivity': 'Reactivity Trend',
        'comparison': 'Element Properties Comparison',
        'correlation': 'Property Correlations'
    };
    
    const titleElement = document.getElementById('graph-title');
    if (titleElement) {
        titleElement.textContent = titles[type] || 'Interactive Graph';
    }
}

// Get chart configuration based on type
function getChartConfig(type) {
    const visibleElements = selectedElements;
    const labels = visibleElements.map(el => elementData[el].name);
    const colors = visibleElements.map(el => elementData[el].color);

    let datasets = [];

    switch (type) {
        case 'melting-point':
            datasets = [{
                label: 'Melting Point (°C)',
                data: visibleElements.map(el => elementData[el].meltingPoint),
                backgroundColor: colors.map(color => color + '33'),
                borderColor: colors,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: colors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }];
            break;

        case 'density':
            datasets = [{
                label: 'Density (g/cm³)',
                data: visibleElements.map(el => elementData[el].density),
                backgroundColor: colors.map(color => color + '33'),
                borderColor: colors,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: colors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }];
            break;

        case 'reactivity':
            datasets = [{
                label: 'Reactivity Index',
                data: visibleElements.map(el => elementData[el].reactivity),
                backgroundColor: colors.map(color => color + '33'),
                borderColor: colors,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: colors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }];
            break;

        case 'comparison':
            datasets = [
                {
                    label: 'Melting Point (°C)',
                    data: visibleElements.map(el => elementData[el].meltingPoint),
                    backgroundColor: '#FF6384',
                    borderColor: '#FF6384',
                    borderWidth: 2
                },
                {
                    label: 'Density (g/cm³) × 100',
                    data: visibleElements.map(el => elementData[el].density * 100),
                    backgroundColor: '#36A2EB',
                    borderColor: '#36A2EB',
                    borderWidth: 2
                },
                {
                    label: 'Reactivity Index × 100',
                    data: visibleElements.map(el => elementData[el].reactivity * 100),
                    backgroundColor: '#FFCE56',
                    borderColor: '#FFCE56',
                    borderWidth: 2
                }
            ];
            break;

        case 'correlation':
            datasets = [{
                label: 'Elements',
                data: visibleElements.map(el => ({
                    x: elementData[el].atomicRadius,
                    y: elementData[el].reactivity,
                    r: 8,
                    element: el
                })),
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 2
            }];
            break;
    }

    const baseConfig = {
        type: type === 'comparison' ? 'bar' : (type === 'correlation' ? 'bubble' : 'line'),
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: animationEnabled ? 1000 : 0,
                easing: 'easeInOutQuart'
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#cbd5e1',
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#475569',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        afterLabel: function(context) {
                            if (type === 'correlation') {
                                const element = context.raw.element;
                                return `Element: ${elementData[element].name}`;
                            }
                            return '';
                        }
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            },
            scales: type === 'correlation' ? {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Atomic Radius (pm)',
                        color: '#cbd5e1',
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Reactivity Index',
                        color: '#cbd5e1',
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            } : {
                x: {
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: type !== 'melting-point',
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        text: getAxisLabel(type),
                        color: '#cbd5e1',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    };

    return baseConfig;
}

// Get axis label based on graph type
function getAxisLabel(type) {
    const labels = {
        'melting-point': 'Temperature (°C)',
        'density': 'Density (g/cm³)',
        'reactivity': 'Reactivity Index',
        'comparison': 'Value'
    };
    return labels[type] || 'Value';
}

// Switch between different graph types
function switchGraph(type) {
    currentGraphType = type;
    
    // Update button states
    document.querySelectorAll('.graph-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${type}-btn`).classList.add('active');
    
    // Create new chart
    createMainChart(type);
    
    // Update table highlighting
    updateTableHighlighting();
}

// Toggle element visibility
function toggleElement(element) {
    const index = selectedElements.indexOf(element);
    if (index > -1) {
        selectedElements.splice(index, 1);
    } else {
        selectedElements.push(element);
    }
    
    // Sort elements to maintain order
    selectedElements.sort();
    
    // Recreate chart
    createMainChart(currentGraphType);
    
    // Update table
    updateTableHighlighting();
}

// Reset zoom
function resetZoom() {
    if (mainChart) {
        mainChart.resetZoom();
    }
}

// Download graph as image
function downloadGraph() {
    if (!mainChart) return;
    
    const link = document.createElement('a');
    link.download = `group2-${currentGraphType}-chart.png`;
    link.href = mainChart.toBase64Image();
    link.click();
    
    showToast('success', 'Graph Downloaded', 'The chart has been saved as an image.');
}

// Toggle animation
function toggleAnimation() {
    animationEnabled = !animationEnabled;
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');
    
    if (animationEnabled) {
        icon.className = 'fas fa-pause';
        showToast('info', 'Animation Enabled', 'Chart animations are now enabled.');
    } else {
        icon.className = 'fas fa-play';
        showToast('info', 'Animation Disabled', 'Chart animations are now disabled.');
    }
    
    // Recreate chart with new animation setting
    createMainChart(currentGraphType);
}

// Populate data table
function populateDataTable() {
    const tbody = document.getElementById('dataTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    Object.keys(elementData).forEach(element => {
        const data = elementData[element];
        const row = document.createElement('tr');
        row.dataset.element = element;
        
        row.innerHTML = `
            <td>
                <span class="element-color" style="background-color: ${data.color};"></span>
                ${data.name}
            </td>
            <td>${data.atomicNumber}</td>
            <td>${data.meltingPoint}</td>
            <td>${data.density}</td>
            <td>${data.reactivity}</td>
            <td>${data.atomicRadius}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Update table highlighting based on selected elements
function updateTableHighlighting() {
    const rows = document.querySelectorAll('#dataTableBody tr');
    
    rows.forEach(row => {
        const element = row.dataset.element;
        if (selectedElements.includes(element)) {
            row.classList.add('highlighted-row');
        } else {
            row.classList.remove('highlighted-row');
        }
    });
}

// Load graph quiz
function loadGraphQuiz() {
    const questionContainer = document.getElementById('graph-quiz-question');
    const optionsContainer = document.getElementById('graph-quiz-options');
    
    if (!questionContainer || !optionsContainer) return;
    
    // Select random question
    currentQuizQuestion = graphQuizQuestions[Math.floor(Math.random() * graphQuizQuestions.length)];
    
    questionContainer.textContent = currentQuizQuestion.question;
    
    optionsContainer.innerHTML = '';
    currentQuizQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'graph-quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => checkGraphQuizAnswer(index);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Hide feedback
    const feedback = document.getElementById('graph-quiz-feedback');
    if (feedback) {
        feedback.classList.add('hidden');
    }
}

// Check graph quiz answer
function checkGraphQuizAnswer(selectedIndex) {
    if (!currentQuizQuestion) return;
    
    const options = document.querySelectorAll('.graph-quiz-option');
    const feedback = document.getElementById('graph-quiz-feedback');
    
    if (!feedback) return;
    
    options.forEach((option, index) => {
        option.style.pointerEvents = 'none';
        if (index === currentQuizQuestion.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === currentQuizQuestion.correct) {
        feedback.className = 'mt-4 p-3 rounded-lg bg-green-100 text-green-800';
        feedback.textContent = 'Correct! ' + currentQuizQuestion.explanation;
        
        if (soundEnabled) correctSound.play();
        
        // Award XP
        const newXp = (userData.xp || 0) + 2;
        if (currentUser && userData) {
            const userRef = group2MetalsRef.child('users').child(currentUser.uid);
            userRef.update({ xp: newXp }).then(() => {
                userData.xp = newXp;
                updateUserXP();
            });
        }
    } else {
        feedback.className = 'mt-4 p-3 rounded-lg bg-red-100 text-red-800';
        feedback.textContent = 'Incorrect. ' + currentQuizQuestion.explanation;
        
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
    
    // Load new question after delay
    setTimeout(() => {
        loadGraphQuiz();
    }, 5000);
}

// =================== //
// QUIZ FUNCTIONS     //
// =================== //

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    answerSubmitted = false;
    quizAnswers = [];
    
    const modal = document.getElementById('quizModal');
    const progress = document.getElementById('quizProgress');
    const content = document.getElementById('quizContent');
    const results = document.getElementById('quizResults');
    
    if (!modal || !progress || !content || !results) return;
    
    modal.classList.add('active');
    progress.style.display = 'block';
    content.style.display = 'block';
    results.style.display = 'none';
    
    const currentQuestionElement = document.getElementById('currentQuestion');
    const totalQuestionsElement = document.getElementById('totalQuestions');
    const currentScoreElement = document.getElementById('currentScore');
    const progressFillElement = document.getElementById('progressFill');
    
    if (currentQuestionElement) currentQuestionElement.textContent = currentQuestion + 1;
    if (totalQuestionsElement) totalQuestionsElement.textContent = quizQuestions.length;
    if (currentScoreElement) currentScoreElement.textContent = score;
    if (progressFillElement) progressFillElement.style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
    
    loadQuestion();
}

function loadQuestion() {
    const question = quizQuestions[currentQuestion];
    const questionTextElement = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    
    if (!question || !questionTextElement || !optionsContainer) return;
    
    questionTextElement.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    
    // Check if this question has been answered already
    const answeredQuestion = quizAnswers[currentQuestion];
    
    // Load MCQ options
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        if (answeredQuestion) {
            optionDiv.classList.add('disabled');
            if (answeredQuestion.selected === index) {
                optionDiv.classList.add(answeredQuestion.isCorrect ? 'correct' : 'incorrect');
            }
        }
        optionDiv.dataset.index = index;
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'quiz-option';
        input.id = `option-${index}`;
        input.value = index;
        if (answeredQuestion && answeredQuestion.selected === index) {
            input.checked = true;
        }
        if (answeredQuestion) {
            input.disabled = true;
        }
        
        const label = document.createElement('label');
        label.htmlFor = `option-${index}`;
        label.textContent = option;
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        
        if (!answeredQuestion) {
            optionDiv.onclick = () => selectOption(index);
        }
        optionsContainer.appendChild(optionDiv);
    });
    
    // Show/hide navigation buttons
    const prevButton = document.getElementById('prevButton');
    const submitButton = document.getElementById('submitButton');
    const nextButton = document.getElementById('nextButton');
    
    if (prevButton) prevButton.classList.toggle('hidden', currentQuestion === 0);
    
    // Show submit button if not answered, show next button if answered
    if (answeredQuestion) {
        if (submitButton) submitButton.style.display = 'none';
        if (nextButton) nextButton.classList.remove('hidden');
        
        // Show feedback for answered question
        const feedback = document.getElementById('feedback');
        if (feedback) {
            if (answeredQuestion.isCorrect) {
                feedback.className = 'mb-5 p-4 rounded-lg bg-green-100 text-green-800 text-sm';
                feedback.textContent = 'Correct! ' + question.explanation;
            } else {
                feedback.className = 'mb-5 p-4 rounded-lg bg-red-100 text-red-800 text-sm';
                feedback.textContent = 'Incorrect. ' + question.explanation;
            }
            feedback.classList.remove('hidden');
        }
    } else {
        if (submitButton) {
            submitButton.style.display = 'inline-flex';
            submitButton.disabled = true;
        }
        if (nextButton) nextButton.classList.add('hidden');
        
        const feedback = document.getElementById('feedback');
        if (feedback) feedback.classList.add('hidden');
    }
    
    selectedOption = answeredQuestion ? answeredQuestion.selected : null;
    answerSubmitted = !!answeredQuestion;
}

function selectOption(index) {
    if (answerSubmitted) return;
    
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.classList.remove('selected');
        const input = option.querySelector('input');
        if (input) input.checked = false;
    });
    
    options[index].classList.add('selected');
    const selectedInput = options[index].querySelector('input');
    if (selectedInput) selectedInput.checked = true;
    
    const submitButton = document.getElementById('submitButton');
    if (submitButton) submitButton.disabled = false;
}

function submitAnswer() {
    if (answerSubmitted) return;
    
    const question = quizQuestions[currentQuestion];
    const isCorrect = selectedOption === question.correct;
    const feedback = document.getElementById('feedback');
    
    if (!question || !feedback) return;
    
    quizAnswers[currentQuestion] = {
        selected: selectedOption,
        submitted: true,
        isCorrect: isCorrect
    };
    
    if (isCorrect) {
        feedback.className = 'mb-5 p-4 rounded-lg bg-green-100 text-green-800 text-sm';
        feedback.textContent = 'Correct! ' + question.explanation;
        score++;
        
        if (soundEnabled) correctSound.play();
    } else {
        feedback.className = 'mb-5 p-4 rounded-lg bg-red-100 text-red-800 text-sm';
        feedback.textContent = 'Incorrect. ' + question.explanation;
        
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
    
    const submitButton = document.getElementById('submitButton');
    const nextButton = document.getElementById('nextButton');
    const currentScoreElement = document.getElementById('currentScore');
    
    if (submitButton) submitButton.style.display = 'none';
    if (nextButton) nextButton.classList.remove('hidden');
    if (currentScoreElement) currentScoreElement.textContent = score;
    
    answerSubmitted = true;
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= quizQuestions.length) {
        showResults();
        return;
    }
    
    const currentQuestionElement = document.getElementById('currentQuestion');
    const progressFillElement = document.getElementById('progressFill');
    
    if (currentQuestionElement) currentQuestionElement.textContent = currentQuestion + 1;
    if (progressFillElement) progressFillElement.style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
    
    loadQuestion();
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        
        const currentQuestionElement = document.getElementById('currentQuestion');
        const progressFillElement = document.getElementById('progressFill');
        
        if (currentQuestionElement) currentQuestionElement.textContent = currentQuestion + 1;
        if (progressFillElement) progressFillElement.style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
        
        loadQuestion();
    }
}

function showResults() {
    const progress = document.getElementById('quizProgress');
    const content = document.getElementById('quizContent');
    const results = document.getElementById('quizResults');
    
    if (!progress || !content || !results) return;
    
    progress.style.display = 'none';
    content.style.display = 'none';
    results.style.display = 'block';
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const finalScoreElement = document.getElementById('finalScore');
    const scoreMessageElement = document.getElementById('scoreMessage');
    
    if (finalScoreElement) finalScoreElement.textContent = `${score}/${quizQuestions.length}`;
    
    let message = '';
    if (percentage >= 80) {
        message = 'Excellent! You have a strong understanding of Group 2 elements.';
    } else if (percentage >= 60) {
        message = 'Good job! You have a solid foundation to build upon.';
    } else if (percentage >= 40) {
        message = 'Not bad! Review the materials to improve your understanding.';
    } else {
        message = 'Keep practicing! Review the materials carefully.';
    }
    
    if (scoreMessageElement) scoreMessageElement.textContent = message;
    
    // Award XP for quiz completion
    const quizXP = Math.round((score / quizQuestions.length) * 20); // Max 20 XP for perfect score
    const newXp = (userData.xp || 0) + quizXP;
    
    // Check for quiz badge
    const newBadges = [...(userData.badges || [])];
    let badgeEarned = false;
    
    if (percentage >= 80 && !newBadges.includes('Quiz Master')) {
        newBadges.push('Quiz Master');
        badgeEarned = true;
    }
    
    // Save to Firebase
    if (currentUser && userData) {
        const userRef = group2MetalsRef.child('users').child(currentUser.uid);
        const updates = {
            xp: newXp
        };
        
        if (badgeEarned) {
            updates.badges = newBadges;
        }
        
        userRef.update(updates).then(() => {
            userData.xp = newXp;
            if (badgeEarned) {
                userData.badges = newBadges;
            }
            
            updateUserXP();
            updateUserBadges();
            
            if (soundEnabled) {
                completeSound.play();
                if (badgeEarned) badgeSound.play();
            }
            
            if (badgeEarned) {
                showToast('success', 'Badge Earned!', `You've earned a new badge: ${newBadges[newBadges.length - 1]}`);
            }
        });
    }
}

function closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (modal) modal.classList.remove('active');
}

// =================== //
// AUTH FUNCTIONS     //
// =================== //

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('active');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('active');
}

// Google Sign-In function
function signInWithGoogle() {
    // Show loading state
    showToast('info', 'Signing in', 'Please wait...');
    
    // Create Google provider
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Sign in with popup
    auth.signInWithPopup(provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = result.credential;
            const token = credential.accessToken;
            
            // The signed-in user info.
            const user = result.user;
            
            // Close modal
            closeLoginModal();
            
            // Show success message
            showToast('success', 'Welcome!', `You have successfully signed in as ${user.displayName}`);
        })
        .catch((error) => {
            console.error("Google sign-in error:", error);
            let errorMessage = 'Sign in failed.';
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Sign-in was cancelled.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage = 'Sign-in was cancelled.';
                    break;
                default:
                    errorMessage += ' ' + error.message;
            }
            
            showToast('error', 'Sign in failed', errorMessage);
        });
}

function signOut() {
    auth.signOut().then(() => {
        showToast('info', 'Goodbye!', 'You have been successfully signed out.');
        showLandingPage();
    }).catch((error) => {
        console.error("Sign out error:", error);
        showToast('error', 'Error', 'Failed to sign out.');
    });
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

// =================== //
// DISCUSSION FUNCTIONS //
// =================== //

let discussionPosts = [];
let studyGroups = [];
let feedbackData = [];

// Load discussion posts
function loadDiscussionPosts() {
    const postsRef = group2MetalsRef.child('discussionPosts');
    postsRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            discussionPosts = Object.values(snapshot.val());
            renderDiscussionPosts();
        } else {
            renderEmptyDiscussionState();
        }
    }).catch((error) => {
        console.error("Error loading discussion posts:", error);
        renderEmptyDiscussionState();
    });
}

// Render discussion posts
function renderDiscussionPosts() {
    const container = document.getElementById('discussionPosts');
    if (!container) return;
    
    if (discussionPosts.length === 0) {
        renderEmptyDiscussionState();
        return;
    }
    
    container.innerHTML = '';
    
    discussionPosts.forEach(post => {
        const postElement = createDiscussionPostElement(post);
        container.appendChild(postElement);
    });
}

// Create discussion post element
function createDiscussionPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'discussion-post';
    postDiv.dataset.postId = post.id;
    
    const isAuthor = currentUser && currentUser.uid === post.authorId;
    const hasVoted = currentUser && post.votes && post.votes[currentUser.uid];
    
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">
                ${post.authorPhotoURL ? 
                    `<img src="${post.authorPhotoURL}" alt="${post.authorName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                    `<i class="fas fa-user"></i>`
                }
            </div>
            <div class="post-meta">
                <div class="post-author">${post.authorName}</div>
                <div class="post-time">${formatTime(post.createdAt)}</div>
            </div>
            ${isAuthor ? `
                <div class="post-actions">
                    <button onclick="editPost('${post.id}')" class="post-action">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deletePost('${post.id}')" class="post-action">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : ''}
        </div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-content">${post.content}</p>
        ${post.tags && post.tags.length > 0 ? `
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>
        ` : ''}
        <div class="post-actions">
            <button class="post-action ${hasVoted ? 'voted' : ''}" onclick="toggleVote('${post.id}')">
                <i class="fas fa-arrow-up"></i>
                <span>${post.voteCount || 0}</span>
            </button>
            <button class="post-action" onclick="toggleComments('${post.id}')">
                <i class="fas fa-comment"></i>
                <span>${post.comments ? Object.keys(post.comments).length : 0}</span>
            </button>
            <button class="post-action" onclick="sharePost('${post.id}')">
                <i class="fas fa-share"></i>
            </button>
        </div>
        <div class="comments-section" id="comments-${post.id}" style="display: none;">
            <div class="comment-input-container">
                <input type="text" id="comment-input-${post.id}" placeholder="Add a comment..." class="comment-input">
                <button onclick="addComment('${post.id}')" class="comment-submit-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            <div id="comments-list-${post.id}" class="comments-list">
                ${renderComments(post.comments || {})}
            </div>
        </div>
    `;
    
    return postDiv;
}

// Render comments
function renderComments(comments) {
    if (!comments || Object.keys(comments).length === 0) {
        return '<p class="no-comments">No comments yet. Be the first to comment!</p>';
    }
    
    return Object.values(comments)
        .sort((a, b) => a.createdAt - b.createdAt)
        .map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <div class="comment-avatar">
                        ${comment.authorPhotoURL ? 
                            `<img src="${comment.authorPhotoURL}" alt="${comment.authorName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div class="comment-meta">
                        <div class="comment-author">${comment.authorName}</div>
                        <div class="comment-time">${formatTime(comment.createdAt)}</div>
                    </div>
                    ${currentUser && currentUser.uid === comment.authorId ? `
                        <button onclick="deleteComment('${comment.postId}', '${comment.id}')" class="comment-action">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `).join('');
}

// Show create post modal
function showCreatePostModal() {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to create a post.');
        return;
    }
    
    const modal = document.getElementById('createPostModal');
    if (modal) modal.classList.add('active');
}

// Close create post modal
function closeCreatePostModal() {
    const modal = document.getElementById('createPostModal');
    const form = document.getElementById('createPostForm');
    if (modal) modal.classList.remove('active');
    if (form) form.reset();
}


// Toggle vote on post
function toggleVote(postId) {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to vote.');
        return;
    }
    
    const postRef = group2MetalsRef.child('discussionPosts').child(postId);
    postRef.once('value').then((snapshot) => {
        if (!snapshot.exists()) return;
        
        const post = snapshot.val();
        const userId = currentUser.uid;
        const hasVoted = post.votes && post.votes[userId];
        
        const updates = {};
        if (hasVoted) {
            // Remove vote
            updates[`discussionPosts/${postId}/votes/${userId}`] = null;
            updates[`discussionPosts/${postId}/voteCount`] = (post.voteCount || 0) - 1;
        } else {
            // Add vote
            updates[`discussionPosts/${postId}/votes/${userId}`] = true;
            updates[`discussionPosts/${postId}/voteCount`] = (post.voteCount || 0) + 1;
        }
        
        group2MetalsRef.update(updates).then(() => {
            loadDiscussionPosts();
        }).catch((error) => {
            console.error("Error updating vote:", error);
        });
    });
}

// Toggle comments section
function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection) {
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }
}

// Add comment
function addComment(postId) {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to comment.');
        return;
    }
    
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    
    if (!content) {
        showToast('error', 'Validation Error', 'Please enter a comment.');
        return;
    }
    
    const commentId = group2MetalsRef.child('discussionPosts').child(postId).child('comments').push().key;
    const comment = {
        id: commentId,
        postId: postId,
        content: content,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anonymous',
        authorPhotoURL: currentUser.photoURL || '',
        createdAt: firebase.database.ServerValue.TIMESTAMP
    };
    
    const updates = {};
    updates[`discussionPosts/${postId}/comments/${commentId}`] = comment;
    
    group2MetalsRef.update(updates).then(() => {
        input.value = '';
        loadDiscussionPosts();
    }).catch((error) => {
        console.error("Error adding comment:", error);
        showToast('error', 'Error', 'Failed to add comment. Please try again.');
    });
}

// Delete comment
function deleteComment(postId, commentId) {
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to delete this comment?')) {
        const updates = {};
        updates[`discussionPosts/${postId}/comments/${commentId}`] = null;
        
        group2MetalsRef.update(updates).then(() => {
            showToast('success', 'Comment Deleted', 'The comment has been deleted.');
            loadDiscussionPosts();
        }).catch((error) => {
            console.error("Error deleting comment:", error);
            showToast('error', 'Error', 'Failed to delete comment.');
        });
    }
}

// Delete post
function deletePost(postId) {
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to delete this post?')) {
        const updates = {};
        updates[`discussionPosts/${postId}`] = null;
        
        group2MetalsRef.update(updates).then(() => {
            showToast('success', 'Post Deleted', 'The post has been deleted.');
            loadDiscussionPosts();
        }).catch((error) => {
            console.error("Error deleting post:", error);
            showToast('error', 'Error', 'Failed to delete post.');
        });
    }
}

// Edit post
function editPost(postId) {
    if (!currentUser) return;
    
    const postRef = group2MetalsRef.child('discussionPosts').child(postId);
    postRef.once('value').then((snapshot) => {
        if (!snapshot.exists()) return;
        
        const post = snapshot.val();
        
        // Populate edit modal
        document.getElementById('editPostId').value = postId;
        document.getElementById('editPostTitle').value = post.title;
        document.getElementById('editPostContent').value = post.content;
        document.getElementById('editPostTags').value = post.tags ? post.tags.join(', ') : '';
        
        // Show edit modal
        const modal = document.getElementById('editPostModal');
        if (modal) modal.classList.add('active');
    });
}

// Handle edit post
function handleEditPost(event) {
    event.preventDefault();
    
    if (!currentUser) return;
    
    const postId = document.getElementById('editPostId').value;
    const title = document.getElementById('editPostTitle').value.trim();
    const content = document.getElementById('editPostContent').value.trim();
    const tagsInput = document.getElementById('editPostTags').value.trim();
    
    if (!title || !content) {
        showToast('error', 'Validation Error', 'Please fill in all required fields.');
        return;
    }
    
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    const updates = {};
    updates[`discussionPosts/${postId}/title`] = title;
    updates[`discussionPosts/${postId}/content`] = content;
    updates[`discussionPosts/${postId}/tags`] = tags;
    updates[`discussionPosts/${postId}/updatedAt`] = firebase.database.ServerValue.TIMESTAMP;
    
    group2MetalsRef.update(updates).then(() => {
        showToast('success', 'Post Updated', 'Your post has been successfully updated.');
        closeEditPostModal();
        loadDiscussionPosts();
    }).catch((error) => {
        console.error("Error updating post:", error);
        showToast('error', 'Error', 'Failed to update post. Please try again.');
    });
}

// Close edit post modal
function closeEditPostModal() {
    const modal = document.getElementById('editPostModal');
    if (modal) modal.classList.remove('active');
}

// Share post
function sharePost(postId) {
    const url = `${window.location.origin}${window.location.pathname}#discussion-${postId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Check out this discussion',
            text: 'Join the discussion about Group 2 Alkaline Earth Metals',
            url: url
        }).catch((error) => {
            console.log('Error sharing:', error);
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showToast('success', 'Link Copied', 'Post link has been copied to clipboard.');
        }).catch((error) => {
            console.error('Error copying link:', error);
        });
    }
}

// Filter discussions
function filterDiscussions() {
    const searchTerm = document.getElementById('discussionSearch').value.toLowerCase();
    
    if (!searchTerm) {
        renderDiscussionPosts();
        return;
    }
    
    const filteredPosts = discussionPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    
    const container = document.getElementById('discussionPosts');
    if (!container) return;
    
    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3 class="empty-state-title">No Results Found</h3>
                <p class="empty-state-description">Try searching with different keywords.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    filteredPosts.forEach(post => {
        const postElement = createDiscussionPostElement(post);
        container.appendChild(postElement);
    });
}

// Sort discussions
function sortDiscussions(sortBy) {
    let sortedPosts = [...discussionPosts];
    
    switch(sortBy) {
        case 'newest':
            sortedPosts.sort((a, b) => b.createdAt - a.createdAt);
            break;
        case 'oldest':
            sortedPosts.sort((a, b) => a.createdAt - b.createdAt);
            break;
        case 'popular':
            sortedPosts.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
            break;
    }
    
    const container = document.getElementById('discussionPosts');
    if (!container) return;
    
    container.innerHTML = '';
    sortedPosts.forEach(post => {
        const postElement = createDiscussionPostElement(post);
        container.appendChild(postElement);
    });
}

// Render empty discussion state
function renderEmptyDiscussionState() {
    const container = document.getElementById('discussionPosts');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <i class="fas fa-comments"></i>
            </div>
            <h3 class="empty-state-title">No Posts Yet</h3>
            <p class="empty-state-description">Be the first to start a discussion about Group 2 Alkaline Earth Metals.</p>
        </div>
    `;
}

// =================== //
// STUDY GROUPS FUNCTIONS //
// =================== //

// Load study groups
function loadStudyGroups() {
    const groupsRef = group2MetalsRef.child('studyGroups');
    groupsRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            studyGroups = Object.values(snapshot.val());
            renderStudyGroups();
        } else {
            renderEmptyStudyGroupsState();
        }
    }).catch((error) => {
        console.error("Error loading study groups:", error);
        renderEmptyStudyGroupsState();
    });
}

// Render study groups
function renderStudyGroups() {
    const container = document.getElementById('studyGroupsList');
    if (!container) return;
    
    if (studyGroups.length === 0) {
        renderEmptyStudyGroupsState();
        return;
    }
    
    container.innerHTML = '';
    
    studyGroups.forEach(group => {
        const groupElement = createStudyGroupElement(group);
        container.appendChild(groupElement);
    });
}

// Create study group element
function createStudyGroupElement(group) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'study-group-card';
    groupDiv.dataset.groupId = group.id;
    
    const isCreator = currentUser && currentUser.uid === group.creatorId;
    const isMember = currentUser && group.members && group.members[currentUser.uid];
    const canJoin = currentUser && !isMember && (!group.maxMembers || Object.keys(group.members || {}).length < group.maxMembers);
    
    groupDiv.innerHTML = `
        <div class="group-header">
            <div>
                <h3 class="group-title">${group.name}</h3>
                <span class="group-topic">${group.topic}</span>
            </div>
            ${isCreator ? `
                <button onclick="deleteGroup('${group.id}')" class="group-action-btn">
                    <i class="fas fa-trash"></i>
                </button>
            ` : ''}
        </div>
        <p class="group-description">${group.description}</p>
        <div class="group-meta">
            <div class="group-members">
                ${renderGroupMembers(group.members || {}, group.maxMembers)}
            </div>
            <div class="group-stats">
                <span>${Object.keys(group.members || {}).length}/${group.maxMembers || '∞'} members</span>
            </div>
        </div>
        <div class="group-actions">
            ${isCreator ? `
                <button onclick="showGroupDetails('${group.id}')" class="btn btn-primary">
                    <i class="fas fa-eye mr-2"></i>View Details
                </button>
            ` : isMember ? `
                <button onclick="showGroupDetails('${group.id}')" class="btn btn-primary">
                    <i class="fas fa-users mr-2"></i>Enter Group
                </button>
            ` : canJoin ? `
                <button onclick="joinGroup('${group.id}')" class="btn btn-success">
                    <i class="fas fa-plus mr-2"></i>Join Group
                </button>
            ` : `
                <button class="btn btn-secondary" disabled>
                    <i class="fas fa-users mr-2"></i>Group Full
                </button>
            `}
        </div>
    `;
    
    return groupDiv;
}

// Render group members
function renderGroupMembers(members, maxMembers) {
    const memberList = Object.values(members).slice(0, 3);
    const memberCount = Object.keys(members).length;
    
    return `
        <div class="member-avatars">
            ${memberList.map(member => `
                <div class="member-avatar" title="${member.name}">
                    ${member.photoURL ? 
                        `<img src="${member.photoURL}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                        `<i class="fas fa-user"></i>`
                    }
                </div>
            `).join('')}
            ${memberCount > 3 ? `
                <div class="member-avatar more-members">
                    +${memberCount - 3}
                </div>
            ` : ''}
        </div>
    `;
}

// Show create group modal
function showCreateGroupModal() {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to create a study group.');
        return;
    }
    
    const modal = document.getElementById('createGroupModal');
    if (modal) modal.classList.add('active');
}

// Close create group modal
function closeCreateGroupModal() {
    const modal = document.getElementById('createGroupModal');
    const form = document.getElementById('createGroupForm');
    if (modal) modal.classList.remove('active');
    if (form) form.reset();
}

// Replace the existing handleCreatePost and handleCreateGroup functions with these updated versions:

// Handle create post - UPDATED VERSION
function handleCreatePost(event) {
    event.preventDefault();
    
    console.log("Create post function called"); // Debug log
    
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to create a post.');
        return;
    }
    
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const tagsInput = document.getElementById('postTags').value.trim();
    
    console.log("Form data:", { title, content, tagsInput }); // Debug log
    
    if (!title || !content) {
        showToast('error', 'Validation Error', 'Please fill in all required fields.');
        return;
    }
    
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    // Generate a unique key for the post
    const postId = group2MetalsRef.child('discussionPosts').push().key;
    console.log("Generated post ID:", postId); // Debug log
    
    const post = {
        id: postId,
        title: title,
        content: content,
        tags: tags,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anonymous',
        authorPhotoURL: currentUser.photoURL || '',
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        voteCount: 0,
        votes: {},
        comments: {}
    };
    
    console.log("Post data to save:", post); // Debug log
    
    // Create the post using direct set
    group2MetalsRef.child('discussionPosts').child(postId).set(post)
        .then(() => {
            console.log("Post created successfully"); // Debug log
            showToast('success', 'Post Created', 'Your post has been successfully created.');
            closeCreatePostModal();
            loadDiscussionPosts();
        })
        .catch((error) => {
            console.error("Error creating post:", error);
            showToast('error', 'Error', 'Failed to create post. Please try again.');
        });
}

// Handle create group - UPDATED VERSION
function handleCreateGroup(event) {
    event.preventDefault();
    
    console.log("Create group function called"); // Debug log
    
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to create a study group.');
        return;
    }
    
    const name = document.getElementById('groupName').value.trim();
    const topic = document.getElementById('groupTopic').value;
    const description = document.getElementById('groupDescription').value.trim();
    const maxMembers = parseInt(document.getElementById('groupMaxMembers').value);
    
    console.log("Form data:", { name, topic, description, maxMembers }); // Debug log
    
    if (!name || !topic || !description) {
        showToast('error', 'Validation Error', 'Please fill in all required fields.');
        return;
    }
    
    // Generate a unique key for the group
    const groupId = group2MetalsRef.child('studyGroups').push().key;
    console.log("Generated group ID:", groupId); // Debug log
    
    const group = {
        id: groupId,
        name: name,
        topic: topic,
        description: description,
        maxMembers: maxMembers,
        creatorId: currentUser.uid,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        members: {
            [currentUser.uid]: {
                uid: currentUser.uid,
                name: currentUser.displayName || 'Anonymous',
                photoURL: currentUser.photoURL || '',
                joinedAt: firebase.database.ServerValue.TIMESTAMP,
                role: 'creator'
            }
        },
        announcements: [],
        resources: [],
        chat: {}
    };
    
    console.log("Group data to save:", group); // Debug log
    
    // Create the group using direct set
    group2MetalsRef.child('studyGroups').child(groupId).set(group)
        .then(() => {
            console.log("Group created successfully"); // Debug log
            showToast('success', 'Group Created', 'Your study group has been successfully created.');
            closeCreateGroupModal();
            loadStudyGroups();
        })
        .catch((error) => {
            console.error("Error creating group:", error);
            showToast('error', 'Error', 'Failed to create group. Please try again.');
        });
}

// Add this function to initialize form event listeners
function initializeFormListeners() {
    // Initialize create post form
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
        console.log("Create post form listener attached"); // Debug log
    } else {
        console.error("Create post form not found"); // Debug log
    }
    
    // Initialize create group form
    const createGroupForm = document.getElementById('createGroupForm');
    if (createGroupForm) {
        createGroupForm.addEventListener('submit', handleCreateGroup);
        console.log("Create group form listener attached"); // Debug log
    } else {
        console.error("Create group form not found"); // Debug log
    }
    
    // Initialize edit post form
    const editPostForm = document.getElementById('editPostForm');
    if (editPostForm) {
        editPostForm.addEventListener('submit', handleEditPost);
        console.log("Edit post form listener attached"); // Debug log
    }
    
    // Initialize feedback form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedback);
        console.log("Feedback form listener attached"); // Debug log
    }
}

// Update the initializeSectionFeatures function to include form initialization
function initializeSectionFeatures() {
    // Load data when sections are accessed
    if (currentSection === 'discussion') {
        loadDiscussionPosts();
        initializeFormListeners(); // Initialize form listeners when discussion section is loaded
    } else if (currentSection === 'study-groups') {
        loadStudyGroups();
        initializeFormListeners(); // Initialize form listeners when study groups section is loaded
    } else if (currentSection === 'leaderboard') {
        loadLeaderboard();
    }
}

// Also add form listeners when modals are shown
function showCreatePostModal() {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to create a post.');
        return;
    }
    
    const modal = document.getElementById('createPostModal');
    if (modal) {
        modal.classList.add('active');
        // Initialize form listener when modal is shown
        setTimeout(() => {
            initializeFormListeners();
        }, 100);
    }
}

function showCreateGroupModal() {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to create a study group.');
        return;
    }
    
    const modal = document.getElementById('createGroupModal');
    if (modal) {
        modal.classList.add('active');
        // Initialize form listener when modal is shown
        setTimeout(() => {
            initializeFormListeners();
        }, 100);
    }
}

// Update the window.addEventListener('DOMContentLoaded') function
window.addEventListener('DOMContentLoaded', function() {
    initApp();
    
    // Initialize form listeners immediately
    setTimeout(() => {
        initializeFormListeners();
    }, 500);
    
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

// Alternative approach - Add click handlers directly to buttons
function addDirectButtonHandlers() {
    // Create post button
    const createPostBtn = document.querySelector('#createPostModal .btn-primary');
    if (createPostBtn) {
        createPostBtn.onclick = function(e) {
            e.preventDefault();
            handleCreatePost(e);
        };
    }
    
    // Create group button
    const createGroupBtn = document.querySelector('#createGroupModal .btn-primary');
    if (createGroupBtn) {
        createGroupBtn.onclick = function(e) {
            e.preventDefault();
            handleCreateGroup(e);
        };
    }
}

// Call this function when modals are shown
function showCreatePostModal() {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to create a post.');
        return;
    }
    
    const modal = document.getElementById('createPostModal');
    if (modal) {
        modal.classList.add('active');
        setTimeout(() => {
            addDirectButtonHandlers();
        }, 100);
    }
}

function showCreateGroupModal() {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to create a study group.');
        return;
    }
    
    const modal = document.getElementById('createGroupModal');
    if (modal) {
        modal.classList.add('active');
        setTimeout(() => {
            addDirectButtonHandlers();
        }, 100);
    }
}

// Join group
function joinGroup(groupId) {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to join a group.');
        return;
    }
    
    const groupRef = group2MetalsRef.child('studyGroups').child(groupId);
    groupRef.once('value').then((snapshot) => {
        if (!snapshot.exists()) return;
        
        const group = snapshot.val();
        const memberCount = Object.keys(group.members || {}).length;
        
        if (group.maxMembers && memberCount >= group.maxMembers) {
            showToast('error', 'Group Full', 'This group has reached its maximum capacity.');
            return;
        }
        
        const member = {
            uid: currentUser.uid,
            name: currentUser.displayName || 'Anonymous',
            photoURL: currentUser.photoURL || '',
            joinedAt: firebase.database.ServerValue.TIMESTAMP,
            role: 'member'
        };
        
        const updates = {};
        updates[`studyGroups/${groupId}/members/${currentUser.uid}`] = member;
        
        group2MetalsRef.update(updates).then(() => {
            showToast('success', 'Joined Group', `You have successfully joined ${group.name}.`);
            loadStudyGroups();
        }).catch((error) => {
            console.error("Error joining group:", error);
            showToast('error', 'Error', 'Failed to join group. Please try again.');
        });
    });
}

// Leave group
function leaveGroup(groupId) {
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to leave this group?')) {
        const updates = {};
        updates[`studyGroups/${groupId}/members/${currentUser.uid}`] = null;
        
        group2MetalsRef.update(updates).then(() => {
            showToast('success', 'Left Group', 'You have successfully left the group.');
            loadStudyGroups();
            closeGroupDetailsModal();
        }).catch((error) => {
            console.error("Error leaving group:", error);
            showToast('error', 'Error', 'Failed to leave group.');
        });
    }
}

// Delete group
function deleteGroup(groupId) {
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
        const updates = {};
        updates[`studyGroups/${groupId}`] = null;
        
        group2MetalsRef.update(updates).then(() => {
            showToast('success', 'Group Deleted', 'The study group has been deleted.');
            loadStudyGroups();
        }).catch((error) => {
            console.error("Error deleting group:", error);
            showToast('error', 'Error', 'Failed to delete group.');
        });
    }
}

// Show group details
function showGroupDetails(groupId) {
    if (!currentUser) return;
    
    const groupRef = group2MetalsRef.child('studyGroups').child(groupId);
    groupRef.once('value').then((snapshot) => {
        if (!snapshot.exists()) return;
        
        const group = snapshot.val();
        const isCreator = currentUser.uid === group.creatorId;
        const isMember = group.members && group.members[currentUser.uid];
        
        if (!isMember && !isCreator) {
            showToast('error', 'Access Denied', 'You must be a member to view group details.');
            return;
        }
        
        const modal = document.getElementById('groupDetailsModal');
        const content = document.getElementById('groupDetailsContent');
        
        if (!modal || !content) return;
        
        document.getElementById('groupDetailsTitle').textContent = group.name;
        
        content.innerHTML = `
            <div class="group-details-container">
                <div class="group-announcement">
                    <h4><i class="fas fa-bullhorn mr-2"></i>Latest Announcement</h4>
                    ${group.announcements && group.announcements.length > 0 ? 
                        `<p>${group.announcements[group.announcements.length - 1].content}</p>` :
                        '<p>No announcements yet.</p>'
                    }
                </div>
                
                <div class="resource-section">
                    <h4><i class="fas fa-book mr-2"></i>Study Resources</h4>
                    ${group.resources && group.resources.length > 0 ? 
                        group.resources.map(resource => `
                            <div class="resource-item">
                                <div class="resource-icon">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <div class="resource-info">
                                    <div class="resource-name">${resource.name}</div>
                                    <div class="resource-meta">Added by ${resource.addedBy}</div>
                                    <div class="resource-description">${resource.description}</div>
                                </div>
                                <div class="resource-actions">
                                    <button class="resource-btn">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('') :
                        '<p>No resources shared yet.</p>'
                    }
                </div>
                
                <div class="group-chat-container">
                    <h4><i class="fas fa-comments mr-2"></i>Group Chat</h4>
                    <div class="group-chat" id="group-chat-${groupId}">
                        ${renderGroupChat(group.chat || {})}
                    </div>
                    <div class="chat-input">
                        <input type="text" id="chat-input-${groupId}" placeholder="Type a message..." class="form-input">
                        <button onclick="sendChatMessage('${groupId}')" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                
                <div class="group-members-section">
                    <h4><i class="fas fa-users mr-2"></i>Members (${Object.keys(group.members || {}).length})</h4>
                    <div class="members-list">
                        ${Object.values(group.members || {}).map(member => `
                            <div class="member-item">
                                <div class="member-avatar">
                                    ${member.photoURL ? 
                                        `<img src="${member.photoURL}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                                        `<i class="fas fa-user"></i>`
                                    }
                                </div>
                                <div class="member-info">
                                    <div class="member-name">${member.name}</div>
                                    <div class="member-role">${member.role}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="group-actions">
                    ${isCreator ? `
                        <button onclick="leaveGroup('${groupId}')" class="btn btn-danger">
                            <i class="fas fa-sign-out-alt mr-2"></i>Delete Group
                        </button>
                    ` : `
                        <button onclick="leaveGroup('${groupId}')" class="btn btn-secondary">
                            <i class="fas fa-sign-out-alt mr-2"></i>Leave Group
                        </button>
                    `}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    });
}

// Render group chat
function renderGroupChat(chat) {
    const messages = Object.values(chat).sort((a, b) => a.timestamp - b.timestamp);
    
    if (messages.length === 0) {
        return '<p class="text-center text-gray-500">No messages yet. Start the conversation!</p>';
    }
    
    return messages.map(message => `
        <div class="chat-message ${message.senderId === currentUser.uid ? 'own' : ''}">
            <div class="message-header">
                <span class="message-sender">${message.senderName}</span>
                <span class="message-time">${formatTime(message.timestamp)}</span>
            </div>
            <div class="message-content">${message.content}</div>
        </div>
    `).join('');
}

// Send chat message
function sendChatMessage(groupId) {
    if (!currentUser) return;
    
    const input = document.getElementById(`chat-input-${groupId}`);
    const content = input.value.trim();
    
    if (!content) return;
    
    const messageId = group2MetalsRef.child('studyGroups').child(groupId).child('chat').push().key;
    const message = {
        id: messageId,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        senderPhotoURL: currentUser.photoURL || '',
        content: content,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    const updates = {};
    updates[`studyGroups/${groupId}/chat/${messageId}`] = message;
    
    group2MetalsRef.update(updates).then(() => {
        input.value = '';
        showGroupDetails(groupId); // Refresh the chat
    }).catch((error) => {
        console.error("Error sending message:", error);
        showToast('error', 'Error', 'Failed to send message.');
    });
}

// Close group details modal
function closeGroupDetailsModal() {
    const modal = document.getElementById('groupDetailsModal');
    if (modal) modal.classList.remove('active');
}

// Render empty study groups state
function renderEmptyStudyGroupsState() {
    const container = document.getElementById('studyGroupsList');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <i class="fas fa-users"></i>
            </div>
            <h3 class="empty-state-title">No Study Groups Yet</h3>
            <p class="empty-state-description">Create your first study group to collaborate with peers.</p>
        </div>
    `;
}

// =================== //
// LEADERBOARD FUNCTIONS //
// =================== //

// Load leaderboard
function loadLeaderboard() {
    const usersRef = group2MetalsRef.child('users');
    usersRef.once('value').then((snapshot) => {
        if (!snapshot.exists()) {
            renderEmptyLeaderboardState();
            return;
        }
        
        const users = Object.values(snapshot.val());
        const sortedUsers = users
            .filter(user => user.xp > 0) // Only show users with XP
            .sort((a, b) => b.xp - a.xp) // Sort by XP descending
            .slice(0, 20); // Top 20 users
        
        renderLeaderboard(sortedUsers);
    }).catch((error) => {
        console.error("Error loading leaderboard:", error);
        renderEmptyLeaderboardState();
    });
}

// Render leaderboard
function renderLeaderboard(users) {
    const container = document.getElementById('leaderboardContent');
    if (!container) return;
    
    if (users.length === 0) {
        renderEmptyLeaderboardState();
        return;
    }
    
    container.innerHTML = `
        <div class="leaderboard-table-container">
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>XP</th>
                        <th>Badges</th>
                        <th>Sections Completed</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map((user, index) => {
                        const rank = index + 1;
                        const isCurrentUser = currentUser && currentUser.uid === user.uid;
                        const rankClass = rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : '';
                        
                        return `
                            <tr class="leaderboard-entry ${isCurrentUser ? 'current-user' : ''}">
                                <td>
                                    <div class="leaderboard-rank ${rankClass}">
                                        ${rank === 1 ? '<i class="fas fa-trophy"></i>' : 
                                          rank === 2 ? '<i class="fas fa-medal"></i>' : 
                                          rank === 3 ? '<i class="fas fa-award"></i>' : 
                                          rank}
                                    </div>
                                </td>
                                <td>
                                    <div class="user-info-leaderboard">
                                        <div class="user-avatar-leaderboard">
                                            ${user.photoURL ? 
                                                `<img src="${user.photoURL}" alt="${user.displayName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                                                `<i class="fas fa-user"></i>`
                                            }
                                        </div>
                                        <div class="user-details-leaderboard">
                                            <div class="user-name-leaderboard">
                                                ${user.displayName || 'Anonymous'}
                                                ${isCurrentUser ? '<span class="current-user-badge">You</span>' : ''}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="xp-display">
                                        <i class="fas fa-star"></i>
                                        <span>${user.xp || 0}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="badges-display">
                                        ${user.badges && user.badges.length > 0 ? 
                                            user.badges.map(badge => `<span class="badge" title="${badge}"><i class="fas fa-medal"></i></span>`).join('') :
                                            '<span class="no-badges">None</span>'
                                        }
                                    </div>
                                </td>
                                <td>
                                    <div class="sections-completed">
                                        <span>${(user.completedSections || []).length}/4</span>
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${((user.completedSections || []).length / 4) * 100}%"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Render empty leaderboard state
function renderEmptyLeaderboardState() {
    const container = document.getElementById('leaderboardContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <h3 class="empty-state-title">No Data Yet</h3>
            <p class="empty-state-description">Complete sections to earn XP and appear on the leaderboard!</p>
        </div>
    `;
}

// =================== //
// FEEDBACK FUNCTIONS //
// =================== //

// Show feedback modal
function showFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) modal.classList.add('active');
}

// Close feedback modal
function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    const form = document.getElementById('feedbackForm');
    if (modal) modal.classList.remove('active');
    if (form) form.reset();
    
    // Reset rating buttons
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('feedbackRating').value = '0';
}

// Set feedback rating
function setFeedbackRating(rating) {
    document.getElementById('feedbackRating').value = rating;
    
    // Update button states
    document.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (rating === 1) {
        document.getElementById('thumbsDownBtn').classList.add('active');
    } else if (rating === 2) {
        document.getElementById('thumbsUpBtn').classList.add('active');
    }
}

// Handle feedback submission
function handleFeedback(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to submit feedback.');
        return;
    }
    
    const feedbackText = document.getElementById('feedbackText').value.trim();
    const rating = parseInt(document.getElementById('feedbackRating').value);
    
    if (!feedbackText) {
        showToast('error', 'Validation Error', 'Please enter your feedback.');
        return;
    }
    
    if (rating === 0) {
        showToast('error', 'Validation Error', 'Please rate your experience.');
        return;
    }
    
    const feedbackId = group2MetalsRef.child('feedback').push().key;
    const feedback = {
        id: feedbackId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email || '',
        feedback: feedbackText,
        rating: rating,
        section: currentSection,
        userAgent: navigator.userAgent,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    const updates = {};
    updates[`feedback/${feedbackId}`] = feedback;
    
    group2MetalsRef.update(updates).then(() => {
        showToast('success', 'Feedback Submitted', 'Thank you for your feedback! We appreciate your input.');
        closeFeedbackModal();
        
        // Award XP for feedback
        const newXp = (userData.xp || 0) + 5;
        if (currentUser && userData) {
            const userRef = group2MetalsRef.child('users').child(currentUser.uid);
            userRef.update({ xp: newXp }).then(() => {
                userData.xp = newXp;
                updateUserXP();
            });
        }
    }).catch((error) => {
        console.error("Error submitting feedback:", error);
        showToast('error', 'Error', 'Failed to submit feedback. Please try again.');
    });
}

// =================== //
// REACTIONS SECTION //
// =================== //

// Show reactions section
function showReactionsSection() {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show reactions section
    let reactionsSection = document.getElementById('reactions-section');
    if (!reactionsSection) {
        // Create the reactions section if it doesn't exist
        reactionsSection = document.createElement('div');
        reactionsSection.id = 'reactions-section';
        reactionsSection.className = 'content-section';
        
        reactionsSection.innerHTML = `
            <div class="section-header">
                <h2>Reactions</h2>
                <p>Share your reactions to the learning materials</p>
            </div>
            
            <div class="reactions-container">
                <div class="reaction-card">
                    <h3>How do you feel about Group 2 Alkaline Earth Metals?</h3>
                    <div class="reaction-options">
                        <button class="reaction-option" onclick="submitReaction('excited')">
                            <i class="fas fa-laugh-beam"></i>
                            <span>Excited</span>
                        </button>
                        <button class="reaction-option" onclick="submitReaction('interested')">
                            <i class="fas fa-smile"></i>
                            <span>Interested</span>
                        </button>
                        <button class="reaction-option" onclick="submitReaction('confused')">
                            <i class="fas fa-meh"></i>
                            <span>Confused</span>
                        </button>
                        <button class="reaction-option" onclick="submitReaction('bored')">
                            <i class="fas fa-frown"></i>
                            <span>Bored</span>
                        </button>
                    </div>
                </div>
                
                <div class="reaction-stats">
                    <h3>Community Reactions</h3>
                    <div class="stats-container">
                        <div class="stat-item">
                            <i class="fas fa-laugh-beam"></i>
                            <span class="stat-label">Excited</span>
                            <span class="stat-value" id="excited-count">0</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-smile"></i>
                            <span class="stat-label">Interested</span>
                            <span class="stat-value" id="interested-count">0</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-meh"></i>
                            <span class="stat-label">Confused</span>
                            <span class="stat-value" id="confused-count">0</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-frown"></i>
                            <span class="stat-label">Bored</span>
                            <span class="stat-value" id="bored-count">0</span>
                        </div>
                    </div>
                </div>
                
                <div class="reaction-comments">
                    <h3>Share Your Thoughts</h3>
                    <div class="comment-form">
                        <textarea id="reaction-comment" placeholder="Share your thoughts about Group 2 elements..."></textarea>
                        <button onclick="submitReactionComment()" class="btn btn-primary">Submit</button>
                    </div>
                    <div id="reaction-comments-list" class="comments-list">
                        <!-- Comments will be loaded here -->
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.main-content').appendChild(reactionsSection);
    }
    
    reactionsSection.style.display = 'block';
    
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const reactionsNavItem = document.getElementById('nav-reactions');
    if (reactionsNavItem) {
        reactionsNavItem.classList.add('active');
    }
    
    currentSection = 'reactions';
    
    // Load reactions data
    loadReactionsData();
}

// Submit a reaction
function submitReaction(type) {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to submit a reaction.');
        return;
    }
    
    // Update the reaction count
    const reactionRef = group2MetalsRef.child('reactions').child(type);
    reactionRef.transaction((currentValue) => {
        return (currentValue || 0) + 1;
    }).then(() => {
        // Save user's reaction
        group2MetalsRef.child('userReactions').child(currentUser.uid).set({
            type: type,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            showToast('success', 'Reaction Submitted', 'Thank you for your feedback!');
            loadReactionsData();
        });
    }).catch((error) => {
        console.error("Error submitting reaction:", error);
        showToast('error', 'Error', 'Failed to submit reaction. Please try again.');
    });
}

// Submit a reaction comment
function submitReactionComment() {
    if (!currentUser) {
        showToast('error', 'Authentication Required', 'Please sign in to comment.');
        return;
    }
    
    const comment = document.getElementById('reaction-comment').value.trim();
    if (!comment) {
        showToast('error', 'Validation Error', 'Please enter a comment.');
        return;
    }
    
    const commentId = group2MetalsRef.child('reactionComments').push().key;
    const commentData = {
        id: commentId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhotoURL: currentUser.photoURL || '',
        comment: comment,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    group2MetalsRef.child('reactionComments').child(commentId).set(commentData)
        .then(() => {
            document.getElementById('reaction-comment').value = '';
            showToast('success', 'Comment Submitted', 'Your comment has been posted.');
            loadReactionComments();
        })
        .catch((error) => {
            console.error("Error submitting comment:", error);
            showToast('error', 'Error', 'Failed to submit comment. Please try again.');
        });
}

// Load reactions data
function loadReactionsData() {
    const reactionsRef = group2MetalsRef.child('reactions');
    reactionsRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const reactions = snapshot.val();
            document.getElementById('excited-count').textContent = reactions.excited || 0;
            document.getElementById('interested-count').textContent = reactions.interested || 0;
            document.getElementById('confused-count').textContent = reactions.confused || 0;
            document.getElementById('bored-count').textContent = reactions.bored || 0;
        }
    }).catch((error) => {
        console.error("Error loading reactions data:", error);
    });
    
    loadReactionComments();
}

// Load reaction comments
function loadReactionComments() {
    const commentsRef = group2MetalsRef.child('reactionComments');
    commentsRef.once('value').then((snapshot) => {
        const commentsList = document.getElementById('reaction-comments-list');
        if (!commentsList) return;
        
        if (snapshot.exists()) {
            const comments = Object.values(snapshot.val());
            comments.sort((a, b) => b.timestamp - a.timestamp);
            
            commentsList.innerHTML = comments.map(comment => `
                <div class="comment">
                    <div class="comment-header">
                        <div class="comment-avatar">
                            ${comment.userPhotoURL ? 
                                `<img src="${comment.userPhotoURL}" alt="${comment.userName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                                `<i class="fas fa-user"></i>`
                            }
                        </div>
                        <div class="comment-meta">
                            <div class="comment-author">${comment.userName}</div>
                            <div class="comment-time">${formatTime(comment.timestamp)}</div>
                        </div>
                    </div>
                    <div class="comment-content">${comment.comment}</div>
                </div>
            `).join('');
        } else {
            commentsList.innerHTML = '<p class="text-center text-gray-500">No comments yet. Be the first to share your thoughts!</p>';
        }
    }).catch((error) => {
        console.error("Error loading comments:", error);
    });
}

// =================== //
// UTILITY FUNCTIONS //
// =================== //

// Format timestamp
function formatTime(timestamp) {
    if (!timestamp) return 'Just now';
    
    const now = Date.now();
    const time = timestamp instanceof Date ? timestamp.getTime() : timestamp;
    const diff = now - time;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
        return 'Just now';
    }
}

// Initialize section features
function initializeSectionFeatures() {
    // Load data when sections are accessed
    if (currentSection === 'discussion') {
        loadDiscussionPosts();
    } else if (currentSection === 'study-groups') {
        loadStudyGroups();
    } else if (currentSection === 'leaderboard') {
        loadLeaderboard();
    }
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

// Export functions for global access
window.switchGraph = switchGraph;
window.toggleElement = toggleElement;
window.resetZoom = resetZoom;
window.downloadGraph = downloadGraph;
window.toggleAnimation = toggleAnimation;
window.checkGraphQuizAnswer = checkGraphQuizAnswer;
window.signInWithGoogle = signInWithGoogle;
window.showCreatePostModal = showCreatePostModal;
window.closeCreatePostModal = closeCreatePostModal;
window.handleCreatePost = handleCreatePost;
window.editPost = editPost;
window.handleEditPost = handleEditPost;
window.closeEditPostModal = closeEditPostModal;
window.deletePost = deletePost;
window.toggleVote = toggleVote;
window.toggleComments = toggleComments;
window.addComment = addComment;
window.deleteComment = deleteComment;
window.sharePost = sharePost;
window.filterDiscussions = filterDiscussions;
window.sortDiscussions = sortDiscussions;
window.showCreateGroupModal = showCreateGroupModal;
window.closeCreateGroupModal = closeCreateGroupModal;
window.handleCreateGroup = handleCreateGroup;
window.joinGroup = joinGroup;
window.leaveGroup = leaveGroup;
window.deleteGroup = deleteGroup;
window.showGroupDetails = showGroupDetails;
window.closeGroupDetailsModal = closeGroupDetailsModal;
window.sendChatMessage = sendChatMessage;
window.showFeedbackModal = showFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.setFeedbackRating = setFeedbackRating;
window.handleFeedback = handleFeedback;
window.toggleSidebar = toggleSidebar;
window.submitReaction = submitReaction;
window.submitReactionComment = submitReactionComment;
window.showReactionsSection = showReactionsSection;
