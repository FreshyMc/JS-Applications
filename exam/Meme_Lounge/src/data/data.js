import * as api from './api.js';

const host = 'http://localhost:3030';

api.settings.host = host;

export async function allMemes(){
    let data = await api.get('/data/memes?sortBy=_createdOn%20desc');

    return data;
}

export async function createMeme(title, description, imageUrl){
    let data = await api.post('/data/memes', {title, description, imageUrl});

    return data;
}

export async function getMemeById(id){
    let data = await api.get(`/data/memes/${id}`);

    return data;
}

export async function delMeme(id){
    let data = await api.del(`/data/memes/${id}`);

    return data;
}

export async function getUserMemes(){
    let userId = sessionStorage.getItem('userId');

    let data = await api.get(`/data/memes?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);

    return data;
}

export async function editMemeById(id, title, description, imageUrl){
    let data = await api.put(`/data/memes/${id}`, {title, description, imageUrl});

    return data;
}

export async function login(email, password){
    let data = await api.post('/users/login', {email, password});

    sessionStorage.setItem('authToken', data.accessToken);
    sessionStorage.setItem('userId', data._id);
    sessionStorage.setItem('username', data.username);
    sessionStorage.setItem('email', data.email);
    sessionStorage.setItem('gender', data.gender);
}

export async function register(username, email, password, gender){
    let data = await api.post('/users/register', {username, email, password, gender});

    sessionStorage.setItem('authToken', data.accessToken);
    sessionStorage.setItem('userId', data._id);
    sessionStorage.setItem('username', data.username);
    sessionStorage.setItem('email', data.email);
    sessionStorage.setItem('gender', data.gender);
}

export async function logout(){
    let data = await api.get('/users/logout');

    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('gender');

    return data;
}