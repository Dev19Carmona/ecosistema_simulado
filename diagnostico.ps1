# Script de Diagnóstico - Verificar Flujo de Datos
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Diagnóstico del Sistema IoT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# URL del servidor (cambiar si es necesario)
$SERVER_URL = "https://ecosistema-simulado.onrender.com"

Write-Host "Servidor: $SERVER_URL" -ForegroundColor Yellow
Write-Host ""

# Test 1: Verificar que el servidor responde
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Test 1: Verificar servidor" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
try {
    $stats = Invoke-RestMethod -Uri "$SERVER_URL/sensors/stats" -Method Get
    Write-Host "✅ Servidor responde correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Estadísticas:" -ForegroundColor Yellow
    Write-Host "  - Total de lecturas: $($stats.stats.total_readings)" -ForegroundColor White
    Write-Host "  - Lecturas última hora: $($stats.stats.recent_readings_last_hour)" -ForegroundColor White
    
    if ($stats.stats.average_temperature_c) {
        Write-Host "  - Temperatura promedio: $($stats.stats.average_temperature_c)°C" -ForegroundColor White
    }
    if ($stats.stats.average_humidity_pct) {
        Write-Host "  - Humedad promedio: $($stats.stats.average_humidity_pct)%" -ForegroundColor White
    }
    if ($stats.stats.average_distance_cm) {
        Write-Host "  - Distancia promedio: $($stats.stats.average_distance_cm) cm" -ForegroundColor White
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error al conectar con el servidor" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Test 2: Enviar datos de prueba DHT22
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Test 2: Enviar datos de prueba (DHT22)" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$testData = @{
    sensor_id = "diagnostico_test"
    temperatura_c = 25.5
    humedad_pct = 65.0
} | ConvertTo-Json

Write-Host "Enviando: $testData" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$SERVER_URL/sensors/data" -Method Post -Body $testData -ContentType "application/json"
    Write-Host "✅ Datos enviados correctamente" -ForegroundColor Green
    Write-Host "   Respuesta: $($response.message)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "❌ Error al enviar datos" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Verificar que los datos se guardaron
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Test 3: Verificar datos guardados" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Start-Sleep -Seconds 2

try {
    $allData = Invoke-RestMethod -Uri "$SERVER_URL/sensors/data" -Method Get
    Write-Host "✅ Datos recuperados: $($allData.count) registros" -ForegroundColor Green
    Write-Host ""
    
    if ($allData.count -gt 0) {
        Write-Host "Últimos 3 registros:" -ForegroundColor Yellow
        $lastThree = $allData.data | Select-Object -First 3
        foreach ($item in $lastThree) {
            Write-Host "  ┌─────────────────────────────────────" -ForegroundColor Gray
            Write-Host "  │ Sensor: $($item.sensor_id)" -ForegroundColor White
            Write-Host "  │ Timestamp: $($item.timestamp)" -ForegroundColor White
            if ($item.temperatura_c) {
                Write-Host "  │ 🌡️  Temperatura: $($item.temperatura_c)°C" -ForegroundColor Red
            }
            if ($item.humedad_pct) {
                Write-Host "  │ 💧 Humedad: $($item.humedad_pct)%" -ForegroundColor Cyan
            }
            if ($item.distancia_cm) {
                Write-Host "  │ 📏 Distancia: $($item.distancia_cm) cm" -ForegroundColor Blue
            }
            Write-Host "  └─────────────────────────────────────" -ForegroundColor Gray
            Write-Host ""
        }
    } else {
        Write-Host "⚠️  No hay datos en la base de datos" -ForegroundColor Yellow
        Write-Host ""
    }
} catch {
    Write-Host "❌ Error al recuperar datos" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Verificar datos recientes
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Test 4: Verificar datos última hora" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

try {
    $recent = Invoke-RestMethod -Uri "$SERVER_URL/sensors/data/recent/60" -Method Get
    Write-Host "✅ Datos recientes: $($recent.count) en última hora" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error al obtener datos recientes" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
}

# Resumen
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumen del Diagnóstico" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($stats.stats.total_readings -eq 0) {
    Write-Host "⚠️  NO HAY DATOS en la base de datos" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Posibles causas:" -ForegroundColor Yellow
    Write-Host "  1. Wokwi no está enviando datos" -ForegroundColor White
    Write-Host "  2. La URL en Wokwi es incorrecta" -ForegroundColor White
    Write-Host "  3. El simulador interno no está activo" -ForegroundColor White
    Write-Host ""
    Write-Host "Soluciones:" -ForegroundColor Yellow
    Write-Host "  1. Verifica que Wokwi esté ejecutándose" -ForegroundColor White
    Write-Host "  2. Verifica la URL en el código de Wokwi (línea 31)" -ForegroundColor White
    Write-Host "  3. Inicia el simulador interno desde el dashboard" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ Sistema funcionando correctamente" -ForegroundColor Green
    Write-Host "   Hay datos en la base de datos" -ForegroundColor White
    Write-Host ""
    
    if ($stats.stats.average_temperature_c) {
        Write-Host "✅ Datos de DHT22 detectados (temperatura/humedad)" -ForegroundColor Green
    }
    if ($stats.stats.average_distance_cm) {
        Write-Host "✅ Datos de proximidad detectados" -ForegroundColor Green
    }
    Write-Host ""
}

Write-Host "Dashboard: $SERVER_URL/dashboard.html" -ForegroundColor Cyan
Write-Host ""

