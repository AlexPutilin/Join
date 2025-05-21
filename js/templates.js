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

                <!-- <input type="checkbox" Accept Privacy policy required> -->
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="checkbox_privacy_policy" required>
                    <label for="checkbox_privacy_policy">
                        I accept the <a href="#">Privacy policy</a>
                    </label>
                </div>
                
                <div>
                    <button id="btn_signup" type="button" onclick="handleSignup()" class="btn-dark cta-text-mobile-sm" disabled>Sign up</button>
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
                        <span class="err-msg hidden">Invalid input.</span>
                    </div>

                    <!-- <input type="password" placeholder="Password" required> -->
                    <div class="input-wrapper form-elements-padding">
                        <div class="input-area">
                            <input type="password" placeholder="Password" required>
                            <img src="../assets/img/icon-lock.svg" alt="">
                        </div>
                        <span class="err-msg hidden">Invalid input.</span>
                    </div>

                    <div class="login-btn-container form-elements-padding mobile-flex-col">
                        <button type="button" class="btn-dark cta-text-mobile-sm">Log in</button>
                        <button type="button" class="btn-light cta-text-mobile-sm"><b>Guest Log in</b></button>
                    </div>
                </form>
            </section>
   `;
}


function getContactSelectionTemplate(param) {
    return `
        <div class="select-contact">
            <div>
                <div class="icon-contact">${param}</div>
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