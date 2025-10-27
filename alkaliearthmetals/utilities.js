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
