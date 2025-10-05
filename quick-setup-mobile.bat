@echo off
echo ========================================
echo CSR Volunteer Matching Mobile App Setup
echo ========================================
echo.

echo Step 1: Installing mobile app dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Node.js not installed. Please install from https://nodejs.org/
    echo After installing Node.js, restart PowerShell and run this script again.
    pause
    exit /b 1
)

echo.
echo Step 2: Setup complete!
echo.
echo Next steps:
echo 1. Make sure backend is running (go run cmd/main.go)
echo 2. Start Metro bundler: npm start
echo 3. Run Android: npm run android
echo.
echo See DEMO_GUIDE.md for complete instructions
echo.
pause



