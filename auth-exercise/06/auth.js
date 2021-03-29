let doc = document;
let loginForm = doc.getElementById('loginForm');
let registerForm = doc.getElementById('registerForm');

loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    let formData = new FormData(e.target);

    loginUser(formData);
});

async function loginUser(loginData){
    //Input validation
    if([...loginData.values()].map(v => v.trim()).includes('')){
        return alert('All fields are required');
    }

    let body = {email: loginData.get('email'), password: loginData.get('password')};

    let request = await fetch('http://localhost:3030/users/login', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    });

    if(request.ok){
        let data = await request.json();

        sessionStorage.setItem('authToken', data.accessToken);
        sessionStorage.setItem('id', data._id);

        window.location.pathname = 'homeLogged.html';
    }else{
        alert('Login failed');
    }
}

async function logoutUser(){
    let request = await fetch('http://localhost:3030/users/logout', {
        headers: {'X-Authorization': sessionStorage.getItem('authToken')}
    });

    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('id');
}