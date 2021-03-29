import { html } from '../../node_modules/lit-html/lit-html.js';

import { getMemeById, delMeme } from '../data/data.js';

let memeTemplate = (meme, isOwner, deleteMeme) => html`
<section id="meme-details">
    <h1>Meme Title: ${meme.title}</h1>
    <div class="meme-details">
        <div class="meme-img">
            <img alt="meme-alt" src=${meme.imageUrl}>
        </div>
        <div class="meme-description">
            <h2>Meme Description</h2>
            <p>
                ${meme.description}
            </p>

            ${isOwner ? html`
            <!-- Buttons Edit/Delete should be displayed only for creator of this meme  -->
            <a class="button warning" href="/edit/${meme._id}">Edit</a>
            <button class="button danger" @click=${deleteMeme}>Delete</button>
            ` : ''}
        </div>
    </div>
</section>
`;

export async function showMeme(ctx) {
    let memeId = ctx.params.id;

    let meme = await getMemeById(memeId);

    let isOwner = sessionStorage.getItem('userId') == meme._ownerId;

    ctx.render(memeTemplate(meme, isOwner, deleteMeme));

    async function deleteMeme(){
        try{
            if(confirm('Are you sure to delete this meme?')){
                await delMeme(memeId);
                
                ctx.page.redirect('/catalog');
            }
        }catch(err){
            return alert(err.message);
        }
    }
}