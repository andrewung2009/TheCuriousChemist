// js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    initializeApp();
});

function initializeApp() {
    // Core functionality
    initializeNavigation();
    initializeTabs();
    initializeElementInteraction();
    initializeLabExperiment();
    initializeGamification();
    initializeProgressTracking();
    initializeQuiz();
    initializeSpacedRepetition();
    
    // Enhanced features
    initializeAccessibility();
    initializeVoiceControl();
    initializeOfflineMode();
    initializeAdaptiveLearning();
    initializeSettings();
    
    // Load user data
    loadUserData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Animate progress bars on load
    setTimeout(animateProgressBars, 500);
}

// Navigation
function initializeNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Tabs
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabContainer = tab.parentElement;
            const tabContents = tabContainer.parentElement.querySelectorAll('.tab-content');
            
            // Remove active class from all tabs in this container
            tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show corresponding tab content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Element Interaction in Learning Hub
function initializeElementInteraction() {
    const elementCards = document.querySelectorAll('#elements .element-card');
    const elementDetails = document.getElementById('element-details');
    const elementTitle = document.getElementById('element-title');
    const elementInfo = document.getElementById('element-info');
    const elementSelect = document.getElementById('element-select');
    
    const elementData = {
        Li: {
            name: 'Lithium',
            atomicNumber: 3,
            atomicMass: '6.94',
            electronConfig: '1s² 2s¹',
            description: 'Lightest metal, used in batteries, mood-stabilizing drugs. Floats on water, reacts slowly.',
            physicalProperties: 'Soft, can be cut with a knife. Low density; floats on water. Shiny when freshly cut but tarnishes quickly in air. Low melting and boiling points.',
            chemicalProperties: 'Very reactive; reacts vigorously with water and oxygen. Forms alkaline hydroxides in water, releasing hydrogen gas.',
            uses: 'Batteries, mood-stabilizing drugs.',
            safety: 'Store under oil to prevent reactions. Handle with caution.'
        },
        Na: {
            name: 'Sodium',
            atomicNumber: 11,
            atomicMass: '22.99',
            electronConfig: '1s² 2s² 2p⁶ 3s¹',
            description: 'Soft, silvery-white metal. Reacts vigorously with water, forms sodium hydroxide and hydrogen.',
            physicalProperties: 'Soft, silvery-white, highly reactive metal. Low density; less dense than water. Shiny when freshly cut but tarnishes quickly. Low melting and boiling points.',
            chemicalProperties: 'Very reactive; reacts vigorously with water and oxygen. Forms alkaline hydroxides in water, releasing hydrogen gas.',
            uses: 'Street lamps, table salt (NaCl), chemical industry.',
            safety: 'Store under oil to prevent reactions. Handle with caution.'
        },
        K: {
            name: 'Potassium',
            atomicNumber: 19,
            atomicMass: '39.10',
            electronConfig: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹',
            description: 'Soft, very reactive, ignites in water. Used in fertilizers and fireworks.',
            physicalProperties: 'Soft, silvery-white metal. Less dense than water. Shiny when freshly cut but tarnishes quickly. Low melting and boiling points.',
            chemicalProperties: 'Very reactive; reacts vigorously with water and oxygen. Forms alkaline hydroxides in water, releasing hydrogen gas. Reacts violently with water, igniting hydrogen.',
            uses: 'Fertilizers, fireworks, soap production.',
            safety: 'Store under oil to prevent reactions. Handle with caution.'
        },
        Rb: {
            name: 'Rubidium',
            atomicNumber: 37,
            atomicMass: '85.47',
            electronConfig: '[Kr] 5s¹',
            description: 'Rare, highly reactive, melts slightly above room temperature. Used in research and electronics.',
            physicalProperties: 'Soft, silvery-white metal. Highly reactive. Low melting point (melts slightly above room temperature). Shiny when freshly cut but tarnishes quickly.',
            chemicalProperties: 'Very reactive; reacts vigorously with water and oxygen. Forms alkaline hydroxides in water, releasing hydrogen gas. Reacts explosively with water.',
            uses: 'Research, electronics, specialty glasses.',
            safety: 'Store under oil to prevent reactions. Handle with extreme caution.'
        },
        Cs: {
            name: 'Cesium',
            atomicNumber: 55,
            atomicMass: '132.91',
            electronConfig: '[Xe] 6s¹',
            description: 'Soft, melts near room temperature. Used in atomic clocks and vacuum tubes.',
            physicalProperties: 'Soft, golden-colored metal. Extremely reactive. Low melting point (melts near room temperature). Shiny when freshly cut but tarnishes quickly.',
            chemicalProperties: 'Very reactive; reacts vigorously with water and oxygen. Forms alkaline hydroxides in water, releasing hydrogen gas. Reacts explosively with water, even ice.',
            uses: 'Atomic clocks, vacuum tubes, photoelectric cells.',
            safety: 'Store under oil to prevent reactions. Handle with extreme caution.'
        },
        Fr: {
            name: 'Francium',
            atomicNumber: 87,
            atomicMass: '223',
            electronConfig: '[Rn] 7s¹',
            description: 'Extremely rare and radioactive. No widespread practical uses due to radioactivity.',
            physicalProperties: 'Highly radioactive, extremely rare metal. Predicted to be soft and highly reactive.',
            chemicalProperties: 'Predicted to be more reactive than cesium. Forms alkaline hydroxides in water, releasing hydrogen gas.',
            uses: 'No widespread practical uses due to radioactivity. Research purposes only.',
            safety: 'Requires specialized handling due to radioactivity. Not commonly handled outside research.'
        }
    };
    
    elementCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            elementCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            card.classList.add('selected');
            
            // Get element symbol
            const element = card.getAttribute('data-element');
            const data = elementData[element];
            
            // Update element details
            elementTitle.textContent = data.name + ' (' + element + ')';
            elementInfo.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div>
                        <h4>Atomic Number</h4>
                        <p>${data.atomicNumber}</p>
                    </div>
                    <div>
                        <h4>Atomic Mass</h4>
                        <p>${data.atomicMass}</p>
                    </div>
                    <div>
                        <h4>Electron Configuration</h4>
                        <p>${data.electronConfig}</p>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4>Description</h4>
                    <p>${data.description}</p>
                </div>
                <div style="margin-top: 15px;">
                    <h4>Physical Properties</h4>
                    <p>${data.physicalProperties}</p>
                </div>
                <div style="margin-top: 15px;">
                    <h4>Chemical Properties</h4>
                    <p>${data.chemicalProperties}</p>
                </div>
                <div style="margin-top: 15px;">
                    <h4>Uses</h4>
                    <p>${data.uses}</p>
                </div>
                <div style="margin-top: 15px;">
                    <h4>Safety</h4>
                    <p>${data.safety}</p>
                </div>
            `;
            
            // Show element details
            elementDetails.style.display = 'block';
            
            // Update 3D model selector
            elementSelect.value = element;
            update3DModel(element);
        });
    });
    
    // Element select for 3D model
    elementSelect.addEventListener('change', (e) => {
        const element = e.target.value;
        if (element) {
            update3DModel(element);
            
            // Also select the corresponding element card
            elementCards.forEach(card => {
                card.classList.remove('selected');
                if (card.getAttribute('data-element') === element) {
                    card.classList.add('selected');
                }
            });
        }
    });
}

// Update 3D Model (simulated)
function update3DModel(element) {
    const atom3d = document.getElementById('atom-3d');
    const elementNames = {
        Li: 'Lithium',
        Na: 'Sodium',
        K: 'Potassium',
        Rb: 'Rubidium',
        Cs: 'Cesium',
        Fr: 'Francium'
    };
    
    atom3d.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column;">
            <i class="fas fa-atom" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px; animation: pulse 2s infinite;"></i>
            <h3>${elementNames[element]} Atom</h3>
            <p style="color: #666; margin-top: 10px;">3D visualization of atomic structure</p>
            <div style="margin-top: 20px; text-align: center;">
                <div style="display: inline-block; margin: 0 10px; padding: 10px; background: #f8f9fa; border-radius: 10px;">
                    <strong>Nucleus:</strong> ${element}+
                </div>
                <div style="display: inline-block; margin: 0 10px; padding: 10px; background: #f8f9fa; border-radius: 10px;">
                    <strong>Electrons:</strong> 1
                </div>
            </div>
        </div>
    `;
}

// Virtual Lab
function initializeLabExperiment() {
    const labEquipment = document.querySelectorAll('.lab-equipment');
    const labElements = document.querySelectorAll('#lab-page .element-card');
    const startLabExperiment = document.getElementById('start-lab-experiment');
    const labReactionArea = document.getElementById('lab-reaction-area');
    
    let selectedEquipment = null;
    let selectedLabElement = null;
    
    labEquipment.forEach(equipment => {
        equipment.addEventListener('click', () => {
            // Remove selected class from all equipment
            labEquipment.forEach(e => e.classList.remove('selected'));
            
            // Add selected class to clicked equipment
            equipment.classList.add('selected');
            
            // Store selected equipment
            selectedEquipment = equipment.getAttribute('data-equipment');
        });
    });
    
    labElements.forEach(element => {
        element.addEventListener('click', () => {
            // Remove selected class from all elements
            labElements.forEach(e => e.classList.remove('selected'));
            
            // Add selected class to clicked element
            element.classList.add('selected');
            
            // Store selected element
            selectedLabElement = element.getAttribute('data-element');
        });
    });
    
    startLabExperiment.addEventListener('click', () => {
        if (selectedEquipment && selectedLabElement) {
            const elementName = document.querySelector(`#lab-page [data-element="${selectedLabElement}"] .element-name`).textContent;
            const equipmentName = document.querySelector(`[data-equipment="${selectedEquipment}"] div`).textContent;
            
            labReactionArea.innerHTML = `
                <div style="text-align: center;">
                    <h3>Experiment in Progress</h3>
                    <div style="margin: 20px 0; font-size: 3rem;">
                        ${selectedLabElement} + ${equipmentName}
                    </div>
                    <p>${elementName} is reacting with ${equipmentName}...</p>
                    <div style="margin-top: 20px;">
                        <div style="display: inline-block; padding: 10px 20px; background: rgba(40, 167, 69, 0.1); color: var(--success); border-radius: 5px;">
                            <i class="fas fa-check-circle"></i> Experiment completed successfully!
                        </div>
                    </div>
                    <p style="margin-top: 15px;">+50 Chemistry Points earned</p>
                </div>
            `;
            
            // Award points
            gamificationSystem.addPoints(50);
            
            // Check for achievements
            if (selectedEquipment === 'water') {
                gamificationSystem.unlockAchievement('reactivity-master');
            }
        } else {
            labReactionArea.innerHTML = `
                <p style="color: var(--warning);">Please select both equipment and an element to start the experiment.</p>
            `;
        }
    });
}

// Gamification System
class GamificationSystem {
    constructor() {
        this.achievements = this.loadAchievements();
        this.points = this.loadPoints();
        this.level = this.calculateLevel(this.points);
    }
    
    loadAchievements() {
        const saved = localStorage.getItem('achievements');
        return saved ? JSON.parse(saved) : [];
    }
    
    loadPoints() {
        const saved = localStorage.getItem('points');
        return saved ? parseInt(saved) : 0;
    }
    
    saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }
    
    savePoints() {
        localStorage.setItem('points', this.points.toString());
    }
    
    calculateLevel(points) {
        // Level calculation: each level requires 20% more points than the previous
        let level = 1;
        let pointsRequired = 100;
        
        while (points >= pointsRequired) {
            level++;
            pointsRequired = Math.floor(pointsRequired * 1.2);
        }
        
        return level;
    }
    
    addPoints(amount) {
        this.points += amount;
        this.savePoints();
        
        // Check if level up
        const newLevel = this.calculateLevel(this.points);
        if (newLevel > this.level) {
            this.level = newLevel;
            this.showLevelUpNotification();
        }
        
        // Update UI
        this.updatePointsDisplay();
    }
    
    unlockAchievement(achievementId) {
        if (!this.achievements.includes(achievementId)) {
            this.achievements.push(achievementId);
            this.saveAchievements();
            
            // Show achievement notification
            this.showAchievementNotification(achievementId);
            
            // Award points for achievement
            this.addPoints(50);
            
            // Update badge display
            const badgeElement = document.querySelector(`[data-badge="${achievementId}"]`);
            if (badgeElement) {
                badgeElement.classList.remove('locked');
                badgeElement.classList.add('earned');
            }
        }
    }
    
    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'notification level-up';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-level-up-alt"></i>
                <div>
                    <div class="notification-title">Level Up!</div>
                    <div>You reached level ${this.level}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    showAchievementNotification(achievementId) {
        const achievements = {
            'reactivity-master': { name: 'Reactivity Master', icon: 'fa-fire' },
            'atomic-explorer': { name: 'Atomic Explorer', icon: 'fa-atom' },
            'lab-expert': { name: 'Lab Expert', icon: 'fa-flask' },
            'team-player': { name: 'Team Player', icon: 'fa-users' },
            'peer-teacher': { name: 'Peer Teacher', icon: 'fa-chalkboard-teacher' },
            'quick-learner': { name: 'Quick Learner', icon: 'fa-brain' },
            'alkali-master': { name: 'Alkali Master', icon: 'fa-trophy' },
            'chemistry-champion': { name: 'Chemistry Champion', icon: 'fa-graduation-cap' },
            'group1-guru': { name: 'Group 1 Guru', icon: 'fa-star' }
        };
        
        const achievement = achievements[achievementId];
        
        const notification = document.createElement('div');
        notification.className = 'notification achievement';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${achievement.icon}"></i>
                <div>
                    <div class="notification-title">Achievement Unlocked!</div>
                    <div>${achievement.name}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    updatePointsDisplay() {
        const pointsDisplay = document.getElementById('user-points-display');
        const levelDisplay = document.getElementById('user-level-display');
        
        if (pointsDisplay) {
            pointsDisplay.textContent = this.points.toLocaleString();
        }
        
        if (levelDisplay) {
            levelDisplay.textContent = this.level;
        }
    }
}

// Initialize gamification
const gamificationSystem = new GamificationSystem();

// Progress Tracking
function initializeProgressTracking() {
    // Animate progress bars on page load
    setTimeout(() => {
        document.querySelectorAll('.progress').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
}

function animateProgressBars() {
    document.querySelectorAll('.progress').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Quiz System
function initializeQuiz() {
    const quizQuestions = document.querySelectorAll('.quiz-question');
    const quizOptions = document.querySelectorAll('.quiz-option');
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');
    const retakeButton = document.getElementById('retake-quiz');
    const quizResults = document.getElementById('quiz-results');
    
    let currentQuestion = 0;
    let userAnswers = [];
    let score = 0;
    
    const correctAnswers = {
        1: 'C', // Calcium is not a Group 1 metal
        2: 'A', // They produce hydrogen gas and metal hydroxides
        3: 'D', // Francium is the most reactive
        4: 'B', // Atomic radius increases down the group
        5: 'B'  // Lithium is used in batteries
    };
    
    const feedbackMessages = {
        1: {
            correct: 'Correct! Calcium (Ca) is in Group 2, not Group 1.',
            incorrect: 'Incorrect. Calcium (Ca) is in Group 2, not Group 1. The correct answer is C.'
        },
        2: {
            correct: 'Correct! Group 1 metals react with water to produce hydrogen gas and metal hydroxides.',
            incorrect: 'Incorrect. Group 1 metals react with water to produce hydrogen gas and metal hydroxides. The correct answer is A.'
        },
        3: {
            correct: 'Correct! Reactivity increases down Group 1, making francium the most reactive.',
            incorrect: 'Incorrect. Reactivity increases down Group 1, making francium the most reactive. The correct answer is D.'
        },
        4: {
            correct: 'Correct! Atomic radius increases down the group due to additional electron shells.',
            incorrect: 'Incorrect. Atomic radius increases down the group due to additional electron shells. The correct answer is B.'
        },
        5: {
            correct: 'Correct! Lithium is commonly used in batteries, especially lithium-ion batteries.',
            incorrect: 'Incorrect. Lithium is commonly used in batteries, especially lithium-ion batteries. The correct answer is B.'
        }
    };
    
    // Handle option selection
    quizOptions.forEach(option => {
        option.addEventListener('click', () => {
            const questionId = option.closest('.quiz-question').id.split('-')[2];
            const selectedOption = option.getAttribute('data-option');
            
            // Clear previous selections
            document.querySelectorAll(`#quiz-question-${questionId} .quiz-option`).forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Mark selected option
            option.classList.add('selected');
            
            // Store user answer
            userAnswers[questionId - 1] = selectedOption;
            
            // Show feedback
            const feedback = document.getElementById(`feedback-${questionId}`);
            feedback.style.display = 'block';
            
            if (selectedOption === correctAnswers[questionId]) {
                option.classList.add('correct');
                feedback.className = 'quiz-feedback correct';
                feedback.innerHTML = `<i class="fas fa-check-circle"></i> ${feedbackMessages[questionId].correct}`;
            } else {
                option.classList.add('incorrect');
                feedback.className = 'quiz-feedback incorrect';
                feedback.innerHTML = `<i class="fas fa-times-circle"></i> ${feedbackMessages[questionId].incorrect}`;
                
                // Show correct answer
                document.querySelectorAll(`#quiz-question-${questionId} .quiz-option`).forEach(opt => {
                    if (opt.getAttribute('data-option') === correctAnswers[questionId]) {
                        opt.classList.add('correct');
                    }
                });
            }
        });
    });
    
    // Navigation buttons
    prevButton.addEventListener('click', () => {
        if (currentQuestion > 0) {
            document.getElementById(`quiz-question-${currentQuestion + 1}`).style.display = 'none';
            currentQuestion--;
            document.getElementById(`quiz-question-${currentQuestion + 1}`).style.display = 'block';
            
            // Update button states
            prevButton.disabled = currentQuestion === 0;
            nextButton.textContent = currentQuestion === 4 ? 'Finish' : 'Next';
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentQuestion < 4) {
            document.getElementById(`quiz-question-${currentQuestion + 1}`).style.display = 'none';
            currentQuestion++;
            document.getElementById(`quiz-question-${currentQuestion + 1}`).style.display = 'block';
            
            // Update button states
            prevButton.disabled = false;
            nextButton.textContent = currentQuestion === 4 ? 'Finish' : 'Next';
        } else {
            // Finish quiz
            finishQuiz();
        }
    });
    
    function finishQuiz() {
        // Calculate score
        score = 0;
        for (let i = 0; i < 5; i++) {
            if (userAnswers[i] === correctAnswers[i + 1]) {
                score++;
            }
        }
        
        const percentage = Math.round((score / 5) * 100);
        
        // Hide all questions
        quizQuestions.forEach(question => {
            question.style.display = 'none';
        });
        
        // Hide navigation
        document.querySelector('.quiz-navigation').style.display = 'none';
        
        // Show results
        quizResults.style.display = 'block';
        document.getElementById('quiz-score').textContent = `${percentage}%`;
        
        // Result message based on score
        let message = '';
        if (percentage >= 80) {
            message = 'Excellent work! You have a strong understanding of Group 1 metals.';
        } else if (percentage >= 60) {
            message = 'Good job! You have a solid understanding of Group 1 metals, but there\'s room for improvement.';
        } else {
            message = 'Keep studying! Review the material and try again to improve your understanding of Group 1 metals.';
        }
        
        document.getElementById('quiz-result-message').textContent = message;
        
        // Award points based on score
        const points = Math.floor(percentage / 10) * 10;
        gamificationSystem.addPoints(points);
        
        // Update adaptive learning
        if (window.adaptiveLearning) {
            window.adaptiveLearning.updatePerformance('Group 1 Metals Quiz', percentage);
        }
    }
    
    // Retake quiz
    retakeButton.addEventListener('click', () => {
        // Reset quiz
        currentQuestion = 0;
        userAnswers = [];
        score = 0;
        
        // Show first question
        quizQuestions.forEach((question, index) => {
            question.style.display = index === 0 ? 'block' : 'none';
        });
        
        // Reset options
        quizOptions.forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Hide feedback
        document.querySelectorAll('.quiz-feedback').forEach(feedback => {
            feedback.style.display = 'none';
        });
        
        // Show navigation
        document.querySelector('.quiz-navigation').style.display = 'flex';
        
        // Hide results
        quizResults.style.display = 'none';
        
        // Reset buttons
        prevButton.disabled = true;
        nextButton.textContent = 'Next';
    });
}

// Spaced Repetition
function initializeSpacedRepetition() {
    const reviewCards = document.querySelectorAll('.review-card');
    const ratingButtons = document.querySelectorAll('.rating-btn');
    
    reviewCards.forEach(card => {
        const showAnswerBtn = document.createElement('button');
        showAnswerBtn.className = 'btn btn-sm';
        showAnswerBtn.textContent = 'Show Answer';
        showAnswerBtn.style.marginTop = '15px';
        
        const answer = card.querySelector('.review-answer');
        answer.style.display = 'none';
        
        showAnswerBtn.addEventListener('click', () => {
            answer.style.display = 'block';
            showAnswerBtn.style.display = 'none';
        });
        
        card.insertBefore(showAnswerBtn, card.querySelector('.review-rating'));
    });
    
    ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.review-card');
            const cardId = Array.from(reviewCards).indexOf(card);
            
            // Clear previous selections
            card.querySelectorAll('.rating-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Mark selected button
            button.classList.add('selected');
            
            // Update spaced repetition schedule
            if (window.spacedRepetition) {
                window.spacedRepetition.updateItem(`card-${cardId}`, parseInt(button.getAttribute('data-rating')));
            }
            
            // Show next card or completion message
            setTimeout(() => {
                card.style.display = 'none';
                
                const nextCard = reviewCards[cardId + 1];
                if (nextCard) {
                    nextCard.style.display = 'block';
                } else {
                    // All cards reviewed
                    const completionMsg = document.createElement('div');
                    completionMsg.className = 'card';
                    completionMsg.style.marginTop = '20px';
                    completionMsg.innerHTML = `
                        <div class="card-body" style="text-align: center;">
                            <h3>Review Complete!</h3>
                            <p>Great job! Your next review session has been scheduled.</p>
                            <button class="btn" onclick="location.reload()">Start Over</button>
                        </div>
                    `;
                    
                    document.querySelector('.spaced-repetition').appendChild(completionMsg);
                }
            }, 1000);
        });
    });
}

// Accessibility
function initializeAccessibility() {
    const accessibilityManager = new AccessibilityManager();
    accessibilityManager.loadPreferences();
}

class AccessibilityManager {
    constructor() {
        this.highContrastMode = false;
        this.fontSize = 'medium';
        this.screenReader = false;
        this.initializeControls();
    }
    
    initializeControls() {
        const contrastToggle = document.getElementById('contrast-toggle');
        const fontDecrease = document.getElementById('font-decrease');
        const fontIncrease = document.getElementById('font-increase');
        const screenReaderToggle = document.getElementById('screen-reader-toggle');
        
        contrastToggle.addEventListener('click', () => {
            this.toggleHighContrast();
        });
        
        fontDecrease.addEventListener('click', () => {
            this.decreaseFontSize();
        });
        
        fontIncrease.addEventListener('click', () => {
            this.increaseFontSize();
        });
        
        screenReaderToggle.addEventListener('click', () => {
            this.toggleScreenReader();
        });
    }
    
    toggleHighContrast() {
        this.highContrastMode = !this.highContrastMode;
        document.body.classList.toggle('high-contrast', this.highContrastMode);
        
        // Save preference
        localStorage.setItem('highContrast', this.highContrastMode);
    }
    
    decreaseFontSize() {
        const sizes = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(this.fontSize);
        
        if (currentIndex > 0) {
            this.fontSize = sizes[currentIndex - 1];
            this.applyFontSize();
        }
    }
    
    increaseFontSize() {
        const sizes = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(this.fontSize);
        
        if (currentIndex < sizes.length - 1) {
            this.fontSize = sizes[currentIndex + 1];
            this.applyFontSize();
        }
    }
    
    applyFontSize() {
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${this.fontSize}`);
        
        // Save preference
        localStorage.setItem('fontSize', this.fontSize);
    }
    
    toggleScreenReader() {
        this.screenReader = !this.screenReader;
        
        if (this.screenReader) {
            this.enableScreenReaderMode();
        } else {
            this.disableScreenReaderMode();
        }
        
        // Save preference
        localStorage.setItem('screenReader', this.screenReader);
    }
    
    enableScreenReaderMode() {
        // Add ARIA attributes to interactive elements
        document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
            if (!element.getAttribute('aria-label')) {
                const text = element.textContent.trim();
                if (text) {
                    element.setAttribute('aria-label', text);
                }
            }
        });
        
        // Announce screen reader mode enabled
        this.announceToScreenReader('Screen reader mode enabled');
    }
    
    disableScreenReaderMode() {
        // Announce screen reader mode disabled
        this.announceToScreenReader('Screen reader mode disabled');
    }
    
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    loadPreferences() {
        // Load saved preferences
        const highContrast = localStorage.getItem('highContrast') === 'true';
        const fontSize = localStorage.getItem('fontSize') || 'medium';
        const screenReader = localStorage.getItem('screenReader') === 'true';
        
        // Apply preferences
        if (highContrast) {
            this.toggleHighContrast();
        }
        
        this.fontSize = fontSize;
        this.applyFontSize();
        
        if (screenReader) {
            this.toggleScreenReader();
        }
    }
}

// Voice Control
function initializeVoiceControl() {
    const voiceControl = new VoiceControl();
}

class VoiceControl {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = {
            'go to dashboard': () => this.navigateTo('dashboard'),
            'go to learning': () => this.navigateTo('learning'),
            'go to lab': () => this.navigateTo('lab'),
            'go to social': () => this.navigateTo('social'),
            'go to gamification': () => this.navigateTo('gamification'),
            'go to progress': () => this.navigateTo('progress'),
            'go to quiz': () => this.navigateTo('quiz'),
            'go to spaced': () => this.navigateTo('spaced'),
            'go to resources': () => this.navigateTo('resources'),
            'go to settings': () => this.navigateTo('settings'),
            'start experiment': () => this.startExperiment(),
            'next lesson': () => this.nextLesson(),
            'previous lesson': () => this.previousLesson(),
            'help': () => this.showHelp()
        };
        
        this.initializeVoiceControl();
    }
    
    initializeVoiceControl() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase().trim();
                this.processCommand(command);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
            };
            
            this.recognition.onend = () => {
                this.stopListening();
            };
            
            // Add voice control button
            this.addVoiceControlButton();
        } else {
            console.log('Speech recognition not supported');
        }
    }
    
    addVoiceControlButton() {
        const voiceButton = document.getElementById('voice-control-btn');
        
        voiceButton.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });
    }
    
    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
            this.isListening = true;
            
            const voiceButton = document.getElementById('voice-control-btn');
            voiceButton.classList.add('listening');
            
            // Show listening indicator
            this.showListeningIndicator();
        }
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            
            const voiceButton = document.getElementById('voice-control-btn');
            voiceButton.classList.remove('listening');
            
            // Hide listening indicator
            this.hideListeningIndicator();
        }
    }
    
    showListeningIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'voice-listening-indicator';
        indicator.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
        
        document.body.appendChild(indicator);
        this.listeningIndicator = indicator;
    }
    
    hideListeningIndicator() {
        if (this.listeningIndicator) {
            this.listeningIndicator.remove();
            this.listeningIndicator = null;
        }
    }
    
    processCommand(command) {
        console.log('Voice command:', command);
        
        // Check if command matches any predefined commands
        for (const [phrase, action] of Object.entries(this.commands)) {
            if (command.includes(phrase)) {
                action();
                return;
            }
        }
        
        // If no match, show help
        this.showHelp();
    }
    
    navigateTo(page) {
        // Navigate to the appropriate page
        window.location.href = `${page}.html`;
    }
    
    startExperiment() {
        // Check if we're on the lab page
        if (document.getElementById('lab-page')) {
            const startButton = document.getElementById('start-lab-experiment');
            if (startButton) {
                startButton.click();
            }
        } else {
            // Navigate to lab page first
            window.location.href = 'lab.html';
        }
    }
    
    nextLesson() {
        // Implementation would depend on lesson structure
        console.log('Next lesson command');
    }
    
    previousLesson() {
        // Implementation would depend on lesson structure
        console.log('Previous lesson command');
    }
    
    showHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'modal';
        helpModal.style.display = 'flex';
        helpModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Voice Commands</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <ul>
                        <li>"Go to dashboard" - Navigate to dashboard</li>
                        <li>"Go to learning" - Navigate to learning hub</li>
                        <li>"Go to lab" - Navigate to virtual lab</li>
                        <li>"Go to social" - Navigate to social learning</li>
                        <li>"Go to gamification" - Navigate to gamification</li>
                        <li>"Go to progress" - Navigate to progress tracking</li>
                        <li>"Go to quiz" - Navigate to quiz</li>
                        <li>"Go to spaced" - Navigate to spaced repetition</li>
                        <li>"Go to resources" - Navigate to resources</li>
                        <li>"Go to settings" - Navigate to settings</li>
                        <li>"Start experiment" - Start lab experiment</li>
                        <li>"Next lesson" - Go to next lesson</li>
                        <li>"Previous lesson" - Go to previous lesson</li>
                        <li>"Help" - Show this help</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        
        helpModal.querySelector('.modal-close').addEventListener('click', () => {
            helpModal.remove();
        });
        
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        });
    }
}

// Offline Mode
function initializeOfflineMode() {
    const offlineManager = new OfflineManager();
}

class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showOnlineStatus();
            this.syncData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineStatus();
        });
    }
    
    showOnlineStatus() {
        const notification = document.createElement('div');
        notification.className = 'online-status';
        notification.innerHTML = '<i class="fas fa-wifi"></i> You are back online';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    showOfflineStatus() {
        const notification = document.createElement('div');
        notification.className = 'offline-status';
        notification.innerHTML = '<i class="fas fa-wifi-slash"></i> You are offline. Some features may be limited.';
        
        document.body.appendChild(notification);
        this.offlineNotification = notification;
    }
    
    syncData() {
        // Remove offline notification
        if (this.offlineNotification) {
            this.offlineNotification.remove();
            this.offlineNotification = null;
        }
        
        // Get offline data and sync with server
        this.getOfflineData().then(offlineData => {
            if (offlineData && offlineData.length > 0) {
                this.syncWithServer(offlineData).then(() => {
                    this.clearOfflineData();
                    this.showSyncCompleteNotification();
                });
            }
        });
    }
    
    getOfflineData() {
        return new Promise((resolve) => {
            const offlineData = localStorage.getItem('offlineData');
            resolve(offlineData ? JSON.parse(offlineData) : []);
        });
    }
    
    syncWithServer(data) {
        return new Promise((resolve) => {
            // Simulate server sync
            setTimeout(() => {
                console.log('Data synced with server:', data);
                resolve();
            }, 1000);
        });
    }
    
    clearOfflineData() {
        localStorage.removeItem('offlineData');
    }
    
    showSyncCompleteNotification() {
        const notification = document.createElement('div');
        notification.className = 'online-status';
        notification.innerHTML = '<i class="fas fa-check-circle"></i> Your data has been synced';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    saveOfflineData(data) {
        const existingData = localStorage.getItem('offlineData');
        const offlineData = existingData ? JSON.parse(existingData) : [];
        offlineData.push(data);
        localStorage.setItem('offlineData', JSON.stringify(offlineData));
    }
    
    isAvailable() {
        return this.isOnline;
    }
}

// Adaptive Learning
function initializeAdaptiveLearning() {
    window.adaptiveLearning = new AdaptiveLearning();
}

class AdaptiveLearning {
    constructor() {
        this.studentData = this.loadStudentData();
    }
    
    loadStudentData() {
        const saved = localStorage.getItem('studentData');
        return saved ? JSON.parse(saved) : {
            strengths: [],
            weaknesses: [],
            learningPath: 'standard'
        };
    }
    
    saveStudentData() {
        localStorage.setItem('studentData', JSON.stringify(this.studentData));
    }
    
    updatePerformance(topic, score) {
        if (score >= 80) {
            // Student is strong in this topic
            if (!this.studentData.strengths.includes(topic)) {
                this.studentData.strengths.push(topic);
            }
            
            // Remove from weaknesses if present
            const weaknessIndex = this.studentData.weaknesses.indexOf(topic);
            if (weaknessIndex !== -1) {
                this.studentData.weaknesses.splice(weaknessIndex, 1);
            }
        } else if (score < 60) {
            // Student is weak in this topic
            if (!this.studentData.weaknesses.includes(topic)) {
                this.studentData.weaknesses.push(topic);
            }
            
            // Remove from strengths if present
            const strengthIndex = this.studentData.strengths.indexOf(topic);
            if (strengthIndex !== -1) {
                this.studentData.strengths.splice(strengthIndex, 1);
            }
        }
        
        // Update learning path based on performance
        this.updateLearningPath();
        
        this.saveStudentData();
        
        // Show recommendation
        this.showRecommendation();
    }
    
    updateLearningPath() {
        if (this.studentData.weaknesses.length > 2) {
            // Student has multiple weaknesses - remedial path
            this.studentData.learningPath = 'remedial';
        } else if (this.studentData.strengths.length > 3) {
            // Student has multiple strengths - advanced path
            this.studentData.learningPath = 'advanced';
        } else {
            // Standard path
            this.studentData.learningPath = 'standard';
        }
    }
    
    getNextRecommendation() {
        // Recommend content based on learning path
        if (this.studentData.learningPath === 'remedial') {
            // Focus on weaknesses
            return {
                type: 'Remedial',
                topic: this.studentData.weaknesses[0] || 'Practice Problems',
                reason: 'You need more practice in this area'
            };
        } else if (this.studentData.learningPath === 'advanced') {
            // Recommend advanced content
            return {
                type: 'Advanced',
                topic: 'Advanced Applications',
                reason: 'You\'re ready for more challenging content'
            };
        } else {
            // Standard path - continue with curriculum
            return {
                type: 'Standard',
                topic: 'Next Module',
                reason: 'Continue with your learning journey'
            };
        }
    }
    
    showRecommendation() {
        const recommendation = this.getNextRecommendation();
        const recommendationCard = document.getElementById('recommendation-card');
        
        if (recommendationCard) {
            document.getElementById('recommendation-type').textContent = recommendation.type;
            document.getElementById('recommendation-topic').textContent = recommendation.topic;
            document.getElementById('recommendation-reason').textContent = recommendation.reason;
            
            recommendationCard.style.display = 'block';
        }
    }
}

// Spaced Repetition System
class SpacedRepetition {
    constructor() {
        this.schedule = this.loadSchedule();
    }
    
    loadSchedule() {
        const saved = localStorage.getItem('spacedRepetition');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveSchedule() {
        localStorage.setItem('spacedRepetition', JSON.stringify(this.schedule));
    }
    
    reviewItem(itemId) {
        if (!this.schedule[itemId]) {
            this.schedule[itemId] = {
                level: 0,
                nextReview: Date.now()
            };
        }
        
        const now = Date.now();
        if (now >= this.schedule[itemId].nextReview) {
            // Item is due for review
            return true;
        }
        return false;
    }
    
    updateItem(itemId, quality) {
        if (!this.schedule[itemId]) {
            this.schedule[itemId] = { level: 0 };
        }
        
        // SM-2 algorithm implementation
        const item = this.schedule[itemId];
        if (quality >= 3) {
            if (item.level === 0) {
                item.level = 1;
            } else {
                item.level = item.level * item.interval;
            }
        } else {
            item.level = 0;
        }
        
        item.interval = this.calculateInterval(item.level);
        item.nextReview = Date.now() + item.interval * 24 * 60 * 60 * 1000; // Convert days to ms
        
        this.saveSchedule();
    }
    
    calculateInterval(level) {
        if (level === 0) return 1;
        if (level === 1) return 6;
        return level * 4; // Subsequent intervals
    }
}

// Settings
function initializeSettings() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode', darkModeToggle.checked);
            
            // Save preference
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.darkMode = darkModeToggle.checked;
            localStorage.setItem('userData', JSON.stringify(userData));
        });
    }
    
    // Font size select
    const fontSizeSelect = document.getElementById('font-size-select');
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', () => {
            document.body.classList.remove('font-small', 'font-medium', 'font-large');
            document.body.classList.add(`font-${fontSizeSelect.value}`);
            
            // Save preference
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.fontSize = fontSizeSelect.value;
            localStorage.setItem('userData', JSON.stringify(userData));
        });
    }
    
    // Difficulty select
    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
        difficultySelect.addEventListener('change', () => {
            // Save preference
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.difficulty = difficultySelect.value;
            localStorage.setItem('userData', JSON.stringify(userData));
        });
    }
    
    // Notifications toggle
    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', () => {
            // Save preference
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.notifications = notificationsToggle.checked;
            localStorage.setItem('userData', JSON.stringify(userData));
        });
    }
}

// Load User Data
function loadUserData() {
    // Load user preferences and data
    const userData = localStorage.getItem('userData');
    if (userData) {
        const data = JSON.parse(userData);
        
        // Apply user preferences
        if (data.darkMode) {
            document.body.classList.add('dark-mode');
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            if (darkModeToggle) {
                darkModeToggle.checked = true;
            }
        }
        
        if (data.fontSize) {
            document.body.classList.add(`font-${data.fontSize}`);
            const fontSizeSelect = document.getElementById('font-size-select');
            if (fontSizeSelect) {
                fontSizeSelect.value = data.fontSize;
            }
        }
        
        if (data.difficulty) {
            const difficultySelect = document.getElementById('difficulty-select');
            if (difficultySelect) {
                difficultySelect.value = data.difficulty;
            }
        }
        
        if (data.notifications !== undefined) {
            const notificationsToggle = document.getElementById('notifications-toggle');
            if (notificationsToggle) {
                notificationsToggle.checked = data.notifications;
            }
        }
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Modal functionality
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Chat functionality
    window.sendChatMessage = function(groupId) {
        const input = document.getElementById(`message-input-${groupId}`);
        const message = input.value.trim();
        
        if (message) {
            // Add message to chat
            const chatMessages = document.getElementById(`chat-${groupId}`);
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message';
            messageElement.innerHTML = `
                <div class="message-header">
                    <span class="message-user">You</span>
                    <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div class="message-content">${message}</div>
            `;
            
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Clear input
            input.value = '';
            
            // Award points for social interaction
            gamificationSystem.addPoints(5);
        }
    };
    
    // Handle enter key in chat inputs
    document.querySelectorAll('.chat-input input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const groupId = input.id.replace('message-input-', '');
                sendChatMessage(groupId);
            }
        });
    });
    
    // Dark mode toggle
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'btn btn-sm';
    darkModeToggle.style.marginLeft = '10px';
    darkModeToggle.title = 'Toggle Dark Mode';
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Save preference
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.darkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('userData', JSON.stringify(userData));
    });
    
    document.querySelector('.user-profile').before(darkModeToggle);
    
    // Simulate quiz completion for adaptive learning
    setTimeout(() => {
        // Simulate completing a quiz with a score
        if (window.adaptiveLearning) {
            window.adaptiveLearning.updatePerformance('Chemical Reactions', 75);
        }
    }, 3000);
    
    // Initialize spaced repetition
    window.spacedRepetition = new SpacedRepetition();
}
