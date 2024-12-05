const fetchButton = document.getElementById('fetchButton');
const cityInput = document.getElementById('cityInput');
const ctx = document.getElementById('weatherChart').getContext('2d');

let weatherChart; // Variable pour le graphique

fetchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetch(`/weather-api?city=${city}`)
            .then(response => response.json())
            .then(data => {
                if (data.daily) {
                    const labels = data.daily.map((_, index) => `Day ${index + 1}`);
                    const temps = data.daily.map(day => day.temp.day);

                    // Détruire l'ancien graphique si nécessaire
                    if (weatherChart) weatherChart.destroy();

                    // Créer un nouveau graphique
                    weatherChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: `7-Day Temperature in ${city}`,
                                data: temps,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true,
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: { display: true, text: 'Temperature (°C)' }
                                },
                                x: {
                                    title: { display: true, text: 'Days' }
                                }
                            }
                        }
                    });
                } else {
                    alert('City not found or no data available.');
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('An error occurred. Please try again.');
            });
    } else {
        alert('Please enter a city name.');
    }
});
