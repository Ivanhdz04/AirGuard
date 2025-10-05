import React from 'react';

const DataStatsComponent = ({ totalRecords, dateRange, allData }) => {
  if (!allData || allData.length === 0) return null;

  // Calculate statistics
  const avgPM25 = Math.round(allData.reduce((sum, row) => sum + (row.pm25 || 0), 0) / allData.length);
  const avgTemp = Math.round(allData.reduce((sum, row) => sum + (row.temperature_2m || 0), 0) / allData.length);
  const avgHumidity = Math.round(allData.reduce((sum, row) => sum + (row.relativehumidity_2m || 0), 0) / allData.length);
  
  const maxPM25 = Math.round(Math.max(...allData.map(row => row.pm25 || 0)));
  const minPM25 = Math.round(Math.min(...allData.map(row => row.pm25 || 0)));

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-semibold mb-4">Data Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="text-gray-300">
            <span className="font-medium">Total records:</span>
            <span className="text-white ml-2">{totalRecords}</span>
          </div>
          <div className="text-gray-300">
            <span className="font-medium">Start date:</span>
            <div className="text-white text-xs">{formatDate(dateRange?.start)}</div>
          </div>
          <div className="text-gray-300">
            <span className="font-medium">End date:</span>
            <div className="text-white text-xs">{formatDate(dateRange?.end)}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-gray-300">
            <span className="font-medium">PM2.5 average:</span>
            <span className="text-white ml-2">{avgPM25} µg/m³</span>
          </div>
          <div className="text-gray-300">
            <span className="font-medium">PM2.5 maximum:</span>
            <span className="text-red-400 ml-2">{maxPM25} µg/m³</span>
          </div>
          <div className="text-gray-300">
            <span className="font-medium">PM2.5 minimum:</span>
            <span className="text-green-400 ml-2">{minPM25} µg/m³</span>
          </div>
          <div className="text-gray-300">
            <span className="font-medium">Temp average:</span>
            <span className="text-white ml-2">{avgTemp}°C</span>
          </div>
          <div className="text-gray-300">
            <span className="font-medium">Humidity average:</span>
            <span className="text-white ml-2">{avgHumidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataStatsComponent;
