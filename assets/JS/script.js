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
    let resultCityEl = $('<h2>');
    resultCityEl.text(data.name + ' (' + dayjs(data.dt * 1000).format('MM/DD/YYYY') + ')').append(`<img src="https://openweathermap.org/img/wn/` + data.weather[0].icon + `@2x.png"></img>`);
    resultTempEl = $('<p>');
    resultTempEl.text('Temperature: ' + data.main.temp + '°C');
    resultWindEl = $('<p>');
    resultWindEl.text('Wind: ' + data.wind.speed + ' km/h');
    resultHumidEl = $('<p>');
    resultHumidEl.text('Humidity: ' + data.main.humidity + '%');
    currentResultEl.append(resultCityEl, resultTempEl, resultWindEl, resultHumidEl);
}

const displayForecast = (data) => {
    data.list.forEach((e) => {
        if (e.dt_txt[12] === '2') {
            
        }
    })
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