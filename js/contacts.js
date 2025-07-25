const contactColors = ['#FF7A00','#FF5EB3','#6E52FF','#9327FF','#00BEE8','#1FD7C1','#FF745E','#FFA35E','#FC71FF','#0038FF','#FF4646','#FFBB2B'];

const contactDisplay = {
    display: document.getElementById('contact-display'),
    icon: document.getElementById('contact-display-icon'),
    name: document.getElementById('contact-display-name'),
    mail: document.getElementById('contact-display-mail'),
    phone: document.getElementById('contact-display-phone'),
};

let contacts = [];
let activeContactIndex = null;
let contactColorIndex = 0;


/**
 * Initializes the contact page by loading contacts, 
 * creating sections, and rendering the contact list.
 */
async function initContactPage() {
    initProfile();
    redirectIfNotLoggedIn();
    await loadContacts();
    createContactSections();
    renderContactList();
}


/**
 * Loads contact data from the server, assigns each contact a unique ID 
 * and background color, and stores them in the contacts array.
 */
async function loadContacts() {
    const contactData = await getData("/contacts");
    const contactIDs = Object.keys(contactData);
    contacts = [];
    contactColorIndex = 0;
    contactIDs.forEach(id => {
        const contact = contactData[id];
        contact.id = id;
        contact.color = getContactBackgroundColor();
        contacts.push(contact);
    });
}


/**
 * Creates and renders alphabetically grouped contact sections 
 * in the contact list container.
 */
function createContactSections() {
    const sectionContainer = document.getElementById('contact-list');
    const alphaticList = getAlphabeticList();
    sectionContainer.innerHTML = "";
    for (let i = 0; i < alphaticList.length; i++) {
        sectionContainer.innerHTML += getContactSectionTemplate(alphaticList[i]);
    };
}


/**
 * Renders all contacts into their corresponding alphabetic sections 
 * based on the first letter of each contact's name.
 */
function renderContactList() {
    const contactSection = document.querySelectorAll('.contact-section');
    contactSection.forEach(section => {
        contacts.forEach((contact, index) => {
            if (section.dataset.sectionLetter === contact.name.charAt(0).toUpperCase()) {
                section.innerHTML += getContactTemplate(contact, index);
            }
        });
    });
}


/**
 * Returns a sorted list of unique first letters from all contact names, 
 * used for grouping contacts alphabetically.
 * 
 * @returns {string[]} Sorted array of unique uppercase initials.
 */
function getAlphabeticList() {
    let list = [];
    contacts.forEach(contact => {
        const letter = contact.name.charAt(0).toUpperCase();
        if (!list.includes(letter)) {
            list.push(letter);
        } else return;
    });
    list.sort();
    return list;
}


/**
 * Returns the next background color for a contact from the predefined color list,
 * cycling through the list based on the current index.
 * 
 * @returns {string} A hex color string.
 */
function getContactBackgroundColor() {
    contactColorIndex++
    contactColorIndex = (contactColorIndex + contactColors.length) % contactColors.length;
    return contactColors[contactColorIndex];
}


/**
 * Sets the given contact element as active by applying a CSS class, 
 * and removes the active state from all other contacts.
 * Also updates the active contact index.
 * 
 * @param {HTMLElement} contactElement - The contact element to activate.
 */
function addContactActiveState(contactElement) {
    const allContacts = document.querySelectorAll('.contact');
    allContacts.forEach(contact => {
        contact.classList.remove('contact-active');
    });
    contactElement.classList.add('contact-active');
    activeContactIndex = contactElement.dataset.contactIndex;
}


/**
 * Displays the contact information for the given contact index.
 * 
 * @param {number} contactIndex - The index of the contact in the contacts array.
 */
function showContactInformation(contactIndex) {
    contactDisplay.icon.innerText = getContactInitials(contacts[contactIndex].name);
    contactDisplay.icon.style.backgroundColor = contacts[contactIndex].color;
    contactDisplay.name.innerText = contacts[contactIndex].name;
    contactDisplay.mail.innerText = contacts[contactIndex].email;
    contactDisplay.phone.innerText = contacts[contactIndex].phone;
    contactDisplay.display.classList.remove('d-none');
}


/**
 * Toggles the visibility of the overlay dialog and sets its content based on the dialog type.
 * 
 * @param {string} [dialog=''] - The type of dialog to display ('createContact' or 'editContact').
 */
function toggleDialogOverlay(dialog = '') {
    const overlay = document.getElementById('overlay');
    switch (dialog) {
        case 'createContact':
            overlay.innerHTML = getCreateContactDialogTemplate(); 
            break;
        case 'editContact':
            overlay.innerHTML = getEditContactDialogTemplate(contacts[activeContactIndex]);
            break;
        default:
            break;
    }
    overlay.classList.toggle('d-none');
}


/**
 * Returns the URL path for the currently active contact.
 * 
 * @returns {string} The contact path in the format `/contacts/{id}`.
 */
function getContactPath() {
    return `/contacts/${contacts[activeContactIndex].id}`
}


/**
 * Deletes the currently active contact and updates the UI accordingly.
 * 
 * @returns {Promise<void>} A promise that resolves when the contact is deleted and the UI is updated.
 */
async function deleteContact() {
    await deleteData(getContactPath());
    activeContactIndex = null;
    contactDisplay.display.classList.add('d-none');
    await initContactPage();
    showUserFeedback("Contact succesfully deleted");
}


/**
 * Creates a new contact from form input, updates the contact list, and closes the dialog if the form is valid.
 * 
 * @returns {Promise<void>} A promise that resolves after the contact is created and the UI is updated.
 */
async function createNewContact() {
    const form = '#create-contact-form';
    if (checkFormValidation(form)) {
        const data = getInputData(form);
        await postData('/contacts', data);
        await initContactPage();
        toggleDialogOverlay();
        activeContactIndex = null;
        showUserFeedback("New contact created");
    } 
}


/**
 * Updates the currently active contact with form input, refreshes the contact list and details, and closes the dialog if the form is valid.
 * 
 * @returns {Promise<void>} A promise that resolves after the contact is updated and the UI is refreshed.
 */
async function editContact() {
    const form = '#edit-contact-form';
    if (checkFormValidation(form)) {
        const data = getInputData(form);
        await updateData(`/contacts/${contacts[activeContactIndex].id}`, data);
        await initContactPage();
        showContactInformation(activeContactIndex);
        updateMobileContactInformation();
        toggleDialogOverlay();
        showUserFeedback("Contact succesfully edited");
    }
}


/**
 * Enables or disables the contact submit button based on whether
 * all required input fields in the given form are filled.
 *
 * @param {HTMLFormElement} form - The form element containing required input fields.
 */
function enableCreateContactBtn(form) {
    const inputs = form.querySelectorAll('input[required]');
    const submitBtn = document.getElementById('btn-contact-submit');
    submitBtn.disabled = !checkFilledRequiredInputs(inputs);
}


/**
 * Checks if all required input fields have a non-empty value.
 *
 * @param {NodeListOf<HTMLInputElement>} inputs - A list of required input elements to check.
 * @returns {boolean} - Returns true if all inputs are filled, otherwise false.
 */
function checkFilledRequiredInputs(inputs) {
    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) allFilled = false;
    })
    return allFilled
}


/**
 * Displays a temporary user feedback message with a slide-in-out animation.
 * 
 * @param {string} text - The feedback message to display.
 */
function showUserFeedback(text) {
    const userfeedback = document.getElementById('user-feedback');
    userfeedback.innerText = text;
    userfeedback.classList.remove('d-none');
    userfeedback.classList.add('slide-in-out');
    setTimeout(() => {
        userfeedback.classList.add('d-none');
        userfeedback.classList.remove('slide-in-out');
    }, 2000);
}


/**
 * Toggles the visibility of the mobile contact information container
 * if the viewport width is 1200px or less. Inserts the contact details
 * of the currently active contact into the container.
 */
function toggleMobileContactInformation() {
    const body = document.getElementById('body');
    const mobileContactInformationContainer = document.getElementById('contact-display-container-mobile');
    if (body.clientWidth <= 1200) {
        mobileContactInformationContainer.innerHTML = getMobileContactInformationTemplate(contacts[activeContactIndex]);
        mobileContactInformationContainer.classList.toggle('d-none');
    }
}


/**
 * Hides the mobile contact information container if the viewport width
 * exceeds 1200px. Intended to ensure the mobile container is hidden on larger screens.
 */
function closeMobileContactInformation() {
    const body = document.getElementById('body');
    const mobileContactInformationContainer = document.getElementById('contact-display-container-mobile');
    const mobileOverlay = document.getElementById('overlay-mobile');
    if (body.clientWidth > 1200) {
        mobileContactInformationContainer.classList.add('d-none');
        mobileOverlay.classList.add('d-none');
    }
}


/**
 * Updates the mobile contact information display.
 * If the container with the ID 'contact-display-container-mobile' exists,
 * it replaces its inner HTML with the contact information template.
 */
function updateMobileContactInformation() {
    const mobileContactInformationContainer = document.getElementById('contact-display-container-mobile');
    if (mobileContactInformationContainer) {
        mobileContactInformationContainer.innerHTML = getMobileContactInformationTemplate(contacts[activeContactIndex]);
    }
}


/**
 * Toggles the visibility of the mobile contact menu overlay.
 * Adds or removes the 'd-none' class on the element with the ID 'overlay-mobile'.
 */
function toggleMobileContactMenu() {
    const mobileOverlay = document.getElementById('overlay-mobile');
    mobileOverlay.classList.toggle('d-none');
}