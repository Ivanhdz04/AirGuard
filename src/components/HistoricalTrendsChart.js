import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const HistoricalTrendsChart = ({ historicalData, prediction }) => {
  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Historical Trends</h3>
        <div className="text-center text-gray-400 py-8">
          No historical data available
        </div>
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = historicalData.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    timestamp: item.timestamp,
    pm25: item.pm25,
    temperature: item.temperature_2m,
    humidity: item.relativehumidity_2m,
    pressure: item.pressure_msl,
    windSpeed: item.windspeed_10m
  }));

  // Add prediction point if available
  if (prediction) {
    const predictionTime = new Date(prediction.prediction_timestamp || new Date()).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    chartData.push({
      time: predictionTime,
      timestamp: prediction.prediction_timestamp || new Date().toISOString(),
      pm25: prediction.pm25_predicted_24h || 0,
      temperature: null,
      humidity: null,
      pressure: null,
      windSpeed: null,
      isPrediction: true
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white font-medium">{`Time: ${label}`}</p>
          {data.isPrediction ? (
            <p className="text-purple-400 text-sm">🔮 Prediction</p>
          ) : (
            <p className="text-blue-400 text-sm">📊 Historical</p>
          )}
          <p className="text-green-400">{`PM2.5: ${data.pm25} μg/m³`}</p>
          {data.temperature && (
            <p className="text-orange-400">{`Temperature: ${data.temperature}°C`}</p>
          )}
          {data.humidity && (
            <p className="text-blue-300">{`Humidity: ${data.humidity}%`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">24-Hour PM2.5 Trends</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-300">Historical</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span className="text-gray-300">Prediction</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'PM2.5 (μg/m³)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="pm25"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#pm25Gradient)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(historicalData.reduce((sum, item) => sum + item.pm25, 0) / historicalData.length)}
          </div>
          <div className="text-xs text-gray-400">Avg PM2.5</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">
            {Math.min(...historicalData.map(item => item.pm25))}
          </div>
          <div className="text-xs text-gray-400">Min PM2.5</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-2xl font-bold text-red-400">
            {Math.max(...historicalData.map(item => item.pm25))}
          </div>
          <div className="text-xs text-gray-400">Max PM2.5</div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTrendsChart;
