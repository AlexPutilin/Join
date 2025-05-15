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
    let allUsersArr = await loadAllUserEntries();

    let newUserID = generateNewUserID(allUsersArr);

    putData(`/users/user${newUserID}`, inputData);
}


/**
 * Loads all user entries from the Firebase Realtime Database.
 * @returns {Promise<Array>} An array of [key, userObject] entries.
 */
async function loadAllUserEntries() {
    let allUsersRef = await getData('/users');
    return Object.entries(allUsersRef);
}


/**
 * Generates a new user ID based on the number of existing users.
 * @param {Array} array - The array of existing user entries.
 * @returns {number} The next user ID number.
 */
function generateNewUserID(array) {
    let allUsersArr = loadAllUserEntries();

    let currentUserCount = array.length;
    return currentUserCount + 1;
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