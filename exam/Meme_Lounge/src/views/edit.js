import { html } from '../../node_modules/lit-html/lit-html.js';

import { getMemeById, editMemeById } from '../data/data.js';

import { notify } from '../notify.js';

let editTemplate = (meme, onSubmit) => html`
<section id="edit-meme">
    <form id="edit-form" @submit=${onSubmit}>
        <h1>Edit Meme</h1>
        <div class="container">
            <label for="title">Title</label>
            <input id="title" type="text" placeholder="Enter Title" name="title" .value=${meme.title}>
            <label for="description">Description</label>
            <textarea id="description" placeholder="Enter Description" name="description"
                .value=${meme.description}></textarea>
            <label for="imageUrl">Image Url</label>
            <input id="imageUrl" type="text" placeholder="Enter Meme ImageUrl" name="imageUrl" .value=${meme.imageUrl}>
            <input type="submit" class="registerbtn button" value="Edit Meme">
        </div>
    </form>
</section>
`;

export async function showEdit(ctx) {
    let memeId = ctx.params.id;

    let meme = await getMemeById(memeId);

    ctx.render(editTemplate(meme, onSubmit));

    async function onSubmit(ev) {
        ev.preventDefault();

        let formData = new FormData(ev.target);

        let title = formData.get('title').trim();
        let description = formData.get('description').trim();
        let imageUrl = formData.get('imageUrl').trim();

        try {
            if (!title || !description || !imageUrl) {
                throw new Error('All fields are required!');
            }

            await editMemeById(memeId, title, description, imageUrl);

            ctx.page.redirect('/details/' + memeId);
        } catch (err) {
            return notify(err.message);
        }
    }
}