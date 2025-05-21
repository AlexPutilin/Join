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
 * Generates a new unique ID based on the number of existing entries at the given path.
 * The ID is computed as the current count of entries plus one.
 *
 * @async
 * @function generateUID
 * @param {string} path - The path in the database where entries are stored (e.g. '/users').
 * @returns {Promise<number>} - A promise that resolves to the next unique numeric ID.
 */
async function generateUID(path) {  
    let allEntries = await getAllEntries(path);
    let currentCount = allEntries.length;
    
    return currentCount + 1;
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
 * Sends data to a specific Firebase Realtime Database path using PUT (overwrites data at the given path).
 * @param {string} path - The Firebase DB path (e.g. "users/user1").
 * @param {Object} data - The data object to store at the given path.
 * @returns {Promise<Object>} - The response JSON from Firebase.
 */
async function putData(path = "", data = {}) {
    let response = await fetch(FIREBASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return responseAsJson = await response.json();
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