import { useState } from "react";

function WeatherApp() {
  //state variables 
  const [cityName, setCityName] = useState(""); // State for the city name
  const [weatherData, setWeatherData] = useState(null); // State for storing the weather data fetched
  const [isLoading, setIsLoading] = useState(false); // State for tracking the loading status
  const [errorMessage, setErrorMessage] = useState(null); // State for storing error messages

  // Fetching the API key from .env
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Function to retrieve weather data from the API
  const fetchWeatherData = async () => {
  // showing an error message if city name is not provided
    if (!cityName) {
      setErrorMessage("Please enter a valid city name.");
      setWeatherData(null); // Reset the weather data when the input is empty
      return;
    }
    setIsLoading(true); //setting loading status to true
    setErrorMessage(null);

    try {
      // Fetch weather data from the API
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`
      );
      // Checking to see if the response status
     if (!response.ok) {
        throw new Error("City has not been found."); // error if city is not found
      }
       //parse json response
      const data = await response.json();
      setWeatherData(data); //updating state with the weather data fetched
    } catch (err) {
      setErrorMessage(err.message);//display any errors during the fetch process

    } finally {
      setIsLoading(false); //setting loading status to false 
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault(); //preventing default form submission behaviour 
    fetchWeatherData(); //calling the function to fetch the weather data
  };

  // Handle city input change
  const handleCityInputChange = (e) => {
    setCityName(e.target.value); // Updating city name with the current input value
    setWeatherData(null); // Reset previous weather data 
    setErrorMessage(null);  // Removing previous errors during user typing 
  };

  return (
    <div className="weather-app-container">
      <h1>Weather Forecast</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={cityName}
          onChange={handleCityInputChange} //updating state on input change
          placeholder="Enter a city name" //input text
        />
         {/* The submit button */}
        <button type="submit" disabled={isLoading}>
          {/* Button text when loading and fetching data */}
          {isLoading ? "Fetching Weather..." : "Get Weather"}
        </button>
      </form>

      {/* Displaying an error message if there's an error */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Showing the weather data if available and not loading */}
      {weatherData && !isLoading && (
        <div className="weather-data">
          <h2>{weatherData.location.name}</h2> {/* city name */}
          <p>
            {weatherData.location.region}, {weatherData.location.country}  {/* city region */}
          </p>
          <h3>{weatherData.current.temp_c}°C</h3>  {/*current temperature */}

          <p>{weatherData.current.condition.text}</p>  {/*current weather condition */}

          <img
            src={`https:${weatherData.current.condition.icon}`} // image URL for the current condition     
            alt={weatherData.current.condition.text}
          />
        </div>
      )}
    </div>
  ); 
}

export default WeatherApp;
