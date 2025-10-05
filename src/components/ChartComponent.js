import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ChartComponent = ({ data }) => {
  // Default data if no CSV data available
  const defaultData = [
    { time: '10:00', value: 85 },
    { time: '11:00', value: 78 },
    { time: '12:00', value: 86 },
    { time: '13:00', value: 92 },
    { time: '14:00', value: 88 },
    { time: '15:00', value: 95 }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl font-semibold">Air Quality Trend</h2>
      
      <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg p-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#FFFFFF', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;
