const searchEl = $('#search-form');
const fiveDayEl = $('#five-day-forecast');
const currentResultEl = $('#current-result');

const searchWeather = (city) => {
    let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=c154c3f42016df5fb7b29760ad34155e&units=metric';
    fetch(apiUrl).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                displayWeather(data);
                console.log(data);
            })
        }
        else if (response.status === 404) {
            console.error("Weather data not found. Please try again")
        }
    })
};

const searchForecast = (city) => {
    let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=c154c3f42016df5fb7b29760ad34155e&units=metric';
    fetch(apiUrl).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                displayForecast(data);
                console.log(data);
            })
        }
        else if (response.status === 404) {
            console.error("Weather data not found. Please try again")
        }
    })
};

const displayWeather = (data) => {
    let resultCityEl = $('<h2>').text(data.name + ' (' + dayjs(data.dt * 1000).format('MM/DD/YYYY') + ')').append(`<img src="https://openweathermap.org/img/wn/` + data.weather[0].icon + `@2x.png"></img>`);
    resultTempEl = $('<p>').text('Temperature: ' + data.main.temp + '°C');
    resultWindEl = $('<p>').text('Wind: ' + data.wind.speed + ' km/h');
    resultHumidEl = $('<p>').text('Humidity: ' + data.main.humidity + '%');
    currentResultEl.addClass('card px-2 mb-3').append(resultCityEl, resultTempEl, resultWindEl, resultHumidEl);
};

const displayForecast = (data) => {
    fiveDayEl.empty();
    const headerText = $('<h2>').text("Five Day Forecast");
    const rowEl = $('<div>').addClass('row');
    data.list.forEach((e) => {
        if (e.dt_txt[12] === '2') {
            const iconResultEl = $('<img>').attr('src', `https://openweathermap.org/img/wn/` + e.weather[0].icon + `@2x.png`);
            const dateResultEl = $('<h3>').text(dayjs(e.dt*1000).format('MM/DD/YYYY'));
            const tempResultEl = $('<p>').text('Temperature: ' + e.main.temp + '°C');
            const windResultEl = $('<p>').text('Wind: ' + e.wind.speed + ' km/h');
            const humidResultEl = $('<p>').text('Humidity: ' + e.main.humidity + '%');
            dateResultEl.append(iconResultEl);
            const cardEl = $('<div>').addClass('col mt-1').append($('<div>').addClass('card p-2 bg-dark text-white').append(dateResultEl, tempResultEl, windResultEl, humidResultEl));
            rowEl.append(cardEl);
        }
    })
    fiveDayEl.append(headerText,rowEl);
};


const saveSearchCity = (city) => {
    
}


const searchFormSub = (e) => {
    e.preventDefault();
    let currentCity = $('#search-input').val();
    if (currentCity) {
        searchWeather(currentCity);
        searchForecast(currentCity);
        $('#search-input').val('');
    }  
}

searchEl.on('submit', searchFormSub);