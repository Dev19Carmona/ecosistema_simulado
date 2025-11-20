/**
 * ESP32 + DHT22 para Render.com
 * 
 * Este código está configurado para enviar datos a:
 * https://ecosistema-simulado.onrender.com
 * 
 * Hardware simulado en Wokwi:
 * - ESP32 DevKit V1
 * - Sensor DHT22 en GPIO 15
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ============================================
// CONFIGURACIÓN DEL SENSOR DHT22
// ============================================
#define DHTPIN 15          // Pin GPIO 15
#define DHTTYPE DHT22      
DHT dht(DHTPIN, DHTTYPE);

// ============================================
// CONFIGURACIÓN DE WiFi (Wokwi)
// ============================================
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// ============================================
// CONFIGURACIÓN DEL SERVIDOR RENDER
// ============================================
const char* serverUrl = "https://ecosistema-simulado.onrender.com/sensors/data";

// ============================================
// CONFIGURACIÓN DEL SENSOR
// ============================================
const char* sensorId = "wokwi_esp32_dht22";
const unsigned long interval = 5000;    // 5 segundos

// ============================================
// VARIABLES GLOBALES
// ============================================
unsigned long previousMillis = 0;
int lecturaNumero = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("   ESP32 + DHT22 → Render.com");
  Serial.println("========================================\n");
  
  // Inicializar DHT22
  Serial.println("🌡️  Inicializando DHT22...");
  dht.begin();
  delay(2000);
  Serial.println("✅ DHT22 listo\n");
  
  // Conectar WiFi
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
  
  // Leer DHT22
  float temperatura = dht.readTemperature();
  float humedad = dht.readHumidity();
  
  // Validar lecturas
  if (isnan(temperatura) || isnan(humedad)) {
    Serial.println("❌ Error leyendo DHT22");
    Serial.println();
    return;
  }
  
  // Mostrar lecturas
  Serial.print("🌡️  Temperatura: ");
  Serial.print(temperatura, 2);
  Serial.println(" °C");
  Serial.print("💧 Humedad: ");
  Serial.print(humedad, 2);
  Serial.println(" %");
  
  // Enviar si hay WiFi
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
  
  // Crear JSON manualmente (sin ArduinoJson)
  String json = "{";
  json += "\"sensor_id\":\"" + String(sensorId) + "\",";
  json += "\"temperatura_c\":" + String(temp, 2) + ",";
  json += "\"humedad_pct\":" + String(hum, 2);
  json += "}";
  
  Serial.print("   Payload: ");
  Serial.println(json);
  
  // Enviar POST
  int httpCode = http.POST(json);
  
  // Procesar respuesta
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

