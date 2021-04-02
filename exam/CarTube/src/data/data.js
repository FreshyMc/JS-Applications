import * as api from './api.js';

const host = 'http://localhost:3030';

api.settings.host = host;

export async function searchCars(query){
    let data = await api.get(`/data/cars?where=year%3D${query}`);

    return data;
}

export async function getCars(){
    let data = await api.get('/data/cars?sortBy=_createdOn%20desc');

    return data;
}

export async function getMyCars(){
    let userId = sessionStorage.getItem('id');

    let data = await api.get(`/data/cars?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);

    return data;
}

export async function getCar(carId){
    let data = await api.get(`/data/cars/${carId}`);

    return data;
}

export async function deleteCar(carId){
    let data = await api.del(`/data/cars/${carId}`);

    return data;
}

export async function editCar(carId, carDetails){
    let data = await api.put(`/data/cars/${carId}`, carDetails);
    
    return data;
}

export async function createListing(carDetails){
    let data = await api.post('/data/cars', carDetails);

    return data;
}

export async function login(username, password){
    let data = await api.post('/users/login', {username, password});

    populateStorage(data);
}

export async function register(username, password){
    let data = await api.post('/users/register', {username, password});

    populateStorage(data);
}

export async function logout(){
    let data = await api.get('/users/logout');

    clearStorage();
}

function populateStorage(data){
    sessionStorage.setItem('username', data.username);
    sessionStorage.setItem('id', data._id);
    sessionStorage.setItem('authToken', data.accessToken);
}

function clearStorage(){
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('authToken');
}