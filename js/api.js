const FIREBASE_URL = "https://join-b179e-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Fetches data from the Firebase Realtime Database at the specified path.
 * 
 * @param {string} [path=""] - The path in the database to fetch data from.
 * @returns {Promise<any>} - A promise that resolves to the fetched JSON data.
 */
async function getData(path = "") {
    try {
        let response = await fetch(FIREBASE_URL + "/" + path + ".json");
        let responseAsJson = await response.json();
        return responseAsJson;
    }
    catch (error) {
        console.error("Error while loading:", error);
        return {};
    }
}


/**
 * Sends a DELETE request to the specified Firebase path to remove data.
 * 
 * @param {string} [path=""] - The relative path in the Firebase database to delete data from.
 * @returns {Promise<void>} A promise that resolves when the request is completed.
 */
async function deleteData(path = "") {
    try { 
        await fetch(FIREBASE_URL + path + ".json", {
            method: "DELETE",
        });
    } catch (error) {
        console.error("Error while deleting data from Firebase:", error);
    }    
}


/**
 * Sends a POST request to the specified Firebase path to add new data.
 * 
 * @param {string} [path=""] - The relative path in the Firebase database to post data to.
 * @param {Object} [data={}] - The data object to be stored.
 * @returns {Promise<void>} A promise that resolves when the request is completed.
 */
async function postData(path = "", data = {}) {
    try {
        await fetch(FIREBASE_URL + path + ".json", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error("Error while pushing data in Firebase:", error);
    }
}


/**
 * Sends a PUT request to the specified Firebase path to manipulate data.
 * 
 * @param {string} [path=""] - The relative path in the Firebase database to put data to.
 * @param {Object} [data={}] - The data object to be stored.
 * @returns {Promise<void>} A promise that resolves when the request is completed.
 */
async function updateData(path = "", data = {}) {
    try {
        await fetch(FIREBASE_URL + path + ".json", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Error while update data in Firebase:", error);
    }
}

/**
 * Sends a PATCH request to the specified Firebase path to update parts of data.
 * 
 * @param {string} [path=""] - The relative path in the Firebase database to patch data to.
 * @param {Object} [data={}] - The partial data object to update.
 * @returns {Promise<void>} A promise that resolves when the request is completed.
 */
async function patchData(path = "", data = {}) {
    try {
        await fetch(FIREBASE_URL + path + ".json", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Error while patching data in Firebase:", error);
    }
}
