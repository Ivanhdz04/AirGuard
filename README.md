# AirGuard

**Air Quality Protection Platform** - A modern web application for predicting air quality with integrated weather information and advanced monitoring capabilities.

## Features

- 🌍 Air quality prediction for multiple locations
- 🌤️ Real-time weather information
- 📊 Air quality trend charts
- 🗺️ Location visualization on interactive map
- 📱 Modern responsive design
- 🎨 Dark theme with visual effects

## Technologies

- React 18
- Tailwind CSS
- Recharts (for charts)
- Leaflet (for maps)
- HTML5/CSS3

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the application:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/
│   ├── AirQualitySection.js    # Air quality section
│   ├── MapComponent.js         # Map component
│   ├── WeatherSection.js       # Weather section
│   ├── ChartComponent.js       # Trend chart
│   ├── PollutantsChart.js      # Pollutant analysis chart
│   ├── WeatherChart.js         # Weather conditions chart
│   ├── VisualIndicators.js     # Visual indicators
│   ├── MaskRecommendation.js   # Mask recommendation
│   └── DataStatsComponent.js   # Data statistics
├── hooks/
│   └── useCSVData.js           # CSV data hook
├── utils/
│   └── csvUtils.js             # CSV utilities
├── App.js                      # Main component
├── index.js                    # Entry point
└── index.css                   # Global styles
```

## Features

### Air Quality
- Visual progress bar with color indicators
- Pollutant details (PM2.5, O3, SO2, NO2, CO, NO, NOX)
- Air Quality Index (AQI) calculation

### Interactive Map
- Real-time location visualization
- Impact circles that change based on air quality
- Interactive markers with detailed information
- Complete color legend
- Scalable to multiple cities worldwide

### Weather
- Current weather conditions
- Hourly forecasts
- Meteorological icons
- Detailed weather parameters

### Charts
- Real-time air quality trends
- Interactive line charts
- Historical data visualization
- Pollutant concentration analysis

### Visual Indicators
- Clear air quality status
- Practical recommendations
- Visual progress bars
- Quick information cards

### Mask Recommendations
- Smart mask recommendations based on AQI
- Detailed specifications for each mask type
- Usage guides and safety information
- Only shows recommendations when necessary
- Global health standards compliance

## Scalability

AirGuard is designed to be easily scalable to multiple cities and regions worldwide:

- **Modular Architecture**: Easy to add new locations
- **CSV Data Integration**: Simple data import for new cities
- **Configurable Parameters**: Customizable for different regions
- **API Ready**: Prepared for real-time data integration
- **Global Standards**: Compliant with international air quality standards

## Demo Locations

Currently demonstrating with sample data from:
- Mexico City (Centro)
- Los Angeles (Downtown)

*Note: This is a demonstration version. The platform is designed to support multiple cities globally.*

## Customization

You can modify colors in `tailwind.config.js`:

```javascript
colors: {
  'air-green': '#10B981',
  'air-yellow': '#F59E0B',
  'air-orange': '#F97316',
  'air-red': '#EF4444',
  // ...
}
```

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
