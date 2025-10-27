// Feedback variables
let feedbackData = [];

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
