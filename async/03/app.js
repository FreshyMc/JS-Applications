async function loadCommits() {
    let doc = document;
	let username = doc.getElementById('username').value;
    let repo = doc.getElementById('repo').value;
	let commits = doc.getElementById('commits');

	let url = `https://api.github.com/repos/${username}/${repo}/commits`;

	try {
		let req = await fetch(url);

		if (!req.ok) {
			throw new Error(`Error: ${req.status} (${req.statusText})`);
		}

		let response = await req.json();

		commits.innerHTML = '';

		response.forEach(c => {
            console.log(c);
			let li = ce('li', `${c.commit.author.name}: ${c.commit.message}`);

			commits.appendChild(li);
		});
	} catch (err) {
		commits.innerHTML = '';

        let errorLi = ce('li', err.message);

        commits.appendChild(errorLi);
	}
}

function ce(type, content, className){
	let el = document.createElement(type);

	if(content){
		el.textContent = content;
	}

	if(className){
		el.className = className;
	}

	return el;
}