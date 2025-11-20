#!/usr/bin/env node

/**
 * Script de Prueba para Datos de Sensor DHT22
 * 
 * Este script envía datos de prueba simulando un sensor DHT22
 * Útil para probar el servidor sin necesidad de Wokwi
 */

const http = require('http');
const https = require('https');

// Configuración
const CONFIG = {
  SERVER_HOST: process.env.SERVER_HOST || 'localhost',
  SERVER_PORT: parseInt(process.env.SERVER_PORT) || 3000,
  SENSOR_ID: process.env.SENSOR_ID || 'dht22_test',
  USE_HTTPS: process.env.USE_HTTPS === 'true' || process.env.SERVER_PORT === 443,
};

/**
 * Genera datos aleatorios simulando un sensor DHT22
 */
function generateSensorData() {
  // Rango típico de DHT22: -40°C a 80°C, 0% a 100% humedad
  // Simulamos condiciones de ambiente interior: 18-32°C, 40-80%
  const temperatura = 18 + Math.random() * 14; // 18-32°C
  const humedad = 40 + Math.random() * 40;     // 40-80%

  return {
    sensor_id: CONFIG.SENSOR_ID,
    temperatura_c: parseFloat(temperatura.toFixed(2)),
    humedad_pct: parseFloat(humedad.toFixed(2)),
  };
}

/**
 * Envía datos al servidor
 */
function sendData() {
  const sensorData = generateSensorData();
  const postData = JSON.stringify(sensorData);

  const protocol = CONFIG.USE_HTTPS ? 'https' : 'http';
  const portDisplay = CONFIG.SERVER_PORT === 443 || CONFIG.SERVER_PORT === 80 
    ? '' 
    : `:${CONFIG.SERVER_PORT}`;

  console.log('📊 Enviando datos de prueba:');
  console.log(`   🌡️  Temperatura: ${sensorData.temperatura_c}°C`);
  console.log(`   💧 Humedad: ${sensorData.humedad_pct}%`);
  console.log(`   🔗 URL: ${protocol}://${CONFIG.SERVER_HOST}${portDisplay}/sensors/data`);

  const options = {
    hostname: CONFIG.SERVER_HOST,
    port: CONFIG.USE_HTTPS && CONFIG.SERVER_PORT === 443 ? undefined : CONFIG.SERVER_PORT,
    path: '/sensors/data',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const httpModule = CONFIG.USE_HTTPS ? https : http;
  const req = httpModule.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ Datos enviados exitosamente');
        try {
          const response = JSON.parse(responseData);
          console.log('📥 Respuesta:', response);
        } catch (e) {
          console.log('📥 Respuesta:', responseData);
        }
      } else {
        console.log(`⚠️  Status Code: ${res.statusCode}`);
        console.log('📥 Respuesta:', responseData);
      }
      console.log('');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    console.log('');
  });

  req.write(postData);
  req.end();
}

// Mostrar información
console.log('');
console.log('🧪 Script de Prueba - Datos DHT22');
console.log('================================');
console.log(`Servidor: ${CONFIG.SERVER_HOST}:${CONFIG.SERVER_PORT}`);
console.log(`Sensor ID: ${CONFIG.SENSOR_ID}`);
console.log(`Protocolo: ${CONFIG.USE_HTTPS ? 'HTTPS' : 'HTTP'}`);
console.log('');

// Enviar datos
sendData();

