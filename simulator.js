#!/usr/bin/env node

/**
 * Simulador de Sensor de Proximidad
 * 
 * Este script simula un sensor de proximidad que envía datos a intervalos regulares
 * al servidor NestJS mediante HTTP POST.
 */

const http = require('http');
const https = require('https');

// Configuración
const CONFIG = {
  SERVER_HOST: process.env.SERVER_HOST || 'localhost',
  SERVER_PORT: parseInt(process.env.SERVER_PORT) || 3000,
  SENSOR_ID: process.env.SENSOR_ID || 'proximidad_01',
  INTERVAL_MS: parseInt(process.env.INTERVAL_MS) || 5000,
  MIN_DISTANCE: parseFloat(process.env.MIN_DISTANCE) || 5.0,
  MAX_DISTANCE: parseFloat(process.env.MAX_DISTANCE) || 200.0,
};

// Determinar si usar HTTPS (puerto 443 o explícitamente configurado)
const useHttps = CONFIG.SERVER_PORT === 443 || process.env.USE_HTTPS === 'true';

/**
 * Genera una distancia aleatoria simulando un sensor real
 */
function generateRandomDistance() {
  const distance = Math.random() * (CONFIG.MAX_DISTANCE - CONFIG.MIN_DISTANCE) + CONFIG.MIN_DISTANCE;
  return parseFloat(distance.toFixed(2));
}

/**
 * Envía datos del sensor al servidor
 */
function sendSensorData() {
  const sensorData = {
    sensor_id: CONFIG.SENSOR_ID,
    distancia_cm: generateRandomDistance(),
  };

  const postData = JSON.stringify(sensorData);

  const options = {
    hostname: CONFIG.SERVER_HOST,
    port: useHttps ? (CONFIG.SERVER_PORT === 443 ? undefined : CONFIG.SERVER_PORT) : CONFIG.SERVER_PORT,
    path: '/sensors/data',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const timestamp = new Date().toISOString();
  const protocol = useHttps ? 'https' : 'http';
  console.log(`[${timestamp}] 📡 Enviando datos:`, sensorData);
  console.log(`[${timestamp}] 🔗 URL: ${protocol}://${CONFIG.SERVER_HOST}${CONFIG.SERVER_PORT !== 443 && CONFIG.SERVER_PORT !== 80 ? ':' + CONFIG.SERVER_PORT : ''}/sensors/data`);

  const httpModule = useHttps ? https : http;
  const req = httpModule.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log(`[${timestamp}] ✅ Datos enviados exitosamente`);
        try {
          const response = JSON.parse(responseData);
          console.log(`[${timestamp}] 📥 Respuesta del servidor:`, response);
        } catch (e) {
          console.log(`[${timestamp}] 📥 Respuesta:`, responseData);
        }
      } else {
        console.log(`[${timestamp}] ⚠️  Status Code: ${res.statusCode}`);
        console.log(`[${timestamp}] 📥 Respuesta:`, responseData);
      }
      console.log('---');
    });
  });

  req.on('error', (error) => {
    console.error(`[${timestamp}] ❌ Error al enviar datos:`, error.message);
    console.log('---');
  });

  req.write(postData);
  req.end();
}

/**
 * Inicia el simulador
 */
function startSimulator() {
  const protocol = useHttps ? 'https' : 'http';
  const portDisplay = (CONFIG.SERVER_PORT === 443 && useHttps) || (CONFIG.SERVER_PORT === 80 && !useHttps) 
    ? '' 
    : `:${CONFIG.SERVER_PORT}`;
  
  console.log('🚀 Iniciando Simulador de Sensor de Proximidad');
  console.log('📋 Configuración:');
  console.log(`   - Servidor: ${protocol}://${CONFIG.SERVER_HOST}${portDisplay}`);
  console.log(`   - Protocolo: ${protocol.toUpperCase()}`);
  console.log(`   - Sensor ID: ${CONFIG.SENSOR_ID}`);
  console.log(`   - Intervalo: ${CONFIG.INTERVAL_MS}ms`);
  console.log(`   - Rango de distancia: ${CONFIG.MIN_DISTANCE}cm - ${CONFIG.MAX_DISTANCE}cm`);
  console.log('');
  console.log('Presiona Ctrl+C para detener el simulador');
  console.log('='.repeat(70));
  console.log('');

  // Enviar datos inmediatamente
  sendSensorData();

  // Enviar datos a intervalos regulares
  setInterval(sendSensorData, CONFIG.INTERVAL_MS);
}

// Manejo de señales para cerrar limpiamente
process.on('SIGINT', () => {
  console.log('\n\n🛑 Deteniendo simulador...');
  console.log('👋 Hasta luego!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Deteniendo simulador...');
  process.exit(0);
});

// Iniciar el simulador
startSimulator();

