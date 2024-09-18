import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Api from "./api/Api";
const App = () => {
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [current, setCurrent] = useState(null);
  const [weatherList, setWeatherList] = useState([]);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [moreForecast, setMoreForecast] = useState(4);
  const [userIp, setUserIp] = useState(null);
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState("");
  const [register, setRegister] = useState(true);
  const [code, setCode] = useState(new Array(6).fill(""));
  const [trueCode, setTrueCode] = useState("");
  const [cityInput, setCityInput] = useState("");
  // hàm xử lý sau khi verify email
  const handleCodeChange = async (value, index) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }

    if (newCode.length === 6 && !newCode.includes("")) {
      const codeAsString = newCode.join("");
      if (codeAsString === trueCode) {
        if (register) {
          alert("You already register success!");
          setVisible(false);
          const res = await axios.get(
            "https://ipinfo.io/json?token=a7ffc5e3b37e0b"
          );
          const cityName = res.data.region;
          await Api.saveNoti(email, cityName, time);
        } else {
          alert("You already unsubscribed success!");
          setVisible(false);
          await Api.unsubcribe(email);
        }
      } else {
        alert("The code is not right!");
      }
    }
  };
  useEffect(() => {
    const currentDate = new Date();
    const Day = currentDate.getDate();
    const Month = currentDate.getMonth() + 1;
    const Year = currentDate.getFullYear();
    setCurrentDate(Year + "-" + Month + "-" + Day);
  }, []);
  //hiển thị lịch sử thời tiết hoặc hiển thị thời tiết hiện tại của vị trí user
  useEffect(() => {
    if (!localStorage.getItem("deviceId")) {
      const deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }
    const deviceId = localStorage.getItem("deviceId");
    setUserIp(deviceId);
    async function fetchData() {
      const History = await Api.getWeatherHistory(deviceId);
      if (History == [] || History == undefined) {
        fetchLocalWeather();
      } else {
        setCity(History[0].city);
        setCurrent(History[0]);
        setWeatherList(History.slice(1));
      }
    }
    fetchData();
  }, []);

  const fetchLocalWeather = async () => {
    try {
      setCity(cityInput);
      const res = await axios.get(
        "https://ipinfo.io/json?token=a7ffc5e3b37e0b"
      );
      const cityName = res.data.region;
      setCity(cityName);
      const deviceId = localStorage.getItem("deviceId");
      const response_current = await Api.getCurrentWeather(cityName, deviceId);
      setCurrent(response_current);
      const response_forecast = await Api.getForecastWeather(
        cityName,
        4,
        deviceId
      );
      setWeatherList(response_forecast);
      setError(null);
    } catch (err) {
      setError("Unable to fetch weather data");
      setCurrent(null);
    }
  };
  const fetchWeather = async () => {
    try {
      setCity(cityInput);
      const deviceId = localStorage.getItem("deviceId");
      const response_current = await Api.getCurrentWeather(city, deviceId);
      setCurrent(response_current);
      const response_forecast = await Api.getForecastWeather(city, 4, deviceId);
      setWeatherList(response_forecast);
      setError(null);
    } catch (err) {
      setError("Unable to fetch weather data");
      setCurrent(null);
    }
  };
  //load 4 ngày dự đoán thời tiết
  const loadmore = async () => {
    try {
      const response_forecast = await Api.getForecastWeather(
        city,
        moreForecast + 4
      );
      setWeatherList(response_forecast);
      setMoreForecast(moreForecast + 4);
      setError(null);
    } catch (err) {
      setError("Unable to fetch weather data");
      setCurrent(null);
    }
  };

  const verifyEmail = async () => {
    if (register && email == "" && time == "") {
      setError("Please enter email and time!");
      return;
    }
    if (!register && email == "") {
      setError("Please enter email ato unsubcribe!");
      return;
    }
    setError(null);
    const isExist = await Api.checkEmailExists(email);
    if ((!isExist && register) || (isExist && !register)) {
      setVisible(true);
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      setTrueCode(String(randomCode));
      await Api.sendcode(email, randomCode);
    } else {
      if (!isExist && !register) {
        alert("This email have been not registered yet!");
      } else {
        alert("This email have been registered!");
      }
    }
  };
  return (
    <div>
      <div className="header">
        <h1>Weather Dashboard</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-3">
            <div className="search-container">
              <h3>Enter a city name</h3>
              <input
                type="text"
                placeholder="Enter a City Name"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="city-input"
              />
              <button className="search-btn" onClick={fetchWeather}>
                Search
              </button>
              <div className="line_or">
                <div className="line" />
                <p className="normalText_black">or</p>
                <div className="line" />
              </div>
              <button className="location-btn" onClick={fetchLocalWeather}>
                Use Current Location
              </button>
            </div>
            {!visible && (
              <div className="search-container">
                <h3>Do you want get the weather info via email?</h3>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="city-input"
                />
                <div className="time">
                  Select Time:
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
                <div className="btn-container">
                  <button
                    className="short-btn"
                    onClick={() => {
                      setRegister(true);
                      verifyEmail();
                    }}
                  >
                    Register
                  </button>
                  <button
                    className="short-btn"
                    onClick={() => {
                      setRegister(false);
                      verifyEmail();
                    }}
                  >
                    unsubscribe
                  </button>
                </div>
                <p style={{ color: "red" }}>{error}</p>
              </div>
            )}
            {visible && (
              <div className="verify-container">
                <h4>Enter code you get via your email:</h4>
                <div className="code-inputs">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-input-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleCodeChange(e.target.value, index)}
                      className="code-input"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="col-9">
            <div className="right_container">
              <div className="current-weather">
                <div className="weather-details">
                  <h2>
                    {city ? city : ""} {currentDate}
                  </h2>
                  <p>Temperature: {current?.temp || null}°C</p>
                  <p>Wind: {current?.windSpeed || null} Km/h</p>
                  <p>Humidity: {current?.humidity || null}%</p>
                </div>
                <div className="weather-icon">
                  <img src={current?.icon} alt={current?.condition || null} />
                  <p>{current?.condition}</p>
                </div>
              </div>
              <h2>4-Day Forecast</h2>
              <div className="forecast_container">
                {weatherList?.map((item, index) => (
                  <div className="forecast-card">
                    <p>{item?.date}</p>
                    <img src={item?.icon} alt="" />
                    <p>Temp: {item?.temp}°C</p>
                    <p>Wind: {item?.windSpeed} Km/h</p>
                    <p>Humidity: {item?.humidity}%</p>
                  </div>
                ))}
              </div>
              <button className="more-btn" onClick={loadmore}>
                Load more
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
