import React from 'react';

const WeatherSection = ({ data }) => {
  // Default data if no CSV data available
  const defaultWeatherData = {
    temperature: 23,
    humidity: 65,
    pressure: 1013,
    windSpeed: 15,
    timestamp: new Date().toISOString()
  };

  const weatherData = data || defaultWeatherData;
  
  // Generate forecasts based on current data
  const forecasts = [
    { temperature: weatherData.temperature + 2, date: "20 SEP 2025 13:00", icon: "cloudy-rain" },
    { temperature: weatherData.temperature + 3, date: "20 SEP 2025 14:00", icon: "cloudy-rain" },
    { temperature: weatherData.temperature + 1, date: "20 SEP 2025 12:00", icon: "cloudy-rain" },
    { temperature: weatherData.temperature, date: "20 SEP 2025 12:00", icon: "cloudy-rain" }
  ];

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "20 SEP 2025 12:00";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }) + ' ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const WeatherIcon = ({ type, className = "w-12 h-12" }) => {
    if (type === "cloudy-sun") {
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          <path d="M8 2a2 2 0 00-2 2v1h4V4a2 2 0 00-2-2z" />
        </svg>
      );
    }
    
    if (type === "cloudy-rain") {
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          <path d="M6 14l2-2 2 2 2-2 2 2" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl font-semibold">Weather</h2>
      
      <div className="flex space-x-4">
        {/* Main weather card */}
        <div className="bg-gradient-to-br from-weather-bg to-cyan-600 rounded-lg p-6 flex-1">
          <div className="text-center">
            <WeatherIcon type="cloudy-sun" className="w-16 h-16 text-white mx-auto mb-4" />
            <div className="text-4xl font-bold text-white mb-2">
              {weatherData.temperature}°C
            </div>
            <div className="text-white text-sm opacity-90">
              {formatTimestamp(weatherData.timestamp)}
            </div>
            <div className="text-white text-xs opacity-75 mt-2 space-y-1">
              <div>Humidity: {weatherData.humidity}%</div>
              <div>Pressure: {weatherData.pressure} hPa</div>
              <div>Wind: {weatherData.windSpeed} km/h</div>
              <div>Direction: {weatherData.windDirection}°</div>
              <div>Precipitation: {weatherData.precipitation} mm</div>
              <div>Boundary Layer Height: {weatherData.boundaryLayerHeight} m</div>
              <div>Radiation: {weatherData.shortwaveRadiation} W/m²</div>
              <div>Hour: {weatherData.hourOfDay}:00</div>
              <div>Weekend: {weatherData.isWeekend ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>

        {/* Forecast cards */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {forecasts.map((forecast, index) => (
            <div key={index} className="bg-card-bg rounded-lg p-3">
              <div className="text-center">
                <WeatherIcon type={forecast.icon} className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-lg font-semibold text-white mb-1">
                  {forecast.temperature}°C
                </div>
                <div className="text-xs text-gray-300">
                  {forecast.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherSection;
