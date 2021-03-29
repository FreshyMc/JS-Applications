import { crud } from './api.js';
import { isLogged } from './auth.js';
import ce from './dom.js';
import { showHome, movieSection as section, editMovieSection as edit, main } from './app.js';

async function getMovieById(id) {
    let movies = await crud.get('data/movies');

    let movie = movies.find(m => m._id == id);

    return movie;
}

export async function previewMovie(id) {
    main.innerHTML = '';

    main.appendChild(section);

    let container = section.querySelector('.container');

    let movie = await getMovieById(id);

    createMoviePreview(movie, container);
}

async function createMoviePreview(movie, container) {
    container.innerHTML = '';

    let btns;

    if (isLogged() && movie._ownerId == sessionStorage.getItem('userId')) {
        let likesCount = await getMovieLikes(movie._id);

        btns = [
            ce('a', { class: 'btn btn-danger', href: 'javascript:void(0)', text: 'Delete', onClick: (e) => { deleteMovie(e, movie._id) } }),
            ce('a', { class: 'btn btn-warning', href: 'javascript:void(0)', text: 'Edit', onClick: (e) => { setupMovieEdit(e, movie._id) } }),
            ce('span', { class: 'enrolled-span', text: `Liked ${likesCount}` })
        ];
    } else if (isLogged()) {
        let likes = await getUserLikes(movie._id);

        if (likes > 0) {
            let likesCount = await getMovieLikes(movie._id);

            btns = [
                ce('span', { class: 'enrolled-span', text: `Liked ${likesCount}` })
            ];
        } else {
            btns = [
                ce('a', { class: 'btn btn-primary', href: 'javascript:void(0)', text: 'Like', onClick: (e) => { likeMovie(e, movie._id) } }),
            ];
        }
    } else {
        let likesCount = await getMovieLikes(movie._id);

        btns = [
            ce('span', { class: 'enrolled-span', text: `Liked ${likesCount}` })
        ];
    }

    let preview = ce('div', { class: 'row bg-light text-dark' },
        ce('h1', { class: 'w-100', text: movie.title }),
        ce('div', { class: 'col-md-8' },
            ce('img', { class: 'img-thumbnail', src: movie.img })
        ),
        ce('div', { class: 'col-md-4 text-center' },
            ce('h3', { class: 'my-3', text: 'Movie Description' }),
            ce('p', { text: movie.description }),
            ...btns
        )
    );

    container.appendChild(preview);
}

async function deleteMovie(e, id) {
    e.preventDefault();

    await crud.del(`data/movies/${id}`);

    showHome();
}

async function setupMovieEdit(e, id) {
    e.preventDefault();

    let movie = await getMovieById(id);

    main.innerHTML = '';

    main.appendChild(edit);

    let [title, imgUrl] = edit.querySelectorAll('input[type="text"]');
    let description = edit.querySelector('textarea');

    title.value = movie.title;
    imgUrl.value = movie.img;
    description.value = movie.description;

    edit.addEventListener('submit', async (e) => {
        e.preventDefault();

        let formData = new FormData(e.target);

        await editMovie(formData, id);

        e.target.reset();
    });
}

async function editMovie(data, id) {
    let title = data.get('title');
    let description = data.get('description');
    let img = data.get('imageUrl');

    let body = { title, description, img, _ownerId: sessionStorage.getItem('userId') };

    await crud.put(`data/movies/${id}`, body);

    previewMovie(id);
}

async function likeMovie(e, id) {
    e.preventDefault();

    let parent = e.target.parentNode;

    e.target.remove();

    let body = { movieId: id, _ownerId: sessionStorage.getItem('userId') };

    await crud.post('data/likes', body);

    let likesCount = await getMovieLikes(id);

    let likeEl = ce('span', { class: 'enrolled-span', text: `Liked ${likesCount}` });

    parent.appendChild(likeEl);
}

async function getUserLikes(id) {
    let userId = sessionStorage.getItem('userId');
    return await crud.get(`data/likes?where=movieId%3D%22${id}%22%20and%20_ownerId%3D%22${userId}%22&count`);
}

async function getMovieLikes(id) {
    return await crud.get(`data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`);
}