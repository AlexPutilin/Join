/**
 * Stores contact information by their unique IDs.
 * @type {Object.<string, Object>}
 */
const contactsById = {};

/**
 * Loads all users from the Firebase database.
 *
 * @async
 * @function loadAllUsers
 * @returns {Promise<Object>} A promise that resolves to an object containing all users.
 *                            If an error occurs, an empty object will be returned.
 */
async function loadAllUsers() {
  try {
      const response = await fetch(`${FIREBASE_URL}/users.json`);
      const users = await response.json();
      console.log("Users loaded:", users);
      return users;
  } catch (error) {
      console.error("Error while loading users:", error);
      return {};
  }
}

/**
* Loads all contacts from the Firebase database.
*
* @async
* @function loadAllContacts
* @returns {Promise<Object>} A promise that resolves to an object containing all contacts.
*                            If an error occurs, an empty object will be returned.
*/
async function loadAllContacts() {
  try {
      const response = await fetch(`${FIREBASE_URL}/contacts.json`);
      const contacts = await response.json();
      console.log("Contacts loaded:", contacts);
      return contacts;
  } catch (error) {
      console.error("Error while loading contacts:", error);
      return {};
  }
}

/**
 * Initializes the Add Task form when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('add-task-root');
  if (!container) return; 
  container.innerHTML = getAddTaskFormTemplate();
  initializeAddTaskPage();
});

/**
 * Initializes the Add Task page components.
 */
function initializeAddTaskPage() {
  renderCategoryField();
  renderAssignedToField();
  renderPriorityButtons();
  renderSubtaskInput();
  setupCreateButtonListeners();
  FullAreaCategoryDropdownClick()
}


/**
 * Sets up listeners on the task title and due date inputs to update create button state.
 */
function setupCreateButtonListeners() {
  const titleInput = document.getElementById('task-title');
  const dueDateInput = document.getElementById('due-date');

  if (titleInput) {
    titleInput.addEventListener('input', updateCreateButtonState);
  }
  if (dueDateInput) {
    dueDateInput.addEventListener('input', updateCreateButtonState);
  }
}

/**
 * Gathers all task-related input data from the form and prepares it for submission.
 * Includes assigned contacts, status, and subtasks if present.
 *
 * @returns {Object} The complete task data object.
 */
function prepareTaskData() {
  const taskData = getInputData('#add-task-form');
  const assignedInputElement = document.getElementById('assigned-input');
  const assignedIds = (assignedInputElement?.dataset?.value || "")
    .split(",")
    .filter(id => id);

  taskData.assigned_to = mapContactIdsToNames(assignedIds);
  taskData.status = "to-do";

  const subtasks = getSubtasksFromDOM();
  if (Object.keys(subtasks).length > 0) {
    taskData.subtasks = subtasks;
  }

  return taskData;
}

/**
 * Handles the full task creation process:
 * validates the form, prepares data, and submits it.
 *
 * @async
 */
async function addTask() {
  if (!validateFormBeforeSubmit()) return;
  const taskData = prepareTaskData();
  await submitTaskData(taskData);
}

/**
 * Submits the task data to the backend and manages post-submit actions.
 *
 * @async
 * @param {Object} taskData - The task data object to submit.
 */
async function submitTaskData(taskData) {
  try {
    await saveTaskToFirebase(taskData);
    console.info("addTask: Task successfully saved.");
    clearAddTaskForm();
    showAddTaskNotification();
  } catch (error) {
    handleTaskSaveError(error);
  }
}

/**
 * Saves the task data to Firebase.
 *
 * @async
 * @param {Object} taskData - The task data to be saved.
 * @returns {Promise<string>} The ID of the created task.
 * @throws Will throw an error if the request fails.
 */
async function saveTaskToFirebase(taskData) {
  try {
    const response = await fetch(`${FIREBASE_URL}/board/tasks.json`, {
      method: "POST",
      body: JSON.stringify(taskData)
    });
    const result = await response.json();
    console.log('Task created with id:', result.name);

    return result.name;
  } catch (error) {
    console.error('Failed to save task:', error);
    throw error;
  }
}

/**
 * Handles errors that occur during task saving.
 * Logs the error and notifies the user.
 *
 * @param {Error} error - The error that occurred.
 */
function handleTaskSaveError(error) {
  console.error("addTask: Failed to save task to Firebase:", error);
  alert("Failed to create task: " + error.message);
}



/**
 * Updates the state of the "Create Task" button based on required form field values.
 * Enables the button only when all required fields are filled.
 */
function updateCreateButtonState() {
  const titleValue = document.getElementById('task-title')?.value.trim();
  const dueDateValue = document.getElementById('due-date')?.value.trim();
  const categoryValue = document.getElementById('task-category')?.value.trim();
  const createButton = document.getElementById('create-task-btn');

  const formIsValid = Boolean(titleValue && dueDateValue && categoryValue);

  if (!formIsValid) {
    createButton.disabled = true;
    createButton.setAttribute('title', 'Please fill out the required fields');
  } else {
    createButton.disabled = false;
    createButton.removeAttribute('title');
  }
}

/**
 * Clears the Add Task form by resetting all inputs, dropdowns, chips, subtasks,
 * error messages, and re-initializing the form.
 */
function clearAddTaskForm() {
  resetTextDateAndTextareaInputs();
  resetPriorityRadios();
  resetDropdownCheckboxes();
  resetDropdownTextInputs();
  hideDropdownMenus();
  clearChipsAndSubtasks();
  hideErrorMessages();
  initializeAddTaskPage();
  updateCreateButtonState();
}

/**
 * Resets all text, date, and textarea inputs to an empty value.
 */
function resetTextDateAndTextareaInputs() {
  document
    .querySelectorAll('input[type="text"], input[type="date"], textarea')
    .forEach(input => {
      input.value = "";
    });
}

/**
 * Unchecks all radio buttons in the "priority" group.
 */
function resetPriorityRadios() {
  document
    .querySelectorAll('input[name="priority"]')
    .forEach(radio => {
      radio.checked = false;
    });
}

/**
 * Unchecks all checkboxes within dropdown menus.
 */
function resetDropdownCheckboxes() {
  document
    .querySelectorAll('.drop-down-menu input[type="checkbox"]')
    .forEach(checkbox => {
      checkbox.checked = false;
    });
}

/**
 * Clears text inputs inside dropdown areas and removes any active placeholder attributes.
 */
function resetDropdownTextInputs() {
  document
    .querySelectorAll('.drop-down-input input[type="text"]')
    .forEach(input => {
      input.value = "";
      input.removeAttribute("data-placeholder-active");
    });
}

/**
 * Removes all assigned contact chips and subtask list items from the DOM.
 */
function clearChipsAndSubtasks() {
  document.getElementById('assigned-chips-container')?.replaceChildren();
  document.querySelector('#subtask-input .list-subtasks')?.replaceChildren();
}