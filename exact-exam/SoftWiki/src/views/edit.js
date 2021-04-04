import { html } from '../../node_modules/lit-html/lit-html.js';
import { editArticle, getArticleById } from '../data/data.js';

let editTemplate = (article, onSubmit) => html`
<section id="edit-page" class="content">
    <h1>Edit Article</h1>

    <form id="edit" @submit=${onSubmit}>
        <fieldset>
            <p class="field title">
                <label for="title">Title:</label>
                <input type="text" name="title" id="title" placeholder="Enter article title" .value=${article.title}>
            </p>

            <p class="field category">
                <label for="category">Category:</label>
                <input type="text" name="category" id="category" placeholder="Enter article category" .value=${article.category}>
            </p>
            <p class="field">
                <label for="content">Content:</label>
                <textarea name="content" id="content" .value=${article.content}></textarea>
            </p>

            <p class="field submit">
                <input class="btn submit" type="submit" value="Save Changes">
            </p>

        </fieldset>
    </form>
</section>`;

export async function showEdit(ctx){
    let articleId = ctx.params.id;
    let article = await getArticleById(articleId);

    ctx.render(editTemplate(article, onSubmit));

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
            let data = await editArticle({title, category, content}, articleId);

            if(data){
                ev.target.reset();
                
                ctx.page.redirect('/details/' + articleId);
            }
        }catch(err){
            alert(err.message);
        }
    }
}