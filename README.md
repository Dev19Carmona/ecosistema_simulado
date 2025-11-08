# 🌐 Ecosistema de Monitoreo Simulado - Sensores IoT

Sistema completo de monitoreo IoT con simulación de sensores de proximidad, almacenamiento en **MongoDB Atlas** (nube) y visualización mediante dashboard web.

---

## 📋 Descripción

Proyecto académico que simula un ecosistema de monitoreo IoT donde:
- Un **sensor de proximidad simulado** envía datos en formato JSON
- Un **servidor NestJS** recibe y almacena los datos
- **MongoDB Atlas** (base de datos en la nube) almacena persistentemente
- Un **dashboard web** visualiza los datos en tiempo real

---

## 🏗️ Arquitectura del Sistema

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

---

## 📦 Tecnologías Utilizadas

- **Backend**: NestJS 11.x + TypeScript
- **Base de Datos**: MongoDB Atlas (nube)
- **ODM**: Mongoose
- **Runtime**: Node.js 24.x
- **Validación**: class-validator + class-transformer
- **Visualización**: HTML + Chart.js

---

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- Cuenta en **MongoDB Atlas** (gratis)
- Navegador web moderno

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd ecosistema_simulado
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

El archivo `.env` ya está configurado con MongoDB Atlas:

```env
PORT=3000
MONGODB_URI=mongodb+srv://camilocr3:Samanta1234*@loanscluster.fktx4sx.mongodb.net/ecosistema_simulado?retryWrites=true&w=majority
```

---

## 💻 Uso

### Paso 1: Iniciar el Servidor

```bash
npm run start:dev
```

**Deberías ver:**
```
🚀 Servidor ejecutándose en http://localhost:3000
```

### Paso 2: Ejecutar el Simulador (En otra terminal)

```bash
node simulator.js
```

**Deberías ver:**
```
🚀 Iniciando Simulador de Sensor de Proximidad
📡 Enviando datos: { sensor_id: 'proximidad_01', distancia_cm: 45.32 }
✅ Datos enviados exitosamente
```

### Paso 3: Visualizar los Datos

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

**Solución:**
```bash
# Verificar que el puerto 3000 esté libre
netstat -ano | findstr :3000

# Si está ocupado, cambiar en .env
PORT=3001
```

### El simulador no conecta

**Causa:** Servidor no está corriendo

**Solución:**
```bash
# Verificar que el servidor esté activo
curl http://localhost:3000/sensors/stats
```

### Dashboard no muestra datos

**Causa:** Servidor no está corriendo o no hay datos

**Solución:**
1. Verificar servidor: `npm run start:dev`
2. Ejecutar simulador: `node simulator.js`
3. Esperar 10 segundos y refrescar dashboard

### Error de conexión a MongoDB

**Causa:** Problemas de red o credenciales incorrectas

**Solución:**
1. Verificar conexión a internet
2. Verificar que la URI en `.env` sea correcta
3. En MongoDB Atlas: Network Access → Add IP → `0.0.0.0/0`

---

## 📊 Opciones de Visualización

### 1. Dashboard HTML (Incluido)
- ✅ Interfaz moderna con gráficos
- ✅ Auto-actualización
- ✅ Sin instalaciones adicionales

### 2. MongoDB Atlas Web UI
- ✅ Ver datos directamente en la nube
- ✅ Interfaz profesional
- ✅ Gratis

### 3. MongoDB Compass
- ✅ Aplicación de escritorio
- ✅ Exploración avanzada
- ✅ Descarga: https://www.mongodb.com/products/compass

### 4. API REST (JSON)
- ✅ Acceso directo mediante curl o navegador
- ✅ Ideal para integración con otras herramientas

---

## 🎯 Demo Rápida (5 minutos)

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

---

## ✨ Ventajas de MongoDB Atlas

- ✅ **No requiere instalación local** de MongoDB
- ✅ **Backups automáticos** incluidos
- ✅ **Accesible desde cualquier lugar** con internet
- ✅ **Escalabilidad automática** según demanda
- ✅ **Monitoreo incluido** en el dashboard de Atlas
- ✅ **Nivel gratuito suficiente** para el proyecto

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

Para iniciar:
```bash
npm run start:dev
node simulator.js
# Abrir dashboard.html
```
