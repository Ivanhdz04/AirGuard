import React from 'react';

const AdvancedStatsPanel = ({ prediction, historicalData }) => {
  // Safe data extraction with fallbacks
  const safePrediction = prediction || {};
  const safeHistoricalData = historicalData || [];

  if (!safePrediction && safeHistoricalData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Advanced Statistics</h3>
        <div className="text-center text-gray-400 py-8">
          No data available for analysis
        </div>
      </div>
    );
  }

  // Calculate statistics from historical data
  const calculateStats = (data) => {
    if (!data || data.length === 0) return null;
    
    const pm25Values = data.map(item => item.pm25 || 0).filter(val => !isNaN(val));
    const temperatureValues = data.map(item => item.temperature_2m || 0).filter(val => !isNaN(val));
    const humidityValues = data.map(item => item.relativehumidity_2m || 0).filter(val => !isNaN(val));
    
    if (pm25Values.length === 0) return null;
    
    const avg = (arr) => arr.length > 0 ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;
    const std = (arr) => {
      if (arr.length === 0) return 0;
      const mean = avg(arr);
      return Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length);
    };
    
    return {
      pm25: {
        mean: avg(pm25Values),
        std: std(pm25Values),
        min: Math.min(...pm25Values),
        max: Math.max(...pm25Values),
        median: pm25Values.sort((a, b) => a - b)[Math.floor(pm25Values.length / 2)]
      },
      temperature: {
        mean: avg(temperatureValues),
        std: std(temperatureValues),
        min: temperatureValues.length > 0 ? Math.min(...temperatureValues) : 0,
        max: temperatureValues.length > 0 ? Math.max(...temperatureValues) : 0
      },
      humidity: {
        mean: avg(humidityValues),
        std: std(humidityValues),
        min: humidityValues.length > 0 ? Math.min(...humidityValues) : 0,
        max: humidityValues.length > 0 ? Math.max(...humidityValues) : 0
      }
    };
  };

  const stats = calculateStats(safeHistoricalData);

  // Calculate AQI level
  const getAQILevel = (aqi) => {
    const aqiValue = aqi || 0;
    if (aqiValue <= 50) return { level: 'Good', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (aqiValue <= 100) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (aqiValue <= 150) return { level: 'Unhealthy for Sensitive', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (aqiValue <= 200) return { level: 'Unhealthy', color: 'text-red-400', bg: 'bg-red-500/20' };
    return { level: 'Very Unhealthy', color: 'text-purple-400', bg: 'bg-purple-500/20' };
  };

  // Safe values
  const currentAqi = safePrediction.aqi_current || 0;
  const predictedAqi = safePrediction.aqi_predicted_24h || 0;
  const currentPm25 = safePrediction.pm25_current || 0;
  const predictedPm25 = safePrediction.pm25_predicted_24h || 0;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Advanced Statistics</h3>
      
      {/* Current vs Predicted Comparison */}
      {safePrediction && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-300 mb-3">Current vs Predicted Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Current AQI</div>
              <div className="text-2xl font-bold text-white">{currentAqi}</div>
              <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getAQILevel(currentAqi).bg}`}>
                <span className={getAQILevel(currentAqi).color}>
                  {getAQILevel(currentAqi).level}
                </span>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Predicted AQI</div>
              <div className="text-2xl font-bold text-white">{predictedAqi}</div>
              <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getAQILevel(predictedAqi).bg}`}>
                <span className={getAQILevel(predictedAqi).color}>
                  {getAQILevel(predictedAqi).level}
                </span>
              </div>
            </div>
          </div>
          
          {/* Change Analysis */}
          <div className="mt-4 bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Change Analysis</span>
              <div className={`flex items-center space-x-1 ${
                predictedAqi < currentAqi ? 'text-green-400' : 'text-red-400'
              }`}>
                {predictedAqi < currentAqi ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium">
                  {predictedAqi < currentAqi ? 'Improving' : 'Worsening'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-white">
                  {(predictedPm25 - currentPm25) > 0 ? '+' : ''}
                  {(predictedPm25 - currentPm25).toFixed(1)}
                </div>
                <div className="text-xs text-gray-400">PM2.5 Change</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {(predictedAqi - currentAqi) > 0 ? '+' : ''}
                  {(predictedAqi - currentAqi)}
                </div>
                <div className="text-xs text-gray-400">AQI Change</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {currentPm25 > 0 ? Math.abs((predictedPm25 - currentPm25) / currentPm25 * 100).toFixed(1) : 0}%
                </div>
                <div className="text-xs text-gray-400">% Change</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Statistics */}
      {stats && (
        <div>
          <h4 className="text-md font-medium text-gray-300 mb-3">24-Hour Historical Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* PM2.5 Statistics */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">PM2.5 Statistics</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Mean:</span>
                  <span className="text-sm text-white">{stats.pm25.mean.toFixed(1)} μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Std Dev:</span>
                  <span className="text-sm text-white">{stats.pm25.std.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Median:</span>
                  <span className="text-sm text-white">{stats.pm25.median.toFixed(1)} μg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Range:</span>
                  <span className="text-sm text-white">{stats.pm25.min.toFixed(1)} - {stats.pm25.max.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Weather Statistics */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Weather Statistics</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Avg Temp:</span>
                  <span className="text-sm text-white">{stats.temperature.mean.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Avg Humidity:</span>
                  <span className="text-sm text-white">{stats.humidity.mean.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Temp Range:</span>
                  <span className="text-sm text-white">{stats.temperature.min.toFixed(1)} - {stats.temperature.max.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Humidity Range:</span>
                  <span className="text-sm text-white">{stats.humidity.min.toFixed(1)} - {stats.humidity.max.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Quality Indicators */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-md font-medium text-gray-300 mb-3">Data Quality</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-green-400">{safeHistoricalData.length}</div>
            <div className="text-xs text-gray-400">Data Points</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-400">
              {Math.round((safeHistoricalData.length / 24) * 100)}%
            </div>
            <div className="text-xs text-gray-400">Coverage</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-purple-400">
              {safePrediction ? 'Active' : 'Inactive'}
            </div>
            <div className="text-xs text-gray-400">ML Model</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStatsPanel;