import { crud } from './api.js';
import { showHome } from "./app.js";

export function setupCreate(createSection){
    createSection.querySelector('form').addEventListener('submit', async (e)=>{
        e.preventDefault();

        let formData = new FormData(e.target);

        let title = formData.get('title');
        let description = formData.get('description');
        let img = formData.get('imageUrl');

        if(!title.trim() || !description.trim() || !img.trim()){
            return alert('All fields are required');
        }

        let body = {title, description, img, _ownerId: sessionStorage.getItem('userId')};

        await crud.post('data/movies', body);
        
        e.target.reset();

        showHome();
    });
}