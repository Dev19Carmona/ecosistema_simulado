# 🔗 Guía de Configuración de URLs para ESP32

## 📋 Configuración de URL del Servidor

En el archivo `esp32_dht22.ino`, línea 31, debes configurar la URL del servidor:

```cpp
const char* serverUrl = "http://TU_IP_AQUI:3000/sensors/data";
```

---

## 🏠 Opción 1: Servidor Local (Desarrollo)

### ¿Cuándo usar?
✅ Desarrollo local en tu computadora  
✅ Testing antes de desplegar  
✅ Sin acceso a internet  

### Configuración

**1. Obtener tu IP local:**

**Windows (PowerShell o CMD):**
```powershell
ipconfig
```
Busca: **"IPv4 Address"** en tu adaptador WiFi/Ethernet  
Ejemplo: `192.168.1.45`

**Linux:**
```bash
ip addr show
# o
ifconfig
```
Busca tu IP en la interfaz de red (wlan0, eth0, etc.)

**Mac:**
```bash
ifconfig
```
Busca: **"inet"** en tu interfaz de red

**2. Configurar en el código:**

```cpp
// REEMPLAZA 192.168.1.45 con TU IP local
const char* serverUrl = "http://192.168.1.45:3000/sensors/data";
```

### ⚠️ IMPORTANTE

- ❌ **NO uses** `localhost` o `127.0.0.1`
- ❌ **NO uses** `http://localhost:3000`
- ✅ **USA tu IP de red local** (192.168.x.x)

**¿Por qué?**  
Wokwi simula un dispositivo en red. `localhost` apunta al simulador, no a tu computadora.

---

## ☁️ Opción 2: Servidor en Render.com (Producción)

### ¿Cuándo usar?
✅ Servidor desplegado en la nube  
✅ Acceso desde cualquier lugar  
✅ Demo o producción  

### Configuración

```cpp
// Reemplaza "tu-app" con tu nombre de app en Render
const char* serverUrl = "https://tu-app.onrender.com/sensors/data";
```

### Ejemplos

```cpp
// Ejemplo 1
const char* serverUrl = "https://ecosistema-simulado.onrender.com/sensors/data";

// Ejemplo 2
const char* serverUrl = "https://mi-iot-proyecto.onrender.com/sensors/data";
```

### ⚠️ NOTA

- ✅ Usa **HTTPS** (no HTTP)
- ✅ No incluyas el puerto (Render usa 443 por defecto)
- ✅ Asegúrate de que tu app esté desplegada y activa

---

## 🌐 Opción 3: Servidor en Otra Red

### ¿Cuándo usar?
✅ Servidor en otra computadora en tu red  
✅ Servidor en red universitaria/empresarial  
✅ Servidor con IP pública  

### Configuración

```cpp
// IP de otra computadora en la red local
const char* serverUrl = "http://192.168.1.100:3000/sensors/data";

// IP pública (si tienes)
const char* serverUrl = "http://203.0.113.45:3000/sensors/data";
```

---

## 📝 Plantillas de Configuración

### Plantilla 1: Desarrollo Local

```cpp
// Configuración WiFi (dejar como está en Wokwi)
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// URL del servidor (CAMBIAR AQUÍ)
const char* serverUrl = "http://192.168.1.45:3000/sensors/data";

// ID del sensor (personalizar si quieres)
const char* sensorId = "dht22_01";
```

### Plantilla 2: Render.com

```cpp
// Configuración WiFi (dejar como está en Wokwi)
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// URL del servidor en Render (CAMBIAR AQUÍ)
const char* serverUrl = "https://tu-app.onrender.com/sensors/data";

// ID del sensor
const char* sensorId = "dht22_01";
```

### Plantilla 3: Múltiples Sensores

```cpp
// Sensor de la sala
const char* sensorId = "dht22_sala";

// Sensor de la cocina
const char* sensorId = "dht22_cocina";

// Sensor del dormitorio
const char* sensorId = "dht22_dormitorio";
```

---

## ✅ Verificación

### 1. Verificar que el servidor esté corriendo

**Local:**
```bash
curl http://192.168.1.45:3000/sensors/stats
```

**Render:**
```bash
curl https://tu-app.onrender.com/sensors/stats
```

**Deberías ver:**
```json
{
  "success": true,
  "stats": {
    "total_readings": 0,
    ...
  }
}
```

### 2. Probar desde navegador

Abre en tu navegador:
- Local: `http://192.168.1.45:3000/sensors/stats`
- Render: `https://tu-app.onrender.com/sensors/stats`

### 3. Observar Serial Monitor en Wokwi

Cuando ejecutes la simulación, deberías ver:

✅ **Conexión exitosa:**
```
✅ WiFi conectado exitosamente
📡 Enviando datos al servidor...
✅ Respuesta del servidor (HTTP 201):
   {"success":true,...}
```

❌ **Error de conexión:**
```
❌ Error en la petición HTTP: Connection failed
   Posibles causas:
   - El servidor no está ejecutándose
   - La URL del servidor es incorrecta
   - Problemas de red
```

---

## 🐛 Solución de Problemas

### Error: "Connection failed"

**Causa:** URL incorrecta o servidor no accesible

**Soluciones:**
1. Verifica tu IP local: `ipconfig` (Windows) o `ifconfig` (Linux/Mac)
2. Asegúrate de que el servidor esté corriendo: `npm run start:dev`
3. Verifica que uses la IP correcta (no `localhost`)
4. Prueba la URL en el navegador primero

### Error: "DNS lookup failed"

**Causa:** Nombre de dominio no resuelve

**Soluciones:**
1. Si usas Render, verifica que el dominio sea correcto
2. Asegúrate de usar HTTPS para Render (no HTTP)
3. Verifica que tu app en Render esté activa

### Error: "Timeout"

**Causa:** Servidor lento o no responde

**Soluciones:**
1. Espera 30 segundos y reintenta
2. Si usas Render, la primera petición puede ser lenta (cold start)
3. Verifica logs del servidor

---

## 💡 Tips

1. **Anota tu IP:** Guarda tu IP local en un archivo para no buscarla cada vez
2. **Firewall:** Asegúrate de que tu firewall permita conexiones en el puerto 3000
3. **Misma red:** Tu computadora y (virtualmente) el ESP32 deben estar en la misma red
4. **Prueba primero:** Verifica que el servidor funcione con `curl` antes de usar Wokwi

---

## 📚 Documentación Relacionada

- **Guía Completa:** [WOKWI-ESP32.md](../WOKWI-ESP32.md)
- **Inicio Rápido:** [INICIO-RAPIDO-WOKWI.md](../INICIO-RAPIDO-WOKWI.md)
- **Despliegue Render:** [RENDER.md](../RENDER.md)

---

¿Necesitas más ayuda? Revisa la documentación completa o los logs del Serial Monitor en Wokwi.

