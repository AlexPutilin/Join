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






//------- LOGOUT FUNCTION: CAN BE MIGRATET TO LOGIN.JS FILE OR KEEP IN MAIN.JS ---------

/**
 * Toggles the visibility of the profile menu overlay.
 * Adds or removes the 'd-none' class to show or hide the menu.
 */
function toggleProfileMenu() {
    const menu = document.getElementById('profile-menu-overlay');
    menu.classList.toggle('d-none');
}


/**
 * Logs out the current user by resetting the active user 
 * and redirecting to the login page.
 */
function logout() {
    // set activeUser = null;
    openPage('../index.html');
}