let allTasks = [];
let activeTask;
const statuses = ['to-do', 'in-progress', 'await-feedback', 'done'];
const overlayRef = document.getElementById('overlay');

/**
 * Initializes the task board by setting up the user profile,
 * loading contacts and converting tasks into an array format.
 */
async function initBoard() {
    initProfile();
    redirectIfNotLoggedIn();
    await loadContacts();
    await tasksToArray();
}

/**
 * Renders all tasks grouped by their status.
 * Enables drag-and-drop functionality after rendering.
 * @param {Array} taskList - The list of tasks to render (defaults to 'allTasks' if not provided).
 */
async function renderAllTasks(taskList = allTasks) {
    selectPlaceholder.forEach(placeholder => placeholder.remove());
    for (const status of statuses) {
        await renderTasksByStatus(status, taskList);
    }
    enableTaskDragging();
}

/**
 * Convert all loaded tasks into an Array and push in Array allTasks
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
 * @param {Object} task - The task object containing subtasks.
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
 * Filters the Tasks by Status and renders them in the respective Container
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
 * @param {Array} filteredStatus - Array of tasks filtered by status.
 * @param {HTMLElement} statusContainer - The DOM element where the task cards will be rendered.
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
 * Shows a “no tasks” message in the status column when it's empty
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
    } else {
        return message;
    }
    statusContainer.innerHTML = noTasksContainer(message);
}

/**
 * Enables progress for the progress bar
 * @param {Object} task - the task object
 * @returns progress - shows the calculated progress
 */
function calcuProgressbar(task) {
    const subtasksValue = Object.values(task.subtasks);
    const totalSubtaks = subtasksValue.length;
    const doneTasks = subtasksValue.filter(subtask => subtask.done).length;
    if (totalSubtaks === 0) {
        return 0;
    }
    const progress = (doneTasks / totalSubtaks) * 100;
    return progress;
}

/**
 * Determines the background color of the respective category
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
    const task = allTasks.find(task => task.id.toString() === id.toString());
    activeTask = task;
    overlayRef.classList.remove('d-none');
    overlayRef.innerHTML = await getOverviewTemplate(task);
    initSubtaskCheckboxListeners(task.id);
}

/**
 * Deletes a task by ID, closes overview and refreshes tasks.
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

/**
 * Checks if a task has assigned contacts.
 * @param {Object} task - the task object to check.
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
 * @param {Object} task - The task object containing assigned contact names.
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
                displayData.push({ name: name, initial: getContactInitials(name), color: "#191830" });
            }
        }
        return displayData;
    }
}

/**
 * Generates HTML for displaying up to three contact initials for a task, plus an overflow icon indicating how many additional contacts are assigned.
 * @param {Object} task - The task object containing assigned contacts.
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
 * @param {Object} task - The task object containing contact/assignment information.
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
 * @param {Object} task - The task object containing assigned user information.
 * @returns {string} - The generated HTML Content
 */
async function getAssignedToContent(task) {
    const initialsWithName = await getInitialsWithNames(task);
    if (initialsWithName) {
        return getAssignedToContentTemplate(initialsWithName);
    }
}

/**
 * @function getSubtasksTemplate - Returns HTML-Template for subtasks and checkboxes or empty string.
 * @param {Object} - the task object
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
 * @param {string} taskId - The ID of the task (not used inside the function but may be intended for future use).
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
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {string} subtaskKey - The key identifying the subtask to update.
 * @param {boolean} done - Boolean indicating whether the subtask is completed.
 */
async function updateSubtaskStatus(taskId, subtaskKey, done) {
    const updatePayload = {};
    updatePayload[`subtasks/${subtaskKey}/done`] = done;
    await patchData(`/board/tasks/${taskId}`, updatePayload);
    tasksToArray();
}

/**
 * Filters tasks by title and displays matching results. If the search input is empty, all tasks are displayed.
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

/**
 * Renders existing subtasks into the subtask input area using addSubtask().
 * @function prefillSubtasks
 * @param {Object} task - Task object containing a subtasks property.
 * @returns {void}
 */
function prefillSubtasks(task) {
    const subtaskListContainer = document.querySelector('#subtask-input .list-subtasks');
    const newSubtaskInputField = document.getElementById('subtask-input-field');
    subtaskListContainer.innerHTML = '';
    const existingSubtasks = Object.values(task.subtasks || {});
    existingSubtasks.forEach(subtask => {
      newSubtaskInputField.value = subtask.title;
      addSubtask();
    });
  }

  /**
 * Pre-fills the "Assigned To" checkboxes and chips based on the given task data.
 * Marks checkboxes for contacts whose names appear in task.assigned_to array,
 * then re-renders the chips.
 *
 * @function prefillAssignedTo
 * @param {Object} task - The task object containing an assigned_to array of names.
 * @returns {void}
 */
function prefillAssignedTo(task) {
    const names = task.assigned_to || [];              
    document.querySelectorAll('#contacts-dropdown .select-contact input[type="checkbox"]')
      .forEach(checkbox => {
        const contact = contacts.find(checkedContact => checkedContact.id == checkbox.dataset.contactId);
        if (contact && names.includes(contact.name)) {
          checkbox.checked = true;
        }
      });
    renderAssignedChips();
  }
  

/**
 * Enables edit mode for the active task.
 * Updates the UI and pre-fills form fields with task data.
 */
function switchToTaskEditmode() {
    overlayRef.innerHTML = getOverviewEditmodeTemplate(activeTask);
    setPriorityValue("#add-task-form");
    renderAssignedToField();       
    prefillAssignedTo(activeTask);
    renderSubtaskInput();         
    prefillSubtasks(activeTask);
}

/**
 * Sets the priority input to match the active task's priority.
 * @param {string} form - CSS selector for the form containing priority inputs.
 */
function setPriorityValue(form) {
    const inputs = document.querySelectorAll(`${form} input[name="priority"]`);
    const priority = activeTask.priority;
    inputs.forEach(input => {
        if (input.value === priority) {
            input.checked = true;
        }
    });
}

/**
 * Saves changes to the active task if the form is valid.
 * Updates task data, closes the overlay, and refreshes the task list.
 */
async function commitEditTask() {
    const form = '#edit-task-form';
    if (checkFormValidation(form)) {
        const taskData = prepareTaskData(activeTask.status);
        await updateData(`/board/tasks/${activeTask.id}`, taskData);
        closeOverlay();
        await tasksToArray();
    }
}