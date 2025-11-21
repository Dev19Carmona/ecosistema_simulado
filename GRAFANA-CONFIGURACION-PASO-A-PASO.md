# 🎯 Configuración de Grafana - Paso a Paso

## ✅ Cambios Realizados

Se ha creado un endpoint especial en tu API que Grafana puede consumir **SIN plugins de pago**.

### Archivos creados/modificados:
- ✅ `src/grafana/grafana.controller.ts` - Controlador con endpoints para Grafana
- ✅ `src/sensors/sensors.module.ts` - Registrado el nuevo controlador
- ✅ `src/grafana/README.md` - Documentación técnica

---

## 🚀 Paso 1: Deploy a Render.com

### Hacer push a GitHub:

```bash
git push origin main
```

Render.com detectará automáticamente el cambio y redesplegará (5-10 minutos).

### Verificar el deploy:

1. Ve a https://dashboard.render.com
2. Abre tu servicio **"ecosistema-simulado"**
3. Ve a la pestaña **"Events"** o **"Logs"**
4. Espera a ver: **"Build successful"** y **"Deploy live"**

---

## 🧪 Paso 2: Verificar que el Endpoint Funciona

### Prueba 1: Health Check

Abre en el navegador:
```
https://ecosistema-simulado.onrender.com/grafana/
```

**Debe mostrar:** `"OK"`

### Prueba 2: Obtener Datos

```
https://ecosistema-simulado.onrender.com/grafana/data
```

**Debe mostrar:** JSON con tus datos de sensores

### Prueba 3: Estadísticas

```
https://ecosistema-simulado.onrender.com/grafana/stats
```

**Debe mostrar:** Estadísticas como temperatura promedio, etc.

---

## 🔌 Paso 3: Configurar Data Source en Grafana

### 3.1 Abrir Grafana

Ve a: https://ecosistema-grafana.onrender.com

Login con `admin` + tu contraseña

### 3.2 Buscar Plugin JSON API

1. Ve a: **Administration** → **Plugins and data** → **Plugins**
2. En el buscador, escribe: **"json"**
3. Busca: **"JSON API"** o **"Grafana JSON Datasource"**

**Si aparece:**
- Click en **"Install"**
- Espera a que se instale

**Si NO aparece o da error al instalar:**
- Usa la **Opción B** (más abajo)

---

### 3.3 Opción A: Configurar JSON API Data Source

1. Ve a: **Connections** → **Data sources** → **Add data source**
2. Busca: **"JSON API"** (debería aparecer si se instaló)
3. Click en **"JSON API"**

**Configuración:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API Ecosistema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
https://ecosistema-simulado.onrender.com/grafana

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Custom HTTP Headers: (dejar vacío)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Auth: None
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. Scroll hacia abajo
5. Click en **"Save & test"**

✅ **Debería mostrar:** "Data source is working"

---

### 3.4 Opción B: Usar HTTP Data Source (Si JSON API no funciona)

Si no puedes instalar JSON API, usa el data source HTTP nativo:

1. **Connections** → **Data sources** → **Add data source**
2. Busca: **"Prometheus"** o **"TestData"**
3. Usa TestData temporalmente para probar

---

## 📊 Paso 4: Crear tu Primer Dashboard

### 4.1 Nuevo Dashboard

1. Click en **☰** (menú lateral)
2. **Dashboards** → **New** → **New dashboard**
3. Click en **"Add visualization"**

### 4.2 Seleccionar Data Source

- Selecciona: **"API Ecosistema"** (el que acabas de crear)

### 4.3 Configurar Query

En el editor de queries (depende del tipo de data source):

**Si usas JSON API:**

```javascript
// Metric
temperatura_c
```

O en formato avanzado:

```json
{
  "target": "temperatura_c",
  "type": "timeserie"
}
```

### 4.4 Configurar Visualización

En el panel derecho:

```
Visualization: Time series

Panel options:
  Title: Temperatura (°C)
  
Field:
  Unit: Celsius (°C)
  Min: 15
  Max: 40
```

### 4.5 Aplicar y Guardar

1. Click en **"Apply"** (arriba derecha)
2. Click en el icono **💾 "Save dashboard"**
3. **Dashboard name:** `Dashboard IoT - ESP32 + DHT22`
4. Click en **"Save"**

---

## 🎨 Paso 5: Crear Panel de Humedad

1. En tu dashboard, click en **"Add"** → **"Visualization"**
2. Selecciona **"API Ecosistema"**
3. Query:
   ```
   Metric: humedad_pct
   ```
4. Visualization: **Time series**
5. Panel options:
   ```
   Title: Humedad (%)
   Unit: Percent (0-100)
   Min: 20
   Max: 90
   ```
6. **Apply**

---

## 📋 Paso 6: Crear Tabla de Últimas Lecturas

1. **Add** → **"Visualization"**
2. Selecciona **"API Ecosistema"**
3. Query:
   ```
   URL: /grafana/data
   ```
4. Visualization: **Table**
5. Configurar columnas:
   - timestamp
   - sensor_id
   - temperatura_c
   - humedad_pct
6. **Apply**

---

## 📈 Paso 7: Crear Panel de Estadísticas

1. **Add** → **"Visualization"**
2. Selecciona **"API Ecosistema"**
3. Query:
   ```
   URL: /grafana/stats
   ```
4. Visualization: **Stat**
5. Mostrar:
   - Total de lecturas
   - Temperatura promedio
   - Humedad promedio
6. **Apply**

---

## 🎯 Dashboard Final

Tu dashboard debería tener:

```
┌─────────────────────────────────────────────────────┐
│  Dashboard IoT - ESP32 + DHT22                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📊 Total: 119    🕐 Última hora: 41              │
│  🌡️ Temp: 25.88°C   💧 Hum: 61.04%              │
│                                                     │
├──────────────────────┬──────────────────────────────┤
│  📈 Temperatura     │  💧 Humedad                 │
│  [Gráfico línea]    │  [Gráfico línea]            │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│  📋 Últimas Lecturas                               │
│  [Tabla con datos]                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Paso 8: Configurar Auto-Refresh

1. En tu dashboard (arriba derecha)
2. Click en el icono de **reloj** ⏱️
3. Selecciona: **5s** o **10s**
4. El dashboard se actualizará automáticamente

---

## ✅ Verificación Final

### Checklist:

```
□ Push a GitHub/Render completado
□ Render redesplegado (Build successful)
□ /grafana/ devuelve "OK"
□ /grafana/data devuelve JSON con datos
□ Data source creado en Grafana
□ Data source "Save & test" exitoso
□ Dashboard creado con paneles
□ Gráficos muestran datos
□ Auto-refresh configurado
□ Dashboard guardado
```

---

## 🐛 Troubleshooting

### Error: "Data source is not working"

**Solución:**
1. Verifica que Render haya terminado el deploy
2. Verifica que `/grafana/` devuelva "OK" en el navegador
3. Espera 2-3 minutos después del deploy
4. Intenta "Save & test" nuevamente

### Error: No se pueden instalar plugins

**Solución:**
- Usa la API directamente sin plugins
- Los endpoints `/grafana/data` y `/grafana/stats` funcionan sin plugins
- Usa visualizaciones básicas de Grafana

### No veo datos en los gráficos

**Solución:**
1. Verifica que Wokwi esté enviando datos
2. Abre `/grafana/data` en el navegador
3. Verifica que haya datos recientes (últimos minutos)
4. Ajusta el rango de tiempo en Grafana (arriba derecha)

---

## 📚 Recursos Adicionales

- **Documentación técnica:** `src/grafana/README.md`
- **API de sensores:** `https://ecosistema-simulado.onrender.com/sensors/data`
- **Dashboard HTML:** `https://ecosistema-simulado.onrender.com`

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Grafana conectado a tu API
- ✅ Sin plugins de pago
- ✅ Dashboards profesionales
- ✅ Datos en tiempo real
- ✅ 100% Gratis

**¡Disfruta tu dashboard de Grafana!** 📊

