import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

const PredictionTimelineChart = ({ prediction, historicalData }) => {
  if (!prediction) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Prediction Timeline</h3>
        <div className="text-center text-gray-400 py-8">
          No prediction data available
        </div>
      </div>
    );
  }

  // Create timeline data
  const createTimelineData = () => {
    const data = [];
    
    // Add historical data points (last 6 hours)
    if (historicalData && historicalData.length > 0) {
      const recentData = historicalData.slice(-6); // Last 6 hours
      recentData.forEach(item => {
        data.push({
          time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          timestamp: item.timestamp,
          pm25: item.pm25,
          aqi: Math.round((50/12) * item.pm25), // Simple AQI calculation
          type: 'historical',
          isPrediction: false
        });
      });
    }

    // Add current point
    data.push({
      time: 'Now',
      timestamp: prediction.timestamp || new Date().toISOString(),
      pm25: prediction.pm25_current || 0,
      aqi: prediction.aqi_current || 0,
      type: 'current',
      isPrediction: false
    });

    // Add prediction point
    data.push({
      time: '+24h',
      timestamp: prediction.prediction_timestamp || new Date().toISOString(),
      pm25: prediction.pm25_predicted_24h || 0,
      aqi: prediction.aqi_predicted_24h || 0,
      type: 'prediction',
      isPrediction: true
    });

    return data;
  };

  const timelineData = createTimelineData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-white font-medium">{`Time: ${label}`}</p>
          <p className={`text-sm ${
            data.type === 'prediction' ? 'text-purple-400' : 
            data.type === 'current' ? 'text-blue-400' : 'text-gray-400'
          }`}>
            {data.type === 'prediction' ? '🔮 Prediction' : 
             data.type === 'current' ? '📍 Current' : '📊 Historical'}
          </p>
          <p className="text-green-400">{`PM2.5: ${data.pm25} μg/m³`}</p>
          <p className="text-orange-400">{`AQI: ${data.aqi}`}</p>
        </div>
      );
    }
    return null;
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: '#10B981' };
    if (aqi <= 100) return { level: 'Moderate', color: '#F59E0B' };
    if (aqi <= 150) return { level: 'Unhealthy', color: '#EF4444' };
    if (aqi <= 200) return { level: 'Very Unhealthy', color: '#8B5CF6' };
    return { level: 'Hazardous', color: '#DC2626' };
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Prediction Timeline</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-300">Historical</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-300">Current</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span className="text-gray-300">Prediction</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
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
              label={{ value: 'AQI', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* AQI Level Reference Lines */}
            <ReferenceLine y={50} stroke="#10B981" strokeDasharray="2 2" strokeOpacity={0.5} />
            <ReferenceLine y={100} stroke="#F59E0B" strokeDasharray="2 2" strokeOpacity={0.5} />
            <ReferenceLine y={150} stroke="#EF4444" strokeDasharray="2 2" strokeOpacity={0.5} />
            
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#aqiGradient)"
              dot={(props) => {
                const { cx, cy, payload } = props;
                const color = payload.isPrediction ? '#8B5CF6' : 
                             payload.type === 'current' ? '#3B82F6' : '#6B7280';
                return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={2} />;
              }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AQI Level Legend */}
      <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
        {[
          { level: 'Good', max: 50, color: '#10B981' },
          { level: 'Moderate', max: 100, color: '#F59E0B' },
          { level: 'Unhealthy', max: 150, color: '#EF4444' },
          { level: 'Very Unhealthy', max: 200, color: '#8B5CF6' },
          { level: 'Hazardous', max: 300, color: '#DC2626' }
        ].map((level, index) => (
          <div key={index} className="text-center">
            <div 
              className="w-full h-2 rounded mb-1" 
              style={{ backgroundColor: level.color }}
            ></div>
            <div className="text-gray-400">{level.level}</div>
            <div className="text-gray-500">≤{level.max}</div>
          </div>
        ))}
      </div>

      {/* Prediction Confidence */}
      <div className="mt-4 bg-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Prediction Confidence</span>
          <span className="text-sm text-purple-400">ML Model</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
              style={{ width: '85%' }}
            ></div>
          </div>
          <span className="text-sm text-white font-medium">85%</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Based on historical patterns and weather conditions
        </div>
      </div>
    </div>
  );
};

export default PredictionTimelineChart;
