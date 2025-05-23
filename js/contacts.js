let contacts = [];


function initContactList() {
    contacts = getData("/contacts");
    renderContactList();
}


function renderContactList() {
    const contactList = document.getElementById('contacts-container');
    for (let i = 0; i < contacts.length; i++) {
        contactList.innerHTML += getContactTemplate(contacts[i]);
    }
}

