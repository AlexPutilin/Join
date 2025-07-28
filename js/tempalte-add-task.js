
function getAddTaskFormTemplate() {
  return `
    <div class="add-task-form">
      <form id="add-task-form">
        <div class="add-task-container">
          <div class="mobile-h1">
            <div class="add-task-head-wrapper">
              <h1>Add Task</h1>
            </div> 
          </div>
          <div class="add-task-container-wrapper">
            <div class="add-task-left">
              <div id="title-wrapper-template">
                ${getAddTaskTitleTemplate()}
              </div>
              <div id="description-wrapper-template">
                ${getAddTaskDescriptionTemplate()}
              </div>
              <div id="due-date-wrapper-template">
                ${getAddTaskDueDateTemplate()}
              </div>
            </div>
            <div class="add-task-right">
              <div id="priority-wrapper-template">
                ${getPriorityTemplate()}
              </div>
              <div id="assigned-to-wrapper-template">
                ${getAssignedToTemplate()}
              </div>
              <div id="category-wrapper-template">
                ${getCategoryTemplate()}
              </div>
              <div id="subtask-wrapper-template">
                ${getSubtaskInputTemplate()}
              </div>
            </div>
          </div>
        </div>
        ${getaddTaskButtonsTemplate()}
      </form>
      </div>`;
}

function getAddTaskTitleTemplate() {
  return `
  <div class="input-wrapper">
    <div class="required-description">
      <span>Title</span><span class="redstar">*</span>
    </div>
    <div class="input-area">
      <input id="task-title" name="title" type="text" placeholder="Enter a title" required oninput="resetInputError()"/>
    </div>
    <span class="err-msg hidden">This field is required.</span>
  </div>`;
}

function getAddTaskDescriptionTemplate() {
  return `
  <div class="input-wrapper">
    <span>Description</span>
    <div class="textarea">
      <textarea name="description_full" placeholder="Enter a description"></textarea>
    </div>
  </div>`;
}

function getAddTaskDueDateTemplate() {
  return `              
  <div class="input-wrapper">
    <div class="required-description">
      <span>Due date</span><span class="redstar">*</span>
    </div>
    <div class="input-area">
      <input id="due-date" name="due_date" type="date" required/>
    </div>
    <span class="err-msg hidden">This field is required.</span>
  </div>`;
}

function getSubtaskInputTemplate() {
  return `
    <div class="input-wrapper" id="subtask-input">
      <span>Subtasks</span>
      <div class="input-area">
        <input id="subtask-input-field" type="text" placeholder="Add new subtask" data-placeholder="Add new subtask" data-placeholder-active="" oninput="toggleInputBtns(this)" onfocus="closeAllSubtaskEdits()">
        <button type="button" class="btn-small" onclick="setInputFocus(this)">
          <div class="icon-wrapper">
            <img class="icon-default" src="../assets/img/icon-add-default.svg">
            <img class="icon-hover" src="../assets/img/icon-add-hover.svg">
          </div>
        </button>
        <div class="btn-collection-container d-none">
          <button type="button" class="btn-small" onclick="resetSubtaskInput()">
            <div class="icon-wrapper">
              <img class="icon-default" src="../assets/img/icon-cancel-task-default.svg">
              <img class="icon-hover" src="../assets/img/icon-cancel-task-hover.svg">
            </div>
          </button>
          <div class="btn-seperator"></div>
          <button type="button" class="btn-small" onclick="addSubtask()">
            <div class="icon-wrapper">
              <img class="icon-default" src="../assets/img/icon-check-default.svg">
              <img class="icon-hover" src="../assets/img/icon-check-hover.svg">
            </div>
          </button>
        </div>
      </div>
      <div class="list-subtasks"></div>
      <div class="required-description form-error-mobile-visible">
        <p class="redstar">*</p><p>This field is required</p>
      </div>
    </div>`;
}

function getaddTaskButtonsTemplate() {
  return `
    <div class="clear-save-btn-wrapper">
      <div class="clear-save-btn">
        <div class="required-description form-error-desktop-visible">
          <p class="redstar">*</p><p>This field is required</p>
        </div>
        <div class="clear-save-btn-pos">
          <button type="button" class="btn-light" onclick="clearAddTaskForm()">
            <span>Clear</span>
            <div class="icon-wrapper">
              <img class="icon-default" src="../assets/img/icon-cancel-default.svg">
              <img class="icon-hover"   src="../assets/img/icon-cancel-hover.svg">
              <img class="icon-active"  src="../assets/img/icon-cancel-click.svg">
            </div>
          </button>
          <button type="button" class="btn-dark" id="create-task-btn" onclick="addTask()" disabled>
            <span>Create Task</span>
            <img src="../assets/img/icon-add-white.svg">
          </button>
        </div>
      </div>
    </div>`;
}

function getCategoryTemplate(selected = '') {
  return `
    <div class="input-wrapper" id="category-wrapper-template">
      <div class="required-description">
        <span>Category</span><span class="redstar">*</span>
      </div>
      <div class="input-area drop-down-input">
        <input id="task-category" placeholder="Select category" name="category" type="text" readonly required value="${selected ?? ''}" oninput="resetInputError(event)">
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
      <div id="category-options-container" class="drop-down-menu d-none" data-open="false">
        <div class="dropdown-single-option" onclick="selectCategory(this)">
          Technical Task
        </div>
        <div class="dropdown-single-option" onclick="selectCategory(this)">
          User Story
        </div>
      </div>
      <span class="err-msg hidden">This field is required.</span>
    </div>`;
}

function getPriorityTemplate() {
  return `
    <div class="input-wrapper">
      <span>Priority</span>
      <div class="priority-buttons-wrapper">
        <label class="priority-option urgent">
          <input name="priority" type="radio" value="urgent" hidden>
          <span>Urgent</span>
          <img src="../assets/img/icon-prio-urgent.svg" alt="">
          <div class="bg-checked"></div>
        </label>
        <label class="priority-option medium">
          <input name="priority" type="radio" value="medium" hidden checked>
          <span>Medium</span>
          <img src="../assets/img/icon-prio-medium.svg" alt="">
          <div class="bg-checked"></div>
        </label>
        <label class="priority-option low">
          <input name="priority" type="radio" value="low" hidden>
          <span>Low</span>
          <img src="../assets/img/icon-prio-low.svg" alt="">
          <div class="bg-checked"></div>
        </label>
      </div>
    </div>`;
}

function getAssignedToTemplate() {
  return `<div class="input-wrapper">
            <div class="required-description">
              <span>Assigned to</span>
            </div>
            <div class="input-area drop-down-input">
              <input type="text" name="assigned_to" id="assigned-input" placeholder="Select contacts to assign" data-placeholder="Select contacts to assign" data-placeholder-active="Search Contact"/>
              <button type="button" class="btn-small" onclick="toggleDropDown(this)">
                <div class="icon-wrapper">
                  <img class="icon-default" src="../assets/img/icon-down-default.svg" />
                  <img class="icon-hover" src="../assets/img/icon-down-hover.svg" />
                </div>
                <div class="icon-wrapper d-none">
                  <img class="icon-default" src="../assets/img/icon-up-default.svg" />
                  <img class="icon-hover" src="../assets/img/icon-up-hover.svg" />
                </div>
              </button>
            </div>
            <div id="contacts-dropdown" class="drop-down-menu d-none" data-open="false"></div>
          </div>
          <div class="assigned-chips" id="assigned-chips-container"></div>`;
}

function getAddTaskNotificationTemplate() {
  return `
    <div class="successfully-added-notification btn-dark slide-in-out-add-task">
      <span>Task added to board</span>
      <img src="../assets/img/icon-board.svg" alt="Board icon">
    </div>
  `;
}