import { html } from '../../node_modules/lit-html/lit-html.js';
import { searchArticles } from '../data/data.js';

let searchTemplate = (articles, beginSearch) => html`
<section id="search-page" class="content">
    <h1>Search</h1>
    <form id="search-form" @submit=${beginSearch}>
        <p class="field search">
            <input type="text" placeholder="Search by article title" name="search">
        </p>
        <p class="field submit">
            <input class="btn submit" type="submit" value="Search">
        </p>
    </form>
    <div class="search-container">
        ${articles.length === 0 ? html`<h3 class="no-articles">No matching articles</h3>` : articles.map(articleTemplate) }
    </div>
</section>`;

let articleTemplate = (article) => html`
<a class="article-preview" href="/details/${article._id}">
    <article>
        <h3>Topic: <span>${article.title}</span></h3>
        <p>Category: <span>${article.category}</span></p>
    </article>
</a>`;

export async function showSearch(ctx) {
    let query = ctx.querystring.split('=')[1];

    let articles = (!query) ? [] : await searchArticles(query);

    ctx.render(searchTemplate(articles, beginSearch));

    async function beginSearch(ev) {
        ev.preventDefault();

        let formData = new FormData(ev.target);

        let searchQuery = formData.get('search').trim();

        if (!searchQuery) {
            return alert('Search value is required!');
        }

        ev.target.reset();

        ctx.page.redirect('/search?title=' + searchQuery);
    }
}