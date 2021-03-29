let doc = document;
let registerForm = doc.getElementById('registerForm');
let loginForm = doc.getElementById('loginForm');

registerForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    let userData = new FormData(e.target);

    registerUser(userData);
});

loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    let userData = new FormData(e.target);

    loginUser(userData);
});

async function registerUser(userData){
    let email = userData.get('email');
    let password = userData.get('password');
    let rePass = userData.get('rePass');

    if(email == '' || password == ''){
        return alert('All fields are required');
    }else if(password != rePass){
        return alert('Passwords do not match');
    }

    let request = await fetch('http://localhost:3030/users/register', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({password, email})
    });

    if(request.ok){
        registerForm.reset();

        let response = await request.json();

        sessionStorage.setItem('id', response._id);
        sessionStorage.setItem('authToken', response.accessToken);

        window.location.pathname = '/index.html';
    }else{
        alert('Registration failed!');
    }
}

async function loginUser(userData){
    let email = userData.get('email');
    let password = userData.get('password');

    if(email == '' || password == ''){
        return alert('All fields are required');
    }

    let request = await fetch('http://localhost:3030/users/login', {
        method: 'post',
        headers:  {'Content-Type': 'application/json'},
        body: JSON.stringify({password, email})
    });

    if(request.ok){
        let response = await request.json();

        sessionStorage.setItem('id', response._id);
        sessionStorage.setItem('authToken', response.accessToken);

        window.location.pathname = '/index.html';
    }else{
        alert('Login failed!');
    }
}