let selectedStatusForNewTask = 'to-do';

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('add-task-root');
  if (!container) return; 
  container.innerHTML = getAddTaskFormTemplate();
  initProfile();
  redirectIfNotLoggedIn();
  initAddTaskPage();
});


function initAddTaskPage() {
  renderCategoryField();
  renderAssignedToField();
  ensureDefaultPriority();
  renderSubtaskInput();
  enterListenerSubtask();
  setupCreateButtonListeners();
}

function ensureDefaultPriority() {
  if (document.querySelector('input[name="priority"]:checked')) return;
  const medium = document.querySelector('input[name="priority"][value="medium"]');
  if (medium) medium.checked = true;
}

function renderCategoryField() {
  const wrapper = document.getElementById('category-wrapper-template');
  if (!wrapper) return;
  wrapper.innerHTML = getCategoryTemplate();
  createCategoryOptions(wrapper);
  initCategoryInteractions(wrapper);
}

function initCategoryInteractions(wrapper) {
  const inputWrapper = wrapper.querySelector('.input-wrapper');
  const toggleBtn = inputWrapper.querySelector('button');
  const inputArea = inputWrapper.querySelector('.input-area');
  [toggleBtn, inputArea].forEach(element =>element.addEventListener('click', () => toggleDropDown(toggleBtn)));
  setupCategoryOptionSelection(wrapper, toggleBtn);
  setupCloseOnOutsideClick('#category-wrapper-template .input-wrapper',() => toggleDropDown(toggleBtn));
}

function createCategoryOptions(wrapper) {
  const optionsContainer = wrapper.querySelector('#category-options-container');
  optionsContainer.innerHTML = '';
  ['Technical Task', 'User Story'].forEach(name => {
    const option = document.createElement('div');
    option.classList.add('dropdown-single-option');
    option.textContent = name;
    optionsContainer.appendChild(option);
  });
}

function setupCategoryOptionSelection(wrapper, toggleBtn) {
  const optionsContainer = wrapper.querySelector('#category-options-container');
  const inputWrapper     = wrapper.querySelector('.input-wrapper');
  optionsContainer.addEventListener('click', event => {
    const option = event.target.closest('.dropdown-single-option');
    const input = wrapper.querySelector('input');
    input.value = option.textContent;
    toggleDropDown(toggleBtn);
    inputWrapper.querySelector('.input-area').classList.remove('invalid-input');
    wrapper.querySelector('.err-msg').classList.add('hidden');
    updateCreateButtonState();
  });
}

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

async function renderAssignedToField() {
  if (!injectAssignedToTemplate()) return;
  if (contacts.length === 0) {
    await loadContacts(); 
  } renderContacts();     
  initAssignedToInteractions();
}

function injectAssignedToTemplate() {
  const wrapper = document.getElementById('assigned-to-wrapper-template');
  if (!wrapper) return false;
  wrapper.innerHTML = getAssignedToTemplate();
  return true;
}

function renderContacts() {
  const dropdown = document.getElementById('contacts-dropdown');
  if (!dropdown) return;
  dropdown.innerHTML = "";
  contacts.forEach(contact => {
    dropdown.innerHTML += getContactSelectionTemplate(contact);
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

function initAssignedToContactSelection() {
  document.getElementById('contacts-dropdown').addEventListener('change', event => {const checkbox = event.target;
      if (!checkbox.matches('input[type="checkbox"]')) return;
      renderAssignedChips();
    });
}

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

function renderSubtaskInput() {
  const subtaskWrapper = document.getElementById('subtask-wrapper-template');
  if (!subtaskWrapper) return;
  subtaskWrapper.innerHTML = getSubtaskInputTemplate();
}

function getSubtasksForFirebase() {
  const subtasksArray = getSubtasks(); 
  const subtasksObject = {};
  subtasksArray.forEach((subtask, subtaskIndex) => {
    subtasksObject[`subtask${subtaskIndex + 1}`] = subtask;
  });
  return subtasksObject;
}

function getSubtasks() {
  const containers = document.querySelectorAll('#subtask-input .list-subtasks .subtask-item-container');
  return Array.from(containers).map(container => {
    const span = container.querySelector('.subtask-name');
    let raw = span ? span.textContent.trim() : '';
    if (raw.startsWith('•')) raw = raw.slice(1).trim();
    return { title: raw, done: false };
  });
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

function getStatusFromButtonId(buttonId) {
  let status = 'to-do';              
  if (buttonId === 'in-progress-btn') {
    status = 'in-progress';
  }
  else if (buttonId === 'await-feedback-btn') {
    status = 'await-feedback';
  }
  return status;
}

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

async function addTask(status = 'to-do') {
  if (!validateFormBeforeSubmit()) return;
  const taskData = prepareTaskData(selectedStatusForNewTask);
  await postData('/board/tasks', taskData);
  console.info('addTask: Task successfully saved');
  clearAddTaskForm();
  showAddTaskNotification();
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

function resetForm(){
  document.querySelectorAll('input[name="priority"]').forEach(radio => {radio.checked = false;});
  document.querySelectorAll('.drop-down-input input[type="text"]').forEach(input => {input.value = "";input.removeAttribute("data-placeholder-active");});
  document.getElementById('assigned-chips-container')?.replaceChildren();
  document.querySelector('#subtask-input .list-subtasks')?.replaceChildren();
}

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