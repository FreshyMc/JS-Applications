import { html } from '../../node_modules/lit-html/lit-html.js';
import { deleteCar, getCar } from '../data/data.js';

let listingTemplate = (car, isOwner, removeCar) => html`
<section id="listing-details">
    <h1>Details</h1>
    <div class="details-info">
        <img src=${car.imageUrl}>
        <hr>
        <ul class="listing-props">
            <li><span>Brand:</span>${car.brand}</li>
            <li><span>Model:</span>${car.model}</li>
            <li><span>Year:</span>${car.year}</li>
            <li><span>Price:</span>${car.price}$</li>
        </ul>

        <p class="description-para">${car.description}</p>

        ${isOwner ? html`<div class="listings-buttons">
            <a href="/edit/${car._id}" class="button-list">Edit</a>
            <a href="javascript:void(0)" @click=${removeCar} class="button-list">Delete</a>
        </div>` : ''}
    </div>
</section>`;

export async function showListing(ctx) {
    let carId = ctx.params.id;

    let car = await getCar(carId);

    let isOwner = car._ownerId == sessionStorage.getItem('id');

    ctx.render(listingTemplate(car, isOwner, removeCar));

    async function removeCar() {
        try {
            if (confirm('Are you sure to delete this listing?')) {
                await deleteCar(carId);

                ctx.page.redirect('/listings');
            }
        } catch (err) {
            alert(err.message);
        }
    }
}