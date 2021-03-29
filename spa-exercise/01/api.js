const host = 'http://localhost:3030/';

export const crud = {
    post,
    get,
    put,
    del
};

async function sendRequest(url, options) {
    try {
        let request = await fetch(url, options);

        if (!request.ok) {
            let error = await request.json();

            throw new Error(error.message);
        } else {
            return await request.json();
        }
    } catch (err) {
        alert(err);
    }
}

async function post(endpoint, body) {
    let options = { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };

    return await sendRequest(host + endpoint, options);
}

async function get(endpoint) {
    return await sendRequest(host + endpoint);
}

async function put(endpoint, body) {
    let options = { method: 'put', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };

    return await sendRequest(host + endpoint, options);
}

async function del(endpoint) {
    let options = { method: 'delete' };

    return await sendRequest(host + endpoint, options);
}