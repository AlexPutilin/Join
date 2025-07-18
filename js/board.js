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

/**
 * Initializes the task board by setting up the user profile,
 * loading contacts, and converting tasks into an array format.
 */
async function initBoard() {
    initProfile();
    // redirectIfNotLoggedIn();
    await loadContacts();
    await tasksToArray();
}

/**
 * Renders all tasks grouped by their status.
 * Enables drag-and-drop functionality after rendering.
 * @param {*} taskList - The list of tasks to render (defaults to 'allTasks' if not provided).
 */
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

/**
 * Calculates summary information about a task’s subtasks.
 * @param {*} task - The task object containing subtasks.
 * @returns {Object} - An object with the total number of subtasks, the count of completed subtasks, and the calculated progress value.
 */
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

/**
 * Renders task cards for a filtered list of tasks within a given container.
 * For each task, calculates subtask progress if subtasks exist, then appends the task card HTML.
 * @param {*} filteredStatus - Array of tasks filtered by status.
 * @param {*} statusContainer - The DOM element where the task cards will be rendered.
 */
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

/**
 * Enables drag-and-drop functionality for task cards.
 * Adds event listeners to handle drag start and drag end events, updating the UI and internal state accordingly.
 * Also initializes drag reordering and touch-based dragging support.
 */
function enableTaskDragging() {
    const draggables = document.querySelectorAll('.card');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            currentDraggedElement = draggable.id;
            currentSourceContainer = draggable.parentNode;
            draggable.classList.add('dragging');
            document.body.classList.add('drag-active');
        });
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            document.body.classList.remove('drag-active');
        });
    });
    enableDragReordering();
    enableTaskDraggingByTouch(draggables);
}

/**
 * Enables touch-based dragging for a list of draggable elements.
 * Creates a visual clone of the dragged element to follow the touch, handles touch start and end events, and updates the task order after drop.
 * @param {*} draggables - A collection of draggable DOM elements.
 */
function enableTaskDraggingByTouch(draggables) {
    draggables.forEach(draggable => {
        draggable.addEventListener('touchstart', (event) => {
            currentDraggedElement = draggable.id;
            draggable.classList.add('dragging');
            document.body.classList.add('drag-active');
            touchClone = draggable.cloneNode(true);
            touchClone.classList.add('touch-clone');
            const rect = draggable.getBoundingClientRect();
            touchClone.style.width = rect.width + 'px';
            touchClone.style.height = rect.height + 'px';
            touchClone.style.top = rect.top + 'px';
            touchClone.style.left = rect.left + 'px';
            document.body.appendChild(touchClone);
            updateTouchPosition(event.touches[0]);
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

/**
 * Enables touch-based movement for draggable elements.
 * Tracks finger movement and updates the position of the dragged clone.
 * Dynamically inserts a placeholder element in the appropriate drop zone to indicate the potential drop position based on the touch location.
 * @param {*} draggables - A collection of draggable DOM elements.
 */
function moveByTouch(draggables) {
    draggables.forEach(draggable => {
        draggable.addEventListener('touchmove', (event) => {
            event.preventDefault();
            updateTouchPosition(event.touches[0]);
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
        }, { passive: false });
    });
}

/**
 * Updates the position of the touch clone element based on the current touch coordinates.
 * Offsets the clone by 100 pixels to avoid covering the finger.
 * @param {*} touch - The current touch event’s touch point.
 */
function updateTouchPosition(touch) {
    if (!touchClone) {
        return;
    }
    touchClone.style.left = `${touch.clientX + 100}px`;
    touchClone.style.top = `${touch.clientY + 100}px`;
}

/**
 * Enables drag-and-drop reordering within each drag-and-drop container.
 * Listens for 'dragover' events to determine the appropriate position for the draggable element by inserting a placeholder before or after existing tasks.
 * Removes any existing placeholder before adding a new one.
 * Also initializes drop handling based on task status after reordering.
 */
function enableDragReordering() {
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
    enableTaskDropByStatus();
}

/**
 * Handles the drop event for dragging tasks between containers.
 * Moves the dragged task card to the drop position and updates the order of tasks.
 * @param {DragEvent} event - The drop event triggered on the container.
 * @param {HTMLElement} dragAndDropContainer - The container element where the task is dropped.
 * @returns {Promise<void>} - Resolves after updating the order in both source and target containers.
 */
async function handleTaskDrop(event, dragAndDropContainer) {
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
        await updateOrderInContainer(currentSourceContainer, currentSourceContainer.id);
    }
    await updateOrderInContainer(dragAndDropContainer, dragAndDropContainer.id);
}

/**
 * Enables the drop event listeners on all drag-and-drop containers
 * to allow dropping and reordering of task cards.
 */
function enableTaskDropByStatus() {
    dragAndDropContainers.forEach(dragAndDropContainer => {
        dragAndDropContainer.addEventListener('drop', (event) => {
            handleTaskDrop(event, dragAndDropContainer);
        });
    });
}

/**
 * Determines the closest draggable element in a container that is just below the given vertical coordinate.
 * Used to find the element after which a dragged item should be inserted during drag-and-drop.
 * @param {*} container - The container element holding draggable items.
 * @param {*} y - The vertical coordinate (typically mouse or touch Y position).
 * @returns {Element|null} - The element after which the dragged item should be placed, or null if none found.
 */
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

/**
 * Updates the order and status of tasks based on their position within a container.
 * Iterates over all task cards in the container, updates each task’s order and status, persists the changes via an async update call, and then re-renders all tasks.
 * @param {*} container - The DOM container element holding task cards.
 * @param {*} status - The new status to assign to all tasks in this container.
 */
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
    }
    await renderAllTasks();
}

/**
 * Renders a task card for the board with progress details.
 * @param {Object} task - The task data object.
 * @param {number} calcuProgress - Calculated progress percentage of subtasks.
 * @param {number} subtasksLength - Total number of subtasks.
 * @param {number} doneTasksLength - Number of completed subtasks.
 * @param {boolean} showProgress - Whether to show the progress bar.
 * @returns {Promise<string>} - HTML string representing the task card.
 */
async function getTaskCard(task, calcuProgress, subtasksLength, doneTasksLength, showProgress) {
    const subtasksProgress = getSubtasksProgressTemplate(showProgress, calcuProgress, doneTasksLength, subtasksLength);
    return await getTaskCardTemplate(task, subtasksProgress);
}

/**
 * Displays the detailed overview of a task in an overlay.
 * @param {string} id - The ID of the task to show.
 */
async function showOverview(id) {
    const task = allTasks.find(t => t.id.toString() === id.toString());
    activeBoardCard = task;
    overlayRef.classList.remove('d-none');
    overlayRef.innerHTML = await getOverviewTemplate(task);
    initSubtaskCheckboxListeners(task.id);
}

/**
 * @function deleteAndUpdateTasks - Deletes a task by ID, closes overview and refreshes tasks.
 * @param {string} taskID - The ID of the task to delete.
 */
async function deleteAndUpdateTasks(taskID) {
    await deleteData(`/board/tasks/${taskID}`);
    closeOverlay();
    await tasksToArray();
    statuses.forEach(status => {
        const container = document.getElementById(status);
        updateOrderInContainer(container, status);
    });
}

/**
 * Checks if a task has assigned contacts.
 * @param {*} task - The task object to check.
 * @returns {boolean} - True if the task has a non-empty assigned_to string, otherwise false.
 */
function hasAssignedContacts(task) {
    return typeof task.assigned_to === "string" && task.assigned_to.trim() !== "";
}

/**
 * Retrieves the contact objects assigned to a specific task.
 * @param {Object} task - The task object containing assigned contact names.
 * @param {Array} contacts - The list of all available contact objects.
 * @returns {Array} - Array of contact objects assigned to the task.
 */
async function getContactsForTask(task) {
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

/**
 * Retrieves display data (name, initials, color) for all contacts assigned to a task.
 * If a contact is not found in the matching contacts, a default color is used.
 * @param {*} task - The task object containing assigned contact names.
 * @returns {Promise<Array>} - An array of objects each containing the contact's name, initials, and color.
 */
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
                displayData.push({ name: name, initial: getContactInitials(name), color: contact.color });
            } else {
                displayData.push({ name: name, initial: getContactInitials(name), color: "#ccc" });
            }
        }
        return displayData;
    }
}

/**
 * Generates HTML for displaying up to three contact initials for a task, plus an overflow icon indicating how many additional contacts are assigned.
 * @param {*} task - The task object containing assigned contacts.
 * @returns {Promise<string>} - HTML string with initials icons and optional overflow count.
 */
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

/**
 * Builds and returns a string of HTML elements containing initials and names for each contact assigned to the given task.
 * @param {*} task - The task object containing contact/assignment information.
 * @returns {Promise<string>} - HTML string with initials and names of assigned contacts.
 */
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

/**
 * Retrieves and returns the HTML content for the "Assigned To" section of a task.
 * Uses user initials and names to build the content template.
 * @param {*} task - The task object containing assigned user information.
 * @returns {*} - The generated HTML Content
 */
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
        for (const [key, subtask] of Object.entries(task.subtasks)) {
            const checked = subtask.done ? "checked" : "";
            subtasksTemplate += getSubtaskCheckboxTemplate(checked, subtask, task.id, key);
        }
        subtasksTemplate = `<div class="subtasks-wrapper">${subtasksTemplate}</div>`;
    }
    return subtasksTemplate;
}

/**
 * Initializes change event listeners for all subtask checkboxes.
 * When a checkbox state changes, it updates the corresponding subtask status in the backend.
 * @param {*} taskId - The ID of the task (not used inside the function but may be intended for future use).
 */
function initSubtaskCheckboxListeners(taskId) {
    const checkboxes = document.querySelectorAll('.subtask-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', async () => {
            const subtaskKey = checkbox.dataset.subtaskKey;
            const taskId = checkbox.dataset.taskId;
            const done = checkbox.checked;
            await updateSubtaskStatus(taskId, subtaskKey, done);
        });
    });
}

/**
 * Updates the completion status of a specific subtask for a given task.
 * @param {*} taskId - The ID of the task containing the subtask.
 * @param {*} subtaskKey - The key identifying the subtask to update.
 * @param {*} done - Boolean indicating whether the subtask is completed.
 */
async function updateSubtaskStatus(taskId, subtaskKey, done) {
    const updatePayload = {};
    updatePayload[`subtasks/${subtaskKey}/done`] = done;
    await patchData(`/board/tasks/${taskId}`, updatePayload);
    tasksToArray();
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



// ALEX // 

function switchToTaskEditmode() {
    overlayRef.innerHTML = getOverviewEditmodeTemplate(activeBoardCard);
    console.log(activeBoardCard);
    setPriorityValue("#edit-task-form");
    // initAssignedToInteractions();
    // renderAssignedChips();
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