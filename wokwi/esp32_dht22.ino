/**
 * Simulador de ESP32 con Sensor DHT22
 * 
 * Este código lee temperatura y humedad de un sensor DHT22
 * y las envía mediante HTTP POST a un servidor NestJS
 * 
 * Hardware:
 * - ESP32
 * - Sensor DHT22 (Pin de datos conectado al GPIO 15)
 * 
 * Autor: Ecosistema Simulado
 * Fecha: Noviembre 2025
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ============================================
// CONFIGURACIÓN DEL SENSOR DHT22
// ============================================
#define DHTPIN 15          // Pin donde está conectado el DHT22
#define DHTTYPE DHT22      // Tipo de sensor DHT
DHT dht(DHTPIN, DHTTYPE);

// ============================================
// CONFIGURACIÓN DE WiFi
// ============================================
const char* ssid = "Wokwi-GUEST";       // SSID de WiFi (Wokwi proporciona WiFi virtual)
const char* password = "";               // Sin contraseña para Wokwi-GUEST

// ============================================
// CONFIGURACIÓN DEL SERVIDOR
// ============================================
// IMPORTANTE: Cambia esta URL por la de tu servidor
// Opciones:
// - Desarrollo local: "http://192.168.1.X:3000/sensors/data" (usa tu IP local)
// - Render.com: "https://ecosistema-simulado.onrender.com/sensors/data"
const char* serverUrl = "http://192.168.1.100:3000/sensors/data";

// ============================================
// CONFIGURACIÓN DEL SENSOR
// ============================================
const char* sensorId = "dht22_01";      // ID único del sensor
const unsigned long interval = 5000;    // Intervalo de envío (5 segundos)

// ============================================
// VARIABLES GLOBALES
// ============================================
unsigned long previousMillis = 0;
int lecturaNumero = 0;

void setup() {
  // Inicializar puerto serial para debug
  Serial.begin(115200);
  Serial.println("\n\n");
  Serial.println("========================================");
  Serial.println("   ESP32 + DHT22 - Ecosistema IoT");
  Serial.println("========================================");
  Serial.println();
  
  // Inicializar sensor DHT22
  Serial.println("🌡️  Inicializando sensor DHT22...");
  dht.begin();
  delay(2000);  // Esperar a que el sensor se estabilice
  Serial.println("✅ Sensor DHT22 inicializado");
  Serial.println();
  
  // Conectar a WiFi
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
    Serial.println("✅ WiFi conectado exitosamente");
    Serial.print("   Dirección IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("❌ Error: No se pudo conectar a WiFi");
    Serial.println("   Continuando de todas formas...");
  }
  
  Serial.println();
  Serial.println("📋 Configuración:");
  Serial.print("   - Servidor: ");
  Serial.println(serverUrl);
  Serial.print("   - Sensor ID: ");
  Serial.println(sensorId);
  Serial.print("   - Intervalo: ");
  Serial.print(interval / 1000);
  Serial.println(" segundos");
  Serial.println();
  Serial.println("========================================");
  Serial.println("🚀 Sistema listo - Iniciando monitoreo");
  Serial.println("========================================");
  Serial.println();
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Enviar datos cada 'interval' milisegundos
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    lecturaNumero++;
    
    // Leer datos del sensor
    leerYEnviarDatos();
  }
}

/**
 * Lee los datos del sensor DHT22 y los envía al servidor
 */
void leerYEnviarDatos() {
  Serial.println("─────────────────────────────────────────");
  Serial.print("📊 Lectura #");
  Serial.println(lecturaNumero);
  Serial.println();
  
  // Leer temperatura y humedad
  Serial.println("🌡️  Leyendo sensor DHT22...");
  float temperatura = dht.readTemperature();    // Temperatura en Celsius
  float humedad = dht.readHumidity();           // Humedad relativa en %
  
  // Verificar si las lecturas son válidas
  if (isnan(temperatura) || isnan(humedad)) {
    Serial.println("❌ Error: No se pudo leer el sensor DHT22");
    Serial.println("   Reintentando en el próximo ciclo...");
    Serial.println();
    return;
  }
  
  // Mostrar lecturas en el monitor serial
  Serial.println("✅ Lectura exitosa:");
  Serial.print("   🌡️  Temperatura: ");
  Serial.print(temperatura, 2);
  Serial.println(" °C");
  Serial.print("   💧 Humedad: ");
  Serial.print(humedad, 2);
  Serial.println(" %");
  Serial.println();
  
  // Enviar datos al servidor si hay conexión WiFi
  if (WiFi.status() == WL_CONNECTED) {
    enviarDatosServidor(temperatura, humedad);
  } else {
    Serial.println("⚠️  WiFi desconectado - Reintentando conexión...");
    WiFi.reconnect();
  }
  
  Serial.println();
}

/**
 * Envía los datos al servidor mediante HTTP POST
 */
void enviarDatosServidor(float temperatura, float humedad) {
  HTTPClient http;
  
  Serial.println("📡 Enviando datos al servidor...");
  Serial.print("   URL: ");
  Serial.println(serverUrl);
  
  // Iniciar conexión HTTP
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  // Crear JSON con los datos
  // Formato: {"sensor_id": "dht22_01", "temperatura_c": 25.5, "humedad_pct": 60.2}
  StaticJsonDocument<200> doc;
  doc["sensor_id"] = sensorId;
  doc["temperatura_c"] = round(temperatura * 100.0) / 100.0;  // Redondear a 2 decimales
  doc["humedad_pct"] = round(humedad * 100.0) / 100.0;        // Redondear a 2 decimales
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  Serial.print("   Payload: ");
  Serial.println(jsonPayload);
  Serial.println();
  
  // Enviar petición POST
  int httpResponseCode = http.POST(jsonPayload);
  
  // Procesar respuesta
  if (httpResponseCode > 0) {
    Serial.print("✅ Respuesta del servidor (HTTP ");
    Serial.print(httpResponseCode);
    Serial.println("):");
    
    String response = http.getString();
    Serial.print("   ");
    Serial.println(response);
  } else {
    Serial.print("❌ Error en la petición HTTP: ");
    Serial.println(http.errorToString(httpResponseCode).c_str());
    Serial.println("   Posibles causas:");
    Serial.println("   - El servidor no está ejecutándose");
    Serial.println("   - La URL del servidor es incorrecta");
    Serial.println("   - Problemas de red");
  }
  
  // Liberar recursos
  http.end();
}

