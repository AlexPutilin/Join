function getSignupFormTemplate() {
  return /*html*/`
            <section class="form-wrapper">
            <form id="signup_form" class="pos-rel" action="#">
                <!-- BACK to Login Form -->
                <button onclick="renderForm(getLoginFormTemplate())" type="button" class="btn-small pos-abs back-signup bg-none">
                    <img class="icon-default" src="../assets/img/icon-back-default.svg">
                    <img class="icon-hover" src="../assets/img/icon-back-hover.svg">
                </button>
                <h1>Sign up</h1>
                <!-- <input type="text" placeholder="Name" required> -->
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input id="signup_name" type="text" placeholder="Name" required>
                        <img src="./assets/img/icon-person.svg" alt="">
                    </div>
                    <span class="err-msg hidden">Invalid input.</span>
                </div>
                <!-- <input type="email" placeholder="Email" required> -->
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input id="signup_email" type="email" placeholder="Email" required>
                        <img src="./assets/img/icon-mail.svg" alt="">
                    </div>
                    <span class="err-msg hidden">Invalid input.</span>
                </div>
                <!-- <input type="password" placeholder="Password" required> -->
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input id="signup_password" type="password" placeholder="Password" required>
                        <img src="./assets/img/icon-lock.svg" alt="">
                    </div>
                    <span class="err-msg hidden">Invalid input.</span>
                </div>
                <!-- <input type="password" placeholder="Password" required> -->
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input id="signup_password_confirmed" type="password" placeholder="Confirm Password" required>
                        <img src="./assets/img/icon-lock.svg" alt="">
                    </div>
                    <span class="err-msg hidden">Invalid input.</span>
                </div>

                <label class="checkbox checkbox-container">
                  <input type="checkbox" id="checkbox_privacy_policy" required hidden>

                  <div class="icon-wrapper icon-checkbox-default">
                      <img class="icon-default unchecked" src="../assets/img/icon-checkbutton-default.svg">
                      <img class="icon-hover unchecked" src="../assets/img/icon-checkbutton-hover.svg">

                      <img class="icon-default checked" src="../assets/img/icon-checkbutton-checked-default.svg">
                      <img class="icon-hover checked" src="../assets/img/icon-checkbutton-checked-hover.svg">
                  </div>

                  <label for="checkbox_privacy_policy">
                      I accept the <a href="./html/privacy-policy.html">Privacy policy</a>
                  </label>
                </label>

                <div>
                    <button id="btn_signup" type="button" onclick="handleSignup()" class="btn-dark cta-text-mobile-sm" disabled>Sign up</button>
                </div>
            </form>
        </section>`;
}


function getLoginFormTemplate() {
  return /*html*/`
            <section id="form-container" class="form-wrapper">
                <form action="submit">
                    <h1>Log in</h1>
                    <!-- <input type="email" placeholder="Email" required> -->
                    <div class="input-wrapper form-elements-padding">
                        <div class="input-area">
                            <input id="emailInput" type="email" placeholder="Email" required>
                            <img src="../assets/img/icon-mail.svg" alt="">
                        </div>
                        <span class="err-msg hidden">Invalid input.</span>
                    </div>
                    <!-- <input type="password" placeholder="Password" required> -->
                    <div class="input-wrapper form-elements-padding">
                        <div class="input-area">
                            <input id="passwordInput" type="password" placeholder="Password" required>
                            <img src="../assets/img/icon-lock.svg" alt="">
                        </div>
                        <span class="err-msg hidden">Invalid input.</span>
                    </div>
                    <div class="login-btn-container form-elements-padding mobile-flex-col">
                        <button onclick="handleLogin()" type="button" class="btn-dark cta-text-mobile-sm">Log in</button>
                        <button onclick="onLogin()" type="button" class="btn-light cta-text-mobile-sm"><b>Guest Log in</b></button>
                    </div>
                </form>
            </section>`;
}


/**
 * Returns the HTML template for displaying a selectable contact.
 * @param {Object} param0 - Contact data.
 * @param {string} param0.initials - Contact initials.
 * @param {string} param0.name - Full name of the contact.
 * @param {string|number} param0.id - Unique contact ID.
 * @param {string} param0.color - Background color for the contact icon.
 * @returns {string} HTML structure for a contact selection item.
 */
function getContactSelectionTemplate({ id, name, color }){
  return `
      <div class="select-contact">
          <div>
            <div class="icon-name-contact">
              <div class="icon-contact" style="background-color: ${color}; color: white;">${getContactInitials(name)}</div>
              <span>${name}</span>
            </div>
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
      </div>`;
}


/**
 * Returns the HTML template for a single subtask item.
 * @param {string} name - Subtask name or description.
 * @returns {string} HTML structure for a subtask item.
 */
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
  `;
}


function getContactSectionTemplate(letter) {
  return `
        <div class="contact-section" data-section-letter="${letter}">
            <span>${letter}</span>
        </div>
    `
}


function getContactTemplate(contact, index) {
  return `
        <div class="contact" data-contact-index='${index}' onclick="addContactActiveState(this), showContactInformation(${index}), toggleMobileContactInformation()">
            <div class="contact-icon" style="background-color: ${contact.color};">${getContactInitials(contact.name)}</div>
            <div class="contact-infos">
                <span class="contact-name">${contact.name}</span>
                <span class="contact-mail">${contact.email}</span>
            </div>
        </div>
    `
}


function getCreateContactDialogTemplate() {
  return `
        <div class="contact-dialog" onclick="event.stopPropagation()">
            <div>
                <button id="contact-dialog-close-btn-mobile" class="btn-small" onclick="toggleDialogOverlay()">
                    <div class="icon-wrapper">
                        <img class="icon-default" src="../assets/img/icon-close-white-default.svg">
                        <img class="icon-hover" src="../assets/img/icon-close-white-hover.svg">
                    </div>
                </button>
                <img class="logo-small" src="../assets/img/logo-white.svg" alt="Logo">
                <h1>Add Contact</h1>
                <h3>Tasks are better with a team!</h3>
                <div class="underline-accent"></div>
            </div>
            <div>
                <button id="contact-dialog-close-btn" class="btn-small" onclick="toggleDialogOverlay()">
                    <div class="icon-wrapper">
                        <img class="icon-default" src="../assets/img/icon-close-default.svg">
                        <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
                    </div>
                </button>
                <div class="contact-form-container">
                    <div class="empty-contact-icon">
                        <img src="../assets/img/icon-person-big.svg" alt="contact-picture">
                    </div>
                    <form autocomplete="off" id="create-contact-form">
                        <div class="input-wrapper">
                            <label for="">Name<span class="required-mark">*</span> </label>
                            <div class="input-area">
                                <input type="text" name="name" placeholder="Enter a name" required oninput="resetInputError()">
                                <img src="../assets/img/icon-person.svg" alt="">
                            </div>
                            <span class="err-msg hidden">Invalid input.</span>
                        </div>
                        <div class="input-wrapper">
                            <label for="">Email</label>
                            <div class="input-area">
                                <input type="email" name="email" placeholder="Enter a email" oninput="resetInputError()">
                                <img src="../assets/img/icon-mail.svg" alt="">
                            </div>
                            <span class="err-msg hidden">Invalid input.</span>
                        </div>
                        <div class="input-wrapper">
                            <label for="">Phone</label>
                            <div class="input-area">
                                <input type="tel" name="phone" placeholder="Enter a phonenumber" oninput="resetInputError()">
                                <img src="../assets/img/icon-phone.svg" alt="">
                            </div>
                            <span class="err-msg hidden">Invalid input.</span>
                        </div>
                        <div class="form-btn-container">
                            <button id="create-contact-cancel-btn" class="btn-light" type="button" onclick="toggleDialogOverlay()">
                                <span>Cancel</span>
                                <div class="icon-wrapper">
                                    <img class="icon-default" src="../assets/img/icon-cancel-default.svg">
                                    <img class="icon-hover" src="../assets/img/icon-cancel-hover.svg">
                                    <img class="icon-active" src="../assets/img/icon-cancel-click.svg">
                                </div>
                            </button>
                            <button class="btn-dark" type="button" onclick="createNewContact()">
                                <span>Create contact</span>
                                <img src="../assets/img/icon-check-white.svg">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
}


function getEditContactDialogTemplate(contact) {
  return `
        <div class="contact-dialog" onclick="event.stopPropagation()">
            <div>
                <button id="contact-dialog-close-btn-mobile" class="btn-small" onclick="toggleDialogOverlay()">
                    <div class="icon-wrapper">
                        <img class="icon-default" src="../assets/img/icon-close-white-default.svg">
                        <img class="icon-hover" src="../assets/img/icon-close-white-hover.svg">
                    </div>
                </button>
                <img class="logo-small" src="../assets/img/logo-white.svg" alt="Logo">
                <h1>Edit Contact</h1>
                <div class="underline-accent"></div>
            </div>
            <div>
                <button id="contact-dialog-close-btn" class="btn-small" onclick="toggleDialogOverlay()">
                    <div class="icon-wrapper">
                        <img class="icon-default" src="../assets/img/icon-close-default.svg">
                        <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
                    </div>
                </button>
                <div class="contact-form-container">
                    <div class="empty-contact-icon" style="background-color: ${contact.color};">${getContactInitials(contact.name)}</div>
                    <form autocomplete="off" id="edit-contact-form">
                        <div class="input-wrapper">
                            <label for="">Name<span class="required-mark">*</span> </label>
                            <div class="input-area">
                                <input type="text" name="name" placeholder="Enter a name" value="${contact.name}" required oninput="resetInputError()">
                                <img src="../assets/img/icon-person.svg" alt="">
                            </div>
                            <span class="err-msg hidden">Invalid input.</span>
                        </div>
                        <div class="input-wrapper">
                            <label for="">Email</label>
                            <div class="input-area">
                                <input type="email" name="email" placeholder="Enter a email" value="${contact.email}" oninput="resetInputError()">
                                <img src="../assets/img/icon-mail.svg" alt="">
                            </div>
                            <span class="err-msg hidden">Invalid input.</span>
                        </div>
                        <div class="input-wrapper">
                            <label for="">Phone</label>
                            <div class="input-area">
                                <input type="tel" name="phone" placeholder="Enter a phonenumber" value="${contact.phone}" oninput="resetInputError()">
                                <img src="../assets/img/icon-phone.svg" alt="">
                            </div>
                            <span class="err-msg hidden">Invalid input.</span>
                        </div>
                        <div class="form-btn-container">
                            <button class="btn-light" type="button" onclick="deleteContact(), toggleDialogOverlay()">
                                <span>Delete</span>
                                <div class="icon-wrapper">
                                    <img class="icon-default" src="../assets/img/icon-delete-default.svg">
                                    <img class="icon-hover" src="../assets/img/icon-delete-hover.svg">
                                    <img class="icon-active" src="../assets/img/icon-delete-default.svg">
                                </div>
                            </button>
                            <button class="btn-dark" type="button" onclick="editContact()">
                                <span>Save</span>
                                <img src="../assets/img/icon-check-white.svg">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
}


function getMobileContactInformationTemplate(contact) {
  return `
        <div class="flex-column-layout pos-rel">
            <div class="contact-display-closebtn-container">
                <button class="btn-small" onclick="toggleMobileContactInformation()">
                    <img class="icon-default" src="../assets/img/icon-back-default.svg" alt="back">
                    <img class="icon-hover" src="../assets/img/icon-back-hover.svg">
                </button>
            </div>
            <div class="contact-display-header-mobile">
                <h1>Contacts</h1>
                <span>Better with a Team</span>
                <div class="seperator-blue-horizontal"></div>
            </div>
            <div class="contact-display-mobile">
                <div class="contact-display-name-wrapper-mobile">
                    <div class="contact-icon" style="background-color: ${contact.color};">${getContactInitials(contact.name)}</div>
                    <h2>${contact.name}</h2>
                </div>
                <span>Contact Information</span>
                <div class="contact-information-wrapper">
                    <span><b>Email</b></span>
                    <span class="contact-mail">${contact.email}</span>
                </div>
                <div class="contact-information-wrapper">
                    <span><b>Phone</b></span>
                    <span>${contact.phone}</span>
                </div>
                <div class="space-container"></div>
                <button id="btn-contact-menu-mobile" class="btn-small-dark" onclick="toggleMobileContactMenu()">
                    <img src="../assets/img/icon-more-dots.svg">
                </button>
            </div>
        </div>
    `
}


function getSubtasksProgressTemplate(showProgress, calcuProgress, doneTasksLength, subtasksLength) {
  return showProgress ? `
        <div class="task-progress-container">
            <div class="task-progressbar">
                <div class="task-progrssbar-content" style="width: ${calcuProgress}%;"></div>
            </div>
            <span class="task-progressbar-quotient">${doneTasksLength}/${subtasksLength} Subtasks</span>
        </div>` : '';
}


function getTaskCardTemplate(task, bgCategory, description_short, subtasksProgress) {
  return `<div draggable="true" onclick="showOverview('${task.id}')" id="${task.id}" class="card">
                <span class="label ${bgCategory}">${task.category}</span>
                <h4 class="task-title">${task.title}</h4>
                <span>Order: ${task.order}</span>
                <span class="task-description-short">${description_short}</span>
                ${subtasksProgress}
                <div class="profiles-priority-container">
                    <div style="border: 2px solid black; border-radius: 100%; width: 32px; height: 32px;"></div>
                    ${getPriority(task)}
                </div>
            </div>`;
}


/**
 * @function getOverviewTemplate - Returns the HTML template for the task detail view.
 * @param {Object} task - The individual task object.
 * @returns {string} - HTML-Template representing the task detail view.
 */
function getOverviewTemplate(task) {
  const bgCategory = getBgCategory(task.category);
  return `    <div onclick="eventBubblingProtection(event)" class="card-overview">
                    <div class="card-overview-header">
                        <span class="label ${bgCategory}">${task.category}</span><br>
                        <button onclick="closeOverlay()" class="btn-small">
                            <img class="icon-default" src="../assets/img/icon-close-default.svg">
                            <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
                        </button>
                    </div>
                    <h2 class="task-title">${task.title}</h2><br>
                    <span class="task-description">${task.description_full}</span><br><br>

                    <div class="">
                        <span style="padding-right: 16px;" class="font-color-grey">Due Date:</span>
                        <span> ${task.due_date}</span>
                    </div>
                    <br>
                    <div class="priority-wrapper ">
                        <span style="padding-right: 36px;" class="font-color-grey">Priority:</span>
                        <span style="text-transform: capitalize;"> ${task.priority} </span>
                        ${getPriority(task)}
                    </div>
                    <br>
                    <div>
                        <span class="font-color-grey">Assigned To:</span>
                        <p></p>
                    </div>
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
                        <button class="btn-small">
                            <div class="icon-wrapper">
                                <img class="icon-default" src="../assets/img/icon-edit-default.svg">
                                <img class="icon-hover" src="../assets/img/icon-edit-hover-variant-2.svg">
                                <span>Edit</span>
                            </div>   
                        </button>
                    </div>
                </div>`;
}


/**
 * @function getPriority - Returns a priority icon based on the given priority level.
 * @param {Object} task - individual Tasks
 * @returns - individual Priority depending on the Task
 */
function getPriority(task) {
  if (task.priority === "urgent") {
    return `<img src="../assets/img/icon-prio-urgent.svg" alt="icon-urgent">`;
  } else if (task.priority === "medium") {
    return `<img src="../assets/img/icon-prio-medium.svg" alt="icon-medium">`;
  } else if (task.priority === "low") {
    return `<img src="../assets/img/icon-prio-low.svg" alt="icon-low">`;
  } else {
    return "";
  }
}

/**
 * Returns the HTML template for the "Add Task" form.
 * @returns {string} HTML structure for the Add Task form section.
 */
function getAddTaskFormTemplate() {
  return `
    <div>
    <div class="add-task-form">
      <form id="add-task-form">
        <div class="add-task-container">
          <div class="mobile-h1">
            <div><h1>Add Task</h1></div>
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
      </div>
    </div>
  `;
}


/**
 * Returns the HTML template for the task title input field.
 * @returns {string} HTML structure for task title input.
 */
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
  </div>
`;
}

/**
 * Returns the HTML template for the task description textarea.
 * @returns {string} HTML structure for task description input.
 */
function getAddTaskDescriptionTemplate() {
  return `
  <div class="input-wrapper">
    <span>Description</span>
    <div class="textarea">
      <textarea name="description_full" placeholder="Enter a description"></textarea>
    </div>
  </div>
`;
}

/**
 * Returns the HTML template for the task due date input.
 * @returns {string} HTML structure for due date field.
 */
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
  </div>
`;
}

/**
 * Returns the HTML template for the subtask input section.
 * @returns {string} HTML structure for subtask input field and buttons.
 */
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
    </div>
  `;
}

/**
 * Returns the HTML template for the "Clear" and "Create Task" buttons.
 * @returns {string} HTML structure for form action buttons.
 */
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
    </div>
  `;
}

/**
 * Returns the HTML template for the category dropdown input.
 * @returns {string} HTML structure for category selection.
 */
function getCategoryTemplate() {
  return `
    <div class="input-wrapper">
      <div class="required-description">
        <span>Category</span><span class="redstar">*</span>
      </div>
      <div class="input-area drop-down-input">
        <input id="task-category" name="category" type="text" placeholder="Select task category" data-placeholder="Select task category" data-placeholder-active="Select task category" readonly required oninput="resetInputError(event)">
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
      <div id="category-options-container" class="drop-down-menu d-none" data-open="false"></div>
      <span class="err-msg hidden">This field is required.</span>
    </div>
  `;
}

/**
 * Returns the HTML template for priority selection radio buttons.
 * @returns {string} HTML structure for selecting task priority.
 */
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


/**
 * Returns the HTML template for the assigned contacts input and dropdown.
 * @returns {string} HTML structure for assigning contacts.
 */
function getAssignedToTemplate() {
  return `
    <div class="input-wrapper">
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
    <div class="assigned-chips" id="assigned-chips-container"></div>
  `;
}

function getAddTaskNotificationTemplate() {
  return `
    <div class="successfully-added-notification btn-dark slide-in-out-add-task">
      <span>Task added to board</span>
      <img src="../assets/img/icon-board.svg" alt="Board icon">
    </div>
  `;
}
