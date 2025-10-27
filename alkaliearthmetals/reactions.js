// Reactions variables
let reactionsData = {};

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
