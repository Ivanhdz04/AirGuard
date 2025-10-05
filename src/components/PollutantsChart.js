import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PollutantsChart = ({ data }) => {
  if (!data) return null;

  // Data for bar chart
  const pollutantsData = [
    { name: 'PM2.5', value: data.pm25, color: '#EF4444', description: 'Fine particles' },
    { name: 'O3', value: data.o3, color: '#F59E0B', description: 'Ozone' },
    { name: 'SO2', value: data.so2, color: '#8B5CF6', description: 'Sulfur dioxide' },
    { name: 'NO2', value: data.no2, color: '#06B6D4', description: 'Nitrogen dioxide' },
    { name: 'CO', value: data.co, color: '#10B981', description: 'Carbon monoxide' },
    { name: 'NO', value: data.no, color: '#F97316', description: 'Nitric oxide' },
    { name: 'NOX', value: data.nox, color: '#84CC16', description: 'Nitrogen oxides' }
  ];

  // Data for pie chart (AQI)
  const aqiData = [
    { name: 'Good', value: Math.min(data.aqi, 50), color: '#10B981' },
    { name: 'Moderate', value: Math.max(0, Math.min(data.aqi - 50, 50)), color: '#F59E0B' },
    { name: 'Unhealthy', value: Math.max(0, Math.min(data.aqi - 100, 50)), color: '#F97316' },
    { name: 'Very Unhealthy', value: Math.max(0, data.aqi - 150), color: '#EF4444' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pollutant = pollutantsData.find(p => p.name === label);
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-gray-300 text-sm">{pollutant?.description}</p>
          <p className="text-white">{`Valor: ${payload[0].value} µg/m³`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-semibold">Pollutant Analysis</h2>
      
      {/* Bar chart */}
      <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg p-6">
        <h3 className="text-white text-lg font-medium mb-4">Pollutant Concentration</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pollutantsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#6B7280" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              label={{ value: 'µg/m³', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {pollutantsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart for AQI */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-6">
        <h3 className="text-white text-lg font-medium mb-4">Air Quality Status</h3>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">{data.aqi}</div>
            <div className="text-white text-sm">AQI</div>
            <div className="text-gray-300 text-xs mt-1">
              {data.aqi <= 50 ? 'Good' : 
               data.aqi <= 100 ? 'Moderate' : 
               data.aqi <= 150 ? 'Unhealthy' : 'Very Unhealthy'}
            </div>
          </div>
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={aqiData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {aqiData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">Good (0-50)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-white">Moderate (51-100)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-white">Unhealthy (101-150)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white">Very Unhealthy (151+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollutantsChart;
