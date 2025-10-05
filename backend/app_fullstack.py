#!/usr/bin/env python3
"""
Temporary redirect file for Render deployment
This file redirects to app_render.py to maintain compatibility
"""

import os
import sys

# Add the backend directory to the path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Import and run the actual app
from app_render import app

if __name__ == '__main__':
    print("Redirecting to app_render.py...")
    print("Starting AirGuard Full Stack Application...")
    print("=" * 50)
    
    # Get port from environment (Render sets this)
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting server on port {port}")
    
    # Run the app
    try:
        app.run(debug=False, host='0.0.0.0', port=port)
    except Exception as e:
        print(f"Error starting server: {e}")
        print("Trying alternative port...")
        app.run(debug=False, host='0.0.0.0', port=10000)
