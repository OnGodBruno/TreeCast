@echo off
echo Starting TreeCast Setup...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found!
echo Installing dependencies and starting TreeCast...
echo.

REM Install and run the game
npm run install-and-run

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start TreeCast.
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo TreeCast should now be running at http://localhost:3000
echo Press Ctrl+C in this window to stop the server.
echo.
pause
