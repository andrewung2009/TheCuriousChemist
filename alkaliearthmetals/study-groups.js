// Study groups variables
let studyGroups = [];

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
