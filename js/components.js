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
    const dropDownMenu = inputWrapper.querySelector('.drop-down-menu');
    dropDownMenu.classList.toggle('d-none');
}


function openDropDown(triggerElement) {
    const input = triggerElement.querySelector('input');
    const dropDownMenu = triggerElement.querySelector('.drop-down-menu');
    input.placeholder = "";
    dropDownMenu.classList.remove('d-none');
}


function closeDropDown() {

}



// BEISPIELE / NACHHER LÖSCHEN
function onLogin() {
    if (checkFormValidation('#login-form')) {
        getFormInput()
        fetchData('summary');
        openPage('./html/summary');
    }
}

function createNewContact() {
    if (checkFormValidation('#contact-form')) {
        
        pushData('contacts');
        closeContactsForm();
    }
}