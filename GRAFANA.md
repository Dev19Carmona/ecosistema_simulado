# 📈 Guía Completa de Grafana

## ¿Qué es Grafana?

**Grafana** es una herramienta profesional de visualización de datos que permite crear dashboards avanzados con gráficos, métricas y alertas. Es muy popular en el mundo de IoT y monitoreo.

---

## 🎯 ¿Grafana está desplegado en Render.com?

**❌ NO**, Grafana **NO está desplegado en Render.com**. 

### ¿Por qué no está en Render.com?

1. **Render.com (Plan Gratuito)** solo permite desplegar **un servicio** por aplicación
2. Ya tienes desplegado la **API NestJS** en Render.com
3. Grafana requeriría un servicio separado (costaría dinero en planes de pago)

### ¿Qué muestra las estadísticas en Render.com?

**✅ El Dashboard HTML** es el que muestra las estadísticas en Render.com:
- URL: https://ecosistema-simulado.onrender.com
- Muestra gráficos, tablas y estadísticas
- Se actualiza automáticamente cada 5 segundos
- **Este es el que estás usando actualmente**

---

## 📊 Comparación: Dashboard HTML vs Grafana

| Característica | Dashboard HTML | Grafana |
|----------------|----------------|---------|
| **Ubicación** | ✅ Render.com (producción) | ❌ Solo local con Docker |
| **Acceso** | https://ecosistema-simulado.onrender.com | http://localhost:3001 |
| **Instalación** | ✅ Ya está desplegado | ⚠️ Requiere Docker local |
| **Facilidad** | ✅ Muy fácil de usar | ⚠️ Requiere configuración |
| **Gráficos** | ✅ Gráficos básicos (Chart.js) | ✅ Gráficos avanzados profesionales |
| **Personalización** | ⚠️ Limitada | ✅ Muy personalizable |
| **Alertas** | ❌ No | ✅ Sí |
| **Múltiples paneles** | ⚠️ Limitado | ✅ Ilimitados |

---

## 🚀 ¿Cuándo usar Grafana?

Usa **Grafana** si:
- ✅ Quieres visualizaciones más avanzadas y profesionales
- ✅ Necesitas múltiples paneles y dashboards
- ✅ Quieres configurar alertas automáticas
- ✅ Trabajas localmente con Docker
- ✅ Necesitas análisis más profundos de los datos

Usa **Dashboard HTML** si:
- ✅ Quieres algo simple y rápido
- ✅ Necesitas acceso desde cualquier lugar (Render.com)
- ✅ No quieres instalar nada localmente
- ✅ Solo necesitas ver los datos básicos

---

## 🐳 Cómo usar Grafana (Solo Localmente)

### Requisitos Previos

1. **Docker Desktop** instalado y corriendo
2. **docker-compose.yml** configurado (actualmente no está en el proyecto)

### Paso 1: Crear docker-compose.yml

Crea un archivo `docker-compose.yml` en la raíz del proyecto:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: ecosistema-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - ecosistema-network

  api:
    build: .
    container_name: ecosistema-api
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/ecosistema_simulado
      - PORT=3000
    depends_on:
      - mongodb
    networks:
      - ecosistema-network

  grafana:
    image: grafana/grafana:latest
    container_name: ecosistema-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - ecosistema-network
    depends_on:
      - mongodb

volumes:
  mongodb_data:
  grafana_data:

networks:
  ecosistema-network:
    driver: bridge
```

### Paso 2: Levantar los Servicios

```bash
docker-compose up -d
```

Esto iniciará:
- **MongoDB** en puerto 27017
- **API NestJS** en puerto 3000
- **Grafana** en puerto 3001

### Paso 3: Acceder a Grafana

1. Abre tu navegador en: **http://localhost:3001**
2. Login:
   - Usuario: `admin`
   - Contraseña: `admin`

### Paso 4: Configurar Data Source (MongoDB)

1. En Grafana, ve a **Configuration** → **Data Sources**
2. Click en **"Add data source"**
3. Busca y selecciona **"MongoDB"**
4. Configura:
   - **Name**: `MongoDB Local`
   - **URL**: `mongodb://mongodb:27017`
   - **Database**: `ecosistema_simulado`
   - **Collection**: `sensordatas`
5. Click en **"Save & Test"**

**⚠️ Nota**: Si usas MongoDB Atlas (nube), la configuración es diferente:
- **URL**: `mongodb+srv://usuario:password@cluster.mongodb.net:27017`
- Necesitas instalar el plugin de MongoDB para Grafana

### Paso 5: Crear un Dashboard

1. Ve a **Dashboards** → **New Dashboard**
2. Click en **"Add visualization"**
3. Selecciona tu Data Source (MongoDB)
4. Configura la consulta:
   ```javascript
   // Ejemplo de consulta MongoDB
   db.sensordatas.find({
     timestamp: { $gte: "$__from", $lte: "$__to" }
   }).sort({ timestamp: 1 })
   ```
5. Selecciona el tipo de panel:
   - **Time Series**: Para gráficos de línea temporal
   - **Gauge**: Para mostrar un valor actual
   - **Stat**: Para mostrar estadísticas
   - **Table**: Para mostrar datos en tabla

### Paso 6: Configurar Auto-Refresh

1. En tu dashboard, click en el ícono de reloj ⏰
2. Selecciona el intervalo (ej: "5s", "10s", "30s")
3. Los datos se actualizarán automáticamente

---

## 🔄 Flujo de Datos con Grafana

```
Simulador (simulator.js o desde dashboard)
     │
     │ HTTP POST
     ▼
API NestJS (localhost:3000)
     │
     │ Mongoose
     ▼
MongoDB (localhost:27017)
     │
     │ MongoDB Query
     ▼
Grafana (localhost:3001)
     │
     ▼
Dashboard Visual
```

---

## 📝 Resumen

### En Render.com (Producción):
- ✅ **Dashboard HTML**: Muestra las estadísticas
- ❌ **Grafana**: NO está disponible

### Localmente (con Docker):
- ✅ **Dashboard HTML**: También funciona localmente
- ✅ **Grafana**: Disponible en http://localhost:3001

---

## 🎓 Conclusión

**Para tu caso actual (Render.com):**
- ✅ **Usa el Dashboard HTML** que ya está desplegado
- ✅ Es simple, funcional y accesible desde cualquier lugar
- ✅ No necesitas Grafana para ver las estadísticas

**Grafana es opcional** y solo útil si:
- Quieres visualizaciones más avanzadas
- Trabajas localmente con Docker
- Necesitas análisis más profundos

---

## 📚 Recursos Adicionales

- **Documentación de Grafana**: https://grafana.com/docs/
- **Grafana Dashboards**: https://grafana.com/grafana/dashboards/
- **MongoDB Plugin para Grafana**: https://grafana.com/grafana/plugins/grafana-mongodb-datasource/

---

**¿Tienes más preguntas sobre Grafana?** Puedo ayudarte a configurarlo localmente si lo necesitas.

