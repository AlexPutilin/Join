let allTasks = [];
let currentDraggedElement;
let currentSourceContainer;
let touchClone;
let touchCurrentTarget;
let activeBoardCard;
const statuses = ['to-do', 'in-progress', 'await-feedback', 'done'];
const dragAndDropContainers = document.querySelectorAll('.drag-drop-container');
const overlayRef = document.getElementById('overlay');
let placeholder = document.createElement('div');
placeholder.classList.add('drop-placeholder');


async function initBoard() {
    initProfile();
    // redirectIfNotLoggedIn();
    await loadContacts();
    await tasksToArray();
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
    let doneTasksLength = subtasks.filter(subtask => subtask.done).length;
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
    statusContainer.innerHTML = noTasksContainer(message);
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
        draggable.addEventListener('touchmove', (event) => {
            event.preventDefault();
            updateTouchPosition(e.touches[0]);
            const touch = event.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = target?.closest('.drag-drop-container');
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
        }, { passive: true });
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
            if (currentSourceContainer && currentSourceContainer !== dragAndDropContainer) {
                updateOrderInContainer(currentSourceContainer, currentSourceContainer.id);
            }
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
    await renderAllTasks();
}


/**
 * @function getTaskCard - Render the little Task-Card in Board
 * @param {Object} task - individual Tasks
 */
async function getTaskCard(task, calcuProgress, subtasksLength, doneTasksLength, showProgress) {
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
    activeBoardCard = task;
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
    // console.log(allTasks);
    // allTasks.forEach((task, index) => {
    //     console.log(`Task ${index}:`, task.assigned_to);
    // });
    // const assignedToList = allTasks.map(task => task.assigned_to);
    // console.log(assignedToList);
    return typeof task.assigned_to === "string" && task.assigned_to.trim() !== "";
}


/**
 * 
 * @param {Object} task - 
 * @param {Array} contacts - 
 * @returns {Array} 
 */
async function getContactsForTask(task) {
    // console.log("Contacts-Array:", contacts);
    if (!hasAssignedContacts(task)) {
        return [];
    } else {
        const assignedNames = task.assigned_to.split(",").map(name => name.trim().toLowerCase());
        const filteredContacts = [];
        for (const contact of contacts) {
            const contactName = contact.name.trim().toLowerCase();
            if (assignedNames.includes(contactName)) {
                filteredContacts.push(contact);
            }
        }
        return filteredContacts;
    }
}


async function getContactDisplayData(task) {
    if (!hasAssignedContacts(task)) {
        return [];
    } else {
        const names = task.assigned_to.split(",").map(name => name.trim());
        const matchingContacts = await getContactsForTask(task);
        const displayData = [];
        for (const name of names) {
            const contact = matchingContacts.find(contact => contact.name.trim().toLowerCase() === name.trim().toLowerCase());
            if (contact) {
                displayData.push(
                    { name: name, initial: getContactInitials(name), color: contact.color });
            } else {
                displayData.push({ name: name, initial: getContactInitials(name), color: "#ccc" });
            }
        }
        return displayData;
    }
}


async function getInitialsOnly(task) {
    const displayData = await getContactDisplayData(task);
    const visibleData = displayData.slice(0, 3);
    const remainingCount = displayData.length - 3;
    let initialsIcon = "";
    let overflowNumberIcon = "";
    for (const contact of visibleData) {
        initialsIcon += getInitialIcons(contact);
    }
    if (remainingCount > 0) {
        overflowNumberIcon = getOverflowNumberIcon(remainingCount);
    } else {
        overflowNumberIcon = "";
    }
    return initialsIcon + overflowNumberIcon;
}


async function getInitialsWithNames(task) {
    const displayData = await getContactDisplayData(task);
    let resultIconWithName = "";
    for (let i = 0; i < displayData.length; i++) {
        const contact = displayData[i];
        if (contact) {
            resultIconWithName += getInitialsWithNamesTemplate(contact);
        }
    }
    return resultIconWithName;
}



async function getAssignedToContent(task) {
    const initialsWithName = await getInitialsWithNames(task);
    if (initialsWithName) {
        return getAssignedToContentTemplate(initialsWithName);
    }

}


/**
 * @function getSubtasksTemplate - Returns HTML-Template for subtasks and checkboxes or empty string.
 * @param {Object} task - Individual Task
 * @returns {string} - Subtasks and Checkboxes
 */
function getSubtasksTemplate(task) {
    let subtasksTemplate = "";
    if (task.subtasks && Object.keys(task.subtasks).length > 0) {
        const subtasksArray = Object.values(task.subtasks);
        for (const subtask of subtasksArray) {
            let subtaskTemplateBoardPage = "";
            if (subtask.done) {
                subtaskTemplateBoardPage = getSubtaskCheckboxTemplate("checked", subtask);
            } else {
                subtaskTemplateBoardPage = getSubtaskCheckboxTemplate("", subtask);
            }
            subtasksTemplate += subtaskTemplateBoardPage;
        }
        subtasksTemplate = `<div class="subtasks-wrapper">${subtasksTemplate}</div>`;
    } else {
        subtasksTemplate = "";
    }
    return subtasksTemplate;
}


function getSubtaskCheckboxTemplate(checked, subtask) {
    return `<div class="subtask-item">
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
async function filterAndShowTasks(filterTask) {
    if (filterTask.trim().length > 0) {
        const filteredTasks = allTasks.filter(task => task.title.toLowerCase().includes(filterTask.toLowerCase()));
        await renderAllTasks(filteredTasks);
    } else {
        await renderAllTasks(allTasks);
    }
}



function switchToTaskEditmode() {
    overlayRef.innerHTML = getOverviewEditmodeTemplate(activeBoardCard);
    console.log(activeBoardCard);
    setPriorityValue("#edit-task-form");
}


function setPriorityValue(form) {
    const inputs = document.querySelectorAll(`${form} input[name="priority"]`);
    const priority = activeBoardCard.priority;
    inputs.forEach(input => {
        if(input.value === priority) {
            input.checked = true;
        }
    });
}


//
function renderContacts2() {
    const dropdown = document.getElementById('contacts-dropdown');
    if (!dropdown) return;
    dropdown.innerHTML = '';
    contacts.forEach(contact => {
        dropdown.innerHTML += getContactOptionTemplate(contact);
    });
}




function renderAssignedChips() {
  const container = document.getElementById('assigned-chips-container');
  container.innerHTML = '';
  document.querySelectorAll('#contacts-dropdown .select-contact input[type="checkbox"]:checked')
    .forEach(checkbox => {
      const id = checkbox.dataset.contactId;
      const info = contactsById[id];
      if (!info) return;
      const chip = createContactChip(getContactInitials(info.name), info.color);
      container.appendChild(chip);
    });
}

