const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());
async function getWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  try {
    const response = await fetch(url);
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
      return { temperature: tempC, description: desc };
    } else {
      throw new Error("Weather data not available");
    }
  } catch (err) {
    console.error("Error fetching weather:", err);
    return { temperature: "Unavailable", description: "Unavailable" };
  }
}
app.get('/api/dashboard', async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const weatherData = await getWeatherData(lat, lon);
  res.json(weatherData); 
});
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
