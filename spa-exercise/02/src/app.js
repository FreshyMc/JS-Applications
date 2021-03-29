import { crud } from './api.js';
import ce from './dom.js';
import { isLogged, logout } from './auth.js';
import { setupLogin } from './login.js';
import { setupRegister } from './register.js';
import { setupCreate } from './create.js';
import { previewMovie } from './preview.js';

let doc = document;
export let main = doc.querySelector('main');

let homeSection = doc.getElementById('home-page');
let moviesHeading = doc.getElementById('movies-heading');
let addMovieBtn = doc.getElementById('add-movie-button');
let moviesSection = doc.getElementById('movie');
let moviesContent = document.getElementById('movies');
let addMovieSection = doc.getElementById('add-movie');
export let movieSection = doc.getElementById('movie-example');
export let editMovieSection = doc.getElementById('edit-movie');
let loginSection = doc.getElementById('form-login');
let registerSection = doc.getElementById('form-sign-up');
let navigation = doc.querySelector('nav');

function setupView(sections) {
    return showView;

    function showView() {
        main.innerHTML = '';

        if (!isLogged()) {
            [...sections].filter(s => !s.classList.contains('logged')).forEach(s => main.appendChild(s));
        } else {
            [...sections].forEach(s => main.appendChild(s));
        }
    }
}

setupLogin(loginSection);
setupRegister(registerSection);
setupCreate(addMovieSection);

const views = {
    'homeLink': async () => { await loadMovies(); setupView([homeSection, moviesHeading, addMovieBtn, moviesSection])() },
    'loginLink': setupView([loginSection]),
    'registerLink': setupView([registerSection]),
    'logoutLink': async () => { await logout() },
    'createLink': setupView([addMovieSection]),
    'previewMovie': async (id) => {await previewMovie(id); }
};

export function showHome() {
    views['homeLink']();
}

navigation.addEventListener('click', (e) => {
    if (e.target.tagName == 'A') {
        e.preventDefault();
        views[e.target.id]();
    }
});

addMovieBtn.addEventListener('click', (e)=>{
    if(e.target.tagName == 'A'){
        e.preventDefault();
        views[e.target.id]();
    }
});

moviesSection.addEventListener('click', (e)=>{
    if(e.target.tagName == 'BUTTON'){
        e.preventDefault();
        views['previewMovie'](e.target.id);
    }
});

function setupNavigation() {
    if (isLogged()) {
        navigation.querySelector('#welcome-message').textContent = `Welcome, ${sessionStorage.getItem('email')}`;
        [...navigation.querySelectorAll('.guest')].forEach(el => el.style.display = 'none');
        [...navigation.querySelectorAll('.user')].forEach(el => el.style.display = 'block');
    } else {
        [...navigation.querySelectorAll('.guest')].forEach(el => el.style.display = 'block');
        [...navigation.querySelectorAll('.user')].forEach(el => el.style.display = 'none');
    }
}

export function initApp() {
    setupNavigation();
    showHome();
}

initApp();

async function loadMovies() {
    let movies = await crud.get('data/movies');

    moviesContent.innerHTML = '';

    movies.map(createMovieCard).forEach(el => moviesContent.appendChild(el));
}

function createMovieCard(movie) {
    let card = `
        <img
        class="card-img-top"
        src=${movie.img}
        alt="Card image cap"
        width="400"
    />
    <div class="card-body">
        <h4 class="card-title">${movie.title}</h4>
    </div>
    <div class="card-footer">
            <button id="${movie._id}" type="button" class="btn btn-info movieDetailsLink">
            Details
            </button>
    </div>
    `;

    let el = ce('div', { class: 'card mb-4', inner: card});

    return el;
}