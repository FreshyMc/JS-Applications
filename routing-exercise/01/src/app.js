import page from '../../node_modules/page/page.mjs'
import { render } from '../node_modules/lite-html/lite-html.js';

import { viewCreate } from './views/create.js';
import { viewDashboard } from './views/dashboard.js';
import { viewDetails } from './views/details.js';
import { viewEdit } from './views/edit.js';
import { viewLogin } from './views/login.js';
import { viewMyFurniture } from './views/my-furniture.js';
import { viewRegister } from './views/register.js';
import * as api from './api/data.js';

window.api = api;
const main = document.querySelector('.container');



page('/', loadData, viewDashboard);
page('/index.html', loadData, viewDashboard);
page('/create', loadData, viewCreate);
page('/details/:id', loadData, viewDetails);
page('/edit/:id', loadData, viewEdit);
page('/login', loadData, viewLogin);
page('/my-furniture', loadData, viewMyFurniture);
page('/register', loadData, viewRegister);

page.start();
document.querySelector('#logoutBtn').addEventListener('click', async() => {
    await api.logout();
    page.redirect('/');
});


function loadData(ctx, next) {
    if (sessionStorage.getItem('token') != null) {
        document.querySelector('#user').style.display = 'inline-block';
        document.querySelector('#guest').style.display = 'none';
    } else {
        document.querySelector('#user').style.display = 'none';
        document.querySelector('#guest').style.display = 'inline-block';
    }
    ctx.render = (content) => render(content, main);

    next();
}