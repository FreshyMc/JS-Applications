function attachEvents() {
    let doc = document;
    let submitBtn = doc.getElementById('submit');
    let forecastDiv = doc.getElementById('forecast');
    let currentForecastDiv = doc.getElementById('current');
    let upcomingForecastDiv = doc.getElementById('upcoming');
    let currentForecast = ce('div', '', 'forecasts');
    let upcomingForecast = ce('div', '', 'forecast-info');

    currentForecastDiv.appendChild(currentForecast);
    upcomingForecastDiv.appendChild(upcomingForecast);

    let symbols = {
        'Sunny': '&#x2600;',
        'Partly sunny': '&#x26C5;',
        'Overcast': '&#x2601;',
        'Rain': '&#x2614;',
        deg: '&#176;'
    };

    submitBtn.addEventListener('click', getForecast);

    async function getForecast() {
        let location = doc.getElementById('location').value;

        forecastDiv.style.display = 'none';
        currentForecast.innerHTML = '';   
        upcomingForecast.innerHTML = '';

        try {
            let locationRequest = await fetch('http://localhost:3030/jsonstore/forecaster/locations');

            let locationData = await locationRequest.json();

            let city = locationData.find(l => l.name.toLowerCase() == location.toLowerCase());

            if (!city) {
                throw new Error('City not found');
            }

            let [currentForecastRequest, upcomingForecastRequest] = await Promise.all([
                fetch(`http://localhost:3030/jsonstore/forecaster/today/${city.code}`),
                fetch(`http://localhost:3030/jsonstore/forecaster/upcoming/${city.code}`)
            ]);

            let currentForecastData = await currentForecastRequest.json();
            let upcomingForecastData = await upcomingForecastRequest.json();

            generateForecast(currentForecastData, upcomingForecastData);
        } catch (err) {
            alert('Error');
        }
    }

    function generateForecast(current, upcoming) {
        forecastDiv.style.display = 'block';

        console.log(current, upcoming);

        generateCurrent(currentForecast, current);

        generateUpcoming(upcomingForecast, upcoming);
    }

    function generateCurrent(div, current){
        let symbol = ce('span', symbols[current.forecast.condition], 'condition symbol');

        div.appendChild(symbol);

        let condition = ce('div', '', 'condition');

        let locationSpan = ce('span', current.name, 'forecast-data');

        let degString = current.forecast.low + symbols.deg + '/' + current.forecast.high + symbols.deg;

        let degreesSpan = ce('span', degString, 'forecast-data');

        let conditionSpan = ce('span', current.forecast.condition, 'forecast-data');

        condition.appendChild(locationSpan);
        condition.appendChild(degreesSpan);
        condition.appendChild(conditionSpan);

        div.appendChild(condition);
    }

    function generateUpcoming(div, upcoming) {
        upcoming.forecast.forEach(f => {
            let upcomingDiv = ce('div', '', 'upcoming');

            let symbol = ce('span', symbols[f.condition], 'condition symbol');

            let degString = f.low + symbols.deg + '/' + f.high + symbols.deg;

            let degreesSpan = ce('span', degString, 'forecast-data');

            let conditionSpan = ce('span', f.condition, 'forecast-data');

            upcomingDiv.appendChild(symbol);

            upcomingDiv.appendChild(degreesSpan);

            upcomingDiv.appendChild(conditionSpan);

            div.appendChild(upcomingDiv);
        });
    }

    function ce(type, content, className) {
        let el = doc.createElement(type);

        if (content) {
            //Escape data if there is any HTML tag to prevent XSS attacks
            let escaped = content.replace(/[\<|\<\/](.*)[\>]/gmi, '');

            el.innerHTML = escaped;
        }

        if (className) {
            el.className = className;
        }

        return el;
    }
}

attachEvents();