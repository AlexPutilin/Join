function selectCategoryOption(element) {
  const categoryValue = element.innerText;
  const input = document.getElementById('task-category'); 
  if (!input) return;

  input.value = categoryValue;

  const inputWrapper = input.closest('.input-wrapper');
  const menu = inputWrapper?.querySelector('.drop-down-menu');
  const toggleButton = inputWrapper?.querySelector('button');

  if (toggleButton) toggleDropDown(toggleButton);
  if (menu) menu.dataset.open = 'false';

  document.getElementById('category-error')?.classList.add('hidden');
}


document.addEventListener("DOMContentLoaded", () => {
  const mediumInput = document.querySelector('input[name="priority"][value="medium"]');
  const allPriorityOptions = document.querySelectorAll('.priority-option');

  if (mediumInput) {
    mediumInput.checked = true;
    const mediumLabel = mediumInput.closest('.priority-option');
    if (mediumLabel) mediumLabel.classList.add('active');
  }

  allPriorityOptions.forEach(option => {
    option.addEventListener('click', () => {
      allPriorityOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');

      const input = option.querySelector('input[name="priority"]');
      if (input) input.checked = true;
    });
  });

  const form = document.getElementById("add-task-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // verhindert Reload
    await addTask();
  });
});


async function addTask() {
  if (!checkFormValidation('#add-task-form')) return;

  const inputData = getInputValues();
  const assignedTo = getAssignedUsers();
  const subtasks = getSubtasks();

  await saveTaskToFirebase({ ...inputData, assigned_to: assignedTo, subtasks });

  clearAddTaskForm();
  alert("Task erfolgreich erstellt!");
}


function getInputValues() {
  const title = document.querySelector('input[placeholder="Enter a title"]').value.trim();
  const description = document.querySelector('textarea[placeholder="Enter a description"]').value.trim();
  const due_date = document.querySelector('input[type="date"]').value;
  const category = document.querySelector('input[placeholder="Select task category"]').value.trim();
  const priority = document.querySelector('input[name="priority"]:checked')?.value || "medium";

  return { title, description_full: description, due_date, category, priority, status: "to-do" };
}

function getAssignedUsers() {

}


function getSubtasks() {

}


async function saveTaskToFirebase(taskData) {
  const taskID = await generateUID('/board/tasks');
  await putData(`/board/tasks/task${taskID}`, taskData);
}



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



  
  
