const searchEl = $('#search-form');
const fiveDayEl = $('#five-day-forecast');
const currentResultEl = $('#current-result');
const savedCitiesEl = $('#saved-cities');

const searchWeather = (city) => {
    let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=c154c3f42016df5fb7b29760ad34155e&units=metric';
    fetch(apiUrl).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                displayWeather(data);
                saveSearchCity(data);
            })
        }
        else if (response.status === 404) {
            console.error("Weather data not found. Please try again");
            currentResultEl.text("Weather Data not found. Please try again.");
        }
    })
    .catch((error) => {
        console.error('An error occurred while fetching weather data: ', error);        
    })
};

const searchForecast = (city) => {
    let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=c154c3f42016df5fb7b29760ad34155e&units=metric';
    fetch(apiUrl).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                displayForecast(data);
            })
        }
        else if (response.status === 404) {
            console.error("Weather data not found. Please try again")
            fiveDayEl.text("");
        }
    })
    .catch((error) => {
        console.error('An error occurred while fetching weather data: ', error);        
    })
};

const displayWeather = (data) => {
    currentResultEl.empty();
    let resultCityEl = $('<h2>').text(data.name + ' (' + dayjs(data.dt * 1000).format('MM/DD/YYYY') + ')').append(`<img src="https://openweathermap.org/img/wn/` + data.weather[0].icon + `@2x.png"></img>`);
    resultTempEl = $('<p>').text('Temperature: ' + data.main.temp.toFixed(0) + '°C');
    resultWindEl = $('<p>').text('Wind: ' + data.wind.speed.toFixed(1) + ' km/h');
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
            const tempResultEl = $('<p>').text('Temperature: ' + e.main.temp.toFixed(0) + '°C');
            const windResultEl = $('<p>').text('Wind: ' + e.wind.speed.toFixed(1) + ' km/h');
            const humidResultEl = $('<p>').text('Humidity: ' + e.main.humidity + '%');
            dateResultEl.append(iconResultEl);
            const cardEl = $('<div>').addClass('col mt-1').append($('<div>').addClass('card p-2 bg-dark text-white').append(dateResultEl, tempResultEl, windResultEl, humidResultEl));
            rowEl.append(cardEl);
        }
    })
    fiveDayEl.append(headerText,rowEl);
};

const displayCities = () => {
    let cityList = JSON.parse(localStorage.getItem('savedCities')) || [];
    savedCitiesEl.empty();

    for (var i=cityList.length-1; i >=0; i--) {
        let cityDisplayEl = $('<button>').text(cityList[i]).addClass('btn w-100 bg-dark text-white my-2');
        savedCitiesEl.append(cityDisplayEl);
    }
};

const saveSearchCity = (data) => {
    let savedCityList = JSON.parse(localStorage.getItem('savedCities')) || [];

    if(!savedCityList.includes(data.name)) {
        savedCityList.push(data.name);
        localStorage.setItem('savedCities', JSON.stringify(savedCityList));
        displayCities();
    }    
};

const init = () => {
    displayCities();
};


const searchFormSub = (e) => {
    e.preventDefault();
    let currentCity = $('#search-input').val();
    if (currentCity) {
        searchWeather(currentCity);
        searchForecast(currentCity);
        $('#search-input').val('');
    }  
};

const searchSavedList = (e) => {
    e.preventDefault();
    let city = $(e.target).text();
    if (city) {
        searchWeather(city);
        searchForecast(city);
    } 
};

searchEl.on('submit', searchFormSub);
savedCitiesEl.on('click', searchSavedList)
init();