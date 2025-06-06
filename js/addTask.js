const contactColors = {};
const contactsById = {};


document.addEventListener("DOMContentLoaded", initializeAddTaskPage);


function initializeAddTaskPage() {
  renderCategoryField();
  renderAssignedToField();
  renderPriorityButtons();
  renderSubtaskInput();
}


function renderPriorityButtons() {
  const priorityWrapper = document.getElementById('priority-wrapper-template');
  if (!priorityWrapper) return;
  priorityWrapper.innerHTML = getPriorityTemplate();
  setDefaultPriority();
  enablePrioritySelection();
}


function setDefaultPriority() {
  const mediumInput = document.querySelector('input[name="priority"][value="medium"]');
  if (!mediumInput) return;
  mediumInput.checked = true;
  const mediumLabel = mediumInput.closest('.priority-option');
  if (mediumLabel) mediumLabel.classList.add('active');
}


function enablePrioritySelection() {
  document.querySelectorAll('.priority-option').forEach(label => {
    label.addEventListener('click', () => {
      document.querySelectorAll('.priority-option').forEach(l => l.classList.remove('active'));
      label.classList.add('active');
      const input = label.querySelector('input[name="priority"]');
      if (input) input.checked = true;
    });
  });
}



function renderCategoryField() {
  const catgeoryFieldWrapper = document.getElementById('category-wrapper-template');
  if (!catgeoryFieldWrapper) return;
  catgeoryFieldWrapper.innerHTML = getCategoryTemplate();
  renderCategoryOptions();
}


function renderCategoryOptions() {
  const categoryContainer = getAndClearCategoryContainer();
  if (!categoryContainer) return;

  const categories = ['Technical Task', 'User Story'];
  categories.forEach(category => addCategoryOption(categoryContainer, category));
}


function getAndClearCategoryContainer() {
  const container = document.getElementById('category-options-container');
  if (!container) return null;
  container.innerHTML = '';
  return container;
}


function addCategoryOption(container, name) {
  const option = document.createElement('div');
  option.classList.add('dropdown-single-option');
  option.textContent = name;
  option.onclick = () => selectCategoryOption(option);
  container.appendChild(option);
}



function selectCategoryOption(optionElement) {
  const selectedValue = optionElement.innerText;
  const categoryInput = document.getElementById('task-category');
  if (!categoryInput) return;
  categoryInput.value = selectedValue;
  const toggleBtn = categoryInput.closest('.input-wrapper').querySelector('button');
  toggleDropDown(toggleBtn);
  document.getElementById('category-error')?.classList.add('hidden');
}


function getColorForContact(contactId) {
  const hash = Array.from(contactId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return randomColors[hash % randomColors.length];
}


async function renderAssignedToField() {
  const assignedToWrapper = document.getElementById('assigned-to-wrapper-template');
  if (!assignedToWrapper) {
    console.warn('Assigned-to container not found');
    return;
  } assignedToWrapper.innerHTML = getAssignedToTemplate();
  const contacts = await getData('/contacts');
  if (contacts) {
    renderContacts(contacts);
  }

  setupContactSelection();
  updateAssignedToChips();
}

function renderContacts(contactsData) {
  const dropdown = document.getElementById('contacts-dropdown');
  if (!dropdown) return;

  dropdown.innerHTML = '';

  Object.entries(contactsData).forEach(([contactId, contactInfo]) => {
    contactsById[contactId] = contactInfo; 
    const contactHtml = createContactHTML(contactId, contactInfo);
    dropdown.insertAdjacentHTML('beforeend', contactHtml);
  });
}


function createContactHTML(contactId, contactInfo) {
  const initials = getInitials(contactInfo.name);
  const color = getColorForContact(contactId);

  return getContactSelectionTemplate({
    initials,
    name: contactInfo.name,
    id: contactId,
    color
  });
}



function getInitials(name) {
  if (!name) return "";
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}


function setupContactSelection() {
  document.querySelectorAll('#contacts-dropdown .select-contact .checkbox input[type="checkbox"]')
    .forEach(input => {
      input.addEventListener('change', updateAssignedToChips);
    });
}


function updateAssignedToChips() {
  const selectedIds = getCheckedContactIds();
  renderAssignedContactChips(selectedIds);
  storeAssignedContactIds(selectedIds);
}


function getCheckedContactIds() {
  const checkboxes = document.querySelectorAll(
    '#contacts-dropdown .select-contact .checkbox input[type="checkbox"]:checked'
  );
  return Array.from(checkboxes).map(input => input.dataset.contactId);
}



function renderAssignedContactChips(contactIds) {
  const chipContainer = document.getElementById('assigned-chips-container');
  chipContainer.innerHTML = '';

  contactIds.forEach(contactId => {
    const contact = contactsById[contactId];
    if (!contact) return;

    const initials = getInitials(contact.name);
    const color = getColorForContact(contactId);
    const chip = createContactChip(initials, color);
    chipContainer.appendChild(chip);
  });
}

function storeAssignedContactIds(contactIds) {
  const input = document.getElementById('assigned-input');
  if (!input) return;
  input.value = '';
  input.dataset.value = contactIds.join(',');
}

function createContactChip(initials, backgroundColor) {
  const chip = document.createElement('div');
  chip.classList.add('assigned-chip');
  chip.textContent = initials;
  chip.style.backgroundColor = backgroundColor;
  chip.style.color = 'white';
  return chip;
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
  });

  return subtasks;
}

function getAllSubtaskElements() {
  const listContainer = document.querySelector('#subtask-input .list-subtasks');
  return listContainer.querySelectorAll('.subtask-item-container');
}

function extractSubtaskTitle(container) {
  const textSpan = container.querySelector('.subtask-name');
  if (!textSpan) return null;
  return textSpan.textContent.trim();
}


function createSubtaskObject(title) {
  return { title: title, done: false };
}


async function saveTaskToFirebase(taskData) {
  try {
    const taskId = await generateUID('/board/tasks');
    const taskPath = `/board/tasks/task${taskId}`;

    await putData(taskPath, taskData);

    console.log('Task saved successfully.');
  } catch (error) {
    console.error('Failed to save task:', error);
    throw error;
  }
}


function prepareTaskData() {
  const taskData = getInputData('#add-task-form');
  const assignedInputElement = document.getElementById('assigned-input');
  taskData.assigned_to = assignedInputElement?.dataset?.value || "";

  const subtasks = getSubtasksFromDOM();
  if (Object.keys(subtasks).length > 0) {
    taskData.subtasks = subtasks;
  }

  return taskData;
}


async function addTask() {
  if (!checkFormValidation('#add-task-form')) {
    console.warn("addTask: Form validation failed.");
    return;
  }

  const taskData = prepareTaskData();

  try {
    await saveTaskToFirebase(taskData);
    console.info("addTask: Task successfully saved.");
    clearAddTaskForm();
    alert("Task successfully created!");
  } catch (error) {
    handleTaskSaveError(error);
  }
}

function handleTaskSaveError(error) {
  console.error("addTask: Failed to save task to Firebase:", error);
  alert("Failed to create task: " + error.message);
}


function clearAddTaskForm() {
  resetTextDateAndTextareaInputs();
  resetPriorityRadios();
  resetDropdownCheckboxes();
  resetDropdownTextInputs();
  hideDropdownMenus();
  clearChipsAndSubtasks();
  hideErrorMessages();
  initializeAddTaskPage();
}

function resetTextDateAndTextareaInputs() {
  document.querySelectorAll('input[type="text"], input[type="date"], textarea')
    .forEach(input => (input.value = ""));
}

function resetPriorityRadios() {
  document.querySelectorAll('input[name="priority"]')
    .forEach(radio => (radio.checked = false));
}

function resetDropdownCheckboxes() {
  document.querySelectorAll('.drop-down-menu input[type="checkbox"]')
    .forEach(cb => (cb.checked = false));
}

function resetDropdownTextInputs() {
  document.querySelectorAll('.drop-down-input input[type="text"]')
    .forEach(input => {
      input.value = "";
      input.removeAttribute("data-placeholder-active");
    });
}

function hideDropdownMenus() {
  document.querySelectorAll('.drop-down-menu')
    .forEach(menu => {
      menu.classList.add('d-none');
      menu.dataset.open = 'false';
    });
}

function clearChipsAndSubtasks() {
  document.getElementById('assigned-chips-container')?.replaceChildren();
  document.querySelector('#subtask-input .list-subtasks')?.replaceChildren();
}

function hideErrorMessages() {
  document.querySelectorAll('.err-msg')
    .forEach(msg => msg.classList.add('hidden'));
}






  
  
