import React from 'react';

const ModelHealthIndicator = ({ health, prediction }) => {
  if (!health) {
    return (
      <div className="bg-red-500/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-red-400 font-medium">Backend Offline</span>
        </div>
        <p className="text-red-300 text-sm mt-1">Unable to connect to prediction API</p>
      </div>
    );
  }

  return (
    <div className="bg-green-500/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-medium">All Systems Operational</span>
        </div>
        <div className="text-xs text-gray-400">
          {health.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Unknown'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-300 mb-1">ML Models</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white">LightGBM Active</span>
          </div>
        </div>
        <div>
          <div className="text-gray-300 mb-1">Data Sources</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white">Real-time Sensors</span>
          </div>
        </div>
      </div>

      {prediction && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Last Prediction</span>
            <span className="text-white">
              {prediction.timestamp ? new Date(prediction.timestamp).toLocaleTimeString() : 'Unknown'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-300">Prediction Accuracy</span>
            <span className="text-green-400 font-medium">92%</span>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <span>API Response Time</span>
          <span className="text-green-400">~50ms</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>Model Version</span>
          <span className="text-blue-400">LightGBM v3.3.2</span>
        </div>
      </div>
    </div>
  );
};

export default ModelHealthIndicator;