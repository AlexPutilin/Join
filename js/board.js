const FIREBASE_URL = "https://join-b179e-default-rtdb.europe-west1.firebasedatabase.app";
let allTasks = [];
let currentDraggedElement;
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

function updateBoardCard() {

}

/**
 * @function renderTasksByStatus - Filters the Tasks by Status and renders them in the respective Container
 * @param {string} status - Status of the Tasks
 * @param {string} containerID - ID of the Tasks
 */
function renderTasksByStatus(status, containerID) {
    let filteredStatus = allTasks.filter(task => task.status === status);
    let container = document.getElementById(containerID);
    container.innerHTML = "";

    if (filteredStatus.length === 0) {
        return updateNoTasksDisplay(status, container);
    }

    for (let i = 0; i < filteredStatus.length; i++) {
        const task = filteredStatus[i];
        let subtasksLength = 0;
        let doneSubtasksLength = 0;
        let doneTasksLength = 0;
        let progress = 0;

        if (task.subtasks) {
            ({ subtasksLength, doneSubtasksLength, doneTasksLength, progress } = updateSubtasks(subtasksLength, task, doneSubtasksLength, doneTasksLength, progress));
        } else {
            console.log(`no subtasks for task: ${task.title}`);
        }
        container.innerHTML += getLittleTaskCard(task, progress, subtasksLength, doneTasksLength);
    }
}

function updateSubtasks(subtasksLength, task, doneSubtasksLength, doneTasksLength, progress) {
    subtasksLength = Object.keys(task.subtasks).length;
    doneSubtasksLength = Object.values(task.subtasks);
    doneTasksLength = doneSubtasksLength.filter(s => s.done).length;
    progress = calcuProgressbar(task);
    return { subtasksLength, doneSubtasksLength, doneTasksLength, progress };
}

function updateNoTasksDisplay(status, container) {
    let message = "no tasks";
    if (status === "toDo") message = "no tasks to do";
    else if (status === "inProgress") message = "no tasks in progress";
    else if (status === "awaitingFeedback") message = "no tasks awaiting feedback";
    else if (status === "done") message = "no tasks done";

    container.innerHTML = `<div class="placeholder-box"><p class="no-tasks-text">${message}</p></div>`;
    return;
}

/**
 * @function calcuProgressbar - Enables progress for the progress bar
 * @param {Object} task - individual Tasks
 * @returns progress - shows the calculated progress
 */
function calcuProgressbar(task) {
    const subtasksValue = Object.values(task.subtasks);
    // console.log(subtasksValue);
    const totalSubtaks = subtasksValue.length;
    const doneTasks = subtasksValue.filter(s => s.done).length;

    if (totalSubtaks === 0) {
        console.log("no subtasks available");
        return 0;
    }
    const progress = (doneTasks / totalSubtaks) * 100;
    // console.log(progress);
    return progress;
}

/**
 * @function getBgCategory - determines the background color of the respective category
 * @param {String} category - possible category of tasks
 * @returns - returns the class for the background color
 */
function getBgCategory(category) {
    if (category === "User Story") {
        return "user-story";

    } else if (category === "Technical Task") {
        return "technical-task";

    } else {
        console.error("the background-color could not be assigned", category);
        return "default-category";
    }
}

function moveTo(tasks, status) {
    tasks[currentDraggedElement]['status'] = status;
    renderTasksByStatus('toDo', 'to-do');
    renderTasksByStatus('inProgress', 'in-progress');
    renderTasksByStatus('awaitingFeedback', 'await-feedback');
    renderTasksByStatus('done', 'done');
}

function allowDrop(event) {
    event.preventDefault();
}

function startDragging(tasks) {
    currentDraggedElement = tasks;

}
/**
 * @function getLittleTaskCard - Render the little Task-Card in Board
 * @param {Object} task - individual Tasks
 */
function getLittleTaskCard(task, progress, subtasksLength, doneTasksLength) {
    const bgCategory = getBgCategory(task.category);
    let description_short = shortenedDescription(task);
    return `<div draggable="true"  ondragstart="startDragging(${task.title})" onclick="" id="task-card" class="task-card">
                <span class="label ${bgCategory}">${task.category}</span>
                <h3 class="task-title">${task.title}</h3>
                <span class="task-description-short">${description_short}</span>
                <div id="task-progress-container" class="task-progress-container">
                    <div class="task-progressbar">
                        <div class="task-progrssbar-content" style="width: ${progress}%;"></div>
                    </div>
                    <span class="task-progressbar-quotient">${doneTasksLength}/${subtasksLength} subtasks</span>
                </div>
                <div class="profiles-priority" style="display: flex; gap: 16px;">
                    <div></div>
                    <div ></div>
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
        return description_short;
    }
}