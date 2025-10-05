#!/bin/bash

# Build script for Render.com deployment
echo "Building AirGuard Full Stack Application..."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Build React frontend
echo "Building React frontend..."
npm run build

# Install Python dependencies (minimal)
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install Flask==2.3.3 Flask-CORS==4.0.0

echo "Build completed successfully!"
echo "Frontend built in: build/"
echo "Backend ready in: backend/"
