function attachEvents() {
    let doc = document;
    let messagesArea = doc.getElementById('messages');
    let sendMessageBtn = doc.getElementById('submit');
    let refreshBtn = doc.getElementById('refresh');
    let [authorInput, contentInput] = doc.querySelectorAll('input[type="text"]');

    sendMessageBtn.addEventListener('click', ()=>{sendMessage(authorInput.value, contentInput.value); clearInputs()});

    refreshBtn.addEventListener('click', ()=>{refreshMessages(messagesArea)});

    function clearInputs(){
        authorInput.value = '';
        contentInput.value = '';
    }
}

const reqUrl = 'http://localhost:3030/jsonstore/messenger';

async function sendMessage(author, content){
    if(!author || !content){
        return;
    }

    let message = {author: author, content: content};

    let request = await fetch(reqUrl, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    });

    let response = await request.json();
}

async function refreshMessages(textarea){
    let request = await fetch(reqUrl);

    let response = await request.json();

    textarea.value = Object.values(response).map(m => `${m.author}: ${m.content}`).join('\n');
}

attachEvents();