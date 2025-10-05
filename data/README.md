# Carpeta de Datos CSV

Esta carpeta contiene los archivos CSV con datos de calidad del aire y clima.

## Estructura recomendada:

```
data/
├── csv/
│   ├── air_quality_cdmx.csv      # Datos de calidad del aire - Ciudad de México
│   ├── air_quality_los_angeles.csv # Datos de calidad del aire - Los Ángeles
│   ├── weather_cdmx.csv          # Datos meteorológicos - Ciudad de México
│   ├── weather_los_angeles.csv   # Datos meteorológicos - Los Ángeles
│   └── historical_data.csv       # Datos históricos combinados
```

## Formato recomendado para CSV de calidad del aire:

```csv
date,time,pm25,o3,so2,no2,co,aqi
2025-01-20,12:00,42,32,12,17,86,86
2025-01-20,13:00,45,35,14,19,88,88
```

## Formato recomendado para CSV de clima:

```csv
date,time,temperature,humidity,pressure,wind_speed,condition
2025-01-20,12:00,23,65,1013,15,cloudy
2025-01-20,13:00,25,60,1012,18,sunny
```

Los archivos CSV se cargarán automáticamente en la aplicación.
