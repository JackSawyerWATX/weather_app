// App.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import './App.css';

function GfGWeatherApp() {
  const [input, setInput] = useState('');
  const [location, setLocation] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const [weather, setWeather] = useState({
    city: '',
    region: '',
    country: '',
  });

  const fetchLocationByIP = async () => {
    try {
      const res = await axios.get('https://ipapi.co/json/');
      const { city, region, country_name } = res.data;
      setLocation({ city, region, country: country_name });
    } catch (error) {
      console.error('Error fetching location by IP:', error);
    }
  };

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
      `${WeekDays[currentDate.getDay()]}, 
    ${months[currentDate.getMonth()]}
    ${currentDate.getDate()}, 
    ${currentDate.getFullYear()}`;
    return date;
  };

  const convertToFahrenheit = (celsius) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  useEffect(() => {
    fetchLocationByIP();
  }, []);

  const fetchWeatherForLocation = async () => {
    const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    setWeather({ ...weather, loading: true });

    try {
      const res = await axios.get(url, {
        params: {
          q: location.city,
          units: 'metric',
          appid: api_key,
        },
      });

      setWeather({ data: res.data, loading: false, error: false });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather({ ...weather, data: {}, error: true });
    }
  };

  useEffect(() => {
    if (location.city) {
      fetchWeatherForLocation();
    }
  }, [location]);

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
    <div className="App" >
      {
        weather.error && (
          <>
            <br />
            <br />
            <span className="error-message">
              <FontAwesomeIcon icon={faFrown} />
              <span style={{ fontSize: '20px' }}>City Not Found</span>
            </span>
          </>
        )
      }
      <h1 className="app_name">Current Weather Where You Are: </h1>
      <div className="location-display">
        <h2>
          {location.city}, {location.region}, {location.country}
        </h2>
      </div>
      {weather.loading && <p>Loading weather data...</p>}
      {weather.error && <p>Error fetching weather data!</p>}
      {weather.data && weather.data.main && (

        <div className="weather-details">
          <div className="date">
            <span>{toSDateFunction()}</span>
          </div><br />
          <span>Temperature: {convertToFahrenheit(weather.data.main.temp)}°F / {Math.round(weather.data.main.temp)}°C</span>
          <div className="description">
            {weather.data.weather[0].description}
          </div>
          <div className="min-max">
            <div>
              <span className="min">Min: {convertToFahrenheit(weather.data.main.temp)}°F / {Math.round(weather.data.main.temp_min)}°C</span><br />
              <span className="max">Max: {convertToFahrenheit(weather.data.main.temp)}°F / {Math.round(weather.data.main.temp_max)}°C</span>
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
          {/* <div className="timezone">
            <span>Timezone: +{weather.data.timezone / 3600} hours</span>
          </div> */}
          {/* <div className="latlon">
            <span>Latitude: {weather.data.coord.lat} </span>
            <span>Longitude: {weather.data.coord.lon}</span>
          </div> */}

        </div>
      )}
    </div>
  )
}

export default GfGWeatherApp;