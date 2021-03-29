async function lockedProfile() {
    let doc = document;
    let main = doc.getElementById('main');
    let profileCardCopy = doc.querySelector('.profile').cloneNode(true);

    main.innerHTML = '';

    function generateCard(values){
        let {_id, username, email, age} = values;

        let copy = profileCardCopy.cloneNode(true);
        let [lockInput, unlockInput] = copy.querySelectorAll('input[type="radio"]');

        let btn = copy.querySelector('button');

        let hiddenFieldsDiv = copy.querySelector('div');

        btn.addEventListener('click', ()=>{
            toggleInfo(unlockInput, hiddenFieldsDiv);
        });

        hiddenFieldsDiv.style.display = 'none';

        hiddenFieldsDiv.id = `user${_id}HiddenFields`;

        let usernameInput = copy.querySelector('input[type="text"]');

        usernameInput.value = username;

        let emailInput = copy.querySelector('input[type="email"]');

        emailInput.value = email;

        let ageInput = copy.querySelector('input[type="number"]');

        ageInput.value = age;

        lockInput.name = lockInput.name.replace('1', _id);
        unlockInput.name = unlockInput.name.replace('1', _id);

        usernameInput.name = usernameInput.name.replace('1', _id);

        emailInput.name = emailInput.name.replace('1', _id);

        ageInput.name = ageInput.name.replace('1', _id);

        return copy;
    }

    function toggleInfo(unclockInput, infoDiv){
        if(unclockInput.checked == true){
            let displayDivState = infoDiv.style.display == 'block' ? 'none' : 'block';

            infoDiv.style.display = displayDivState;
        }
    }

    async function getProfiles(){
        let request = await fetch('http://localhost:3030/jsonstore/advanced/profiles');

        let response = await request.json();

        return Object.values(response);
    }

    let result = await getProfiles();

    result.forEach(r => {
        let card = generateCard(r);

        main.appendChild(card);
    });
}