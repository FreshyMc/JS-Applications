function attachEvents() {
    let doc = document;
    let catchesDiv = doc.getElementById('catches');
    let catchCopy = catchesDiv.querySelector('.catch').cloneNode(true);
    window.catchCopy = catchCopy;
    window.catches = catchesDiv;

    if (sessionStorage.getItem('authToken') != null) {
        doc.getElementById('guest').style.display = 'none';

        window.isLogged = true;
    } else {
        window.isLogged = false;
    }

    let loadBtn = doc.getElementById('loadBtn');
    let addBtn = doc.getElementById('addBtn');
    let addForm = doc.getElementById('addForm');
    catchesDiv.innerHTML = '';

    loadBtn.addEventListener('click', () => {
        loadCatches();
    });

    addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let formData = new FormData(e.target);

        createCatch(formData);

        e.target.reset();
    });

    if (window.isLogged) {
        addBtn.disabled = false;
    }

    catchesDiv.addEventListener('click', (e)=>{
        if(e.target.tagName == 'BUTTON' && e.target.className == 'update'){
            updateCatch(e.target.parentNode);
        }else if(e.target.tagName == 'BUTTON' && e.target.className == 'delete'){
            deleteCatch(e.target.parentNode);
        }
    });
}

async function loadCatches() {
    let request = await fetch('http://localhost:3030/data/catches');

    if (request.ok) {
        window.catches.innerHTML = '';
        
        let response = await request.json();

        response.map(createCatchDiv).forEach(c => window.catches.appendChild(c));
    } else {
        alert('Error occurred while loading catches data');
    }
}

async function createCatch(catchData) {
    let body = {
        angler: catchData.get('angler'),
        weight: Number(catchData.get('weight')),
        species: catchData.get('species'),
        location: catchData.get('location'),
        bait: catchData.get('bait'),
        captureTime: Number(catchData.get('captureTime'))
    };

    let request = await fetch('http://localhost:3030/data/catches', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage.getItem('authToken')
        },
        body: JSON.stringify(body)
    });

    if(request.ok){ 
        loadCatches();
    }else{
        alert('Error occurred while creating a catch record');
    }
}

async function updateCatch(card){
    let catchId = card.querySelector('input[name="catchId"]').value;

    let [anglerInput, weightInput, speciesInput, locationInput, baitInput, captureTimeInput] = card.querySelectorAll('input');

    let body = {
        angler: anglerInput.value,
        weight: Number(weightInput.value),
        species: speciesInput.value,
        location: locationInput.value,
        bait: baitInput.value,
        captureTime: Number(captureTimeInput.value)
    };

    let request = await fetch(`http://localhost:3030/data/catches/${catchId}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionStorage.getItem('authToken')
        },
        body: JSON.stringify(body)
    });

    if(!request.ok){
        alert('Editing failed');
    }
}

async function deleteCatch(card){
    let catchId = card.querySelector('input[name="catchId"]').value;

    let request = await fetch(`http://localhost:3030/data/catches/${catchId}`,{
        method: 'delete',
        headers: {
            'X-Authorization': sessionStorage.getItem('authToken')
        }
    });

    if(request.ok){
        card.remove();
    }else{
        alert('Delete failed');
    }
}

function createCatchDiv(data) {
    let catchDiv = window.catchCopy.cloneNode(true);

    let [anglerInput, weightInput, speciesInput, locationInput, baitInput, captureTimeInput, catchIdInput] = catchDiv.querySelectorAll('input');

    let [updateBtn, deleteBtn] = catchDiv.querySelectorAll('button');

    anglerInput.value = data.angler;
    weightInput.value = data.weight;
    speciesInput.value = data.species;
    locationInput.value = data.location;
    baitInput.value = data.bait;
    captureTimeInput.value = data.captureTime;
    catchIdInput.value = data._id;

    if (data._ownerId == sessionStorage.getItem('id')) {
        updateBtn.disabled = false;
        deleteBtn.disabled = false;
    }

    return catchDiv;
}

attachEvents();

