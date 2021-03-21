
$(document).ready(function () {
    // The user will be able to find information about the current and future conditions and 
    // the data will be store in the local storage
    var historyContainer = $("#past-searches");
    var searchForm = $("#search-form")
    var theCurrentWeatherContainer = $("#current-weather");
    var fiveDayForecastContainer = $("#five-day-forecast");
    var searchValueInput = $("#search-value");
    var apikey = "95afb9e6d452de7c7a0255ca40cf049b"
    var baseurl = "https://api.openweathermap.org/data/2.5/weather?";
    var baseUrl2 = "https://api.openweathermap.org/data/2.5/forecast?";
    var uvIndexBaseUrl = "https://api.openweathermap.org/data/2.5/onecall?";
    var iconBaseUrl = "https://openweathermap.org/img/w/"
    var searchHistory = [];
    // The user will search for a city
    searchForm.submit(function( event ) {
        event.preventDefault();
        console.log(event);
        // it will provide to the user information that was summitted
        var specialFormValues = $(this).serializeArray();
        var city = specialFormValues[0].value;
        var searchTermDiv = $('<button type="button" class="btn past-search-term">');
        searchTermDiv.click(function(event) {
            event.preventDefault();
            var value = $(this).text();
            currentCityWeather(value);
            searchFiveDayForecast(value);

        });
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        searchTermDiv.text(city);
        historyContainer.append(searchTermDiv);
        console.log(specialFormValues, city);
        // This process will find the real value
        currentCityWeather(city);
        searchFiveDayForecast(city);
        searchValueInput.val("");

    });
    function currentCityWeather(city) {
        theCurrentWeatherContainer.html("");
        var completeUrl = baseurl + "q=" + city + "&appid=" + apikey;
        console.log(completeUrl);

        //The user will have a result about all the condition of the weather in the city
        fetch(completeUrl).then(function (response) {
            return response.json();
        })
            .then(function (data) {
                console.log(data);
                var cityName = data.name;
                var temp = data.main.temp;
                var humidity = data.main.humidity;
                var weather = data.weather;
                var iconUrl = iconBaseUrl + weather[0].icon + '.png';
                var wind = data.wind;
                console.log(temp, humidity, weather, wind);
                var cityNameDiv = $('<div class="city-name">');
                var tempDiv = $('<div class="temp-name">');
                var humidityDiv = $('<div class="humidity-name">');
                var weatherImg = $('<img class="icon-name" />');
                var windDiv = $('<div class="wind-name">');
                cityNameDiv.text(cityName);
                weatherImg.attr("src", iconUrl);
                tempDiv.text("Temperature: " + temp);
                humidityDiv.text("Humidity: " + humidity + "%");
                windDiv.text("Wind Speed: " + wind.speed + "MPH");
                theCurrentWeatherContainer.append(cityNameDiv);
                theCurrentWeatherContainer.append(weatherImg);
                theCurrentWeatherContainer.append(tempDiv);
                theCurrentWeatherContainer.append(humidityDiv);
                theCurrentWeatherContainer.append(windDiv);
            });
    }
    // The user will obtain the condition o fhe next five days
    function searchFiveDayForecast(city) {
        fiveDayForecastContainer.html("");
        var forecastUrl = baseUrl2 + "q=" + city + "&appid=" + apikey;
        fetch(forecastUrl).then(function (responsefromMapApp) {
            return responsefromMapApp.json()
        }).then(function (data) {
            console.log("Five Day Forecast", data);
            var coords = data.city.coord;
            findUVIndex(coords.lat, coords.lon);
            console.log(coords);
            // Array to save the next five days information
            for (var i = 0; i < data.list.length; i++) {
                var isThreeOclock = data.list[i].dt_txt.search('15:00:00');
                if (isThreeOclock > -1) {
                    var forecast = data.list[i];
                    var temp = forecast.main.temp;
                    var humidity = forecast.main.humidity;
                    var weather = forecast.weather;
                    var iconUrl = iconBaseUrl + weather[0].icon + ".png";
                    var wind = forecast.wind;
                    var day = moment(forecast.dt_txt).format('dddd, MMMM Do');
                    console.log(forecast, temp, humidity, weather, wind, day);
                    var rowDiv = $('<div class="col-2">')
                    var dayDiv = $('<div class="day-name">');
                    var tempDiv = $('<div class="temp-name">');
                    var humidityDiv = $('<div class="humidity-name">');
                    var weatherImg = $('<img class="icon-name" />');
                    weatherImg.attr("src", iconUrl)
                    var windDiv = $('<div class="wind-name">');
                    dayDiv.text(day);
                    tempDiv.text("Temperature: " + temp);
                    humidityDiv.text("Humidity: " + humidity + "%");
                    windDiv.text("Wind Speed: " + wind.speed + "MPH");
                    // It will grab all the values then will be kept in the main container
                    rowDiv.append(dayDiv);
                    rowDiv.append(weatherImg);
                    rowDiv.append(tempDiv);
                    rowDiv.append(humidityDiv);
                    rowDiv.append(windDiv);
                    fiveDayForecastContainer.append(rowDiv);


                }
            }
        });
    }
    function findUVIndex(lat, lon) {
       var lastUrl = uvIndexBaseUrl + "lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=" + apikey;
       fetch(lastUrl).then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log("UV DATA", data);
            var uvIndex = data.current.uvi;
            var uvIndexDiv = $('<div class="uv-index-div">');
            var uvIndexSpan = $("<span class='uv-index-number'>");
            uvIndexSpan.text(uvIndex);
            uvIndexDiv.text("UV Index: ");
            uvIndexDiv.append(uvIndexSpan);
            theCurrentWeatherContainer.append(uvIndexDiv);

       });

    }
    function getSearchHistory() {
        if (localStorage.getItem("searchHistory")) {
            searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
            for (var i = 0; i < searchHistory.length; i++) {
                var searchTermDiv = $('<button type="button" class="btn past-search-term">');
                searchTermDiv.click(function(event) {
                    event.preventDefault();
                    var value = $(this).text();
                    currentCityWeather(value);
                    searchFiveDayForecast(value);

                });
                searchTermDiv.text(searchHistory[i]);
                historyContainer.append(searchTermDiv);
            }
        }

    }

    getSearchHistory();

});
