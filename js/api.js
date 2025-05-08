const FIREBASE_URL = "https://join-b179e-default-rtdb.europe-west1.firebasedatabase.app";

async function getData(path="") {
    let response = await fetch(FIREBASE_URL + path + ".json");
    let responseAsJson = await response.json();
    return responseAsJson;
}

/**
 * Loads all tasks from the Kanban board stored in the Firebase database.
 *
 * @async
 * @function loadAllTasks
 * @returns {Promise<Object>} A promise that resolves to an object containing all tasks.
 *                            If an error occurs, an empty object will be returned.
 */
async function loadAllTasks() {
    try {
        const response = await fetch(`${FIREBASE_URL}/board/tasks.json`);
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error("Error while loading tasks:", error);
        return {};
    }
}

/**
 * Loads all users from the Firebase database.
 *
 * @async
 * @function loadAllUsers
 * @returns {Promise<Object>} A promise that resolves to an object containing all users.
 *                            If an error occurs, an empty object will be returned.
 */
async function loadAllUsers() {
    try {
        const response = await fetch(`${FIREBASE_URL}/users.json`);
        const users = await response.json();
        console.log("Users loaded:", users);
        return users;
    } catch (error) {
        console.error("Error while loading users:", error);
        return {};
    }
}

/**
 * Loads all contacts from the Firebase database.
 *
 * @async
 * @function loadAllContacts
 * @returns {Promise<Object>} A promise that resolves to an object containing all contacts.
 *                            If an error occurs, an empty object will be returned.
 */
async function loadAllContacts() {
    try {
        const response = await fetch(`${FIREBASE_URL}/contacts.json`);
        const contacts = await response.json();
        console.log("Contacts loaded:", contacts);
        return contacts;
    } catch (error) {
        console.error("Error while loading contacts:", error);
        return {};
    }
}

window.loadAllTasks = loadAllTasks;
window.loadAllUsers = loadAllUsers;
window.loadAllContacts = loadAllContacts;
