document.addEventListener("DOMContentLoaded", () => {
  renderCategoryField();
  renderAssignedToField();
  setDefaultPriority();
  enablePrioritySelection();
});


function setDefaultPriority() {
  const mediumInput = document.querySelector('input[name="priority"][value="medium"]');
  if (!mediumInput) return;
  mediumInput.checked = true;
  const mediumLabel = mediumInput.closest('.priority-option');
  if (mediumLabel) mediumLabel.classList.add('active');
}


function enablePrioritySelection() {
  document.querySelectorAll('.priority-option').forEach(label => {
    label.addEventListener('click', () => {
      document.querySelectorAll('.priority-option')
              .forEach(l => l.classList.remove('active'));
      label.classList.add('active');
      const input = label.querySelector('input[name="priority"]');
      if (input) input.checked = true;
    });
  });
}


function getCategoryTemplate() {
  return `
    <div class="input-wrapper">
      <div class="required-description">
        <span>Category</span><span class="redstar">*</span>
      </div>
      <div class="input-area drop-down-input">
        <input
         id="task-category"
         name="category"
         type="text"
         placeholder="Select task category"
         data-placeholder="Select task category"
         data-placeholder-active="Search category"
         readonly required
         oninput="resetInputError(event)">
        <span class="err-msg hidden">This field is required.</span>
        <button type="button" class="btn-small" onclick="toggleDropDown(this)">
          <div class="icon-wrapper">
            <img class="icon-default" src="../assets/img/icon-down-default.svg">
            <img class="icon-hover"   src="../assets/img/icon-down-hover.svg">
          </div>
          <div class="icon-wrapper d-none">
            <img class="icon-default" src="../assets/img/icon-up-default.svg">
            <img class="icon-hover"   src="../assets/img/icon-up-hover.svg">
          </div>
        </button>
      </div>
      <div id="category-options-container" class="drop-down-menu d-none" data-open="false"></div>
      <span class="err-msg hidden" id="category-error">Please select a category.</span>
    </div>
  `;
}


function renderCategoryField() {
  const catgeoryFieldWrapper = document.getElementById('category-wrapper-template');
  if (!catgeoryFieldWrapper) return;
  catgeoryFieldWrapper.innerHTML = getCategoryTemplate();
  renderCategoryOptions();
}


function renderCategoryOptions() {
  const categories = ['Technical Task', 'User Story'];
  const categoryContainer = document.getElementById('category-options-container');
  if (!categoryContainer) return;
  categoryContainer.innerHTML = '';

  categories.forEach(categoryName => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('dropdown-single-option');
    optionDiv.textContent = categoryName;
    optionDiv.onclick = () => selectCategoryOption(optionDiv);
    categoryContainer.appendChild(optionDiv);
  });
}



function selectCategoryOption(optionElement) {
  const selectedValue = optionElement.innerText;
  const categoryInput = document.getElementById('task-category');
  if (!categoryInput) return;
  categoryInput.value = selectedValue;
  const toggleBtn = categoryInput.closest('.input-wrapper').querySelector('button');
  toggleDropDown(toggleBtn);
  document.getElementById('category-error')?.classList.add('hidden');
}



function getAssignedToTemplate() {
  return `
    <div class="input-wrapper">
      <div class="required-description">
        <span>Assigned to</span>
      </div>
      <div class="input-area drop-down-input">
        <input
          type="text"
          name="assigned_to"
          placeholder="Select contacts to assign"
          data-placeholder="Select contacts to assign"
          data-placeholder-active=""
          readonly>
        <button type="button" class="btn-small" onclick="toggleDropDown(this)">
          <div class="icon-wrapper">
            <img class="icon-default" src="../assets/img/icon-down-default.svg">
            <img class="icon-hover" src="../assets/img/icon-down-hover.svg">
          </div>
          <div class="icon-wrapper d-none">
            <img class="icon-default" src="../assets/img/icon-up-default.svg">
            <img class="icon-hover" src="../assets/img/icon-up-hover.svg">
          </div>
        </button>
      </div>
      <div class="drop-down-menu d-none" data-open="false" id="contacts-dropdown"></div>
    </div>
    <div id="assigned-chips-container" class="assigned-chips"></div>
  `;
}


async function renderAssignedToField() {
  const assignedToWrapper = document.getElementById('assigned-to-wrapper-template');
  if (!assignedToWrapper) {
    console.warn('Assigned-to container not found');
    return;
  } assignedToWrapper.innerHTML = getAssignedToTemplate();
  const contacts = await getData('/contacts');
  if (contacts) {
    renderContacts(contacts);
  }

  setupContactSelection();
  updateAssignedToChips();
}



function renderContacts(contacts) {
  const contactContainer = document.getElementById('contacts-dropdown');
  if (!contactContainer) return;
  contactContainer.innerHTML = '';
  Object.entries(contacts).forEach(([contactId, contact]) => {
    const initials = getInitials(contact.name);
    const contactHTML = getContactSelectionTemplate({initials, name: contact.name, id: contactId});
    contactContainer.insertAdjacentHTML('beforeend', contactHTML);
  });
}



function getInitials(name) {
  if (!name) return "";
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}


function setupContactSelection() {
  document.querySelectorAll('.select-contact .checkbox input').forEach(input => {
      input.addEventListener('change', updateAssignedToChips);
    });
}

function updateAssignedToChips() {
  const assignedChipsContainer = document.getElementById('assigned-chips-container');
  assignedChipsContainer.innerHTML = '';
  document.querySelectorAll('.select-contact .checkbox input:checked')
    .forEach(input => {const initials = input.closest('.select-contact').querySelector('.icon-contact').textContent;
      
      const chipDiv = document.createElement('div');
      chipDiv.classList.add('assigned-chip');
      chipDiv.textContent = initials;
      
      assignedChipsContainer.appendChild(chipDiv);
    });
}



async function saveTaskToFirebase(taskData) {
  const taskID = await generateUID('/board/tasks');
  await putData(`/board/tasks/task${taskID}`, taskData);
}

async function addTask() {
  if (!checkFormValidation('#add-task-form')) return;
  const data = getInputData('#add-task-form');
  data.subtasks = getSubtasks();
  await saveTaskToFirebase(data);
  clearAddTaskForm();
  alert("Task successfully created!");
}


function clearAddTaskForm() {
  document.querySelectorAll('input[type="text"], input[type="date"], textarea')
    .forEach(input => input.value = "");
  document.querySelectorAll('input[name="priority"]')
    .forEach(radio => radio.checked = false);
  document.querySelectorAll('.drop-down-menu input[type="checkbox"]')
    .forEach(cb => cb.checked = false);
  document.querySelectorAll('.drop-down-input input[type="text"]')
    .forEach(input => {
      input.value = "";
      input.removeAttribute("data-placeholder-active");
    });
  document.querySelectorAll('.drop-down-menu')
    .forEach(menu => {
      menu.classList.add('d-none');
      menu.dataset.open = 'false';
    });
  document.getElementById('assigned-chips-container').replaceChildren();
  document.querySelector(".subtasks-container")?.replaceChildren();
  document.querySelectorAll('.err-msg')
    .forEach(msg => msg.classList.add('hidden'));
} 





  
  
