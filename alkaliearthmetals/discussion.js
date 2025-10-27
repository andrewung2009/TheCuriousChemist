// Discussion variables
let discussionPosts = [];

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
