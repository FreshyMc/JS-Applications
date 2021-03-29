import { html, render } from './node_modules/lit-html/lit-html.js';

let doc = document;
let menu = doc.getElementById('menu');
let form = doc.querySelector('form');

let optionTemplate = (option) => html`
<option .value=${option._id}>${option.text}</option>
`;

console.log('test');

let endpoint = 'http://localhost:3030/jsonstore/advanced/dropdown';

form.addEventListener('submit', (e)=>{
    e.preventDefault();

    let itemValue = doc.getElementById('itemText').value;

    addItem(itemValue);

    e.target.reset();
});

async function addItem(item) {
    let request = await fetch(endpoint, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: item})
    });

    if(request.ok == false){
        return alert('Error occured while adding the new option element');
    }

    await loadItems();
}

async function loadItems(){
    let request = await fetch(endpoint);

    let response = await request.json();

    let result = Object.values(response).map(optionTemplate);

    render(result, menu);
}

loadItems();