const API_URL = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc';

async function fetchWeatherData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('forecast-container').innerHTML = '<p>無法加載天氣數據，請稍後再試。</p>';
    }
}

function displayWeatherData(data) {
    // General Situation
    document.getElementById('general-situation').innerHTML = `<p>${data.generalSituation}</p>`;

    // Weather Forecast
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = data.weatherForecast.map(forecast => `
        <div class="forecast-card">
            <h3>${forecast.week} (${forecast.forecastDate})</h3>
            <p>天氣: ${forecast.forecastWeather}</p>
            <p>風向: ${forecast.forecastWind}</p>
            <p>氣溫: ${forecast.forecastMintemp.value}°C - ${forecast.forecastMaxtemp.value}°C</p>
            <p>相對濕度: ${forecast.forecastMinrh.value}% - ${forecast.forecastMaxrh.value}%</p>
            <p>降雨概率: ${forecast.PSR}</p>
        </div>
    `).join('');

    // Sea Temperature
    document.getElementById('sea-temp').innerHTML = `
        <p>地點: ${data.seaTemp.place}</p>
        <p>溫度: ${data.seaTemp.value}°C</p>
        <p>記錄時間: ${new Date(data.seaTemp.recordTime).toLocaleString()}</p>
    `;

    // Soil Temperature
    document.getElementById('soil-temp').innerHTML = data.soilTemp.map(soil => `
        <p>地點: ${soil.place}</p>
        <p>深度: ${soil.depth.value}米</p>
        <p>溫度: ${soil.value}°C</p>
        <p>記錄時間: ${new Date(soil.recordTime).toLocaleString()}</p>
    `).join('');

    // Update Time
    document.getElementById('update-time').innerHTML = `最後更新: ${new Date(data.updateTime).toLocaleString()}`;
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchWeatherData);