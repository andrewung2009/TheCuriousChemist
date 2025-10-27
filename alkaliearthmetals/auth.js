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
