import { html } from '../../node_modules/lit-html/lit-html.js';
import { createArticle } from '../data/data.js';

let createTemplate = (onSubmit) => html`
<section id="create-page" class="content">
    <h1>Create Article</h1>

    <form id="create" @submit=${onSubmit}>
        <fieldset>
            <p class="field title">
                <label for="create-title">Title:</label>
                <input type="text" id="create-title" name="title" placeholder="Enter article title">
            </p>

            <p class="field category">
                <label for="create-category">Category:</label>
                <input type="text" id="create-category" name="category" placeholder="Enter article category">
            </p>
            <p class="field">
                <label for="create-content">Content:</label>
                <textarea name="content" id="create-content"></textarea>
            </p>

            <p class="field submit">
                <input class="btn submit" type="submit" value="Create">
            </p>

        </fieldset>
    </form>
</section>`;

export async function showCreate(ctx){
    ctx.render(createTemplate(onSubmit));

    async function onSubmit(ev){
        ev.preventDefault();

        let formData = new FormData(ev.target);

        let allowedTopics = ["JavaScript", "C#", "Java", "Python"];

        let title = formData.get('title').trim();
        let category = formData.get('category').trim();
        let content = formData.get('content').trim();

        if(!title || !category || !content){
            return alert('All fields are required!');
        }

        if(!allowedTopics.some((topic) => topic == category)){
            return alert('Category must be JavaScript, C#, Java, or Python!');
        }

        try{
            let data = await createArticle({title, category, content});

            if(data){
                ev.target.reset();
                
                ctx.page.redirect('/');
            }
        }catch(err){
            alert(err.message);
        }
    }
}