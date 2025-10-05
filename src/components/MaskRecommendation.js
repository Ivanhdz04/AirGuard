import React from 'react';

const MaskRecommendation = ({ airQualityData }) => {
  if (!airQualityData) return null;

  const getMaskRecommendation = (aqi) => {
    if (aqi <= 50) {
      return {
        showRecommendation: false,
        message: "Air quality is good - No mask needed",
        color: "green",
        bgColor: "bg-green-500"
      };
    }
    
    if (aqi <= 100) {
      return {
        showRecommendation: true,
        maskType: 'N95 Respirator',
        description: 'Medium Protection',
        color: 'yellow',
        bgColor: 'bg-yellow-500',
        recommendation: 'Recommended for moderate air quality',
        details: [
          'Filters 95% of particles',
          'Protection against PM2.5',
          'NIOSH certified'
        ],
        whenToUse: 'For outdoor activities and sensitive groups'
      };
    }
    
    if (aqi <= 150) {
      return {
        showRecommendation: true,
        maskType: 'N99 Respirator',
        description: 'High Protection',
        color: 'orange',
        bgColor: 'bg-orange-500',
        recommendation: 'Highly recommended for unhealthy air',
        details: [
          'Filters 99% of particles',
          'Protection against pollutants',
          'Exhalation valve'
        ],
        whenToUse: 'For all outdoor activities'
      };
    }
    
    return {
      showRecommendation: true,
      maskType: 'P100 Respirator',
      description: 'Maximum Protection',
      color: 'red',
      bgColor: 'bg-red-500',
      recommendation: 'REQUIRED - Very unhealthy air quality',
      details: [
        'Filters 99.97% of particles',
        'Protection against toxic gases',
        'Professional use'
      ],
      whenToUse: 'Avoid going out if possible'
    };
  };

  const maskInfo = getMaskRecommendation(airQualityData.aqi);

  // If air quality is good, show a simple message
  if (!maskInfo.showRecommendation) {
    return (
      <div className="space-y-4">
        <h2 className="text-white text-xl font-semibold">Mask Recommendation</h2>
        
        <div className={`${maskInfo.bgColor} rounded-lg p-4 text-white text-center`}>
          <div className="text-xl font-bold mb-2">No Mask Needed</div>
          <div className="text-sm opacity-90">{maskInfo.message}</div>
          <div className="text-xs opacity-75 mt-2">
            Current AQI: {airQualityData.aqi} - Air quality is satisfactory
          </div>
        </div>
      </div>
    );
  }

  // Show compact mask recommendation for unhealthy air
  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl font-semibold">Mask Recommendation</h2>
      
      {/* Main recommendation card */}
      <div className={`${maskInfo.bgColor} rounded-lg p-4 text-white`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-bold">{maskInfo.maskType}</div>
            <div className="text-sm opacity-90">{maskInfo.description}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">AQI: {airQualityData.aqi}</div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-3">
          <div className="font-semibold text-sm mb-1">Recommendation:</div>
          <div className="text-xs">{maskInfo.recommendation}</div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <div className="font-semibold text-sm mb-1">When to use:</div>
          <div className="text-xs">{maskInfo.whenToUse}</div>
        </div>
      </div>

      {/* Compact specifications */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white text-sm font-semibold mb-3">Specifications</h3>
        <div className="grid grid-cols-1 gap-2">
          {maskInfo.details.map((detail, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-xs">{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compact usage guide */}
      <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg p-4">
        <h3 className="text-white text-sm font-semibold mb-3">Usage Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-white font-medium text-xs">Proper use:</div>
            <div className="text-gray-300 text-xs space-y-0.5">
              <div>• Wash hands before use</div>
              <div>• Cover nose and mouth completely</div>
              <div>• Adjust straps properly</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-white font-medium text-xs">Avoid:</div>
            <div className="text-gray-300 text-xs space-y-0.5">
              <div>• Don't touch front of mask</div>
              <div>• Don't reuse disposable masks</div>
              <div>• Don't use if damaged</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaskRecommendation;