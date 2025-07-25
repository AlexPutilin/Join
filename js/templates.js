function getSignupFormTemplate() {
  return `
            <section class="form-wrapper">
            <form id="signup_form" class="pos-rel" action="#">
                <!-- BACK to Login Form -->
                <button onclick="showLoginForm()" type="button" class="btn-small pos-abs back-signup bg-none">
                    <img class="icon-default" src="./assets/img/icon-back-default.svg">
                    <img class="icon-hover" src="./assets/img/icon-back-hover.svg">
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
                      <img class="icon-default unchecked" src="./assets/img/icon-checkbutton-default.svg">
                      <img class="icon-hover unchecked" src="./assets/img/icon-checkbutton-hover.svg">

                      <img class="icon-default checked" src="./assets/img/icon-checkbutton-checked-default.svg">
                      <img class="icon-hover checked" src="./assets/img/icon-checkbutton-checked-hover.svg">
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
  return `
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


function getContactSelectionTemplate({ id, name, color }){
  return `
    <label class="select-contact" for="contact-${id}">
      <div class="contact-info">
        <div class="icon-contact" style="background-color: ${color};">${getContactInitials(name)}</div>
        <span class="contact-name">${name}</span>
      </div>

      <div class="checkbox-wrapper">
        <input type="checkbox" id="contact-${id}" data-contact-id="${id}"/>
        <div class="icon-wrapper icon-checkbox-default">
          <img src="../assets/img/icon-checkbutton-default.svg" />
          <img src="../assets/img/icon-checkbutton-hover.svg" class="icon-hover" />
        </div>
        <div class="icon-wrapper icon-checkbox-checked">
          <img src="../assets/img/icon-checkbutton-checked-white-default.svg"/>
          <img src="../assets/img/icon-checkbutton-checked-hover.svg" class="icon-hover" />
        </div>
      </div>
    </label>`;
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
  `;
}

function getContactSectionTemplate(letter) {
  return `
        <div class="contact-section" data-section-letter="${letter}">
            <span>${letter}</span>
        </div>`;
}

function getContactTemplate(contact, index) {
  return `
        <div class="contact" data-contact-index='${index}' onclick="addContactActiveState(this), showContactInformation(${index}), toggleMobileContactInformation()">
            <div class="contact-icon" style="background-color: ${contact.color};">${getContactInitials(contact.name)}</div>
            <div class="contact-infos">
                <span class="contact-name">${contact.name}</span>
                <span class="contact-mail">${contact.email}</span>
            </div>
        </div>`;
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
                    <form autocomplete="off" id="create-contact-form" oninput="enableCreateContactBtn(this)">
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
                            <button id="btn-contact-submit" class="btn-dark" type="button" onclick="createNewContact()" disabled>
                                <span>Create contact</span>
                                <img src="../assets/img/icon-check-white.svg">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`;
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
                    <form autocomplete="off" id="edit-contact-form" oninput="enableCreateContactBtn(this)">
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
                            <button id="btn-contact-submit" class="btn-dark" type="button" onclick="editContact()">
                                <span>Save</span>
                                <img src="../assets/img/icon-check-white.svg">
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`;
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
        </div>`;
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
          <textarea name="description" placeholder="Enter a description" value="${task.description_full}" rows="3"></textarea>
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
                    <div class="icon-wrapper icon-checkbox-default">
                        <img class="icon-default" src="../assets/img/icon-checkbutton-default.svg">
                        <img class="icon-hover" src="../assets/img/icon-checkbutton-hover.svg">
                    </div>
                    <div class="icon-wrapper icon-checkbox-checked">
                        <img class="icon-default" src="../assets/img/icon-checkbutton-checked-default.svg">
                        <img class="icon-hover" src="../assets/img/icon-checkbutton-checked-hover.svg">
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

function getDialogAddTaskOnBoard(){
  return `<div onclick="eventBubblingProtection(event)" class="add-task-wrapper">
            ${getAddTaskFormTemplate()}
            <button onclick="closeOverlay()" class="btn-small" style="padding-top: 36px;">
              <img class="icon-default" src="../assets/img/icon-close-default.svg">
              <img class="icon-hover" src="../assets/img/icon-close-hover.svg">
            </button>
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
