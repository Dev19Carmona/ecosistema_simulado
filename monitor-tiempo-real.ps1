# Monitor de Datos en Tiempo Real
$SERVER_URL = "https://ecosistema-simulado.onrender.com"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Monitor de Datos en Tiempo Real" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

$lastCount = 0
$iteration = 0

while ($true) {
    $iteration++
    Clear-Host
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Monitor #$iteration - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    try {
        # Obtener datos
        $data = Invoke-RestMethod -Uri "$SERVER_URL/sensors/data" -Method Get
        $stats = Invoke-RestMethod -Uri "$SERVER_URL/sensors/stats" -Method Get
        
        # Mostrar estadísticas
        Write-Host "📊 Estadísticas Generales:" -ForegroundColor Yellow
        Write-Host "   Total de lecturas: $($stats.stats.total_readings)" -ForegroundColor White
        Write-Host "   Lecturas última hora: $($stats.stats.recent_readings_last_hour)" -ForegroundColor White
        
        if ($stats.stats.average_temperature_c) {
            Write-Host "   🌡️  Temperatura promedio: $($stats.stats.average_temperature_c)°C" -ForegroundColor Red
        }
        if ($stats.stats.average_humidity_pct) {
            Write-Host "   💧 Humedad promedio: $($stats.stats.average_humidity_pct)%" -ForegroundColor Cyan
        }
        Write-Host ""
        
        # Detectar si hay datos nuevos
        if ($stats.stats.total_readings -gt $lastCount) {
            $newDataCount = $stats.stats.total_readings - $lastCount
            Write-Host "🆕 DATOS NUEVOS: +$newDataCount lecturas desde última verificación" -ForegroundColor Green
            $lastCount = $stats.stats.total_readings
        } else {
            Write-Host "⚠️  SIN DATOS NUEVOS - El contador no ha cambiado" -ForegroundColor Yellow
        }
        Write-Host ""
        
        # Mostrar últimas 5 lecturas con TIMESTAMP
        Write-Host "📋 Últimas 5 Lecturas (con timestamps):" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        
        $lastFive = $data.data | Select-Object -First 5
        foreach ($item in $lastFive) {
            $timestamp = [DateTime]::Parse($item.timestamp)
            $timeAgo = (Get-Date) - $timestamp
            
            if ($timeAgo.TotalMinutes -lt 1) {
                $timeAgoStr = "Hace $([math]::Round($timeAgo.TotalSeconds))s"
                $color = "Green"
            } elseif ($timeAgo.TotalMinutes -lt 5) {
                $timeAgoStr = "Hace $([math]::Round($timeAgo.TotalMinutes))m"
                $color = "Yellow"
            } else {
                $timeAgoStr = "Hace $([math]::Round($timeAgo.TotalMinutes))m"
                $color = "Red"
            }
            
            Write-Host "  ⏰ $($timestamp.ToString('HH:mm:ss'))" -NoNewline -ForegroundColor White
            Write-Host " ($timeAgoStr)" -ForegroundColor $color
            Write-Host "     Sensor: $($item.sensor_id)" -ForegroundColor Gray
            
            if ($item.temperatura_c) {
                Write-Host "     🌡️  Temp: $($item.temperatura_c)°C" -NoNewline -ForegroundColor Red
            }
            if ($item.humedad_pct) {
                Write-Host " | 💧 Hum: $($item.humedad_pct)%" -ForegroundColor Cyan
            }
            Write-Host ""
        }
        
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host ""
        
        # Análisis
        $newestTimestamp = [DateTime]::Parse($lastFive[0].timestamp)
        $timeSinceNewest = (Get-Date) - $newestTimestamp
        
        if ($timeSinceNewest.TotalMinutes -lt 1) {
            Write-Host "✅ ESTADO: Datos recientes (últimos 60 segundos)" -ForegroundColor Green
            Write-Host "   El sensor está enviando datos correctamente" -ForegroundColor Green
        } elseif ($timeSinceNewest.TotalMinutes -lt 5) {
            Write-Host "⚠️  ESTADO: Datos algo antiguos (hace $([math]::Round($timeSinceNewest.TotalMinutes)) minutos)" -ForegroundColor Yellow
            Write-Host "   El sensor puede estar detenido o con problemas" -ForegroundColor Yellow
        } else {
            Write-Host "❌ ESTADO: Datos muy antiguos (hace $([math]::Round($timeSinceNewest.TotalMinutes)) minutos)" -ForegroundColor Red
            Write-Host "   El sensor NO está enviando datos" -ForegroundColor Red
            Write-Host ""
            Write-Host "   Acciones:" -ForegroundColor Yellow
            Write-Host "   1. Verifica que Wokwi esté ejecutándose" -ForegroundColor White
            Write-Host "   2. Verifica la URL en el código de Wokwi" -ForegroundColor White
            Write-Host "   3. O inicia el simulador interno desde el dashboard" -ForegroundColor White
        }
        
    } catch {
        Write-Host "❌ Error al conectar con el servidor" -ForegroundColor Red
        Write-Host "   Error: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Próxima actualización en 5 segundos..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
}

