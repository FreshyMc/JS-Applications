import { html } from '../../node_modules/lit-html/lit-html.js';
import { editCar, getCar } from '../data/data.js';

let editTemplate = (car, onSubmit) => html`
<section id="edit-listing">
    <div class="container">

        <form id="edit-form" @submit=${onSubmit}>
            <h1>Edit Car Listing</h1>
            <p>Please fill in this form to edit an listing.</p>
            <hr>

            <p>Car Brand</p>
            <input type="text" placeholder="Enter Car Brand" name="brand" .value=${car.brand}>

            <p>Car Model</p>
            <input type="text" placeholder="Enter Car Model" name="model" .value=${car.model}>

            <p>Description</p>
            <input type="text" placeholder="Enter Description" name="description" .value=${car.description}>

            <p>Car Year</p>
            <input type="number" placeholder="Enter Car Year" name="year" .value=${car.year}>

            <p>Car Image</p>
            <input type="text" placeholder="Enter Car Image" name="imageUrl" .value=${car.imageUrl}>

            <p>Car Price</p>
            <input type="number" placeholder="Enter Car Price" name="price" .value=${car.price}>

            <hr>
            <input type="submit" class="registerbtn" value="Edit Listing">
        </form>
    </div>
</section>`;

export async function showEdit(ctx){
    let carId = ctx.params.id;

    let car = await getCar(carId);

    ctx.render(editTemplate(car, onSubmit));

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
            await editCar(carId, {brand, model, description, year, imageUrl, price});

            ctx.page.redirect('/listing/' + carId);
        }catch(err){
            alert(err.message);
        }
    }
}