const apiKey = '942af425a4eda5894d95806ed6270b57';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const forecastElement = document.getElementById('forecast');

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
        fetchForecast(location);
    } else {
        alert('Please enter a city name.');
    }
});

function fetchWeather(location) {
    fetch(`${apiUrl}?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;

            // Weather icon
            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            document.getElementById('weatherIcon').src = iconUrl;

            // Flag
            const flagUrl = `https://flagcdn.com/w320/${data.sys.country.toLowerCase()}.png`;
            document.getElementById('countryFlag').src = flagUrl;
        });
}

function fetchForecast(location) {
    fetch(`${forecastUrl}?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            forecastElement.innerHTML = ''; // Clear previous forecast
            const dailyData = groupByDay(data.list);
            dailyData.forEach(day => {
                const forecastDiv = document.createElement('div');
                forecastDiv.classList.add('forecast-day');
                forecastDiv.innerHTML = `
                    <p><strong>${day.date}</strong></p>
                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="Icon">
                    <p>${day.temp}°C</p>
                    <p>${day.description}</p>
                `;
                forecastElement.appendChild(forecastDiv);
            });
        });
}

function groupByDay(forecastList) {
    const days = {};
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-GB', { weekday: 'long' });
        if (!days[date]) {
            days[date] = {
                date,
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon,
            };
        }
    });
    return Object.values(days).slice(0, 5); // Return first 5 days
}
