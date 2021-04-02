import { html } from '../../node_modules/lit-html/lit-html.js';

import { login, register } from '../data/data.js';

let loginTemplate = (onSubmit) => html`
<section id="login">
    <div class="container">
        <form id="login-form" @submit=${onSubmit}>
            <h1>Login</h1>
            <p>Please enter your credentials.</p>
            <hr>

            <p>Username</p>
            <input placeholder="Enter Username" name="username" type="text">

            <p>Password</p>
            <input type="password" placeholder="Enter Password" name="password">
            <input type="submit" class="registerbtn" value="Login">
        </form>
        <div class="signin">
            <p>Dont have an account?
                <a href="/register">Sign up</a>.
            </p>
        </div>
    </div>
</section>`;

let registerTemplate = (onSubmit) => html`
<section id="register">
    <div class="container">
        <form id="register-form" @submit=${onSubmit}>
            <h1>Register</h1>
            <p>Please fill in this form to create an account.</p>
            <hr>

            <p>Username</p>
            <input type="text" placeholder="Enter Username" name="username" required>

            <p>Password</p>
            <input type="password" placeholder="Enter Password" name="password" required>

            <p>Repeat Password</p>
            <input type="password" placeholder="Repeat Password" name="repeatPass" required>
            <hr>

            <input type="submit" class="registerbtn" value="Register">
        </form>
        <div class="signin">
            <p>Already have an account?
                <a href="/login">Sign in</a>.
            </p>
        </div>
    </div>
</section>`;

export async function showLogin(ctx){
    ctx.render(loginTemplate(onSubmit));

    async function onSubmit(ev){
        ev.preventDefault();

        let formData = new FormData(ev.target);

        let username = formData.get('username').trim();
        let password = formData.get('password').trim();

        if(!username || !password){
            return alert('All fields are required!');
        }

        try{
            await login(username, password);

            ev.target.reset();

            ctx.page.redirect('/listings');
        }catch(err){
            alert(err.message);
        }
    }
}

export async function showRegister(ctx){
    ctx.render(registerTemplate(onSubmit));

    async function onSubmit(ev){
        ev.preventDefault();

        let formData = new FormData(ev.target);

        let username = formData.get('username').trim();
        let password = formData.get('password').trim();
        let rePass = formData.get('repeatPass').trim();

        if(!username || !password){
            return alert('All fields are required!');
        }

        if(password != rePass){
            return alert('Passwords don\'t match!');
        }

        try{
            await register(username, password);

            ev.target.reset();

            ctx.page.redirect('/listings');
        }catch(err){
            alert(err.message);
        }
    }
}