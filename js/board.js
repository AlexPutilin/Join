let allTasks = [];
let currentTasks = [];
let currentDraggedElement;
const statuses = ['to-do', 'in-progress', 'await-feedback', 'done'];

async function initBoard() {
    // await getData('/board');
    await tasksToArray();
}

function renderAllTasks(taskList = allTasks) {
    statuses.forEach(status => renderTasksByStatus(status, taskList));
}

/**
 * @function tasksToArray - Convert all loaded tasks into an Array and push in Array allTasks
 * @param {Object} tasksAsJson - Contains the existing tasks
 */
async function tasksToArray() {
    let taskResponse = await getData("/board/tasks");
    allTasks = [];

    for (let key in taskResponse) {
        let task = taskResponse[key];
        allTasks.push({
            id: key,
            ...task
        });
    }

    console.log("All Tasks:", allTasks);
    currentTasks = allTasks;
    renderAllTasks();
}

/**
 * @function renderTasksByStatus - Filters the Tasks by Status and renders them in the respective Container
 * @param {string} status - Status of the Tasks
 * @param {string} status - corresponds to the ID
 */
function renderTasksByStatus(status, taskList) {
    let container = document.getElementById(status);
    let filteredStatus = taskList.filter(task => task.status === status);
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
    let message = "No Tasks";
    if (status === "to-do") {
        message = "No Tasks To Do";
    } else if (status === "in-progress") {
        message = "No Tasks In Progress";
    } else if (status === "await-feedback") {
        message = "No Tasks Await Feedback";
    } else if (status === "done") {
        message = "No Tasks Done";
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




async function updateTaskInFirebase(taskId, updatedTask) {
    try {
        await fetch(`${FIREBASE_URL}/board/tasks/${taskId}.json`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTask)
        });
        console.log(`Task ${taskId} erfolgreich aktualisiert`);
    } catch (error) {
        console.error("Error while loading tasks(PUT):", error);
    }
}


function moveTo(status) {
    console.log("Dropping task into:", status);

    let taskIndex = allTasks.findIndex(t => t.id === currentDraggedElement);
    if (taskIndex === -1) {
        console.error("Task not found:", currentDraggedElement);
        return;
    }

    let task = allTasks[taskIndex];

    task.status = status;

    updateTaskInFirebase(task.id, task);

    allTasks[taskIndex] = task;
    renderAllTasks();
}

// function allowDrop(event) {
//     event.preventDefault();
// }

// function startDragging(id) {
//     console.log(allTasks.tasks);
//     currentDraggedElement = task.id;
//     console.log("Started dragging task ID:", task.id);
// }

const draggables = document.querySelectorAll('.card');
const dragAndDropContainers = document.querySelectorAll('.drag-drop-container');

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
        currentDraggedElement = draggable.id;
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    })
})

dragAndDropContainers.forEach(dragAndDropContainer => {
    dragAndDropContainer.addEventListener('dragover', event => {
        event.preventDefault();
        const afterElement = getDragAfterElement(dragAndDropContainer, event.clientY);
        const draggable = document.querySelector('.dragging');
        if (draggable) {
            if (afterElement == null) {
                dragAndDropContainer.appendChild(draggable)
            } else {
                dragAndDropContainer.insertBefore(draggable, afterElement)
            }
        } else {
            console.warn("Kein Element mit Klasse '.dragging' gefunden!");
        }
    })
})

dragAndDropContainers.forEach(dragAndDropContainer => {
    dragAndDropContainer.addEventListener('drop', event => {
        event.preventDefault();
        const status = dragAndDropContainer.id;
        moveTo(status);
    })
})

function getDragAfterElement(dragAndDropContainer, y) {
    const draggableElements = [...dragAndDropContainer.querySelectorAll('.dragging:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

/**
 * @function getTaskCard - Render the little Task-Card in Board
 * @param {Object} task - individual Tasks
 */
function getTaskCard(task, progress, subtasksLength, doneTasksLength) {
    console.log(task);
    const bgCategory = getBgCategory(task.category);
    let description_short = getShortenedDescription(task);
    return `<div draggable="true" onclick="showOverview('${task.id}')" id="${task.id}" class="card">
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
    const task = allTasks.find(t => t.id.toString() === id.toString());
    console.log(id);
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.remove('d-none');

    overlayRef.innerHTML = getOverviewTemplate(task);

}

function getOverviewTemplate(task) {
    const bgCategory = getBgCategory(task.category);
    return `    <div class="card-overview">
                    <div class="card-overview-header">
                        <span class="label ${bgCategory}">${task.category}</span><br>
                        <button onclick="closeOverview()" class="btn-small">
                            <img class="icon-default" src="../assets/img/icon-close-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
                        </button>
                    </div>

                    <h2 class="task-title">${task.title}</h2><br>
                    <span class="task-description">${task.description_full}</span><br><br>

                    <div class="">
                        <span style="padding-right: 16px;" class="font-color ">Due Date:</span>
                        <span> ${task.due_date}</span>
                    </div>
<br>
                    <div class="priority-wrapper ">
                        <span style="padding-right: 36px;" class="font-color">Priority:</span>
                        <span > ${task.priority} </span>
                        ${getPriority(task)}
                    </div>



                    <br>
                    <div>
                        <span class="font-color">Assigned To:</span>

                    </div>
                    <div>
                        <span class="font-color">Subtasks:</span>

                    </div>

                    <div class="delete-and-edit-wrapper">
                        <button class="btn-small">
                            <div class="icon-wrapper">
                                <img class="icon-default" src="../assets/img/icon-delete-default.svg">
                                <img class="icon-hover" src="../assets/img/icon-delete-hover-variant-2.svg">
                                <span>Delete</span>
                            </div>
                        </button>

                        <div class="beam"></div>

                        <button class="btn-small">
                            <div class="icon-wrapper">
                                <img class="icon-default" src="../assets/img/icon-edit-default.svg">
                                <img class="icon-hover" src="../assets/img/icon-edit-hover-variant-2.svg">
                                <span>Edit</span>
                            </div>   
                        </button>
                    </div>
                </div>`;
}

function closeOverview() {
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.add('d-none');
}

/**
 * @function getShortenedDescription - Shorten the Description for the small Task-Cards
 * @param {Object} task - individual Tasks
 */
function getShortenedDescription(task) {
    let maxLength = 30;
    if (task.description_full.length > maxLength) {
        return task.description_full.substring(0, maxLength) + "...";
    } else {
        return task.description_full;
    }
}

function filterAndShowTasks(filterTask) {
    if (filterTask.trim().length > 0) {
        const filteredTasks = allTasks.filter(task =>
            task.title.toLowerCase().includes(filterTask.toLowerCase())
        );
        renderAllTasks(filteredTasks);
    } else {
        renderAllTasks(allTasks);
    }
}
