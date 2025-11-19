# 🚀 Desplegar Grafana en Render.com

Esta guía te explica cómo desplegar Grafana como un servicio separado en Render.com.

---

## ⚠️ Consideraciones Importantes

### ¿Cómo funciona?

**Sí, es el mismo repositorio, pero:**

1. ✅ **Mismo repositorio de GitHub/GitLab** - Ambos servicios apuntan al mismo repo
2. ⚠️ **Dockerfile diferente**:
   - API NestJS usa: `Dockerfile`
   - Grafana usa: `Dockerfile.grafana`
3. ✅ **Variables de entorno diferentes** - Cada servicio tiene sus propias variables
4. ✅ **Servicios separados** - Son 2 servicios independientes en Render.com

**Resumen:**
- **Repositorio**: ✅ El mismo
- **Dockerfile**: ❌ Diferente (Dockerfile vs Dockerfile.grafana)
- **Variables de entorno**: ❌ Diferentes (cada servicio tiene las suyas)
- **Servicios en Render.com**: ❌ Separados (2 servicios diferentes)

### Plan Gratuito de Render.com
- ✅ Permite múltiples servicios (cada uno cuenta como servicio separado)
- ⚠️ Cada servicio puede "dormirse" después de 15 minutos de inactividad
- ⚠️ El primer acceso después de dormir puede tardar 30-60 segundos

### Costos
- **Plan Free**: Gratis, pero con limitaciones (servicios duermen)
- **Plan Starter**: $7/mes por servicio (sin dormir)

---

## 📋 Requisitos Previos

1. ✅ Ya tienes la API desplegada en Render.com
2. ✅ Tienes MongoDB Atlas configurado
3. ✅ Tienes una cuenta en Render.com

---

## 🚀 Paso 1: Preparar el Repositorio

### 1.1 Verificar que tienes Dockerfile.grafana

El archivo `Dockerfile.grafana` ya está creado en el proyecto.

### 1.2 Hacer commit y push

```bash
git add Dockerfile.grafana RENDER-GRAFANA.md
git commit -m "Add: Dockerfile y guía para desplegar Grafana en Render.com"
git push
```

---

## 🚀 Paso 2: Crear Servicio de Grafana en Render.com

### 2.1 Ir a Render.com Dashboard

1. Ve a https://dashboard.render.com
2. Click en **"New +"** → **"Web Service"**

### 2.2 Conectar Repositorio

1. Selecciona tu repositorio de GitHub/GitLab
2. O conecta manualmente si prefieres

### 2.3 Configurar el Servicio

**Configuración básica:**

- **Name**: `ecosistema-grafana` (o el nombre que prefieras)
- **Region**: Elige la región más cercana
- **Branch**: `main` (o la rama que uses) - ✅ **Mismo repositorio que la API**
- **Runtime**: **Docker** ⚠️ IMPORTANTE

**Build & Deploy:**

- **Dockerfile Path**: `Dockerfile.grafana` ⚠️ **DIFERENTE al de la API** (que usa `Dockerfile`)
- **Build Command**: ⚠️ **DEJAR VACÍO** (Render usa Docker)
- **Start Command**: ⚠️ **DEJAR VACÍO** (Render usa Docker)

**⚠️ Diferencia clave:**
- **API NestJS**: Usa `Dockerfile` → Construye la aplicación NestJS
- **Grafana**: Usa `Dockerfile.grafana` → Construye solo Grafana

**Plan:**

- Selecciona **Free** (gratis) o **Starter** ($7/mes, sin dormir)

### 2.4 Configurar Variables de Entorno

Click en **"Advanced"** → **"Add Environment Variable"**

**⚠️ IMPORTANTE**: Estas variables son **SOLO para Grafana**. La API tiene sus propias variables.

Agrega estas variables:

| Key | Value | Descripción |
|-----|-------|-------------|
| `GF_SECURITY_ADMIN_USER` | `admin` | Usuario de Grafana |
| `GF_SECURITY_ADMIN_PASSWORD` | `tu-password-seguro` | ⚠️ Cambia esto por una contraseña segura |
| `MONGODB_URI` | `mongodb+srv://...` | Tu connection string de MongoDB Atlas (puede ser la misma que la API) |
| `GF_SERVER_ROOT_URL` | `https://tu-grafana.onrender.com` | URL completa (se actualizará después) |

**Comparación con la API:**

| Variable | API NestJS | Grafana |
|----------|------------|---------|
| `MONGODB_URI` | ✅ Tiene (para guardar datos) | ✅ Tiene (para leer datos) |
| `PORT` | ✅ Render asigna automáticamente | ✅ Render asigna automáticamente |
| `GF_SECURITY_ADMIN_USER` | ❌ No tiene | ✅ Solo Grafana |
| `GF_SECURITY_ADMIN_PASSWORD` | ❌ No tiene | ✅ Solo Grafana |
| `GF_SERVER_ROOT_URL` | ❌ No tiene | ✅ Solo Grafana |

**⚠️ Importante sobre MONGODB_URI:**
- Puedes usar la misma `MONGODB_URI` que usaste para la API (ambos leen/escriben la misma BD)
- Debe incluir el nombre de la base de datos: `/ecosistema_simulado`
- Formato: `mongodb+srv://usuario:password@cluster.mongodb.net/ecosistema_simulado?retryWrites=true&w=majority`

### 2.5 Crear el Servicio

Click en **"Create Web Service"**

---

## ⏳ Paso 3: Esperar el Build

Render.com automáticamente:
1. Clonará tu repositorio
2. Construirá la imagen Docker usando `Dockerfile.grafana`
3. Desplegará Grafana
4. Te dará una URL pública (ej: `https://ecosistema-grafana.onrender.com`)

**Tiempo estimado**: 5-10 minutos

---

## 🔧 Paso 4: Configurar Grafana

Una vez que el servicio esté "Live":

### 4.1 Acceder a Grafana

1. Ve a la URL que Render.com te dio (ej: `https://ecosistema-grafana.onrender.com`)
2. Login:
   - Usuario: `admin`
   - Contraseña: La que configuraste en `GF_SECURITY_ADMIN_PASSWORD`

### 4.2 Instalar Plugin de MongoDB

Grafana necesita un plugin para conectarse a MongoDB:

1. Ve a **Configuration** → **Plugins**
2. Busca **"MongoDB"** o **"Grafana MongoDB Datasource"**
3. Click en **"Install"**
4. ⚠️ **Problema**: En Render.com, los plugins pueden no instalarse automáticamente

**Alternativa - Usar API REST de tu aplicación:**

En lugar de conectar Grafana directamente a MongoDB, puedes:
1. Usar el plugin **"JSON API"** o **"REST API"** de Grafana
2. Conectar a tu API en Render.com: `https://ecosistema-simulado.onrender.com/sensors/data`
3. Esto es más simple y no requiere plugins especiales

### 4.3 Configurar Data Source

**Opción A: MongoDB Directo (requiere plugin)**

1. Ve a **Configuration** → **Data Sources**
2. Click en **"Add data source"**
3. Selecciona **"MongoDB"**
4. Configura:
   - **Name**: `MongoDB Atlas`
   - **URL**: Extrae de `MONGODB_URI` (solo la parte de conexión)
   - **Database**: `ecosistema_simulado`
   - **Collection**: `sensordatas`
   - **Auth**: Usuario y contraseña de MongoDB

**Opción B: API REST (Recomendado - Más Simple)**

1. Ve a **Configuration** → **Data Sources**
2. Click en **"Add data source"**
3. Busca **"JSON API"** o **"REST API"**
4. Configura:
   - **Name**: `API Ecosistema`
   - **URL**: `https://ecosistema-simulado.onrender.com`
   - **Method**: `GET`
   - **Path**: `/sensors/data`

### 4.4 Crear Dashboard

1. Ve a **Dashboards** → **New Dashboard**
2. Click en **"Add visualization"**
3. Selecciona tu Data Source
4. Configura la consulta según el tipo de Data Source que uses

**Ejemplo con API REST:**
- Query: `/sensors/data`
- Transform: Selecciona campos `timestamp`, `distancia_cm`, `sensor_id`
- Visualization: Time Series

---

## 🔄 Paso 5: Actualizar GF_SERVER_ROOT_URL

Después de que Render.com te dé la URL:

1. Ve a tu servicio de Grafana en Render.com
2. Click en **"Environment"**
3. Actualiza `GF_SERVER_ROOT_URL` con la URL completa:
   ```
   https://ecosistema-grafana.onrender.com
   ```
4. Guarda los cambios
5. Render.com reiniciará el servicio automáticamente

---

## ✅ Verificación

### Verificar que Grafana funciona:

1. Abre la URL de Grafana en tu navegador
2. Deberías ver la pantalla de login
3. Login con `admin` y tu contraseña
4. Deberías ver el dashboard de Grafana

### Verificar conexión a datos:

1. Ve a **Configuration** → **Data Sources**
2. Click en **"Test"** en tu Data Source
3. Debería mostrar "Data source is working"

---

## 🐛 Troubleshooting

### Grafana no carga

**Problema**: La página muestra error o no carga

**Solución**:
1. Verifica que el servicio esté "Live" en Render.com
2. Espera 30-60 segundos si el servicio estaba dormido
3. Verifica los logs en Render.com: **"Logs"** tab
4. Verifica que `GF_SERVER_ROOT_URL` esté correcto

### No puedo instalar plugins

**Problema**: Los plugins no se instalan en Render.com

**Solución**:
- Usa la **Opción B** (API REST) en lugar de MongoDB directo
- Es más simple y no requiere plugins especiales
- Conecta Grafana a tu API en lugar de MongoDB directamente

### Error de conexión a MongoDB

**Problema**: Grafana no se conecta a MongoDB

**Solución**:
1. Verifica que `MONGODB_URI` esté correcta en Render.com
2. Verifica que MongoDB Atlas permita conexiones desde `0.0.0.0/0`
3. Usa la **Opción B** (API REST) como alternativa más simple

### El servicio se duerme

**Problema**: Grafana tarda mucho en cargar

**Solución**:
1. Es normal en el plan gratuito (duerme después de 15 min)
2. La primera carga puede tardar 30-60 segundos
3. Considera usar un servicio de "ping" periódico (ej: UptimeRobot)
4. O actualiza a plan Starter ($7/mes) para evitar que duerma

---

## 📊 Flujo Completo con Grafana en Render.com

```
Simulador (desde dashboard o local)
     │
     │ HTTPS POST
     ▼
API NestJS en Render.com
(https://ecosistema-simulado.onrender.com)
     │
     │ Mongoose
     ▼
MongoDB Atlas
     │
     ├──────────────┐
     │              │
     │ API REST     │ MongoDB Query
     ▼              ▼
Dashboard HTML   Grafana
(Render.com)    (Render.com)
```

---

## 💡 Recomendación

**Para tu caso, recomiendo:**

1. ✅ **Dashboard HTML** (ya lo tienes) - Simple y funcional
2. ⚠️ **Grafana en Render.com** - Opcional, más complejo pero más potente

**Ventajas de Grafana:**
- ✅ Visualizaciones más avanzadas
- ✅ Múltiples paneles y dashboards
- ✅ Alertas automáticas
- ✅ Análisis más profundos

**Desventajas:**
- ⚠️ Requiere configuración adicional
- ⚠️ Puede dormirse en plan gratuito
- ⚠️ Necesita plugins o configuración de API REST

---

## 📚 Recursos Adicionales

- **Documentación de Grafana**: https://grafana.com/docs/
- **Grafana Dashboards**: https://grafana.com/grafana/dashboards/
- **Render.com Docs**: https://render.com/docs
- **Comparación de Servicios**: [COMPARACION-SERVICIOS.md](COMPARACION-SERVICIOS.md) ⭐ Nuevo

---

## ❓ Pregunta Frecuente

### ¿Es el mismo repositorio pero con diferentes variables de entorno?

**✅ Sí, pero con más detalles:**

- ✅ **Mismo repositorio**: Ambos servicios apuntan al mismo GitHub/GitLab
- ❌ **Dockerfile diferente**: API usa `Dockerfile`, Grafana usa `Dockerfile.grafana`
- ❌ **Variables diferentes**: Cada servicio tiene sus propias variables en Render.com
- ❌ **Servicios separados**: Son 2 servicios independientes en Render.com

**Para más detalles, consulta: [COMPARACION-SERVICIOS.md](COMPARACION-SERVICIOS.md)**

---

**¿Necesitas ayuda con algún paso específico?** Puedo ayudarte a configurar Grafana paso a paso.

