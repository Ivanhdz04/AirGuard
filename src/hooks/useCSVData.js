import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

// Map city names to API format
const mapCityName = (cityName) => {
  const city = cityName.toLowerCase().trim();
  if (city.includes('mexico') || city.includes('cdmx')) {
    return 'mexicocity';
  } else if (city.includes('los angeles') || city.includes('la')) {
    return 'la';
  }
  return city.replace(/\s+/g, '');
};

// Process historical data from backend to match CSV format
const processHistoricalData = (historicalData) => {
  if (!historicalData || historicalData.length === 0) {
    return {
      airQuality: null,
      weather: null,
      historical: [],
      allData: [],
      totalRecords: 0,
      dateRange: { start: null, end: null }
    };
  }

  // Get latest data point for current air quality and weather
  const latest = historicalData[historicalData.length - 1];
  
  // Calculate AQI from PM2.5
  const calculateAQI = (pm25) => {
    if (pm25 <= 12.0) return Math.round((50/12) * pm25);
    if (pm25 <= 35.4) return Math.round(50 + (50/23.4) * (pm25 - 12.0));
    if (pm25 <= 55.4) return Math.round(100 + (50/20) * (pm25 - 35.4));
    if (pm25 <= 150.4) return Math.round(150 + (100/95) * (pm25 - 55.4));
    return Math.round(200 + (100/49.6) * (pm25 - 150.4));
  };

  const airQuality = {
    aqi: calculateAQI(latest.pm25),
    pm25: latest.pm25,
    o3: latest.o3 || 0,
    so2: latest.so2 || 0,
    no2: latest.no2 || 0,
    co: latest.co || 0,
    no: latest.no || 0,
    nox: latest.nox || 0
  };

  const weather = {
    temperature: latest.temperature_2m,
    humidity: latest.relativehumidity_2m,
    pressure: latest.pressure_msl,
    windSpeed: latest.windspeed_10m,
    windDirection: latest.winddirection_10m,
    precipitation: latest.precipitation || 0,
    boundaryLayerHeight: latest.boundary_layer_height || 0,
    shortwaveRadiation: latest.shortwave_radiation || 0,
    hourOfDay: new Date(latest.timestamp).getHours(),
    isWeekend: [0, 6].includes(new Date(latest.timestamp).getDay())
  };

  // Process historical data for charts
  const historical = historicalData.map(item => ({
    timestamp: item.timestamp,
    pm25: item.pm25,
    temperature: item.temperature_2m,
    humidity: item.relativehumidity_2m,
    pressure: item.pressure_msl,
    windSpeed: item.windspeed_10m,
    windDirection: item.winddirection_10m,
    precipitation: item.precipitation || 0,
    boundaryLayerHeight: item.boundary_layer_height || 0,
    shortwaveRadiation: item.shortwave_radiation || 0,
    hourOfDay: new Date(item.timestamp).getHours(),
    isWeekend: [0, 6].includes(new Date(item.timestamp).getDay())
  }));

  // Calculate date range
  const timestamps = historicalData.map(item => new Date(item.timestamp));
  const dateRange = {
    start: timestamps.length > 0 ? new Date(Math.min(...timestamps)) : null,
    end: timestamps.length > 0 ? new Date(Math.max(...timestamps)) : null
  };

  return {
    airQuality,
    weather,
    historical,
    allData: historicalData,
    totalRecords: historicalData.length,
    dateRange
  };
};

export const useCSVData = (location) => {
  const [completeData, setCompleteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiCityName = mapCityName(location);
        console.log(`Loading CSV data for: ${location} -> ${apiCityName}`);
        
        // Fetch historical data from backend
        const response = await fetch(`${API_BASE_URL}/data/${apiCityName}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const historicalData = await response.json();
        console.log('Historical data received for CSV processing:', historicalData);
        
        if (Array.isArray(historicalData) && historicalData.length > 0) {
          // Process the data to match CSV format
          const processedData = processHistoricalData(historicalData);
          setCompleteData(processedData);
        } else {
          setError('No historical data available from backend');
        }
      } catch (err) {
        console.error('Error loading data from backend:', err);
        setError('Error loading data from backend');
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      loadData();
    }
  }, [location]);

  return {
    airQualityData: completeData?.airQuality,
    weatherData: completeData?.weather,
    historicalData: completeData?.historical,
    allData: completeData?.allData,
    totalRecords: completeData?.totalRecords,
    dateRange: completeData?.dateRange,
    loading,
    error
  };
};