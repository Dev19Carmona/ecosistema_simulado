@echo off
echo.
echo ========================================
echo   Abriendo Dashboard de Sensores IoT
echo ========================================
echo.
echo Asegurate de que ambos servidores esten corriendo:
echo   1. npm run start:dev  (puerto 3000)
echo   2. node server-dashboard.js  (puerto 3001)
echo.
echo Abriendo dashboard en el navegador...
echo.

start http://localhost:3001

echo.
echo Dashboard abierto en http://localhost:3001
echo.
pause

