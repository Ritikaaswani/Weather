document.getElementById("weatherForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value;
    fetchWeatherByCity(city);
    document.getElementById("cityInput").value = '';
});

    const apiKey = "e8a9678acd9ff7870365ce4896c318df";
    let isCelsius = true;

    document.getElementById('temperature').addEventListener('click', function () {
        if (isCelsius) {
            let tempCelsius = parseFloat(this.textContent);
            let tempKelvin = tempCelsius + 273.15;
            this.textContent = `${tempKelvin.toFixed(2)}K`;
        } else {
            let tempKelvin = parseFloat(this.textContent);
            let tempCelsius = tempKelvin - 273.15;
            this.textContent = `${tempCelsius.toFixed(2)}°C`;
        }
        isCelsius = !isCelsius;
    });

function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeather(url, `Weather in ${city}`);
    fetchForecast(forecastUrl);
}
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("day").textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
    document.getElementById("date").textContent = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                fetchWeather(url, `Current Location: ${data.name}`);
            } else {
                document.getElementById("errorMessage").textContent = "Location not found.";
                document.getElementById("errorMessage").classList.remove("hidden");
                document.getElementById("weatherResult").classList.add("hidden");
            }
        })
        .catch(() => {
            document.getElementById("errorMessage").textContent = "Error fetching location data.";
            document.getElementById("errorMessage").classList.remove("hidden");
        });
        fetchForecast(forecastUrl);
}

function fetchWeather(url, locationText) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                console.log(data)
                document.getElementById("weatherResult").classList.remove("hidden");
                document.getElementById("errorMessage").classList.add("hidden");
                document.getElementById("location").textContent = locationText;
                document.getElementById("tempDetail").textContent= `${data.main.temp}°C`;
                document.getElementById("windSpeed").textContent=`${data.wind.speed}kph`;
                document.getElementById("temperature").textContent = ` ${data.main.temp}°C`;
                document.getElementById("humidity").textContent = `${data.main.humidity}%`;
                document.getElementById("condition").textContent = data.weather[0].description;
                document.getElementById("weatherIcon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            } else {
                document.getElementById("errorMessage").textContent = "City not found.";
                document.getElementById("errorMessage").classList.remove("hidden");
                document.getElementById("weatherResult").classList.add("hidden");
            }
        })
        .catch(() => {
            document.getElementById("errorMessage").textContent = "Error fetching data.";
            document.getElementById("errorMessage").classList.remove("hidden");
            document.getElementById("weatherResult").classList.add("hidden");
        });
}
function fetchForecast(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                updateForecastUI(data.list);
            } else {
                alert("Error fetching forecast data");
            }
        })
        .catch(() => {
            alert("Error fetching forecast data");
        });
}
function updateForecastUI(forecastData) {
    const forecastElements = document.querySelectorAll(".nextdays li");
    const uniqueDays = {}; 

    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        if (!uniqueDays[dayName]) {
            uniqueDays[dayName] = {
                temp: Math.round(item.main.temp) + "°C",
                icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`
            };
        }
    });
    Object.entries(uniqueDays).slice(0, 5).forEach(([day, data], index) => {
        if (forecastElements[index]) {
            forecastElements[index].querySelector("img").src = data.icon;
            forecastElements[index].querySelector("h3:nth-child(2)").textContent = day; 
            forecastElements[index].querySelector(".daytemp").textContent = data.temp; 
        }
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            () => {
                document.getElementById("errorMessage").textContent = "Location access denied. Enter city manually.";
                document.getElementById("errorMessage").classList.remove("hidden");
            }
        );
    } else {
        document.getElementById("errorMessage").textContent = "Geolocation is not supported by this browser.";
        document.getElementById("errorMessage").classList.remove("hidden");
    }
}

window.onload = function() {
    updateDateTime();
    getLocation();
};
city='';