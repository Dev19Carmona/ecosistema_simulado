# 🚀 Guía de Despliegue en Render.com con Docker

Esta guía te ayudará a desplegar el proyecto **Ecosistema Simulado** en Render.com usando Docker.

## ⚡ Respuesta Rápida: Build Command y Start Command

**Cuando usas Runtime: Docker en Render.com:**

| Campo | Valor |
|-------|-------|
| **Build Command** | ⚠️ **DEJAR VACÍO** |
| **Start Command** | ⚠️ **DEJAR VACÍO** |

**¿Por qué?** Render.com usa tu Dockerfile automáticamente:
- **Build**: Render ejecuta `docker build` usando tu Dockerfile
- **Start**: Render ejecuta el `CMD` del Dockerfile (`node dist/main.js`)

Si configuras estos comandos manualmente, interferirás con el proceso de Docker.

---

## 📋 Requisitos Previos

1. **Cuenta en Render.com** (gratis): https://render.com
2. **Repositorio Git** (GitHub, GitLab o Bitbucket)
3. **MongoDB Atlas** (gratis): https://www.mongodb.com/cloud/atlas
4. **Dockerfile** en la raíz del proyecto (ya incluido)

---

## 🎯 Pasos para Desplegar

### Paso 1: Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git y que el `Dockerfile` esté en la raíz:

```
ecosistema_simulado/
├── Dockerfile          ← Debe estar en la raíz
├── package.json
├── tsconfig.json
├── src/
└── ...
```

### Paso 2: Crear MongoDB Atlas (si no lo tienes)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (tier gratuito M0)
4. Crea un usuario de base de datos
5. Configura Network Access → Add IP → `0.0.0.0/0` (permitir desde cualquier IP)
6. Obtén la connection string:
   - Click en "Connect" → "Connect your application"
   - Copia la URI (formato: `mongodb+srv://user:password@cluster.mongodb.net/ecosistema_simulado`)

### Paso 3: Crear Web Service en Render.com

1. **Inicia sesión en Render.com**
   - Ve a https://dashboard.render.com
   - Conecta tu cuenta de GitHub/GitLab/Bitbucket

2. **Crear nuevo Web Service**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio
   - Selecciona el repositorio `ecosistema_simulado`

3. **Configuración del Servicio**

   **Información Básica:**
   - **Name**: `ecosistema-simulado` (o el nombre que prefieras)
   - **Region**: Elige la región más cercana (ej: `Oregon (US West)`)
   - **Branch**: `main` o `master` (tu rama principal)
   - **Root Directory**: Dejar vacío (raíz del proyecto)

   **Configuración de Build:**
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `Dockerfile` (o dejar vacío si está en la raíz)
   - **Docker Context**: Dejar vacío
   - **Build Command**: ⚠️ **DEJAR VACÍO** (Render.com usa el Dockerfile automáticamente)
   - **Start Command**: ⚠️ **DEJAR VACÍO** (Render.com usa el `CMD` del Dockerfile)

   ⚠️ **IMPORTANTE**: Cuando usas **Runtime: Docker**, NO debes configurar Build Command ni Start Command. Render.com:
   - Construye la imagen usando `docker build` con tu Dockerfile
   - Ejecuta el contenedor usando el comando `CMD` definido en el Dockerfile (`node dist/main.js`)

   **Configuración de Deploy:**
   - **Auto-Deploy**: `Yes` (se despliega automáticamente en cada push)

4. **Variables de Entorno** ⚠️ **CRÍTICO**

   **IMPORTANTE**: Esta es la configuración más importante. Sin `MONGODB_URI`, tu aplicación no funcionará.

   Click en "Advanced" → "Add Environment Variable" y agrega:

   | Key | Value | Requerido |
   |-----|-------|-----------|
   | `MONGODB_URI` | `mongodb+srv://usuario:password@cluster.mongodb.net/ecosistema_simulado?retryWrites=true&w=majority` | ✅ **SÍ - OBLIGATORIO** |
   | `PORT` | Render.com asigna automáticamente - **NO configures esta variable** | ❌ No |

   **Pasos detallados para obtener MONGODB_URI:**
   
   1. Ve a https://cloud.mongodb.com
   2. Inicia sesión en tu cuenta
   3. Selecciona tu cluster
   4. Click en **"Connect"**
   5. Selecciona **"Connect your application"**
   6. Copia la connection string (formato: `mongodb+srv://<username>:<password>@cluster.mongodb.net/`)
   7. Reemplaza `<password>` con tu contraseña real
   8. Agrega el nombre de la base de datos: `/ecosistema_simulado`
   9. Agrega los parámetros: `?retryWrites=true&w=majority`
   10. **Ejemplo completo**: `mongodb+srv://usuario:MiPassword123@cluster0.xxxxx.mongodb.net/ecosistema_simulado?retryWrites=true&w=majority`

   ⚠️ **Verificaciones importantes**: 
   - La URI debe comenzar con `mongodb+srv://` o `mongodb://`
   - No debe tener espacios al inicio o final
   - La contraseña no debe tener caracteres especiales sin codificar (usa % encoding si es necesario)
   - En MongoDB Atlas: Network Access → Asegúrate de permitir `0.0.0.0/0` (todas las IPs)
   - **NO configures PORT**: Render.com asigna automáticamente el puerto

5. **Plan y Crear**

   - **Plan**: `Free` (gratis, con limitaciones)
   - Click en "Create Web Service"

### Paso 4: Esperar el Build

Render.com automáticamente:
1. Clonará tu repositorio
2. Construirá la imagen Docker usando el `Dockerfile`
3. Desplegará el servicio
4. Te dará una URL pública (ej: `https://ecosistema-simulado.onrender.com`)

**Tiempo estimado**: 5-10 minutos para el primer deploy

### Paso 5: Verificar el Despliegue

Una vez que el servicio esté "Live", puedes verificar:

```bash
# Verificar que el servidor responde
curl https://tu-app.onrender.com/sensors/stats

# Deberías ver:
# {
#   "success": true,
#   "stats": {
#     "total_readings": 0,
#     ...
#   }
# }
```

---

## 🔧 Configuración Avanzada

### ¿Por qué no necesito Build Command ni Start Command?

Cuando usas **Runtime: Docker** en Render.com:

1. **Build Command**: Render.com ejecuta automáticamente `docker build` usando tu Dockerfile. No necesitas especificar un comando de build manual.

2. **Start Command**: Render.com ejecuta automáticamente el contenedor usando el comando `CMD` definido en tu Dockerfile (línea 52: `CMD ["node", "dist/main.js"]`). No necesitas especificar un comando de inicio manual.

**Si ves campos para Build Command o Start Command:**
- Déjalos **VACÍOS** cuando uses Docker
- Solo se usan cuando el Runtime es "Node" o "Nixpacks", NO con Docker

### Health Checks

El Dockerfile incluye un health check que Render.com puede usar:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/sensors/stats', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

### Variables de Entorno Adicionales

Si necesitas configurar el simulador para que apunte a tu URL de Render:

```bash
# En tu máquina local
export SERVER_HOST=tu-app.onrender.com
export SERVER_PORT=443
node simulator.js
```

### Logs en Render.com

Para ver los logs de tu aplicación:

1. Ve a tu servicio en Render.com
2. Click en "Logs"
3. Verás logs en tiempo real

---

## 🧪 Testing del Despliegue

### Test 1: Verificar API

```bash
curl https://tu-app.onrender.com/sensors/stats
```

### Test 2: Enviar Datos

```bash
curl -X POST https://tu-app.onrender.com/sensors/data \
  -H "Content-Type: application/json" \
  -d '{"sensor_id":"test_render","distancia_cm":42.5}'
```

### Test 3: Ver Datos

```bash
curl https://tu-app.onrender.com/sensors/data
```

### Test 4: Actualizar Simulador Local

El simulador ahora soporta HTTPS automáticamente. Simplemente usa variables de entorno:

```bash
SERVER_HOST=tu-app.onrender.com SERVER_PORT=443 node simulator.js
```

El simulador detectará automáticamente que el puerto 443 requiere HTTPS y usará el protocolo correcto.

**Alternativa con variable explícita:**
```bash
SERVER_HOST=tu-app.onrender.com SERVER_PORT=443 USE_HTTPS=true node simulator.js
```

**Nota**: El simulador ha sido actualizado para soportar HTTPS automáticamente cuando detecta el puerto 443.

---

## 🐛 Troubleshooting

### El servicio no inicia

**Problema**: Build falla o el servicio no arranca

**Solución**:
1. Verifica los logs en Render.com → "Logs"
2. Verifica que `MONGODB_URI` esté correctamente configurada
3. Verifica que el `Dockerfile` esté en la raíz del proyecto
4. Verifica que `package.json` tenga el script `build` (usado por el Dockerfile)
5. **Si configuraste Build Command o Start Command**: Déjalos vacíos cuando usas Docker

### Build Command / Start Command configurados incorrectamente

**Problema**: Has configurado Build Command o Start Command pero usas Runtime: Docker

**Síntomas**:
- El build falla con errores confusos
- El servicio no inicia correctamente
- Errores sobre comandos no encontrados

**Solución**:
1. Ve a la configuración de tu servicio en Render.com
2. En "Build Command": **Déjalo VACÍO**
3. En "Start Command": **Déjalo VACÍO**
4. Guarda los cambios y vuelve a desplegar

**Explicación**: 
- Con Runtime: Docker, Render.com usa el Dockerfile directamente
- El Dockerfile ya tiene el comando de build (`npm run build` en línea 21)
- El Dockerfile ya tiene el comando de inicio (`CMD ["node", "dist/main.js"]` en línea 52)
- Configurar Build/Start Command manualmente interfiere con el proceso de Docker

### Error de conexión a MongoDB

**Problema 1**: `MongoParseError: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"`

**Causa**: La variable `MONGODB_URI` no está configurada o está vacía en Render.com

**Solución**:
1. Ve a tu servicio en Render.com
2. Click en "Environment" en el menú lateral
3. Verifica que exista la variable `MONGODB_URI`
4. Si no existe, click en "Add Environment Variable":
   - Key: `MONGODB_URI`
   - Value: Tu connection string completa de MongoDB Atlas
5. **Formato correcto**: `mongodb+srv://usuario:password@cluster.mongodb.net/ecosistema_simulado?retryWrites=true&w=majority`
6. Guarda los cambios
7. Render.com reiniciará automáticamente el servicio

**Problema 2**: `MongooseError: connect ECONNREFUSED` o timeout

**Causa**: Problemas de red o credenciales incorrectas

**Solución**:
1. Verifica que `MONGODB_URI` esté correcta en Render.com (sin espacios, formato correcto)
2. Verifica que MongoDB Atlas permita conexiones desde `0.0.0.0/0`:
   - Ve a MongoDB Atlas → Network Access
   - Asegúrate de tener `0.0.0.0/0` en la lista (permite todas las IPs)
3. Verifica que el usuario y contraseña sean correctos
4. Verifica que el nombre del cluster sea correcto en la URI
5. Verifica que la base de datos exista (o se creará automáticamente)

### El servicio se duerme (Free Plan)

**Problema**: En el plan gratuito, Render.com "duerme" servicios inactivos después de 15 minutos

**Solución**:
1. La primera petición después de dormir puede tardar 30-60 segundos
2. Considera usar un servicio de "ping" periódico (ej: UptimeRobot)
3. O actualiza a un plan de pago

### Build tarda mucho

**Problema**: El build de Docker tarda más de 10 minutos

**Solución**:
1. Verifica que `.dockerignore` esté configurado correctamente
2. El multi-stage build debería optimizar el tiempo
3. Render.com cachea las capas de Docker entre builds

### Error de dependencias (ERESOLVE)

**Problema**: Error `npm error ERESOLVE unable to resolve dependency tree` relacionado con `@nestjs/config`

**Síntomas**:
```
npm error Could not resolve dependency:
npm error peer @nestjs/common@"^8.0.0 || ^9.0.0 || ^10.0.0" from @nestjs/config@3.3.0
```

**Solución**: 
✅ **Ya está corregido** en el proyecto:
- El Dockerfile usa `--legacy-peer-deps` en todos los comandos `npm ci`
- Esto permite instalar `@nestjs/config@3.3.0` aunque tenga peer dependencies incompatibles
- `@nestjs/config@3.3.0` funciona correctamente con NestJS 11 a pesar del warning de peer dependencies

**Explicación**:
- `@nestjs/config@3.3.0` declara que requiere NestJS 8-10, pero funciona con NestJS 11
- `--legacy-peer-deps` le dice a npm que ignore los conflictos de peer dependencies
- Esto es seguro porque la API de `@nestjs/config` no cambió entre versiones

Si aún tienes problemas:
1. Verifica que el Dockerfile use `--legacy-peer-deps` en las líneas 15 y 36
2. Verifica que `package.json` tenga `"@nestjs/config": "^3.3.0"`
3. Haz commit y push de los cambios

---

## 📊 Monitoreo

### Logs en Tiempo Real

Render.com proporciona logs en tiempo real:
- Ve a tu servicio → "Logs"
- Filtra por nivel (INFO, ERROR, WARN)

### Métricas

En el plan gratuito puedes ver:
- Uptime
- Response time
- Request count

### Alertas

Configura alertas en Render.com para:
- Servicio caído
- Errores frecuentes
- Alto uso de recursos

---

## 🔄 Actualizaciones Automáticas

Con **Auto-Deploy** habilitado:

1. Haz push a tu rama principal (main/master)
2. Render.com detecta el cambio
3. Automáticamente reconstruye y redespliega
4. El servicio se actualiza sin downtime

---

## 💰 Planes y Límites

### Plan Gratuito (Free)

- ✅ 750 horas/mes (suficiente para desarrollo)
- ✅ Sleep después de 15 min de inactividad
- ✅ 512 MB RAM
- ✅ Builds ilimitados
- ✅ SSL automático

### Plan Starter ($7/mes)

- ✅ Sin sleep
- ✅ 512 MB RAM
- ✅ Mejor rendimiento
- ✅ Soporte prioritario

---

## 📚 Recursos Adicionales

- **Documentación de Render.com**: https://render.com/docs
- **Docker en Render**: https://render.com/docs/docker
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

---

## ✅ Checklist de Despliegue

- [ ] Repositorio Git configurado
- [ ] Dockerfile en la raíz del proyecto
- [ ] MongoDB Atlas creado y configurado
- [ ] Variables de entorno configuradas en Render.com
- [ ] Servicio creado y desplegado
- [ ] API respondiendo correctamente
- [ ] Simulador actualizado para usar URL de Render (opcional)

---

**¡Listo!** Tu aplicación debería estar funcionando en Render.com 🚀

**URL de ejemplo**: `https://ecosistema-simulado.onrender.com`

