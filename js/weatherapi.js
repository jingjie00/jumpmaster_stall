// api key : 035ba34c53c9fcfa7aa18f320706f7ec

// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const statusElement = document.querySelector("#openStatus");
const linkElement = document.querySelector("#weatherlink");

// App data
const weather = {};

weather.temperature = {
    unit: "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
const latitude = 4.327522;
const longitude = 101.1431352;
// API KEY
const key = "035ba34c53c9fcfa7aa18f320706f7ec";


$(function () {
    var api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    $.getJSON(api)
        .done(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.main = data.weather[0].main;

            $(iconElement).html(`<img src="icons/${weather.iconId}.png"/>`);
            $(tempElement).html(`${weather.temperature.value}°<span>C</span>`);
            $(descElement).html(weather.description);
            $(locationElement).html(`${weather.city}, ${weather.country}`);

            if (weather.main == "Rain" || weather.main == "Thunderstorm" || weather.main == "Drizzle" || weather.main == "Tornado" ||
                weather.description == "Heavy snow" || weather.description == "Rain and snow" || weather.description == "Heavy shower snow") {
                $(statusElement).html("We are closed.");
            }
            else
                $(statusElement).html("We are open");
        });
});

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
$(tempElement).click(function () {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "celsius") {

        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        $(tempElement).html(`${fahrenheit}°<span>F</span>`);
        weather.temperature.unit = "fahrenheit";

    } else {
        $(tempElement).html(`${weather.temperature.value}°<span>C</span>`);
        weather.temperature.unit = "celsius"
    }
});

$(linkElement).click(function () {
    window.open('weather.html');
});