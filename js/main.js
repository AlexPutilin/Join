let activeUser = "Guest"

/** Initializes the app once the DOM is fully loaded. */
function init() {
    setTimeout(() => {
        document.getElementById("splash-screen").classList.add("d-none");
    }, 1500);

    handleSplashScreen();
    renderForm(getLoginFormTemplate());
}


function redirectIfNotLoggedIn() {
    if (!activeUser) {
        openPage('./index.html');       
    }
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
}/**
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


/**
 * Logs out the current user by resetting the active user 
 * and redirecting to the login page.
 */
function logout() {
    // set activeUser = null;
    openPage('../index.html');
}