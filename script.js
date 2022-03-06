var key = "c74ce1b73d9f75951fefdcfe8410b259";
var searchForm = document.querySelector("#searchform");
var inputTxt = document.querySelector("#input-txt");
var searchBtn = document.querySelector("#search-Btn");
var currResults = document.querySelector("#weather-results");
var cityResults = document.querySelector('#city-results');

var formSubmitHandler = function (event) {
    event.preventDefault();
  
    var cityName = inputTxt.value.trim();
  
    if (cityName) {
      getMap(cityName);
    } 
  };

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

    if (lat, long) {
        getWeather(lat, long);
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
  })
  .catch(function (err) {
    console.log(err);
  });

}

searchForm.addEventListener('submit', formSubmitHandler)