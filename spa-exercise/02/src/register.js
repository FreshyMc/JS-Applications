import { register } from './auth.js';
import { initApp } from './app.js';

export function setupRegister(registerSection) {
    registerSection.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();

        let formData = new FormData(e.target);

        let email = formData.get('email');
        let password = formData.get('password');
        let repeatPassword = formData.get('repeatPassword');

        if (!email.trim() || !password.trim() || !repeatPassword.trim()) {
            return alert('All fields are required');
        }else if(password.length < 6){
            return alert('The password should be at least 6 characters long');
        }else if(password != repeatPassword){
            return alert('The password doesn\'t match');
        }

        await register(email, password);

        initApp();
    });
}