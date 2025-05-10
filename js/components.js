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


/**
 * Returns the currently selected priority value from the radio inputs.
 *
 * @returns {string|null} The value of the selected radio button ("low", "medium", "urgent"), or null if none is selected.
 */
function getSelectedPriority() {
    const priority = document.querySelector('input[name="priority"]:checked');
    return priority ? priority.value : null;
}


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


function openDropDownMenu(input, menu, icons) {
    menu.classList.remove('d-none');
    icons[0].classList.toggle('d-none');
    icons[1].classList.toggle('d-none');
    input.style.cursor = "text"
    input.placeholder = input.dataset.placeholderActive;
    input.focus();
}


function closeDropDownMenu(input, menu, icons) {
    menu.classList.add('d-none');
    icons[0].classList.toggle('d-none');
    icons[1].classList.toggle('d-none');
    input.style.cursor = "pointer"
    input.placeholder = input.dataset.placeholder;
}


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

function storeCheckboxInput(input, data) {
    if (input.checked) {
        if (!data[input.name]) {
            data[input.name] = [];
        }
        data[input.name].push(input.value);
    };
}

function storeRadioInput(input, data) {
    if (input.checked) {
        data[input.name] = input.value;
    };
}

function storeTextInput(input, data) {
    data[input.name] = input.value;
}


// BEISPIELE / NACHHER LÖSCHEN
function onLogin() {
    const form = '#login-form'
    if (checkFormValidation(form)) {
        const loginData = getInputData(form);
        fetchData('summary');
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