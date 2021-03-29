import { login } from './auth.js';
import { initApp } from './app.js';

export function setupLogin(loginSection) {
    loginSection.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();

        let formData = new FormData(e.target);

        let email = formData.get('email');
        let password = formData.get('password');

        if (!email.trim() || !password.trim()) {
            return alert('All fields are required');
        }

        await login(email, password);

        initApp();
    });
}