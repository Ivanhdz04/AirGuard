#!/usr/bin/env python3
"""
AirGuard Backend API
Serves ML predictions for air quality monitoring
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import joblib
import os
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load models
MODELS = {}
DATA_FILES = {}

def load_models():
    """Load ML models for both cities"""
    global MODELS
    
    try:
        # Load CDMX model
        cdmx_model_path = os.path.join('models', 'modelo_pm25_predictor_cdmx.pkl')
        if os.path.exists(cdmx_model_path):
            MODELS['cdmx'] = joblib.load(cdmx_model_path)
            print(f"CDMX model loaded successfully")
        else:
            print(f"CDMX model not found at {cdmx_model_path}")
        
        # Load LA model
        la_model_path = os.path.join('models', 'modelo_pm25_predictor_LA.pkl')
        if os.path.exists(la_model_path):
            MODELS['la'] = joblib.load(la_model_path)
            print(f"LA model loaded successfully")
        else:
            print(f"LA model not found at {la_model_path}")
            
    except Exception as e:
        print(f"Error loading models: {e}")

def load_latest_data():
    """Load latest data from CSV files"""
    global DATA_FILES
    
    try:
        # Load CDMX data
        cdmx_data_path = os.path.join('data', 'datos_realtime_Centro_CDMX.csv')
        if os.path.exists(cdmx_data_path):
            DATA_FILES['cdmx'] = pd.read_csv(cdmx_data_path)
            DATA_FILES['cdmx']['timestamp'] = pd.to_datetime(DATA_FILES['cdmx']['timestamp'])
            print(f"CDMX data loaded: {len(DATA_FILES['cdmx'])} records")
        
        # Load LA data
        la_data_path = os.path.join('data', 'datos_realtime_Centro_LA.csv')
        if os.path.exists(la_data_path):
            DATA_FILES['la'] = pd.read_csv(la_data_path)
            DATA_FILES['la']['timestamp'] = pd.to_datetime(DATA_FILES['la']['timestamp'])
            print(f"LA data loaded: {len(DATA_FILES['la'])} records")
            
    except Exception as e:
        print(f"Error loading data: {e}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_loaded': list(MODELS.keys()),
        'data_loaded': list(DATA_FILES.keys())
    })

@app.route('/api/predict/<city>', methods=['GET'])
def predict_air_quality(city):
    """Get air quality prediction for a specific city"""
    city = city.lower()
    
    if city not in MODELS:
        return jsonify({'error': f'Model not available for {city}'}), 404
    
    if city not in DATA_FILES:
        return jsonify({'error': f'Data not available for {city}'}), 404
    
    try:
        # Get latest data
        latest_data = DATA_FILES[city].tail(1)
        if latest_data.empty:
            return jsonify({'error': 'No data available'}), 404
        
        # Prepare features for prediction
        model = MODELS[city]
        feature_columns = model.feature_name_
        
        # Get the latest row with all required features
        prediction_row = latest_data[feature_columns]
        
        # Make prediction
        prediction = model.predict(prediction_row)
        predicted_pm25 = prediction[0]
        
        # Get current values
        current_row = latest_data.iloc[0]
        current_timestamp = current_row['timestamp']
        current_pm25 = current_row['pm25']
        
        # Calculate prediction timestamp (24 hours ahead)
        prediction_timestamp = current_timestamp + timedelta(hours=24)
        
        # Calculate AQI from PM2.5
        def pm25_to_aqi(pm25):
            """Convert PM2.5 to AQI"""
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
        
        current_aqi = pm25_to_aqi(current_pm25)
        predicted_aqi = pm25_to_aqi(predicted_pm25)
        
        # Get air quality level
        def get_aqi_level(aqi):
            if aqi <= 50:
                return "Good"
            elif aqi <= 100:
                return "Moderate"
            elif aqi <= 150:
                return "Unhealthy for Sensitive Groups"
            elif aqi <= 200:
                return "Unhealthy"
            else:
                return "Very Unhealthy"
        
        response = {
            'city': city.upper(),
            'current': {
                'timestamp': current_timestamp.isoformat(),
                'pm25': round(current_pm25, 2),
                'aqi': current_aqi,
                'level': get_aqi_level(current_aqi)
            },
            'prediction': {
                'timestamp': prediction_timestamp.isoformat(),
                'pm25': round(predicted_pm25, 2),
                'aqi': predicted_aqi,
                'level': get_aqi_level(predicted_aqi)
            },
            'change': {
                'pm25_change': round(predicted_pm25 - current_pm25, 2),
                'aqi_change': predicted_aqi - current_aqi,
                'trend': 'improving' if predicted_pm25 < current_pm25 else 'worsening'
            },
            'weather': {
                'temperature': round(current_row['temperature_2m'], 1),
                'humidity': round(current_row['relativehumidity_2m'], 1),
                'pressure': round(current_row['pressure_msl'], 1),
                'wind_speed': round(current_row['windspeed_10m'], 1),
                'wind_direction': round(current_row['winddirection_10m'], 1)
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/data/<city>', methods=['GET'])
def get_city_data(city):
    """Get historical data for a city"""
    city = city.lower()
    
    if city not in DATA_FILES:
        return jsonify({'error': f'Data not available for {city}'}), 404
    
    try:
        # Get last 24 hours of data
        latest_timestamp = DATA_FILES[city]['timestamp'].max()
        start_time = latest_timestamp - timedelta(hours=24)
        
        recent_data = DATA_FILES[city][DATA_FILES[city]['timestamp'] >= start_time]
        
        # Convert to JSON-serializable format
        data_list = []
        for _, row in recent_data.iterrows():
            data_list.append({
                'timestamp': row['timestamp'].isoformat(),
                'pm25': round(row['pm25'], 2),
                'temperature': round(row['temperature_2m'], 1),
                'humidity': round(row['relativehumidity_2m'], 1),
                'pressure': round(row['pressure_msl'], 1),
                'wind_speed': round(row['windspeed_10m'], 1),
                'wind_direction': round(row['winddirection_10m'], 1)
            })
        
        return jsonify({
            'city': city.upper(),
            'data': data_list,
            'total_records': len(data_list)
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to get data: {str(e)}'}), 500

@app.route('/api/cities', methods=['GET'])
def get_available_cities():
    """Get list of available cities"""
    return jsonify({
        'cities': list(MODELS.keys()),
        'available_data': list(DATA_FILES.keys())
    })

if __name__ == '__main__':
    print("Starting AirGuard Backend API...")
    print("=" * 50)
    
    # Load models and data
    load_models()
    load_latest_data()
    
    print("=" * 50)
    print("Backend ready!")
    print("API Endpoints:")
    print("   GET /api/health - Health check")
    print("   GET /api/predict/<city> - Get prediction")
    print("   GET /api/data/<city> - Get historical data")
    print("   GET /api/cities - Get available cities")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
