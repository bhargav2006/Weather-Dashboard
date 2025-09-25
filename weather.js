const apikey = "286edbd8cfa948897bc90c7c409f75f1";

// On load
window.onload = function () {
  const today = new Date();
  document.getElementById("date").innerText = today.toDateString();

  // Allow "Enter" key for search
  document.getElementById("city").addEventListener("keypress", (e) => {
    if (e.key === "Enter") getweather();
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => getWeatherByCity("Hyderabad")
    );
  } else {
    getWeatherByCity("Hyderabad");
  }
};

function getweather() {
  const city = document.getElementById("city").value.trim();
  if (!city) {
    alert("Please enter a city.");
    return;
  }
  getWeatherByCity(city);
}

function getWeatherByCity(city) {
  const currenturl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
  const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apikey}`;
  fetchWeather(currenturl, forecasturl);
}

function getWeatherByCoords(lat, lon) {
  const currenturl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`;
  const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`;
  fetchWeather(currenturl, forecasturl);
}

function fetchWeather(currenturl, forecasturl) {
  const tempDiv = document.getElementById("temp-div");
  const weatherInfo = document.getElementById("weather-info");
  const hourlyForecast = document.getElementById("hourly-forecast");
  const weatherIcon = document.getElementById("weather-icon");

  tempDiv.innerHTML = "Loading...";
  weatherInfo.innerHTML = "";
  hourlyForecast.innerHTML = "";
  weatherIcon.style.display = "none";

  // Current weather
  fetch(currenturl)
    .then((res) => {
      if (!res.ok) throw new Error("City not found.");
      return res.json();
    })
    .then((data) => displayWeather(data))
    .catch((err) => {
      tempDiv.innerHTML = `<p style="color:red;">⚠ ${err.message}</p>`;
    });

  // Forecast
  fetch(forecasturl)
    .then((res) => {
      if (!res.ok) throw new Error("Forecast unavailable.");
      return res.json();
    })
    .then((data) => displayHourlyForecast(data.list))
    .catch((err) => {
      hourlyForecast.innerHTML = `<p style="color:red;">⚠ ${err.message}</p>`;
    });
}

function displayWeather(data) {
  const tempDiv = document.getElementById("temp-div");
  const weatherInfo = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");

  tempDiv.innerHTML = "";
  weatherInfo.innerHTML = "";

  const city = data.name;
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  // Dynamic background color based on temperature
  document.body.style.background =
    temp > 30
      ? "linear-gradient(to right, #ff9966, #ff5e62)" // hot
      : temp < 15
      ? "linear-gradient(to right, #83a4d4, #b6fbff)" // cold
      : "linear-gradient(to right, #74ebd5, #ACB6E5)"; // normal

  tempDiv.innerHTML = `<p class="big-temp">${temp} °C</p>`;
  weatherInfo.innerHTML = `<p class="city">${city}</p><p>${desc}</p>`;
  weatherIcon.src = iconUrl;
  weatherIcon.alt = desc;
  weatherIcon.style.display = "block";
}

function displayHourlyForecast(data) {
  const forecastDiv = document.getElementById("hourly-forecast");
  forecastDiv.innerHTML = "";
  const next24 = data.slice(0, 8);

  next24.forEach((item) => {
    const dt = new Date(item.dt * 1000);
    const hour = dt.getHours().toString().padStart(2, "0");
    const temp = Math.round(item.main.temp);
    const desc = item.weather[0].description;
    const icon = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    forecastDiv.innerHTML += `
      <div class="hourly-item card">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="forecast icon">
        <span>${temp} °C</span>
        <small>${desc}</small>
      </div>`;
  });
}
