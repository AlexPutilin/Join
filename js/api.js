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
    } catch (error) {
        console.error("Error fetching data from path:", path, error);
        return {};
    }
}

/**
 * Generates a new unique ID based on the number of existing entries at the given path.
 * The ID is computed as the current count of entries plus one.
 * @async
 * @function generateUID
 * @param {string} path - The path in the database where entries are stored (e.g. '/users').
 * @returns {Promise<number>} - A promise that resolves to the next unique numeric ID.
 */
async function generateUID(path) {
    const allEntries = await getAllEntries(path);
    const currentCount = allEntries ? Object.keys(allEntries).length : 0;
    return currentCount + 1;
  }
  
  
  async function getAllEntries(path = "") {
    try {
        const response = await fetch(`${FIREBASE_URL}${path}.json`);
        const json = await response.json();
        return json || {};
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        return {};
    }
  }
  
  async function putData(path, data) {
    try {
        await fetch(`${FIREBASE_URL}${path}.json`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error("Fehler beim Speichern in Firebase:", error);
    }
  }