#!/bin/bash

# Build script for Render.com deployment
echo "Building AirGuard Full Stack Application..."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Build React frontend
echo "Building React frontend..."
npm run build

# Install Python dependencies
echo "Installing Python dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "Build completed successfully!"
echo "Frontend built in: build/"
echo "Backend ready in: backend/"
