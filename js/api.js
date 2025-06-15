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

async function deleteData(path = "") {
  try { 
      await fetch(FIREBASE_URL + path + ".json", {
          method: "DELETE",
      });
  } catch (error) {
      console.error("Error while deleting data from Firebase:", error);
  }
}

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
