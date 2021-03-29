import { html } from '../../node_modules/lit-html/lit-html.js';

import { getUserMemes } from '../data/data.js';

let profileTemplate = (memes) => html`
<section id="user-profile-page" class="user-profile">
    <article class="user-info">
        <img id="user-avatar-url" alt="user-profile" src="/images/${sessionStorage.getItem('gender')}.png">
        <div class="user-content">
            <p>Username: ${sessionStorage.getItem('username')}</p>
            <p>Email: ${sessionStorage.getItem('email')}</p>
            <p>My memes count: ${memes.length}</p>
        </div>
    </article>
    <h1 id="user-listings-title">User Memes</h1>
    <div class="user-meme-listings">

        ${ memes.length === 0 ? 
            html`<p class="no-memes">No memes in database.</p>` 
            : memes.map(memeTemplate)}
        
    </div>
</section>
`;

let memeTemplate = (meme) => html`
<div class="user-meme">
    <p class="user-meme-title">${meme.title}</p>
    <img class="userProfileImage" alt="meme-img" src=${meme.imageUrl}>
    <a class="button" href="/details/${meme._id}">Details</a>
</div>
`;

export async function showProfile(ctx){
    let memes = await getUserMemes();

    ctx.render(profileTemplate(memes));
}