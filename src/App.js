// App.js

import { Oval } from "react-loader-spinner";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import './App.css';

function GfGWeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const toSDateFunction = () => {
    const months = [
      "January", 
      "February", 
      "March", 
      "April", 
      "May", 
      "June", 
      "July", 
      "August", 
      "September", 
      "October", 
      "November", 
      "December"
    ];
    const WeekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const currentDate = new Date();
    const date = 
    `${WeekDays[currentDate.getDay()]} 
     ${currentDate.getDate()} 
     ${months[currentDate.getMonth()]}`;
     return date;
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
      await axios
        .get(url, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        })
        .then((res) => {
          console.log('res', res);
          setWeather({ data: res.data, loading: false, error: false });
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setInput('');
          console.log('error', error);
        });
    }
  };

  return (
    <div className="App">
      <h1 className="app_name">
        Weather App
      </h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Enter City Name: "
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={search}
           />
      </div>
      {weather.loading && (
        <>
          <br />
          <br />
          <Oval type="Oval" color="#00BFFF" height={100} width={100} />
        </>
      )}
      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} /> 
            <span style={{ fontSize: '20px' }}>City Not Found</span>
          </span>
        </>
      )}
      {weather && weather.data && weather.data.main && (
        <div>
          <div className="city-name">
            <h2>
              {weather.data.name}, <span>{weather.data.sys.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{toSDateFunction()}</span>
        </div>
        <div className="icon_temp">
          <img
            className=""
            src={'https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png'}
            alt={weather.data.weather[0].description}
          />
          {Math.round(weather.data.main.temp)}
          <sup className="deg">°C</sup>
        </div>
        <div className="description">
          {weather.data.weather[0].description}
        </div>
        <div className="min-max">
          <div>
            <span className="min">Min: {Math.round(weather.data.main.temp_min)}°C</span>
            <span className="max">Max: {Math.round(weather.data.main.temp_max)}°C</span>
          </div>
        </div>
        <div className="wind">
          <span>Wind Speed: {weather.data.wind.speed} km/h</span>
        </div>
        <div className="humidity">
          <span>Humidity: {weather.data.main.humidity}%</span>
        </div>
        <div className="clouds">
          <span>Clouds: {weather.data.clouds.all}%</span>
        </div>
        <div className="pressure">
          <span>Pressure: {weather.data.main.pressure} hPa</span>
        </div>
        <div className="visibility">
          <span>Visibility: {weather.data.visibility / 1000} km</span>
        </div>
        <div className="sunrise">
          <span>Sunrise: {new Date(weather.data.sys.sunrise * 1000).toLocaleTimeString()}</span>
        </div>
        <div className="sunset">
          <span>Sunset: {new Date(weather.data.sys.sunset * 1000).toLocaleTimeString()}</span>
        </div>
        <div className="timezone">
          <span>Timezone: {weather.data.timezone / 3600} hours</span>
        </div>
        <div className="latlon">
          <span>Latitude: {weather.data.coord.lat}</span>
          <span>Longitude: {weather.data.coord.lon}</span>
        </div>
        </div>
        
      )}
    </div>
  )
}

export default GfGWeatherApp;