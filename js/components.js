function toggleInputError() {
    const errorMessages = document.querySelectorAll('.err-msg');
    const inputAreas = document.querySelectorAll('.input-area');
    for (let i = 0; i < inputAreas.length; i++) {
        errorMessages[i].classList.toggle('hidden');
        inputAreas[i].classList.toggle('invalid-input');
    }
}