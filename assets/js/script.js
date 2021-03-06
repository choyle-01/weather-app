var key = "c74ce1b73d9f75951fefdcfe8410b259";
var searchForm = document.querySelector("#searchform");
var inputTxt = document.querySelector("#input-txt");
var currResults = document.querySelector("#current-results");
var fiveDayResults = document.querySelector("#five-day-result");
var cityResults = document.querySelector("#city-results");
var searchHistory = document.querySelector(".search-history");
var array = JSON.parse(window.localStorage.getItem("History")) || [];

// function takes in the city name that was inputed into the search form and passes it to the populateHistory and getMap fuctions
var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = inputTxt.value.trim();

  if (cityName) {
    getMap(cityName);
    populateHistory(cityName);
  }
};

// stringifying the data and sending it into the local storage
var populateHistory = function (searchCity) {
  array.push(searchCity);
  window.localStorage.setItem("History", JSON.stringify(array));
  renderHistory();
};

// creates buttons from the local storage and appends them to the page. Also has an event listener and function to call that info back to the page
var renderHistory = function () {
  searchHistory.innerHTML = "";

  for (let i = 0; i < array.length; i++) {
    (function () {
      var cityBtn = document.createElement("button");
      cityBtn.textContent = array[i];
      cityBtn.classList.add("btn", "btn-primary", "col-12", "my-2");
      searchHistory.append(cityBtn);

      cityBtn.addEventListener("click", function () {
        getMap(cityBtn.innerText);
      });
    })();
  }
};

renderHistory();

// function takes in the city names and converts the city into a lattitude and longitude coordinates, also passes the coodinated on to the getWeather and getFiveDay functions
var getMap = function (city) {
  var requestURLMap =
    "https://api.opencagedata.com/geocode/v1/json?q=" + city + "&key=d1434d00474d48c28118cbce83aad06f";
  fetch(requestURLMap)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var lat = data.results[0].geometry.lat;
      var long = data.results[0].geometry.lng;
      cityResults.textContent = city;

      if ((lat, long)) {
        getWeather(lat, long);
        getFiveDay(lat, long);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};

// takes the lattitude and longitude and adds them into the API link, then gets the one day forecast and displays the needed information
var getWeather = function (lat, long) {
  var requestURLWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=" + key + "&units=imperial";
  fetch(requestURLWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      currResults.innerHTML = "";
      var temp = data.current.temp;
      var wind = data.current.wind_speed;
      var humidity = data.current.humidity;
      var uvIndex = data.current.uvi;
      var icon = data.current.weather[0].icon;
      var tempResult = document.createElement("p");
      var windResult = document.createElement("p");
      var humidityResult = document.createElement("p");

      if (uvIndex >= 6) {
        var uvResult = document.createElement("button");
        uvResult.classList.add("py-2", "mx-4", "btn", "btn-danger");
        uvResult.textContent = "UVI: " + uvIndex;
      } else if (uvIndex <= 2) {
        var uvResult = document.createElement("button");
        uvResult.classList.add("py-2", "mx-4", "btn", "btn-success");
        uvResult.textContent = "UVI: " + uvIndex;
      } else {
        var uvResult = document.createElement("button");
        uvResult.classList.add("py-2", "mx-4", "btn", "btn-primary");
        uvResult.textContent = "UVI: " + uvIndex;
      }

      var iconImg = document.createElement("img");
      tempResult.textContent = "Temp: " + temp + "??F";
      windResult.textContent = "Wind: " + wind + " MPH";
      humidityResult.textContent = "Humidity: " + humidity + "%";
      uvResult.textContent = "UV index: " + uvIndex;
      uvResult.classList.add("UV-index");

      iconImg.src = "http://openweathermap.org/img/wn/" + icon + ".png";
      currResults.append(
        tempResult,
        windResult,
        humidityResult,
        uvResult,
        iconImg
      );

      currResults.setAttribute("class", "main-weather-card");
    })
    .catch(function (err) {
      console.log(err);
    });
};
// does the same thing just with the five day forcast, also adds some divs and classes to help with bootstrap styling
var getFiveDay = function (lat, long) {
  var requestURLFiveDay = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=" + key + "&units=imperial";
  fetch(requestURLFiveDay)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      fiveDayResults.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        var temp = data.list[i].main.temp;
        var wind = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity;
        var date = data.list[i].dt_txt;
        var icon = data.list[i].weather[0].icon;

        var div1 = document.createElement("div");

        div1.classList.add("card-body", "m-3");

        var tempResult = document.createElement("p");
        div1.appendChild(tempResult);
        var windResult = document.createElement("p");
        div1.appendChild(windResult);
        var humidityResult = document.createElement("p");
        div1.appendChild(humidityResult);
        var dateResult = document.createElement("p");
        div1.appendChild(dateResult);
        var iconImg = document.createElement("img");
        iconImg.src = "http://openweathermap.org/img/wn/" + icon + ".png";
        div1.appendChild(iconImg);

        fiveDayResults.appendChild(div1);

        tempResult.textContent = "Temp: " + temp + "??F";
        windResult.textContent = "Wind: " + wind + " MPH";
        humidityResult.textContent = "Humidity: " + humidity;
        dateResult.textContent = "Date: " + date;

        fiveDayResults.setAttribute("class", "five-day-weather-card");

        dateResult.classList.add("card-text");
        tempResult.classList.add("card-text");
        windResult.classList.add("card-text");
        humidityResult.classList.add("card-text");
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};
// event listener to detect when the form has been submitted
searchForm.addEventListener("submit", formSubmitHandler);
