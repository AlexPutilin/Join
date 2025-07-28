let activeUser = "";

/** Initializes the app once the DOM is fully loaded. */
function initLogin() {
    setTimeout(() => {
        document.getElementById("splash-screen").classList.add("d-none");
    }, 1500);

    handleSplashScreen();
    renderForm(getLoginFormTemplate());
}


/**
 * Redirects the user to the login page if no user is currently logged in.
 */
function redirectIfNotLoggedIn() {
    if (!activeUser) {
        openPage('../index.html');       
    }
}


/**
 * Initializes the UI for users who are not authenticated.
 * Hides protected navigation buttons and shows login-related options.
 */  
function initUnauthUser() {
    updateMenuForUnauthUser();
    updateMobileMenuForUnauthUser();
}


/**
 * Initializes the profile section by loading the current user and displaying their initials.
 */
function initProfile() {
    loadUser();
    const profile = document.getElementById('profile');
    profile.innerHTML = getContactInitials(activeUser);
}


/**
 * This function handles navigation to a new HTML page when triggered by a button interaction.
 * @param {string} url - The destination URL to navigate to.
 */
function openPage(url) {
    window.location.href = url;
}


/**
 * Retrieves all entries from the given database path and returns them as an array of key-value pairs.
 *
 * @async
 * @function getAllEntries
 * @param {string} path - The path in the database from which to retrieve the entries.
 * @returns {Promise<Array<[string, any]>>} - A promise that resolves to an array of key-value pairs from the database object.
 */
async function getAllEntries(path) {
    let allEntriesRef = await getData(path);
    return Object.entries(allEntriesRef);
}


/**
 * Retrieves the value of an input element by its ID.
 *
 * @param {string} element - The ID of the input element.
 * @returns {string} The value of the input element.
 */
function getInput(element) {
    return document.getElementById(element).value;
}

/**
 * @function eventBubblingProtection - Stops the propagation of the event to parent elements.
 * @param {Event} event - The event object to stop from bubbling.
 */
function eventBubblingProtection(event) {
    event.stopPropagation();
}


/**
 * Closes the task detail view by hiding the overlay.
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


/**
 * Toggles the visibility of the profile menu overlay.
 * Adds or removes the 'd-none' class to show or hide the menu.
 */
function toggleProfileMenu() {
    const menu = document.getElementById('profile-menu-overlay');
    menu.classList.toggle('d-none');
}


/**
 * Updates the main menu UI for users who are not logged in.
 * Hides navigation buttons and enables login-related UI elements.
 */
function updateMenuForUnauthUser() {
    if (!activeUser) {
        const nav = document.querySelector('.navigate-btn-wrapper');
        const menuBtns = nav.querySelectorAll('.btn-menu');
        const loginBtn = document.getElementById('menu-login-btn');
        menuBtns.forEach(btn => {
            btn.classList.add('d-none');
        });
        loginBtn.classList.remove('d-none');
        disableProfileBtn();
        disableHelpBtn()
    }
}


/**
 * Updates the mobile menu UI for users who are not logged in.
 * Hides protected buttons and shows login-related options.
 */
function updateMobileMenuForUnauthUser() {
    if (!activeUser) {
        const menuBtns = document.querySelectorAll('.btn-menu-mobile');
        const unauthMenuBtns = document.querySelectorAll('.unauth-menu-btn');
        const btnWrapper = document.getElementById('unauth-menu-btn-wrapper');
        btnWrapper.classList.remove('d-none');
        menuBtns.forEach(btn => {
            btn.classList.add('d-none');
        });
        unauthMenuBtns.forEach(btn => {
            btn.classList.remove('d-none');
        });
        disableProfileBtn();
        disableHelpBtn()
    }
}


/**
 * Disables or hides the profile button in the UI.
 */
function disableProfileBtn() {
    const profileBtn = document.getElementById('btn-profile');
    profileBtn.classList.add('d-none');
}


/**
 * Disables or hides the help button in the UI.
 */
function disableHelpBtn() {
    const helpBtn = document.getElementById('help-btn');
    helpBtn.classList.add('d-none');
}


/**
 * Logs out the current user by resetting the active user 
 * and redirecting to the login page.
 */
function logout() {
    activeUser = "";
    sessionStorage.removeItem("user");
    openPage('../index.html');
}


/**
 * Saves the current active user to sessionStorage.
 */
function saveUser() {
    sessionStorage.setItem("user", activeUser);
}


/**
 * Loads the current user from sessionStorage and sets it as active.
 */
function loadUser() {
    activeUser = sessionStorage.getItem("user") || "";
}