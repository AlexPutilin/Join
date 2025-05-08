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
function handleSignup() {
    console.log("Signup läuft...");
    // (!) -> checkFormValidation();

    let inputData = getInput();
    console.log(inputData);
    
    // -> inputData in firebase "pushen"
    postData("/users", inputData);
}


function getInput() {
    let nameRef = document.getElementById('signup_name');
    let emailRef = document.getElementById('signup_email');
    let passwordRef = document.getElementById('signup_password');

    let updatedInputData = [];

    updatedInputData.push({
        "name" : nameRef.value,
        "email" : emailRef.value,
        "password" : passwordRef.value
    });

    return updatedInputData;
}


async function postData(path="", data={}) {
    let response = await fetch(FIREBASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return responseAsJson = await response.json();
}