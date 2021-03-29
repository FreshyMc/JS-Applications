import { html } from '../../node_modules/lite-html/lite-html.js';
import { login } from '../api/data.js';
const loginTemp = (onSubmit) => html `
<div class="row space-top">
<div class="col-md-12">
    <h1>Login User</h1>
    <p>Please fill all fields.</p>
</div>
</div>
<form @submit =${onSubmit}>
<div class="row space-top">
    <div class="col-md-4">
        <div class="form-group">
            <label class="form-control-label" for="email">Email</label>
            <input class="form-control" id="email" type="text" name="email">
        </div>
        <div class="form-group">
            <label class="form-control-label" for="password">Password</label>
            <input class="form-control" id="password" type="password" name="password">
        </div>
        <input type="submit" class="btn btn-primary" value="Login" />
    </div>
</div>
</form>
`;


export function viewLogin(ctx) {
    ctx.render(loginTemp(onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const fromData = new FormData(event.target);
        const data = Array.from(fromData.entries()).reduce((p, [k, v]) => Object.assign(p, {
            [k]: v
        }), {})

        const email = data.email.trim();
        const password = data.password.trim();
        if (email == '' || password == '') {

            return alert('All fields required');
        }
        const response = await login(email, password);
        
        event.target.reset();
        
        ctx.page.redirect('/');
    }

}