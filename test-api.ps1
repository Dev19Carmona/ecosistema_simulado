# Script para probar la API del ecosistema simulado (PowerShell)

Write-Host "🧪 Probando API del Ecosistema Simulado" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$SERVER = "http://localhost:3000"

# Test 1: Health check
Write-Host "Test 1: " -ForegroundColor Yellow -NoNewline
Write-Host "Verificando estado del servidor..."
try {
    $response = Invoke-RestMethod -Uri "$SERVER/sensors/stats" -Method Get
    Write-Host "✅ Servidor funcionando" -ForegroundColor Green
    Write-Host "Estadísticas:" ($response | ConvertTo-Json)
} catch {
    Write-Host "❌ Servidor no responde" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
Write-Host ""

# Test 2: Enviar datos
Write-Host "Test 2: " -ForegroundColor Yellow -NoNewline
Write-Host "Enviando datos de prueba..."
try {
    $body = @{
        sensor_id = "test_sensor"
        distancia_cm = 42.5
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$SERVER/sensors/data" -Method Post -Body $body -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "✅ Datos enviados correctamente" -ForegroundColor Green
        Write-Host "Respuesta:" ($response | ConvertTo-Json)
    } else {
        Write-Host "❌ Error al enviar datos" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error al enviar datos" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 3: Obtener datos
Write-Host "Test 3: " -ForegroundColor Yellow -NoNewline
Write-Host "Obteniendo datos..."
try {
    $response = Invoke-RestMethod -Uri "$SERVER/sensors/data" -Method Get
    Write-Host "✅ Datos obtenidos correctamente" -ForegroundColor Green
    Write-Host "Total de registros:" $response.count
} catch {
    Write-Host "❌ Error al obtener datos" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 4: Obtener datos recientes
Write-Host "Test 4: " -ForegroundColor Yellow -NoNewline
Write-Host "Obteniendo datos recientes (últimos 60 minutos)..."
try {
    $response = Invoke-RestMethod -Uri "$SERVER/sensors/data/recent/60" -Method Get
    Write-Host "✅ Datos recientes obtenidos" -ForegroundColor Green
    Write-Host "Registros en la última hora:" $response.count
} catch {
    Write-Host "❌ Error al obtener datos recientes" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 5: Estadísticas finales
Write-Host "Test 5: " -ForegroundColor Yellow -NoNewline
Write-Host "Estadísticas finales..."
try {
    $response = Invoke-RestMethod -Uri "$SERVER/sensors/stats" -Method Get
    Write-Host "Estadísticas:"
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Error al obtener estadísticas" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Tests completados" -ForegroundColor Green

