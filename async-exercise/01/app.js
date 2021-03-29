async function getInfo() {
    let doc = document;
    let busId = doc.getElementById('stopId').value;
    let stopNameDiv = doc.getElementById('stopName');
    let busesList = doc.getElementById('buses'); 

    if(!busId){
        return;
    }

    try {
        busesList.innerHTML = '';

        let request = await fetch(`http://localhost:3030/jsonstore/bus/businfo/${busId}`);
        let data = await request.json();

        let [buses, stopName] = Object.values(data);

        stopNameDiv.textContent = stopName;

        for(let bus in buses){
            let li = doc.createElement('li');

            li.textContent = `Bus ${bus} arrives in ${buses[bus]} minutes`;

            busesList.appendChild(li);
        }
    } catch (err) {
        stopNameDiv.textContent = 'Error';
    }
}