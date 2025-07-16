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
 * Loads contacts data and resets color index, then renders them.
 * @async
 */
async function loadAssignedToContacts() {
  contactColorIndex = 0;
  const contacts = await getData('/contacts');
  if (contacts) {
    renderContacts(contacts);
  }
}

/**
 * Initializes the Add Task form when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('add-task-root');
  if (!container) return;
  container.innerHTML = getAddTaskFormTemplate();
  initProfile();
  redirectIfNotLoggedIn();
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
 * Renders the input field for adding subtasks by injecting the corresponding template.
 */
function renderSubtaskInput() {
  const subtaskWrapper = document.getElementById('subtask-wrapper-template');
  if (!subtaskWrapper) return;
  subtaskWrapper.innerHTML = getSubtaskInputTemplate();
}


function initCategoryInteractions(wrapper) {
  const inputWrapper = wrapper.querySelector('.input-wrapper');
  const toggleBtn = inputWrapper.querySelector('button');
  const inputArea = inputWrapper.querySelector('.input-area');
  [toggleBtn, inputArea].forEach(element =>element.addEventListener('click', () => toggleDropDown(toggleBtn)));

  setupCategoryOptionSelection(wrapper, toggleBtn);
  setupCloseOnOutsideClick('#category-wrapper-template .input-wrapper',() => toggleDropDown(toggleBtn));
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
  const inputWrapper     = wrapper.querySelector('.input-wrapper');
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

/**
 * Prüft, ob im Category-Input etwas steht,
 * blendet sonst die Fehlermeldung ein.
 *
 * @returns {boolean} true, wenn Kategorie gesetzt ist
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
 * Master-Initializer fürs Assigned-To-Feld:
 * – Dropdown-Klick & Suche
 * – Kontakt-Selektion
 * – Outside-Click zum Schließen
 */
async function renderAssignedToField() {
  if (!injectAssignedToTemplate()) return;
  await loadAssignedToContacts();
  initAssignedToInteractions();
}

/**
 * Injects the "Assigned To" template into its wrapper element.
 * @returns {boolean} True if injected, false otherwise.
 */
function injectAssignedToTemplate() {
  const wrapper = document.getElementById('assigned-to-wrapper-template');
  if (!wrapper) return false;
  wrapper.innerHTML = getAssignedToTemplate();
  return true;
}

/**
 * Renders contact entries into the "Assigned To" dropdown.
 * @param {Object.<string, {name:string}>} contactsData
 */
function renderContacts(contactsData) {
  const dropdown = document.getElementById('contacts-dropdown');
  if (!dropdown) return;
  dropdown.innerHTML = '';
  Object.entries(contactsData).forEach(([id, info]) => {
    contactsById[id] = info;
    contactsById[id].color = getContactBackgroundColor();
    const html = getContactSelectionTemplate({
      initials: getContactInitials(info.name),
      name: info.name,
      id,
      color: info.color
    });
    dropdown.insertAdjacentHTML('beforeend', html);
  });
}


function initAssignedToInteractions() {
  const wrapper     = document.querySelector('#assigned-to-wrapper-template .input-wrapper');
  const toggleBtn   = wrapper.querySelector('button.btn-small');
  const searchInput = wrapper.querySelector('input[type="text"]');
  const menu        = wrapper.querySelector('.drop-down-menu');

  initAssignedToDropdownAndSearch(toggleBtn, searchInput, menu);
  initAssignedToContactSelection();
  setupCloseOnOutsideClick('#assigned-to-wrapper-template .input-wrapper',() => toggleDropDown(toggleBtn));
}

/**
 * 1) Klick auf den Pfeil öffnet/schließt das Menü
 * 2) Tippen öffnet (falls geschlossen) und filtert die Liste
 */
function initAssignedToDropdownAndSearch(toggleBtn, searchInput, menu) {
  toggleBtn.addEventListener('click', () => openDropDownMenu(toggleBtn));
  searchInput.addEventListener('input', () => {
    if (menu.dataset.open !== 'true') toggleDropDown(toggleBtn);
    const items = Array.from(menu.querySelectorAll('.select-contact'));
    filterItems(items, searchInput.value.toLowerCase().trim());
  });
}

/**
 * 3) Delegation auf Checkbox-Änderungen:
 *    setzt ausgewählten Style & updated Chips
 */
function initAssignedToContactSelection() {
  document
    .getElementById('contacts-dropdown')
    .addEventListener('change', event => {const cb = event.target;
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

/**
 * Extracts all subtasks currently entered in the DOM.
 *
 * @returns {Object.<string, {title: string, done: boolean}>} An object of subtasks indexed by key.
 */
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
 * Sammelt die aktuell angewählten Kontakt‐IDs aus dem Dropdown.
 * @returns {string[]} Array der Contact‐IDs
 */
function getSelectedContactIds() {
  return Array.from(
    document.querySelectorAll('#contacts-dropdown .select-contact input[type="checkbox"]:checked'),
    checkbox => checkbox.dataset.contactId
  );
}

/**
 * Bereitet alle Task‐Daten vor, inkl. assigned_to aus contactsById.
 *
 * @returns {Object} Das fertige Task‐Objekt
 */
function prepareTaskData() {
  const taskData = getInputData('#add-task-form');
  const ids = getSelectedContactIds(); 
  taskData.assigned_to = ids
    .map(id => contactsById[id]?.name)
    .filter(Boolean);
  taskData.status = 'to-do';
  const subtasks = getSubtasksFromDOM();
  if (Object.keys(subtasks).length) {
    taskData.subtasks = subtasks;
  }

  return taskData;
}

/**
 * Speichert den Task, nachdem validateFormBeforeSubmit() grünes Licht gibt.
 */
async function addTask() {
  if (!validateFormBeforeSubmit()) return;
  const taskData = prepareTaskData();
  await submitTaskData(taskData);
  await refreshBoardContainer();
  closeOverlay();

}

/**
 * Submits the task data to the backend and manages post-submit actions.
 *
 * @async
 * @param {Object} taskData - The task data object to submit.
 */
async function submitTaskData(taskData) {
  try {
    await postData('/board/tasks', taskData);
    console.info('addTask: Task erfolgreich gespeichert.');
    clearAddTaskForm();
    showAddTaskNotification();
  } catch (error) {
    console.error('Fehler beim Speichern des Tasks:', error);
  }
}

/**
 * Validates the Add Task form before submission.
 * Nutzt checkFormValidation für alle Inputs und prüft zusätzlich
 * das Category-Feld.
 *
 * @returns {boolean} true, wenn alle Felder (inkl. Kategorie) gültig sind.
 */
function validateFormBeforeSubmit() {
  const inputsValid = checkFormValidation('#add-task-form');
  const categoryValid = validateCategoryField();
  return inputsValid && categoryValid;
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
  // renderAllTasks();
}

async function addTaskBoard(status = 'to-do') {
  prepareTaskData(status);
  overlayRef.classList.remove('d-none');
  //  let closeBtn = document.getElementsByClassName('btn-small');
  // closeBtn.classList.remove('hidden');
  overlayRef.innerHTML = `<div  onclick="eventBubblingProtection(event)" class="add-task-wrapper">
                             ${getAddTaskFormTemplate()}
 
                           
                          </div>`;
  clearAddTaskForm();

}

async function refreshBoardContainer() {
  await tasksToArray();
  await renderAllTasks(allTasks);
}