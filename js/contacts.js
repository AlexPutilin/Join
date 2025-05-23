let contacts = [];


async function initContactList() {
    const contactData = await getData("/contacts");

    const contactIDs = Object.keys(contactData);
    contactIDs.forEach(id => contacts.push(contactData[id]))

    console.log(contacts);
    
    renderContactList();
}


function renderContactList() {
    const contactList = document.querySelector('.contact-list');
    for (let i = 0; i < contacts.length; i++) {
        contactList.innerHTML += getContactTemplate(contacts[i]);
    }
}


function getContactInitials(name) {
    let initials = name.split(" ");
    initials = initials[0].charAt(0) + initials[1].charAt(0);
    return initials;
}

