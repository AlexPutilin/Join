const randomColors = ['#FF7A00','#FF5EB3','#6E52FF','#9327FF','#00BEE8','#1FD7C1','#FF745E','#FFA35E','#FC71FF','#FFC701','#0038FF','#C3FF2B','#FFE62B','#FF4646','#FFBB2B',];

const contactDisplay = {
    display: document.getElementById('contact-display'),
    icon: document.getElementById('contact-display-icon'),
    name: document.getElementById('contact-display-name'),
    mail: document.getElementById('contact-display-mail'),
    phone: document.getElementById('contact-display-phone'),
};

let contacts = [];
let activeContactIndex = null;


async function initContactPage() {
    await loadContacts();
    createContactSections();
    renderContactList();
}


async function loadContacts() {
    const contactData = await getData("/contacts");
    const contactIDs = Object.keys(contactData);
    contacts = [];
    contactIDs.forEach(id => {
        const contact = contactData[id];
        contact.id = id;
        contacts.push(contact);
    });
}


function createContactSections() {
    const sectionContainer = document.getElementById('contact-list');
    const alphaticList = getAlphabeticList();
    sectionContainer.innerHTML = "";
    for (let i = 0; i < alphaticList.length; i++) {
        sectionContainer.innerHTML += getContactSectionTemplate(alphaticList[i]);
    };
}


function renderContactList() {
    const contactSection = document.querySelectorAll('.contact-section');
    contactSection.forEach(section => {
        contacts.forEach((contact, index) => {
            if (section.dataset.sectionLetter === contact.name.charAt(0)) {
                section.innerHTML += getContactTemplate(contact, index);
            }
        });
    });
}


function getAlphabeticList() {
    let list = [];
    contacts.forEach(contact => {
        const letter = contact.name.charAt(0);
        if (!list.includes(letter)) {
            list.push(letter);
        } else return;
    });
    list.sort();
    return list;
}


function getContactInitials(name) {
    let initials = name.split(" ");
    initials = initials[0].charAt(0) + initials[1].charAt(0);
    return initials;
}


function getRandomBackgroundColor() {
    const randomIndex = Math.floor(Math.random() * randomColors.length);
    return randomColors[randomIndex];
}


function addContactActiveState(contactElement) {
    const allContacts = document.querySelectorAll('.contact');
    allContacts.forEach(contact => {
        contact.classList.remove('contact-active');
    });
    contactElement.classList.add('contact-active');
    activeContactIndex = contactElement.dataset.contactIndex;
}


function showContactInformation(contactIndex) {
    contactDisplay.icon.innerText = getContactInitials(contacts[contactIndex].name);
    contactDisplay.name.innerText = contacts[contactIndex].name;
    contactDisplay.mail.innerText = contacts[contactIndex].email;
    contactDisplay.phone.innerText = contacts[contactIndex].phone;
    contactDisplay.display.classList.remove('d-none');
}


function toggleCreateContactDialog() {
    const overlay = document.getElementById('overlay');
    overlay.classList.toggle('d-none');
}


async function deleteContact() {
    await deleteData(getContactPath());
    activeContactIndex = null;
    await initContactPage();
}


function getContactPath() {
    return `/contacts/${contacts[activeContactIndex].id}`
}


async function createNewContact() {
    const form = '#contact-form';
    if (checkFormValidation(form)) {
        const data = getInputData(form);
        await postData('/contacts', data);
        toggleCreateContactDialog();
        activeContactIndex = null;
        await initContactPage();
    } 
}





// API.JS
async function deleteData(path = "") {
    try { 
        let response = await fetch(FIREBASE_URL + path + ".json", {
            method: "DELETE",
        });
        //return await response.json();
    } catch (error) {
        console.error("Error while deleting data from Firebase:", error);
    }    
}

async function postData(path = "", data = {}) {
    try {
        let response = await fetch(FIREBASE_URL + path + ".json", {
            method: "POST",
            header: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        //return await response.json();
    } catch (error) {
        console.error("Error while pushing data from Firebase:", error);
    }
}