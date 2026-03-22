#!/usr/bin/env python3
"""
Simple HTTP Server for Mahran Shipping Demo
"""
import http.server
import socketserver
import webbrowser
import os
from datetime import datetime

PORT = 8080
DEMO_FOLDER = os.path.dirname(os.path.abspath(__file__))

class DemoHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DEMO_FOLDER, **kwargs)
    
    def log_message(self, format, *args):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {self.address_string()} - {format % args}")
    
    def do_GET(self):
        # Track demo access
        if self.path == '/':
            print(f"📱 Demo accessed by: {self.client_address[0]}")
        
        return super().do_GET()

def start_demo_server():
    print("=" * 60)
    print("🚀 MAHRAN SHIPPING SYSTEM - LIVE DEMO SERVER")
    print("=" * 60)
    print(f"📁 Serving from: {DEMO_FOLDER}")
    print(f"🌐 Local URL: http://localhost:{PORT}")
    print(f"📅 Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print("📋 Instructions:")
    print("1. Open browser to: http://localhost:8080")
    print("2. Share this link with client for remote access")
    print("3. Press Ctrl+C to stop server")
    print("=" * 60)
    
    # Auto-open browser
    webbrowser.open(f"http://localhost:{PORT}")
    
    with socketserver.TCPServer(("", PORT), DemoHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped by user")
            httpd.shutdown()

if __name__ == "__main__":
    start_demo_server()
