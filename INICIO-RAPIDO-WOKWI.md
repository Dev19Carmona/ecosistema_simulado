# 🚀 Inicio Rápido - Simulación ESP32 + DHT22

## 📝 Resumen

Esta guía te ayudará a poner en marcha la simulación completa de ESP32 con sensor DHT22 en **Wokwi** en menos de 10 minutos.

---

## ✅ Requisitos Previos

- [ ] Node.js instalado (v18 o superior)
- [ ] Cuenta en Wokwi (gratuita) - https://wokwi.com
- [ ] MongoDB Atlas configurado (o MongoDB local)
- [ ] Navegador web moderno

---

## 🎯 Pasos de Configuración

### Paso 1: Iniciar el Servidor NestJS (2 min)

```bash
# 1. Instalar dependencias (si aún no lo hiciste)
npm install

# 2. Verificar que .env tenga la URI de MongoDB
# El archivo .env debe contener:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecosistema_simulado

# 3. Iniciar servidor
npm run start:dev
```

**Deberías ver:**
```
🚀 Servidor ejecutándose en http://localhost:3000
```

---

### Paso 2: Configurar Wokwi (3 min)

#### 2.1. Crear Proyecto en Wokwi

1. Ve a https://wokwi.com
2. Inicia sesión (o crea cuenta gratis)
3. Click en **"New Project"**
4. Selecciona **"ESP32"**

#### 2.2. Cargar el Código Arduino

1. Abre el archivo `wokwi/esp32_dht22.ino` en tu editor
2. Copia **todo el contenido**
3. Pégalo en el editor de Wokwi (reemplaza el código existente)

#### 2.3. Configurar la URL del Servidor

En el código de Wokwi, encuentra la línea 31:

```cpp
const char* serverUrl = "http://192.168.1.100:3000/sensors/data";
```

**Reemplázala con tu IP local:**

**¿Cómo obtener mi IP local?**

**Windows (PowerShell):**
```powershell
ipconfig
# Busca "IPv4 Address" en tu adaptador WiFi/Ethernet
# Ejemplo: 192.168.1.45 //192.168.1.3
```

**Linux/Mac:**
```bash
ifconfig
# o
ip addr show
# Busca tu IP local (192.168.x.x)
```

**Ejemplo de configuración:**
```cpp
const char* serverUrl = "http://192.168.1.45:3000/sensors/data";
```

⚠️ **IMPORTANTE:** NO uses `localhost` o `127.0.0.1`, Wokwi necesita tu IP de red local.

#### 2.4. Cargar Archivos de Configuración

**Opción A: Copiar diagram.json (Recomendado)**

1. En Wokwi, click en el botón **"+"** (arriba a la derecha)
2. Selecciona **"Add a file"**
3. Nombra el archivo: `diagram.json`
4. Abre `wokwi/diagram.json` en tu editor
5. Copia y pega el contenido en Wokwi

**Opción B: Crear manualmente el circuito**

Si prefieres, puedes crear el circuito manualmente:
1. Arrastra un **DHT22** desde la barra lateral
2. Conecta:
   - DHT22 VCC → ESP32 3V3
   - DHT22 DATA → ESP32 GPIO15
   - DHT22 GND → ESP32 GND

**Agregar wokwi.toml:**

1. Click en **"+"** → **"Add a file"**
2. Nombra: `wokwi.toml`
3. Copia el contenido de `wokwi/wokwi.toml`

---

### Paso 3: Ejecutar la Simulación (1 min)

1. En Wokwi, click en el botón **▶️ "Start Simulation"** (arriba)
2. Abre el **Serial Monitor** (icono de terminal abajo)
3. Observa los mensajes

**Deberías ver:**
```
========================================
   ESP32 + DHT22 - Ecosistema IoT
========================================

🌡️  Inicializando sensor DHT22...
✅ Sensor DHT22 inicializado

📡 Conectando a WiFi...
✅ WiFi conectado exitosamente

🚀 Sistema listo - Iniciando monitoreo

─────────────────────────────────────────
📊 Lectura #1

🌡️  Leyendo sensor DHT22...
✅ Lectura exitosa:
   🌡️  Temperatura: 24.00 °C
   💧 Humedad: 60.00 %

📡 Enviando datos al servidor...
✅ Respuesta del servidor (HTTP 201):
   {"success":true,...}
```

---

### Paso 4: Visualizar los Datos (1 min)

#### Opción A: Dashboard HTML (Recomendado)

1. Abre el archivo `dashboard.html` en tu navegador
2. O ejecuta `abrir-dashboard.bat` (Windows)
3. Los datos aparecerán automáticamente

#### Opción B: API REST

Abre en tu navegador:
- http://localhost:3000/sensors/data
- http://localhost:3000/sensors/stats

---

## 🎉 ¡Listo!

Si todo funcionó correctamente, deberías ver:

✅ **En Wokwi:**
- Serial Monitor muestra lecturas cada 5 segundos
- Respuestas HTTP 201 (exitosas)

✅ **En Dashboard:**
- Tarjetas de estadísticas actualizadas
- Gráficos de temperatura y humedad
- Tabla con las últimas lecturas

✅ **En Terminal del Servidor:**
```
📡 Datos enviados (dht22): {"sensor_id":"dht22_01","temperatura_c":24.00,"humedad_pct":60.00}
```

---

## 🎮 Interactuar con la Simulación

### Cambiar Valores del Sensor

1. En Wokwi, **click en el sensor DHT22**
2. Ajusta los sliders:
   - **Temperature:** 15°C - 40°C
   - **Humidity:** 20% - 90%
3. Observa cómo cambian los datos en el dashboard

### Detener/Reiniciar

- **Detener:** Click en ⏸️
- **Reiniciar:** Click en ▶️

---

## 🐛 Solución de Problemas

### ❌ Error: "Error en la petición HTTP"

**Causa:** El servidor no está accesible

**Soluciones:**
1. Verifica que el servidor esté corriendo: `npm run start:dev`
2. Verifica tu IP local: `ipconfig` (Windows) o `ifconfig` (Linux/Mac)
3. Asegúrate de usar la IP correcta en el código
4. NO uses `localhost`, usa tu IP de red (192.168.x.x)

### ❌ Error: "No se pudo leer el sensor DHT22"

**Solución:**
1. Detén la simulación (⏸️)
2. Espera 2 segundos
3. Reinicia la simulación (▶️)

### ❌ Dashboard no muestra datos

**Solución:**
1. Abre la consola del navegador (F12)
2. Verifica errores
3. Asegúrate de que el servidor esté corriendo
4. Espera 5-10 segundos (auto-actualización)

### ❌ CORS Error

**Solución:**
El servidor NestJS ya tiene CORS habilitado. Si aún ves este error:
1. Abre `src/main.ts`
2. Verifica que tenga `app.enableCors()`

---

## 📊 Verificación Completa

### Test 1: Servidor
```bash
curl http://localhost:3000/sensors/stats
```
**Esperado:** JSON con estadísticas

### Test 2: Envío Manual
```bash
# Windows PowerShell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/sensors/data" -ContentType "application/json" -Body '{"sensor_id":"test","temperatura_c":25.5,"humedad_pct":60.0}'

# Linux/Mac
curl -X POST http://localhost:3000/sensors/data \
  -H "Content-Type: application/json" \
  -d '{"sensor_id":"test","temperatura_c":25.5,"humedad_pct":60.0}'
```
**Esperado:** `{"success":true,...}`

### Test 3: Script de Prueba
```bash
node wokwi/test-data.js
```
**Esperado:** 
```
✅ Datos enviados exitosamente
```

---

## 📚 Próximos Pasos

### Simular Múltiples Sensores

1. Duplica el proyecto en Wokwi
2. Cambia el ID del sensor:
```cpp
const char* sensorId = "dht22_cocina";
```
3. Ejecuta ambas simulaciones simultáneamente

### Desplegar en Producción

Para desplegar en Render.com con MongoDB Atlas:
1. Sigue la guía en `RENDER.md`
2. Cambia la URL en Wokwi a tu URL de Render:
```cpp
const char* serverUrl = "https://tu-app.onrender.com/sensors/data";
```

### Usar Grafana (Opcional)

Para visualización avanzada con Docker:
1. Sigue la guía en `GRAFANA.md`
2. Configura dashboards profesionales

---

## 🎯 Resumen de Comandos

```bash
# Iniciar servidor
npm run start:dev

# Ver estadísticas
curl http://localhost:3000/sensors/stats

# Test manual de datos
node wokwi/test-data.js

# Abrir dashboard
start dashboard.html         # Windows
open dashboard.html          # Mac
xdg-open dashboard.html      # Linux
```

---

## 📖 Documentación Adicional

- **Guía Completa de Wokwi:** [WOKWI-ESP32.md](WOKWI-ESP32.md)
- **Documentación General:** [README.md](README.md)
- **Despliegue en Render:** [RENDER.md](RENDER.md)
- **Configuración Grafana:** [GRAFANA.md](GRAFANA.md)

---

## 🆘 ¿Necesitas Ayuda?

1. **Revisa los logs:**
   - Serial Monitor en Wokwi
   - Terminal del servidor NestJS
   - Consola del navegador (F12)

2. **Verifica la configuración:**
   - IP local correcta
   - Servidor ejecutándose
   - MongoDB conectado

3. **Prueba paso a paso:**
   - Test del servidor: `curl http://localhost:3000/sensors/stats`
   - Test manual: `node wokwi/test-data.js`
   - Test de Wokwi: Observar Serial Monitor

---

**¡Disfruta de tu ecosistema IoT simulado!** 🚀🌡️💧

