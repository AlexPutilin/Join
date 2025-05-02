/**
 * Handles the splash screen transition and hides it after a delay.
 * Triggers the logo animation before hiding the splash screen.
 */
function handleSplashScreen() {
    setTimeout(() => {
        animateLogoTransition();
        hideElement("splash-screen");
        changeImgSrc("logo", "./assets/img/logo.svg");
    }, 1200);
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


function renderSignupForm() {
    let container = document.querySelector("form-wrapper");
    container.innerHTML = '';

    container.innerHTML += getSignupFormTemplate();
}