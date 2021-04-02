import { html, render } from '../node_modules/lit-html/lit-html.js';
import page from '../node_modules/page/page.mjs';

import { logout as apiLogout } from './data/data.js';
import { showLogin, showRegister } from './views/auth.js';
import { showCreate } from './views/create.js';
import { showEdit } from './views/edit.js';
import { showHome } from './views/home.js';
import { showListing } from './views/listing.js';
import { showListings } from './views/listings.js';
import { showProfile } from './views/profile.js';
import { showSearch } from './views/search.js';

let main = document.getElementById('site-content');

document.getElementById('logout-link').addEventListener('click', logout);

page('/', decorateContext, showHome);
page('/login', decorateContext, showLogin);
page('/register', decorateContext, showRegister);
page('/listings', decorateContext, showListings);
page('/create', decorateContext, showCreate);
page('/listing/:id', decorateContext, showListing);
page('/edit/:id', decorateContext, showEdit);
page('/profile', decorateContext, showProfile);
page('/search', decorateContext, showSearch);

page.start();


async function decorateContext(ctx, next) {
    setupNavigation();

    ctx.render = (content) => render(content, main);

    next();
}

function setupNavigation() {
    let username = sessionStorage.getItem('username');

    if (username != null) {
        document.getElementById('guest').style.display = 'none';
        document.getElementById('profile').style.display = '';
        document.getElementById('user-greeting').textContent = `Welcome ${username}`;
    } else {
        document.getElementById('guest').style.display = '';
        document.getElementById('profile').style.display = 'none';
    }
}

async function logout() {
    await apiLogout();

    page.redirect('/');
}