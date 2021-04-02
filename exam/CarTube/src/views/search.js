import { html } from '../../node_modules/lit-html/lit-html.js';
import { searchCars } from '../data/data.js';

let searchTemplate = (cars, beginSearch) => html`
<section id="search-cars">
    <h1>Filter by year</h1>

    <div class="container">
        <input type="text" name="search" placeholder="Enter desired production year" id="search-input">
        <button class="button-list" @click=${beginSearch}>Search</button>
    </div>

    <div class="listings">
        ${cars.length === 0 ? html`<p class="no-cars"> No results.</p>` : html`<h2>Results:</h2>
        ${cars.map(listingTemplate)}`}
    </div>
</section>`;

let listingTemplate = (car) => html`
<div class="listing">
    <div class="preview">
        <img src=${car.imageUrl}>
    </div>
    <h2>${car.brand} ${car.model}</h2>
    <div class="info">
        <div class="data-info">
            <h3>Year: ${car.year}</h3>
            <h3>Price: ${car.price} $</h3>
        </div>
        <div class="data-buttons">
            <a href="/listing/${car._id}" class="button-carDetails">Details</a>
        </div>
    </div>
</div>`;

export async function showSearch(ctx) {
    let query = Number(ctx.querystring.split('=')[1]);

    let cars = (!query) ? [] : await searchCars(query);

    ctx.render(searchTemplate(cars, beginSearch));

    function beginSearch() {
        let searchInput = document.getElementById('search-input');
        let search = Number(searchInput.value);

        if (!search) {
            return alert('Year is required and must be a number!');
        }

        searchInput.value = '';

        ctx.page.redirect('/search?year=' + search);
    }
}