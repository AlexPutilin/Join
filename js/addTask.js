/**
 * Stores contact information by their unique IDs.
 * @type {Object.<string, Object>}
 */
const contactsById = {};

/**
 * Initializes the Add Task form when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const addTaskFormRoot = document.getElementById('add-task-root');
  if (!addTaskFormRoot) {
    console.error("#add-task-root not found!");
    return;
  }
  addTaskFormRoot.innerHTML = getAddTaskFormTemplate();
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
 * Sets the default selected priority to "medium".
 */
function setDefaultPriority() {
  const mediumInput = document.querySelector('input[name="priority"][value="medium"]');
  if (!mediumInput) return;
  mediumInput.checked = true;
  const mediumLabel = mediumInput.closest('.priority-option');
  if (mediumLabel) mediumLabel.classList.add('active');
}

/**
 * Enables interaction with the priority selection buttons.
 */
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

/**
 * Renders the category field UI and sets up dropdown close on outside click.
 */
function renderCategoryField() {
  const wrapper = document.getElementById('category-wrapper-template');
  if (!wrapper) return;
  wrapper.innerHTML = getCategoryTemplate();
  renderCategoryOptions();
  setupCloseOnOutsideClick('#category-wrapper-template .input-wrapper',() => {
      const toggleButton = document.querySelector('#category-wrapper-template .input-wrapper button');
      toggleDropDown(toggleButton);
    }
  );
}

/**
 * Renders available category options in the dropdown.
 */
function renderCategoryOptions() {
  const categoryContainer = getAndClearCategoryContainer();
  if (!categoryContainer) return;

  const categories = ['Technical Task', 'User Story'];
  categories.forEach(category => addCategoryOption(categoryContainer, category));
}

/**
 * Retrieves and clears the container for category options.
 * @returns {HTMLElement|null} The container element or null if not found.
 */
function getAndClearCategoryContainer() {
  const container = document.getElementById('category-options-container');
  if (!container) return null;
  container.innerHTML = '';
  return container;
}

/**
 * Adds a category option element to the specified container.
 * @param {HTMLElement} container - The container to append the option to.
 * @param {string} name - The name of the category.
 */
function addCategoryOption(container, name) {
  const option = document.createElement('div');
  option.classList.add('dropdown-single-option');
  option.textContent = name;
  option.onclick = () => selectCategoryOption(option);
  container.appendChild(option);
}

/**
 * Handles selection of a category option.
 * Updates the input value, closes the dropdown, hides error messages,
 * and updates the state of the create button.
 *
 * @param {HTMLElement} optionElement - The selected category option element.
 */
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

/**
 * Validates the category field input.
 * Checks whether the field has a non-empty value and toggles error display accordingly.
 *
 * @returns {boolean} True if valid, false otherwise.
 */
function validateCategoryField() {
  const input = document.getElementById('task-category');
  const wrapper = input?.closest('.input-wrapper');
  const area = wrapper?.querySelector('.input-area');
  const errorMsg = wrapper?.querySelector('.err-msg');

  if (!input || !area || !errorMsg) return true;

  const isValid = !!input.value.trim();
  toggleValidationFeedback(area, errorMsg, isValid);
  return isValid;
}

/**
 * Toggles error display for an input area based on validation result.
 *
 * @param {HTMLElement} area - The element to highlight as invalid.
 * @param {HTMLElement} errorMsg - The element showing the error message.
 * @param {boolean} isValid - Whether the input is valid.
 */
function toggleValidationFeedback(area, errorMsg, isValid) {
  if (isValid) {
    area.classList.remove('invalid-input');
    errorMsg.classList.add('hidden');
  } else {
    area.classList.add('invalid-input');
    errorMsg.classList.remove('hidden');
  }
}

/**
 * Renders the "Assigned To" field by injecting the template,
 * loading contacts, initializing interactions, and setting up outside click handling.
 *
 * @async
 */
async function renderAssignedToField() {
  if (!injectAssignedToTemplate()) return;
  await loadAssignedToContacts();
  initAssignedToInteractions();
  bindAssignedToOutsideClick();
}

/**
 * Injects the "Assigned To" template into the corresponding wrapper element.
 *
 * @returns {boolean} True if the template was successfully injected, false otherwise.
 */
function injectAssignedToTemplate() {
  const wrapper = document.getElementById('assigned-to-wrapper-template');
  if (!wrapper) return false;
  wrapper.innerHTML = getAssignedToTemplate();
  return true;
}

/**
 * Loads contacts data for the "Assigned To" dropdown and renders the list.
 *
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
 * Initializes the interactions for the "Assigned To" section:
 * search input, contact selection, and chip update.
 */
function initAssignedToInteractions() {
  setupAssignedToSearch();
  setupContactSelection();
  updateAssignedToChips();
}

/**
 * Binds event listener to close the "Assigned To" dropdown when clicking outside.
 */
function bindAssignedToOutsideClick() {
  setupCloseOnOutsideClick(
    '#assigned-to-wrapper-template .input-wrapper',
    () => {
      const btn = document.querySelector('#assigned-to-wrapper-template .input-wrapper button');
      toggleDropDown(btn);
    }
  );
}

/**
 * Renders the contact list into the "Assigned To" dropdown.
 * Each contact entry is assigned a color and converted into a selection element.
 *
 * @param {Object.<string, {name: string}>} contactsData - An object mapping contact IDs to contact info.
 */
function renderContacts(contactsData) {
  const dropdown = document.getElementById('contacts-dropdown');
  if (!dropdown) return;
  dropdown.innerHTML = '';

  Object.entries(contactsData).forEach(([id, info]) => {
    contactsById[id] = info;
    contactsById[id].color = getContactBackgroundColor();

    const html = getContactSelectionTemplate({
      initials: getInitials(info.name),
      name: info.name,
      id,
      color: info.color
    });
    dropdown.insertAdjacentHTML('beforeend', html);
  });
}

/**
 * Generates initials from a full name string.
 *
 * @param {string} name - The full name of the contact.
 * @returns {string} The generated initials (max. 2 characters).
 */
function getInitials(name) {
  return (name || '')
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

/**
 * Sets up the search functionality for the "Assigned To" contact dropdown.
 * Filters contact entries in real-time based on the user's input.
 */
function setupAssignedToSearch() {
  const searchInput = document.getElementById('assigned-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();
    const { menu } = getDropdownElements(searchInput);
    const items = Array.from(menu.querySelectorAll('.select-contact'));
    filterItems(items, term);
  });
}

/**
 * Filters contact entries based on a given search term.
 * Shows entries whose first name starts with the search term.
 *
 * @param {HTMLElement[]} contactEntries - Array of contact entry DOM elements.
 * @param {string} searchTerm - The search term to match against first names.
 * @returns {boolean} True if any contact remains visible, false otherwise.
 */
function filterItems(contactEntries, searchTerm) {
  let anyContactVisible = false;

  contactEntries.forEach(contactEntry => {
    const checkboxElement = contactEntry.querySelector('input[type="checkbox"]');
    const contactId = checkboxElement.dataset.contactId;
    const rawName = contactsById[contactId]?.name || '';
    const normalizedFullName = rawName.toLowerCase().trim();
    const filterdFirstName = normalizedFullName.split(' ')[0];
    const nameMatch = filterdFirstName.startsWith(searchTerm);
    contactEntry.style.display = nameMatch ? 'flex' : 'none';
    if (nameMatch) anyContactVisible = true;
  });

  return anyContactVisible;
}


/**
 * Initializes event bindings for each contact entry in the "Assigned To" dropdown.
 */
function setupContactSelection() {
  const entries = Array.from(
    document.querySelectorAll('#contacts-dropdown .select-contact')
  );
  entries.forEach(entry => bindEventsToEntry(entry));
}

/**
 * Closes the "Assigned To" dropdown menu.
 */
function closeAssignedDropdown() {
  const input = document.getElementById('assigned-input');
  const { menu, icons } = getDropdownElements(input);
  closeDropDownMenu(input, menu, icons);
}

/**
 * Handles checkbox state change within a contact entry.
 * Updates selected styling and assigned contact chips.
 * Closes the dropdown if the search input contains text.
 *
 * @param {HTMLElement} entry - The contact entry element.
 */
function handleCheckboxChange(entry) {
  const checkbox = entry.querySelector('input[type="checkbox"]');
  const input = document.getElementById('assigned-input');
  toggleSelectedStyle(entry, checkbox.checked);
  updateAssignedToChips();

  if (input.value.trim() !== "") {
    closeAssignedDropdown();
  }
}

/**
 * Binds click and change event listeners to a contact entry.
 *
 * @param {HTMLElement} entry - The contact entry element.
 */
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

/**
 * Toggles the selected visual style on a contact entry.
 *
 * @param {HTMLElement} entry - The contact entry element.
 * @param {boolean} isSelected - Whether the entry is selected.
 */
function toggleSelectedStyle(entry, isSelected) {
  entry.classList.toggle('selected', isSelected);
}

/**
 * Retrieves dropdown menu and icon elements related to a given input field.
 *
 * @param {HTMLInputElement} input - The input element within a dropdown wrapper.
 * @returns {{menu: HTMLElement, icons: NodeListOf<HTMLElement>}} The associated dropdown menu and icon elements.
 */
function getDropdownElements(input) {
  const wrapper = input.closest('.input-wrapper');
  return {
    menu: wrapper.querySelector('.drop-down-menu'),
    icons: wrapper.querySelectorAll('.icon-wrapper')
  };
}

/**
 * Performs a specified action using the dropdown-related elements.
 *
 * @param {HTMLInputElement} input - The input element within a dropdown wrapper.
 * @param {(input: HTMLInputElement, menu: HTMLElement, icons: NodeListOf<HTMLElement>) => void} action - The function to execute with the dropdown elements.
 */
function performDropdownAction(input, action) {
  const { menu, icons } = getDropdownElements(input);
  action(input, menu, icons);
}

/**
 * Updates the displayed assigned contact chips and stores their IDs.
 */
function updateAssignedToChips() {
  const ids = getCheckedContactIds();
  renderAssignedContactChips(ids);
  storeAssignedContactIds(ids);
}

/**
 * Retrieves the IDs of all checked contacts in the dropdown.
 *
 * @returns {string[]} An array of selected contact IDs.
 */
function getCheckedContactIds() {
  return Array.from(
    document.querySelectorAll(
      '#contacts-dropdown .select-contact .checkbox input[type="checkbox"]:checked'
    )
  ).map(cb => cb.dataset.contactId);
}

/**
 * Renders visual chips for the assigned contacts based on their IDs.
 *
 * @param {string[]} contactIds - The array of selected contact IDs.
 */
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

/**
 * Stores the selected contact IDs in the dataset of the input field.
 *
 * @param {string[]} contactIds - The array of selected contact IDs.
 */
function storeAssignedContactIds(contactIds) {
  const input = document.getElementById('assigned-input');
  if (!input) return;
  input.value = '';
  input.dataset.value = contactIds.join(',');
}

/**
 * Creates a visual chip element for a contact.
 *
 * @param {string} initials - The initials to display on the chip.
 * @param {string} bgColor - The background color of the chip.
 * @returns {HTMLDivElement} The created chip element.
 */
function createContactChip(initials, bgColor) {
  const chip = document.createElement('div');
  chip.classList.add('assigned-chip');
  chip.textContent = initials;
  chip.style.backgroundColor = bgColor;
  chip.style.color = '#fff';
  return chip;
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
 * Renders the input field for adding subtasks by injecting the corresponding template.
 */
function renderSubtaskInput() {
  const subtaskWrapper = document.getElementById('subtask-wrapper-template');
  if (!subtaskWrapper) return;
  subtaskWrapper.innerHTML = getSubtaskInputTemplate();
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
  });

  return subtasks;
}

/**
 * Validates the Add Task form before submission.
 * Checks if required fields are filled.
 *
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateFormBeforeSubmit() {
  const isTitleValid = !!document.getElementById('task-title')?.value.trim();
  const isDateValid = !!document.getElementById('due-date')?.value.trim();
  const isCategoryValid = validateCategoryField(); // schon vorhanden

  return isTitleValid && isDateValid && isCategoryValid;
}


/**
 * Retrieves all DOM elements representing individual subtasks.
 *
 * @returns {NodeListOf<HTMLElement>} A list of subtask container elements.
 */
function getAllSubtaskElements() {
  const listContainer = document.querySelector('#subtask-input .list-subtasks');
  return listContainer.querySelectorAll('.subtask-item-container');
}

/**
 * Extracts and cleans the title of a subtask from its DOM container.
 *
 * @param {HTMLElement} container - The subtask container element.
 * @returns {string|null} The subtask title, or null if not found.
 */
function extractSubtaskTitle(container) {
  const textSpan = container.querySelector('.subtask-name');
  if (!textSpan) return null;
  const raw = textSpan.textContent.trim();
  return raw.startsWith('•')
    ? raw.slice(1).trim()
    : raw;
}

/**
 * Creates a subtask object with a given title.
 *
 * @param {string} title - The title of the subtask.
 * @returns {{title: string, done: boolean}} A subtask object.
 */
function createSubtaskObject(title) {
  return { title: title, done: false };
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
 * Sets up an event listener that closes a dropdown when clicking outside of it.
 *
 * @param {string} wrapperSelector - CSS selector for the wrapper element.
 * @param {Function} closeFn - Callback function to close the dropdown.
 */
function setupCloseOnOutsideClick(wrapperSelector, closeFn) {
  document.addEventListener('click', event => {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;
    const dropdown = wrapper.querySelector('.drop-down-menu');
    const isOpen = dropdown?.dataset.open === 'true';
    if (isOpen && !event.target.closest(wrapperSelector)) {
      closeFn();
    }
  });
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
 * Hides all open dropdown menus and marks them as closed.
 */
function hideDropdownMenus() {
  document.querySelectorAll('.drop-down-menu')
    .forEach(menu => {
      menu.classList.add('d-none');
      menu.dataset.open = 'false';
    });
}

/**
 * Removes all assigned contact chips and subtask list items from the DOM.
 */
function clearChipsAndSubtasks() {
  document.getElementById('assigned-chips-container')?.replaceChildren();
  document.querySelector('#subtask-input .list-subtasks')?.replaceChildren();
}


/**
 * Hides all visible error messages and removes error highlighting from inputs.
 */
function hideErrorMessages() {
  document.querySelectorAll('.err-msg')
    .forEach(msg => {
      msg.classList.add('hidden');
    });
  document.querySelectorAll('.input-area.invalid-input')
    .forEach(area => {
      area.classList.remove('invalid-input');
    });
}

  
