function attachEvents() {
    let doc = document;
    let loadBtn = doc.getElementById('btnLoad');
    let createBtn = doc.getElementById('btnCreate');

    loadBtn.addEventListener('click', loadContacts);

    createBtn.addEventListener('click', createContact);
}

let phonebookList = document.getElementById('phonebook');

phonebookList.addEventListener('click', (e)=>{
    if(e.target.tagName == 'BUTTON'){
        if(confirm('Are you sure to delete this contact?')){
            deleteContact(e.target.id, e.target.parentNode);
        }
    }
});

async function loadContacts(){
    let request = await fetch('http://localhost:3030/jsonstore/phonebook');

    let response = await request.json();

    phonebookList.innerHTML = '';

    Object.entries(response).map(([id, contact])=>{
        appendContact(id, contact);
    });
}

function appendContact(id, c){
    let contactContent = `${c.person}: ${c.phone}`;
    
    let contact = ce('li', contactContent);

    let deleteBtn = ce('button', 'Delete');

    deleteBtn.id = id;

    contact.appendChild(deleteBtn);

    phonebookList.appendChild(contact);
}

async function deleteContact(id, contactEl){
    let request = await fetch(`http://localhost:3030/jsonstore/phonebook/${id}`, {
        method: 'delete',
        headers: {'Content-Type':'application/json'}
    });

    if(request.ok){
        contactEl.remove();
    }else{
        alert('Error occurred during deletion of contact');
    }
}

async function createContact(){
    let personName = document.getElementById('person');
    let phoneNumber = document.getElementById('phone');

    if(!personName.value || !phoneNumber.value){
        return;
    }

    let contact = {person: personName.value, phone: phoneNumber.value};

    let request = await fetch('http://localhost:3030/jsonstore/phonebook', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(contact)
    });

    if(request.ok){
        personName.value = '';
        phoneNumber.value = '';
        loadContacts();
    }else{
        alert('Error occurred during creation of contact');
    }
}

function ce(type, content, className){
    let el = document.createElement(type);

    if(content){
        el.textContent = content;
    }

    if(className){
        el.className = className;
    }

    return el;
}

attachEvents();