import React from 'react';

const MapComponent = ({ location, airQualityData }) => {
  // Información de las ciudades
  const cityInfo = {
    'Mexico City': { name: 'Ciudad de México', coordinates: '19.4326°N, 99.1332°W' },
    'Los Angeles': { name: 'Los Ángeles', coordinates: '34.0522°N, 118.2437°W' }
  };

  const currentCity = cityInfo[location] || cityInfo['Mexico City'];
  
  // Calcular color basado en la calidad del aire
  const getAirQualityColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAirQualityLevel = (aqi) => {
    if (aqi <= 50) return 'Bueno';
    if (aqi <= 100) return 'Moderado';
    if (aqi <= 150) return 'Insalubre para grupos sensibles';
    return 'Insalubre';
  };

  const aqi = airQualityData?.aqi || 86;
  const airQualityColor = getAirQualityColor(aqi);
  const airQualityLevel = getAirQualityLevel(aqi);

  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl font-semibold">Air Quality Map</h2>
      
      <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg p-6">
        {/* Header con información de la ciudad */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-lg font-semibold">{currentCity.name}</h3>
            <p className="text-gray-300 text-sm">{currentCity.coordinates}</p>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${airQualityColor}`}>
              {aqi}
            </div>
            <div className="text-gray-300 text-xs">AQI</div>
            <div className="text-gray-400 text-xs">{airQualityLevel}</div>
          </div>
        </div>

        {/* Imagen del mapa */}
        <div className="bg-gray-900 rounded-lg p-4">
          <img 
            src="/imageMap.jpeg" 
            alt={`Air Quality Map for ${currentCity.name}`}
            className="w-full h-auto rounded-lg shadow-lg"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};

export default MapComponent;