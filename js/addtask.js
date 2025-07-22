let selectedStatusForNewTask = 'to-do';
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


document.addEventListener("DOMContentLoaded", () => {
  selectedStatusForNewTask = getStatusFromURL();
  const container = document.getElementById('add-task-root');
  if (!container) return;
  container.innerHTML = getAddTaskFormTemplate();
  initProfile();
  redirectIfNotLoggedIn();
  initializeAddTaskPage();
});


function initializeAddTaskPage() {
  renderCategoryField();
  renderAssignedToField();
  renderPriorityButtons();
  renderSubtaskInput();
  setupCreateButtonListeners();
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


function initCategoryInteractions(wrapper) {
  const inputWrapper = wrapper.querySelector('.input-wrapper');
  const toggleBtn = inputWrapper.querySelector('button');
  const inputArea = inputWrapper.querySelector('.input-area');
  [toggleBtn, inputArea].forEach(element => element.addEventListener('click', () => toggleDropDown(toggleBtn)));

  setupCategoryOptionSelection(wrapper, toggleBtn);
  setupCloseOnOutsideClick('#category-wrapper-template .input-wrapper', () => toggleDropDown(toggleBtn));
}

function renderCategoryField() {
  const wrapper = document.getElementById('category-wrapper-template');
  if (!wrapper) return;
  wrapper.innerHTML = getCategoryTemplate();
  createCategoryOptions(wrapper);
  initCategoryInteractions(wrapper);
}

function createCategoryOptions(wrapper) {
  const optionsContainer = wrapper.querySelector('#category-options-container');
  optionsContainer.innerHTML = '';
  ['Technical Task', 'User Story'].forEach(name => {
    const opt = document.createElement('div');
    opt.classList.add('dropdown-single-option');
    opt.textContent = name;
    optionsContainer.appendChild(opt);
  });
}


function setupCategoryOptionSelection(wrapper, toggleBtn) {
  const optionsContainer = wrapper.querySelector('#category-options-container');
  const inputWrapper = wrapper.querySelector('.input-wrapper');
  optionsContainer.addEventListener('click', event => {
    const opt = event.target.closest('.dropdown-single-option');
    const input = wrapper.querySelector('input');
    input.value = opt.textContent;
    toggleDropDown(toggleBtn);
    inputWrapper.querySelector('.input-area').classList.remove('invalid-input');
    wrapper.querySelector('.err-msg').classList.add('hidden');
    updateCreateButtonState();
  });
}


function validateCategoryField() {
  const input = document.getElementById('task-category');
  const wrapper = input.closest('.input-wrapper');
  const area = wrapper.querySelector('.input-area');
  const errMsg = wrapper.querySelector('.err-msg');
  const isValid = !!input.value.trim();
  if (isValid) {
    area.classList.remove('invalid-input');
    errMsg.classList.add('hidden');
  } else {
    area.classList.add('invalid-input');
    errMsg.classList.remove('hidden');
  }
  return isValid;
}


async function renderAssignedToField() {
  if (!injectAssignedToTemplate()) return;

  // 1) Kontakte holen, falls noch nicht geschehen
  if (contacts.length === 0) {
    await loadContacts();        // füllt dein globales `contacts`-Array
  }

  // 2) Dropdown befüllen
  renderContacts(contacts);

  // 3) Restliche Interaktionen
  initAssignedToInteractions();
}


function injectAssignedToTemplate() {
  const wrapper = document.getElementById('assigned-to-wrapper-template');
  if (!wrapper) return false;
  wrapper.innerHTML = getAssignedToTemplate();
  return true;
}


function renderContacts(contacts) {
  const dropdown = document.getElementById('contacts-dropdown');
  if (!dropdown) return;
  dropdown.innerHTML = "";
  contacts.forEach(contact => {
    dropdown.innerHTML += getContactSelectionTemplate(contact);
  });
}


function initAssignedToInteractions() {
  const wrapper = document.querySelector('#assigned-to-wrapper-template .input-wrapper');
  const toggleBtn = wrapper.querySelector('button.btn-small');
  const searchInput = wrapper.querySelector('input[type="text"]');
  const menu = wrapper.querySelector('.drop-down-menu');
  initAssignedToDropdownAndSearch(toggleBtn, searchInput, menu);
  initAssignedToContactSelection();
  setupCloseOnOutsideClick('#assigned-to-wrapper-template .input-wrapper', () => toggleDropDown(toggleBtn));
}


function initAssignedToDropdownAndSearch(toggleBtn, searchInput, menu) {
  toggleBtn.addEventListener('click', () => openDropDownMenu(toggleBtn));
  searchInput.addEventListener('input', () => {
    if (menu.dataset.open !== 'true') toggleDropDown(toggleBtn);
    const items = Array.from(menu.querySelectorAll('.select-contact'));
    filterItems(items, searchInput.value.toLowerCase().trim());
  });
}


function initAssignedToContactSelection() {
  document
    .getElementById('contacts-dropdown')
    .addEventListener('change', event => {
      const cb = event.target;
      if (!cb.matches('input[type="checkbox"]')) return;
      cb.closest('.select-contact').classList.toggle('selected', cb.checked);
      renderAssignedChips();
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


function renderSubtaskInput() {
  const subtaskWrapper = document.getElementById('subtask-wrapper-template');
  if (!subtaskWrapper) return;
  subtaskWrapper.innerHTML = getSubtaskInputTemplate();
}


function getSubtasksFromDOM() {
  const subtaskElements = getAllSubtaskElements();
  const subtasks = {};
  subtaskElements.forEach((element, index) => {
    const title = extractSubtaskTitle(element);
    if (title) {
      subtasks[`subtask${index + 1}`] = createSubtaskObject(title);
    }
  }); return subtasks;
}


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


function getSelectedContactIds() {
  return Array.from(
    document.querySelectorAll('#contacts-dropdown .select-contact input[type="checkbox"]:checked'),
    checkbox => checkbox.dataset.contactId
  );
}


function prepareTaskData(status) {
  const taskData = getInputData('#add-task-form');
  const ids = getSelectedContactIds();
  const names = ids.map(id => contactsById[id]?.name).filter(Boolean);
  taskData.assigned_to = names.join(', ');
  taskData.status = status;
  const subtasks = getSubtasksFromDOM();
  if (Object.keys(subtasks).length) {
    taskData.subtasks = subtasks;
  }

  return taskData;
}


/**
 * Speichert den Task, nachdem validateFormBeforeSubmit() grünes Licht gibt.
 */
async function addTask(status = 'to-do') {
  if (!validateFormBeforeSubmit()) return;
  const taskData = prepareTaskData(selectedStatusForNewTask);
  await postData('/board/tasks', taskData);
  console.info('addTask: Task erfolgreich gespeichert.');
  clearAddTaskForm();
  showAddTaskNotification();
  overlayRef.classList.add('d-none');
  await tasksToArray();
}



function validateFormBeforeSubmit() {
  const inputsValid = checkFormValidation('#add-task-form');
  const categoryValid = validateCategoryField();
  return inputsValid && categoryValid;
}


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


async function clearAddTaskForm() {
  const form = document.getElementById('add-task-form');
  if (!form) return;
  form.reset();
  resetForm();
  hideDropdownMenus();
  hideErrorMessages();
  initializeAddTaskPage();
  updateCreateButtonState();
  await tasksToArray();
}

function resetForm() {
  document.querySelectorAll('input[name="priority"]').forEach(radio => { radio.checked = false; });
  document.querySelectorAll('.drop-down-input input[type="text"]').forEach(input => { input.value = ""; input.removeAttribute("data-placeholder-active"); });
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


/** 
* Opens the Add Task form either on the Add Task page (for small screens)
* or in an overlay (for larger screens), depending on the specified status.
* @param {*} status – The status to pre-populate or assign to the new task.
* @returns {Promise<void>}
 */
async function addTaskBoard(status) {
  if (window.innerWidth <= 992) {
    openPage(`addTask.html?status=${encodeURIComponent(status)}`);
    return;
  }
  selectedStatusForNewTask = status;
  overlayRef.classList.remove('d-none');
  overlayRef.innerHTML = `<div onclick="eventBubblingProtection(event)" class="add-task-wrapper">
                            <button onclick="closeOverlay()" class="btn-small">
                            <img class="icon-default" src="../assets/img/icon-close-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
                        </button>
                            ${getAddTaskFormTemplate()}
                          </div>`;
  clearAddTaskForm();
}


/**
 * Retrieves the 'status' parameter from the current URL.
 * If the parameter is missing, returns the default value 'to-do'.
 * @returns {string} The value of the 'status' parameter or 'to-do' if not present.
 */
function getStatusFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('status') || 'to-do';
}