const host = 'http://localhost:3030/';

export const crud = {
    post,
    get,
    put,
    del
};

function appendAuthHeader(headers) {
    let token = sessionStorage.getItem('authToken');

    if (token !== null) {
        if(!headers){
            return { 'X-Authorization': token };
        }else{
            headers['X-Authorization'] = token;

            return headers;
        }
    }
}

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
        if(err instanceof SyntaxError || err instanceof TypeError){
            return err;
        }else{
            alert(err);
        }
    }
}

async function post(endpoint, body) {
    let headers = appendAuthHeader({ 'Content-Type': 'application/json' });
    let options = { method: 'post', headers, body: JSON.stringify(body) };

    return await sendRequest(host + endpoint, options);
}

async function get(endpoint) {
    let headers = appendAuthHeader();
    return await sendRequest(host + endpoint, {headers});
}

async function put(endpoint, body) {
    let headers = appendAuthHeader({ 'Content-Type': 'application/json' });
    let options = { method: 'put', headers, body: JSON.stringify(body) };

    return await sendRequest(host + endpoint, options);
}

async function del(endpoint) {
    let headers = appendAuthHeader();
    let options = { method: 'delete', headers };

    return await sendRequest(host + endpoint, options);
}