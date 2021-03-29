import { html } from '../../node_modules/lit-html/lit-html.js';

import { createMeme } from '../data/data.js';

let createTemplate = (onSubmit) => html`
<section id="create-meme">
    <form id="create-form" @submit=${onSubmit}>
        <div class="container">
            <h1>Create Meme</h1>
            <label for="title">Title</label>
            <input id="title" type="text" placeholder="Enter Title" name="title">
            <label for="description">Description</label>
            <textarea id="description" placeholder="Enter Description" name="description"></textarea>
            <label for="imageUrl">Meme Image</label>
            <input id="imageUrl" type="text" placeholder="Enter meme ImageUrl" name="imageUrl">
            <input type="submit" class="registerbtn button" value="Create Meme">
        </div>
    </form>
</section>
`;

export async function showCreate(ctx) {
    ctx.render(createTemplate(onSubmit));

    async function onSubmit(ev) {
        ev.preventDefault();

        let formData = new FormData(ev.target);

        let title = formData.get('title').trim();
        let description = formData.get('description').trim();
        let imageUrl = formData.get('imageUrl').trim();

        try {
            if (!title || !description || !imageUrl) {
                throw new Error('All field are required!');
            }

            await createMeme(title, description, imageUrl);

            ctx.page.redirect('/catalog');
        } catch (err) {
            return notify(err.message);
        }
    }
}