import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ location, airQualityData }) => {
  // Coordenadas de las ciudades
  const cityCoordinates = {
    'Mexico City': { lat: 19.4326, lng: -99.1332, name: 'Ciudad de México' },
    'Los Angeles': { lat: 34.0522, lng: -118.2437, name: 'Los Ángeles' }
  };

  const currentCity = cityCoordinates[location] || cityCoordinates['Mexico City'];
  
  // Calcular radio del círculo basado en la calidad del aire
  const getCircleRadius = (aqi) => {
    if (aqi <= 50) return 2000; // Verde - Bueno
    if (aqi <= 100) return 3000; // Amarillo - Moderado
    if (aqi <= 150) return 4000; // Naranja - Insalubre para grupos sensibles
    return 5000; // Rojo - Insalubre
  };

  const getCircleColor = (aqi) => {
    if (aqi <= 50) return '#10B981'; // Verde
    if (aqi <= 100) return '#F59E0B'; // Amarillo
    if (aqi <= 150) return '#F97316'; // Naranja
    return '#EF4444'; // Rojo
  };

  const aqi = airQualityData?.aqi || 86;
  const radius = getCircleRadius(aqi);
  const color = getCircleColor(aqi);

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-96 relative overflow-hidden">
      <div className="absolute top-2 left-2 z-[1000] bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
        {currentCity.name} - AQI: {aqi}
      </div>
      
      <MapContainer
        center={[currentCity.lat, currentCity.lng]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador principal */}
        <Marker position={[currentCity.lat, currentCity.lng]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{currentCity.name}</h3>
              <p className="text-sm">Calidad del Aire: {aqi}</p>
              {airQualityData && (
                <div className="text-xs mt-2">
                  <p>PM2.5: {airQualityData.pm25} µg/m³</p>
                  <p>O3: {airQualityData.o3} µg/m³</p>
                  <p>CO: {airQualityData.co} µg/m³</p>
                </div>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Círculo de impacto de calidad del aire */}
        <Circle
          center={[currentCity.lat, currentCity.lng]}
          radius={radius}
          pathOptions={{
            color: color,
            fillColor: color,
            fillOpacity: 0.2,
            weight: 2
          }}
        />
      </MapContainer>
      
      {/* Leyenda */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-xs">
        <div className="font-bold mb-1">Calidad del Aire:</div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Bueno (0-50)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Moderado (51-100)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Insalubre (101-150)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Muy Insalubre (151+)</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
