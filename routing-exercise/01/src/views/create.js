import page from '../../node_modules/page/page.mjs'
import { html } from '../../node_modules/lite-html/lite-html.js';
import { createRecord } from '../api/data.js';

const createTemp = (onSubmit, description, img, make, model, price, year) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Create New Furniture</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
<form @submit=${onSubmit}>
    <div class="row space-top">
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-make">Make</label>
                <input class=${`form-control ${make ? 'is-invalid' : 'valid' }`} id="new-make" type="text" name="make">
            </div>
            <div class="form-group has-success">
                <label class="form-control-label" for="new-model">Model</label>
                <input class=${`form-control ${model ? 'is-invalid' : 'valid' }`} id="new-model" type="text"
                    name="model">
            </div>
            <div class="form-group has-danger">
                <label class="form-control-label" for="new-year">Year</label>
                <input class=${`form-control ${year ? 'is-invalid' : 'valid' }`} id="new-year" type="number"
                    name="year">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-description">Description</label>
                <input class=${`form-control ${description ? 'is-invalid' : 'valid' }`} id="new-description" type="text"
                    name="description">
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-price">Price</label>
                <input class=${`form-control ${price ? 'is-invalid' : 'valid' }`} id="new-price" type="number"
                    name="price">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-image">Image</label>
                <input class=${`form-control ${img ? 'is-invalid' : 'valid' }`} id="new-image" type="text" name="img">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-material">Material (optional)</label>
                <input class="form-control" id="new-material" type="text" name="material">
            </div>
            <input type="submit" class="btn btn-primary" value="Create" />
        </div>
    </div>
</form>`;

export function viewCreate(ctx) {
    ctx.render(createTemp(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Array.from(formData.entries()).reduce((p, [k, v]) => Object.assign(p, {
            [k]: v
        }), {});

        if (data.description.length < 10 ||
            data.img.trim() == "" ||
            data.make.length < 4 ||
            data.model.length < 4 ||
            Number(data.price) < 1 ||
            data.year < 1950 ||
            data.year > 2050
        ) {
            ctx.render(createTemp(onSubmit,
                data.description.length < 10,
                data.img.trim() == "",
                data.make.length < 4,
                data.model.length < 4,
                Number(data.price) < 1,
                data.year < 1950 ||
                data.year > 2050));
            return;
        }
        const response = await createRecord(data);

        event.target.reset();

        page.redirect('/');
    }
}