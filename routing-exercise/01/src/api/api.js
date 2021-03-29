export const settings = {
    host: ''
};

async function request(url, options) {
    try {
        const response = await fetch(url, options);
        if (response.ok == false) {
            const error = await response.json();
            throw new Error(error.message);
        }
        try {
            const data = await response.json();
            return data;
        } catch (err) {
            return response;
        }
    } catch (err) {
        alert(err.message);
        throw err;
    }
}

function getOptions(method, body) {
    const options = {
        method,
        headers: {}
    };
    const token = sessionStorage.getItem('token');
    if (token != null) {
        options.headers['X-Authorization'] = token;
    }
    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }
    return options;
}

export async function get(url) {
    return await request(url, getOptions('get'));
}

export async function post(url, data) {
    return await request(url, getOptions('post', data));
}
export async function put(url, data) {
    return await request(url, getOptions('put', data));
}

export async function del(url) {
    return await request(url, getOptions('delete'));
}

export async function login(email, password) {

    const response = await post(settings.host + 'users/login', { email, password });
    sessionStorage.setItem('token', response.accessToken);
    sessionStorage.setItem('email', response.email);
    sessionStorage.setItem('id', response._id);
    return response;
}
export async function register(email, password) {
    const response = await post(settings.host + 'users/register', { email, password });
    sessionStorage.setItem('token', response.accessToken);
    sessionStorage.setItem('email', response.email);
    sessionStorage.setItem('id', response._id);
    return response;
}

export async function logout() {
    const response = await get(settings.host + 'users/logout');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('id');
    return response;
}