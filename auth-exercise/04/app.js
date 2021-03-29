let doc = document;
let loadBooksBtn = doc.getElementById('loadBooks');
let tableBody = doc.querySelector('tbody');
let createForm = doc.getElementById('createBook');
let editForm = doc.getElementById('editBook');

editForm.style.display = 'none';

loadBooksBtn.addEventListener('click', loadBooks);

tableBody.addEventListener('click', (e) => {
    if (e.target.tagName == 'BUTTON') {
        if (e.target.textContent == 'Edit') {
            let el = e.target.parentNode;

            while (el.tagName != 'TR') {
                el = el.parentNode;
            }

            prepareEditForm(el.id);
        } else if (e.target.textContent == 'Delete') {
            let el = e.target.parentNode;

            while (el.tagName != 'TR') {
                el = el.parentNode;
            }

            deleteBook(el.id);
        }
    }
});

createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    createBook(formData);

    e.target.reset();
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    editBook(formData);

    e.target.reset();
});

async function loadBooks() {
    let request = await fetch('http://localhost:3030/jsonstore/collections/books');

    let response = await request.json();

    tableBody.innerHTML = '';

    Object.entries(response).map(([id, book]) => appendBook(id, book));
}

async function createBook(bookData) {
    if ([...bookData.values()].map(v => v.trim()).includes('')) {
        return;
    }

    let book = { author: bookData.get('author'), title: bookData.get('title') };

    let request = await fetch('http://localhost:3030/jsonstore/collections/books', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(book)
    });

    if(request.ok){
        loadBooks();
    }else{
        alert('Error occurred while creating new book');
    }
}

async function prepareEditForm(id) {
    if (!id) {
        return;
    }

    let request = await fetch(`http://localhost:3030/jsonstore/collections/books/${id}`);

    let response = await request.json();

    createForm.style.display = 'none';
    editForm.style.display = 'block';

    let [titleInput, authorInput] = editForm.querySelectorAll('input[type="text"]');

    let idInput = editForm.querySelector('input[type="hidden"]');

    idInput.value = id;

    titleInput.value = response.title;
    authorInput.value = response.author;
}

async function editBook(bookData) {
    if ([...bookData.values()].map(v => v.trim()).includes('')) {
        return;
    }

    let book = { author: bookData.get('author'), title: bookData.get('title') };

    let request = await fetch(`http://localhost:3030/jsonstore/collections/books/${bookData.get('id')}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
    });

    if (request.ok) {
        editForm.style.display = 'none';
        createForm.style.display = 'block';

        loadBooks();
    } else {
        alert('Error occurred during editing of book');
    }
}

async function deleteBook(id) {
    if (!id) {
        return;
    }

    let request = await fetch(`http://localhost:3030/jsonstore/collections/books/${id}`, {
        method: 'delete'
    });

    if (request.ok) {
        loadBooks();
    } else {
        alert('Error occurred while deleting a book');
    }
}

function appendBook(id, book) {
    let row = ce('tr');

    row.id = id;

    let bookTitle = ce('td', book.title);
    let bookAuthor = ce('td', book.author);
    let buttons = ce('td');
    let editBtn = ce('button', 'Edit');
    let deleteBtn = ce('button', 'Delete');

    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);

    row.appendChild(bookTitle);
    row.appendChild(bookAuthor);
    row.appendChild(buttons);

    tableBody.appendChild(row);
}

function ce(type, content, className) {
    let el = document.createElement(type);

    if (content) {
        el.textContent = content;
    }

    if (className) {
        el.className = className;
    }

    return el;
}