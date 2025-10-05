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

export const usePredictionAPI = (city) => {
  const [prediction, setPrediction] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert city name to API format
      const apiCityName = mapCityName(cityName);
      console.log(`Fetching prediction for: ${cityName} -> ${apiCityName}`);
      const response = await fetch(`${API_BASE_URL}/predict/${apiCityName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Prediction data received:', data);
      setPrediction(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async (cityName) => {
    try {
      // Convert city name to API format
      const apiCityName = mapCityName(cityName);
      console.log(`Fetching historical data for: ${cityName} -> ${apiCityName}`);
      const response = await fetch(`${API_BASE_URL}/data/${apiCityName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Historical data received:', data);
      setHistoricalData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching historical data:', err);
    }
  };

  useEffect(() => {
    if (city) {
      fetchPrediction(city);
      fetchHistoricalData(city);
    }
  }, [city]);

  return {
    prediction,
    historicalData,
    loading,
    error,
    refetch: () => {
      if (city) {
        fetchPrediction(city);
        fetchHistoricalData(city);
      }
    }
  };
};

export const useAPIHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
      }
    } catch (err) {
      console.error('Health check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return { health, loading, checkHealth };
};
