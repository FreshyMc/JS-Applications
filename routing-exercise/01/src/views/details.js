import page from '../../node_modules/page/page.mjs'
import { html } from '../../node_modules/lite-html/lite-html.js';
import { deleteRecord, getFurnitureById } from '../api/data.js';



const detailTemp = async(item, onDelete) => html `
<div class="row space-top">
<div class="col-md-12">
    <h1>Furniture Details</h1>
</div>
</div>
<div class="row space-top">
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
            <img src=${`/${item.img}`}/>
        </div>
    </div>
</div>
<div class="col-md-4">
    <p>Make: <span>${item.make}</span></p>
    <p>Model: <span>${item.model}</span></p>
    <p>Year: <span>${item.year}</span></p>
    <p>Description: <span>${item.description}</span></p>
    <p>Price: <span>${item.price}$</span></p>
    <p>Material: <span>${item.material}</span></p>
    ${sessionStorage.getItem('id') == item._ownerId
        ? html`<div>
            <a href=${`/edit/${item._id}`}  class="btn btn-info">Edit</a>
            <a @click=${onDelete}  id= 'delete' class="btn btn-red">Delete</a>
        </div>`
        : ''
    }
</div>
</div>
`;
export async function viewDetails(ctx) {
    const itemId = ctx.params.id

    let data = await getFurnitureById(itemId);

    ctx.render(detailTemp(data, onDelete));

    async function onDelete() {
        if(!confirm('Are you sure to delete this item?')){
            return;
        }
        const response = await deleteRecord(itemId);
        page.redirect('/my-furniture');
    }

}