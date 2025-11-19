# 🌐 Ecosistema de Monitoreo Simulado - Sensores IoT

Sistema completo de monitoreo IoT con simulación de sensores de proximidad, almacenamiento en **MongoDB** (Atlas en nube o local con Docker) y visualización mediante dashboard web o Grafana.

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
MONGODB_URI=mongodb+srv://camilocr3:Samanta1234*@loanscluster.fktx4sx.mongodb.net/ecosistema_simulado?retryWrites=true&w=majority
```

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

## 🤖 Configuración del Simulador

El simulador admite configuración mediante variables de entorno:

### Variables Disponibles

| Variable | Descripción | Default |
|----------|-------------|---------|
| `SERVER_HOST` | Host del servidor | localhost |
| `SERVER_PORT` | Puerto del servidor | 3000 |
| `SENSOR_ID` | Identificador del sensor | proximidad_01 |
| `INTERVAL_MS` | Intervalo de envío (ms) | 5000 |
| `MIN_DISTANCE` | Distancia mínima (cm) | 5.0 |
| `MAX_DISTANCE` | Distancia máxima (cm) | 200.0 |

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

## 📚 Documentación Adicional

- **ENTREGA.md** - Documentación para evaluación del proyecto
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
