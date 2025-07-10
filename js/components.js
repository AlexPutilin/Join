/**
 * Validates all input fields within the specified form selector.
 * Adds error styling and messages for any invalid inputs.
 *
 * @param {string} form - A selector string targeting the form to validate.
 * @returns {boolean} Returns true if all inputs are valid, otherwise false.
 */
function checkFormValidation(form) {
    let isValid = true;
    const inputs = document.querySelectorAll(`${form} input`);
    inputs.forEach(input => {
        const inputWrapper = input.closest('.input-wrapper');
        if (!input.checkValidity()) {
            addInputError(inputWrapper);
            isValid = false;
        }
    });
    return isValid;
}

/**
 * Adds error styling to an input field and displays its associated error message.
 *
 * @param {HTMLElement} inputWrapper - The parent wrapper element containing the input and error message.
 */
function addInputError(inputWrapper) {
    const errorMessage = inputWrapper.querySelector('.err-msg');
    const inputArea = inputWrapper.querySelector('.input-area');
    inputArea.classList.add('invalid-input');
    errorMessage.classList.remove('hidden');
}


/**
 * Resets the validation-error from the focused textfield on input-change.
 */
function resetInputError() {
    const activeInput = document.querySelector('input:focus');
    const inputArea = activeInput.closest('.input-area');
    const errorMessage = activeInput.closest('.input-wrapper').querySelector('.err-msg');
    inputArea.classList.remove('invalid-input');
    errorMessage.classList.add('hidden');
}


/**
 * Toggles the input-type between password and text to hide and show the password.
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password-input');
    const visibilityButton = document.getElementById('visibility-btn');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    visibilityButton.classList.toggle('btn-active');    
}


// function getInput(element) {
//     const inputWrapper = element.closest('.input-wrapper');
//     const input = inputWrapper.querySelector('input');
//     return input;
// }


function toggleInputBtns(input) {
    const subtaskInputField = document.getElementById('subtask-input');
    // const inputWrapper = input.closest('.input-wrapper');
    const defaultButton = subtaskInputField.querySelector('.btn-small');
    const btnCollection = subtaskInputField.querySelector('.btn-collection-container');
    if (input.value !== "") {
        defaultButton.classList.add('d-none');
        btnCollection.classList.remove('d-none');
    } else {
        btnCollection.classList.add('d-none');
        defaultButton.classList.remove('d-none');
    }
}


function addSubtask() {
    const subtaskInputField = document.getElementById('subtask-input');
    // const inputWrapper = triggerElement.closest('.input-wrapper');
    const input = subtaskInputField.querySelector('input');
    const subtaskList = subtaskInputField.querySelector('.list-subtasks');
    subtaskList.innerHTML += getSubtaskTemplate(input.value);
    resetSubtaskInput();
}


function resetSubtaskInput() {
    const subtaskInputField = document.getElementById('subtask-input');
    // const inputWrapper = triggerElement.closest('.input-wrapper');
    const input = subtaskInputField.querySelector('input');
    input.value = "";
    toggleInputBtns(input);
}


function setInputFocus(triggerElement) {
    const inputWrapper = triggerElement.closest('.input-wrapper');
    const input = inputWrapper.querySelector('input');
    input.focus();
}


function openSubtaskEditMenu(triggerElement) {
    resetSubtaskInput();
    closeAllSubtaskEdits();
    const subtaskContainer = triggerElement.closest('.subtask-item-container');
    const subtaskItem = subtaskContainer.querySelector('.subtask-item');
    const subtaskEditMenu = subtaskContainer.querySelector('.subtask-item-editmenu');
    const subtaskValue = subtaskItem.querySelector('.subtask-name').innerText;
    const editInput = subtaskEditMenu.querySelector('input');
    subtaskItem.classList.add('d-none');
    subtaskEditMenu.classList.remove('d-none');
    editInput.value = subtaskValue.slice(1).trim();
    editInput.focus();
}


function deleteSubtaskItem(triggerElement) {
    resetSubtaskInput();
    closeAllSubtaskEdits();
    const subtaskContainer = triggerElement.closest('.subtask-item-container');
    subtaskContainer.remove();
}


// function closeSubtaskEditMenu(triggerElement) {
//     const subtaskContainer = triggerElement.closest('.subtask-item-container');
//     const subtaskItem = subtaskContainer.querySelector('.subtask-item');
//     const subtaskEditMenu = subtaskContainer.querySelector('.subtask-item-editmenu');
//     subtaskEditMenu.classList.add('d-none');
//     subtaskItem.classList.remove('d-none');
// }


function commitEditSubtask(triggerElement) {
    const subtaskContainer = triggerElement.closest('.subtask-item-container');
    const subtaskItem = subtaskContainer.querySelector('.subtask-item');
    const subtaskEditMenu = subtaskContainer.querySelector('.subtask-item-editmenu');
    const subtaskValue = subtaskItem.querySelector('.subtask-name')
    const inputValue = subtaskEditMenu.querySelector('input').value;
    subtaskValue.innerText = "• " + inputValue;
    closeAllSubtaskEdits();
}


function closeAllSubtaskEdits() {
    const subtaskContainers = document.querySelectorAll('.subtask-item-container');
    subtaskContainers.forEach(item => {
        const subtaskItem = item.querySelector('.subtask-item');
        const subtaskEditMenu = item.querySelector('.subtask-item-editmenu');
        subtaskEditMenu.classList.add('d-none');
        subtaskItem.classList.remove('d-none');
    });
}


/**
 * Toggles the visibility of the drop-down menu.
 * @param {HTMLElement} triggerElement - The element that triggered the toggle.
 */
function toggleDropDown(triggerElement) {
    const inputWrapper = triggerElement.closest('.input-wrapper')
    const input = inputWrapper.querySelector('input');
    const menu = inputWrapper.querySelector('.drop-down-menu');
    const icons = inputWrapper.querySelectorAll('.icon-wrapper');
    if (menu.dataset.open === 'false') {
        openDropDownMenu(input, menu, icons);
        menu.dataset.open = 'true';
    } else {
        closeDropDownMenu(input, menu, icons);
        menu.dataset.open = 'false';
    }
}


/**
 * Opens the drop-down menu and updates UI elements accordingly.
 * @param {HTMLInputElement} input - The input element within the wrapper.
 * @param {HTMLElement} menu - The drop-down menu element to show.
 * @param {NodeListOf<HTMLElement>} icons - The icon elements to toggle visibility.
 */
function openDropDownMenu(input, menu, icons) {
    menu.classList.remove('d-none');
    icons[0].classList.toggle('d-none');
    icons[1].classList.toggle('d-none');
    input.style.cursor = "text"
    input.placeholder = input.dataset.placeholderActive;
    input.focus();
}


/**
 * Closes the drop-down menu and resets UI elements.
 * @param {HTMLInputElement} input - The input element within the wrapper.
 * @param {HTMLElement} menu - The drop-down menu element to hide.
 * @param {NodeListOf<HTMLElement>} icons - The icon elements to toggle visibility.
 */
function closeDropDownMenu(input, menu, icons) {
    menu.classList.add('d-none');
    icons[0].classList.toggle('d-none');
    icons[1].classList.toggle('d-none');
    input.style.cursor = "pointer"
    input.placeholder = input.dataset.placeholder;
}


/**
 * Collects and returns form input data from a specified form.
 * Supports text, textarea, checkbox, and radio inputs.
 *
 * @param {string} form - A CSS selector string for the form container.
 * @returns {Object} An object containing the input data, where keys are input names and values are their corresponding values.
 */
function getInputData(form) {
    const inputs = document.querySelectorAll(`${form} input, textarea`);
    let data = {};
    inputs.forEach(input => {
        const key = input.name;
        const type = input.type;
        if (!key) return;
        switch (type) {
            case 'checkbox':
                storeCheckboxInput(input, data);
                break;
            case 'radio':
                storeRadioInput(input, data);
                break;
            default:
                storeTextInput(input, data);
        }
    });
    return data; 
}


/**
 * Stores the value of a checked checkbox input into the data object.
 * If multiple checkboxes share the same name, their values are grouped in an array.
 *
 * @param {HTMLInputElement} input - The checkbox input element.
 * @param {Object} data - The object where the input value will be stored.
 */
function storeCheckboxInput(input, data) {
    if (input.checked) {
        if (!data[input.name]) {
            data[input.name] = [];
        }
        data[input.name].push(input.value);
    };
}


/**
 * Stores the value of a checked radio input into the data object.
 * Only the selected radio button's value is stored.
 *
 * @param {HTMLInputElement} input - The radio input element.
 * @param {Object} data - The object where the input value will be stored.
 */
function storeRadioInput(input, data) {
    if (input.checked) {
        data[input.name] = input.value;
    };
}


/**
 * Stores the value of a text-based input or textarea into the data object.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} input - The text, email, password, or textarea input element.
 * @param {Object} data - The object where the input value will be stored.
 */
function storeTextInput(input, data) {
    data[input.name] = input.value;
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
 * Hides all visible error messages and removes error highlighting from inputs.
 */
function hideErrorMessages() {
    document.querySelectorAll('.err-msg')
      .forEach(msg => {msg.classList.add('hidden');
      });
    document.querySelectorAll('.input-area.invalid-input')
      .forEach(area => {area.classList.remove('invalid-input');
      });
  }

  /**
 * Adds a click event listener to the category input area to toggle
 * the dropdown menu visibility.
 *
 * The dropdown opens when clicking anywhere inside the `.input-area`
 * except directly on the toggle button. This improves usability, especially on mobile devices.
 *
 * The function ensures:
 * - Dropdown toggle is triggered by area clicks
 * - Robust selection of the button inside the input wrapper
 */
function FullAreaCategoryDropdownClick() {
    const categoryArea = document.querySelector('#category-wrapper-template .input-area');
    if (!categoryArea) return;
  
    categoryArea.addEventListener('click', (event) => {
      if (!event.target.closest('button')) {
        const button = categoryArea.querySelector('button');
        if (button) toggleDropDown(button);
      }
    });
  }

  /**
 * Sets up an event listener that closes a dropdown when clicking outside of it.
 *
 * @param {string} wrapperSelector - CSS selector for the wrapper element.
 * @param {Function} onClose - Callback invoked to close the dropdown menu.
 */
function setupCloseOnOutsideClick(wrapperSelector, onClose) {
    document.addEventListener('click', event => {
      const wrapper = document.querySelector(wrapperSelector);
      if (!wrapper) return;
      const dropdown = wrapper.querySelector('.drop-down-menu');
      const isOpen = dropdown?.dataset.open === 'true';
      if (isOpen && !event.target.closest(wrapperSelector)) {
        onClose();
      }
    });
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
    const btn = document.querySelector('#assigned-to-wrapper-template .input-wrapper button');
    toggleDropDown(btn);
    resetAssignedSearchAndContacts();
  }
  
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
* Sets up the search functionality for the "Assigned To" contact dropdown.
* Filters contact entries in real-time based on the user's input.
*/
function setupAssignedToSearch() {
  const searchInput = document.getElementById('assigned-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();

    const wrapper = searchInput.closest('.input-wrapper');
    const dropdown = wrapper.querySelector('.drop-down-menu');
    if (dropdown && dropdown.dataset.open !== 'true') {
      toggleDropDown(wrapper.querySelector('button'));
    }

    const { menu } = getDropdownElements(searchInput);
    const items = Array.from(menu.querySelectorAll('.select-contact'));
    filterItems(items, term);
  });
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
 * Resets the "Assigned To" search input and restores all contact visibility.
 */
function resetAssignedSearchAndContacts() {
  const input = document.querySelector('#assigned-to-wrapper-template .input-area input[type="text"]');
  if (input) input.value = '';

  const allContacts = document.querySelectorAll('#contacts-dropdown .select-contact');
  allContacts.forEach(contact => {
    contact.style.display = 'flex';
  });
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
  setupCloseOnOutsideClick('#assigned-to-wrapper-template .input-wrapper', () => {
      const btn = document.querySelector('#assigned-to-wrapper-template .input-wrapper button');
      toggleDropDown(btn);
  });
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
      initials: getContactInitials(info.name),
      name: info.name,
      id,
      color: info.color
    });
    dropdown.insertAdjacentHTML('beforeend', html);
  });
}

/**
 * Initializes event bindings for each contact entry in the "Assigned To" dropdown.
 */
function setupContactSelection() {
  const entries = Array.from(document.querySelectorAll('#contacts-dropdown .select-contact'));
  entries.forEach(entry => bindEventsToEntry(entry));
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
  const isCategoryValid = validateCategoryField(); 

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
  return raw.startsWith('•') ? raw.slice(1).trim() : raw;
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
  