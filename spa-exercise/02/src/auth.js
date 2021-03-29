import { crud } from './api.js';

const loginEndpoint = 'users/login';
const registerEndpoint = 'users/register';
const logoutEndpoint = 'users/logout';

export async function login(email, password) {
    if (!isLogged()) {
        let data = await crud.post(loginEndpoint, { email, password });

        populateStorage(data);
    }
}

export async function register(email, password) {
    if (!isLogged()) {
        let data = await crud.post(registerEndpoint, { email, password });

        populateStorage(data);
    }
}

export async function logout() {
    if (isLogged()) {
        await crud.get(logoutEndpoint);

        clearStorage();

        window.location.pathname = '/';
    }
}

function populateStorage(data) {
    sessionStorage.setItem('authToken', data.accessToken);
    sessionStorage.setItem('userId', data._id);
    sessionStorage.setItem('email', data.email);
}

function clearStorage() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
}

export function isLogged() {
    return (sessionStorage.getItem('authToken') !== null) ? true : false;
}