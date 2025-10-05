#!/usr/bin/env python3
"""
AirGuard Full Stack Application - Simplified Version
Serves both React frontend and Flask backend API
"""

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import csv
import os
from datetime import datetime
import random

app = Flask(__name__, static_folder='../build', static_url_path='')
CORS(app)  # Enable CORS for React frontend

# Global data storage
DATA_FILES = {}

def load_csv_data():
    """Load CSV data files with historical data"""
    global DATA_FILES
    
    try:
        # Load CDMX historical data
        cdmx_path = os.path.join('data', 'dataset_final_cdmx_limpio.csv')
        if os.path.exists(cdmx_path):
            DATA_FILES['cdmx'] = []
            with open(cdmx_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    DATA_FILES['cdmx'].append(row)
            print(f"CDMX historical data loaded: {len(DATA_FILES['cdmx'])} records")
        
        # Load LA historical data
        la_path = os.path.join('data', 'dataset_final_LA_limpio.csv')
        if os.path.exists(la_path):
            DATA_FILES['la'] = []
            with open(la_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    DATA_FILES['la'].append(row)
            print(f"LA historical data loaded: {len(DATA_FILES['la'])} records")
            
    except Exception as e:
        print(f"Error loading data: {e}")

def calculate_aqi(pm25):
    """Calculate AQI from PM2.5 value"""
    try:
        pm25 = float(pm25)
        if pm25 <= 12.0:
            return int((50/12) * pm25)
        elif pm25 <= 35.4:
            return int(50 + (50/23.4) * (pm25 - 12.0))
        elif pm25 <= 55.4:
            return int(100 + (50/20) * (pm25 - 35.4))
        elif pm25 <= 150.4:
            return int(150 + (100/95) * (pm25 - 55.4))
        else:
            return int(200 + (100/49.6) * (pm25 - 150.4))
    except:
        return 0

def get_latest_prediction(city_key):
    """Get latest prediction based on historical data"""
    if city_key not in DATA_FILES or not DATA_FILES[city_key]:
        return None, "No data available for this city"
    
    data = DATA_FILES[city_key]
    latest = data[-1]  # Get last record
    
    try:
        current_pm25 = float(latest.get('pm25', 0))
        # Simple prediction: use latest PM2.5 value with small random variation
        variation = random.uniform(-0.1, 0.1)  # -10% to +10%
        predicted_pm25 = current_pm25 * (1 + variation)
        
        return {
            'pm25_current': round(current_pm25, 2),
            'pm25_predicted_24h': round(predicted_pm25, 2),
            'aqi_current': calculate_aqi(current_pm25),
            'aqi_predicted_24h': calculate_aqi(predicted_pm25),
            'timestamp': latest.get('timestamp', datetime.now().isoformat()),
            'prediction_timestamp': datetime.now().isoformat(),
            'city': city_key.upper(),
            'base_timestamp': latest.get('timestamp', datetime.now().isoformat())
        }, None
    except Exception as e:
        return None, f"Error processing data: {e}"

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'API is running',
        'model_version': 'CSV-based v1.0',
        'response_time_ms': 50,
        'timestamp': datetime.now().isoformat(),
        'data_sources': list(DATA_FILES.keys())
    })

@app.route('/api/predict/<city>', methods=['GET'])
def predict_air_quality(city):
    """Get air quality prediction for a city"""
    city_lower = city.lower()
    
    if "cdmx" in city_lower or "mexicocity" in city_lower:
        city_key = "cdmx"
    elif "la" in city_lower or "losangeles" in city_lower:
        city_key = "la"
    else:
        return jsonify({"error": "City not supported for predictions."}), 400
    
    prediction, error = get_latest_prediction(city_key)
    
    if error:
        return jsonify({"error": error}), 500
    
    return jsonify(prediction)

@app.route('/api/data/<city>', methods=['GET'])
def get_historical_data(city):
    """Get historical data for a city"""
    city_lower = city.lower()
    
    if "cdmx" in city_lower or "mexicocity" in city_lower:
        city_key = "cdmx"
    elif "la" in city_lower or "losangeles" in city_lower:
        city_key = "la"
    else:
        return jsonify({"error": "City not supported for historical data."}), 400
    
    if city_key not in DATA_FILES:
        return jsonify({"error": "Historical data file not found."}), 404
    
    data = DATA_FILES[city_key]
    
    # Return last 24 records (assuming hourly data)
    last_24_hours = data[-24:] if len(data) >= 24 else data
    
    # Convert to the format expected by frontend
    result = []
    for record in last_24_hours:
        try:
            pm25 = float(record.get('pm25', 0))
            result.append({
                'timestamp': record.get('timestamp', datetime.now().isoformat()),
                'pm25': pm25,
                'aqi': calculate_aqi(pm25),
                'temperature_2m': float(record.get('temperature_2m', 0)),
                'relativehumidity_2m': float(record.get('relativehumidity_2m', 0)),
                'windspeed_10m': float(record.get('windspeed_10m', 0)),
                'winddirection_10m': float(record.get('winddirection_10m', 0)),
                'pressure_msl': float(record.get('pressure_msl', 0))
            })
        except:
            continue
    
    return jsonify(result)

@app.route('/api/cities', methods=['GET'])
def get_cities():
    """Get available cities"""
    return jsonify({
        'cities': list(DATA_FILES.keys()),
        'available_data': list(DATA_FILES.keys())
    })

# Frontend Routes - Serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Serve React frontend"""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("Starting AirGuard Full Stack Application...")
    print("=" * 50)
    
    # Load data
    load_csv_data()
    
    print("=" * 50)
    print("Backend ready!")
    print("API Endpoints:")
    print("   GET /api/health - Health check")
    print("   GET /api/predict/<city> - Get prediction")
    print("   GET /api/data/<city> - Get historical data")
    print("   GET /api/cities - Get available cities")
    print("Frontend: React app served at /")
    print("=" * 50)
    
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
