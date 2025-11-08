# ⚡ Inicio Rápido

## 🚀 Método 1: Inicio Automático (Recomendado)

### 🎯 Un Solo Comando

Doble clic en: **`iniciar-proyecto.bat`**

Esto iniciará automáticamente:
- ✅ API NestJS (puerto 3000)
- ✅ Dashboard (puerto 3001)
- ✅ Simulador de sensores

Luego doble clic en: **`abrir-dashboard.bat`**

---

## 🚀 Método 2: Inicio Manual (4 Pasos)

### 1️⃣ Terminal 1 - API NestJS

```bash
npm run start:dev
```

Espera a ver: `🚀 API NestJS ejecutándose en http://localhost:3000`

### 2️⃣ Terminal 2 - Dashboard

```bash
node server-dashboard.js
```

Espera a ver: `📊 Dashboard disponible en http://localhost:3001`

### 3️⃣ Terminal 3 - Simulador

```bash
node simulator.js
```

Deberías ver los datos enviándose cada 5 segundos ✅

### 4️⃣ Abrir Dashboard

Navega a: **http://localhost:3001**

---

## 📊 Ver los Datos

**Opción A: Dashboard Visual** (Recomendado)
- http://localhost:3001

**Opción B: API REST**
- http://localhost:3000/sensors/data
- http://localhost:3000/sensors/stats

**Opción C: MongoDB Atlas**
- https://cloud.mongodb.com
- Browse Collections → ecosistema_simulado → sensordatas

---

## ✅ ¡Listo!

Ahora deberías ver:
- ✅ API NestJS corriendo (puerto 3000)
- ✅ Dashboard corriendo (puerto 3001)
- ✅ Simulador enviando datos
- ✅ Gráficos actualizándose en tiempo real

---

## 📚 Más Información

Ver **README.md** para documentación completa.

