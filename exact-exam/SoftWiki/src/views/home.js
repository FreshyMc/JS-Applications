import { html } from '../../node_modules/lit-html/lit-html.js';
import { getRecentArticles } from '../data/data.js';

let homeTemplate = (articles) => html`
<section id="home-page" class="content">
    <h1>Recent Articles</h1>
    <section class="recent js">
        <h2>JavaScript</h2>
        ${articles['JavaScript'] != null ? html`<article>
            <h3>${articles['JavaScript'].title}</h3>
            <p>${articles['JavaScript'].content}</p>
            <a href="/details/${articles['JavaScript']._id}" class="btn details-btn">Details</a>
        </article>` : html`<h3 class="no-articles">No articles yet</h3>`}
    </section>
    <section class="recent csharp">
        <h2>C#</h2>
        ${articles['C#'] != null ? html`<article>
            <h3>${articles['C#'].title}</h3>
            <p>${articles['C#'].content}</p>
            <a href="/details/${articles['C#']._id}" class="btn details-btn">Details</a>
        </article>` : html`<h3 class="no-articles">No articles yet</h3>`}
    </section>
    <section class="recent java">
        <h2>Java</h2>
        ${articles['Java'] != null ? html`<article>
            <h3>${articles['Java'].title}</h3>
            <p>${articles['Java'].content}</p>
            <a href="/details/${articles['Java']._id}" class="btn details-btn">Details</a>
        </article>` : html`<h3 class="no-articles">No articles yet</h3>`}
    </section>
    <section class="recent python">
        <h2>Python</h2>
        ${articles['Python'] != null ? html`<article>
            <h3>${articles['Python'].title}</h3>
            <p>${articles['Python'].content}</p>
            <a href="/details/${articles['Python']._id}" class="btn details-btn">Details</a>
        </article>` : html`<h3 class="no-articles">No articles yet</h3>`}
    </section>
</section>`;

export async function showHome(ctx) {
    let recentArticles = await getRecentArticles();

    let articlesByTopic = recentArticles.reduce((acc, article) => {
        acc[article.category] = article;

        return acc;
    }, { "JavaScript": null, "C#": null, "Java": null, "Python": null });

    ctx.render(homeTemplate(articlesByTopic));
}