import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const WeatherCorrelationChart = ({ historicalData }) => {
  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Weather Correlation</h3>
        <div className="text-center text-gray-400 py-8">
          No data available for correlation analysis
        </div>
      </div>
    );
  }

  // Prepare correlation data
  const correlationData = historicalData.map(item => ({
    temperature: item.temperature_2m,
    humidity: item.relativehumidity_2m,
    pressure: item.pressure_msl,
    windSpeed: item.windspeed_10m,
    pm25: item.pm25,
    timestamp: item.timestamp
  }));

  // Calculate correlation coefficient
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return correlation;
  };

  const tempCorrelation = calculateCorrelation(
    correlationData.map(d => d.temperature),
    correlationData.map(d => d.pm25)
  );

  const humidityCorrelation = calculateCorrelation(
    correlationData.map(d => d.humidity),
    correlationData.map(d => d.pm25)
  );

  const pressureCorrelation = calculateCorrelation(
    correlationData.map(d => d.pressure),
    correlationData.map(d => d.pm25)
  );

  const windCorrelation = calculateCorrelation(
    correlationData.map(d => d.windSpeed),
    correlationData.map(d => d.pm25)
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white font-medium">Weather Impact</p>
          <p className="text-green-400">{`PM2.5: ${data.pm25} μg/m³`}</p>
          <p className="text-orange-400">{`Temperature: ${data.temperature}°C`}</p>
          <p className="text-blue-300">{`Humidity: ${data.humidity}%`}</p>
          <p className="text-purple-400">{`Pressure: ${data.pressure} hPa`}</p>
          <p className="text-cyan-400">{`Wind: ${data.windSpeed} m/s`}</p>
        </div>
      );
    }
    return null;
  };

  const getCorrelationColor = (correlation) => {
    const absCorr = Math.abs(correlation);
    if (absCorr > 0.7) return '#EF4444'; // Strong correlation
    if (absCorr > 0.4) return '#F59E0B'; // Moderate correlation
    if (absCorr > 0.2) return '#10B981'; // Weak correlation
    return '#6B7280'; // No correlation
  };

  const getCorrelationLabel = (correlation) => {
    const absCorr = Math.abs(correlation);
    if (absCorr > 0.7) return 'Strong';
    if (absCorr > 0.4) return 'Moderate';
    if (absCorr > 0.2) return 'Weak';
    return 'None';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Weather vs Air Quality Correlation</h3>
      
      {/* Correlation Matrix */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Temperature</span>
            <div 
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: getCorrelationColor(tempCorrelation) + '20',
                color: getCorrelationColor(tempCorrelation)
              }}
            >
              {getCorrelationLabel(tempCorrelation)}
            </div>
          </div>
          <div className="text-lg font-bold text-white">
            {tempCorrelation > 0 ? '+' : ''}{tempCorrelation.toFixed(3)}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Humidity</span>
            <div 
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: getCorrelationColor(humidityCorrelation) + '20',
                color: getCorrelationColor(humidityCorrelation)
              }}
            >
              {getCorrelationLabel(humidityCorrelation)}
            </div>
          </div>
          <div className="text-lg font-bold text-white">
            {humidityCorrelation > 0 ? '+' : ''}{humidityCorrelation.toFixed(3)}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Pressure</span>
            <div 
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: getCorrelationColor(pressureCorrelation) + '20',
                color: getCorrelationColor(pressureCorrelation)
              }}
            >
              {getCorrelationLabel(pressureCorrelation)}
            </div>
          </div>
          <div className="text-lg font-bold text-white">
            {pressureCorrelation > 0 ? '+' : ''}{pressureCorrelation.toFixed(3)}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Wind Speed</span>
            <div 
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                backgroundColor: getCorrelationColor(windCorrelation) + '20',
                color: getCorrelationColor(windCorrelation)
              }}
            >
              {getCorrelationLabel(windCorrelation)}
            </div>
          </div>
          <div className="text-lg font-bold text-white">
            {windCorrelation > 0 ? '+' : ''}{windCorrelation.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={correlationData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number" 
              dataKey="temperature" 
              name="Temperature"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <YAxis 
              type="number" 
              dataKey="pm25" 
              name="PM2.5"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter dataKey="pm25" fill="#3B82F6">
              {correlationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#3B82F6" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Correlation coefficient ranges from -1 (perfect negative) to +1 (perfect positive)
      </div>
    </div>
  );
};

export default WeatherCorrelationChart;
