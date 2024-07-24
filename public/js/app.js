const weatherApi = "/weather";
const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const weatherIcon = document.querySelector(".weatherIcon i");
const weatherCondition = document.querySelector(".weatherCondition");
const tempElement = document.querySelector(".temperature span");
const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");

document.addEventListener("DOMContentLoaded", () => {
    const currentDate = new Date();
    const options = { month: "long" };
    const monthName = currentDate.toLocaleString("en-US", options);
    dateElement.textContent = `${currentDate.getDate()}, ${monthName}`;
    
    if ("geolocation" in navigator) {
        locationElement.textContent = "Loading...";
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                if (data?.address?.city) {
                    showData(data.address.city);
                } else {
                    console.error("City not found in location data.");
                }
            } catch (error) {
                console.error("Error fetching location data:", error);
            }
        }, (error) => {
            console.error("Error getting location:", error.message);
        });
    } else {
        console.error("Geolocation is not available in this browser.");
    }
});

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    locationElement.textContent = "Loading...";
    weatherIcon.className = "";
    tempElement.textContent = "";
    weatherCondition.textContent = "";
    showData(search.value);
});

async function showData(city) {
    try {
        const result = await getWeatherData(city);
        if (result.cod === 200) {
            updateWeather(result);
        } else {
            locationElement.textContent = "City not found.";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

async function getWeatherData(city) {
    const locationApi = `${weatherApi}?address=${city}`;
    const response = await fetch(locationApi);
    return response.json();
}

function updateWeather(data) {
    const description = data.weather[0].description.toLowerCase();
    
    // Expanded mapping of weather descriptions to corresponding icons
    const weatherClassMap = {
        "clear sky": "wi wi-day-sunny",
        "few clouds": "wi wi-day-cloudy",
        "scattered clouds": "wi wi-day-cloudy",
        "broken clouds": "wi wi-day-cloudy",
        "shower rain": "wi wi-showers",
        "rain": "wi wi-rain",
        "thunderstorm": "wi wi-thunderstorm",
        "snow": "wi wi-snow",
        "mist": "wi wi-dust",
        "fog": "wi wi-fog",
        "haze": "wi wi-day-haze",
        "dust": "wi wi-dust",
        "tornado": "wi wi-tornado",
        "hurricane": "wi wi-hurricane",
        "squalls": "wi wi-squalls",
        "blizzard": "wi wi-snow",
        "light rain": "wi wi-sprinkle",
        "moderate rain": "wi wi-rain",
        "heavy rain": "wi wi-rain",
        "very heavy rain": "wi wi-rain",
        "extreme rain": "wi wi-rain",
        "light snow": "wi wi-snow",
        "moderate snow": "wi wi-snow",
        "heavy snow": "wi wi-snow",
        "very heavy snow": "wi wi-snow",
        "extreme snow": "wi wi-snow",
        "drizzle": "wi wi-sprinkle",
        "freezing rain": "wi wi-sleet",
        "icy": "wi wi-sleet"
    };
    
    // Set default icon if description is not found in the map
    const weatherClass = weatherClassMap[description] || "wi wi-day-cloudy";
    
    weatherIcon.className = weatherClass;
    locationElement.textContent = data?.name || "Unknown location";
    tempElement.textContent = `${(data?.main?.temp - 273.15).toFixed(2)}°C`; // Fixed conversion formula
    weatherCondition.textContent = description.toUpperCase();
}
