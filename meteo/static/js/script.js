const apiKey = '942af425a4eda5894d95806ed6270b57';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {  
                // Si la réponse n'est pas OK, on lance une erreur
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            // Afficher les données météo
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
        })
        .catch(error => {
            // Afficher le message d'erreur dans une boîte de dialogue
            console.error('Error fetching weather data:', error.message);
            alert('City not found. Please try again.');
            
            // Réinitialiser l'affichage en cas d'erreur
            locationElement.textContent = '';
            temperatureElement.textContent = '';
            descriptionElement.textContent = '';
        });
}

