# 🌐 Jugar Word Impostor en Red Local

## 📱 Cómo jugar con amigos en la misma WiFi

### Paso 1: Iniciar el servidor

En tu computadora:

```bash
./START.sh
```

El servidor mostrará algo como:

```
🎭 Servidor Word Impostor escuchando en puerto 3001

📡 Accede al juego desde:
   - Local:    http://localhost:3001
   - Red local: http://10.2.69.186:3001
```

**Anota la IP de "Red local"** (ej: `10.2.69.186`)

### Paso 2: Compartir la URL

Comparte con tus amigos la URL del **cliente** (puerto 3000):

```
http://TU_IP:3000
```

Por ejemplo: `http://10.2.69.186:3000`

### Paso 3: Tus amigos acceden

Desde sus móviles/computadoras:

1. **Conectarse a la misma WiFi** que tu computadora
2. **Abrir el navegador** (Chrome, Safari, Firefox)
3. **Ir a** `http://TU_IP:3000` (la IP que anotaste)
4. **Ingresar su nombre** y unirse a la sala

## ✅ Detección Automática

¡Buenas noticias! El juego ahora detecta automáticamente la IP correcta:

- Si accedes desde `localhost:3000` → se conecta a `localhost:3001`
- Si accedes desde `10.2.69.186:3000` → se conecta a `10.2.69.186:3001`

**No necesitas configurar nada más.** Todo funciona automáticamente.

## 🔧 Solución de Problemas

### "Conectando al servidor..." (amarillo)

**Causa:** El móvil no puede conectarse al servidor

**Soluciones:**

1. **Verifica la WiFi:**
   - Todos deben estar en la **misma red WiFi**
   - No uses datos móviles, solo WiFi

2. **Firewall:**
   - En tu computadora, permite conexiones entrantes en el puerto 3001
   - Linux: `sudo ufw allow 3001`
   - Windows: Configuración → Firewall → Permitir app

3. **Verifica la IP:**
   ```bash
   # Linux/Mac
   hostname -I
   # o
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```
   Busca la IP que empiece con `192.168.` o `10.`

### No puedo conectarme desde mi móvil

1. **Usa HTTP, no HTTPS:**
   - Correcto: `http://10.2.69.186:3000`
   - Incorrecto: `https://10.2.69.186:3000`

2. **Ambos dispositivos en la misma red:**
   - No funciona si uno está en WiFi y otro en datos móviles
   - No funciona entre diferentes redes WiFi

3. **Verifica que el servidor esté corriendo:**
   - En tu computadora deberías ver logs en la terminal
   - Prueba primero en tu propia computadora en `localhost:3000`

## 🎮 Ejemplo de Uso Completo

### En tu computadora (Host):

```bash
cd WordImpostor
./START.sh
```

Output:
```
📡 Accede al juego desde:
   - Red local: http://10.2.69.186:3001
```

Tu cliente está en: `http://localhost:3000` o `http://10.2.69.186:3000`

### En los móviles de tus amigos:

1. Abrir navegador
2. Ir a: `http://10.2.69.186:3000`
3. Ingresar nombre
4. Unirse a sala con código

## 📊 Tabla de Puertos

| Puerto | Servicio | Descripción |
|--------|----------|-------------|
| 3000 | Cliente (React) | Interfaz del juego |
| 3001 | Servidor (Node.js) | Backend + Socket.io |

Ambos puertos deben estar accesibles en tu red local.

## 💡 Tips

1. **Comparte el código QR:**
   - En el lobby, haz clic en "Mostrar código QR"
   - Tus amigos lo escanean y se une automáticamente

2. **Prueba primero local:**
   - Antes de invitar amigos, prueba con 2 pestañas en tu computadora
   - Asegúrate de que todo funciona

3. **Red estable:**
   - Usa WiFi 5GHz si está disponible (más rápido)
   - Mantén los dispositivos cerca del router

## 🔒 Seguridad

**Para desarrollo/jugar con amigos:** Está configurado para permitir cualquier conexión (`origin: "*"`)

**Para producción:** Cambia en `server/server.js`:

```javascript
cors: {
  origin: "https://tu-dominio.com",  // Solo tu dominio
  methods: ["GET", "POST"],
  credentials: true
}
```

## 🌍 Jugar por Internet (no red local)

Para jugar con amigos que no están en tu WiFi, necesitas:

1. **Desplegar en internet:**
   - Backend en Heroku/Railway
   - Frontend en Vercel/Netlify
   - Ver `DEPLOYMENT.md`

2. **O usar ngrok (temporal):**
   ```bash
   ngrok http 3000
   ngrok http 3001
   ```
   Comparte las URLs públicas con tus amigos

---

¿Problemas? Abre la consola del navegador (F12) y revisa los errores.

