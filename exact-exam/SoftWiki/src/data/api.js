export const settings = {
    host: ''
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

        if (request.ok == false) {
            let error = await request.json();

            throw new Error(error.message);
        }
        
        try{
            let data = await request.json();

            return data;
        }catch(err){
            return request;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function post(endpoint, body) {
    let headers = appendAuthHeader({ 'Content-Type': 'application/json' });
    let options = { method: 'post', headers, body: JSON.stringify(body) };

    return await sendRequest(settings.host + endpoint, options);
}

export async function get(endpoint) {
    let headers = appendAuthHeader();
    return await sendRequest(settings.host + endpoint, {headers});
}

export async function put(endpoint, body) {
    let headers = appendAuthHeader({ 'Content-Type': 'application/json' });
    let options = { method: 'put', headers, body: JSON.stringify(body) };

    return await sendRequest(settings.host + endpoint, options);
}

export async function del(endpoint) {
    let headers = appendAuthHeader();
    let options = { method: 'delete', headers };

    return await sendRequest(settings.host + endpoint, options);
}