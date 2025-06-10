let allTasks = [];
let currentTasks = [];
let currentDraggedElement;
const statuses = ['to-do', 'in-progress', 'await-feedback', 'done'];
let currentSourceContainer;
let touchClone;
let touchCurrentTarget;

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
            order: task.order ?? 0,
            //   order: task.order || 0,
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


/**
 * @function updateNoTasksDisplay - Shows a “no tasks” message in the status column when it's empty
 * @param {string} status - Reflects the Status
 * @param {string} statusContainer - Displays the respective Container
 */
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
 * @param {string} category - possible category of tasks
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


/**
 * @function updateTaskInFirebase - Synchronizes task changes with Firebase.
 * @param {string} taskId - Individual ID of the respective Task
 * @param {Object} updatedTask - The changed Task
 */
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


async function moveTo(status) {
    console.log("Dropping task into:", status);
    let taskIndex = allTasks.findIndex(t => t.id === currentDraggedElement);
    if (taskIndex === -1) {
        console.error("Task not found:", currentDraggedElement);
        return;
    }
    let task = allTasks[taskIndex];
    task.status = status;
    await updateTaskInFirebase(task.id, task);
    allTasks[taskIndex] = task;
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
        const placeholder = document.createElement('div');
        draggable.addEventListener('dragstart', () => {
            currentDraggedElement = draggable.id;
            currentSourceContainer = draggable.parentNode;
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


// function enableTaskDraggingByTouch(draggables) {
//     draggables.forEach(draggable => {
//         draggable.addEventListener('touchstart', (e) => {
//             currentDraggedElement = draggable.id;
//             draggable.classList.add('dragging');
//             document.body.classList.add('drag-active');
//             touchClone = draggable.cloneNode(true);
//             touchClone.style.position = 'absolute';
//             touchClone.style.pointerEvents = 'none';
//             touchClone.style.opacity = '0.7';
//             touchClone.style.zIndex = '1000';
//             document.body.appendChild(touchClone);
//             updateTouchPosition(e.touches[0]);
//         });
//         draggable.addEventListener('touchend', async () => {
//             if (touchClone) touchClone.remove();
//             document.body.classList.remove('drag-active');
//             draggable.classList.remove('dragging');

//             if (placeholder && placeholder.parentNode) {
//                 placeholder.parentNode.insertBefore(draggable, placeholder);
//                 placeholder.remove();

//                 await updateOrderInContainer(draggable.parentNode, draggable.parentNode.id);
//             }

//             touchCurrentTarget = null;
//         });
//                 draggable.addEventListener('touchmove', (e) => {
//             // e.preventDefault();
//             updateTouchPosition(e.touches[0]);

//             const touch = e.touches[0];
//             const target = document.elementFromPoint(touch.clientX, touch.clientY);

//             const dropZone = target?.closest('.drag-drop-container');
//             const nearestTask = target?.closest('.task');

//             if (dropZone) {
//                 touchCurrentTarget = dropZone;


//                 const allTasks = Array.from(dropZone.querySelectorAll('.task')).filter(element => element !== draggable && element !== placeholder);

//                 let inserted = false;
//                 for (const task of allTasks) {
//                     const taskRect = task.getBoundingClientRect();
//                     const middleY = taskRect.top + taskRect.height / 2;

//                     if (touch.clientY < middleY) {
//                         task.parentNode.insertBefore(placeholder, task);
//                         inserted = true;
//                         break;
//                     }
//                 }

//                 if (!inserted) {
//                     dropZone.appendChild(placeholder);
//                 }
//             } 
//         }, { passive: true });
//     });

// }


// function updateTouchPosition(touch) {
//     if (!touchClone) {
//         return;
//     }
//     touchClone.style.left = `${touch.clientX + 1}px`;
//     touchClone.style.top = `${touch.clientY + 1}px`;
// }


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
            }
        });
    });
}


function enableTaskDropByStatus(dragAndDropContainers) {
    dragAndDropContainers.forEach(dragAndDropContainer => {
        dragAndDropContainer.addEventListener('drop', event => {
            event.preventDefault();
            const draggedCard = document.getElementById(currentDraggedElement);
            const placeholder = dragAndDropContainer.querySelector('.drop-placeholder');
            if (placeholder) {
                dragAndDropContainer.insertBefore(draggedCard, placeholder);
                placeholder.remove();
            } else {
                dragAndDropContainer.appendChild(draggedCard);
            }
            // aktualisiert den verlassenen container
            if (currentSourceContainer && currentSourceContainer !== dragAndDropContainer) {
                updateOrderInContainer(currentSourceContainer, currentSourceContainer.id);
            }
            // aktualisiert den ziel container
            updateOrderInContainer(dragAndDropContainer, dragAndDropContainer.id);
        });

    });
}


function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging):not(.drop-placeholder)')];
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
    for (const child of draggableElements) {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            closest = { offset, element: child };
        }
    }
    return closest.element;
}


async function updateOrderInContainer(container, status) {
    const cardElements = Array.from(container.querySelectorAll('.card'));
    for (let index = 0; index < cardElements.length; index++) {
        const cardId = cardElements[index].id;
        const taskIndex = allTasks.findIndex(task => task.id === cardId);
        let task = allTasks[taskIndex];
        task.order = index;
        task.status = status;
        allTasks[taskIndex] = task;
        await updateTaskInFirebase(task.id, task)
        // console.log(`Task ${task.id}: oldOrder=${task.order}, newOrder=${index}, oldStatus=${task.status}, newStatus=${status}`);
        renderAllTasks();
    }
}


/**
 * @function getTaskCard - Render the little Task-Card in Board
 * @param {Object} task - individual Tasks
 */
function getTaskCard(task, calcuProgress, subtasksLength, doneTasksLength, showProgress) {
    // console.log(task);
    const bgCategory = getBgCategory(task.category);
    const description_short = getShortenedDescription(task);
    const subtasksProgress = getSubtasksProgressTemplate(showProgress, calcuProgress, doneTasksLength, subtasksLength);
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
                <h4 class="task-title">${task.title}</h4>
                <span>Order: ${task.order}</span> <br>
                <span class="task-description-short">${description_short}</span>
                ${subtasksProgress}
                <div class="profiles-priority-container">
                    <div style="border: 2px solid black; border-radius: 100%; width: 32px; height: 32px;"></div>
                    <div>${getPriority(task)}</div>
                </div>
            </div>`;
}

/**
 * @function getPriority - Returns a priority icon based on the given priority level.
 * @param {Object} task - individual Tasks
 * @returns - individual Priority depending on the Task
 */
function getPriority(task) {
    if (task.priority === "urgent") {
        return `<img src="../assets/img/icon-prio-urgent.svg" alt="icon-urgent">`;
    } else if (task.priority === "medium") {
        return `<img src="../assets/img/icon-prio-medium.svg" alt="icon-medium">`;
    } else if (task.priority === "low") {
        return `<img src="../assets/img/icon-prio-low.svg" alt="icon-low">`;
    } else {
        return "";
    }
}


/**
 * @function showOverview -
 * @param {string} id - 
 */
function showOverview(id) {
    const task = allTasks.find(t => t.id.toString() === id.toString());
    console.log(id);
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.remove('d-none');
    overlayRef.innerHTML = getOverviewTemplate(task);
}


/**
 * @function getOverviewTemplate - Returns the HTML template for the task detail view.
 * @param {Object} task - The individual task object.
 * @returns {string} - HTML-Template representing the task detail view.
 */
function getOverviewTemplate(task) {
    const bgCategory = getBgCategory(task.category);
    return `    <div onclick="eventBubblingProtection(event)" class="card-overview">
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
                        <span style="text-transform: capitalize;"> ${task.priority} </span>
                        ${getPriority(task)}
                    </div>



                    <br>
                    <div>
                        <span class="font-color-grey">Assigned To:</span>
                        <p>
                        
                        </p>
                    </div>
                            ${getSubtasksContent(task)}
                    <div class="delete-and-edit-wrapper">
                        <button onclick="deleteAndUpdateTasks('${task.id}')" class="btn-small">
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


/**
 * @function deleteAndUpdateTasks - Deletes a task by ID, closes overview and refreshes tasks.
 * @param {string} taskID - The ID of the task to delete.
 */
async function deleteAndUpdateTasks(taskID) {
    console.log('delete the task with id:', taskID);
    await deleteData(`/board/tasks/${taskID}`);
    closeOverview();
    await tasksToArray();
    statuses.forEach(status => {
        const container = document.getElementById(status);
        updateOrderInContainer(container, status);
    });
}


/**
 * @function getSubtasksContent - Returns HTML-Template for subtasks section or empty string.
 * @param {Object} task - individually Task 
 * @returns {string} - Returns Subtasks Container
 */
function getSubtasksContent(task) {
    let template = getSubtasksTemplate(task);
    if (template) {
        return `<div>
                    <span class="font-color-grey">Subtasks:</span>
                    ${template}
                </div>`;
    } else {
        return "";
    }
}


/**
 * @function getSubtasksTemplate -  Returns HTML-Template for subtasks and checkboxes or empty string.
 * @param {Object} task - individually Task 
 * @returns {string} - Returns Subtasks and Checkboxes
 */
function getSubtasksTemplate(task) {
    if (task.subtasks && Object.keys(task.subtasks).length > 0) {
        const subtasksArray = Object.values(task.subtasks);
        let subtasksTemplate = "";
        for (const subtask of subtasksArray) {
            const checked = subtask.done ? 'checked' : "";
            subtasksTemplate += `<div class="subtask-item">
                    <input type="checkbox" disabled ${checked}>
                    <label>${subtask.title}</label>
                </div>`;
        }
        return subtasksTemplate;
    } else {
        return "";
    }
}


/**
 * @function closeOverview - Closes the task detail view.
 */
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


/**
 * @function filterAndShowTasks - Filters tasks by title and displays matching results. If the search input is empty, all tasks are displayed.
 * @param {string} filterTask - The search string used to filter tasks by their title.
 */
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


/**
 * @function eventBubblingProtection - Stops the propagation of the event to parent elements.
 * @param {Event} event - The event object to stop from bubbling.
 */
function eventBubblingProtection(event) {
    event.stopPropagation();
}