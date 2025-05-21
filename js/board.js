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
    initDragEvents();
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
            order: task.order || 0,
            ...task
        });
    }
    currentTasks = allTasks;
    renderAllTasks();
}


function updateSubtasks(task) {
    let subtasks = Object.values(task.subtasks || {});
    let subtasksLength = subtasks.length;
    let doneTasksLength = subtasks.filter(s => s.done).length;
    let calcuProgress = calcuProgressbar(task);
    return { subtasksLength, doneTasksLength, calcuProgress };
}


/**
 * @function renderTasksByStatus - Filters the Tasks by Status and renders them in the respective Container
 * @param {string} status - Status of the Tasks
 * @param {string} status - corresponds to the ID
 */
function renderTasksByStatus(status, taskList) {
    let statusContainer = document.getElementById(status);
    statusContainer.innerHTML = "";
    let filteredStatus = taskList.filter(task => task.status === status).sort((a, b) => (a.order || 0) - (b.order || 0));
    if (filteredStatus.length === 0) {
        return updateNoTasksDisplay(status, statusContainer);
    }
    for (let i = 0; i < filteredStatus.length; i++) {
        const task = filteredStatus[i];
        let subtasksLength = 0;
        let doneTasksLength = 0;
        let calcuProgress = 0;
        let showProgress = false;
        if (task.subtasks && Object.keys(task.subtasks).length > 0) {
            ({ subtasksLength, doneTasksLength, calcuProgress } = updateSubtasks(task));
            showProgress = true;
        }
        statusContainer.innerHTML += getTaskCard(task, calcuProgress, subtasksLength, doneTasksLength, showProgress);
    }

}



function updateNoTasksDisplay(status, statusContainer) {
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
    statusContainer.innerHTML = `<div class="placeholder-box-no-task"><p class="no-tasks-text">${message}</p></div>`;
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

function initDragEvents() {
    const draggables = document.querySelectorAll('.card');
    const dragAndDropContainers = document.querySelectorAll('.drag-drop-container');
    enableTaskDragging(draggables);
    enableDragReordering(dragAndDropContainers);
    enableTaskDropByStatus(dragAndDropContainers);
}


function enableTaskDragging(draggables) {
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            currentDraggedElement = draggable.id;
            draggable.classList.add('dragging');
            document.body.classList.add('drag-active');
            console.log("Dragging Task ID:", currentDraggedElement);
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            document.body.classList.remove('drag-active');
        });
    });
}

function enableDragReordering(dragAndDropContainers) {
    const placeholder = document.createElement('div');
    placeholder.classList.add('drop-placeholder');
    dragAndDropContainers.forEach(dragAndDropContainer => {
        dragAndDropContainer.addEventListener('dragover', event => {
            event.preventDefault();
            const afterElement = getDragAfterElement(dragAndDropContainer, event.clientY);
            const draggable = document.querySelector('.dragging');
            const existingPlaceholder = dragAndDropContainer.querySelector('.drop-placeholder');
            if (existingPlaceholder) {
                existingPlaceholder.remove();
            }
            if (draggable) {
                if (afterElement == null) {
                    dragAndDropContainer.appendChild(placeholder);
                } else {
                    dragAndDropContainer.insertBefore(placeholder, afterElement);
                }
            } else {
                console.warn("No element with class '.dragging' found!");
            }
        });
    });
}

function enableTaskDropByStatus(dragAndDropContainers) {
    dragAndDropContainers.forEach(dragAndDropContainer => {
        dragAndDropContainer.addEventListener('drop', event => {
            event.preventDefault();
            console.log('dropped in:', dragAndDropContainer.id);
            console.log('current dragged:', currentDraggedElement);

            const draggedCard = document.getElementById(currentDraggedElement);
            const placeholder = dragAndDropContainer.querySelector('.drop-placeholder');
            if (draggedCard) {
                if (placeholder) {
                    dragAndDropContainer.insertBefore(draggedCard, placeholder);
                    placeholder.remove();
                } else {
                    dragAndDropContainer.appendChild(draggedCard);
                }
            }
            updateOrderInContainer(dragAndDropContainer, dragAndDropContainer.id);
        });
    });

}


function getDragAfterElement(dragAndDropContainer, y) {
    const draggableElements = [...dragAndDropContainer.querySelectorAll('.card:not(.dragging):not(.drop-placeholder)')];

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




function updateOrderInContainer(container, status) {
    const cardElements = Array.from(container.querySelectorAll('.card'));
    cardElements.forEach((card, index) => {
        const task = allTasks.find(t => t.id === card.id);
        if (!task) {
            return;
        }
        let changeStatusOrOrder = false;
        if (task.status !== status) {
            task.status = status;
            changeStatusOrOrder = true;
        }
        if (task.order !== index) {
            task.order = index;
            changeStatusOrOrder = true;
        }
        if (changeStatusOrOrder) {
            updateTaskInFirebase(task.id, task);
        }
    });
        renderAllTasks();
}

/**
 * @function getTaskCard - Render the little Task-Card in Board
 * @param {Object} task - individual Tasks
 */
function getTaskCard(task, calcuProgress, subtasksLength, doneTasksLength, showProgress) {
    console.log(task);
    const bgCategory = getBgCategory(task.category);
    let description_short = getShortenedDescription(task);
    let subtasksProgress = getSubtasksProgressTemplate(showProgress, calcuProgress, doneTasksLength, subtasksLength);

    return getTaskCardTemplate(task, bgCategory, description_short, subtasksProgress);
}

function getSubtasksProgressTemplate(showProgress, calcuProgress, doneTasksLength, subtasksLength) {
    return showProgress ? `
        <div class="task-progress-container">
            <div class="task-progressbar">
                <div class="task-progrssbar-content" style="width: ${calcuProgress}%;"></div>
            </div>
            <span class="task-progressbar-quotient">${doneTasksLength}/${subtasksLength} subtasks</span>
        </div>` : '';
}

function getTaskCardTemplate(task, bgCategory, description_short, subtasksProgress) {
    return `<div draggable="true" onclick="showOverview('${task.id}')" id="${task.id}" class="card">
                <span class="label ${bgCategory}">${task.category}</span>
                <h3 class="task-title">${task.title}</h3>
                <span class="task-description-short">${description_short}</span>
                ${subtasksProgress}
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
                        <span style="padding-right: 16px;" class="font-color-grey">Due Date:</span>
                        <span> ${task.due_date}</span>
                    </div>
                    <br>
                    <div class="priority-wrapper ">
                        <span style="padding-right: 36px;" class="font-color-grey">Priority:</span>
                        <span > ${task.priority} </span>
                        ${getPriority(task)}
                    </div>



                    <br>
                    <div>
                        <span class="font-color-grey">Assigned To:</span>
                        <p>
                        
                        </p>
                    </div>
                    <div>
                        <span class="font-color-grey">Subtasks:</span>
                            ${getSubtasks(task)}
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

function getSubtasks(task) {
    if (task.subtasks && Object.keys(task.subtasks).length > 0) {
        const subtasksArray = Object.values(task.subtasks);
        let subtaksTemplate = "";
        for (const subtask of subtasksArray) {
            const checked = subtask.done ? 'checked' : "";
            subtaksTemplate += `<div class="subtask-item">
                    <input type="checkbox" disabled ${checked}>
                    <label>${subtask.title}</label>
                </div>`;
        }
        return subtaksTemplate;
    } else {
        return "";
    }
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
    let maxLength = 20;
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
