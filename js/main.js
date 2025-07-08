let activeUser = ""

/** Initializes the app once the DOM is fully loaded. */
function init() {
    setTimeout(() => {
        document.getElementById("splash-screen").classList.add("d-none");
    }, 1500);
    
    handleSplashScreen();
}

/**
 * This function handles navigation to a new HTML page when triggered by a button interaction.
 * @param {string} url - The destination URL to navigate to.
 */
function openPage(url) {
    window.location.href = url;
}


/**
 * @function eventBubblingProtection - Stops the propagation of the event to parent elements.
 * @param {Event} event - The event object to stop from bubbling.
 */
function eventBubblingProtection(event) {
    event.stopPropagation();
}


/**
 * @function closeOverlay - Closes the task detail view.
 */
function closeOverlay() {
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.add('d-none');
}


/**
 * Extracts and returns the initials from a full name.
 * For names with multiple words, returns the first letter of the first two words.
 * 
 * @param {string} name - The full name of the contact.
 * @returns {string} The name initials.
 */
function getContactInitials(name) {
    let initials = name.split(" ");
    if (initials.length > 1) {
        initials = initials[0].charAt(0) + initials[1].charAt(0);
    } else {
        initials = initials[0].charAt(0);
    }
    return initials;
}


function initProfile() {
    const profile = document.getElementById('profile');
    profile.innerHTML = getContactInitials(activeUser);
}


/**
 * Toggles the visibility of the profile menu overlay.
 * Adds or removes the 'd-none' class to show or hide the menu.
 */
function toggleProfileMenu() {
    const menu = document.getElementById('profile-menu-overlay');
    menu.classList.toggle('d-none');
}


function updateMenuForUnauthUser() {
    const nav = document.querySelector('.navigate-btn-wrapper');
    const menuBtns = nav.querySelectorAll('.btn-menu');
    const loginBtn = document.getElementById('menu-login-btn');
    const profileBtn = document.getElementById('btn-profile');
    if (!activeUser) {
        menuBtns.forEach(btn => {
            btn.classList.add('d-none');
        });
        loginBtn.classList.remove('d-none');
        profileBtn.classList.add('d-none');
    }
}


/**
 * Logs out the current user by resetting the active user 
 * and redirecting to the login page.
 */
function logout() {
    activeUser = null;
    openPage('../index.html');
}