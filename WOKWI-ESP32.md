# 📟 Simulación ESP32 con Sensor DHT22 en Wokwi

## 📋 Descripción

Este proyecto incluye una simulación completa de un **ESP32** con sensor **DHT22** utilizando la plataforma **Wokwi**. El microcontrolador lee datos de temperatura y humedad y los envía mediante HTTP POST al servidor NestJS.

---

## 🎯 ¿Qué es Wokwi?

**Wokwi** es un simulador online de hardware electrónico que permite:
- ✅ Simular microcontroladores (Arduino, ESP32, ESP8266, etc.)
- ✅ Conectar sensores virtuales (DHT22, BME280, LDR, etc.)
- ✅ Ejecutar código Arduino en tiempo real
- ✅ Simular comunicación WiFi y HTTP
- ✅ No requiere hardware físico

**URL de Wokwi:** https://wokwi.com

---

## 🔧 Hardware Simulado

### Componentes

| Componente | Modelo | Función |
|------------|--------|---------|
| Microcontrolador | ESP32 DevKit V1 | Procesamiento y comunicación WiFi |
| Sensor | DHT22 | Medición de temperatura y humedad |

### Conexiones

```
DHT22          →    ESP32
─────────────────────────
VCC (Pin 1)    →    3V3
GND (Pin 4)    →    GND
DATA (Pin 2)   →    GPIO 15
```

### Diagrama de Conexiones

```
        ESP32                      DHT22
    ┌──────────┐              ┌──────────┐
    │          │              │   VCC    │─── +3.3V
    │   3V3    │──────────────│          │
    │          │              │   DATA   │─── GPIO 15
    │   GPIO15 │──────────────│          │
    │          │              │   NC     │
    │   GND    │──────────────│   GND    │─── GND
    └──────────┘              └──────────┘
```

---

## 📦 Archivos del Proyecto

El proyecto incluye los siguientes archivos en la carpeta `wokwi/`:

```
wokwi/
├── esp32_dht22.ino      # Código Arduino para ESP32
├── diagram.json          # Configuración del circuito en Wokwi
├── wokwi.toml           # Configuración de bibliotecas
└── libraries.txt         # Lista de bibliotecas requeridas
```

### 1. `esp32_dht22.ino`
Código Arduino que:
- Lee datos del sensor DHT22 cada 5 segundos
- Se conecta a WiFi (simulado por Wokwi)
- Envía datos en formato JSON al servidor mediante HTTP POST
- Maneja errores y muestra información en el Serial Monitor

### 2. `diagram.json`
Configuración del circuito con:
- ESP32 DevKit V1
- Sensor DHT22
- Conexiones entre componentes
- Configuración inicial del sensor (24°C, 60%)

### 3. `wokwi.toml`
Configuración de las bibliotecas necesarias:
- DHT sensor library v1.4.4
- ArduinoJson v6.21.3

### 4. `libraries.txt`
Lista completa de bibliotecas para referencia

---

## 🚀 Cómo Usar en Wokwi

### Opción 1: Cargar Proyecto Completo (Recomendado)

1. **Ir a Wokwi:**
   - Abre https://wokwi.com
   - Inicia sesión o crea una cuenta (gratis)

2. **Crear Nuevo Proyecto:**
   - Click en "New Project"
   - Selecciona "ESP32"

3. **Cargar Archivos:**
   - Copia el contenido de `wokwi/esp32_dht22.ino` al editor
   - Click en "+" para agregar archivos
   - Agrega `diagram.json` (copia y pega el contenido)
   - Agrega `wokwi.toml` (copia y pega el contenido)

4. **Configurar Servidor:**
   - En el código Arduino, busca la línea:
   ```cpp
   const char* serverUrl = "http://192.168.1.100:3000/sensors/data";
   ```
   - Reemplaza con la URL de tu servidor:
     - **Local:** `http://TU_IP_LOCAL:3000/sensors/data`
     - **Render.com:** `https://ecosistema-simulado.onrender.com/sensors/data`

5. **Ejecutar Simulación:**
   - Click en el botón "Start Simulation" (▶️)
   - Observa el Serial Monitor para ver los mensajes
   - Los datos se enviarán automáticamente al servidor

### Opción 2: Usar Proyecto Compartido

Si tienes un link compartido de Wokwi:
1. Abre el link en tu navegador
2. Click en "Duplicate" para crear tu copia
3. Modifica la URL del servidor (paso 4 anterior)
4. Inicia la simulación

---

## ⚙️ Configuración del Código

### Variables Importantes

```cpp
// Pin del sensor DHT22
#define DHTPIN 15          // GPIO 15 del ESP32

// Tipo de sensor
#define DHTTYPE DHT22      // DHT22 (AM2302)

// WiFi (Wokwi proporciona WiFi virtual)
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// URL del servidor (MODIFICAR AQUÍ)
const char* serverUrl = "http://192.168.1.100:3000/sensors/data";

// ID del sensor
const char* sensorId = "dht22_01";

// Intervalo de envío (milisegundos)
const unsigned long interval = 5000;  // 5 segundos
```

### Personalización

**Cambiar intervalo de envío:**
```cpp
const unsigned long interval = 10000;  // Enviar cada 10 segundos
```

**Cambiar ID del sensor:**
```cpp
const char* sensorId = "dht22_oficina";  // ID personalizado
```

**Cambiar URL del servidor:**
```cpp
// Para servidor local (usa tu IP local)
const char* serverUrl = "http://192.168.1.50:3000/sensors/data";

// Para Render.com
const char* serverUrl = "https://tu-app.onrender.com/sensors/data";
```

---

## 📊 Formato de Datos Enviados

El ESP32 envía datos en formato JSON mediante HTTP POST:

```json
{
  "sensor_id": "dht22_01",
  "temperatura_c": 24.50,
  "humedad_pct": 60.20
}
```

### Campos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `sensor_id` | string | Identificador único del sensor | "dht22_01" |
| `temperatura_c` | number | Temperatura en grados Celsius | 24.50 |
| `humedad_pct` | number | Humedad relativa en porcentaje | 60.20 |

---

## 🔍 Monitorear la Simulación

### Serial Monitor

El código muestra información detallada en el Serial Monitor:

```
========================================
   ESP32 + DHT22 - Ecosistema IoT
========================================

🌡️  Inicializando sensor DHT22...
✅ Sensor DHT22 inicializado

📡 Conectando a WiFi...
   SSID: Wokwi-GUEST
✅ WiFi conectado exitosamente
   Dirección IP: 192.168.1.42

📋 Configuración:
   - Servidor: http://192.168.1.100:3000/sensors/data
   - Sensor ID: dht22_01
   - Intervalo: 5 segundos

========================================
🚀 Sistema listo - Iniciando monitoreo
========================================

─────────────────────────────────────────
📊 Lectura #1

🌡️  Leyendo sensor DHT22...
✅ Lectura exitosa:
   🌡️  Temperatura: 24.00 °C
   💧 Humedad: 60.00 %

📡 Enviando datos al servidor...
   URL: http://192.168.1.100:3000/sensors/data
   Payload: {"sensor_id":"dht22_01","temperatura_c":24.00,"humedad_pct":60.00}

✅ Respuesta del servidor (HTTP 201):
   {"success":true,"message":"Datos del sensor recibidos correctamente"}
```

### Indicadores de Estado

| Emoji | Significado |
|-------|-------------|
| 🌡️ | Lectura de sensor |
| 📡 | Comunicación WiFi/HTTP |
| ✅ | Operación exitosa |
| ❌ | Error |
| ⚠️ | Advertencia |
| 📊 | Datos estadísticos |

---

## 🛠️ Troubleshooting

### Error: "No se pudo leer el sensor DHT22"

**Causa:** Problema en la simulación del sensor

**Solución:**
1. Detener la simulación (⏸️)
2. Verificar conexiones en `diagram.json`
3. Reiniciar la simulación (▶️)

### Error: "No se pudo conectar a WiFi"

**Causa:** Configuración incorrecta de WiFi

**Solución:**
```cpp
// Asegúrate de usar estas credenciales en Wokwi:
const char* ssid = "Wokwi-GUEST";
const char* password = "";  // Sin contraseña
```

### Error: "Error en la petición HTTP"

**Causas posibles:**
1. ❌ **Servidor no está ejecutándose**
   - Verificar: `npm run start:dev`
   
2. ❌ **URL incorrecta**
   - Verificar la URL en el código
   - Usar IP local correcta
   
3. ❌ **Problemas de CORS** (si usas servidor local)
   - El servidor NestJS ya tiene CORS habilitado

**Solución:**
```cpp
// Para servidor local, usa tu IP local (NO localhost):
const char* serverUrl = "http://192.168.1.100:3000/sensors/data";

// Para Render.com, usa HTTPS:
const char* serverUrl = "https://ecosistema-simulado.onrender.com/sensors/data";
```

### Verificar IP Local

**Windows:**
```powershell
ipconfig
# Buscar "IPv4 Address"
```

**Linux/Mac:**
```bash
ifconfig
# o
ip addr show
```

---

## 🎮 Simular Diferentes Condiciones

### Cambiar Temperatura y Humedad del Sensor

En Wokwi, puedes modificar las lecturas del sensor en tiempo real:

1. **Editar `diagram.json`:**
```json
{
  "type": "wokwi-dht22",
  "attrs": {
    "temperature": "30",    // Cambiar temperatura (°C)
    "humidity": "75"        // Cambiar humedad (%)
  }
}
```

2. **Durante la simulación:**
   - Click en el sensor DHT22
   - Ajusta los sliders de temperatura y humedad
   - Los cambios se reflejan en tiempo real

### Simular Múltiples Sensores

Para simular varios sensores ESP32:

1. **Duplicar el proyecto en Wokwi** (crear copias)
2. **Cambiar el ID del sensor** en cada copia:
```cpp
// Sensor 1
const char* sensorId = "dht22_sala";

// Sensor 2
const char* sensorId = "dht22_cocina";

// Sensor 3
const char* sensorId = "dht22_habitacion";
```
3. Ejecutar cada simulación en una pestaña diferente

---

## 📚 Bibliotecas Utilizadas

### DHT Sensor Library
- **Versión:** 1.4.4
- **Autor:** Adafruit
- **Función:** Leer datos del sensor DHT22
- **Documentación:** https://github.com/adafruit/DHT-sensor-library

### ArduinoJson
- **Versión:** 6.21.3
- **Autor:** Benoit Blanchon
- **Función:** Crear y parsear JSON
- **Documentación:** https://arduinojson.org/

### WiFi (ESP32)
- **Incluida en:** ESP32 Arduino Core
- **Función:** Conectividad WiFi

### HTTPClient (ESP32)
- **Incluida en:** ESP32 Arduino Core
- **Función:** Peticiones HTTP

---

## 🔗 Integración con el Sistema

### Flujo de Datos

```
┌──────────────────┐
│  Wokwi Simulator │
│   ESP32 + DHT22  │
└────────┬─────────┘
         │ HTTP POST (JSON)
         │ {"sensor_id": "dht22_01",
         │  "temperatura_c": 24.5,
         │  "humedad_pct": 60.2}
         ▼
┌──────────────────┐
│   API NestJS     │
│  (Puerto 3000)   │
└────────┬─────────┘
         │ Mongoose ODM
         ▼
┌──────────────────┐
│  MongoDB Atlas   │
│    (Nube)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Dashboard HTML   │
│  Visualización   │
└──────────────────┘
```

### Verificar Datos en el Dashboard

1. **Abrir Dashboard:**
   - Local: Abrir `dashboard.html`
   - Render: https://tu-app.onrender.com

2. **Observar Datos:**
   - Tarjetas de estadísticas muestran promedios
   - Gráficos de líneas muestran tendencias
   - Tabla muestra últimas 20 lecturas

---

## 📈 Ejemplos de Uso

### Ejemplo 1: Monitoreo de Temperatura en Oficina

```cpp
const char* sensorId = "dht22_oficina";
const unsigned long interval = 30000;  // Enviar cada 30 segundos
```

### Ejemplo 2: Múltiples Sensores en Casa

```cpp
// Sensor Sala
const char* sensorId = "dht22_sala";

// Sensor Cocina
const char* sensorId = "dht22_cocina";

// Sensor Dormitorio
const char* sensorId = "dht22_dormitorio";
```

### Ejemplo 3: Alta Frecuencia de Muestreo

```cpp
const unsigned long interval = 2000;  // Enviar cada 2 segundos
```

---

## 🎓 Ventajas de Usar Wokwi

| Ventaja | Descripción |
|---------|-------------|
| 💰 **Gratuito** | No requiere comprar hardware |
| 🚀 **Rápido** | Configuración en minutos |
| 🌐 **Online** | Accesible desde cualquier lugar |
| 🔄 **Reproducible** | Mismo comportamiento siempre |
| 📚 **Educativo** | Ideal para aprender y enseñar |
| 🐛 **Debug Fácil** | Serial Monitor integrado |
| 🔗 **Compartible** | Compartir proyectos con un link |

---

## 📝 Notas Importantes

1. **WiFi Virtual:**
   - Wokwi simula WiFi pero NO tiene acceso real a internet
   - Solo puede conectarse a servidores accesibles desde tu máquina
   - Usa tu IP local (192.168.x.x) para desarrollo local

2. **Lecturas del Sensor:**
   - Los valores del DHT22 en Wokwi son simulados
   - Puedes ajustarlos manualmente durante la simulación
   - Útil para probar diferentes escenarios

3. **Rendimiento:**
   - La simulación puede ser más lenta que hardware real
   - El Serial Monitor puede tener delay
   - Normal en simulaciones complejas

4. **Limitaciones:**
   - No simula todos los aspectos del hardware real
   - Algunas bibliotecas pueden no estar disponibles
   - Mejor para prototipado y aprendizaje

---

## 🆘 Soporte

### Recursos Adicionales

- **Documentación Wokwi:** https://docs.wokwi.com
- **Ejemplos ESP32:** https://wokwi.com/projects?tag=esp32
- **Foro Wokwi:** https://wokwi.com/discord

### Contacto del Proyecto

Si encuentras problemas con la integración:
1. Verificar que el servidor esté corriendo
2. Revisar logs del Serial Monitor en Wokwi
3. Verificar logs del servidor NestJS
4. Comprobar la URL del servidor en el código

---

## ✅ Checklist de Configuración

Antes de ejecutar la simulación, verifica:

- [ ] Servidor NestJS está ejecutándose (`npm run start:dev`)
- [ ] MongoDB está conectado (Atlas o local)
- [ ] URL del servidor configurada correctamente en el código
- [ ] Código cargado en Wokwi
- [ ] Archivos `diagram.json` y `wokwi.toml` configurados
- [ ] Serial Monitor abierto en Wokwi
- [ ] Dashboard abierto en el navegador

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de monitoreo IoT simulado con:
- ✅ ESP32 virtual con sensor DHT22
- ✅ Comunicación HTTP hacia tu servidor
- ✅ Almacenamiento en MongoDB
- ✅ Visualización en tiempo real
- ✅ Sin necesidad de hardware físico

**¡Disfruta de tu ecosistema IoT simulado!** 🚀

