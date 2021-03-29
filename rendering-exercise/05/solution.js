import { html, render } from './node_modules/lit-html/lit-html.js';

async function loadData() {
   let request = await fetch('http://localhost:3030/jsonstore/advanced/table');

   let result = await request.json();

   return result;
}

const rowTemplate = (person, isSelected = false) => html`
   <tr class=${(isSelected) ? 'select' : '' }>
      <td>${person.firstName + '' + person.lastName}</td>
      <td>${person.email}</td>
      <td>${person.course}</td>
   </tr>
`;

async function solve() {
   document.querySelector('#searchBtn').addEventListener('click', onClick);

   let tableBody = document.querySelector('tbody');
   let searchField = document.getElementById('searchField');

   let data = Object.values(await loadData());

   init();

   function onClick() {
      init();

      let val = searchField.value;

      let result = data.map(r => rowTemplate(r, normalizeData(r).includes(val.toLowerCase())));

      render(result, tableBody);
   }

   function normalizeData(r){
      return Object.values(r).map(d => d.toLowerCase()).join(' ');
   }

   function init(){
      render(data.map(r => rowTemplate(r)), tableBody);
   }
}

solve();