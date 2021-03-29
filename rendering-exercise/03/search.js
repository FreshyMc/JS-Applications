import { towns } from './towns.js';
import { html, render } from './node_modules/lit-html/lit-html.js';

let doc = document;
let townsDiv = doc.getElementById('towns');

doc.querySelector('button').addEventListener('click', search);

let townTemplate = (town, match = '') => html`
   <li class=${(match && town.toLowerCase().includes(match.toLowerCase())) ? 'active' : ''}>${town}</li>
`;

let result = (match) => html`
<ul>
   ${towns.map(t => townTemplate(t, match))}
</ul>
`;

function search() {
   let searchValue = doc.getElementById('searchText').value;

   update(searchValue);
}

function update(match){
   render(result(match), townsDiv);
}

update();


