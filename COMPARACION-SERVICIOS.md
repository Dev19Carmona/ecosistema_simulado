# 📊 Comparación: API vs Grafana en Render.com

Esta guía explica las diferencias y similitudes entre los dos servicios en Render.com.

---

## 🎯 Resumen Rápido

| Aspecto | API NestJS | Grafana |
|---------|------------|---------|
| **Repositorio** | ✅ Mismo | ✅ Mismo |
| **Dockerfile** | `Dockerfile` | `Dockerfile.grafana` |
| **Variables de entorno** | Diferentes | Diferentes |
| **Servicio en Render** | Separado | Separado |
| **URL** | `https://ecosistema-simulado.onrender.com` | `https://ecosistema-grafana.onrender.com` |

---

## 📁 Repositorio

### ✅ Mismo Repositorio

Ambos servicios apuntan al **mismo repositorio de GitHub/GitLab**:

```
tu-repositorio/
├── Dockerfile              ← Usado por API NestJS
├── Dockerfile.grafana      ← Usado por Grafana
├── src/                    ← Código de la API
├── public/                 ← Dashboard HTML
└── ...
```

**Ventajas:**
- ✅ Un solo repositorio para mantener
- ✅ Cambios en un solo lugar
- ✅ Fácil de sincronizar

---

## 🐳 Dockerfile

### ❌ Dockerfiles Diferentes

Cada servicio usa un Dockerfile diferente:

#### API NestJS
- **Dockerfile**: `Dockerfile`
- **Contenido**: Construye la aplicación NestJS
- **Resultado**: Servidor Node.js con la API

#### Grafana
- **Dockerfile**: `Dockerfile.grafana`
- **Contenido**: Imagen base de Grafana
- **Resultado**: Servidor Grafana

**En Render.com, configuras:**
- **API**: Dockerfile Path = `Dockerfile`
- **Grafana**: Dockerfile Path = `Dockerfile.grafana`

---

## 🔧 Variables de Entorno

### ❌ Variables Diferentes

Cada servicio tiene sus propias variables de entorno en Render.com:

#### API NestJS - Variables de Entorno

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Para guardar datos |
| `PORT` | (auto) | Render asigna automáticamente |
| `SIMULATOR_SENSOR_ID` | `proximidad_01` | (opcional) |
| `SIMULATOR_INTERVAL_MS` | `5000` | (opcional) |

#### Grafana - Variables de Entorno

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `GF_SECURITY_ADMIN_USER` | `admin` | Usuario de Grafana |
| `GF_SECURITY_ADMIN_PASSWORD` | `tu-password` | Contraseña de Grafana |
| `MONGODB_URI` | `mongodb+srv://...` | Para leer datos (puede ser la misma) |
| `GF_SERVER_ROOT_URL` | `https://...` | URL del servicio Grafana |
| `PORT` | (auto) | Render asigna automáticamente |

**Nota sobre MONGODB_URI:**
- Puedes usar la **misma** `MONGODB_URI` en ambos servicios
- Ambos acceden a la misma base de datos MongoDB Atlas
- La API **escribe** datos, Grafana **lee** datos

---

## 🚀 Servicios en Render.com

### ❌ Servicios Separados

En Render.com, creas **2 servicios separados**:

1. **Servicio 1: API NestJS**
   - Name: `ecosistema-simulado`
   - URL: `https://ecosistema-simulado.onrender.com`
   - Dockerfile: `Dockerfile`
   - Variables: (ver arriba)

2. **Servicio 2: Grafana**
   - Name: `ecosistema-grafana`
   - URL: `https://ecosistema-grafana.onrender.com`
   - Dockerfile: `Dockerfile.grafana`
   - Variables: (ver arriba)

**Cada servicio:**
- ✅ Tiene su propia URL
- ✅ Tiene sus propias variables de entorno
- ✅ Se puede dormir/despertar independientemente
- ✅ Tiene sus propios logs

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────┐
│     Mismo Repositorio (GitHub)         │
│                                         │
│  ├── Dockerfile (API)                  │
│  ├── Dockerfile.grafana (Grafana)      │
│  └── src/ (código API)                 │
└─────────────────────────────────────────┘
              │
              ├──────────────┬──────────────┘
              │              │
              ▼              ▼
    ┌─────────────┐  ┌─────────────┐
    │ Servicio 1  │  │ Servicio 2  │
    │ API NestJS  │  │   Grafana   │
    │ (Render)    │  │  (Render)   │
    └──────┬──────┘  └──────┬──────┘
           │                │
           │ MONGODB_URI    │ MONGODB_URI
           │ (misma)        │ (misma)
           ▼                ▼
    ┌──────────────────────────────┐
    │    MongoDB Atlas            │
    │  (Base de datos compartida) │
    └──────────────────────────────┘
```

---

## 💡 Preguntas Frecuentes

### ¿Puedo usar la misma MONGODB_URI?

**✅ Sí**, puedes usar la misma `MONGODB_URI` en ambos servicios:
- La API **escribe** datos en MongoDB
- Grafana **lee** datos de MongoDB
- Ambos acceden a la misma base de datos: `ecosistema_simulado`
- Ambos acceden a la misma colección: `sensordatas`

### ¿Necesito hacer push dos veces?

**❌ No**, solo necesitas hacer push **una vez**:
- Ambos servicios apuntan al mismo repositorio
- Cuando haces push, ambos servicios se actualizan automáticamente
- Render.com detecta cambios y reconstruye ambos servicios

### ¿Puedo tener diferentes ramas?

**✅ Sí**, puedes configurar diferentes ramas:
- API: Branch = `main`
- Grafana: Branch = `main` (o `develop`, etc.)
- Cada servicio puede apuntar a la rama que quieras

### ¿Cuánto cuesta?

**Plan Free (Gratis):**
- ✅ 2 servicios gratuitos
- ⚠️ Ambos pueden dormirse después de 15 min
- ⚠️ Primera carga puede tardar 30-60 segundos

**Plan Starter ($7/mes por servicio):**
- API: $7/mes
- Grafana: $7/mes
- Total: $14/mes (sin dormir)

---

## 📝 Resumen

### ✅ Lo que es igual:
- Repositorio (mismo GitHub/GitLab)
- MONGODB_URI (puede ser la misma)
- Branch (puede ser la misma)

### ❌ Lo que es diferente:
- Dockerfile (`Dockerfile` vs `Dockerfile.grafana`)
- Variables de entorno (cada servicio tiene las suyas)
- Servicios en Render.com (2 servicios separados)
- URLs (diferentes URLs para cada servicio)

---

## 🎯 Conclusión

**Sí, es el mismo repositorio, pero:**
- ✅ Usa Dockerfiles diferentes
- ✅ Tiene variables de entorno diferentes
- ✅ Son servicios separados en Render.com

**Ventajas:**
- ✅ Un solo repositorio para mantener
- ✅ Fácil de sincronizar cambios
- ✅ Ambos servicios comparten la misma base de datos

**Desventajas:**
- ⚠️ Dos servicios que mantener
- ⚠️ Dos URLs diferentes
- ⚠️ Posible costo si usas plan de pago

---

¿Tienes más preguntas sobre cómo funcionan los servicios? Puedo ayudarte a configurarlos.

