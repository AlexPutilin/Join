//*redirectIfNotLoggedIn();*/

/**
 * Stores contact information by their unique IDs.
 * @type {Object.<string, Object>}
 */
contactsById = {};

/**
 * Loads all users from the Firebase database.
 *
 * @async
 * @returns {Promise<Object>} A promise that resolves to an object containing all users.
 */
async function loadAllUsers() {
  try {
    const users = await getData("/users");
    console.log("Users loaded:", users);
    return users;
  } catch (error) {
    console.error("Error while loading users:", error);
  }
}

/**
 * Loads all contacts from the Firebase database.
 *
 * @async
 * @returns {Promise<Object>} A promise that resolves to an object containing all contacts.
 */
async function loadAllContacts() {
  try {
    const contacts = await getData("/contacts");
    console.log("Contacts loaded:", contacts);
    return contacts;
  } catch (error) {
    console.error("Error while loading contacts:", error);
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
 * Renders the priority selection buttons and enables their interaction.
 */
  function renderPriorityButtons() {
    const priorityWrapper = document.getElementById('priority-wrapper-template');
    if (!priorityWrapper) return;
    priorityWrapper.innerHTML = getPriorityTemplate();
    setDefaultPriority();
    enablePrioritySelection();
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
 * Maps a list of contact IDs to their corresponding names.
 *
 * @param {string[]} contactIds - An array of contact IDs.
 * @returns {string} A comma-separated string of contact names.
 */
function mapContactIdsToNames(contactIds) {
  return contactIds
    .map(id => contactsById[id]?.name)
    .filter(Boolean)
    .join(', ');
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
    console.error('Failed submit Task Data:', error);
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
    await postData("/board/tasks", taskData);
  } catch (error) {
    console.error('Failed to save task:', error);
    throw error;
  }
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


function clearAddTaskForm() {
  const form = document.getElementById('add-task-form');
  if (!form) return;
  form.reset();
  resetForm();
  hideDropdownMenus();
  hideErrorMessages();
  initializeAddTaskPage();
  updateCreateButtonState();
}

function resetForm(){
  document.querySelectorAll('input[name="priority"]').forEach(radio => {radio.checked = false;});
  document.querySelectorAll('.drop-down-input input[type="text"]').forEach(input => {input.value = "";input.removeAttribute("data-placeholder-active");});
  document.getElementById('assigned-chips-container')?.replaceChildren();
  document.querySelector('#subtask-input .list-subtasks')?.replaceChildren();
}


  /**
 * Displays a temporary task creation success notification.
 */
  function showAddTaskNotification() {
    const notificationWrapper = document.createElement('div');
    notificationWrapper.innerHTML = getAddTaskNotificationTemplate();
    const notificationElement = notificationWrapper.firstElementChild;
    if (!notificationElement) return;
    document.body.appendChild(notificationElement);
    notificationElement.addEventListener('animationend', () => {
      notificationElement.remove();
    });
  }