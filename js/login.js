/**
 * Handles the splash screen transition and hides it after a delay.
 * Triggers the logo animation before hiding the splash screen.
 */
function handleSplashScreen() {
    setLogoSrc();
    setTimeout(() => {
        animateLogoTransition();
        hideElement("splash-screen");
    }, 1200);
}


/**
 * Updates logo source based on screen width.
 */
function setLogoSrc() {
    let logo = document.getElementById("logo");
    
    if (screen.width < 1024) {
        logo.src = "./assets/img/logo-white.svg";
    } else {
        logo.src = "./assets/img/logo.svg";
    }
}


/**
 * Adds a class to animate the logo from center to header position.
 */
function animateLogoTransition() {
    let logo = document.getElementById("logo");
    logo.classList.add("logo--moved");
    changeImgSrc("logo", "../assets/img/logo.svg");
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
 * Changes the src of an image element by ID.
 * @param {string} id - The ID of the image element.
 * @param {string} ref - The new image source path.
 */
function changeImgSrc(id, ref) {
    let logo = document.getElementById(id); 
    logo.src = ref;
}