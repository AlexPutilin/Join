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
        const hasValue = input.value.trim().length > 0;
        const mustValidate = input.required || hasValue;
        if (mustValidate && (!isStandardValid(input) || !isCustomValid(input))) {
            addInputError(inputWrapper);
            isValid = false;
        }
    });
    return isValid;
}


/**
 * Performs native HTML5 validation on the given input element.
 *
 * @param {HTMLInputElement} input - The input element to validate.
 * @returns {boolean} - True if the input passes built-in browser validation.
 */
function isStandardValid(input) {
    return input.checkValidity();
}


/**
 * Performs additional custom validation rules for specific input types.
 * - text: must not start with a space
 * - email: must match a stricter email pattern (e.g. user@example.com)
 * - tel: allows digits only, optionally starting with '+' and single spaces
 *
 * @param {HTMLInputElement} input - The input element to validate.
 * @returns {boolean} - True if the input passes all custom validation rules.
 */
function isCustomValid(input) {
    const value = input.value.trim();
    if (input.type === 'text') return !/^\s/.test(input.value);
    if (input.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (input.type === 'tel') return /^\+?\d+( \d+)*$/.test(value);
    return true;
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

/**
 * Toggles subtask input buttons between default add and confirm/cancel.
 * @function toggleInputBtns
 * @param {HTMLInputElement} input - The subtask input element.
 * @returns {void}
 */
function toggleInputBtns(input) {
    const subtaskInputField = document.getElementById('subtask-input');
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

/**
 * Adds an Enter key listener to the subtask input to submit on Enter.
 * @function enterListenerSubtask
 * @returns {void}
 */
function enterListenerSubtask(){
  const subtaskInput = document.getElementById('subtask-input').querySelector('input');
  subtaskInput.addEventListener('keydown', (enterEvent) => {
    if (enterEvent.key === 'Enter') {
      enterEvent.preventDefault();
      addSubtask();
    }
  });
}

/**
 * Reads the subtask input, appends a new subtask item, and resets the input.
 * @function addSubtask
 * @returns {void}
 */
function addSubtask() {
    const subtaskInputField = document.getElementById('subtask-input');
    const input = subtaskInputField.querySelector('input');
    const subtaskList = subtaskInputField.querySelector('.list-subtasks');
    const value = input.value.trim();
    if(!value){
      return;
    } 
    subtaskList.innerHTML += getSubtaskTemplate(input.value);
    resetSubtaskInput();
}

/**
 * Clears the subtask input field and resets its buttons.
 * @function resetSubtaskInput
 * @returns {void}
 */
function resetSubtaskInput() {
    const subtaskInputField = document.getElementById('subtask-input');
    const input = subtaskInputField.querySelector('input');
    input.value = "";
    toggleInputBtns(input);
}

/**
 * Focuses the subtask input field when its add button is clicked.
 * @function setInputFocus
 * @param {HTMLElement} triggerElement - The button triggering focus.
 * @returns {void}
 */
function setInputFocus(triggerElement) {
    const inputWrapper = triggerElement.closest('.input-wrapper');
    const input = inputWrapper.querySelector('input');
    input.focus();
}

/**
 * Opens the edit UI for a single subtask item.
 * @function openSubtaskEditMenu
 * @param {HTMLElement} triggerElement - The edit button element.
 * @returns {void}
 */
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

/**
 * Removes a subtask item from the list.
 * @function deleteSubtaskItem
 * @param {HTMLElement} triggerElement - The delete button element.
 * @returns {void}
 */
function deleteSubtaskItem(triggerElement) {
    resetSubtaskInput();
    closeAllSubtaskEdits();
    const subtaskContainer = triggerElement.closest('.subtask-item-container');
    subtaskContainer.remove();
}

/**
 * Commits edits from the subtask edit UI back to the display.
 * @function commitEditSubtask
 * @param {HTMLElement} triggerElement - The confirm button element.
 * @returns {void}
 */
function commitEditSubtask(triggerElement) {
    const subtaskContainer = triggerElement.closest('.subtask-item-container');
    const subtaskItem = subtaskContainer.querySelector('.subtask-item');
    const subtaskEditMenu = subtaskContainer.querySelector('.subtask-item-editmenu');
    const subtaskValue = subtaskItem.querySelector('.subtask-name')
    const inputValue = subtaskEditMenu.querySelector('input').value;
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
        subtaskContainer.remove();
        return;
    }
    subtaskValue.innerText = "• " + inputValue;
    closeAllSubtaskEdits();
}

/**
 * Closes any open subtask edit menus and shows the static items.
 * @function closeAllSubtaskEdits
 * @returns {void}
 */
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
 * @function createContactChip
 * @param {string} initials - The contact’s initials to display.
 * @param {string} bgColor - Background color for the chip.
 * @returns {HTMLDivElement} The styled chip element.
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
 * Filters a list of contact entries by matching first name prefix.
 * @function filterItems
 * @param {HTMLElement[]} contactEntries - Array of contact entry elements.
 * @param {string} searchTerm - Lower‑cased search prefix.
 * @returns {boolean} True if at least one entry matches.
 */
  function filterItems(contactEntries, searchTerm) {
    let anyVisible = false;
  
    contactEntries.forEach(entry => {
      const checkbox = entry.querySelector('input[type="checkbox"]');
      const contactId = checkbox.dataset.contactId;
      const contact = contacts.find(c => String(c.id) === String(contactId));
      const rawName = contact?.name?.toLowerCase().trim() || '';
      const firstName = rawName.split(' ')[0];
      const matches = firstName.startsWith(searchTerm);
  
      entry.style.display = matches ? 'flex' : 'none';
      if (matches) anyVisible = true;
    });
  
    return anyVisible;
  }

/**
 * Retrieves dropdown menu and icon elements associated with an input.
 * @function getDropdownElements
 * @param {HTMLInputElement} input - The dropdown’s input element.
 * @returns {{menu: HTMLElement, icons: NodeListOf<HTMLElement>}}
 *   The menu container and its icon wrappers.
 */
function getDropdownElements(input) {
  const wrapper = input.closest('.input-wrapper');
  return {
    menu: wrapper.querySelector('.drop-down-menu'),
    icons: wrapper.querySelectorAll('.icon-wrapper')
  };
}

/**
 * Sets up live‑search behavior on the Assigned To input:
 * - Opens dropdown on first input.
 * - Filters entries by search term.
 *
 * @function setupAssignedToSearch
 * @returns {void}
 */
function setupAssignedToSearch() {
  const searchInput = document.getElementById('assigned-input');
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();
    const wrapper = searchInput.closest('.input-wrapper');
    const dropdown = wrapper.querySelector('.drop-down-menu');
    if (dropdown && dropdown.dataset.open !== 'true') {
      const btn = wrapper.querySelector('button');
      toggleDropDown(btn);
    }
    const entries = Array.from(wrapper.querySelectorAll('.select-contact'));
    filterItems(entries, term);
  });
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
  