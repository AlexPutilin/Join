/**
 * Checks the validity of all input fields within a form.
 * Adds error styling and messages for invalid inputs.
 * If all inputs are valid, proceeds with form submission logic.
 */
function checkFormValidation() {
    let isValid = true;
    const inputs = document.querySelectorAll('form input');
    inputs.forEach(input => {
        const inputWrapper = input.closest('.input-wrapper');
        if (!input.checkValidity()) {
            addInputError(inputWrapper);
            isValid = false;
        }
    });
    if (isValid) console.log("submit"); // continue with other logic
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
 * Checks whether the email input is valid according to HTML5 validation rules.
 * 
 * @returns {boolean} True if the email input is valid, otherwise false.
 */
function checkEmailValidity() {
    const emailInput = document.querySelector('input[type="email"]');
    return emailInput.checkValidity();
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