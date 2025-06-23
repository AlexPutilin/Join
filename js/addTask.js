const contactsById = {};


document.addEventListener("DOMContentLoaded", () => {
  const addTaskFormRoot = document.getElementById('add-task-root');
  if (!addTaskFormRoot) {
    console.error("#add-task-root not found!");
    return;
  }
  addTaskFormRoot.innerHTML = getAddTaskFormTemplate();
  initializeAddTaskPage();
});


function initializeAddTaskPage() {
  renderCategoryField();
  renderAssignedToField();
  renderPriorityButtons();
  renderSubtaskInput();
  updateCreateButtonState();
  setupCreateButtonListeners();
}


function setupCreateButtonListeners() {
  const titleInput   = document.getElementById('task-title');
  const dueDateInput = document.getElementById('due-date');

  if (titleInput) {
    titleInput.addEventListener('input', updateCreateButtonState);
  }
  if (dueDateInput) {
    dueDateInput.addEventListener('input', updateCreateButtonState);
  }
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


// Rendern des Category Fields & Options + Click Outside Close

function renderCategoryField() {
  const wrapper = document.getElementById('category-wrapper-template');
  if (!wrapper) return;
  wrapper.innerHTML = getCategoryTemplate();
  renderCategoryOptions();
  setupCloseOnOutsideClick(
    '#category-wrapper-template .input-wrapper',
    () => {
      const toggleButton = document
        .querySelector('#category-wrapper-template .input-wrapper button');
      toggleDropDown(toggleButton);
    }
  );
}


function renderCategoryOptions() {
  const categoryContainer = getAndClearCategoryContainer();
  if (!categoryContainer) return;

  const categories = ['Technical Task', 'User Story'];
  categories.forEach(category => addCategoryOption(categoryContainer, category));
}


// Holt das Container-Element für die Kategorie-Optionen - leert seinen Inhalt und gibt es zurück.

function getAndClearCategoryContainer() {
  const container = document.getElementById('category-options-container');
  if (!container) return null;
  container.innerHTML = '';
  return container;
}

// Category Auswahlmöglichkeiten

function addCategoryOption(container, name) {
  const option = document.createElement('div');
  option.classList.add('dropdown-single-option');
  option.textContent = name;
  option.onclick = () => selectCategoryOption(option);
  container.appendChild(option);
}

// Wird aufgerufen, wenn eine Kategorie-Option angeklickt wird: Schreibt den ausgewählten Namen in das Eingabefeld, schließt das Dropdown per toggleDropDown, blendet die etwaige Fehlermeldung aus.

function selectCategoryOption(optionElement) {
  const selectedValue = optionElement.innerText;
  const categoryInput = document.getElementById('task-category');
  if (!categoryInput) return;

  categoryInput.value = selectedValue;
  const toggleBtn = categoryInput
    .closest('.input-wrapper')
    .querySelector('button');
  toggleDropDown(toggleBtn);

  document.querySelector('#category-wrapper-template .err-msg')
    ?.classList.add('hidden');

  updateCreateButtonState();
}


function validateCategoryField() {
  const input    = document.getElementById('task-category');
  const wrapper  = input?.closest('.input-wrapper');
  const area     = wrapper?.querySelector('.input-area');
  const errorMsg = wrapper?.querySelector('.err-msg');
  
  if (!input || !area || !errorMsg) return true;

  if (!input.value.trim()) {
    area.classList.add('invalid-input');
    errorMsg.classList.remove('hidden');
    return false;
  } else {
    area.classList.remove('invalid-input');
    errorMsg.classList.add('hidden');
    return true;
  }
}


// Rendern Assigned to: Feld

async function renderAssignedToField() {
  if (!injectAssignedToTemplate()) return;
  await loadAssignedToContacts();
  initAssignedToInteractions();
  bindAssignedToOutsideClick();
}


function injectAssignedToTemplate() {
  const wrapper = document.getElementById('assigned-to-wrapper-template');
  if (!wrapper) return false;
  wrapper.innerHTML = getAssignedToTemplate();
  return true;
}


async function loadAssignedToContacts() {
  contactColorIndex = 0;
  const contacts = await getData('/contacts');
  if (contacts) {
    renderContacts(contacts);
  }
}

function initAssignedToInteractions() {
  setupAssignedToSearch();
  setupContactSelection();
  updateAssignedToChips();
}


function bindAssignedToOutsideClick() {
  setupCloseOnOutsideClick(
    '#assigned-to-wrapper-template .input-wrapper',
    () => {
      const btn = document
        .querySelector('#assigned-to-wrapper-template .input-wrapper button');
      toggleDropDown(btn);
    }
  );
}




// Liste der Contacts - Assigned To 


function renderContacts(contactsData) {
  const dropdown = document.getElementById('contacts-dropdown');
  if (!dropdown) return;
  dropdown.innerHTML = '';

  Object.entries(contactsData).forEach(([id, info]) => {
    contactsById[id] = info;
    contactsById[id].color = getContactBackgroundColor();

    const html = getContactSelectionTemplate({
      initials: getInitials(info.name),
      name:      info.name,
      id,
      color:     info.color  
    });
    dropdown.insertAdjacentHTML('beforeend', html);
  });
}



function getInitials(name) {
  return (name || '')
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

// Such Logik - Assigned To 

function setupAssignedToSearch() {
  const searchInput = document.getElementById('assigned-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const term     = searchInput.value.toLowerCase().trim();
    const { menu } = getDropdownElements(searchInput);
    const items    = Array.from(menu.querySelectorAll('.select-contact'));

    filterItems(items, term);
  });
}



function filterItems(contactEntries, searchTerm) {
  let anyContactVisible = false;

  contactEntries.forEach(contactEntry => {
    const checkboxElement = contactEntry.querySelector('input[type="checkbox"]');
    const contactId       = checkboxElement.dataset.contactId;
    const rawName             = contactsById[contactId]?.name || '';
    const normalizedFullName  = rawName.toLowerCase().trim();
    const filterdFirstName  = normalizedFullName.split(' ')[0];
    const nameMatch       = filterdFirstName.startsWith(searchTerm);
    contactEntry.style.display = nameMatch ? 'flex' : 'none';
    if (nameMatch) anyContactVisible = true;
  });

  return anyContactVisible;
}


// Selected Contact Logik - Assigned To 

function setupContactSelection() {
  const entries = Array.from(
    document.querySelectorAll('#contacts-dropdown .select-contact')
  );
  entries.forEach(entry => bindEventsToEntry(entry));
}


function closeAssignedDropdown() {
  const input = document.getElementById('assigned-input');
  const { menu, icons } = getDropdownElements(input);
  closeDropDownMenu(input, menu, icons);
}


function handleCheckboxChange(entry) {
  const checkbox = entry.querySelector('input[type="checkbox"]');
  const input     = document.getElementById('assigned-input');

  toggleSelectedStyle(entry, checkbox.checked);
  updateAssignedToChips();

  if (input.value.trim() !== "") {
    closeAssignedDropdown();
  }
}

function bindEventsToEntry(entry) {
  const checkbox = entry.querySelector('input[type="checkbox"]');

  checkbox.addEventListener('change', () => {
    handleCheckboxChange(entry);
  });

  entry.addEventListener('click', event => {
    const target = event.target;
    if (target === checkbox || target.closest('label.checkbox')) return;
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
  });
}


function toggleSelectedStyle(entry, isSelected) {
  entry.classList.toggle('selected', isSelected);
}

// DropDown Aktionen - Assigned To 


function getDropdownElements(input) {
  const wrapper = input.closest('.input-wrapper');
  return {
    menu:  wrapper.querySelector('.drop-down-menu'),
    icons: wrapper.querySelectorAll('.icon-wrapper')
  };
}


function performDropdownAction(input, action) {
  const { menu, icons } = getDropdownElements(input);
  action(input, menu, icons);
}

// Initial Chips und Storage - Assigned To 


function updateAssignedToChips() {
  const ids = getCheckedContactIds();
  renderAssignedContactChips(ids);
  storeAssignedContactIds(ids);
}


function getCheckedContactIds() {
  return Array.from(
    document.querySelectorAll(
      '#contacts-dropdown .select-contact .checkbox input[type="checkbox"]:checked'
    )
  ).map(cb => cb.dataset.contactId);
}

function renderAssignedContactChips(contactIds) {
  const container = document.getElementById('assigned-chips-container');
  container.innerHTML = '';

  contactIds.forEach(id => {
    const info = contactsById[id];
    if (!info) return;
    const chip = createContactChip(getInitials(info.name), info.color);
    container.appendChild(chip);
  });
}


function storeAssignedContactIds(contactIds) {
  const input = document.getElementById('assigned-input');
  if (!input) return;
  input.value         = '';
  input.dataset.value = contactIds.join(',');
}


function createContactChip(initials, bgColor) {
  const chip = document.createElement('div');
  chip.classList.add('assigned-chip');
  chip.textContent = initials;
  chip.style.backgroundColor = bgColor;
  chip.style.color = '#fff';
  return chip;
}

function mapContactIdsToNames(contactIds) {
  return contactIds
    .map(id => contactsById[id]?.name)
    .filter(Boolean)
    .join(', ');
}

// Subtasks 

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
  const raw = textSpan.textContent.trim();
  return raw.startsWith('•')
    ? raw.slice(1).trim()
    : raw;
}



function createSubtaskObject(title) {
  return { title: title, done: false };
}


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



async function addTask() {
  const isFormValid     = checkFormValidation('#add-task-form');
  const isCategoryValid = validateCategoryField();

  if (!isFormValid || !isCategoryValid) {
    console.warn("addTask: Validation failed. formValid=", isFormValid, "categoryValid=", isCategoryValid);
    return;
  }

  const taskData = prepareTaskData();
  try {
    await saveTaskToFirebase(taskData);
    console.info("addTask: Task successfully saved.");
    clearAddTaskForm();
    showAddTaskNotification();
  } catch (error) {
    handleTaskSaveError(error);
  }
}


// Hilfsfunktionen

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



function handleTaskSaveError(error) {
  console.error("addTask: Failed to save task to Firebase:", error);
  alert("Failed to create task: " + error.message);
}


function setupCloseOnOutsideClick(wrapperSelector, closeFn) {
  document.addEventListener('click', event => {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;

    const dropdown = wrapper.querySelector('.drop-down-menu');
    const isOpen   = dropdown?.dataset.open === 'true';

    if (isOpen && !event.target.closest(wrapperSelector)) {
      closeFn();
    }
  });
}

function updateCreateButtonState() {
  const titleValue    = document.getElementById('task-title')?.value.trim();
  const dueDateValue  = document.getElementById('due-date')?.value.trim();
  const categoryValue = document.getElementById('task-category')?.value.trim();
  const createButton  = document.getElementById('create-task-btn');

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

  document.querySelectorAll('.input-area.invalid-input')
    .forEach(area => area.classList.remove('invalid-input'));
}






  
  
