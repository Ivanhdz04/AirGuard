import React from 'react';

const PredictionCard = ({ prediction, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-red-400">Prediction Error</h3>
        </div>
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">24-Hour Prediction</h3>
        <p className="text-gray-300 text-sm">No prediction data available</p>
      </div>
    );
  }

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    return 'text-purple-400';
  };

  const getAQIBgColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500/20 border-green-500/30';
    if (aqi <= 100) return 'bg-yellow-500/20 border-yellow-500/30';
    if (aqi <= 150) return 'bg-orange-500/20 border-orange-500/30';
    if (aqi <= 200) return 'bg-red-500/20 border-red-500/30';
    return 'bg-purple-500/20 border-purple-500/30';
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  const currentAqi = prediction.aqi_current || 0;
  const predictedAqi = prediction.aqi_predicted_24h || 0;
  const trend = predictedAqi < currentAqi ? 'improving' : 'worsening';

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">24-Hour Prediction</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAQIBgColor(predictedAqi)} ${getAQIColor(predictedAqi)}`}>
          {getAQILevel(predictedAqi)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Current */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm text-gray-300">Current</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentAqi}</div>
          <div className="text-sm text-gray-400">AQI</div>
          <div className="text-xs text-gray-500 mt-1">
            PM2.5: {prediction.pm25_current} μg/m³
          </div>
        </div>

        {/* Predicted */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-sm text-gray-300">Predicted</span>
          </div>
          <div className={`text-2xl font-bold ${getAQIColor(predictedAqi)}`}>
            {predictedAqi}
          </div>
          <div className="text-sm text-gray-400">AQI</div>
          <div className="text-xs text-gray-500 mt-1">
            PM2.5: {prediction.pm25_predicted_24h} μg/m³
          </div>
        </div>
      </div>

      {/* Change Indicator */}
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Change Trend</span>
          <div className={`flex items-center space-x-1 ${
            trend === 'improving' ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend === 'improving' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm font-medium">
              {trend === 'improving' ? 'Improving' : 'Worsening'}
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          AQI change: {predictedAqi - currentAqi > 0 ? '+' : ''}{predictedAqi - currentAqi}
        </div>
      </div>

      {/* City Info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Location</h4>
        <div className="text-sm text-gray-400">
          📍 {prediction.city || 'Unknown City'}
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
