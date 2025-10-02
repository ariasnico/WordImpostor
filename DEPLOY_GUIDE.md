# 🚀 Guía de Deployment - Word Impostor

## Desplegar en Internet (Gratis)

### 📦 Lo que vamos a usar:

- **Backend:** Railway (gratis, 500 horas/mes)
- **Frontend:** Vercel (gratis, ilimitado)

---

## 🔧 PASO 1: Preparar GitHub

### 1.1 Hacer Push del Código

```bash
cd /home/nico/Desktop/WordImpostor
git add -A
git commit -m "Ready for deployment"
git push origin main
```

Si no has pusheado aún, hazlo ahora.

---

## 🚂 PASO 2: Deploy del Backend (Railway)

### 2.1 Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Start a New Project"**
3. Conecta con GitHub

### 2.2 Deploy del Servidor

1. **New Project** → **Deploy from GitHub repo**
2. Selecciona tu repositorio: `WordImpostor`
3. Railway detectará automáticamente que es Node.js

### 2.3 Configurar Variables de Entorno

En Railway:

1. Ve a tu proyecto → **Variables**
2. Agrega estas variables:

```
PORT=3001
NODE_ENV=production
CLIENT_URL=https://tu-app.vercel.app
```

(Por ahora deja `CLIENT_URL` vacío, lo actualizaremos después)

### 2.4 Configurar Root Directory

En Railway:

1. **Settings** → **Service Settings**
2. **Root Directory:** `server`
3. **Start Command:** `node server.js`

### 2.5 Obtener URL del Backend

1. Railway generará una URL automáticamente
2. En **Settings** → **Networking** → **Public Networking**
3. Anota la URL (ej: `https://word-impostor-production.up.railway.app`)

---

## 🎨 PASO 3: Deploy del Frontend (Vercel)

### 3.1 Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. **Sign Up** con GitHub

### 3.2 Deploy del Cliente

1. **Add New Project**
2. **Import Git Repository** → Selecciona `WordImpostor`
3. Configurar:

```
Framework Preset: Create React App
Root Directory: client
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### 3.3 Variables de Entorno

En Vercel:

1. **Settings** → **Environment Variables**
2. Agrega:

```
Name: REACT_APP_SERVER_URL
Value: https://tu-backend-railway.up.railway.app
```

(Usa la URL que obtuviste de Railway)

### 3.4 Re-deploy

1. **Deployments** → Click en el último deployment → **Redeploy**
2. Espera a que termine

### 3.5 Obtener URL del Frontend

Vercel te da una URL como: `https://word-impostor.vercel.app`

---

## 🔄 PASO 4: Actualizar CORS

Ahora que tienes ambas URLs, actualiza Railway:

1. Ve a Railway → **Variables**
2. Actualiza `CLIENT_URL`:

```
CLIENT_URL=https://word-impostor.vercel.app
```

3. Railway se reiniciará automáticamente

---

## ✅ PASO 5: Verificar

1. Abre tu app en Vercel: `https://word-impostor.vercel.app`
2. Crea una sala
3. Comparte el código con un amigo
4. ¡A jugar!

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to server"

**Causa:** CORS o URL incorrecta

**Solución:**
1. Verifica que `REACT_APP_SERVER_URL` en Vercel apunte a Railway
2. Verifica que `CLIENT_URL` en Railway apunte a Vercel
3. Ambas URLs deben ser HTTPS

### Error: "Application Error" en Railway

**Causa:** Variables de entorno o código incorrecto

**Solución:**
1. Railway → **Deployments** → Ver logs
2. Verifica que `ROOT_DIRECTORY=server`
3. Verifica que las variables estén configuradas

### El frontend no carga

**Causa:** Build falló

**Solución:**
1. Vercel → **Deployments** → Ver logs
2. Verifica que `Root Directory=client`
3. Asegúrate de que `npm run build` funcione localmente

---

## 🎯 Resumen de URLs

Al final tendrás:

```
Backend:  https://word-impostor-production.up.railway.app
Frontend: https://word-impostor.vercel.app
```

¡Comparte la URL del frontend con tus amigos!

---

## 💡 Tips

1. **Nombres personalizados:**
   - Vercel: Settings → Domains → Add custom domain
   - Railway: Settings → Networking → Custom domain

2. **Monitoreo:**
   - Railway tiene logs en tiempo real
   - Vercel muestra analytics

3. **Updates:**
   - Haz push a `main` y ambos se actualizan automáticamente

---

## 🆓 Límites Gratuitos

**Railway:**
- 500 horas/mes
- $5 de crédito gratis cada mes
- Suficiente para un juego personal

**Vercel:**
- 100GB bandwidth/mes
- Deploy ilimitados
- Perfecto para frontend

---

## 🔒 Seguridad en Producción

Una vez deployado, actualiza `server/server.js`:

```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,  // Solo tu dominio de Vercel
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

Esto está listo en el código, solo necesitas configurar `CLIENT_URL` en Railway.

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Railway y Vercel
2. Verifica las variables de entorno
3. Prueba en localhost primero

¡Listo para compartir con el mundo! 🌍🎮

