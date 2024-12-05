const apiKey = '942af425a4eda5894d95806ed6270b57';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const weatherChart = document.getElementById('weatherChart').getContext('2d');
let chartInstance;

// Fonction de mise à jour du thème (jour/nuit)
function updateTheme() {
    const hour = new Date().getHours();
    const body = document.body;
    
    if (hour >= 18 || hour < 6) {
        body.classList.add('night-mode');
        body.classList.remove('day-mode');
    } else {
        body.classList.add('day-mode');
        body.classList.remove('night-mode');
    }
}

// Appeler la fonction lors du chargement
updateTheme();

// Fonction pour récupérer la météo par localisation
function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;

            // Affichage de l'icône météo
            const weatherIcon = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
            document.getElementById('weatherIcon').src = iconUrl;

            // Fetch hourly forecast (requires One Call API)
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${apiKey}`);
        })
        .then(response => response.json())
        .then(data => {
            createWeatherChart(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Fonction pour créer le graphique
function createWeatherChart(data) {
    const labels = data.hourly.map((hour, index) => {
        const date = new Date(hour.dt * 1000);
        return `${date.getHours()}:00`;
    });

    const temperatures = data.hourly.map(hour => hour.temp);
    const precipitation = data.hourly.map(hour => hour.pop * 100); // Précipitations en pourcentage
    const windSpeed = data.hourly.map(hour => hour.wind_speed);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(weatherChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Precipitation (%)',
                    data: precipitation,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Wind Speed (m/s)',
                    data: windSpeed,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}

// Fonction pour récupérer la météo en fonction de la localisation géographique
navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;

            const weatherIcon = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
            document.getElementById('weatherIcon').src = iconUrl;

            // Fetch hourly forecast (requires One Call API)
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${apiKey}`);
        })
        .then(response => response.json())
        .then(data => {
            createWeatherChart(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
});

// Écouteur pour le bouton de recherche
searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});
