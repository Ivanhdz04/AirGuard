import React from 'react';

const VisualIndicators = ({ airQualityData, weatherData }) => {
  if (!airQualityData || !weatherData) return null;

  // Calculate indicator position based on AQI ranges
  const getIndicatorPosition = (aqi) => {
    if (aqi <= 50) return (aqi / 50) * 25; // 0-25% for Good
    if (aqi <= 100) return 25 + ((aqi - 50) / 50) * 25; // 25-50% for Moderate
    if (aqi <= 150) return 50 + ((aqi - 100) / 50) * 25; // 50-75% for Unhealthy
    return 75 + Math.min(((aqi - 150) / 100) * 25, 25); // 75-100% for Very Unhealthy
  };

  const indicatorPosition = getIndicatorPosition(airQualityData.aqi);

  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { 
      status: 'Good', 
      color: 'green', 
      bgColor: 'bg-green-500',
      textColor: 'text-green-500',
      description: 'Air quality is satisfactory and poses little or no risk.',
      recommendation: 'Ideal for outdoor activities.'
    };
    if (aqi <= 100) return { 
      status: 'Moderate', 
      color: 'yellow', 
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      description: 'Air quality is acceptable. There may be risk for sensitive people.',
      recommendation: 'Sensitive people should limit outdoor activities.'
    };
    if (aqi <= 150) return { 
      status: 'Unhealthy', 
      color: 'orange', 
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-500',
      description: 'Air quality may affect sensitive groups.',
      recommendation: 'Sensitive groups should avoid outdoor activities.'
    };
    return { 
      status: 'Very Unhealthy', 
      color: 'red', 
      bgColor: 'bg-red-500',
      textColor: 'text-red-500',
      description: 'Air quality is dangerous for everyone.',
      recommendation: 'Avoid outdoor activities.'
    };
  };

  const aqiStatus = getAQIStatus(airQualityData.aqi);

  const getTemperatureStatus = (temp) => {
    if (temp < 10) return { status: 'Very Cold', color: 'blue', recommendation: 'Wear warm clothing.' };
    if (temp < 20) return { status: 'Cold', color: 'cyan', recommendation: 'Wear light jacket.' };
    if (temp < 30) return { status: 'Pleasant', color: 'green', recommendation: 'Ideal temperature.' };
    if (temp < 35) return { status: 'Hot', color: 'orange', recommendation: 'Wear light clothing.' };
    return { status: 'Very Hot', color: 'red', recommendation: 'Avoid prolonged sun exposure.' };
  };

  const tempStatus = getTemperatureStatus(weatherData.temperature);

  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-semibold">Visual Indicators</h2>
      
      {/* Main air quality indicator */}
      <div className={`${aqiStatus.bgColor} rounded-lg p-6 text-white`}>
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">{airQualityData.aqi}</div>
          <div className="text-2xl font-semibold mb-2">{aqiStatus.status}</div>
          <div className="text-lg opacity-90 mb-4">{aqiStatus.description}</div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="font-semibold">Recommendation:</div>
            <div className="text-sm">{aqiStatus.recommendation}</div>
          </div>
        </div>
      </div>

      {/* Temperature indicator */}
      <div className="bg-gradient-to-r from-blue-800 to-orange-800 rounded-lg p-6">
        <div className="text-center text-white">
          <div className="text-4xl font-bold mb-2">{weatherData.temperature}°C</div>
          <div className="text-xl font-semibold mb-2">{tempStatus.status}</div>
          <div className="text-sm opacity-90">{tempStatus.recommendation}</div>
        </div>
      </div>

      {/* Quick info cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg p-4">
          <div className="text-center text-white">
            <div className="text-2xl font-bold">{weatherData.humidity}%</div>
            <div className="text-sm">Humidity</div>
            <div className="text-xs opacity-75 mt-1">
              {weatherData.humidity > 70 ? 'High humidity' : 
               weatherData.humidity > 40 ? 'Moderate humidity' : 'Low humidity'}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-4">
          <div className="text-center text-white">
            <div className="text-2xl font-bold">{weatherData.pressure}</div>
            <div className="text-sm">Pressure (hPa)</div>
            <div className="text-xs opacity-75 mt-1">
              {weatherData.pressure > 1020 ? 'High pressure' : 
               weatherData.pressure > 1000 ? 'Normal pressure' : 'Low pressure'}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-lg p-4">
          <div className="text-center text-white">
            <div className="text-2xl font-bold">{weatherData.windSpeed}</div>
            <div className="text-sm">Wind (km/h)</div>
            <div className="text-xs opacity-75 mt-1">
              {weatherData.windSpeed > 20 ? 'Strong wind' : 
               weatherData.windSpeed > 10 ? 'Moderate wind' : 'Light wind'}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-lg p-4">
          <div className="text-center text-white">
            <div className="text-2xl font-bold">{airQualityData.pm25}</div>
            <div className="text-sm">PM2.5 (µg/m³)</div>
            <div className="text-xs opacity-75 mt-1">
              {airQualityData.pm25 > 35 ? 'High' : 
               airQualityData.pm25 > 15 ? 'Moderate' : 'Low'}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced visual progress bar */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Air Quality - Visual Scale</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Good</span>
            <span className="text-white text-sm">Very Unhealthy</span>
          </div>
          <div className="h-6 bg-gray-700 rounded-full overflow-hidden relative">
            <div className="h-full flex">
              <div className="h-full bg-green-500 flex-1"></div>
              <div className="h-full bg-yellow-500 flex-1"></div>
              <div className="h-full bg-orange-500 flex-1"></div>
              <div className="h-full bg-red-500 flex-1"></div>
            </div>
            <div 
              className="absolute top-0 w-6 h-6 bg-white rounded-full shadow-lg transform -translate-y-1 border-2 border-gray-800"
              style={{ left: `${indicatorPosition}%` }}
            ></div>
          </div>
          <div className="text-center text-white font-semibold">
            AQI: {airQualityData.aqi} - {aqiStatus.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualIndicators;
