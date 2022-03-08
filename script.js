var key = 'c74ce1b73d9f75951fefdcfe8410b259';
var searchForm = document.querySelector('#searchform');
var inputTxt = document.querySelector('#input-txt');
var searchBtn = document.querySelector('#search-Btn');
var currResults = document.querySelector('#current-results');
var fiveDayResults = document.querySelector('#five-day-result');
var cityResults = document.querySelector('#city-results');
var searchHistory = document.querySelector('.search-history');
var array = JSON.parse(window.localStorage.getItem('History')) || [];



var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var cityName = inputTxt.value.trim();
  
    if (cityName) {
      getMap(cityName);
      populateHistory(cityName);
    } 
  };

var populateHistory = function (searchCity) {
  array.push(searchCity)
  window.localStorage.setItem('History', JSON.stringify(array))
  renderHistory();
}

var renderHistory = function () {
  searchHistory.innerHTML = '';
  for (let i = 0; i < array.length; i++) {
    var cityBtn = document.createElement('button');
    cityBtn.textContent = array[i]
    cityBtn.setAttribute('class', 'history-button');
    searchHistory.append(cityBtn);
  }
}

renderHistory();

var getMap = function (city) {
    var requestURLMap = 'https://api.opencagedata.com/geocode/v1/json?q=' + city + '&key=d1434d00474d48c28118cbce83aad06f'
    fetch(requestURLMap)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    var lat = (data.results[0].geometry.lat);
    var long = (data.results[0].geometry.lng);
    cityResults.textContent = city

    if (lat, long) {
        getWeather(lat, long);
        getFiveDay(lat, long);
    }
  })
  .catch(function (err) {
    console.log(err);
  });

}

var getWeather = function (lat, long) {
    var requestURLWeather = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&appid=' + key + '&units=imperial';
fetch(requestURLWeather)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    currResults.innerHTML = '';
    var temp = (data.current.temp);
    var wind = (data.current.wind_speed);
    var humidity = (data.current.humidity);
    var uvIndex = (data.current.uvi);
    var tempResult = document.createElement('li');
    var windResult = document.createElement('li');
    var humidityResult = document.createElement('li');
    var uvResult = document.createElement('li');
    tempResult.textContent = ('Temp: ' + temp + '°F');
    windResult.textContent = ('Wind: ' + wind + ' MPH');
    humidityResult.textContent = ('Humidity: ' + humidity + '%');
    uvResult.textContent = ('UV index: ' + uvIndex);
    currResults.append(tempResult, windResult, humidityResult, uvResult);

    currResults.setAttribute('class', 'main-weather-card');
  })
  .catch(function (err) {
    console.log(err);
  });

}

var getFiveDay = function (lat, long) {
  var requestURLFiveDay = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat + '&lon=' + long + '&appid=' + key + '&units=imperial';
  fetch(requestURLFiveDay)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    fiveDayResults.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      var temp = (data.list[i].main.temp);
      var wind = (data.list[i].wind.speed);
      var humidity = (data.list[i].main.humidity);
      var date = (data.list[i].dt_txt);
      var tempResult = document.createElement('li');
      var windResult = document.createElement('li');
      var humidityResult = document.createElement('li');
      var dateResult = document.createElement('li');
      tempResult.textContent = ('Temp: ' + temp + '°F');
      windResult.textContent = ('Wind: ' + wind + ' MPH');
      humidityResult.textContent = ('Humidity: ' + humidity);
      dateResult.textContent = ('Date: ' + date);
      fiveDayResults.append(tempResult, windResult, humidityResult, dateResult);

      fiveDayResults.setAttribute('class', 'five-day-weather-card');
    } 
  })
  .catch(function (err) {
    console.log(err);
  })
}

searchForm.addEventListener('submit', formSubmitHandler)