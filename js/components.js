const randomColors = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
    '#FF4646',
    '#FFBB2B',
]


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
    console.log(data);
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







// BEISPIELE / NACHHER LÖSCHEN
function onLogin() {
    const form = '#login-form'
    if (checkFormValidation(form)) {
        const loginData = getInputData(form);
        fetchData(loginData);
        openPage('./html/summary');
    }
}


function createNewContact() {
    if (checkFormValidation('#contact-form')) {
        const data = getFormInput();
        pushData('contacts', data);
        closeContactsForm();
    }
}