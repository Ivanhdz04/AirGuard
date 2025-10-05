// Utility to read and process CSV files
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const row = {};
    
    headers.forEach((header, index) => {
      let value = values[index];
      
      // Convert numeric values
      if (!isNaN(value) && value !== '') {
        value = parseFloat(value);
      }
      
      // Clean quotes if present
      if (typeof value === 'string') {
        value = value.replace(/"/g, '');
      }
      
      row[header.trim()] = value;
    });
    
    return row;
  });
  
  return data;
};

// Function to load data from CSV files
export const loadCSVData = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
};

// Function to get air quality data
export const getAirQualityData = (csvData) => {
  if (!csvData || csvData.length === 0) return null;
  
  const latestData = csvData[csvData.length - 1];
  
  return {
    pm25: Math.round(latestData.pm25 || 0),
    o3: Math.round((latestData.o3 || 0) * 1000), // Convert to µg/m³
    so2: Math.round((latestData.so2 || 0) * 1000), // Convert to µg/m³
    no2: Math.round((latestData.no2 || 0) * 1000), // Convert to µg/m³
    co: Math.round((latestData.co || 0) * 1000), // Convert to µg/m³
    no: Math.round((latestData.no || 0) * 1000), // Convert to µg/m³
    nox: Math.round((latestData.nox || 0) * 1000), // Convert to µg/m³
    aqi: calculateAQI(latestData.pm25 || 0),
    timestamp: latestData.timestamp
  };
};

// Function to get complete weather data
export const getWeatherData = (csvData) => {
  if (!csvData || csvData.length === 0) return null;
  
  const latestData = csvData[csvData.length - 1];
  
  return {
    temperature: Math.round(latestData.temperature_2m || 0),
    humidity: Math.round(latestData.relativehumidity_2m || 0),
    pressure: Math.round(latestData.pressure_msl || 0),
    windSpeed: Math.round(latestData.windspeed_10m || 0),
    windDirection: Math.round(latestData.winddirection_10m || 0),
    precipitation: latestData.precipitation || 0,
    boundaryLayerHeight: Math.round(latestData.boundary_layer_height || 0),
    shortwaveRadiation: Math.round(latestData.shortwave_radiation_sum || 0),
    hourOfDay: latestData.hour_of_day || 0,
    dayOfWeek: latestData.day_of_week || 0,
    monthOfYear: latestData.month_of_year || 0,
    isWeekend: latestData.is_weekend || false,
    timestamp: latestData.timestamp
  };
};

// Function to calculate AQI based on PM2.5
const calculateAQI = (pm25) => {
  if (pm25 <= 12) return Math.round((pm25 / 12) * 50);
  if (pm25 <= 35.4) return Math.round(((pm25 - 12) / (35.4 - 12)) * 50 + 50);
  if (pm25 <= 55.4) return Math.round(((pm25 - 35.4) / (55.4 - 35.4)) * 50 + 100);
  if (pm25 <= 150.4) return Math.round(((pm25 - 55.4) / (150.4 - 55.4)) * 50 + 150);
  return Math.round(((pm25 - 150.4) / (250.4 - 150.4)) * 50 + 200);
};

// Function to get historical data for charts
export const getHistoricalData = (csvData, hours = 24) => {
  if (!csvData || csvData.length === 0) return [];
  
  const recentData = csvData.slice(-hours);
  
  return recentData.map((row, index) => ({
    time: formatTime(row.timestamp),
    value: calculateAQI(row.pm25 || 0),
    pm25: Math.round(row.pm25 || 0),
    temperature: Math.round(row.temperature_2m || 0),
    humidity: Math.round(row.relativehumidity_2m || 0),
    pressure: Math.round(row.pressure_msl || 0),
    windSpeed: Math.round(row.windspeed_10m || 0),
    o3: Math.round((row.o3 || 0) * 1000),
    co: Math.round((row.co || 0) * 1000),
    no2: Math.round((row.no2 || 0) * 1000),
    so2: Math.round((row.so2 || 0) * 1000)
  }));
};

// Function to get complete statistics
export const getCompleteStats = (csvData) => {
  if (!csvData || csvData.length === 0) return null;
  
  return {
    airQuality: getAirQualityData(csvData),
    weather: getWeatherData(csvData),
    historical: getHistoricalData(csvData, 12),
    allData: csvData,
    totalRecords: csvData.length,
    dateRange: {
      start: csvData[0]?.timestamp,
      end: csvData[csvData.length - 1]?.timestamp
    }
  };
};

// Function to format timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
