function attachEvents() {
    let doc = document;
    let loadPostsBtn = doc.getElementById('btnLoadPosts');
    let viewPostBtn = doc.getElementById('btnViewPost');
    let postSelect = doc.getElementById('posts');
    let postTitle = doc.getElementById('post-title');
    let postContent = doc.getElementById('post-body');
    let postComments = doc.getElementById('post-comments');

    loadPostsBtn.addEventListener('click', loadPosts);

    viewPostBtn.addEventListener('click', viewPost);

    async function loadPosts() {
        let request = await fetch('http://localhost:3030/jsonstore/blog/posts');

        let response = await request.json();

        let data = Object.values(response);

        data.map(p => {
            let option = doc.createElement('option');

            option.value = p.id;

            option.textContent = p.title;

            postSelect.appendChild(option);
        });
    }

    async function viewPost() {
        clearPost();

        let postId = postSelect.value;

        let [postRequest, commentsRequest] = await Promise.all([
            fetch(`http://localhost:3030/jsonstore/blog/posts/${postId}`),
            fetch('http://localhost:3030/jsonstore/blog/comments')
        ]);

        let postResponse = await postRequest.json();

        let commentsResponse = await commentsRequest.json();

        postTitle.textContent = postResponse.title;

        postContent.textContent = postResponse.body;

        let comments = Object.values(commentsResponse).filter(c => c.postId == postId);

        comments.map(appendComment);
    }

    function appendComment(comment){
        let li = doc.createElement('li');

        li.id = comment.id;

        li.textContent = comment.text;

        postComments.appendChild(li);
    }

    function clearPost() {
        postTitle.textContent = '';
        postContent.textContent = '';
        postComments.textContent = '';
    }

    clearPost();
}

attachEvents();