# 🚀 DEPLOYMENT RÁPIDO - 5 Minutos

## Opción Más Fácil: Railway + Vercel (GRATIS)

### ⏱️ Tiempo total: ~5 minutos

---

## 🔵 PASO 1: Backend en Railway (2 min)

### 1. Ir a Railway
👉 **[railway.app](https://railway.app)** → Sign up con GitHub

### 2. Nuevo Proyecto
1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Selecciona **WordImpostor**
4. Railway empezará a deployar automáticamente

### 3. Configurar
Una vez que termine el deploy:

1. Click en tu servicio
2. **Settings** → **Root Directory** → Escribe: `server`
3. **Variables** → Click **"+ New Variable"**

Agrega estas 3 variables:

```
PORT = 3001
NODE_ENV = production
CLIENT_URL = (déjalo vacío por ahora)
```

4. **Settings** → **Networking** → **Generate Domain**
5. **Copia la URL** (ej: `https://word-impostor-production.up.railway.app`)

✅ Backend listo!

---

## 🟢 PASO 2: Frontend en Vercel (2 min)

### 1. Ir a Vercel
👉 **[vercel.com](https://vercel.com)** → Sign up con GitHub

### 2. Nuevo Proyecto
1. Click **"Add New..."** → **"Project"**
2. **Import** tu repo **WordImpostor**

### 3. Configurar
En la pantalla de configuración:

```
Framework Preset: Create React App
Root Directory: client
```

Click **"Environment Variables"** y agrega:

```
Name:  REACT_APP_SERVER_URL
Value: https://TU-URL-DE-RAILWAY.up.railway.app
       ↑ (pega la URL que copiaste de Railway)
```

4. Click **"Deploy"**

5. Espera 1-2 minutos...

6. **Copia la URL** de Vercel (ej: `https://word-impostor.vercel.app`)

✅ Frontend listo!

---

## 🔄 PASO 3: Conectar Ambos (1 min)

### Actualizar Railway con la URL de Vercel

1. Vuelve a **Railway**
2. **Variables**
3. **CLIENT_URL** → Pega la URL de Vercel (ej: `https://word-impostor.vercel.app`)
4. Railway se reiniciará automáticamente (30 segundos)

---

## 🎉 LISTO!

Abre tu juego en: **https://word-impostor.vercel.app**

Comparte esa URL con tus amigos. ¡Cualquiera puede jugar!

---

## ✅ Verificación Rápida

1. ✅ Railway muestra "Active" (verde)
2. ✅ Vercel muestra "Ready" (verde)
3. ✅ Abres la URL de Vercel y ves la pantalla de inicio
4. ✅ Puedes crear una sala
5. ✅ Un amigo puede unirse con el código

---

## 🐛 Si algo falla

### Railway muestra error:

1. **Deployments** → Ver logs
2. Verifica que **Root Directory = server**
3. Verifica las variables de entorno

### Vercel muestra error:

1. **Deployments** → Ver logs del build
2. Verifica que **Root Directory = client**
3. Verifica que `REACT_APP_SERVER_URL` esté correcta

### No se conecta:

1. Abre la **consola del navegador** (F12)
2. Busca errores de conexión
3. Verifica que ambas URLs sean **HTTPS**

---

## 📝 Resumen de URLs

Deberías tener:

```
✅ Backend (Railway):  https://word-impostor-production.up.railway.app
✅ Frontend (Vercel):  https://word-impostor.vercel.app

Variables en Railway:
  PORT = 3001
  NODE_ENV = production
  CLIENT_URL = https://word-impostor.vercel.app

Variables en Vercel:
  REACT_APP_SERVER_URL = https://word-impostor-production.up.railway.app
```

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push`:
- ✅ Vercel se actualiza automáticamente
- ✅ Railway se actualiza automáticamente

¡No necesitas hacer nada más!

---

## 💰 Límites Gratuitos

**Railway:** 500 horas/mes (suficiente para uso personal)  
**Vercel:** Ilimitado para proyectos personales

---

## 🎮 ¡A Compartir!

Ya puedes compartir tu juego:

```
🎭 Word Impostor
🌍 https://word-impostor.vercel.app

¡Únete y juega con amigos!
```

---

**¿Necesitas ayuda?** Revisa `DEPLOY_GUIDE.md` para más detalles.

