const FIREBASE_URL = "https://join-b179e-default-rtdb.europe-west1.firebasedatabase.app";
let allTasks = [];

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
        let responseTasks = await fetch(`${FIREBASE_URL}/board.json`);
        let tasksAsJson = await responseTasks.json();
        // console.log(tasksAsJson);
        tasksToArray(tasksAsJson);
    } catch (error) {
        console.error("Error while loading tasks:", error);
        return {};
    }

}

/**
 * @function tasksToArray - Convert all loaded tasks into an Array and push in Array allTasks
 * @param {Object} tasksAsJson - Contains the existing tasks
 */
function tasksToArray(tasksAsJson) {
    for (const task in tasksAsJson.tasks) {
        allTasks.push(tasksAsJson.tasks[task]);
    }
    // console.log(tasksAsJson);
    // console.log(allTasks);
    renderTasksByStatus('toDo', 'to-do');
    renderTasksByStatus('inProgress', 'in-progress');
    renderTasksByStatus('awaitingFeedback', 'await-feedback');
    renderTasksByStatus('done', 'done');
}

/**
 * @function renderTasksByStatus - Filters the Tasks by Status and renders them in the respective Container
 * @param {string} status - Status of the Tasks
 * @param {string} containerID - ID of the Tasks
 */
function renderTasksByStatus(status, containerID) {
    let filteredStatus = allTasks.filter(allTasks => allTasks.status == status);
    let container = document.getElementById(containerID);
    container.innerHTML = "";
    for (let i = 0; i < filteredStatus.length; i++) {
        const task = filteredStatus[i];
        container.innerHTML += getLittleTaskCard(task);    console.log(task.subtasks);
    }
}



/**
 * @function getLittleTaskCard - Render the little Task-Card in Board
 * @param {Object} task - individual Tasks
 */
function getLittleTaskCard(task) {
    let description_short = shortenedDescription(task);
    return `<div onclick="" class="task-card">
                <span class="label user-story">${task.category}</span>
                <h3 class="task-title">${task.title}</h3>
                <span class="task-description-short">${description_short}</span>
                <div class="task-progress-container">
                    <div class="task-progressbar">
                        <div class="task-progrssbar-content" style="width: ${task.subtasks.done / task.subtasks};"></div>
                    </div>
                    <span></span>
                </div>
                <div style="display: flex; gap: 16px;">
                    <div>profiles</div>
                    <div>priority</div>
                </div>
            </div>`;
}

/**
 * @function shortenedDescription - Shorten the Description for the small Task-Cards
 * @param {Object} task - individual Tasks
 */
function shortenedDescription(task) {
    let maxLength = 30;
    let description_short = task.description_full.substring(0, maxLength) + "...";
    if (task.description_full.length > maxLength) {
        description_short;
    }
    return description_short;
}