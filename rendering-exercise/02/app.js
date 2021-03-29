import { cats } from './catSeeder.js';
import { html, render } from './node_modules/lit-html/lit-html.js';

let doc = document;
let allCats = doc.getElementById('allCats');

let catTemplate = (cat) => html`
<li>
    <img src="${'images/' + cat.imageLocation + '.jpg'}" width="250" height="250" alt="Card image cap">
    <div class="info">
        <button class="showBtn" @click=${(e) => {toggleCard(e)}}>Show status code</button>
        <div class="status" style="display: none" id="100">
            <h4>Status Code: ${cat.statusCode}</h4>
            <p>${cat.statusMessage}</p>
        </div>
    </div>
</li>`;

let result = html `
<ul>
    ${cats.map(catTemplate)}
</ul>
`;

function toggleCard(e){
    let btn = e.target;
    let info = e.target.parentElement;
    let statusInfo = info.querySelector('.status');
    
    if(statusInfo.style.display == 'block'){
        btn.textContent = 'Show status code';
        statusInfo.style.display = 'none';
    }else{
        btn.textContent = 'Hide status code';
        statusInfo.style.display = 'block';
    }
}

render(result, allCats);
