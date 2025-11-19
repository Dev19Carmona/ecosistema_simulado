# 🔧 Troubleshooting: Grafana muestra el Dashboard HTML

Si cuando accedes a la URL de Grafana ves el mismo dashboard HTML de la API, significa que Render.com está usando el Dockerfile incorrecto.

---

## 🔍 Diagnóstico

### Síntoma
- Accedes a: `https://ecosistema-grafana.onrender.com`
- Ves: El dashboard HTML (igual que en la API)
- Deberías ver: La pantalla de login de Grafana

### Causa
Render.com está usando `Dockerfile` (de la API) en lugar de `Dockerfile.grafana`.

---

## ✅ Solución

### Paso 1: Verificar Configuración en Render.com

1. Ve a tu servicio de Grafana en Render.com
2. Click en **"Settings"** (Configuración)
3. Busca la sección **"Build & Deploy"**
4. Verifica el campo **"Dockerfile Path"**:
   - ❌ **Incorrecto**: `Dockerfile` o vacío
   - ✅ **Correcto**: `Dockerfile.grafana`

### Paso 2: Corregir Dockerfile Path

1. En **"Settings"** → **"Build & Deploy"**
2. Cambia **"Dockerfile Path"** a: `Dockerfile.grafana`
3. Click en **"Save Changes"**
4. Render.com reconstruirá automáticamente el servicio

### Paso 3: Esperar el Rebuild

- Tiempo estimado: 5-10 minutos
- Puedes ver el progreso en la pestaña **"Events"** o **"Logs"**

### Paso 4: Verificar

Una vez reconstruido:
1. Accede a: `https://ecosistema-grafana.onrender.com`
2. Deberías ver: **Pantalla de login de Grafana** (no el dashboard HTML)
3. Login con:
   - Usuario: `admin`
   - Contraseña: La que configuraste en `GF_SECURITY_ADMIN_PASSWORD`

---

## 📋 Checklist de Configuración

Verifica que tu servicio de Grafana tenga:

### ✅ Configuración Básica
- [ ] **Name**: `ecosistema-grafana` (o similar)
- [ ] **Runtime**: `Docker`
- [ ] **Branch**: `main` (o tu rama)

### ✅ Build & Deploy
- [ ] **Dockerfile Path**: `Dockerfile.grafana` ⚠️ **CRÍTICO**
- [ ] **Build Command**: Vacío
- [ ] **Start Command**: Vacío

### ✅ Variables de Entorno
- [ ] `GF_SECURITY_ADMIN_USER`: `admin`
- [ ] `GF_SECURITY_ADMIN_PASSWORD`: (tu contraseña)
- [ ] `MONGODB_URI`: (tu connection string)
- [ ] `GF_SERVER_ROOT_URL`: `https://ecosistema-grafana.onrender.com`

---

## 🐛 Problemas Comunes

### Problema 1: "Dockerfile Path" está vacío o es "Dockerfile"

**Solución:**
1. Cambia a `Dockerfile.grafana` en Settings
2. Guarda y espera el rebuild

### Problema 2: El servicio no reconstruye después de cambiar

**Solución:**
1. Ve a **"Manual Deploy"** → **"Clear build cache & deploy"**
2. O haz un pequeño cambio en el repositorio y push

### Problema 3: Sigue mostrando el dashboard HTML

**Solución:**
1. Verifica los logs en Render.com:
   - Ve a **"Logs"** tab
   - Busca mensajes como "Grafana server is running"
   - Si ves "API NestJS ejecutándose", está usando el Dockerfile incorrecto
2. Verifica que `Dockerfile.grafana` exista en el repositorio
3. Verifica que esté en la rama correcta (`main`)

### Problema 4: Error 404 o página en blanco

**Solución:**
1. Espera 30-60 segundos (el servicio puede estar dormido)
2. Verifica que el servicio esté "Live" en Render.com
3. Revisa los logs para ver errores

---

## 🔍 Verificación Rápida

### ¿Cómo saber si está usando el Dockerfile correcto?

**En los Logs de Render.com, deberías ver:**

✅ **Correcto (Grafana):**
```
INFO: Starting Grafana
INFO: Grafana server is running
```

❌ **Incorrecto (API NestJS):**
```
🚀 API NestJS ejecutándose en http://localhost:3000
📊 Dashboard disponible en http://localhost:3000/dashboard.html
```

---

## 📝 Resumen

**El problema:** Render.com usa `Dockerfile` en lugar de `Dockerfile.grafana`

**La solución:**
1. Ve a Settings → Build & Deploy
2. Cambia "Dockerfile Path" a `Dockerfile.grafana`
3. Guarda y espera el rebuild
4. Verifica que veas la pantalla de login de Grafana

---

**¿Sigue sin funcionar?** Revisa los logs en Render.com y compárteme qué ves.

