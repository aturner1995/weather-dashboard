const searchEl = $('#search-form');
const fiveDayEl = $('#five-day-forecast');
const currentResultEl = $('#current-result');
const savedCitiesEl = $('#saved-cities');
// Search the current weather from the Open Weather Map API. If the response is ok the city is saved and the current weather is displayed on the page.
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
// Search the 5 day forecast from the Open Weather Map API. If the response is ok the 5 day forecast weather is displayed on the page.
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
// Take the API data and display the weather information on page
const displayWeather = (data) => {
    currentResultEl.empty();
    let resultCityEl = $('<h2>').text(data.name + ' (' + dayjs(data.dt * 1000).format('MM/DD/YYYY') + ')').append(`<img src="https://openweathermap.org/img/wn/` + data.weather[0].icon + `@2x.png"></img>`);
    resultTempEl = $('<p>').text('Temperature: ' + data.main.temp.toFixed(0) + '°C');
    resultWindEl = $('<p>').text('Wind: ' + data.wind.speed.toFixed(1) + ' km/h');
    resultHumidEl = $('<p>').text('Humidity: ' + data.main.humidity + '%');
    currentResultEl.addClass('card px-2 mb-3').append(resultCityEl, resultTempEl, resultWindEl, resultHumidEl);
};
// Take the API data and display the weather forecast on the page
const displayForecast = (data) => {
    fiveDayEl.empty();
    const headerText = $('<h2>').text("Five Day Forecast");
    const rowEl = $('<div>').addClass('row');
    // loop through the data.list array and only display the noon(12) weather forecast and when day is after the current day
    data.list.forEach((e) => {
        if (e.dt_txt[12] === '2' && dayjs(e.dt*1000).isAfter(dayjs(),'day')) {
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
// Display the recent searches on the page
const displayCities = () => {
    let cityList = JSON.parse(localStorage.getItem('savedCities')) || [];
    savedCitiesEl.empty();

    for (var i=cityList.length-1; i >=0; i--) {
        let cityDisplayEl = $('<button>').text(cityList[i]).addClass('btn w-100 bg-dark text-white my-2 btn-font');
        savedCitiesEl.append(cityDisplayEl);
    }
};
// Save the city to local storage
const saveSearchCity = (data) => {
    let savedCityList = JSON.parse(localStorage.getItem('savedCities')) || [];

    if(!savedCityList.includes(data.name)) {
        savedCityList.push(data.name);
        localStorage.setItem('savedCities', JSON.stringify(savedCityList));
        displayCities();
    }    
};
// Set up application by displaying the recent searches from local storage
const init = () => {
    displayCities();
};

// Retrieve the value of the user input city from the page form
const searchFormSub = (e) => {
    e.preventDefault();
    let currentCity = $('#search-input').val();
    if (currentCity) {
        searchWeather(currentCity);
        searchForecast(currentCity);
        $('#search-input').val('');
    }  
};
// Event delegation to search for weather from the list of recent searches
const searchSavedList = (e) => {
    e.preventDefault();
    let city = $(e.target).text();
    if (city) {
        searchWeather(city);
        searchForecast(city);
    } 
};
// Event listeners
searchEl.on('submit', searchFormSub);
savedCitiesEl.on('click', searchSavedList)
init();