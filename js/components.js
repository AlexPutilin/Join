function addInputError() {
    const errorMessages = document.querySelectorAll('.err-msg');
    const inputAreas = document.querySelectorAll('.input-area');
    for (let i = 0; i < inputAreas.length; i++) {
        errorMessages[i].classList.remove('hidden');
        inputAreas[i].classList.add('invalid-input');
    }
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
 * Returns the currently selected priority value from the radio inputs.
 *
 * @returns {string|null} The value of the selected radio button ("low", "medium", "urgent"), or null if none is selected.
 */
function getSelectedPriority() {
    const priority = document.querySelector('input[name="priority"]:checked');
    return priority ? priority.value : null;
}