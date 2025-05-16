const FIREBASE_URL = "https://join-b179e-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Fetches data from the Firebase Realtime Database at the specified path.
 * 
 * @param {string} [path=""] - The path in the database to fetch data from.
 * @returns {Promise<any>} - A promise that resolves to the fetched JSON data.
 */
async function getData(path = "") {
    try {
        let response = await fetch(FIREBASE_URL + path + ".json");
        let responseAsJson = await response.json();
        return responseAsJson;
    }
    catch (error) {
        console.error("Error while loading:", error);
        return {};
    }
}