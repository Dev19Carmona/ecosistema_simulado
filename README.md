# 🌐 Ecosistema de Monitoreo Simulado - Sensores IoT

Sistema completo de monitoreo IoT con simulación de **ESP32 + DHT22** en **Wokwi**, almacenamiento en **MongoDB** (Atlas en nube o local con Docker) y visualización mediante dashboard web o Grafana.

## 🎮 **NUEVO: Simulación ESP32 + DHT22 en Wokwi**

Este proyecto ahora incluye una **simulación completa de ESP32 con sensor DHT22** usando la plataforma **Wokwi**:

- ✅ **ESP32 virtual** con sensor DHT22
- ✅ **Lectura de temperatura y humedad** en tiempo real
- ✅ **Envío de datos por WiFi** mediante HTTP POST
- ✅ **Sin hardware físico necesario**
- ✅ **Dashboard actualizado** para mostrar temperatura y humedad

### 🚀 Inicio Rápido con Wokwi

1. **Iniciar servidor:** `npm run start:dev`
2. **Abrir Wokwi:** https://wokwi.com
3. **Cargar código:** Archivo `wokwi/esp32_dht22.ino`
4. **Configurar IP:** Cambiar URL del servidor en el código
5. **Simular:** Click en ▶️ y observar datos

📖 **Guía completa:** [INICIO-RAPIDO-WOKWI.md](INICIO-RAPIDO-WOKWI.md)

📚 **Documentación detallada:** [WOKWI-ESP32.md](WOKWI-ESP32.md)

---

## 📋 Descripción

Proyecto académico que simula un ecosistema de monitoreo IoT donde:
- Un **sensor de proximidad simulado** envía datos en formato JSON
- Un **servidor NestJS** recibe y almacena los datos
- **MongoDB** almacena persistentemente (Atlas en nube o local con Docker)
- Un **dashboard web** o **Grafana** visualiza los datos en tiempo real

**Dos opciones de despliegue disponibles:**
- **Opción 1 (Manual)**: MongoDB Atlas + Dashboard HTML
- **Opción 2 (Docker)**: MongoDB Local + Grafana + Dashboard HTML

---

## 🏗️ Arquitectura del Sistema

### Opción 1: Con MongoDB Atlas (Manual)

```
┌─────────────────┐
│  Simulador JS   │  ← Script que simula sensor IoT
│ (simulator.js)  │
└────────┬────────┘
         │ HTTP POST (JSON)
         │ {"sensor_id": "...", "distancia_cm": ...}
         ▼
┌─────────────────┐
│   API NestJS    │  ← Servidor backend con TypeScript
│ (Puerto 3000)   │
└────────┬────────┘
         │ Mongoose ODM
         ▼
┌─────────────────┐
│ MongoDB Atlas   │  ← Base de datos en la nube ☁️
│   (Cluster)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dashboard HTML  │  ← Visualización web con gráficos
│ (dashboard.html)│
└─────────────────┘
```

### Opción 2: Con Docker (MongoDB Local + Grafana)

```
┌─────────────────┐
│  Simulador JS   │  ← Script que simula sensor IoT
│ (simulator.js)  │
└────────┬────────┘
         │ HTTP POST (JSON)
         │ {"sensor_id": "...", "distancia_cm": ...}
         ▼
┌─────────────────┐
│   API NestJS    │  ← Servidor backend (Docker)
│ (Puerto 3000)   │
└────────┬────────┘
         │ Mongoose ODM
         ▼
┌─────────────────┐
│   MongoDB       │  ← Base de datos local (Docker)
│ (Puerto 27017)  │
└────────┬────────┘
         │
         ├──────────────┐
         ▼              ▼
┌─────────────────┐  ┌─────────────────┐
│    Grafana      │  │ Dashboard HTML  │
│ (Puerto 3001)   │  │ (dashboard.html) │
└─────────────────┘  └─────────────────┘
```

---

## 📦 Tecnologías Utilizadas

- **Backend**: NestJS 11.x + TypeScript
- **Base de Datos**: 
  - Opción 1: MongoDB Atlas (nube)
  - Opción 2: MongoDB 7.0 (Docker)
- **ODM**: Mongoose
- **Runtime**: Node.js 24.x
- **Validación**: class-validator + class-transformer
- **Visualización**: 
  - Opción 1: HTML + Chart.js
  - Opción 2: Grafana + HTML + Chart.js
- **Containerización**: Docker + Docker Compose (Opción 2)

---

## 📋 Requisitos Previos

### Opción 1: Instalación Manual
- **Node.js** >= 18.x
- **npm** >= 9.x
- Cuenta en **MongoDB Atlas** (gratis)
- Navegador web moderno

### Opción 2: Instalación con Docker
- **Docker** >= 24.x
- **Docker Compose** >= 2.x
- **Node.js** >= 18.x (solo para el simulador)
- Navegador web moderno

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd ecosistema_simulado
```

### 2. Elegir Método de Instalación

Elige una de las dos opciones según tus necesidades:

---

## 📦 Opción 1: Instalación Manual (MongoDB Atlas)

### Paso 1: Instalar Dependencias

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

El archivo `.env` ya está configurado con MongoDB Atlas:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecosistema_simulado?retryWrites=true&w=majority
```

⚠️ **Nota**: Reemplaza `usuario:password@cluster.mongodb.net` con tus credenciales reales de MongoDB Atlas.

### Paso 3: Iniciar el Servidor

```bash
npm run start:dev
```

**Deberías ver:**
```
🚀 Servidor ejecutándose en http://localhost:3000
```

### Paso 4: Ejecutar el Simulador (En otra terminal)

```bash
node simulator.js
```

**Deberías ver:**
```
🚀 Iniciando Simulador de Sensor de Proximidad
📡 Enviando datos: { sensor_id: 'proximidad_01', distancia_cm: 45.32 }
✅ Datos enviados exitosamente
```

### Paso 5: Visualizar los Datos

**Opción A: Dashboard HTML** (Recomendado)
- Haz doble clic en `dashboard.html`
- O ejecuta: `abrir-dashboard.bat`

**Opción B: Navegador (JSON)**
- http://localhost:3000/sensors/data
- http://localhost:3000/sensors/stats

**Opción C: MongoDB Atlas Web**
- Ir a https://cloud.mongodb.com
- Browse Collections → `ecosistema_simulado` → `sensordatas`

---

## 🐳 Opción 2: Instalación con Docker (MongoDB Local + Grafana)

### Paso 1: Instalar Dependencias (solo para el simulador)

```bash
npm install
```

### Paso 2: Levantar Servicios con Docker Compose

```bash
docker-compose up -d
```

Este comando iniciará automáticamente:
- **MongoDB** en el puerto 27017
- **NestJS API** en el puerto 3000
- **Grafana** en el puerto 3001

### Paso 3: Verificar que los Servicios Estén Corriendo

```bash
docker-compose ps
```

**Deberías ver los 3 servicios en estado "Up":**
```
NAME                STATUS
ecosistema-mongodb  Up
ecosistema-api      Up
ecosistema-grafana  Up
```

### Paso 4: Esperar que los Servicios Inicien

Espera aproximadamente 15-20 segundos para que todos los servicios estén listos.

### Paso 5: Verificar el Servidor

```bash
curl http://localhost:3000/sensors/stats
```

**Deberías ver:**
```json
{
  "success": true,
  "stats": {
    "total_readings": 0,
    "recent_readings_last_hour": 0,
    "average_distance_cm": "0.00"
  }
}
```

### Paso 6: Ejecutar el Simulador (En otra terminal)

```bash
node simulator.js
```

**Deberías ver:**
```
🚀 Iniciando Simulador de Sensor de Proximidad
📡 Enviando datos: { sensor_id: 'proximidad_01', distancia_cm: 45.32 }
✅ Datos enviados exitosamente
```

### Paso 7: Visualizar los Datos

**Opción A: Grafana Dashboard** (Recomendado con Docker)
1. Abrir http://localhost:3001 en tu navegador
2. Login con:
   - Usuario: `admin`
   - Contraseña: `admin`
3. Configurar data source MongoDB:
   - URL: `mongodb://mongodb:27017`
   - Database: `ecosistema_simulado`
   - Collection: `sensordatas`
4. Crear dashboard con paneles Time Series

**Opción B: Dashboard HTML**
- Haz doble clic en `dashboard.html`
- O ejecuta: `abrir-dashboard.bat`

**Opción C: API REST (JSON)**
- http://localhost:3000/sensors/data
- http://localhost:3000/sensors/stats

**Opción D: MongoDB Shell**
```bash
docker exec -it ecosistema-mongodb mongosh
use ecosistema_simulado
db.sensordatas.find().pretty()
```

### Comandos Útiles de Docker

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (borra datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart api
```

---

## 📡 API Endpoints

### POST /sensors/data
Recibe datos del sensor (usado por el simulador)

**Request:**
```json
{
  "sensor_id": "proximidad_01",
  "distancia_cm": 15.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Datos del sensor recibidos correctamente",
  "data": {
    "sensor_id": "proximidad_01",
    "distancia_cm": 15.5,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "_id": "..."
  }
}
```

### GET /sensors/data
Obtiene todas las lecturas (últimas 100)

**Response:**
```json
{
  "success": true,
  "count": 100,
  "data": [...]
}
```

### GET /sensors/data/:sensorId
Obtiene lecturas de un sensor específico

**Ejemplo:** `GET /sensors/data/proximidad_01`

### GET /sensors/data/recent/:minutes
Obtiene lecturas recientes

**Ejemplo:** `GET /sensors/data/recent/60` (última hora)

### GET /sensors/stats
Obtiene estadísticas generales

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_readings": 1250,
    "recent_readings_last_hour": 720,
    "average_distance_cm": "45.67"
  }
}
```

---

## 🔧 Variables de Entorno

### Variables del Servidor (NestJS)

| Variable | Descripción | Default | Requerido | Uso |
|----------|-------------|---------|-----------|-----|
| `PORT` | Puerto donde corre el servidor | `3000` | ❌ No | Local: `3000`<br>Render.com: Asignado automáticamente |
| `MONGODB_URI` | URI de conexión a MongoDB | - | ✅ **Sí** | Formato: `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |

**Ejemplo para desarrollo local:**
```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecosistema_simulado?retryWrites=true&w=majority
```

**Para Render.com:**
- Solo configura `MONGODB_URI`
- `PORT` es asignado automáticamente por Render.com (no lo configures manualmente)

---

## 🤖 Configuración del Simulador

El simulador admite configuración mediante variables de entorno:

### Variables del Simulador

| Variable | Descripción | Default | Requerido |
|----------|-------------|---------|-----------|
| `SERVER_HOST` | Host del servidor | `localhost` | ❌ No |
| `SERVER_PORT` | Puerto del servidor | `3000` | ❌ No |
| `USE_HTTPS` | Forzar uso de HTTPS | `false` | ❌ No |
| `SENSOR_ID` | Identificador del sensor | `proximidad_01` | ❌ No |
| `INTERVAL_MS` | Intervalo de envío (ms) | `5000` | ❌ No |
| `MIN_DISTANCE` | Distancia mínima (cm) | `5.0` | ❌ No |
| `MAX_DISTANCE` | Distancia máxima (cm) | `200.0` | ❌ No |

**Notas importantes:**
- Si `SERVER_PORT=443`, el simulador usa HTTPS automáticamente
- `USE_HTTPS=true` fuerza HTTPS independientemente del puerto

### Ejemplos de Uso

**Básico:**
```bash
node simulator.js
```

**Personalizado:**
```bash
SENSOR_ID="proximidad_02" INTERVAL_MS=3000 node simulator.js
```

**Múltiples sensores simultáneos:**
```bash
# Terminal 1
SENSOR_ID="sensor_01" node simulator.js

# Terminal 2
SENSOR_ID="sensor_02" node simulator.js

# Terminal 3
SENSOR_ID="sensor_03" node simulator.js
```

---

## 📊 Dashboard de Visualización

### Características del Dashboard

El archivo `dashboard.html` incluye:

✅ **Tarjetas de Estadísticas**
- Total de lecturas
- Lecturas en la última hora
- Distancia promedio
- Estado del sistema en tiempo real

✅ **Gráfico de Líneas**
- Muestra lecturas de los últimos 60 minutos
- Actualización automática cada 5 segundos

✅ **Gráfico de Barras**
- Distancia promedio por sensor
- Ideal para múltiples sensores

✅ **Tabla de Datos**
- Últimas 20 lecturas
- Timestamp, sensor_id y distancia

### Cómo Usar el Dashboard

1. Asegúrate que el servidor esté corriendo
2. Abre `dashboard.html` en tu navegador
3. Los datos se actualizarán automáticamente cada 5 segundos

---

## 🗄️ Base de Datos MongoDB Atlas

### Configuración

La conexión a MongoDB Atlas está configurada en `.env`:

```
mongodb+srv://usuario:password@cluster.mongodb.net/ecosistema_simulado
```

### Estructura de Datos

**Colección:** `sensordatas`

**Schema:**
```javascript
{
  _id: ObjectId,
  sensor_id: String,      // Identificador del sensor
  distancia_cm: Number,   // Distancia medida en centímetros
  timestamp: Date,        // Timestamp de la lectura
  createdAt: Date,        // Timestamp de creación (automático)
  updatedAt: Date         // Timestamp de actualización (automático)
}
```

### Ver Datos en MongoDB Atlas

1. Ir a https://cloud.mongodb.com
2. Login con tus credenciales
3. Seleccionar cluster: `loanscluster`
4. Click en **"Browse Collections"**
5. Seleccionar: `ecosistema_simulado` → `sensordatas`

---

## 🧪 Testing

### Test Manual con curl

```bash
# Verificar servidor
curl http://localhost:3000/sensors/stats

# Enviar dato de prueba
curl -X POST http://localhost:3000/sensors/data \
  -H "Content-Type: application/json" \
  -d '{"sensor_id":"test","distancia_cm":42.5}'

# Ver todos los datos
curl http://localhost:3000/sensors/data

# Ver datos recientes
curl http://localhost:3000/sensors/data/recent/30
```

### Test Automatizado (PowerShell)

```bash
.\test-api.ps1
```

Este script ejecuta automáticamente:
- ✅ Verificación del servidor
- ✅ Envío de datos de prueba
- ✅ Consulta de datos
- ✅ Verificación de estadísticas

---

## 📁 Estructura del Proyecto

```
ecosistema_simulado/
├── src/
│   ├── main.ts                          # Punto de entrada
│   ├── app.module.ts                    # Módulo principal
│   └── sensors/
│       ├── dto/
│       │   └── create-sensor-data.dto.ts    # Validación de datos
│       ├── schemas/
│       │   └── sensor-data.schema.ts        # Schema de MongoDB
│       ├── sensors.controller.ts            # Controlador REST
│       ├── sensors.service.ts               # Lógica de negocio
│       └── sensors.module.ts                # Módulo de sensores
├── simulator.js                         # Simulador del sensor
├── dashboard.html                       # Dashboard de visualización
├── abrir-dashboard.bat                  # Script para abrir dashboard
├── test-api.ps1                        # Tests automatizados
├── package.json                         # Dependencias
├── .env                                 # Variables de entorno
└── README.md                            # Este archivo
```

---

## 🎓 Cumplimiento de Requisitos

### 1. Módulo de Recolección de Datos (20%) ✅

- ✅ Simulación del microcontrolador (`simulator.js`)
- ✅ Envío de datos JSON a intervalos regulares
- ✅ Formato: `{"sensor_id": "...", "distancia_cm": ...}`
- ✅ Método HTTP POST

### 2. Módulo de Servidores (20%) ✅

- ✅ Servidor NestJS desplegado y funcional
- ✅ Recepción de datos mediante API REST
- ✅ Almacenamiento persistente en MongoDB Atlas
- ✅ Validación de datos con DTOs

### 3. Módulo de Visualización (20%) ✅

- ✅ Dashboard HTML con gráficos interactivos
- ✅ Conexión a base de datos (MongoDB Atlas)
- ✅ Visualización en tiempo real
- ✅ Actualización automática cada 5 segundos

### 4. Integración y Flujo de Datos (30%) ✅

- ✅ Flujo completo: Simulador → API → MongoDB → Dashboard
- ✅ Consistencia de datos verificada
- ✅ Timestamps automáticos
- ✅ Sin pérdida de información

### 5. Documentación (10%) ✅

- ✅ README completo con instrucciones
- ✅ ENTREGA.md para evaluación
- ✅ Código comentado
- ✅ Scripts de testing

---

## 🛠️ Scripts NPM Disponibles

```bash
npm run start:dev      # Iniciar en modo desarrollo (con hot-reload)
npm run start:prod     # Iniciar en modo producción
npm run build          # Compilar el proyecto
npm run simulator      # Ejecutar simulador de sensor
npm run test           # Ejecutar tests unitarios
```

---

## 🐛 Troubleshooting

### El servidor no inicia

**Opción Manual:**
```bash
# Verificar que el puerto 3000 esté libre
netstat -ano | findstr :3000

# Si está ocupado, cambiar en .env
PORT=3001
```

**Opción Docker:**
```bash
# Verificar logs del servicio API
docker-compose logs api

# Reiniciar el servicio
docker-compose restart api
```

### El simulador no conecta

**Causa:** Servidor no está corriendo

**Solución:**
```bash
# Verificar que el servidor esté activo
curl http://localhost:3000/sensors/stats
```

**Si usas Docker:**
```bash
# Verificar que el contenedor esté corriendo
docker-compose ps

# Si no está corriendo, iniciarlo
docker-compose up -d
```

### Dashboard no muestra datos

**Causa:** Servidor no está corriendo o no hay datos

**Solución:**
1. Verificar servidor: 
   - Manual: `npm run start:dev`
   - Docker: `docker-compose ps`
2. Ejecutar simulador: `node simulator.js`
3. Esperar 10 segundos y refrescar dashboard

### Error de conexión a MongoDB

**Opción Manual (MongoDB Atlas):**
1. Verificar conexión a internet
2. Verificar que la URI en `.env` sea correcta
3. En MongoDB Atlas: Network Access → Add IP → `0.0.0.0/0`

**Opción Docker (MongoDB Local):**
```bash
# Verificar que MongoDB esté corriendo
docker-compose ps mongodb

# Ver logs de MongoDB
docker-compose logs mongodb

# Reiniciar MongoDB
docker-compose restart mongodb
```

### Grafana no se conecta a MongoDB

**Causa:** Configuración incorrecta del data source

**Solución:**
1. Verificar que MongoDB esté corriendo: `docker-compose ps mongodb`
2. En Grafana (http://localhost:3001):
   - Ir a Configuration → Data Sources
   - URL debe ser: `mongodb://mongodb:27017`
   - Database: `ecosistema_simulado`
   - Collection: `sensordatas`
3. Probar la conexión desde Grafana

### Docker Compose no inicia los servicios

**Solución:**
```bash
# Ver logs completos
docker-compose logs

# Detener y volver a iniciar
docker-compose down
docker-compose up -d

# Verificar puertos ocupados
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :27017
```

---

## 📊 Opciones de Visualización

### 1. Dashboard HTML (Disponible en ambas opciones)
- ✅ Interfaz moderna con gráficos
- ✅ Auto-actualización cada 5 segundos
- ✅ Sin instalaciones adicionales
- ✅ Funciona con MongoDB Atlas y MongoDB local

### 2. Grafana (Solo con Docker)
- ✅ Dashboard profesional y avanzado
- ✅ Múltiples tipos de paneles (Time Series, Gauge, Stat, Table)
- ✅ Filtros y consultas avanzadas
- ✅ Auto-refresh configurable
- ✅ Acceso: http://localhost:3001 (admin/admin)

### 3. MongoDB Atlas Web UI (Solo con Opción Manual)
- ✅ Ver datos directamente en la nube
- ✅ Interfaz profesional
- ✅ Gratis
- ✅ Acceso: https://cloud.mongodb.com

### 4. MongoDB Compass (Ambas opciones)
- ✅ Aplicación de escritorio
- ✅ Exploración avanzada
- ✅ Descarga: https://www.mongodb.com/products/compass
- ✅ Conecta a MongoDB Atlas o MongoDB local

### 5. API REST (JSON) (Ambas opciones)
- ✅ Acceso directo mediante curl o navegador
- ✅ Ideal para integración con otras herramientas
- ✅ Endpoints: http://localhost:3000/sensors/data

---

## 🎯 Demo Rápida

### Opción 1: Manual (5 minutos)

```bash
# 1. Iniciar servidor
npm run start:dev

# 2. Ejecutar simulador (en otra terminal)
node simulator.js

# 3. Ver datos
# Opción A: Abrir dashboard.html
# Opción B: http://localhost:3000/sensors/data
# Opción C: https://cloud.mongodb.com
```

### Opción 2: Docker (5 minutos)

```bash
# 1. Levantar servicios Docker
docker-compose up -d

# 2. Esperar 15-20 segundos
# 3. Verificar servicios
docker-compose ps

# 4. Ejecutar simulador (en otra terminal)
node simulator.js

# 5. Ver datos
# Opción A: Grafana en http://localhost:3001 (admin/admin)
# Opción B: Dashboard HTML (abrir dashboard.html)
# Opción C: API REST http://localhost:3000/sensors/data
```

---

## ✨ Comparación de Opciones

### Opción 1: MongoDB Atlas (Manual)
**Ventajas:**
- ✅ **No requiere instalación local** de MongoDB
- ✅ **Backups automáticos** incluidos
- ✅ **Accesible desde cualquier lugar** con internet
- ✅ **Escalabilidad automática** según demanda
- ✅ **Monitoreo incluido** en el dashboard de Atlas
- ✅ **Nivel gratuito suficiente** para el proyecto
- ✅ **No requiere Docker**

**Ideal para:** Desarrollo rápido, acceso remoto, proyectos pequeños

### Opción 2: Docker (MongoDB Local + Grafana)
**Ventajas:**
- ✅ **Todo en contenedores** - fácil de desplegar
- ✅ **Grafana incluido** - visualización profesional
- ✅ **MongoDB local** - sin dependencia de internet
- ✅ **Aislamiento completo** - no afecta el sistema
- ✅ **Reproducible** - mismo entorno en cualquier máquina
- ✅ **Fácil de limpiar** - `docker-compose down -v`

**Ideal para:** Desarrollo local, demostraciones, aprendizaje de Docker

---

## ☁️ Opción 3: Despliegue en Render.com con Docker

### Despliegue en la Nube

Puedes desplegar tu aplicación en **Render.com** usando Docker para tenerla disponible públicamente en internet.

### Características

- ✅ **Despliegue automático** desde Git
- ✅ **SSL automático** (HTTPS)
- ✅ **Plan gratuito disponible**
- ✅ **Dockerfile incluido** en el proyecto
- ✅ **MongoDB Atlas** como base de datos
- ✅ **URL pública** para acceder desde cualquier lugar

### Requisitos

- Cuenta en Render.com (gratis): https://render.com
- Repositorio Git (GitHub, GitLab o Bitbucket)
- MongoDB Atlas configurado

### Pasos Rápidos

1. **Preparar el repositorio**
   - Asegúrate de que el `Dockerfile` esté en la raíz del proyecto
   - Sube tu código a GitHub/GitLab/Bitbucket

2. **Crear servicio en Render.com**
   - Ve a https://dashboard.render.com
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio
   - Selecciona "Docker" como Runtime

3. **Configurar variables de entorno**
   ```
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecosistema_simulado?retryWrites=true&w=majority
   ```

   ⚠️ **Nota sobre PORT**: Render.com asigna automáticamente el puerto. NO configures la variable `PORT` manualmente, ya que Render.com la inyecta automáticamente y tu aplicación la lee desde `process.env.PORT`.

4. **Desplegar**
   - Click en "Create Web Service"
   - Espera 5-10 minutos para el build
   - Obtén tu URL pública (ej: `https://tu-app.onrender.com`)

### Documentación Completa

Para una guía detallada paso a paso, consulta: **[RENDER.md](RENDER.md)**

La guía incluye:
- ✅ Instrucciones detalladas de configuración
- ✅ Troubleshooting común
- ✅ Configuración de MongoDB Atlas
- ✅ Testing del despliegue
- ✅ Monitoreo y logs

### Ejemplo de Uso

Una vez desplegado, puedes usar tu API desde cualquier lugar:

```bash
# Verificar que funciona
curl https://tu-app.onrender.com/sensors/stats

# Enviar datos
curl -X POST https://tu-app.onrender.com/sensors/data \
  -H "Content-Type: application/json" \
  -d '{"sensor_id":"sensor_01","distancia_cm":25.5}'
```

### Actualizar Simulador para Render

El simulador soporta HTTPS automáticamente. Para que apunte a tu URL de Render:

```bash
SERVER_HOST=ecosistema-simulado.onrender.com SERVER_PORT=443 node simulator.js
```

El simulador detectará automáticamente que el puerto 443 requiere HTTPS y usará el protocolo correcto.

---

## 🚀 Producción: Acceso a Componentes Desplegados

Una vez desplegado en Render.com, todos los servicios están disponibles desde una sola URL:

**URL Base**: `https://ecosistema-simulado.onrender.com`

### 📊 Dashboard Web (Desplegado en Render.com) ⭐

**✅ El dashboard ahora está disponible directamente en Render.com**

**Acceso al Dashboard:**
- **URL Principal**: https://ecosistema-simulado.onrender.com
- **URL Directa**: https://ecosistema-simulado.onrender.com/dashboard.html

**Características:**
- ✅ **Totalmente funcional desde Render.com** - No necesitas abrir archivos locales
- ✅ Actualización automática cada 5 segundos
- ✅ Gráficos de líneas (tendencia temporal)
- ✅ Gráficos de barras (promedio por sensor)
- ✅ Tabla de datos en tiempo real
- ✅ Tarjetas de estadísticas
- ✅ Se conecta automáticamente a la API en el mismo dominio

**Uso:**
1. Simplemente abre https://ecosistema-simulado.onrender.com en tu navegador
2. El dashboard se cargará automáticamente
3. **Control del Simulador**: Usa el botón "Iniciar Simulador" en la parte superior del dashboard
4. Los datos se actualizarán cada 5 segundos automáticamente

**Control del Simulador:**
- ✅ **Botón "Iniciar Simulador"**: Inicia el simulador directamente desde Render.com
- ✅ **Botón "Detener Simulador"**: Detiene el simulador cuando está en ejecución
- ✅ **Estado en tiempo real**: Muestra si el simulador está corriendo o detenido
- ✅ **Funciona completamente en Render**: No necesitas ejecutar nada localmente

### 🌐 API REST (Desplegada en Render.com)

**Endpoints disponibles:**

1. **Estadísticas generales:**
   ```
   https://ecosistema-simulado.onrender.com/sensors/stats
   ```

2. **Todos los datos (últimas 100 lecturas):**
   ```
   https://ecosistema-simulado.onrender.com/sensors/data
   ```

3. **Datos recientes (última hora):**
   ```
   https://ecosistema-simulado.onrender.com/sensors/data/recent/60
   ```

4. **Datos de un sensor específico:**
   ```
   https://ecosistema-simulado.onrender.com/sensors/data/proximidad_01
   ```

5. **Enviar datos (POST):**
   ```bash
   curl -X POST https://ecosistema-simulado.onrender.com/sensors/data \
     -H "Content-Type: application/json" \
     -d '{"sensor_id":"sensor_01","distancia_cm":25.5}'
   ```

6. **Control del Simulador:**
   - **Iniciar simulador**: `POST /sensors/simulator/start`
   - **Detener simulador**: `POST /sensors/simulator/stop`
   - **Estado del simulador**: `GET /sensors/simulator/status`

   **Ejemplo:**
   ```bash
   # Iniciar simulador
   curl -X POST https://ecosistema-simulado.onrender.com/sensors/simulator/start
   
   # Ver estado
   curl https://ecosistema-simulado.onrender.com/sensors/simulator/status
   
   # Detener simulador
   curl -X POST https://ecosistema-simulado.onrender.com/sensors/simulator/stop
   ```

### 📊 Dashboard HTML (Alternativa Local)

Si prefieres usar el dashboard localmente (opcional):

1. **Abrir el dashboard local:**
   - Haz doble clic en `dashboard.html` (en la raíz del proyecto)
   - O ejecuta: `abrir-dashboard.bat` (Windows)

2. **Funcionamiento:**
   - El dashboard detecta automáticamente si estás en `localhost` o en producción
   - Si abres desde tu máquina, se conectará a Render automáticamente
   - Si estás en desarrollo local, se conectará a `localhost:3000`

### 📈 Grafana (Solo Disponible Localmente - Opcional)

**⚠️ Importante**: 
- Grafana **NO está desplegado en Render.com**
- Grafana solo funciona **localmente con Docker**
- **El Dashboard HTML** es el que muestra las estadísticas en Render.com

**¿Qué es Grafana?**
- Grafana es una herramienta profesional de visualización de datos
- Permite crear dashboards avanzados con múltiples paneles
- Es más complejo pero más potente que el Dashboard HTML

**¿Necesito Grafana?**
- ❌ **NO es necesario** para ver las estadísticas en Render.com
- ✅ El **Dashboard HTML** ya muestra todo lo que necesitas
- ✅ Grafana es **opcional** y solo útil para análisis avanzados locales

**Para usar Grafana (solo si quieres probarlo localmente):**

1. **Crear docker-compose.yml** (ver [GRAFANA.md](GRAFANA.md) para detalles)

2. **Levantar servicios Docker:**
   ```bash
   docker-compose up -d
   ```

3. **Acceder a Grafana:**
   - URL: http://localhost:3001
   - Usuario: `admin`
   - Contraseña: `admin`

4. **Configurar Data Source:**
   - Ve a Configuration → Data Sources
   - Agrega MongoDB (requiere plugin)
   - URL: `mongodb://mongodb:27017` (local) o `mongodb+srv://...` (Atlas)
   - Database: `ecosistema_simulado`
   - Collection: `sensordatas`

5. **Crear Dashboard:**
   - Crea paneles Time Series, Gauge, Stat, Table
   - Configura auto-refresh cada 5-10 segundos

**📚 Para más detalles:**
- **Grafana Local**: [GRAFANA.md](GRAFANA.md)
- **Grafana en Render.com**: [RENDER-GRAFANA.md](RENDER-GRAFANA.md) ⭐ Nuevo

### 🔄 Flujo Completo en Producción

```
Simulador Local
     │
     │ HTTPS POST
     ▼
API + Dashboard en Render.com
(https://ecosistema-simulado.onrender.com)
     │
     ├──────────────┐
     │              │
     │ Mongoose     │ HTTP (mismo dominio)
     ▼              ▼
MongoDB Atlas   Dashboard Web
   (Nube)      (Render.com)
     │
     │ (Opcional - Solo local)
     ▼
   Grafana
  (Local con Docker)
```

**Nota**: El dashboard ahora está desplegado en Render.com junto con la API. Todo funciona desde una sola URL.

### 📱 Enviar Datos desde el Simulador a Render

Para que el simulador envíe datos a tu API en Render:

```bash
SERVER_HOST=ecosistema-simulado.onrender.com SERVER_PORT=443 node simulator.js
```

**O usar el script incluido `simulador-render.bat` (Windows):**
```batch
# Simplemente ejecuta:
simulador-render.bat
```

El script ya está incluido en el proyecto y está configurado para enviar datos a Render.com.

### ✅ Verificación Rápida

1. **Abrir el Dashboard en Render:**
   - Ve a: https://ecosistema-simulado.onrender.com
   - El dashboard debería cargar automáticamente

2. **Verificar que la API funciona:**
   ```bash
   curl https://ecosistema-simulado.onrender.com/sensors/stats
   ```
   O abre en el navegador: https://ecosistema-simulado.onrender.com/sensors/stats

3. **Enviar datos de prueba:**
   ```bash
   # Opción 1: Usar el script (Windows)
   simulador-render.bat
   
   # Opción 2: Comando directo
   SERVER_HOST=ecosistema-simulado.onrender.com SERVER_PORT=443 node simulator.js
   ```

4. **Ver los datos en el Dashboard:**
   - Después de enviar datos con el simulador, refresca el dashboard
   - Los datos aparecerán automáticamente en los gráficos

---

## 📚 Documentación Adicional

- **ENTREGA.md** - Documentación para evaluación del proyecto
- **RENDER.md** - Guía completa de despliegue en Render.com con Docker
- **Código fuente** - Comentarios inline en los archivos TypeScript

---

## 👤 Autor

Desarrollado para el proyecto académico "Ecosistema de Monitoreo Simulado"

---

## 📄 Licencia

UNLICENSED - Proyecto académico

---

## 🆘 Soporte

Si encuentras algún problema:

1. Verificar que el servidor esté corriendo: `npm run start:dev`
2. Verificar conexión a internet (para MongoDB Atlas)
3. Revisar logs del servidor en la terminal
4. Verificar que el simulador esté enviando datos

---

**¡Listo para usar!** 🚀

### Inicio Rápido - Opción Manual:
```bash
npm run start:dev
node simulator.js
# Abrir dashboard.html
```

### Inicio Rápido - Opción Docker:
```bash
docker-compose up -d
node simulator.js
# Abrir http://localhost:3001 (Grafana) o dashboard.html
```

### Inicio Rápido - Opción Render.com:
```bash
# 1. Seguir guía en RENDER.md para desplegar
# 2. Una vez desplegado, usar la URL pública
curl https://tu-app.onrender.com/sensors/stats
```
