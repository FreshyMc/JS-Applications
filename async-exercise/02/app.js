function solve() {
    let doc = document;
    let infoBox = doc.querySelector('.info');
    let [departBtn, arriveBtn] = doc.querySelectorAll('input');
    
    let stop = {
        next: 'depot'
    };

    async function depart() {
        try{
            let request = await fetch(`http://localhost:3030/jsonstore/bus/schedule/${stop.next}`);
            
            let response = await request.json();

            stop = response;

            infoBox.textContent = `Next stop ${stop.name}`;

            departBtn.disabled = true;
            arriveBtn.disabled = false;
        }catch(err){
            infoBox.textContent = 'Error';

            departBtn.disabled = true;
            arriveBtn.disabled = true;
        }
    }

    function arrive() {
        infoBox.textContent = `Arriving at ${stop.name}`;

        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();