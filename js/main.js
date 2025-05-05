/** Initializes the app once the DOM is fully loaded. */
function init() {
    handleSplashScreen();
}

/**
 * This function handles navigation to a new HTML page when triggered by a button interaction.
 * @param {string} url - The destination URL to navigate to.
 */
function openPage(url) {
    window.location.href = url;
}


