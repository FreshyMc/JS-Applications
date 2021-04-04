import { render, html } from '../node_modules/lit-html/lit-html.js';
import page from '../node_modules/page/page.mjs';

import { logout as apiLogout, getAllArticles } from './data/data.js';
import { showLogin, showRegister } from './views/auth.js';
import { showHome } from './views/home.js';
import { showCatalogue } from './views/catalog.js';
import { showDetails } from './views/details.js';
import { showCreate } from './views/create.js';
import { showEdit } from './views/edit.js';
import { showSearch } from './views/search.js';

window.articles = getAllArticles;

let main = document.getElementById('main-content');

document.getElementById('logout-link').addEventListener('click', logout);

page('/', decorateContext, showHome);
page('/login', decorateContext, showLogin);
page('/register', decorateContext, showRegister);
page('/catalogue', decorateContext, showCatalogue);
page('/details/:id', decorateContext, showDetails);
page('/create', decorateContext, showCreate);
page('/edit/:id', decorateContext, showEdit);
page('/search', decorateContext, showSearch);

page.start();

async function decorateContext(ctx, next) {
    setupNavigation();

    ctx.render = (content) => render(content, main);

    next();
}

function setupNavigation() {
    let email = sessionStorage.getItem('email');

    if (email != null) {
        document.getElementById('guest').style.display = 'none';
        document.getElementById('user').style.display = '';
    } else {
        document.getElementById('guest').style.display = '';
        document.getElementById('user').style.display = 'none';
    }
}

async function logout() {
    await apiLogout();

    setupNavigation();
}
