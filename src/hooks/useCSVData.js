import { useState, useEffect } from 'react';
import { loadCSVData, getCompleteStats } from '../utils/csvUtils';

export const useCSVData = (location) => {
  const [completeData, setCompleteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determinar el archivo CSV basado en la ubicación
        const fileName = location === 'Mexico City' 
          ? 'realtime_data_Centro_CDMX.csv' 
          : 'realtime_data_Centro_LA.csv';
        
        const csvPath = `/data/csv/${fileName}`;
        
        // Load CSV data
        const csvData = await loadCSVData(csvPath);
        
        if (csvData.length > 0) {
          // Process all data
          const stats = getCompleteStats(csvData);
          setCompleteData(stats);
        } else {
          setError('No data found in CSV file');
        }
      } catch (err) {
        console.error('Error loading CSV data:', err);
        setError('Error loading CSV data file');
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
