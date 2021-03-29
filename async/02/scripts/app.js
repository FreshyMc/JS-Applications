async function loadRepos() {
	let doc = document;
	let username = doc.getElementById('username').value;
	let reposList = doc.getElementById('repos');

	let url = `https://api.github.com/users/${username}/repos`;

	try {
		let req = await fetch(url);

		if (!req.ok) {
			throw new Error('Not Found');
		}

		let response = await req.json();

		reposList.innerHTML = '';

		response.forEach(r => {
			let li = ce('li');

			let link = ce('a', r.full_name);

			link.href = r.html_url;

			li.appendChild(link);

			reposList.appendChild(li);
		});
	} catch (err) {
		reposList.innerHTML = '';

		let errMsg = ce('li', err.message);

		reposList.appendChild(errMsg);
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