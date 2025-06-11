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


function getContactSectionTemplate(letter) {
    return `
        <div class="contact-section" data-section-letter="${letter}">
            <span>${letter}</span>
        </div>
    `
}


function getContactTemplate(contact, index) {
    return `
        <div class="contact" data-contact-index='${index}' onclick="addContactActiveState(this), showContactInformation(${index})">
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
                    <img class="empty-contact-icon" src="../assets/img/icon-person-big.svg" alt="contact-picture">
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


function getEditContactDialogTemplate() {
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
                    <img class="empty-contact-icon" src="../assets/img/icon-person-big.svg" alt="contact-picture">
                    <form autocomplete="off" id="edit-contact-form">
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
                            <button class="btn-light" type="button" onclick="">
                                <span>Delete</span>
                                <div class="icon-wrapper">
                                    <img class="icon-default" src="../assets/img/icon-delete-default.svg">
                                    <img class="icon-hover" src="../assets/img/icon-delete-hover.svg">
                                    <img class="icon-active" src="../assets/img/icon-delete-default.svg">
                                </div>
                            </button>
                            <button class="btn-dark" type="button" onclick="">
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