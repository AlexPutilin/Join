function getSignupFormTemplate() {
  return `<section class="form-wrapper">
            <form autocomplete="off" id="signup_form" class="pos-rel" action="#">
                <button onclick="showLoginForm()" type="button" class="btn-small pos-abs back-signup bg-none">
                    <img class="icon-default" src="./assets/img/icon-back-default.svg">
                    <img class="icon-hover" src="./assets/img/icon-back-hover.svg">
                </button>
                <h1>Sign up</h1>
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input id="signup_name" type="text" placeholder="Name" required oninput="resetInputError()">
                        <img src="./assets/img/icon-person.svg" alt="">
                    </div>
                    <span class="err-msg hidden">Please enter a valid name.</span>
                </div>
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input id="signup_email" type="email" placeholder="Email" required oninput="resetInputError()">
                        <img src="./assets/img/icon-mail.svg" alt="">
                    </div>
                    <span class="err-msg hidden">Please enter a valid Email.</span>
                </div>
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input id="signup_password" type="password" placeholder="Password" required oninput="resetInputError()">
                        <img src="./assets/img/icon-lock.svg" alt="">
                    </div>
                    <span class="err-msg hidden">Invalid input.</span>
                </div>
                <div class="input-wrapper form-elements-padding">
                    <div class="input-area">
                        <input id="signup_password_confirmed" type="password" placeholder="Confirm Password" required oninput="resetInputError()">
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
  return `<section id="form-container" class="form-wrapper">
                <form autocomplete="off" action="submit">
                    <h1>Log in</h1>
                    <div class="input-wrapper form-elements-padding">
                        <div class="input-area">
                            <input id="emailInput" type="email" placeholder="Email" required oninput="resetInputError()">
                            <img src="./assets/img/icon-mail.svg" alt="">
                        </div>
                        <span class="err-msg hidden">Incorrect email.</span>
                    </div>
                    <div class="input-wrapper form-elements-padding">
                        <div class="input-area">
                            <input id="passwordInput" type="password" placeholder="Password" required oninput="resetInputError()">
                            <img src="./assets/img/icon-lock.svg" alt="">
                        </div>
                        <span class="err-msg hidden">The password incorrect.</span>
                    </div>
                    <div class="login-btn-container form-elements-padding mobile-flex-col">
                        <button onclick="handleLogin()" type="button" class="btn-dark cta-text-mobile-sm">Log in</button>
                        <button onclick="onLogin()" type="button" class="btn-light cta-text-mobile-sm"><b>Guest Log in</b></button>
                    </div>
                </form>
            </section>`;
}


function getContactSelectionTemplate({ id, name, color }) {
  return `<label class="checkbox select-contact" for="contact-${id}">
            <div class="contact-info">
              <div class="icon-contact" style="background-color: ${color};">${getContactInitials(name)}</div>
              <span class="contact-name">${name}</span>
            </div>
            <input type="checkbox" hidden id="contact-${id}" data-contact-id="${id}"/>
            <div class="checkbox-wrapper">
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
  return `<div class="subtask-item-container">
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
        </div>`;
}

function getContactSectionTemplate(letter) {
  return `<div class="contact-section" data-section-letter="${letter}">
            <span>${letter}</span>
          </div>`;
}

function getContactTemplate(contact, index) {
  return `<div class="contact" data-contact-index='${index}' onclick="addContactActiveState(this), showContactInformation(${index}), toggleMobileContactInformation()">
            <div class="contact-icon" style="background-color: ${contact.color};">${getContactInitials(contact.name)}</div>
            <div class="contact-infos">
              <span class="contact-name">${contact.name}</span>
              <span class="contact-mail">${contact.email}</span>
            </div>
          </div>`;
}

function getCreateContactDialogTemplate() {
  return `<div class="contact-dialog" onclick="event.stopPropagation()">
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
                              <span class="err-msg hidden">Please enter a valid name.</span>
                          </div>
                          <div class="input-wrapper">
                              <label for="">Email</label>
                              <div class="input-area">
                                  <input type="email" name="email" placeholder="Enter a email" oninput="resetInputError()">
                                  <img src="../assets/img/icon-mail.svg" alt="">
                              </div>
                              <span class="err-msg hidden">Please enter a valid email address.</span>
                          </div>
                          <div class="input-wrapper">
                              <label for="">Phone</label>
                              <div class="input-area">
                                  <input type="tel" name="phone" placeholder="Enter a phonenumber" oninput="resetInputError()">
                                  <img src="../assets/img/icon-phone.svg" alt="">
                              </div>
                              <span class="err-msg hidden">Phone number must contain digits only.</span>
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
  return `<div class="contact-dialog" onclick="event.stopPropagation()">
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
                              <span class="err-msg hidden">Please enter a valid name.</span>
                          </div>
                          <div class="input-wrapper">
                              <label for="">Email</label>
                              <div class="input-area">
                                  <input type="email" name="email" placeholder="Enter a email" value="${contact.email}" oninput="resetInputError()">
                                  <img src="../assets/img/icon-mail.svg" alt="">
                              </div>
                              <span class="err-msg hidden">Please enter a valid email address.</span>
                          </div>
                          <div class="input-wrapper">
                              <label for="">Phone</label>
                              <div class="input-area">
                                  <input type="tel" name="phone" placeholder="Enter a phonenumber" value="${contact.phone}" oninput="resetInputError()">
                                  <img src="../assets/img/icon-phone.svg" alt="">
                              </div>
                              <span class="err-msg hidden">Phone number must contain digits only.</span>
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
  return `<div class="flex-column-layout pos-rel">
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
