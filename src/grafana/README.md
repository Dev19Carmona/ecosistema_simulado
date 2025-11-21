# 📊 Grafana Endpoints

Este módulo expone endpoints que Grafana puede consumir directamente sin necesidad de plugins de pago.

## 🔗 Endpoints Disponibles

### 1. Health Check
```
GET /grafana/
Response: "OK"
```

### 2. Search (Métricas disponibles)
```
POST /grafana/search
Response: [
  { "text": "temperatura_c", "value": "temperatura_c" },
  { "text": "humedad_pct", "value": "humedad_pct" },
  { "text": "distancia_cm", "value": "distancia_cm" }
]
```

### 3. Query (Datos de series temporales)
```
POST /grafana/query

Body:
{
  "range": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-01-02T00:00:00.000Z"
  },
  "targets": [
    { "target": "temperatura_c", "type": "timeserie" }
  ]
}

Response: [
  {
    "target": "temperatura_c",
    "datapoints": [
      [24.5, 1700000000000],  // [valor, timestamp_ms]
      [25.0, 1700000001000]
    ]
  }
]
```

### 4. Data (JSON simple)
```
GET /grafana/data

Response: {
  "success": true,
  "count": 100,
  "data": [...]
}
```

### 5. Stats (Estadísticas)
```
GET /grafana/stats

Response: {
  "total_readings": 119,
  "recent_readings_last_hour": 41,
  "average_temperature_c": "25.88",
  "average_humidity_pct": "61.04"
}
```

## 🎯 Configuración en Grafana

### Opción A: JSON API Data Source (Si está disponible)

1. En Grafana: **Configuration** → **Data sources** → **Add data source**
2. Busca: **"JSON API"** o **"SimpleJson"**
3. Configuración:
   ```
   Name: API Ecosistema
   URL: https://ecosistema-simulado.onrender.com/grafana
   ```
4. Click **"Save & test"**

### Opción B: TestData + HTTP Request (Alternativa)

Si no tienes JSON API disponible, puedes usar TestData combinado con transformaciones.

## 📈 Crear Dashboard

1. **Dashboards** → **New** → **New dashboard**
2. **Add visualization** → Selecciona **"API Ecosistema"**
3. En Query:
   - Metric: `temperatura_c` o `humedad_pct`
4. En Visualization: **Time series**
5. **Apply** → **Save**

## 🧪 Testing

### Verificar que funciona:

```bash
# Health check
curl https://ecosistema-simulado.onrender.com/grafana/

# Obtener datos
curl https://ecosistema-simulado.onrender.com/grafana/data

# Stats
curl https://ecosistema-simulado.onrender.com/grafana/stats
```

## 📝 Notas

- Compatible con formato SimpleJSON
- No requiere plugins de pago
- Datos actualizados en tiempo real
- Soporta múltiples métricas simultáneas

