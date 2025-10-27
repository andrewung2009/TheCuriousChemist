// Leaderboard variables
let leaderboardUsers = [];

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
