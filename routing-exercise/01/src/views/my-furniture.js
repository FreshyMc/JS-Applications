import { html } from '../../node_modules/lite-html/lite-html.js';
import { getMyFurniture } from '../api/data.js';


const myFurnitureTemp = async(items) => html `
<div class="row space-top">
    <div class="col-md-12">
        <h1>My Furniture</h1>
        <p>This is a list of your publications.</p>
    </div>
</div>
<div class="row space-top">
    ${items}
        </div>
`;
const mapItem = (item) => html `
        <div class="col-md-4">
            <div class="card text-white bg-primary">
                <div class="card-body">
                        <img src=${`/${item.img}`} />
                        <p>${item.description}</p>
                        <footer>
                            <p>Price: <span>${item.price} $</span></p>
                        </footer>
                        <div>
                            <a href=${`/details/${item._id}`}  class="btn btn-info">Details</a>
                        </div>
                </div>
            </div>
        </div>`;

export async function viewMyFurniture(ctx) {
    console.log('myFurniture');
    const data = await getMyFurniture();

    let result = html`<p>You have not furniture items</p>`;
    if (data.length != 0) {
        result = data.map(mapItem);
    }
    ctx.render(myFurnitureTemp(result));
}