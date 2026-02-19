async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        if (data && data.current_weather) {
            const tempC = data.current_weather.temperature;
            const weatherCode = data.current_weather.weathercode;
            const weatherDescriptions = {
                0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
                45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
                55: "Dense drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle",
                61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
                66: "Light freezing rain", 67: "Heavy freezing rain", 71: "Slight snow fall",
                73: "Moderate snow fall", 75: "Heavy snow fall", 77: "Snow grains",
                80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
                85: "Slight snow showers", 86: "Heavy snow showers", 95: "Thunderstorm",
                96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
            };
            const desc = weatherDescriptions[weatherCode] || "Unknown";
            document.getElementById('weather-temp').textContent = `${tempC} °C`;
            document.getElementById('weather-desc').textContent = desc;
            document.getElementById('sensor-temp').textContent = `${tempC} °C`;
            const soilMoisture = (Math.random() * 100).toFixed(1);
            document.getElementById('soil-moisture').textContent = `${soilMoisture} %`;
            toggleMotorBasedOnTemperature(tempC);
        } else {
            document.getElementById('weather-temp').textContent = "Unavailable";
            document.getElementById('weather-desc').textContent = "Unavailable";
            document.getElementById('sensor-temp').textContent = "Unavailable";
            document.getElementById('soil-moisture').textContent = "Unavailable";
        }
    } catch (error) {
        document.getElementById('weather-temp').textContent = "Error";
        document.getElementById('weather-desc').textContent = "Error";
        document.getElementById('sensor-temp').textContent = "Error";
        document.getElementById('soil-moisture').textContent = "Error";
        console.error("Error fetching weather data:", error);
    }
}
function toggleMotorBasedOnTemperature(tempC) {
    const motorStatusElement = document.getElementById('motorStatus');
    const motorButton = document.querySelector('button');
    const threshold = 25; 
    if (tempC > threshold) {
        motorStatusElement.textContent = "Motor is ON";
        motorButton.textContent = "Turn Motor OFF"; 
    } else {
        motorStatusElement.textContent = "Motor is OFF";
        motorButton.textContent = "Turn Motor ON";
    }
}
function toggleMotor() {
    const motorStatusElement = document.getElementById('motorStatus');
    const motorButton = document.querySelector('button');
    if (motorStatusElement.textContent === "Motor is OFF") {
        motorStatusElement.textContent = "Motor is ON";
        motorButton.textContent = "Turn Motor OFF";
    } else {
        motorStatusElement.textContent = "Motor is OFF";
        motorButton.textContent = "Turn Motor ON";
    }
}
function fetchLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                document.getElementById('location').textContent = `Lat: ${lat}, Lon: ${lon}`;
                fetchWeather(lat, lon);
            },
            () => {
                document.getElementById('location').textContent = "Permission denied";
                document.getElementById('weather-desc').textContent = "Unavailable";
                document.getElementById('weather-temp').textContent = "Unavailable";
                document.getElementById('sensor-temp').textContent = "Unavailable";
                document.getElementById('soil-moisture').textContent = "Unavailable";
            }
        );
    } else {
        document.getElementById('location').textContent = "Geolocation not supported";
        document.getElementById('weather-desc').textContent = "Unavailable";
        document.getElementById('weather-temp').textContent = "Unavailable";
        document.getElementById('sensor-temp').textContent = "Unavailable";
        document.getElementById('soil-moisture').textContent = "Unavailable";
    }
}
fetchLocationAndWeather();
