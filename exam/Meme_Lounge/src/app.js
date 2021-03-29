import { render, html } from '../node_modules/lit-html/lit-html.js';
import page from '../node_modules/page/page.mjs';

import { showHome } from './views/home.js';
import { showLogin } from './views/login.js';
import { showRegister } from './views/register.js';
import { logout, allMemes } from './data/data.js';
import { showMemes } from './views/catalog.js';
import { showCreate } from './views/create.js';
import { showMeme } from './views/details.js';
import { showEdit } from './views/edit.js';
import { showProfile } from './views/profile.js';
import { notify } from './notify.js';

window.memes = allMemes;

window.notify = notify;

let main = document.querySelector('main');

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();

    page.redirect('/');
});

function setupNavigation() {
    let email = sessionStorage.getItem('email');

    if (email != null) {
        document.querySelector('.guest').style.display = 'none';
        document.querySelector('.user').style.display = '';
        document.querySelector('.profile span').textContent = `Welcome, ${email}`;
    } else {
        document.querySelector('.guest').style.display = '';
        document.querySelector('.user').style.display = 'none';
    }
}

page('/', decorateContext, showHome);
page('/login', decorateContext, showLogin);
page('/register', decorateContext, showRegister);
page('/catalog', decorateContext, showMemes);
page('/create-meme', decorateContext, showCreate);
page('/details/:id', decorateContext, showMeme);
page('/edit/:id', decorateContext, showEdit);
page('/profile', decorateContext, showProfile);

page.start();

async function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.page = page;

    setupNavigation();

    next();
}