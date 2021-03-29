import { crud } from './api.js';

let doc = document;
let main = doc.querySelector('main');
let homePage = doc.getElementById('homePage');
let commentPage = doc.getElementById('commentTopic');
let topicForm = doc.getElementById('createTopic');
let commentForm = doc.getElementById('commentForm');
let commentsWrapper = doc.getElementById('comments');
let topicSection = doc.getElementById('topic-section');
let homeBtn = doc.getElementById('homeBtn');

main.innerHTML = '';

function loadHomePage() {
    main.innerHTML = '';
    main.appendChild(homePage);
}

loadHomePage();

function loadCommentsPage(id) {
    main.innerHTML = '';
    main.appendChild(commentPage);
    commentForm.querySelector('input[name="id"]').value = id;
}

homeBtn.addEventListener('click', loadHomePage);

topicSection.addEventListener('click', (e) => {
    if (e.target.id != 'topic-section') {
        let el = e.target;

        while (el.className != 'topic-container') {
            el = el.parentNode;
        }

        let id = el.getAttribute('data-topic-id');

        loadCommentsPage(id);

        loadComments(id);
    }
});

const topicsEndpoint = 'jsonstore/collections/myboard/posts/';
const commentsEndpoint = 'jsonstore/collections/myboard/comments/';

topicForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    createTopic(formData);
});

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    createComment(formData);
});

async function createTopic(data) {
    let title = data.get('topicName');
    let username = data.get('username');
    let content = data.get('postText');
    let [month, day, year] = new Date().toLocaleDateString().split('/');
    let [hour, minute, second] = new Date().toLocaleTimeString().split(/:| /);
    let dateString = `${day}.${month}.${year} ${hour}:${minute}:${second}`;

    if (!title.trim() || !username.trim() || !content.trim()) {
        return alert('All fields are required');
    }

    let body = { title, username, content, time: dateString };

    let response = await crud.post(topicsEndpoint, body);

    topicForm.reset();

    getTopics();
}

async function getTopics() {
    let topics = await crud.get(topicsEndpoint);

    topicSection.innerHTML = '';

    [...Object.values(topics)].map(createTopicEl).forEach(t => topicSection.appendChild(t));
}

getTopics();

function createTopicEl(data) {
    console.log(data);

    let el = ce('div', { class: 'topic-container', 'data-topic-id': data._id },
        ce('div', { class: 'topic-name-wrapper' },
            ce('div', { class: 'topic-name' },
                ce('a', { href: 'javascript:void(0)', class: 'normal' },
                    ce('h2', { text: data.title })
                ),
                ce('div', { class: 'columns' },
                    ce('div', null,
                        ce('p', { text: 'Date: ' }, ce('time', { text: data.time })),
                        ce('div', { class: 'nick-name', text: 'Username: ' }, ce('span', { text: data.username }))
                    )
                )
            )
        )
    );

    return el;
}

async function createComment(data) {
    let username = data.get('username');
    let content = data.get('postText');
    let id = data.get('id');
    let [month, day, year] = new Date().toLocaleDateString().split('/');
    let [hour, minute, second] = new Date().toLocaleTimeString().split(/:| /);
    let dateString = `${day}.${month}.${year} ${hour}:${minute}:${second}`;

    if (!username.trim() || !content.trim()) {
        return alert('All fields are required');
    }

    let body = { postId: id, username, content, time: dateString };

    let response = await crud.post(commentsEndpoint, body);

    commentForm.reset();

    loadComments(id);
}

async function loadComments(id) {
    let comments = await crud.get(commentsEndpoint);

    commentsWrapper.innerHTML = '';

    [...Object.values(comments)].filter(c => c.postId == id).map(createCommentEl).forEach(c => commentsWrapper.appendChild(c));
}

function createCommentEl(data) {
    console.log(data);

    let comment = data.content.split('\n').map(line => ce('p', {text: line}));

    let el = ce('div', { class: 'comment' },
        ce('header', { class: 'header' }, ce('p', {inner: `<span>${data.username}</span> posted on <time>${data.time}</time>`})),
        ce('div', {class: 'comment-main'}, 
            ce('div', {class: 'userdetails'}, ce('img', {src: './static/profile.png', alt: 'avatar'})),
            ce('div', {class: 'post-content'}, ...comment)
            )
    );

    return el;
}

function ce(type, attributes, ...childs) {
    let el = doc.createElement(type);

    Object.entries(attributes || {}).map(([attr, val]) => {
        if (attr == 'text') {
            el.textContent = val;
        } else if (attr == 'inner') {
            el.innerHTML = val;
        } else {
            el.setAttribute(attr, val);
        }
    });

    childs.forEach(c => el.appendChild(c));

    return el;
}