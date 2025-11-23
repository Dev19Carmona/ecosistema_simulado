# 🚀 Configuración de Grafana con Infinity Plugin

Esta guía te explica cómo configurar Grafana para mostrar tus métricas reales usando el plugin **Infinity**.

---

## ✅ Cambios Realizados

1. ✅ **Dockerfile.grafana** modificado para instalar automáticamente el plugin Infinity
2. ✅ **Endpoint `/grafana/data`** optimizado para Infinity
3. ✅ Plugin se instala automáticamente al construir la imagen Docker

---

## 🔄 Paso 1: Rebuild en Render.com

Después de hacer push de los cambios:

1. Ve a https://dashboard.render.com
2. Abre tu servicio **"ecosistema-grafana"**
3. Render.com detectará los cambios y reconstruirá automáticamente
4. Espera 5-10 minutos hasta que veas **"Deploy live"**

**Verificación:**
- Ve a la pestaña **"Logs"**
- Deberías ver: `"Installing plugin yesoreyeram-infinity-datasource"`

---

## 🔌 Paso 2: Configurar Infinity Data Source

Una vez que Grafana esté reconstruido:

### 2.1 Acceder a Grafana

1. Ve a tu URL de Grafana (ej: `https://ecosistema-grafana.onrender.com`)
2. Login con:
   - Usuario: `admin`
   - Contraseña: La que configuraste en `GF_SECURITY_ADMIN_PASSWORD`

### 2.2 Crear Data Source

1. Ve a: **Connections** → **Data sources** → **Add data source**
2. Busca: **"Infinity"** (debería aparecer ahora)
3. Click en **"Infinity"**

### 2.3 Configuración Básica

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API Ecosistema

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JSON / CSV / GraphQL / XML / HTML

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
https://ecosistema-simulado.onrender.com/grafana/data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Method:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Auth:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
None
```

### 2.4 Guardar y Probar

1. Scroll hacia abajo
2. Click en **"Save & test"**
3. ✅ Debería mostrar: **"Data source is working"**

---

## 📊 Paso 3: Crear tu Primer Dashboard

### 3.1 Nuevo Dashboard

1. Ve a: **Dashboards** → **New** → **New dashboard**
2. Click en **"Add visualization"**

### 3.2 Seleccionar Data Source

- Selecciona: **"API Ecosistema"** (el que acabas de crear)

### 3.3 Configurar Query

En la pestaña **"Query"**:

1. **Parser**: Selecciona **"JSON"**
2. **Root path**: Deja vacío (los datos ya vienen como array)
3. **Format**: Selecciona **"Time series"**
4. **Fields**:
   - **Time**: `time` (campo de timestamp)
   - **Value**: `temperatura_c` (o la métrica que quieras)

**Configuración completa:**

```
Parser: JSON
Root path: (vacío)
Format: Time series
Time field: time
Value field: temperatura_c
```

### 3.4 Configurar Visualización

En el panel derecho:

1. **Visualization**: **Time series**
2. **Panel options**:
   - **Title**: `Temperatura (°C)`
3. **Field**:
   - **Unit**: `Celsius (°C)`
   - **Min**: `15`
   - **Max**: `40`

### 3.5 Aplicar y Guardar

1. Click en **"Apply"** (arriba derecha)
2. Click en **💾 "Save dashboard"**
3. **Dashboard name**: `Dashboard IoT - Sensores`
4. Click en **"Save"**

---

## 📈 Paso 4: Agregar Más Métricas

### Panel de Humedad

1. En tu dashboard, click en **"Add"** → **"Visualization"**
2. Selecciona **"API Ecosistema"**
3. **Query**:
   - **Parser**: `JSON`
   - **Format**: `Time series`
   - **Time field**: `time`
   - **Value field**: `humedad_pct`
4. **Visualization**: **Time series**
5. **Panel options**:
   - **Title**: `Humedad (%)`
   - **Unit**: `Percent (0-100)`
   - **Min**: `20`
   - **Max**: `90`
6. **Apply**

### Panel de Distancia (si aplica)

1. **Add** → **"Visualization"**
2. Selecciona **"API Ecosistema"**
3. **Query**:
   - **Value field**: `distancia_cm`
4. **Visualization**: **Time series**
5. **Panel options**:
   - **Title**: `Distancia (cm)`
   - **Unit**: `Length (cm)`
6. **Apply**

---

## 📋 Paso 5: Crear Tabla de Datos

1. **Add** → **"Visualization"**
2. Selecciona **"API Ecosistema"**
3. **Query**:
   - **Parser**: `JSON`
   - **Format**: `Table`
   - **Columns**: Selecciona los campos que quieras mostrar:
     - `timestamp`
     - `sensor_id`
     - `temperatura_c`
     - `humedad_pct`
     - `distancia_cm`
4. **Visualization**: **Table**
5. **Apply**

---

## 🔄 Paso 6: Configurar Auto-Refresh

1. En tu dashboard (arriba derecha)
2. Click en el icono de **reloj** ⏱️
3. Selecciona: **5s** o **10s**
4. El dashboard se actualizará automáticamente

---

## ✅ Verificación Final

### Checklist:

```
□ Render.com reconstruyó Grafana con Infinity
□ Plugin Infinity aparece en "Add data source"
□ Data source "API Ecosistema" creado y funcionando
□ Dashboard creado con paneles
□ Gráficos muestran datos reales (no datos de prueba)
□ Auto-refresh configurado
□ Dashboard guardado
```

---

## 🐛 Troubleshooting

### Error: "Infinity" no aparece en data sources

**Solución:**
1. Verifica que el rebuild haya terminado (espera 10 minutos)
2. Verifica los logs en Render.com:
   - Deberías ver: `"Installing plugin yesoreyeram-infinity-datasource"`
3. Si no aparece, verifica que `Dockerfile.grafana` tenga la línea de instalación

### Error: "Data source is not working"

**Solución:**
1. Verifica que tu API esté funcionando:
   ```
   https://ecosistema-simulado.onrender.com/grafana/data
   ```
   Debe devolver JSON con datos
2. Verifica que la URL en el data source sea correcta
3. Verifica que no haya problemas de CORS (Infinity maneja esto automáticamente)

### No veo datos en los gráficos

**Solución:**
1. Verifica que haya datos en la base de datos:
   ```
   https://ecosistema-simulado.onrender.com/grafana/data
   ```
2. Verifica que el campo **Time field** sea `time`
3. Verifica que el campo **Value field** coincida con la métrica (ej: `temperatura_c`)
4. Ajusta el rango de tiempo en el dashboard (arriba derecha)

### Los datos se ven como "NaN" o vacíos

**Solución:**
1. Verifica que los datos tengan valores (no null):
   - Abre `/grafana/data` en el navegador
   - Verifica que `temperatura_c`, `humedad_pct` tengan valores
2. En la query, verifica que el **Value field** sea correcto
3. Asegúrate de que el formato sea **Time series**

---

## 📚 Recursos

- **Plugin Infinity**: https://grafana.com/grafana/plugins/yesoreyeram-infinity-datasource/
- **Documentación Infinity**: https://yesoreyeram.github.io/grafana-infinity-datasource/
- **API Endpoints**: `https://ecosistema-simulado.onrender.com/grafana/data`

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Grafana funcionando con Infinity
- ✅ Conexión a tu API real
- ✅ Métricas en tiempo real
- ✅ Dashboards profesionales

**¡Disfruta tu dashboard de Grafana!** 📊

