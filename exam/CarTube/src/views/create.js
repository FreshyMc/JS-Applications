import { html } from '../../node_modules/lit-html/lit-html.js';
import { createListing } from '../data/data.js';

let createTemplate = (onSubmit) => html`
<section id="create-listing">
    <div class="container">
        <form id="create-form" @submit=${onSubmit}>
            <h1>Create Car Listing</h1>
            <p>Please fill in this form to create an listing.</p>
            <hr>

            <p>Car Brand</p>
            <input type="text" placeholder="Enter Car Brand" name="brand">

            <p>Car Model</p>
            <input type="text" placeholder="Enter Car Model" name="model">

            <p>Description</p>
            <input type="text" placeholder="Enter Description" name="description">

            <p>Car Year</p>
            <input type="number" placeholder="Enter Car Year" name="year">

            <p>Car Image</p>
            <input type="text" placeholder="Enter Car Image" name="imageUrl">

            <p>Car Price</p>
            <input type="number" placeholder="Enter Car Price" name="price">

            <hr>
            <input type="submit" class="registerbtn" value="Create Listing">
        </form>
    </div>
</section>`;

export async function showCreate(ctx){
    ctx.render(createTemplate(onSubmit));

    async function onSubmit(ev){
        ev.preventDefault();

        let formData = new FormData(ev.target);

        let brand = formData.get('brand').trim();
        let model = formData.get('model').trim();
        let description = formData.get('description').trim();
        let year = Number(formData.get('year').trim());
        let imageUrl = formData.get('imageUrl').trim();
        let price = Number(formData.get('price').trim());

        if(!brand || !model || !description || Number.isNaN(year) || !imageUrl || Number.isNaN(price)){
            return alert('All fields are required!');
        }

        if(year < 0 || price < 0){
            return alert('Year and price must be a positive number!');
        }

        try{
            await createListing({brand, model, description, year, imageUrl, price});

            ctx.page.redirect('/listings');
        }catch(err){
            alert(err.message);
        }
    }
}