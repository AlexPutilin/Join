const FIREBASE_URL = "https://join-b179e-default-rtdb.europe-west1.firebasedatabase.app";
let allTasks = [];
let currentDraggedElement;
const statuses = ['to-do', 'in-progress', 'await-feedback', 'done'];

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
function renderAllTasks() {
    statuses.forEach(status => renderTasksByStatus(status));
}

/**
 * @function tasksToArray - Convert all loaded tasks into an Array and push in Array allTasks
 * @param {Object} tasksAsJson - Contains the existing tasks
 */
function tasksToArray(tasksAsJson) {
    for (const task in tasksAsJson.tasks) {
        allTasks.push(tasksAsJson.tasks[task]);
    }
    renderAllTasks();
}

// function updateBoardCard() {

// }

/**
 * @function renderTasksByStatus - Filters the Tasks by Status and renders them in the respective Container
 * @param {string} status - Status of the Tasks
 * @param {string} status - corresponds to the ID
 */
function renderTasksByStatus(status) {
    let container = document.getElementById(status);
    let filteredStatus = allTasks.filter(task => task.status === status);
    container.innerHTML = "";

    if (filteredStatus.length === 0) {
        return updateNoTasksDisplay(status, container);
    }

    for (let i = 0; i < filteredStatus.length; i++) {
        const task = filteredStatus[i];
        if (task.subtasks) {
            ({ subtasksLength, doneSubtasksLength, doneTasksLength, progress } = updateSubtasks(task));
        } else {
            console.log(`no subtasks for task: ${task.title}`);
            document.getElementById('task-progress-container').classList.add('hidden');
        }
        container.innerHTML += getTaskCard(task, progress, subtasksLength, doneTasksLength);
    }
}

function updateSubtasks(task) {
    const subtasks = Object.values(task.subtasks || {});
    const subtasksLength = subtasks.length;
    const doneTasksLength = subtasks.filter(s => s.done).length;
    const progress = calcuProgressbar(task);
    return { subtasksLength, doneTasksLength, progress };
}


function updateNoTasksDisplay(status, container) {
    let message = "no tasks";
    if (status === "to-do") {
        message = "no tasks to do";
    } else if (status === "in-progress") {
        message = "no tasks in progress";
    } else if (status === "await-feedback") {
        message = "no tasks await feedback";
    } else if (status === "done") {
        message = "no tasks done";
    }
    container.innerHTML = `<div class="placeholder-box"><p class="no-tasks-text">${message}</p></div>`;
}


/**
 * @function calcuProgressbar - Enables progress for the progress bar
 * @param {Object} task - individual Tasks
 * @returns progress - shows the calculated progress
 */
function calcuProgressbar(task) {
    const subtasksValue = Object.values(task.subtasks);
    const totalSubtaks = subtasksValue.length;
    const doneTasks = subtasksValue.filter(s => s.done).length;

    if (totalSubtaks === 0) {
        console.log("no subtasks available");
        return 0;
    }
    const progress = (doneTasks / totalSubtaks) * 100;
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

function moveTo(status) {
    console.log("Dropping task into:", status);
    allTasks[currentDraggedElement]['status'] = status;
    renderAllTasks();
}

function allowDrop(event) {
    event.preventDefault();
}

function startDragging(id) {
    currentDraggedElement = id;
    console.log("Started dragging task ID:", id);
}

/**
 * @function getTaskCard - Render the little Task-Card in Board
 * @param {Object} task - individual Tasks
 */
function getTaskCard(task, progress, subtasksLength, doneTasksLength) {
    const bgCategory = getBgCategory(task.category);
    let description_short = getShortenedDescription(task);
    return `<div draggable="true" ondragstart="startDragging(${task.id})" onclick="showOverview(${task.id})" id="task-card" class="task-card">
                <span class="label ${bgCategory}">${task.category}</span>
                <h3 class="task-title">${task.title}</h3>
                <span class="task-description-short">${description_short}</span>
                <div id="task-progress-container" class="task-progress-container">
                    <div class="task-progressbar">
                        <div class="task-progrssbar-content" style="width: ${progress}%;"></div>
                    </div>
                    <span class="task-progressbar-quotient">${doneTasksLength}/${subtasksLength} subtasks</span>
                </div>
                <div class="profiles-priority-container">
                    <div style="border: 2px solid black; border-radius: 100%; width: 32px; height: 32px;"></div>
                    <div>${getPriority(task)}</div>
                </div>
            </div>`;
}

function getPriority(task) {
    if (task.priority === "Urgent") {
        return `<img src="../assets/img/icon-prio-urgent.svg" alt="">`;
    } else if (task.priority === "Medium") {
        return `<img src="../assets/img/icon-prio-medium.svg" alt="">`;
    } else if (task.priority === "Low") {
        return `<img src="../assets/img/icon-prio-low.svg" alt="">`;
    } else {
        return "";
    }
}

//    
//        

function showOverview(id) {
    const task = allTasks.find(t => t.id === id);
    console.log(id);
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.remove('d-none');

    overlayRef.innerHTML = getOverviewTemplate(task);

}

function getOverviewTemplate(task) {
    const bgCategory = getBgCategory(task.category);
    return `    <div class="card-overview"><br>
                    
                    <span class="label ${bgCategory}">${task.category}</span><br>
                    <h2 class="task-title">${task.title}</h2><br>
                    <span class="task-description">${task.description_full}</span><br><br>
                    <span>Due Date: ${task.due_date}</span><br>
                    <div class="priority-wrapper">
                    <span>Priority: ${task.priority} </span>
                    ${getPriority(task)}
                    </div>
                    <br>
                    <div>
                        <span>Assigned To:</span>

                    </div>
                    <div>
                        <span>Subtasks:</span>

                    </div>
                </div>`;
}

/**
 * @function getShortenedDescription - Shorten the Description for the small Task-Cards
 * @param {Object} task - individual Tasks
 */
function getShortenedDescription(task) {
    let maxLength = 30;
    if (task.description_full.length > maxLength) {
        return task.description_full.substring(0, maxLength) + "...";
    }
}