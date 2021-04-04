import { html } from '../../node_modules/lit-html/lit-html.js';
import { getArticleById, deleteArticle as apiDeleteArticle } from '../data/data.js';

let detailsTemplate = (article, isOwner, deleteArticle) => html`
<section id="details-page" class="content details">
    <h1>${article.title}</h1>

    <div class="details-content">
        <strong>Published in category ${article.category}</strong>
        <p>${article.content}</p>

        <div class="buttons">
            ${isOwner ? html`<a href="javascript:void(0)" @click=${deleteArticle} class="btn delete">Delete</a>
            <a href="/edit/${article._id}" class="btn edit">Edit</a>` : ''}
            <a href="/" class="btn edit">Back</a>
        </div>
    </div>
</section>`;

export async function showDetails(ctx) {
    let articleId = ctx.params.id;

    let article = await getArticleById(articleId);

    let isOwner = article._ownerId == sessionStorage.getItem('id');

    ctx.render(detailsTemplate(article, isOwner, deleteArticle));

    async function deleteArticle() {
        if (confirm('Are you sure to delete this article?')) {
            let data = await apiDeleteArticle(articleId);

            if (data) {
                ctx.page.redirect('/');
            }
        }
    }
}