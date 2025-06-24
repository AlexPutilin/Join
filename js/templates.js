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
            </section>`;
}


function getContactSelectionTemplate(param) {
    return `
        <div class="select-contact">
            <div>
                <div class="contact-icon">${param}</div>
                <span>${param}</span>
            </div>
            <label class="checkbox">
                <input type="checkbox" hidden>
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
                <img class="logo-small" src="../assets/img/logo-white.svg" alt="Logo">
                <h1>Add Contact</h1>
                <h3>Tasks are better with a team!</h3>
                <div class="underline-accent"></div>
            </div>
            <div>
                <button class="btn-small" onclick="toggleDialogOverlay()">
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
                            <button class="btn-light" type="button" onclick="toggleDialogOverlay()">
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
                <img class="logo-small" src="../assets/img/logo-white.svg" alt="Logo">
                <h1>Edit Contact</h1>
                <div class="underline-accent"></div>
            </div>
            <div>
                <button class="btn-small" onclick="toggleDialogOverlay()">
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
        <div class="flex-column-layout">
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
                <div class="contact-display-name-wrapper">
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
            </div>
        </div>
        <div id="user-feedback" class="d-none"></div>
    `
}


function getSubtasksProgressTemplate(showProgress, calcuProgress, doneTasksLength, subtasksLength) {
    return showProgress ? `
        <div class="task-progress-container">
            <div class="task-progressbar">
                <div class="task-progrssbar-content" style="width: ${calcuProgress}%;"></div>
            </div>
            <span class="task-progressbar-quotient">${doneTasksLength}/${subtasksLength} subtasks</span>
        </div>` : '';
}


function getTaskCardTemplate(task, bgCategory, description_short, subtasksProgress) {
    return `<div draggable="true" onclick="showOverview('${task.id}')" id="${task.id}" class="card">
                <span class="label ${bgCategory}">${task.category}</span>
                <h4 class="task-title">${task.title}</h4>
                <span>Order: ${task.order}</span> <br>
                <span class="task-description-short">${description_short}</span>
                ${subtasksProgress}
                <div class="profiles-priority-container">
                    <div style="border: 2px solid black; border-radius: 100%; width: 32px; height: 32px;"></div>
                    <div>${getPriority(task)}</div>
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