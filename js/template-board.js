
function getSubtasksProgressTemplate(showProgress, calcuProgress, doneTasksLength, subtasksLength) {
  return showProgress ? `
        <div class="task-progress-container">
            <div class="task-progressbar">
                <div class="task-progrssbar-content" style="width: ${calcuProgress}%;"></div>
            </div>
            <span class="task-progressbar-quotient">${doneTasksLength}/${subtasksLength} Subtasks</span>
        </div>` : '';
}

async function getTaskCardTemplate(task, subtasksProgress) {
  const onlyInitials = await getInitialsOnly(task);
  return `<div draggable="true" onclick="showOverview('${task.id}')" id="${task.id}" class="card">
                <div class="label-wrapper"><span class="label ${getBgCategory(task.category)}">${task.category}</span></div>
                <h4 class="task-title-little">${task.title}</h4>
                <span class="task-description-short">${task.description_full}</span>
                ${subtasksProgress}
                <div class="profiles-priority-container">
                    <div class="profil-initial-wrapper"> 
                      ${onlyInitials}
                    </div>
                    ${getPriority(task)}
                </div>
            </div>`;
}

async function getOverviewTemplate(task) {
  const assignedToContent = await getAssignedToContent(task);
  return `    <div onclick="eventBubblingProtection(event)" class="card-overview">
                    <div class="card-overview-header">
                        <span class="label ${getBgCategory(task.category)}">${task.category}</span>
                        <button onclick="closeOverlay()" class="btn-small">
                            <img class="icon-default" src="../assets/img/icon-close-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
                        </button>
                    </div>
                    <h2 class="task-title-big">${task.title}</h2>
                    <span class="task-description">${task.description_full}</span>
                    <div class="">
                        <span style="padding-right: 16px;" class="font-color-grey">Due Date:</span>
                        <span> ${task.due_date}</span>
                    </div>
                    <div class="priority-wrapper ">
                        <span style="padding-right: 36px;" class="font-color-grey">Priority:</span>
                        <span style="text-transform: capitalize;"> ${task.priority} </span>
                        ${getPriority(task)}
                    </div>
                            ${assignedToContent}
                            ${getSubtasksContent(task)}
                    <div class="delete-and-edit-wrapper">
                        <button onclick="deleteAndUpdateTasks('${task.id}')" class="btn-small">
                            <div class="icon-wrapper">
                                <img class="icon-default" src="../assets/img/icon-delete-default.svg">
                                <img class="icon-hover" src="../assets/img/icon-delete-hover-variant-2.svg">
                                <span>Delete</span>
                            </div>
                        </button>
                        <div class="beam"></div>
                        <button class="btn-small" onclick="switchToTaskEditmode()">
                            <div class="icon-wrapper">
                                <img class="icon-default" src="../assets/img/icon-edit-default.svg">
                                <img class="icon-hover" src="../assets/img/icon-edit-hover-variant-2.svg">
                                <span>Edit</span>
                            </div>   
                        </button>
                    </div>
                </div>`;
}

function getOverviewEditmodeTemplate(task) {
  return `
    <div class="card-overview" onclick="eventBubblingProtection(event)">
      <form id="add-task-form">
        <button type="button" class="btn-small" onclick="closeOverlay()">
          <img class="icon-default" src="../assets/img/icon-close-default.svg">
          <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
        </button>
        <div class="input-wrapper">
          <span>Title</span>
          <div class="input-area">
              <input type="text" name="title" placeholder="Enter a title" value="${task.title}" oninput="resetInputError()">
          </div>
          <span class="err-msg hidden">Invalid input.</span>
        </div>
        <div class="input-wrapper">
          <span>Description</span>
          <textarea name="description_full" placeholder="Enter a description"rows="3">${task.description_full}</textarea>
          <span class="err-msg hidden">Invalid input.</span>
        </div>
        <div class="input-wrapper">
          <span>Due date</span>
          <div class="input-area">
              <input type="date" name="due_date" value="${task.due_date}">
          </div>
          <span class="err-msg hidden">Not a valid date.</span>
        </div>
        <div class="priority-buttons-wrapper">
          <label class="priority-option urgent">
            <input type="radio" name="priority" value="urgent" hidden>
            <span>Urgent</span>
            <img src="../assets/img/icon-prio-urgent.svg">
            <div class="bg-checked"></div>
            <span class="err-msg hidden">Invalid input.</span>
          </label>
          <label class="priority-option medium">
            <input type="radio" name="priority" value="medium" hidden>
            <span>Medium</span>
            <img src="../assets/img/icon-prio-medium.svg">
            <div class="bg-checked"></div>
            <span class="err-msg hidden">Invalid input.</span>
          </label>
          <label class="priority-option low">
            <input type="radio" name="priority" value="low" hidden>
            <span>Low</span>
            <img src="../assets/img/icon-prio-low.svg">
            <div class="bg-checked"></div>
            <span class="err-msg hidden">Invalid input.</span>
          </label>
        </div>
        <div id="assigned-to-wrapper-template">
          ${getAssignedToTemplate()}
        </div>
        ${getSubtaskInputTemplate()}
        <input type="text" name="category" value="${task.category}" hidden>
      </form>
      <button class="btn-dark" onclick="commitEditTask()">
        <span>OK</span>
      </button>
    </div>`;
}

function getPriority(task) {
  switch (task.priority) {
    case "urgent":
      return `<img src="../assets/img/icon-prio-urgent.svg" alt="icon-urgent">`;
    case "medium":
      return `<img src="../assets/img/icon-prio-medium.svg" alt="icon-medium">`;
    case "low":
      return `<img src="../assets/img/icon-prio-low.svg" alt="icon-low">`;
    default:
      return '';
  }
}

function getSubtasksContent(task) {
  if (getSubtasksTemplate(task)) {
    return `<div><span class="font-color-grey">Subtasks:</span>${getSubtasksTemplate(task)}</div>`;
  } else {
    return "";
  }
}

function getSubtaskCheckboxTemplate(checked, subtask, taskId, subtaskKey) {
    return `<div class="subtask-item flex-start">
                <label class="checkbox">
                  <input type="checkbox" hidden class="subtask-checkbox" ${checked} data-task-id="${taskId}" data-subtask-key="${subtaskKey}">
                  <div class="checkbox-wrapper">
                    <div class="icon-wrapper icon-checkbox-default">
                      <img class="icon-default" src="../assets/img/icon-checkbutton-default.svg" />
                      <img class="icon-hover" src="../assets/img/icon-checkbutton-hover.svg"/>
                    </div>
                    <div class="icon-wrapper icon-checkbox-checked">
                      <img class="icon-default" src="../assets/img/icon-checkbutton-checked-default.svg"/>
                      <img class="icon-hover" src="../assets/img/icon-checkbutton-checked-hover.svg"/>
                    </div>
                  </div>
                </label>
                <span>${subtask.title}</span>
            </div>`;
}

function noTasksContainer(message) {
  return `<div class="placeholder-box-no-task"><p class="no-tasks-text">${message}</p></div>`;
}

function getInitialIcons(contact) {
  return `<div class="contact-icon initial-icon" style="background-color: ${contact.color};">${contact.initial}</div>`;
}

function getOverflowNumberIcon(remainingCount) {
  return `<div class="more-icon font-color-grey">+${remainingCount}</div>`;
}

function getInitialsWithNamesTemplate(contact) {
  return `<div class="names-wrapper">
                <div class="contact-icon" style="background-color: ${contact.color};">${contact.initial}</div>
                <span class="contact-name contact-name-board">${contact.name}</span>
            </div>`;
}

function getAssignedToContentTemplate(initialsWithName) {
  return `<div>
            <span class="font-color-grey">Assigned To:</span>
            <div class="initials-container">
              <div class="initials-wrapper">${initialsWithName} </div>
            </div>
          </div>`;
}

function getDialogAddTaskOnBoard(){
  return `<div onclick="eventBubblingProtection(event)" class="add-task-wrapper">
            ${getAddTaskFormTemplate()}
            <button onclick="closeOverlay()" class="btn-small" style="padding-top: 36px;">
              <img class="icon-default" src="../assets/img/icon-close-default.svg">
              <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
            </button>
          </div>`;
}