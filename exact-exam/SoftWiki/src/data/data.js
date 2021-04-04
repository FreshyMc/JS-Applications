import * as api from './api.js';

const host = 'http://localhost:3030';

api.settings.host = host;

export async function searchArticles(query){
    let data = await api.get(`/data/wiki?where=title%20LIKE%20%22${query}%22`);

    return data;
}

export async function getRecentArticles(){
    let data = await api.get('/data/wiki?sortBy=_createdOn%20desc&distinct=category');

    return data;
}

export async function getAllArticles(){
    let data = await api.get('/data/wiki?sortBy=_createdOn%20desc');

    return data;
}

export async function getArticleById(id){
    let data = await api.get(`/data/wiki/${id}`);

    return data;
}

export async function createArticle(articleDetails){
    let data = await api.post('/data/wiki', articleDetails);

    return data;
}

export async function editArticle(articleDetails, id){
    let data = await api.put(`/data/wiki/${id}`, articleDetails);

    return data;
}

export async function deleteArticle(id){
    let data = await api.del(`/data/wiki/${id}`);

    return data;
}

export async function login(email, password){
    let data = await api.post('/users/login', {email, password});

    populateStorage(data);
}

export async function register(email, password){
    let data = await api.post('/users/register', {email, password});

    populateStorage(data);
}

export async function logout(){
    await api.get('/users/logout');

    clearStorage();
}

function populateStorage(data){
    sessionStorage.setItem('email', data.email);
    sessionStorage.setItem('authToken', data.accessToken);
    sessionStorage.setItem('id', data._id);
}

function clearStorage(){
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('id');
}