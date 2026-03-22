@echo off
chcp 65001 > nul
echo.
echo ========================================
echo   MAHRAN SHIPPING SYSTEM - LIVE DEMO   
echo ========================================
echo.
echo Starting Live Demo Server...
echo.

REM Check if Python is installed
python --version > nul 2>&1
if errorlevel 1 (
    echo ? Python is not installed!
    echo Please install Python 3.6+ from: https://python.org
    echo.
    pause
    exit /b 1
)

REM Start the demo server
echo ?? Starting Demo Server...
echo ?? Local: http://localhost:8080
echo ?? Network: http://%COMPUTERNAME%:8080
echo ?? Demo valid until: 2026-02-15
echo.
echo ?? Instructions:
echo 1. Open above URL in any browser
echo 2. Share network URL with client
echo 3. Press Ctrl+C in this window to stop
echo.
echo ========================================
echo.

cd /d "%~dp0"
python demo-server.py
