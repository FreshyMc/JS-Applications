import { html, render } from './node_modules/lit-html/lit-html.js';

let body = document.body;

async function loadBooks() {
    let request = await fetch('http://localhost:3030/jsonstore/collections/books');

    let result = await request.json();

    return Object.entries(result);
}

let addForm = () => html`
<form id="add-form" @submit=${(e) => createBook(e)}>
    <h3>Add book</h3>
    <label>TITLE</label>
    <input type="text" name="title" placeholder="Title...">
    <label>AUTHOR</label>
    <input type="text" name="author" placeholder="Author...">
    <input type="submit" value="Submit">
</form>
`;

let mainTemplate = (form) => html`
    <button id="loadBooks" @click=${() => renderBooks()}>LOAD ALL BOOKS</button>
    <div id="table"></div>
    ${form()}
`;

let tableTemplate = (books) => html`
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${books.map(([id, book]) => bookTemplate(book, id))}
        </tbody>
    </table>
`;

let bookTemplate = (book, id) => html`
<tr>
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>
        <button @click=${() => editBook(book, id)}>Edit</button>
        <button @click=${(e) => deleteBook(id, e)}>Delete</button>
    </td>
</tr>
`;

async function renderBooks() {
    let tableWrapper = document.getElementById('table');

    let books = await loadBooks();

    render(tableTemplate(books), tableWrapper);
}

async function initApp() {
    render(mainTemplate(addForm), body);

    renderBooks();
}

async function deleteBook(id, ev) {
    let tr = ev.target;

    while (tr.tagName != 'TR') {
        tr = tr.parentElement;
    }

    let request = fetch('http://localhost:3030/jsonstore/collections/books/' + id, { method: 'delete' });

    if (request.ok == false) {
        return alert('Error occured while deleting a book');
    }

    tr.remove();
}

function editBook(book, id) {
    let editForm = () => html`
    <form id="edit-form" @submit=${onSubmit}>
        <input type="hidden" name="id" .value=${id}>
        <h3>Edit book</h3>
        <label>TITLE</label>
        <input type="text" name="title" placeholder="Title..." .value=${book.title}>
        <label>AUTHOR</label>
        <input type="text" name="author" placeholder="Author..." .value=${book.author}>
        <input type="submit" value="Save">
    </form>
    `;

    render(mainTemplate(editForm), body);

    renderBooks();

    async function onSubmit(e) {
        e.preventDefault();

        let bookData = new FormData(e.target);

        let book = { author: bookData.get('author'), title: bookData.get('title') };

        let request = await fetch(`http://localhost:3030/jsonstore/collections/books/${bookData.get('id')}`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });

        if (request.ok == false) {
            return alert('Error occurred during editing of book');
        }

        initApp();
    }
}

async function createBook(e){
    e.preventDefault();

    let bookData = new FormData(e.target);

    let book = { author: bookData.get('author'), title: bookData.get('title') };

    let request = await fetch('http://localhost:3030/jsonstore/collections/books', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(book)
    });

    if(request.ok == false){
        return alert('Error occurred while creating new book');
    }

    e.target.reset();

    initApp();
}

initApp();