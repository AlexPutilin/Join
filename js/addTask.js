  function clearAddTaskForm() {
    document.querySelectorAll('input[type="text"], input[type="date"], textarea')
        .forEach(input => input.value = "");
    document.querySelectorAll('input[name="priority"]')
        .forEach(radio => radio.checked = false);
    document.querySelectorAll('input[type="checkbox"]')
        .forEach(cb => cb.checked = false);
    document.querySelectorAll('.drop-down-input input[type="text"]')
        .forEach(input => {
            input.value = "";
            input.removeAttribute("data-placeholder-active");
        });
    document.querySelector(".subtasks-container")?.replaceChildren();
    document.querySelectorAll('.err-msg')
        .forEach(msg => msg.classList.add('hidden'));
}




  
  
