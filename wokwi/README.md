# 🎮 Simulación ESP32 + DHT22 en Wokwi

## Inicio Rápido

### 1. Abrir Wokwi
👉 **https://wokwi.com**

### 2. Crear Proyecto
- Click en "New Project"
- Selecciona "ESP32"

### 3. Cargar Archivos
Copia el contenido de estos archivos al proyecto en Wokwi:
- `esp32_dht22.ino` → Editor principal
- `diagram.json` → Agregar archivo
- `wokwi.toml` → Agregar archivo

### 4. Configurar Servidor
En `esp32_dht22.ino`, línea 31:
```cpp
// CAMBIAR ESTA URL:
const char* serverUrl = "http://192.168.1.100:3000/sensors/data";
```

**Opciones:**
- **Local:** `http://TU_IP_LOCAL:3000/sensors/data`
- **Render.com:** `https://tu-app.onrender.com/sensors/data`

### 5. Iniciar Simulación
- Click en ▶️ "Start Simulation"
- Abrir Serial Monitor (icono de terminal)
- Verificar que se envíen datos exitosamente

### 6. Ver Datos
- Abrir `dashboard.html` en el navegador
- Los datos del ESP32 aparecerán automáticamente

---

## 📁 Archivos

| Archivo | Descripción |
|---------|-------------|
| `esp32_dht22.ino` | Código Arduino |
| `diagram.json` | Circuito y conexiones |
| `wokwi.toml` | Bibliotecas requeridas |
| `libraries.txt` | Lista de bibliotecas |

---

## 🔌 Conexiones

```
DHT22 → ESP32
─────────────
VCC   → 3V3
DATA  → GPIO 15
GND   → GND
```

---

## 📊 Datos Enviados

```json
{
  "sensor_id": "dht22_01",
  "temperatura_c": 24.50,
  "humedad_pct": 60.20
}
```

---

## 🆘 Problemas Comunes

### ❌ Error HTTP
**Solución:** Verificar que el servidor esté corriendo y la URL sea correcta

### ❌ No lee el sensor
**Solución:** Detener y reiniciar la simulación

### ❌ No conecta WiFi
**Solución:** Usar credenciales: `Wokwi-GUEST` (sin contraseña)

---

## 📚 Documentación Completa

Ver **[WOKWI-ESP32.md](../WOKWI-ESP32.md)** para guía detallada.

---

## 🎯 Tips

1. Usa tu IP local (no `localhost`) para desarrollo local
2. Ajusta temperatura/humedad clickeando en el sensor DHT22
3. Observa el Serial Monitor para debug
4. Puedes tener múltiples pestañas de Wokwi ejecutándose

---

**¡Disfruta la simulación!** 🚀

