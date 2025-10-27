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
