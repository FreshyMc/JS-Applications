import {render, html} from './node_modules/lit-html/lit-html.js';

let doc = document;
let root = doc.getElementById('root');
doc.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault();

    let towns = doc.getElementById('towns').value.split(', ').map(t => {
        return html`
            <li>${t}</li>
        `;
    });

    let ul = html`<ul>${[...towns]}</ul>`;

    render(ul, root);
});