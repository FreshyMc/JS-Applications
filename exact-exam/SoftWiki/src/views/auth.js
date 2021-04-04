import { html } from '../../node_modules/lit-html/lit-html.js';
import { login, register } from '../data/data.js';

let loginTemplate = (onSubmit) => html`
<section id="login-page" class="content auth">
    <h1>Login</h1>

    <form id="login" @submit=${onSubmit}>
        <fieldset>
            <blockquote>Knowledge is like money: to be of value it must circulate, and in circulating it can
                increase in quantity and, hopefully, in value</blockquote>
            <p class="field email">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="maria@email.com">
            </p>
            <p class="field password">
                <label for="login-pass">Password:</label>
                <input type="password" id="login-pass" name="password">
            </p>
            <p class="field submit">
                <input class="btn submit" type="submit" value="Log in">
            </p>
            <p class="field">
                <span>If you don't have profile click <a href="/register">here</a></span>
            </p>
        </fieldset>
    </form>
</section>`;

let registerTemplate = (onSubmit) => html`
<section id="register-page" class="content auth">
    <h1>Register</h1>

    <form id="register" @submit=${onSubmit}>
        <fieldset>
            <blockquote>Knowledge is not simply another commodity. On the contrary. Knowledge is never used up.
                It
                increases by diffusion and grows by dispersion.</blockquote>
            <p class="field email">
                <label for="register-email">Email:</label>
                <input type="email" id="register-email" name="email" placeholder="maria@email.com">
            </p>
            <p class="field password">
                <label for="register-pass">Password:</label>
                <input type="password" name="password" id="register-pass">
            </p>
            <p class="field password">
                <label for="register-rep-pass">Repeat password:</label>
                <input type="password" name="rep-pass" id="register-rep-pass">
            </p>
            <p class="field submit">
                <input class="btn submit" type="submit" value="Register">
            </p>
            <p class="field">
                <span>If you already have profile click <a href="/login">here</a></span>
            </p>
        </fieldset>
    </form>
</section>`;

export async function showLogin(ctx) {
    ctx.render(loginTemplate(onSubmit));

    async function onSubmit(ev){
        ev.preventDefault();

        let formData = new FormData(ev.target);

        let email = formData.get('email').trim();
        let password = formData.get('password').trim();

        if(!email || !password){
            return alert('All fields are required!');
        }

        try{
            await login(email, password);

            ev.target.reset();

            ctx.page.redirect('/');
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

        let email = formData.get('email').trim();
        let password = formData.get('password').trim();
        let rePass = formData.get('rep-pass').trim();

        if(!email || !password){
            return alert('All fields are required!');
        }

        if(password != rePass){
            return alert('Passwords don\'t match!');
        }

        try{
            await register(email, password);

            ev.target.reset();

            ctx.page.redirect('/');
        }catch(err){
            alert(err.message);
        }
    }
}
