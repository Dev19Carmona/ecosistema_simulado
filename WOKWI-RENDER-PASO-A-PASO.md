# 🎮 Guía Paso a Paso: Wokwi → Render.com

## ⚡ Configuración en 5 Minutos

---

## 📋 Paso 1: Abrir Wokwi

1. Ve a: **https://wokwi.com**
2. **Inicia sesión** (o crea cuenta gratis)
3. Click en **"New Project"**
4. Selecciona **"ESP32"**

---

## 📝 Paso 2: Copiar el Código

### Opción A: Código Completo (Recomendado)

Abre el archivo: `wokwi/esp32_dht22_render.ino`

**Y copia TODO el contenido** al editor de Wokwi (reemplaza el código que está ahí)

### Opción B: Código Directo (copia esto)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

#define DHTPIN 15
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* serverUrl = "https://ecosistema-simulado.onrender.com/sensors/data";
const char* sensorId = "wokwi_esp32_dht22";
const unsigned long interval = 5000;

unsigned long previousMillis = 0;
int lecturaNumero = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("   ESP32 + DHT22 → Render.com");
  Serial.println("========================================\n");
  
  Serial.println("🌡️  Inicializando DHT22...");
  dht.begin();
  delay(2000);
  Serial.println("✅ DHT22 listo\n");
  
  Serial.println("📡 Conectando a WiFi...");
  Serial.print("   SSID: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(".");
    intentos++;
  }
  Serial.println();
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✅ WiFi conectado");
    Serial.print("   IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("❌ WiFi no conectado");
  }
  
  Serial.println("\n📋 Configuración:");
  Serial.print("   Servidor: ");
  Serial.println(serverUrl);
  Serial.print("   Sensor ID: ");
  Serial.println(sensorId);
  Serial.print("   Intervalo: ");
  Serial.print(interval / 1000);
  Serial.println(" segundos\n");
  
  Serial.println("========================================");
  Serial.println("🚀 Iniciando envío de datos");
  Serial.println("========================================\n");
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    lecturaNumero++;
    leerYEnviarDatos();
  }
}

void leerYEnviarDatos() {
  Serial.println("─────────────────────────────────────");
  Serial.print("📊 Lectura #");
  Serial.println(lecturaNumero);
  
  float temperatura = dht.readTemperature();
  float humedad = dht.readHumidity();
  
  if (isnan(temperatura) || isnan(humedad)) {
    Serial.println("❌ Error leyendo DHT22");
    Serial.println();
    return;
  }
  
  Serial.print("🌡️  Temperatura: ");
  Serial.print(temperatura, 2);
  Serial.println(" °C");
  Serial.print("💧 Humedad: ");
  Serial.print(humedad, 2);
  Serial.println(" %");
  
  if (WiFi.status() == WL_CONNECTED) {
    enviarDatos(temperatura, humedad);
  } else {
    Serial.println("⚠️  Sin WiFi");
  }
  
  Serial.println();
}

void enviarDatos(float temp, float hum) {
  HTTPClient http;
  
  Serial.println("📡 Enviando a Render...");
  
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  String json = "{";
  json += "\"sensor_id\":\"" + String(sensorId) + "\",";
  json += "\"temperatura_c\":" + String(temp, 2) + ",";
  json += "\"humedad_pct\":" + String(hum, 2);
  json += "}";
  
  Serial.print("   Payload: ");
  Serial.println(json);
  
  int httpCode = http.POST(json);
  
  if (httpCode > 0) {
    Serial.print("✅ HTTP ");
    Serial.println(httpCode);
    
    if (httpCode == 200 || httpCode == 201) {
      String response = http.getString();
      Serial.print("   Respuesta: ");
      Serial.println(response);
    }
  } else {
    Serial.print("❌ Error HTTP: ");
    Serial.println(http.errorToString(httpCode));
  }
  
  http.end();
}
```

---

## 🔌 Paso 3: Agregar el Sensor DHT22

### Opción A: Cargar diagram.json (Más Fácil)

1. En Wokwi, click en **"+"** (arriba derecha)
2. Click en **"diagram.json"**
3. Copia este contenido:

```json
{
  "version": 1,
  "author": "Ecosistema Simulado",
  "editor": "wokwi",
  "parts": [
    {
      "type": "wokwi-esp32-devkit-v1",
      "id": "esp32",
      "top": 0,
      "left": 0,
      "attrs": {}
    },
    {
      "type": "wokwi-dht22",
      "id": "dht22",
      "top": -9.6,
      "left": 172.8,
      "attrs": {
        "temperature": "24",
        "humidity": "60"
      }
    }
  ],
  "connections": [
    [
      "esp32:TX0",
      "$serialMonitor:RX",
      "",
      []
    ],
    [
      "esp32:RX0",
      "$serialMonitor:TX",
      "",
      []
    ],
    [
      "dht22:VCC",
      "esp32:3V3",
      "red",
      [
        "v0"
      ]
    ],
    [
      "dht22:GND",
      "esp32:GND.1",
      "black",
      [
        "v0"
      ]
    ],
    [
      "dht22:SDA",
      "esp32:D15",
      "green",
      [
        "v0"
      ]
    ]
  ],
  "dependencies": {}
}
```

### Opción B: Conectar Manualmente

1. Arrastra un **DHT22** desde la barra lateral
2. Conecta con cables:
   - **DHT22 VCC** → **ESP32 3V3** (cable rojo)
   - **DHT22 DATA** → **ESP32 GPIO15** (cable verde)
   - **DHT22 GND** → **ESP32 GND** (cable negro)

---

## ▶️ Paso 4: Ejecutar la Simulación

1. Click en el botón **▶️ "Start Simulation"** (arriba)
2. Espera 5-10 segundos a que compile
3. Abre el **Serial Monitor** (icono de terminal abajo)

---

## ✅ Paso 5: Verificar que Funciona

### En el Serial Monitor deberías ver:

```
========================================
   ESP32 + DHT22 → Render.com
========================================

🌡️  Inicializando DHT22...
✅ DHT22 listo

📡 Conectando a WiFi...
   SSID: Wokwi-GUEST
✅ WiFi conectado
   IP: 192.168.1.42

📋 Configuración:
   Servidor: https://ecosistema-simulado.onrender.com/sensors/data
   Sensor ID: wokwi_esp32_dht22
   Intervalo: 5 segundos

========================================
🚀 Iniciando envío de datos
========================================

─────────────────────────────────────
📊 Lectura #1
🌡️  Temperatura: 24.00 °C
💧 Humedad: 60.00 %
📡 Enviando a Render...
   Payload: {"sensor_id":"wokwi_esp32_dht22","temperatura_c":24.00,"humedad_pct":60.00}
✅ HTTP 201
   Respuesta: {"success":true,"message":"Datos del sensor recibidos correctamente",...}
```

### ✅ **Si ves "HTTP 201"** → ¡Funciona perfecto!

---

## 📊 Paso 6: Ver los Datos en el Dashboard

1. Abre en otra pestaña: **https://ecosistema-simulado.onrender.com**
2. Espera 5-10 segundos
3. Deberías ver:
   - 📈 **Total de lecturas:** Aumentando
   - 🌡️ **Temperatura promedio:** Actualizándose
   - 💧 **Humedad promedio:** Actualizándose
   - **Gráficos:** Con nuevos datos

---

## 🎮 Paso 7: Interactuar con el Sensor

En Wokwi:

1. **Click en el sensor DHT22** (el componente azul)
2. Verás dos sliders:
   - **Temperature:** 15°C - 40°C
   - **Humidity:** 20% - 90%
3. **Mueve los sliders** para cambiar valores
4. **Observa el Serial Monitor:** Nuevos valores
5. **Observa el Dashboard:** Gráficos cambian

---

## 🐛 Troubleshooting

### ❌ Error: "Error HTTP: -1"

**Causa:** Wokwi no puede alcanzar el servidor

**Solución:**
1. Verifica que la URL sea: `https://ecosistema-simulado.onrender.com/sensors/data`
2. Verifica que Render esté desplegado y activo
3. Prueba la URL en tu navegador primero

### ❌ Error: "Failed to compile"

**Causa:** Faltan bibliotecas

**Solución:**
1. Asegúrate de NO incluir `#include <ArduinoJson.h>`
2. Solo usa: `WiFi.h`, `HTTPClient.h`, `DHT.h`
3. Reinicia la simulación

### ❌ "No se pudo leer el sensor DHT22"

**Solución:**
1. Detén la simulación (⏸️)
2. Verifica las conexiones del DHT22
3. Reinicia (▶️)

---

## 🎯 Checklist Final

Antes de empezar, verifica:

- [ ] Tienes cuenta en Wokwi
- [ ] Copiaste el código completo
- [ ] La URL es: `https://ecosistema-simulado.onrender.com/sensors/data`
- [ ] El DHT22 está conectado al GPIO 15
- [ ] El Serial Monitor está abierto

---

## 📞 Verificación Rápida

**Abrir en navegador:**
```
https://ecosistema-simulado.onrender.com/sensors/data
```

**Buscar:**
- `"sensor_id": "wokwi_esp32_dht22"`
- `"temperatura_c":`
- `"humedad_pct":`

**Si los ves** → ✅ ¡Funciona!

---

## 🚀 ¡Listo!

Ahora tienes:
- ✅ ESP32 virtual enviando datos reales
- ✅ Datos llegando a Render.com
- ✅ Dashboard actualizándose en tiempo real
- ✅ Sin hardware físico necesario

**Dashboard:** https://ecosistema-simulado.onrender.com

**Wokwi:** https://wokwi.com

---

## 💡 Tips

1. **Mantén Wokwi abierto** para que siga enviando datos
2. **Ajusta los valores del DHT22** para ver cambios en tiempo real
3. **El Serial Monitor** te muestra todo lo que pasa
4. **Si cierras Wokwi** los datos dejan de llegar

---

**¡Disfruta tu simulación IoT!** 🎉

