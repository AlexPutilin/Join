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
        newLogo.classList.toggle('invisible');
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


function showSignupForm() {
    renderForm(getSignupFormTemplate());
    initSignupForm(); // -> handle disabled attribute of btn_signup
}


/**
 * Initializes the signup form by attaching input listeners to all required fields.
 * Enables or disables the signup button depending on whether all required fields are filled.
 */
function initSignupForm() {
    let inputs = document.querySelectorAll('#signup_form input[required]');
    let signupBtn = document.getElementById('btn_signup');

    checkInputs(inputs, signupBtn);

    inputs.forEach(input => {
        input.addEventListener('input', () => checkInputs(inputs, signupBtn));
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

    inputs.forEach(input => {
        if (input.value.trim() === '') {
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
 * Hides the call-to-action container by adding the 'invisible' class.
 */
function toggleCtaContainer() {
    let element = document.getElementById("cta-container");
    element.classList.toggle("invisible");
}


/**
 * Signup functin -> in progress...
 */
async function handleSignup() {
    console.log("btn_signup enabled");
    
    if (checkFormValidation('#signup_form')) {
        await addNewUser();
    }
}


/**
 * Adds a new user to the Firebase Realtime Database.
 * Retrieves input data, loads existing users, generates a new user ID,
 * and sends the new user data to the server.
 */
async function addNewUser() {
    let inputData = getSignupInput();
    let newUserID = await generateUID('/users');

    putData(`/users/user${newUserID}`, inputData);
}


// async function addNewTask() {
//     // let inputData = ...
//     let newTaskID = await generateUID('/board/tasks');

//     putData(`/tasks/task${newTaskID}`, inputData);
// }


/**
 * Retrieves all entries from the given database path and returns them as an array of key-value pairs.
 *
 * @async
 * @function getAllEntries
 * @param {string} path - The path in the database from which to retrieve the entries.
 * @returns {Promise<Array<[string, any]>>} - A promise that resolves to an array of key-value pairs from the database object.
 */
async function getAllEntries(path) {
    let allEntriesRef = await getData(path);
    return Object.entries(allEntriesRef);
}



/**
 * Generates a new unique ID based on the number of existing entries at the given path.
 * The ID is computed as the current count of entries plus one.
 *
 * @async
 * @function generateUID
 * @param {string} path - The path in the database where entries are stored (e.g. '/users').
 * @returns {Promise<number>} - A promise that resolves to the next unique numeric ID.
 */
async function generateUID(path) {  
    let allEntries = await getAllEntries(path);
    let currentCount = allEntries.length;
    
    return currentCount + 1;
}


/**
 * Sends data to a specific Firebase Realtime Database path using PUT (overwrites data at the given path).
 * @param {string} path - The Firebase DB path (e.g. "users/user1").
 * @param {Object} data - The data object to store at the given path.
 * @returns {Promise<Object>} - The response JSON from Firebase.
 */
async function putData(path="", data={}) {
    let response = await fetch(FIREBASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return responseAsJson = await response.json();
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
        "name" : nameRef.value,
        "email" : emailRef.value,
        "password" : passwordRef.value
    });

    return updatedInputData[0];
}