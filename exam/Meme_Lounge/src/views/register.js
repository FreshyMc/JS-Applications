import { html } from '../../node_modules/lit-html/lit-html.js';

import { register } from '../data/data.js';
import { notify } from '../notify.js';

let registerTemplate = (onSubmit) => html`
<section id="register">
    <form id="register-form" @submit=${onSubmit}>
        <div class="container">
            <h1>Register</h1>
            <label for="username">Username</label>
            <input id="username" type="text" placeholder="Enter Username" name="username">
            <label for="email">Email</label>
            <input id="email" type="text" placeholder="Enter Email" name="email">
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="Enter Password" name="password">
            <label for="repeatPass">Repeat Password</label>
            <input id="repeatPass" type="password" placeholder="Repeat Password" name="repeatPass">
            <div class="gender">
                <input type="radio" name="gender" id="female" value="female">
                <label for="female">Female</label>
                <input type="radio" name="gender" id="male" value="male" checked>
                <label for="male">Male</label>
            </div>
            <input type="submit" class="registerbtn button" value="Register">
            <div class="container signin">
                <p>Already have an account?<a href="#">Sign in</a>.</p>
            </div>
        </div>
    </form>
</section>
`;

export async function showRegister(ctx) {
    ctx.render(registerTemplate(onSubmit));

    async function onSubmit(ev) {
        ev.preventDefault();

        let formData = new FormData(ev.target);

        let username = formData.get('username').trim();
        let email = formData.get('email').trim();
        let password = formData.get('password').trim();
        let rePass = formData.get('repeatPass').trim();
        let gender = formData.get('gender');

        try {
            if (!username || !password || !email) {
                throw new Error('All fields are required!');
            }

            if (rePass != password) {
                throw new Error('Passwords dont match!');
            }

            await register(username, email, password, gender);

            ctx.page.redirect('/catalog');
        } catch (err) {
            return notify(err.message);
        }
    }
}