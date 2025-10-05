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
        maskIcon: '🦠',
        description: 'N95 Respirator',
        protection: 'Medium Protection',
        color: 'yellow',
        bgColor: 'bg-yellow-500',
        recommendation: 'Recommended - Moderate air quality',
        details: [
          'Filters 95% of particles',
          'Protection against PM2.5',
          'Improved facial seal',
          'NIOSH certified'
        ],
        whenToUse: 'For outdoor activities and people with respiratory issues'
      };
    }
    
    if (aqi <= 150) {
      return {
        showRecommendation: true,
        maskType: 'N99 Respirator',
        maskIcon: '🛡️',
        description: 'High-efficiency respirator',
        protection: 'High Protection',
        color: 'orange',
        bgColor: 'bg-orange-500',
        recommendation: 'Highly recommended - Unhealthy air quality',
        details: [
          'Filters 99% of particles',
          'Protection against pollutants',
          'Exhalation valve',
          'Ergonomic design'
        ],
        whenToUse: 'For all outdoor activities and sensitive groups'
      };
    }
    
    return {
      showRecommendation: true,
      maskType: 'P100 Respirator',
      maskIcon: '🔒',
      description: 'Maximum protection respirator',
      protection: 'Maximum Protection',
      color: 'red',
      bgColor: 'bg-red-500',
      recommendation: 'REQUIRED - Very unhealthy air quality',
      details: [
        'Filters 99.97% of particles',
        'Protection against toxic gases',
        'Advanced filtering system',
        'Professional use'
      ],
      whenToUse: 'For any outdoor activity - Avoid going out if possible'
    };
  };

  const maskInfo = getMaskRecommendation(airQualityData.aqi);

  // If air quality is good, show a simple message
  if (!maskInfo.showRecommendation) {
    return (
      <div className="space-y-4">
        <h2 className="text-white text-xl font-semibold">Mask Recommendation</h2>
        
        <div className={`${maskInfo.bgColor} rounded-lg p-6 text-white text-center`}>
          <div className="text-6xl mb-4">😊</div>
          <div className="text-2xl font-bold mb-2">No Mask Needed</div>
          <div className="text-lg opacity-90">{maskInfo.message}</div>
          <div className="text-sm opacity-75 mt-4">
            Current AQI: {airQualityData.aqi} - Air quality is satisfactory
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-800 to-blue-800 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Air Quality Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{airQualityData.pm25}</div>
              <div className="text-gray-300 text-sm">PM2.5 (µg/m³)</div>
              <div className="text-xs text-gray-400 mt-1">Fine particles</div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{airQualityData.o3}</div>
              <div className="text-gray-300 text-sm">O3 (µg/m³)</div>
              <div className="text-xs text-gray-400 mt-1">Ozone</div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{airQualityData.co}</div>
              <div className="text-gray-300 text-sm">CO (µg/m³)</div>
              <div className="text-xs text-gray-400 mt-1">Carbon monoxide</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show mask recommendation for unhealthy air
  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl font-semibold">Mask Recommendation</h2>
      
      {/* Main card */}
      <div className={`${maskInfo.bgColor} rounded-lg p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-6xl mb-2">{maskInfo.maskIcon}</div>
            <div className="text-2xl font-bold">{maskInfo.maskType}</div>
            <div className="text-lg opacity-90">{maskInfo.description}</div>
          </div>
          
          <div className="text-right">
            <div className="text-sm opacity-75">Protection:</div>
            <div className="text-xl font-semibold">{maskInfo.protection}</div>
            <div className="text-sm opacity-75 mt-2">AQI: {airQualityData.aqi}</div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
          <div className="font-semibold text-lg mb-2">Recommendation:</div>
          <div className="text-sm">{maskInfo.recommendation}</div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="font-semibold text-lg mb-2">When to use:</div>
          <div className="text-sm">{maskInfo.whenToUse}</div>
        </div>
      </div>

      {/* Technical details */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Mask Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {maskInfo.details.map((detail, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage guide */}
      <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Proper Usage Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-white font-medium">✅ Steps for proper use:</div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• Wash hands before touching the mask</div>
              <div>• Place over nose and mouth completely</div>
              <div>• Adjust straps behind ears</div>
              <div>• Check for air gaps</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-white font-medium">⚠️ What to avoid:</div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• Don't touch the front of the mask</div>
              <div>• Don't reuse disposable masks</div>
              <div>• Don't use if wet or damaged</div>
              <div>• Don't share masks with others</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional information */}
      <div className="bg-gradient-to-r from-green-800 to-blue-800 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Current Air Quality Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{airQualityData.pm25}</div>
            <div className="text-gray-300 text-sm">PM2.5 (µg/m³)</div>
            <div className="text-xs text-gray-400 mt-1">Fine particles</div>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{airQualityData.o3}</div>
            <div className="text-gray-300 text-sm">O3 (µg/m³)</div>
            <div className="text-xs text-gray-400 mt-1">Ozone</div>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{airQualityData.co}</div>
            <div className="text-gray-300 text-sm">CO (µg/m³)</div>
            <div className="text-xs text-gray-400 mt-1">Carbon monoxide</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaskRecommendation;
