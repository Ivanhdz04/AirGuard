import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const WeatherChart = ({ data }) => {
  if (!data) return null;

  // Simulate historical data based on current data
  const weatherHistory = [
    { time: '06:00', temperature: data.temperature - 3, humidity: data.humidity + 5, pressure: data.pressure - 2 },
    { time: '09:00', temperature: data.temperature - 1, humidity: data.humidity + 2, pressure: data.pressure - 1 },
    { time: '12:00', temperature: data.temperature, humidity: data.humidity, pressure: data.pressure },
    { time: '15:00', temperature: data.temperature + 2, humidity: data.humidity - 3, pressure: data.pressure + 1 },
    { time: '18:00', temperature: data.temperature + 1, humidity: data.humidity - 1, pressure: data.pressure + 2 },
    { time: '21:00', temperature: data.temperature - 1, humidity: data.humidity + 2, pressure: data.pressure + 1 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="text-white font-semibold">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'temperature' ? '°C' : entry.dataKey === 'humidity' ? '%' : ' hPa'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-semibold">Weather Conditions</h2>
      
      {/* Temperature chart */}
      <div className="bg-gradient-to-br from-orange-800 to-orange-900 rounded-lg p-6">
        <h3 className="text-white text-lg font-medium mb-4">Daily Temperature</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weatherHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#6B7280" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              label={{ value: '°C', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="temperature" 
              stroke="#F97316" 
              fill="#F97316"
              fillOpacity={0.3}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity and pressure chart */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-6">
        <h3 className="text-white text-lg font-medium mb-4">Humidity and Atmospheric Pressure</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weatherHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#6B7280" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#06B6D4" 
              strokeWidth={3}
              dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="pressure" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-cyan-400 rounded"></div>
            <span className="text-white">Humidity (%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-purple-400 rounded"></div>
            <span className="text-white">Pressure (hPa)</span>
          </div>
        </div>
      </div>

      {/* Visual indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-lg p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{data.windSpeed}</div>
            <div className="text-white text-sm">km/h</div>
            <div className="text-gray-300 text-xs">Wind Speed</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{data.windDirection}°</div>
            <div className="text-white text-sm">Direction</div>
            <div className="text-gray-300 text-xs">Wind Direction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;
