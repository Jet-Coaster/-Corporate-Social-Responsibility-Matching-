@echo off
echo ========================================
echo CSR Volunteer Matching System Setup
echo ========================================
echo.

echo Step 1: Installing mobile app dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Setup complete!
echo.
echo Next steps:
echo 1. Install Go from https://golang.org/dl/
echo 2. Install PostgreSQL from https://www.postgresql.org/download/windows/
echo 3. Create database: CREATE DATABASE csr_volunteer;
echo 4. Start backend: go run cmd/main.go
echo 5. Start mobile app: npm start
echo.
echo See DEMO_GUIDE.md for complete instructions
echo.
pause



