let allTasks = [];
let currentDraggedElement;
let currentSourceContainer;
let touchClone;
let touchCurrentTarget;
const statuses = ['to-do', 'in-progress', 'await-feedback', 'done'];
const dragAndDropContainers = document.querySelectorAll('.drag-drop-container');
const overlayRef = document.getElementById('overlay');

async function initBoard() {
    await tasksToArray();
    initProfile();
    await loadContacts();
}

async function renderAllTasks(taskList = allTasks) {
    for (const status of statuses) {
        await renderTasksByStatus(status, taskList);
    }
    enableTaskDragging();
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
            ...task
        });
    }
    await renderAllTasks();
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
async function renderTasksByStatus(status, taskList) {
    let statusContainer = document.getElementById(status);
    statusContainer.innerHTML = "";
    let filteredStatus = taskList.filter(task => task.status === status).sort((a, b) => (a.order || 0) - (b.order || 0));
    if (filteredStatus.length === 0) {
        return updateNoTasksDisplay(status, statusContainer);
    }
    await renderFilteredTaskStatus(filteredStatus, statusContainer);

}


async function renderFilteredTaskStatus(filteredStatus, statusContainer) {
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
        statusContainer.innerHTML += await getTaskCard(task, calcuProgress, subtasksLength, doneTasksLength, showProgress);
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
        console.log("no subtasks available", task.id);
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
    switch (category) {
        case "User Story":
            return "user-story";
        case "Technical Task":
            return "technical-task";
        default:
            return "default-category";
    }
}


function enableTaskDragging() {
    const draggables = document.querySelectorAll('.card');
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
    enableDragReordering();
    enableTaskDraggingByTouch(draggables);
}

let placeholder = document.createElement('div');
placeholder.classList.add('drop-placeholder');

function enableTaskDraggingByTouch(draggables) {
    draggables.forEach(draggable => {
        draggable.addEventListener('touchstart', (e) => {
            currentDraggedElement = draggable.id;
            draggable.classList.add('dragging');
            document.body.classList.add('drag-active');
            touchClone = draggable.cloneNode(true);

            touchClone.classList.add('touch-clone');
            document.body.appendChild(touchClone);


            updateTouchPosition(e.touches[0]);
        });
        draggable.addEventListener('touchend', async () => {
            if (touchClone) touchClone.remove();
            document.body.classList.remove('drag-active');
            draggable.classList.remove('dragging');

            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.insertBefore(draggable, placeholder);
                placeholder.remove();
                await updateOrderInContainer(draggable.parentNode, draggable.parentNode.id);
            }
            touchCurrentTarget = null;
        });
        moveByTouch(draggables);
    });
}


function moveByTouch(draggables) {
    draggables.forEach(draggable => {
        draggable.addEventListener('touchmove', (e) => {
            e.preventDefault();
            updateTouchPosition(e.touches[0]);
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = target?.closest('.drag-drop-container');
            // const nearestTask = target?.closest('.task');

            if (dropZone) {
                touchCurrentTarget = dropZone;
                const allTasks = Array.from(dropZone.querySelectorAll('.task')).filter(element => element !== draggable && element !== placeholder);
                let inserted = false;
                for (const task of allTasks) {
                    const taskBox = task.getBoundingClientRect();
                    const middleY = taskBox.top + taskBox.height / 2;
                    if (touch.clientY < middleY) {
                        task.parentNode.insertBefore(placeholder, task);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) {
                    dropZone.appendChild(placeholder);
                }
            }
        }, { passive: false });
    });
}

function updateTouchPosition(touch) {
    if (!touchClone) {
        return;
    }
    touchClone.style.left = `${touch.clientX + 10}px`;
    touchClone.style.top = `${touch.clientY + 10}px`;
}


function enableDragReordering() {
    dragAndDropContainers.forEach(dragAndDropContainer => {
        dragAndDropContainer.addEventListener('dragover', event => {
            console.log("dragover on", dragAndDropContainer.id);
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
    enableTaskDropByStatus();
}


function enableTaskDropByStatus() {
    dragAndDropContainers.forEach(dragAndDropContainer => {
        dragAndDropContainer.addEventListener('drop', event => {
            event.preventDefault();
            const draggedCard = document.getElementById(currentDraggedElement);
            let placeholder = dragAndDropContainer.querySelector('.drop-placeholder');

            if (draggedCard) {
                if (placeholder) {
                    dragAndDropContainer.insertBefore(draggedCard, placeholder);
                    placeholder.remove();
                } else {
                    dragAndDropContainer.appendChild(draggedCard);
                }
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
        // console.log(`offset for ${child.id}:`, offset);
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
        await updateData(`/board/tasks/${task.id}`, task);
        console.log(`Task ${task.id}: oldOrder=${task.order}, newOrder=${index}, oldStatus=${task.status}, newStatus=${status}`);
    }
    renderAllTasks();
}


/**
 * @function getTaskCard - Render the little Task-Card in Board
 * @param {Object} task - individual Tasks
 */
async function getTaskCard(task, calcuProgress, subtasksLength, doneTasksLength, showProgress) {
    // console.log(task);
    // const title_short = getShortenedTitle(task);
    // const description_short = getShortenedDescription(task);
    const shortDescription = getShortenedField(task, "description_full", 30);
    const shortTitle = getShortenedField(task, "title", 30);
    const subtasksProgress = getSubtasksProgressTemplate(showProgress, calcuProgress, doneTasksLength, subtasksLength);
    return await getTaskCardTemplate(task, shortTitle, shortDescription, subtasksProgress);
}


/**
 * @function showOverview -
 * @param {string} id - 
 */
async function showOverview(id) {
    const task = allTasks.find(t => t.id.toString() === id.toString());
    console.log(id);
    overlayRef.classList.remove('d-none');
    overlayRef.innerHTML = await getOverviewTemplate(task);
}


/**
 * @function deleteAndUpdateTasks - Deletes a task by ID, closes overview and refreshes tasks.
 * @param {string} taskID - The ID of the task to delete.
 */
async function deleteAndUpdateTasks(taskID) {
    console.log('delete the task with id:', taskID);
    await deleteData(`/board/tasks/${taskID}`);
    closeOverlay();
    await tasksToArray();
    statuses.forEach(status => {
        const container = document.getElementById(status);
        updateOrderInContainer(container, status);
    });
}

function hasAssignedContacts(task) {
    return task.assigned_to && task.assigned_to.trim() !== "";
}

/**
 * 
 * @param {Object} task - 
 * @param {Array} contacts - 
 * @returns {Array} 
 */
async function getContactsForTask(task) {
    const contacts = await loadContacts();
    // console.log("Contacts-Array:", contacts);
    if (!hasAssignedContacts(task)) {
        return [];
    }
    const assignedNames = task.assigned_to.split(",").map(name => name.trim().toLowerCase());
    return contacts.filter(contact => {
        const contactName = contact.name.trim().toLowerCase();
        return assignedNames.includes(contactName);
    });
}
async function getContactDisplayData(task) {
    if (!hasAssignedContacts(task)) {
        return [];
    }
    const names = task.assigned_to.split(",").map(name => name.trim());
    const matchingContacts = await getContactsForTask(task);
    return names.map(name => {
        const contact = matchingContacts.find(c => c.name.trim().toLowerCase() === name.trim().toLowerCase());
        return { name: name, initial: getContactInitials(name), color: contact ? contact.color : "#ccc" };
    });
}

async function getInitialsOnly(task) {
    const displayData = await getContactDisplayData(task);
    const maxIcons = 3;
    const visibleData = displayData.slice(0, maxIcons);
    const initialsIcon = visibleData.map(d => `<div class="contact-icon initial-icon" style="background-color: ${d.color};">${d.initial}</div>`).join("");
    const remainingCount = displayData.length - maxIcons;
    const overflowIcon = remainingCount > 0 ? `<div class="more-icon font-color-grey">+${remainingCount}</div>` : "";
    return initialsIcon + overflowIcon;
}

async function getInitialsWithNames(task) {
    const displayData = await getContactDisplayData(task);

    return displayData.map(d => `
        <div class="names-wrapper">
            <div class="contact-icon" style="background-color: ${d.color};">${d.initial}</div>
            <span class="contact-name contact-name-board">${d.name}</span>
        </div>
    `).join("");
}


async function getAssignedToContent(task) {
    const initialsWithName = await getInitialsWithNames(task);
    return initialsWithName ? `<div>
                                            <span class="font-color-grey">Assigned To:</span>
                                              <div class="initials-container">
                                                 <div class="initials-wrapper">${initialsWithName} </div>
                                              </div>
                                        </div>` : '';
}



/**
 * @function getSubtasksContent - Returns HTML-Template for subtasks section or empty string.
 * @param {Object} task - individually Task 
 * @returns {string} - Returns Subtasks Container
 */
function getSubtasksContent(task) {
    return getSubtasksTemplate(task) ? `<div><span class="font-color-grey">Subtasks:</span>${getSubtasksTemplate(task)}</div>` : '';
}

/**
 * @function getSubtasksTemplate - Returns HTML-Template for subtasks and checkboxes or empty string.
 * @param {Object} task - Individual Task
 * @returns {string} - Subtasks and Checkboxes
 */
function getSubtasksTemplate(task) {
    if (task.subtasks && Object.keys(task.subtasks).length > 0) {
        const subtasksArray = Object.values(task.subtasks);
        let subtasksTemplate = "";
        for (const subtask of subtasksArray) {
            const checked = subtask.done ? "checked" : "";

            subtasksTemplate += `
                <div class="subtask-item">
                    <label class="checkbox">
                        <input type="checkbox" hidden ${checked} data-subtask-title="${subtask.title}">
                        <div class="icon-wrapper icon-checkbox-default">
                            <img class="icon-default" src="../assets/img/icon-checkbutton-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-checkbutton-hover.svg">
                        </div>
                        <div class="icon-wrapper icon-checkbox-checked">
                            <img class="icon-default" src="../assets/img/icon-checkbutton-checked-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-checkbutton-checked-hover.svg">
                        </div>
                    </label>
                    <span>${subtask.title}</span>
                </div>`;
        }
        return `<div class="subtasks-wrapper">${subtasksTemplate}</div>`;
    } else {
        return "";
    }
}
// async function editTask(task) {
// const assignedToContent = await getAssignedToContent(task);
//     return `    <div onclick="eventBubblingProtection(event)" class="card-overview">
//                     <div class="card-overview-header">
//                         <span class="label ${getBgCategory(task.category)}">${task.category}</span>
//                         <button onclick="closeOverlay()" class="btn-small">
//                             <img class="icon-default" src="../assets/img/icon-close-default.svg">
//                             <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
//                         </button>
//                     </div>
//                     ${getAddTaskTitleTemplate()}
//                     <h2 class="task-title">${task.title}</h2>
//                     <span class="task-description">${task.description_full}</span>

//                     <div class="">
//                         <span style="padding-right: 16px;" class="font-color-grey">Due Date:</span>
//                         <span> ${task.due_date}</span>
//                     </div>

//                     <div class="priority-wrapper ">
//                         <span style="padding-right: 36px;" class="font-color-grey">Priority:</span>
//                         <span style="text-transform: capitalize;"> ${task.priority} </span>
//                         ${getPriority(task)}
//                     </div>


//                             ${assignedToContent}
//                             ${getSubtasksContent(task)}
//                     <div class="delete-and-edit-wrapper">
//                    <button id="" class="btn-dark" onclick="">
//                                 <span>OK</span>
//                                 <img class="icon-default" src="../assets/img/icon-check-huge-default.svg" alt="">
//                             </button>

//                     </div>
//                 </div>`;

// }


/**
 * @function getShortenedDescription - Shorten the Description for the small Task-Cards
 * @param {Object} task - individual Tasks
 */
function getShortenedField(task, fieldName, maxLength = 30) {
    const value = task[fieldName];
    if (value.length > maxLength) {
        return value.substring(0, maxLength) + "...";
    } else {
        return value;
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