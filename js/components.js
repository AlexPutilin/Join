function toggleInputError() {
    const errorMessages = document.querySelectorAll('.err-msg');
    const inputAreas = document.querySelectorAll('.input-area');
    for (let i = 0; i < inputAreas.length; i++) {
        errorMessages[i].classList.toggle('hidden');
        inputAreas[i].classList.toggle('invalid-input');
    }
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