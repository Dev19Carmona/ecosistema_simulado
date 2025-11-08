@echo off
echo.
echo ========================================
echo   Iniciando Ecosistema Simulado IoT
echo ========================================
echo.
echo Iniciando servidor NestJS (puerto 3000)...
echo.

start cmd /k "npm run start:dev"

timeout /t 3 /nobreak >nul

echo.
echo Iniciando servidor Dashboard (puerto 3001)...
echo.

start cmd /k "node server-dashboard.js"

timeout /t 2 /nobreak >nul

echo.
echo Iniciando simulador de sensores...
echo.

start cmd /k "node simulator.js"

echo.
echo ========================================
echo   Servidores iniciados correctamente
echo ========================================
echo.
echo   - API NestJS: http://localhost:3000
echo   - Dashboard:  http://localhost:3001
echo   - Simulador:  Enviando datos cada 5 segundos
echo ========================================
echo.
pause

