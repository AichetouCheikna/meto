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

// Fonction pour afficher une boîte de dialogue
function showErrorDialog(message) {
    alert(message); // Simple boîte de dialogue JavaScript
}

// Fonction pour récupérer la météo par localisation
function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please enter a valid city name.');
                } else {
                    throw new Error('An error occurred while fetching weather data.');
                }
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.coord || !data.coord.lat || !data.coord.lon) {
                throw new Error('Location data is missing from the API response.');
            }

            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;

            // Affichage de l'icône météo
            const weatherIcon = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
            document.getElementById('weatherIcon').src = iconUrl;

            // Affichage des données supplémentaires
            document.getElementById('clouds').textContent = `${data.clouds.all}%`;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

            // Affichage du drapeau
            const countryCode = data.sys.country;
            const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
            document.getElementById('countryFlag').src = flagUrl;

            // Récupération de la prévision horaire
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${apiKey}`);
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.hourly) {
                createWeatherChart(data);  // Si les données horaires sont présentes
            } else {
                showErrorDialog('Hourly forecast data is missing.');
            }
        })
        .catch(error => {
            showErrorDialog(error.message);
        });
}

// Fonction pour créer le graphique
function createWeatherChart(data) {
    // Vérifie si les données horaires existent
    if (!data || !data.hourly) {
        console.error('Hourly data is not available.');
        showErrorDialog('Hourly forecast data is not available.');
        return; // Arrête l'exécution si aucune donnée horaire
    }

    const labels = data.hourly.slice(0, 12).map((hour) => {
        const date = new Date(hour.dt * 1000);
        return `${date.getHours()}:00`;
    });

    const temperatures = data.hourly.slice(0, 12).map((hour) => hour.temp);
    const precipitation = data.hourly.slice(0, 12).map((hour) => hour.pop * 100);

    if (chartInstance) {
        chartInstance.destroy(); // Supprime l'ancien graphique
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
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: 'Precipitation (%)',
                    data: precipitation,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value',
                    },
                },
            },
        },
    });
}

// Écouteur pour le bouton de recherche
searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    } else {
        showErrorDialog('Please enter a city name.');
    }
});