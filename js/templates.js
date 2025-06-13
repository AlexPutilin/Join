function getSignupFormTemplate() {
    return /*html*/`
            <section class="form-wrapper">
            <form class="pos-rel" action="submit">
                <!-- BACK to Login Form -->
                <button onclick="renderForm(getLoginFormTemplate())" type="button" class="btn-small pos-abs back-signup bg-none">
                    <img class="icon-default" src="../assets/img/icon-back-default.svg">
                    <img class="icon-hover" src="../assets/img/icon-back-hover.svg">
                </button>

                <h1>Sign up</h1>

                <!-- <input type="text" placeholder="Name" required> -->
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input type="text" placeholder="Name" required>
                        <img src="./assets/img/icon-person.svg" alt="">
                    </div>
                    <span class="err-msg">Invalid input.</span>
                </div>

                <!-- <input type="email" placeholder="Email" required> -->
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input type="email" placeholder="Email" required>
                        <img src="./assets/img/icon-mail.svg" alt="">
                    </div>
                    <span class="err-msg">Invalid input.</span>
                </div>

                <!-- <input type="password" placeholder="Password" required> -->
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input type="password" placeholder="Password" required>
                        <img src="./assets/img/icon-lock.svg" alt="">
                    </div>
                    <span class="err-msg">Invalid input.</span>
                </div>

                <!-- <input type="password" placeholder="Password" required> -->
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input type="password" placeholder="Confirm Password" required>
                        <img src="./assets/img/icon-lock.svg" alt="">
                    </div>
                    <span class="err-msg">Invalid input.</span>
                </div>

                <!-- <input type="checkbox" Accept Privacy policy required> -->
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="checkbox_privacy_policy" required>
                    <label for="checkbox_privacy_policy">
                        I accept the <a href="#">Privacy policy</a>
                    </label>
                </div>
                
                <div>
                    <button class="btn-dark cta-text-mobile-sm">Sign up</button>
                </div>
            </form>
        </section>
   `;
}


function getLoginFormTemplate() {
    return /*html*/`
            <section id="form-container" class="form-wrapper">
                <form action="submit">
                    <h1>Log in</h1>

                    <!-- <input type="email" placeholder="Email" required> -->
                    <div class="input-wrapper form-elements-padding">
                        <div class="input-area">
                            <input type="email" placeholder="Email" required>
                            <img src="../assets/img/icon-mail.svg" alt="">
                        </div>
                        <span class="err-msg">Invalid input.</span>
                    </div>

                    <!-- <input type="password" placeholder="Password" required> -->
                    <div class="input-wrapper form-elements-padding">
                        <div class="input-area">
                            <input type="password" placeholder="Password" required>
                            <img src="../assets/img/icon-lock.svg" alt="">
                        </div>
                        <span class="err-msg">Invalid input.</span>
                    </div>

                    <div class="login-btn-container form-elements-padding mobile-flex-col">
                        <button class="btn-dark cta-text-mobile-sm">Log in</button>
                        <button class="btn-light cta-text-mobile-sm"><b>Guest Log in</b></button>
                    </div>
                </form>
            </section>
   `;
}


function getContactSelectionTemplate({ initials, name, id, color }) {
    return `
        <div class="select-contact">
            <div>
            <div class="icon-contact" style="background-color: ${color}; color: white;">${initials}</div>
                <span>${name}</span>
            </div>
            <label class="checkbox">
                <input type="checkbox" hidden data-contact-id="${id}">
                <div class="icon-wrapper icon-checkbox-default">
                    <img class="icon-default" src="../assets/img/icon-checkbutton-default.svg">
                    <img class="icon-hover" src="../assets/img/icon-checkbutton-hover.svg">
                </div>
                <div class="icon-wrapper icon-checkbox-checked">
                    <img class="icon-default" src="../assets/img/icon-checkbutton-checked-default.svg">
                    <img class="icon-hover" src="../assets/img/icon-checkbutton-checked-hover.svg">
                </div>
            </label>
        </div>
    `
}


function getSubtaskTemplate(name) {
    return `
        <div class="subtask-item-container">
            <div class="subtask-item">
                <span class="subtask-name">• ${name}</span>
                <div class="btn-collection-container">
                    <button type="button" class="btn-small" onclick="openSubtaskEditMenu(this)">
                        <div class="icon-wrapper">
                            <img class="icon-default" src="../assets/img/icon-edit-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-edit-hover.svg">
                        </div>
                    </button>
                    <div class="btn-seperator"></div>
                    <button type="button" class="btn-small" onclick="deleteSubtaskItem(this)">
                        <div class="icon-wrapper">
                            <img class="icon-default" src="../assets/img/icon-delete-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-delete-hover.svg">
                        </div>
                    </button>
                </div>
            </div>
            <div class="subtask-item-editmenu d-none">
                <input type="text">
                <div class="btn-collection-container">
                    <button type="button" class="btn-small" onclick="closeAllSubtaskEdits()">
                        <div class="icon-wrapper">
                            <img class="icon-default" src="../assets/img/icon-cancel-task-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-cancel-task-hover.svg">
                        </div>
                    </button>
                    <div class="btn-seperator"></div>
                    <button type="button" class="btn-small" onclick="commitEditSubtask(this)">
                        <div class="icon-wrapper">
                            <img class="icon-default" src="../assets/img/icon-check-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-check-hover.svg">
                        </div>
                    </button>
                </div>
            </div>
        </div>
    `
}

function getSubtaskInputTemplate() {
    return `
      <div class="input-wrapper" id="subtask-input">
        <div class="input-area">
          <input type="text" placeholder="Add new subtask" data-placeholder="Add new subtask" data-placeholder-active="" oninput="toggleInputBtns(this)" onfocus="closeAllSubtaskEdits()">
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
      </div>
    `;
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
      </div>
    `;
  }
  
  function getCategoryTemplate() {
    return `
      <div class="input-wrapper">
        <div class="required-description">
          <span>Category</span><span class="redstar">*</span>
        </div>
        <div class="input-area drop-down-input">
          <input id="task-category" name="category" type="text" placeholder="Select task category" data-placeholder="Select task category" data-placeholder-active="Search category" readonly required oninput="resetInputError(event)">
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

  function getAssignedToTemplate() {
    return `
      <div class="input-wrapper">
        <div class="required-description">
          <span>Assigned to</span>
        </div>
        <div class="input-area drop-down-input">
          <input type="text" name="assigned_to" id="assigned-input" placeholder="Select contacts to assign" data-placeholder="Select contacts to assign" data-placeholder-active=""readonly>
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



  function getAddTaskNotificationTemplate() {
    return `
      <div class="successfully-added-notification btn-dark">
        <span>Task added to board</span>
        <img src="../assets/img/icon-board.svg" alt="Board icon">
      </div>
    `;
  }
  