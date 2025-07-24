let selectedStatusForNewTask = 'to-do';

/**
 * On DOMContentLoaded, inject the add‑task form into #add-task-root,
 * then initialize profile, auth redirect, and the add‑task page.
 *
 * @event DOMContentLoaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('add-task-root');
  if (!container) return; 
  container.innerHTML = getAddTaskFormTemplate();
  initProfile();
  redirectIfNotLoggedIn();
  initAddTaskPage();
});

/**
 * Renders and initializes all components of the "Add Task" page.
 * Set up the Add Task page: render category, assigned‑to, default priority,
 * subtask input, subtask entry listener, and create‑button listeners.
 *
 * @function initAddTaskPage
 * @returns {void}
 */
function initAddTaskPage() {
  renderCategoryField();
  renderAssignedToField();
  ensureDefaultPriority();
  renderSubtaskInput();
  enterListenerSubtask();
  setupCreateButtonListeners();
}

/**
 * Ensures a default "medium" priority is selected if no priority option is checked.
 * @function ensureDefaultPriority
 * @returns {void}
 */
function ensureDefaultPriority() {
  if (document.querySelector('input[name="priority"]:checked')) return;
  const medium = document.querySelector('input[name="priority"][value="medium"]');
  if (medium) medium.checked = true;
}

/**
 * Renders the category field by injecting its HTML template, creating options,
 * and initializing dropdown interactions.
 * @function renderCategoryField
 * @returns {void}
 */
function renderCategoryField(task) {
  const wrapper = document.getElementById('category-wrapper-template');
  if (!wrapper) return;
  wrapper.innerHTML = getCategoryTemplate(task)
  initCategoryInteractions(wrapper);
}

/**
 * Sets the category input value to the clicked option’s text,
 * closes the dropdown, clears validation errors, and updates the create button state.
 *
 * @function selectCategory
 * @param {HTMLElement} optionElement - The clicked dropdown option element.
 * @returns {void}
 */
function selectCategory(optionElement) {
  const wrapper   = optionElement.closest('#category-wrapper-template');
  const input     = wrapper.querySelector('input[name="category"]');
  const toggleBtn = wrapper.querySelector('button.btn-small');

  input.value = optionElement.textContent.trim();
  toggleDropDown(toggleBtn);
  wrapper.querySelector('.input-area').classList.remove('invalid-input');
  wrapper.querySelector('.err-msg').classList.add('hidden');
  updateCreateButtonState();
}

/**
 * Initializes category dropdown interactions:
 * - Attaches click listeners to toggle button and input area to open/close dropdown.
 * - Sets up option selection logic.
 * - Closes dropdown when clicking outside of the input wrapper.
 *
 * @function initCategoryInteractions
 * @param {HTMLElement} wrapper - The container element for the category field.
 * @returns {void}
 *  
 */
function initCategoryInteractions(wrapper) {
  const inputWrapper = wrapper.querySelector('.input-wrapper');
  const toggleBtn = inputWrapper.querySelector('button');
  const inputArea = inputWrapper.querySelector('.input-area');
  [toggleBtn, inputArea].forEach(element =>element.addEventListener('click', () => toggleDropDown(toggleBtn)));
  setupCloseOnOutsideClick('#category-wrapper-template .input-wrapper',() => toggleDropDown(toggleBtn));
}

/**
 * Validate the category input: ensures non‑empty value, toggles error UI.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateCategoryField() {
  const input    = document.getElementById('task-category');
  const wrapper  = input.closest('.input-wrapper');
  const area     = wrapper.querySelector('.input-area');
  const errMsg   = wrapper.querySelector('.err-msg');
  const isValid  = !!input.value.trim();
  if (isValid) {
    area.classList.remove('invalid-input');
    errMsg.classList.add('hidden');
  } else {
    area.classList.add('invalid-input');
    errMsg.classList.remove('hidden');
  }
  return isValid;
}

/**
 * Injects the Assigned To template, loads contacts if empty,
 * then renders contact items and initializes interactions.
 * @async
 * @returns {Promise<void>}
 */
async function renderAssignedToField() {
  if (!injectAssignedToTemplate()) return;
  if (contacts.length === 0) {
    await loadContacts(); 
  } renderContacts();     
    assignedToInteractions();
}

/**
 * Injects the Assigned To HTML into its wrapper element.
 * @returns {boolean} True if the template was injected, false if the wrapper was not found.
 */
function injectAssignedToTemplate() {
  const wrapper = document.getElementById('assigned-to-wrapper-template');
  if (!wrapper) return false;
  wrapper.innerHTML = getAssignedToTemplate();
  return true;
}

/**
 * Populates the contacts dropdown with checkbox items for each contact.
 * @returns {void}
 */
function renderContacts() {
  const dropdown = document.getElementById('contacts-dropdown');
  if (!dropdown) return;
  dropdown.innerHTML = "";
  contacts.forEach(contact => {
    dropdown.innerHTML += getContactSelectionTemplate(contact);
  });
}

/**
 * Initializes interaction handlers for the "Assigned To" field:
 * - Dropdown toggle and search integration.
 * - Contact selection change handling.
 * - Closes dropdown on outside click.
 *
 * @function initAssignedToInteractions
 * @returns {void}
 */
function assignedToInteractions() {
  const wrapper     = document.querySelector('#assigned-to-wrapper-template .input-wrapper');
  const toggleBtn   = wrapper.querySelector('button.btn-small');
  const searchInput = wrapper.querySelector('input[type="text"]');
  const menu        = wrapper.querySelector('.drop-down-menu');
  initAssignedToDropdownAndSearch(toggleBtn, searchInput, menu);
  initAssignedToContactSelection();
  setupCloseOnOutsideClick('#assigned-to-wrapper-template .input-wrapper',() => toggleDropDown(toggleBtn));
}

/**
 * Sets up the dropdown toggle and live-search behavior for the contacts menu.
 *
 * @function initAssignedToDropdownAndSearch
 * @param {HTMLElement} toggleBtn   - Button to open/close the dropdown.
 * @param {HTMLInputElement} searchInput - Text field for filtering contacts.
 * @param {HTMLElement} menu        - The dropdown menu container.
 * @returns {void}
 */
function initAssignedToDropdownAndSearch(toggleBtn, searchInput, menu) {
  toggleBtn.onclick = () => toggleDropDown(toggleBtn);
  searchInput.onkeydown = element => {
    const key = element.key;
    if ((key.length === 1 || key === 'Backspace') && menu.dataset.open !== 'true') {
      toggleDropDown(toggleBtn);
    }
  }; searchInput.onkeyup = () => {
    const items = Array.from(menu.querySelectorAll('.select-contact'));
    filterItems(items, searchInput.value.toLowerCase().trim());
  };
}

/**
 * Attaches a change listener to the contacts dropdown to re-render chips whenever
 * a contact checkbox is toggled.
 *
 * @function initAssignedToContactSelection
 * @returns {void}
 */
function initAssignedToContactSelection() {
  document.getElementById('contacts-dropdown').addEventListener('change', event => {const checkbox = event.target;
      if (!checkbox.matches('input[type="checkbox"]')) return;
      renderAssignedChips();
    });
}

/**
 * Renders the selected contacts as chips below the Assigned To field.
 * Clears existing chips and creates a new chip for each checked contact.
 *
 * @function renderAssignedChips
 * @returns {void}
 */
function renderAssignedChips() {
  const container = document.getElementById('assigned-chips-container');
  container.innerHTML = '';
  document .querySelectorAll('#contacts-dropdown .select-contact input[type="checkbox"]:checked')
    .forEach(checkbox => {
      const id = checkbox.dataset.contactId;
      const info = contacts.find(contact => contact.id === id);
      if (!info) return;
      const chip = createContactChip(getContactInitials(info.name),info.color);
      container.appendChild(chip);
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
function renderSubtaskInput() {
  const subtaskWrapper = document.getElementById('subtask-wrapper-template');
  if (!subtaskWrapper) return;
  subtaskWrapper.innerHTML = getSubtaskInputTemplate();
}

/**
 * Converts an array of subtask objects into a Firebase‑friendly object.
 * @function getSubtasksForFirebase
 * @returns {Object} Subtasks keyed as subtask1, subtask2, …
 */
function getSubtasksForFirebase() {
  const subtasksArray = getSubtasks(); 
  const subtasksObject = {};
  subtasksArray.forEach((subtask, subtaskIndex) => {
    subtasksObject[`subtask${subtaskIndex + 1}`] = subtask;
  });
  return subtasksObject;
}

/**
 * Reads subtask entries from the DOM and returns them as plain objects.
 * @function getSubtasks
 * @returns {Array<{title: string, done: boolean}>} List of subtasks.
 */
function getSubtasks() {
  const containers = document.querySelectorAll('#subtask-input .list-subtasks .subtask-item-container');
  return Array.from(containers).map(container => {
    const span = container.querySelector('.subtask-name');
    let raw = span ? span.textContent.trim() : '';
    if (raw.startsWith('•')) raw = raw.slice(1).trim();
    return { title: raw, done: false };
  });
}

/**
 * Attaches input listeners to title and date fields to toggle the create button.
 * @function setupCreateButtonListeners
 * @returns {void}
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
 * Returns the IDs of all checked contact checkboxes.
 * @function getSelectedContactIds
 * @returns {string[]} Array of selected contact IDs.
 */
function getSelectedContactIds() {
  return Array.from(
    document.querySelectorAll('#contacts-dropdown .select-contact input[type="checkbox"]:checked'),
    checkbox => checkbox.dataset.contactId
  );
}

/**
 * Gathers form data, selected contacts, and subtasks into a single object.
 * @function prepareTaskData
 * @param {string} status - Desired status for the new task.
 * @returns {Object} Combined task data ready for posting.
 */
function prepareTaskData(status) {
  const taskData = getInputData('#add-task-form');
  const ids = getSelectedContactIds();
  const names = ids.map(id => 
    {const contact = contacts.find(checkedContacts => String(checkedContacts.id) === String(id));
    return contact?.name;
    }).filter(Boolean);
  taskData.assigned_to = names.join(', '); 
  taskData.status      = status;
  const subtasks = getSubtasksForFirebase();
  if (Object.keys(subtasks).length) {
    taskData.subtasks = subtasks;
  } return taskData;
}

/**
 * Validates the form and submits a new task to the server.
 * @async
 * @function addTask
 * @returns {Promise<void>}
 */
async function addTask() {
  if (!validateFormBeforeSubmit()) return;
  const taskData = prepareTaskData(selectedStatusForNewTask);
  await postData('/board/tasks', taskData);
  console.info('addTask: Task successfully saved');
  clearAddTaskForm();
  showAddTaskNotification();
  setTimeout(() => {
    openPage('board.html');
  }, 2000);
}

/**
 * Checks that all required form fields pass validation.
 * @function validateFormBeforeSubmit
 * @returns {boolean} True if form is valid, false otherwise.
 */
function validateFormBeforeSubmit() {
  const inputsValid = checkFormValidation('#add-task-form');
  const categoryValid = validateCategoryField();
  return inputsValid && categoryValid;
}

/**
 * Enables or disables the create‑task button based on form completeness.
 * @function updateCreateButtonState
 * @returns {void}
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
 * Resets and reinitializes the add‑task form UI to its default state.
 * @function clearAddTaskForm
 * @returns {void}
 */
function clearAddTaskForm() {
  const form = document.getElementById('add-task-form');
  if (!form) return;
  form.reset();
  resetForm();
  hideDropdownMenus();
  hideErrorMessages();
  initAddTaskPage();
  updateCreateButtonState();
}

/**
 * Clears priority, dropdown inputs, chips, and subtasks from the form.
 * @function resetForm
 * @returns {void}
 */
function resetForm(){
  document.querySelectorAll('input[name="priority"]').forEach(radio => {radio.checked = false;});
  document.querySelectorAll('.drop-down-input input[type="text"]').forEach(input => {input.value = "";input.removeAttribute("data-placeholder-active");});
  document.getElementById('assigned-chips-container')?.replaceChildren();
  document.querySelector('#subtask-input .list-subtasks')?.replaceChildren();
}

/**
 * Displays a transient success notification after adding a task.
 * @function showAddTaskNotification
 * @returns {void}
 */
function showAddTaskNotification() {
  const notificationHtml = getAddTaskNotificationTemplate();
  document.body.insertAdjacentHTML('beforeend', notificationHtml);
  setTimeout(() => {
    const notification = document.querySelector('.successfully-added-notification');
    if (notification) notification.remove();
  }, 2000);
}

/**
 * Opens the "Add Task" form either on a new page for small screens or in an overlay for larger screens, based on the given status.
 * @param {string} status - The status the newly added task should be in.
 * @returns {Promise<void>}
 */
async function addTaskBoard(status) {
  if (window.innerWidth <= 992) {
    openPage(`addTask.html?status=${encodeURIComponent(status)}`);
    return;
  }
  selectedStatusForNewTask = status;
  overlayRef.classList.remove('d-none');                   
  overlayRef.innerHTML = getDialogAddTaskOnBoard();
  clearAddTaskForm();
  await tasksToArray();
}

/**
 * Extracts the 'status' query parameter from the current page URL.
 * Defaults to 'to-do' if the parameter is not present.
 * @returns {string} The task status from the URL, or 'to-do' as fallback.
 */
function getStatusFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('status') || 'to-do';
}