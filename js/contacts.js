const randomColors = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
    '#FF4646',
    '#FFBB2B',
]

let contacts = [];


async function initContactList() {
    const contactData = await getData("/contacts");

    const contactIDs = Object.keys(contactData);
    contactIDs.forEach(id => contacts.push(contactData[id]));

    console.log(contacts);

    createContactSections();
    renderContactList();
}


function createContactSections() {
    const sectionContainer = document.getElementById('contacts-container');
    const alphaticList = getAlphabeticList();
    for (let i = 0; i < alphaticList.length; i++) {
        sectionContainer.innerHTML += getContactSectionTemplate(alphaticList[i]);
    };
}


function renderContactList() {
    const contactSection = document.querySelectorAll('.contact-section');
    contactSection.forEach(section => {
        contacts.forEach(contact => {
            if (section.dataset.sectionLetter === contact.name.charAt(0)) {
                section.innerHTML += getContactTemplate(contact);
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
