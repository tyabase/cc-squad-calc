@echo off
title C.C. Squad Calculator

cd /d "%~dp0"

echo Starting C.C. Squad Calculator...
echo.

"C:\Program Files\nodejs\node.exe" -v
if errorlevel 1 (
    echo Error: Node.js not found!
    pause
    exit /b 1
)

echo.
echo Starting development server...
echo URL: http://localhost:3000
echo.

"C:\Program Files\nodejs\node.exe" node_modules\webpack\bin\webpack.js serve -c ./config/webpack.config.js
