let userArray;

/**
 * Handles the splash screen transition and hides it after a delay.
 * Triggers the logo animation before hiding the splash screen.
 */
function handleSplashScreen() {
    setTimeout(() => {
        animateLogoTransition();
        hideElement("splash-screen");
        changeImgSrc("logo", "./assets/img/logo.svg");
        replaceLogo();
    }, 1200);
}


/**
 * Replaces the current logo with a new one, placed inside header
 * after a short delay.
 */
function replaceLogo() {
    setTimeout(() => {
        let currentLogo = document.getElementById('logo');
        currentLogo.classList.add('d-none');
        let newLogo = document.getElementById('logo_new');
        newLogo.classList.toggle('hidden');
    }, 225);
}


/**
 * Adds a class to animate the logo from center to header position.
 */
function animateLogoTransition() {
    let logo = document.getElementById("logo");
    logo.classList.add("logo--moved");
}


/**
 * Hides the specified element by adding the 'd-none' class.
 * @param {string} id - The ID of the element to hide.
 */
function hideElement(id) {
    let element = document.getElementById(id);
    element.classList.add("d-none");
}


/**
 * Shows the specified element by removing the 'd-none' class.
 * @param {string} id - The ID of the element to hide.
 */
function showElement(id) {
    let element = document.getElementById(id);
    element.classList.remove("d-none");
}


/**
 * Replaces the responsive <picture> logo with a static image by:
 * - Removing the <source> to disable media-based switching
 * - Setting a fixed image source on the <img> element
 *
 * @param {string} id - The ID of the <img> element inside <picture>.
 * @param {string} ref - The new image source path to set.
 */
function changeImgSrc(id, ref) {
    let picture = document.querySelector("picture");
    let source = picture.querySelector("source");
    if (source) {
        source.remove();
    }

    let logo = document.getElementById(id);
    logo.src = ref;
}


/**
 * Displays the signup form by rendering the template and initializing form behavior.
 * Also handles enabling/disabling of the signup button.
 */
function showSignupForm() {
    renderForm(getSignupFormTemplate());
    hideElement("cta-container");
    initSignupForm(); // -> handle disabled attribute of btn_signup
}


/**
 * Displays the login form by rendering the template and initializing form behavior.
 */
function showLoginForm() {
    renderForm(getLoginFormTemplate());
    showElement('cta-container');
}


/**
 * Initializes the signup form by attaching input listeners to all required fields.
 * Enables or disables the signup button depending on whether all required fields are filled.
 */
function initSignupForm() {
    // let form = document.getElementById('signup_form');
    let inputs = document.querySelectorAll('#signup_form input[required]');
    let signupBtn = document.getElementById('btn_signup');

    checkInputs(inputs, signupBtn);

    // form.addEventListener('input', () => checkInputs(inputs, signupBtn));
    // form.addEventListener('change', () => checkInputs(inputs, signupBtn));
    inputs.forEach(input => {
        input.addEventListener('input', () => checkInputs(inputs, signupBtn));
        input.addEventListener('change', () => checkInputs(inputs, signupBtn));
    });
}


/**
 * Checks whether all given input fields are filled.
 * If all required inputs have non-empty values, enables the signup button.
 * Otherwise, disables the signup button.
 *
 * @param {NodeListOf<HTMLInputElement>} inputs - List of required input fields to check.
 * @param {HTMLButtonElement} signupBtn - The signup button to enable or disable.
 */
function checkInputs(inputs, signupBtn) {
    let allFilled = true;

    let checkbox = document.getElementById('checkbox_privacy_policy');

    inputs.forEach(input => {
        if (input.value.trim() === '' || checkbox.checked === false) {
            allFilled = false;
        }
    });

    signupBtn.disabled = !allFilled;
}


/**
 * Renders the signup form inside the form container and hides the CTA section.
 */
function renderForm(form) {
    let container = document.getElementById("form-container");
    container.innerHTML = '';

    container.innerHTML += form;
    toggleCtaContainer();
}


/**
 * Hides the call-to-action container by adding the 'hidden' class.
 */
function toggleCtaContainer() {
    let element = document.getElementById("cta-container");
    element.classList.toggle("hidden");
}


/**
 * Signup function, to register new users
 */
async function handleSignup() {
    if (checkFormValidation('#signup_form')) {
        if (await isUniqueEmail()) {
            if (checkPasswordValidation()) {
                await addNewUser();
                showOverlayOnSignup();
            } else {
                showCustomInputError('#signup_password_confirmed', 'Passwörter stimmen nicht überein!');
            }
        } else {
            showCustomInputError('#signup_email', 'Diese E-Mail-Adresse ist bereits registriert!');
        }
    }
}


/**
 * Checks whether the input email is unique among all user entries.
 *
 * @async
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if the email is unique, false otherwise.
 */
async function isUniqueEmail() {
    let allUsers = await getAllEntries('/users');
    let allEmails = [];

    for (let i = 0; i < allUsers.length; i++) {
        const singleUserMail = allUsers[i][1].email;
        allEmails.push(singleUserMail);
    }

    let result = allEmails.filter(email => email === getInput('signup_email'));
    return result.length === 0;
}


/**
 * Checks whether the entered password and confirmation password match.
 *
 * @returns {boolean} Returns true if both passwords match, otherwise false.
 */
function checkPasswordValidation() {
    return getInput('signup_password') === getInput('signup_password_confirmed');
}


/**
 * Adds a new user to the Firebase Realtime Database.
 * Retrieves input data, loads existing users, generates a new user ID,
 * and sends the new user data to the server.
 */
async function addNewUser() {
    let inputData = getSignupInput();
    postData(`/users`, inputData);
}


/**
 * Reads the values from the signup form input fields and returns them as a user object.
 * @returns {{name: string, email: string, password: string}} - The user input data.
 */
function getSignupInput() {
    let nameRef = document.getElementById('signup_name');
    let emailRef = document.getElementById('signup_email');
    let passwordRef = document.getElementById('signup_password');

    let updatedInputData = [];

    updatedInputData.push({
        "name": nameRef.value,
        "email": emailRef.value,
        "password": passwordRef.value
    });

    return updatedInputData[0];
}


/**
 * Shows an overlay after user signed up successfully and redirects back to the login form.
 */
function showOverlayOnSignup() {
    let overlayContainer = document.getElementById('overlayContainerSignedUp');
    overlayContainer.classList.remove('d-none');

    setTimeout(() => {
        overlayBtn.classList.add('show');
    }, 50);

    setTimeout(() => {
        overlayContainer.classList.add('d-none');
        showLoginForm();
        // renderForm(getLoginFormTemplate())
    }, 1000);
}


/**
 * Handles the login process: fetches users, validates credentials,
 * and calls onLogin if a matching user is found.
 * @async
 * @returns {Promise<void>}
 */
async function handleLogin() {
    let emailInput = document.getElementById('emailInput').value.trim();
    let passwordInput = document.getElementById('passwordInput').value;

    let allUsers = await getData('/users');
    userArray = Object.values(allUsers);

    let foundUser = validateUser(userArray, emailInput, passwordInput);
    if (!foundUser) return;

    onLogin(foundUser);
}


/**
 * Validates the given email and password against a list of users.
 * Shows an alert if the email is not found or the password is incorrect.
 *
 * @param {Array<Object>} userArray - List of user objects to search through.
 * @param {string} emailInput - The email entered by the user.
 * @param {string} passwordInput - The password entered by the user.
 * @returns {Object|null} The matching user object if valid, otherwise null.
 */
function validateUser(userArray, emailInput, passwordInput) {
    let foundUser = userArray.find(user => user.email === emailInput);

    if (!foundUser) {
        showCustomInputError('#emailInput', 'E-Mail Adresse existiert nicht!');
        return null;
    }

    if (foundUser.password !== passwordInput) {
        showCustomInputError('#passwordInput', 'Das eingegebene Passwort ist falsch');
        return null;
    }

    return foundUser;
}


/**
 * Handles actions after a successful login.
 * Welcomes the user, sets the active user, and navigates to the summary page.
 *
 * @param {Object} foundUser - The user object of the successfully logged-in user.
 */
function onLogin(foundUser = { name: "Guest" }) {
    sessionStorage.removeItem('welcomeScreen');
    activeUser = foundUser.name;
    console.log(activeUser);

    saveUser();
    openPage('./html/summary.html');
}


/**
 * Displays a custom error message on a specific input field.
 *
 * @param {string} selector - A CSS selector for the input field (e.g. '#email' or '#password-confirm')
 * @param {string} message - The error message to display to the user
 */
function showCustomInputError(selector, message) {
    const input = document.querySelector(selector);
    if (!input) return;

    const inputWrapper = input.closest('.input-wrapper');
    const errorMessage = inputWrapper.querySelector('.err-msg');
    const inputArea = inputWrapper.querySelector('.input-area');

    inputArea.classList.add('invalid-input');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}


/**
 * Moves the CTA container below the form on small screens,
 * and back into the header on larger screens.
 */
function moveCTA() {
    const cta = document.getElementById('cta-container');
    const formContainer = document.getElementById('form-container');
    const header = document.querySelector('header');

    if (window.innerWidth <= 520) {
        if (cta.parentNode !== formContainer.parentNode) {
            formContainer.insertAdjacentElement('afterend', cta);
        }
    } else {
        if (cta.parentNode !== header) {
            header.appendChild(cta);
        }
    }
}

window.addEventListener('resize', moveCTA);
window.addEventListener('DOMContentLoaded', moveCTA);
