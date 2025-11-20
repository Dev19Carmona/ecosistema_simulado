# 🔄 Diagrama de Flujo del Sistema

## 📊 Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    ECOSISTEMA IoT COMPLETO                      │
└─────────────────────────────────────────────────────────────────┘

1️⃣ SIMULACIÓN (Wokwi)              2️⃣ BACKEND (NestJS)
┌──────────────────────┐            ┌──────────────────────┐
│                      │            │                      │
│   🌐 Wokwi Browser   │            │   💻 Servidor Local  │
│   ┌──────────────┐   │   HTTP     │   localhost:3000     │
│   │    ESP32     │   │   POST     │                      │
│   │   ┌─────┐    │   │ ────────>  │   ┌─────────────┐   │
│   │   │DHT22│    │   │   JSON     │   │  API REST   │   │
│   │   └─────┘    │   │            │   └─────────────┘   │
│   └──────────────┘   │            │                      │
│   GPIO15  3V3  GND   │            └──────────────────────┘
└──────────────────────┘                       │
                                               │ Mongoose
                                               ▼
3️⃣ BASE DE DATOS                    4️⃣ VISUALIZACIÓN
┌──────────────────────┐            ┌──────────────────────┐
│                      │            │                      │
│  🗄️ MongoDB Atlas    │   Query    │  🎨 Dashboard HTML   │
│     (Nube)           │ <────────  │                      │
│                      │            │  ┌───────────────┐   │
│  ┌──────────────┐    │            │  │  Chart.js     │   │
│  │ sensordatas  │    │            │  │  Gráficos     │   │
│  │              │    │            │  │  Tiempo Real  │   │
│  │ - sensor_id  │    │            │  └───────────────┘   │
│  │ - temp °C    │    │            │                      │
│  │ - humedad %  │    │            │  Auto-refresh 5s     │
│  └──────────────┘    │            └──────────────────────┘
│                      │
└──────────────────────┘
```

---

## 🔄 Flujo de Datos Detallado

### Paso 1: Lectura del Sensor
```
┌────────────────────────────────────────┐
│         ESP32 en Wokwi                 │
├────────────────────────────────────────┤
│                                        │
│  1. loop() se ejecuta cada 5 segundos │
│     ↓                                  │
│  2. dht.readTemperature() → 24.5°C    │
│     ↓                                  │
│  3. dht.readHumidity() → 60.2%        │
│     ↓                                  │
│  4. Validar lecturas (no NaN)         │
│     ↓                                  │
│  5. Crear JSON:                       │
│     {                                  │
│       "sensor_id": "dht22_01",        │
│       "temperatura_c": 24.50,         │
│       "humedad_pct": 60.20            │
│     }                                  │
│                                        │
└────────────────────────────────────────┘
```

### Paso 2: Envío por WiFi
```
┌────────────────────────────────────────┐
│         Comunicación HTTP              │
├────────────────────────────────────────┤
│                                        │
│  1. WiFi.begin("Wokwi-GUEST", "")     │
│     ↓                                  │
│  2. Conectar a WiFi virtual           │
│     ↓                                  │
│  3. HTTPClient.begin(serverUrl)       │
│     ↓                                  │
│  4. POST /sensors/data                │
│     Headers:                           │
│     - Content-Type: application/json  │
│     Body: {sensor_id, temp, hum}      │
│     ↓                                  │
│  5. Esperar respuesta                 │
│                                        │
└────────────────────────────────────────┘
```

### Paso 3: Procesamiento en Backend
```
┌────────────────────────────────────────┐
│         Servidor NestJS                │
├────────────────────────────────────────┤
│                                        │
│  1. POST /sensors/data recibido       │
│     ↓                                  │
│  2. SensorsController.create()        │
│     ↓                                  │
│  3. Validación con CreateSensorDataDto│
│     - sensor_id: string ✓             │
│     - temperatura_c: -40 a 80°C ✓     │
│     - humedad_pct: 0 a 100% ✓         │
│     ↓                                  │
│  4. SensorsService.create()           │
│     ↓                                  │
│  5. Crear documento en MongoDB        │
│     ↓                                  │
│  6. Retornar respuesta:               │
│     { "success": true, ... }          │
│     Status: 201 Created               │
│                                        │
└────────────────────────────────────────┘
```

### Paso 4: Almacenamiento
```
┌────────────────────────────────────────┐
│         MongoDB Atlas                  │
├────────────────────────────────────────┤
│                                        │
│  Colección: sensordatas               │
│  ┌─────────────────────────────────┐  │
│  │ {                               │  │
│  │   _id: ObjectId("..."),        │  │
│  │   sensor_id: "dht22_01",       │  │
│  │   temperatura_c: 24.50,        │  │
│  │   humedad_pct: 60.20,          │  │
│  │   timestamp: ISODate("..."),   │  │
│  │   createdAt: ISODate("..."),   │  │
│  │   updatedAt: ISODate("...")    │  │
│  │ }                               │  │
│  └─────────────────────────────────┘  │
│                                        │
│  Índices automáticos:                 │
│  - _id                                │
│  - timestamp (para queries rápidas)   │
│                                        │
└────────────────────────────────────────┘
```

### Paso 5: Visualización
```
┌────────────────────────────────────────┐
│         Dashboard (HTML)               │
├────────────────────────────────────────┤
│                                        │
│  Cada 5 segundos:                     │
│                                        │
│  1. fetch('/sensors/stats')           │
│     ↓                                  │
│  2. Actualizar tarjetas:              │
│     - Total lecturas                  │
│     - Lecturas última hora            │
│     - Temperatura promedio            │
│     - Humedad promedio                │
│     ↓                                  │
│  3. fetch('/sensors/data/recent/60')  │
│     ↓                                  │
│  4. Actualizar gráficos:              │
│     📈 Gráfico de temperatura         │
│     📈 Gráfico de humedad             │
│     📊 Gráfico de barras              │
│     ↓                                  │
│  5. fetch('/sensors/data')            │
│     ↓                                  │
│  6. Actualizar tabla:                 │
│     Últimas 20 lecturas               │
│                                        │
└────────────────────────────────────────┘
```

---

## 🎯 Flujo de Ejecución Temporal

```
Tiempo (segundos)
───────────────────────────────────────────────────────────────>

t=0      t=5      t=10     t=15     t=20     t=25     t=30
│        │        │        │        │        │        │
│        │        │        │        │        │        │
ESP32:   Leer     Leer     Leer     Leer     Leer     Leer
         Enviar   Enviar   Enviar   Enviar   Enviar   Enviar
         │        │        │        │        │        │
         ▼        ▼        ▼        ▼        ▼        ▼
Backend: Recibir  Recibir  Recibir  Recibir  Recibir  Recibir
         Guardar  Guardar  Guardar  Guardar  Guardar  Guardar
         │        │        │        │        │        │
         ▼        ▼        ▼        ▼        ▼        ▼
MongoDB: INSERT   INSERT   INSERT   INSERT   INSERT   INSERT
         │        │        │        │        │        │
         └────────┴────────┴────────┴────────┴────────┘
                           │
                           ▼
Dashboard:        ┌────────────────┐
(cada 5s)         │  Auto-refresh  │
                  │  Mostrar datos │
                  └────────────────┘
```

---

## 🔀 Decisiones en el Código

### En ESP32 (Arduino)
```
             ┌─────────────┐
             │   setup()   │
             └──────┬──────┘
                    │
              Inicializar
              DHT22 + WiFi
                    │
                    ▼
             ┌─────────────┐
      ┌──────│   loop()    │──────┐
      │      └─────────────┘      │
      │                           │
      │      ┌──────────────┐     │
      │      │ ¿5s pasaron? │     │
      │      └──────┬───┬───┘     │
      │             │   │         │
      │           NO│   │YES      │
      └─────────────┘   │         │
                        ▼         │
                 ┌─────────────┐  │
                 │  Leer DHT22 │  │
                 └──────┬──────┘  │
                        │         │
                   ¿Válido?       │
                        │         │
                    YES │   NO    │
                        ▼   ▼     │
                   Enviar Log    │
                   Datos  Error  │
                        │    │    │
                        └────┴────┘
```

### En Backend (NestJS)
```
    ┌──────────────────┐
    │  POST recibido   │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │    Validar DTO   │
    └────┬───────┬─────┘
         │       │
       OK│       │ERROR
         ▼       ▼
    ┌────────┐ ┌──────────────┐
    │ Guardar│ │ Retornar 400 │
    │   DB   │ │   BadRequest │
    └────┬───┘ └──────────────┘
         │
         ▼
    ┌──────────────────┐
    │  Retornar 201    │
    │    Created       │
    └──────────────────┘
```

### En Dashboard (JavaScript)
```
         ┌──────────────┐
         │  Cargar página│
         └──────┬───────┘
                │
         Inicial │
                ▼
         ┌──────────────┐
    ┌────│ loadAllData()│────┐
    │    └──────────────┘    │
    │                        │
    ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌────────┐
│ Stats  │  │ Charts │  │ Table  │
└────────┘  └────────┘  └────────┘
    │            │            │
    └────────────┴────────────┘
                 │
          Cada 5 segundos
                 │
                 └──────> Repetir
```

---

## 🎮 Interacciones del Usuario

### En Wokwi
```
Usuario
   │
   ├─> Click en DHT22
   │   ├─> Ajustar temperatura (slider)
   │   └─> Ajustar humedad (slider)
   │       └─> ESP32 lee nuevos valores
   │
   ├─> Click en Play ▶️
   │   └─> Iniciar simulación
   │
   ├─> Click en Pause ⏸️
   │   └─> Detener simulación
   │
   └─> Abrir Serial Monitor
       └─> Ver logs en tiempo real
```

### En Dashboard
```
Usuario
   │
   ├─> Abrir dashboard.html
   │   └─> Cargar datos automáticamente
   │
   ├─> Observar gráficos
   │   ├─> Temperatura (rojo)
   │   ├─> Humedad (azul)
   │   └─> Barras (múltiple)
   │
   ├─> Click en "Iniciar Simulador"
   │   └─> POST /sensors/simulator/start
   │       └─> Simulador interno inicia
   │
   ├─> Click en "Detener Simulador"
   │   └─> POST /sensors/simulator/stop
   │       └─> Simulador interno detiene
   │
   └─> Esperar auto-refresh (5s)
       └─> Datos se actualizan solos
```

---

## 📦 Estructura de Paquetes

```
             ┌─────────────────────┐
             │   package.json      │
             │   (Dependencias)    │
             └──────────┬──────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  @nestjs/*   │ │  mongoose    │ │ Chart.js CDN │
│  (Backend)   │ │  (MongoDB)   │ │ (Frontend)   │
└──────────────┘ └──────────────┘ └──────────────┘

ESP32 (Wokwi):
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ DHT library  │ │ ArduinoJson  │ │ HTTPClient   │
│ (Sensor)     │ │ (JSON)       │ │ (HTTP)       │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🌐 Topología de Red

```
                    Internet
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Wokwi      │ │  Tu PC       │ │ MongoDB      │
│  Simulator   │ │  (Backend)   │ │  Atlas       │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       │  WiFi Virtual  │  Local/LAN     │  Cloud
       │  (simulado)    │  192.168.x.x   │  (SSL)
       │                │                │
       └────────────────┴────────────────┘
              Comunicación HTTP/S
```

---

## 🔐 Flujo de Seguridad

```
┌─────────────────────────────────────────────────┐
│              Validaciones                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ESP32:                                        │
│  ✓ Validar lecturas sensor (no NaN)           │
│  ✓ Formato JSON correcto                      │
│                                                 │
│  Backend:                                      │
│  ✓ class-validator (DTO)                      │
│  ✓ Rangos de temperatura (-40 a 80°C)         │
│  ✓ Rangos de humedad (0 a 100%)               │
│  ✓ CORS habilitado                            │
│                                                 │
│  MongoDB:                                      │
│  ✓ Schema validation                          │
│  ✓ Timestamps automáticos                     │
│  ✓ Conexión SSL (Atlas)                       │
│                                                 │
│  Dashboard:                                    │
│  ✓ Validar respuestas API                     │
│  ✓ try-catch en todas las peticiones         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📈 Escalabilidad

```
Actual (1 sensor):
┌────────┐     ┌────────┐     ┌────────┐
│ ESP32  │────>│ Server │────>│MongoDB │
└────────┘     └────────┘     └────────┘

Múltiples sensores:
┌────────┐
│ ESP32  │─┐
└────────┘ │
           ├──> ┌────────┐     ┌────────┐
┌────────┐ │    │ Server │────>│MongoDB │
│ ESP32  │─┤    └────────┘     └────────┘
└────────┘ │
           │
┌────────┐ │
│ ESP32  │─┘
└────────┘

Con Load Balancer (producción):
┌────────┐
│ ESP32  │─┐
└────────┘ │    ┌────────┐     ┌────────┐     ┌────────┐
           ├───>│  LB    │────>│Server 1│────>│MongoDB │
┌────────┐ │    └────────┘  ┌─>└────────┘  ┌─>│Replica │
│ ESP32  │─┤                │               │  │  Set   │
└────────┘ │                └─>┌────────┐  │  └────────┘
           │                   │Server 2│──┘
┌────────┐ │                   └────────┘
│ ESP32  │─┘
└────────┘
```

---

## 🎨 Representación Visual del Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Dashboard de Sensores IoT - ESP32 + DHT22               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  📈 Total   │  │  🕐 Última  │  │ 🌡️ Temp    │       │
│  │     150     │  │  Hora: 72   │  │  24.5°C     │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                             │
│  ┌──────────────────────────────────────────────┐         │
│  │  🌡️ Temperatura en Tiempo Real              │         │
│  │  ┌──────────────────────────────────────┐   │         │
│  │  │      📈 Gráfico de Líneas            │   │         │
│  │  │  30°C ┤                              │   │         │
│  │  │       │    ╱╲                        │   │         │
│  │  │  25°C ┤  ╱    ╲      ╱╲             │   │         │
│  │  │       │╱        ╲  ╱    ╲           │   │         │
│  │  │  20°C ┤            ╲      ╲         │   │         │
│  │  │       └────────────────────────────>│   │         │
│  │  │         10:00  10:05  10:10  10:15  │   │         │
│  │  └──────────────────────────────────────┘   │         │
│  └──────────────────────────────────────────────┘         │
│                                                             │
│  ┌──────────────────────────────────────────────┐         │
│  │  📋 Últimas Lecturas                         │         │
│  │  ┌──────────────────────────────────────┐   │         │
│  │  │ Timestamp    │ Sensor  │ Temp │ Hum │   │         │
│  │  ├──────────────┼─────────┼──────┼─────┤   │         │
│  │  │ 10:15:32     │dht22_01 │24.5°C│60.2%│   │         │
│  │  │ 10:15:27     │dht22_01 │24.3°C│60.5%│   │         │
│  │  │ 10:15:22     │dht22_01 │24.6°C│60.1%│   │         │
│  │  └──────────────────────────────────────┘   │         │
│  └──────────────────────────────────────────────┘         │
│                                                             │
│  ⏱️ Auto-actualización cada 5 segundos                     │
└─────────────────────────────────────────────────────────────┘
```

---

Este diagrama de flujo proporciona una vista completa de cómo todos los componentes del sistema interactúan entre sí. 🚀

