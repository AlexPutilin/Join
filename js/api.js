const FIREBASE_URL = "https://join-b179e-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Gibt alle Einträge unter dem angegebenen Pfad zurück (als Objekt).
 */
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

/**
 * Generiere eine ID auf Basis des höchsten vorhandenen "taskX"-Keys.
 */
async function generateUID(dataPath) {
    const existingEntries = await getAllEntries(dataPath);
    const entryKeys = existingEntries ? Object.keys(existingEntries) : [];
  
    const extractedTaskIds = entryKeys
      .map(entryKey => {
        const match = entryKey.match(/^task(\d+)$/);
        return match ? parseInt(match[1], 10) : NaN;
      })
      .filter(taskId => !isNaN(taskId));
  
    const highestExistingId = extractedTaskIds.length
      ? Math.max(...extractedTaskIds)
      : 0;
  
    return highestExistingId + 1;
  }
  

/**
 * PUT <path>.json mit dem JSON-String von data.
 */
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

/**
 * Liefert JSON unter <path>.json zurück.
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
