const apiKey = "";
const apiKeyGoogleMap = "";

const form = document.getElementById("formCity");
const button = document.getElementById("sendButton");
const main = document.getElementById("main");
const inputElement = document.getElementById("searchInput");
const weatherSection = document.getElementById("weatherSection");
const msg = document.getElementById("msg");
const bgColor = document.getElementById("color");
const locationName = document.getElementById("locationName");
const country = document.getElementById("country");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription = document.getElementById("weatherDescription");
const tempMax = document.getElementById("tempMax");
const tempMin = document.getElementById("tempMin");
const presion = document.getElementById("presion");
const feelsLike = document.getElementById("feelsLike");
const WeatherHumidity = document.getElementById("WeatherHumidity");
const windSpeed = document.getElementById("windSpeed");
const map = document.getElementById("map");

button.addEventListener("click", () => {
    searchCity(inputElement.value);
});

/**
 * Solicitud a la API Open Weather Map mediante GET para recuperar datos
 * @param {string} cityName - Nombre de la ciudad
 */
function searchCity(cityName) {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=es&appid=${apiKey}&units=metric`;

    fetch(url)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw "Respuesta incorrecta del servidor";
            }
        })
        .then((result) => {
            saveWeatherDataInStorage(result);
            showWeatherData(result);
        })
        .catch(err => {
            console.log("catch", err);
            msg.textContent = "Ingrese una ciudad válida";
            localStorage.clear();
        });
    msg.textContent = "";
    form.reset();
    inputElement.focus();
}

/**
 * Guarda los datos en el Local Storage
 * @param {Object} result - Datos del clima de la ciudad
 */
function saveWeatherDataInStorage(result) {
    localStorage.setItem("datos", JSON.stringify(result));
}

/**
 * Establece la sintáxis HTML del localStorage
 */
function showWeatherDataFromLocalStorage() {
    if (localStorage != undefined && localStorage.datos != undefined) {
        let cities = JSON.parse(localStorage.datos);
        showWeatherData(cities);
    } else {
        weatherSection.style.visibility = "hidden";
    }
}

/**
 * Establece la sintaxis HTML
 * @param {Object} responseJson - Datos del clima de la ciudad
 */
function showWeatherData(responseJson) {

    weatherSection.style.visibility = "visible";

    changeBackgroundCard(responseJson.weather[0].icon);
    showMap(responseJson.coord.lat, responseJson.coord.lon);

    locationName.textContent = responseJson.name;
    country.textContent = responseJson.sys.country;
    temperature.textContent = Math.round(responseJson.main.temp) + "°C";
    weatherIcon.src = `http://openweathermap.org/img/wn/${responseJson.weather[0].icon}@2x.png`;
    weatherIcon.alt = responseJson.weather[0]["description"];
    weatherDescription.textContent = responseJson.weather[0]["description"];
    tempMax.textContent = Math.round(responseJson.main.temp_max) + "°C";
    tempMin.textContent = Math.round(responseJson.main.temp_min) + "°C";
    presion.textContent = responseJson.main.pressure + " hPa";
    feelsLike.textContent = Math.round(responseJson.main.feels_like) + "°C";
    WeatherHumidity.textContent = responseJson.main.humidity + "%";
    windSpeed.textContent = Math.round(responseJson.wind.speed) + " km/h";
}

/**
 * Retorna el mapa según las coordenadas de la ciudad
 * @param {number} latitude - Coordenadas latitud
 * @param {number} longitude - Coordenadas longitud
 */
function showMap(latitude, longitude) {

    const url = `https://www.google.com/maps/embed/v1/search?key=${apiKeyGoogleMap}&q=record&center=${latitude},${longitude}&zoom=6`;

    map.src = url;
}

/**
 * Retorna un color dependiendo si está de día o de noche
 * en la ciudad que se buscó
 * @param {string} icon - Nombre del icono del clima de la ciudad
 */
function changeBackgroundCard(icon) {

    const string = icon;
    const lastCharacter = string.charAt(string.length - 1);

    switch (lastCharacter) {
        case 'd':
            bgColor.style.backgroundColor = "#457b9d";
            break;
        case 'n':
            bgColor.style.backgroundColor = "#1D3557";
            break;
        default:
            bgColor.style.backgroundColor = "#A8DADC";
            break;
    }
}

$(window).ready(function () {
    showWeatherDataFromLocalStorage();
});