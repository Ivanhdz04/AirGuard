import React, { useState } from 'react';
import AirQualitySection from './components/AirQualitySection';
import MapComponent from './components/MapComponent';
import WeatherSection from './components/WeatherSection';
import ChartComponent from './components/ChartComponent';
import PollutantsChart from './components/PollutantsChart';
import WeatherChart from './components/WeatherChart';
import VisualIndicators from './components/VisualIndicators';
import MaskRecommendation from './components/MaskRecommendation';
import DataStatsComponent from './components/DataStatsComponent';
import PredictionCard from './components/PredictionCard';
import HistoricalTrendsChart from './components/HistoricalTrendsChart';
import WeatherCorrelationChart from './components/WeatherCorrelationChart';
import AdvancedStatsPanel from './components/AdvancedStatsPanel';
import PredictionTimelineChart from './components/PredictionTimelineChart';
import ModelHealthIndicator from './components/ModelHealthIndicator';
import { useCSVData } from './hooks/useCSVData';
import { usePredictionAPI, useAPIHealth } from './hooks/usePredictionAPI';

function App() {
  const [selectedLocation, setSelectedLocation] = useState('Mexico City');
  const [selectedTab, setSelectedTab] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('12:00');

  // Cargar datos CSV
  const { airQualityData, weatherData, historicalData, allData, totalRecords, dateRange, loading, error } = useCSVData(selectedLocation);
  
  // Cargar predicciones de la API
  const { prediction, historicalData: apiHistoricalData, loading: predictionLoading, error: predictionError, refetch } = usePredictionAPI(selectedLocation);
  const { health } = useAPIHealth();

  const locations = ['Mexico City', 'Los Angeles'];
  const timeSlots = ['11:00', '12:00', '13:00'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background bokeh effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          {/* Main Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-white">AirGuard</h1>
            </div>
            <p className="text-gray-300 text-lg">Air Quality Protection Platform</p>
            <p className="text-gray-400 text-sm">Advanced Prediction & Monitoring</p>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-white text-lg font-medium">Currently - {selectedLocation}</h2>
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {/* Location selector */}
            <div className="flex space-x-2">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLocation === location
                      ? 'bg-white text-indigo-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
            
            {/* Model Health Indicator */}
            <ModelHealthIndicator health={health} prediction={prediction} />
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            {['Today', 'Tomorrow'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === tab
                    ? 'bg-white text-indigo-900'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Time selector */}
          <div className="flex space-x-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTime === time
                    ? 'bg-white text-indigo-900'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-white text-lg">Loading data...</div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 text-lg">{error}</div>
          </div>
        )}

        {/* Main content */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Air Quality Section */}
              <div className="space-y-6">
                <AirQualitySection data={airQualityData} />
              </div>

              {/* Prediction Section */}
              <div>
                <PredictionCard 
                  prediction={prediction} 
                  loading={predictionLoading} 
                  error={predictionError} 
                />
              </div>

              {/* Map Section */}
              <div>
                <MapComponent location={selectedLocation} airQualityData={airQualityData} />
              </div>
            </div>

            {/* Bottom section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Weather Section */}
              <WeatherSection data={weatherData} />

              {/* Chart Section */}
              <ChartComponent data={historicalData} />
            </div>

            {/* Advanced Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Historical Trends Chart */}
              <HistoricalTrendsChart 
                historicalData={apiHistoricalData} 
                prediction={prediction} 
              />

              {/* Prediction Timeline Chart */}
              <PredictionTimelineChart 
                prediction={prediction} 
                historicalData={apiHistoricalData} 
              />
            </div>

            {/* Weather Correlation Section */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <WeatherCorrelationChart historicalData={apiHistoricalData} />
            </div>

            {/* Advanced Statistics Section */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <AdvancedStatsPanel 
                prediction={prediction} 
                historicalData={apiHistoricalData} 
              />
            </div>

            {/* Visual Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Pollutants Chart */}
              <PollutantsChart data={airQualityData} />

              {/* Weather Chart */}
              <WeatherChart data={weatherData} />
            </div>

            {/* Visual Indicators Section */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <VisualIndicators 
                airQualityData={airQualityData}
                weatherData={weatherData}
              />
            </div>

            {/* Mask Recommendation Section */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <MaskRecommendation airQualityData={airQualityData} />
            </div>

            {/* Data Statistics Section */}
            <div className="grid grid-cols-1 gap-6">
              <DataStatsComponent 
                totalRecords={totalRecords}
                dateRange={dateRange}
                allData={allData}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
