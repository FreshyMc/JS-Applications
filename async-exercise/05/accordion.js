async function solution() {
    let doc = document;
    let main = doc.getElementById('main');

    main.addEventListener('click', toggleCard);

    async function toggleCard(e){
        let target = e.target;
        
        if(target.tagName == 'BUTTON'){
            let articleId = target.id;
            let card = target.parentNode.parentNode;
            let cardBody = card.querySelector('.extra');
            let cardContent = card.querySelector('.extra p');

            if(!cardBody.style.display || cardBody.style.display == 'none'){
                let article = await getArticle(articleId);
    
                cardContent.textContent = article.content;

                cardBody.style.display = 'block';
                target.textContent = 'Less';
            }else{
                cardBody.style.display = 'none';
                cardContent.textContent = '';
                target.textContent = 'More';
            }
        }
    }

    function generateArticle(data){
        console.log(data);

        let article = ce('div', '', 'accordion');

        let head = ce('div', '', 'head');

        let articleTitle = ce('span', data.title);
        
        let moreBtn = ce('button', 'More', 'button');

        moreBtn.id = data._id;
        
        head.appendChild(articleTitle);

        head.appendChild(moreBtn);

        let body = ce('div', '', 'extra');

        let articleContent = ce('p');

        body.appendChild(articleContent);

        article.appendChild(head);
        article.appendChild(body);

        main.appendChild(article);
    }

    async function getArticles(){
        let request = await fetch('http://localhost:3030/jsonstore/advanced/articles/list');

        let response = await request.json();

        return response;
    }

    async function getArticle(id){
        let request = await fetch(`http://localhost:3030/jsonstore/advanced/articles/details/${id}`);

        let response = await request.json();

        return response;
    }

    let articles = await getArticles();

    articles.map(generateArticle);

    function ce(type, content, className){
        let el = doc.createElement(type);

        if(content){
            el.textContent = content;
        }

        if(className){
            el.className = className;
        }

        return el;
    }
}

solution();