import React from 'react';

const AirQualitySection = ({ data }) => {
  // Only show data if CSV data is available
  if (!data) {
    return (
      <div className="space-y-4">
        <h2 className="text-white text-xl font-semibold">Air Quality</h2>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-gray-400 text-lg">No air quality data available</div>
          <div className="text-gray-500 text-sm mt-2">Please select a location to view data</div>
        </div>
      </div>
    );
  }

  const airQualityData = data;
  const airQualityPercentage = airQualityData.aqi || 0;

  // Calculate indicator position based on AQI ranges
  const getIndicatorPosition = (aqi) => {
    if (aqi <= 50) return (aqi / 50) * 25; // 0-25% for Good
    if (aqi <= 100) return 25 + ((aqi - 50) / 50) * 25; // 25-50% for Moderate
    if (aqi <= 150) return 50 + ((aqi - 100) / 50) * 25; // 50-75% for Unhealthy
    return 75 + Math.min(((aqi - 150) / 100) * 25, 25); // 75-100% for Very Unhealthy
  };

  const indicatorPosition = getIndicatorPosition(airQualityPercentage);

  // Determine color based on AQI
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'bg-air-green';
    if (aqi <= 100) return 'bg-air-yellow';
    if (aqi <= 150) return 'bg-air-orange';
    return 'bg-air-red';
  };

  const aqiColorClass = getAQIColor(airQualityPercentage);

  return (
    <div className="space-y-4">
      {/* Air Quality Title */}
      <h2 className="text-white text-xl font-semibold">Air quality</h2>
      
      {/* Air Quality Progress Bar */}
      <div className="relative mb-6">
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full flex">
            <div className="h-full bg-air-green flex-1"></div>
            <div className="h-full bg-air-yellow flex-1"></div>
            <div className="h-full bg-air-orange flex-1"></div>
            <div className="h-full bg-air-red flex-1"></div>
          </div>
        </div>
        <div 
          className="absolute top-0 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1 border-2 border-gray-800"
          style={{ left: `${indicatorPosition}%` }}
        ></div>
        <div className="absolute top-6 left-0 text-white text-sm font-medium z-10 bg-gray-800 px-2 py-1 rounded">
          AQI: {airQualityPercentage}
        </div>
      </div>

      {/* Air Quality Details Card */}
      <div className={`${aqiColorClass} rounded-lg p-4 relative`}>
        <div className="absolute top-2 right-2">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h3 className="text-white font-semibold mb-3">Pollutant Details:</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-white">
            <span className="font-medium">PM2.5:</span>
            <span>{airQualityData.pm25?.toFixed(2) || 'N/A'} µg/m³</span>
          </div>
          <div className="flex justify-between text-white">
            <span className="font-medium">O₃ (Ozone):</span>
            <span>{airQualityData.o3?.toFixed(2) || 'N/A'} µg/m³</span>
          </div>
          <div className="flex justify-between text-white">
            <span className="font-medium">SO₂ (Sulfur Dioxide):</span>
            <span>{airQualityData.so2?.toFixed(2) || 'N/A'} µg/m³</span>
          </div>
          <div className="flex justify-between text-white">
            <span className="font-medium">NO₂ (Nitrogen Dioxide):</span>
            <span>{airQualityData.no2?.toFixed(2) || 'N/A'} µg/m³</span>
          </div>
          <div className="flex justify-between text-white">
            <span className="font-medium">CO (Carbon Monoxide):</span>
            <span>{airQualityData.co?.toFixed(2) || 'N/A'} µg/m³</span>
          </div>
          <div className="flex justify-between text-white">
            <span className="font-medium">NO (Nitric Oxide):</span>
            <span>{airQualityData.no?.toFixed(2) || 'N/A'} µg/m³</span>
          </div>
          <div className="flex justify-between text-white">
            <span className="font-medium">NOₓ (Nitrogen Oxides):</span>
            <span>{airQualityData.nox?.toFixed(2) || 'N/A'} µg/m³</span>
          </div>
          <div className="flex justify-between text-white border-t border-white border-opacity-30 pt-2 mt-2">
            <span className="font-bold">Air Quality Index (AQI):</span>
            <span className="font-bold">{airQualityData.aqi || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualitySection;
