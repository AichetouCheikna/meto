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
            if (!response.ok) {  // Si la réponse n'est pas OK, cela signifie que la ville n'a pas été trouvée
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
        })
        .catch(error => {
            // Affichage du message d'erreur dans la console (log)
            console.error('Error fetching weather data:', error.message);
            locationElement.textContent = '';  // Réinitialiser le nom de la ville
            temperatureElement.textContent = '';  // Réinitialiser la température
            descriptionElement.textContent = '';  // Réinitialiser la description
            // Vous pouvez également afficher une erreur plus détaillée dans la console si nécessaire
            console.log('City input was:', locationInput.value);
            console.log('Message:', error.message); // Message d'erreur de l'API
        });
}
