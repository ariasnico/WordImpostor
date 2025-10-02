# 🚀 Guía de Configuración Rápida - Word Impostor

## Instalación Rápida (Recomendada)

### Opción 1: Instalación Automática

Desde la raíz del proyecto:

```bash
npm install
npm run install-all
```

Esto instalará todas las dependencias del cliente y servidor automáticamente.

### Opción 2: Instalación Manual

#### 1. Instalar dependencias del servidor

```bash
cd server
npm install
```

#### 2. Instalar dependencias del cliente

```bash
cd ../client
npm install
```

## ⚙️ Configuración

### Variables de Entorno

#### Servidor (`server/.env`)

Ya está configurado por defecto, pero puedes modificarlo:

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

#### Cliente (`client/.env`)

Ya está configurado por defecto:

```env
REACT_APP_SERVER_URL=http://localhost:3001
```

## 🎮 Ejecución

### Desarrollo (Recomendado)

Desde la raíz del proyecto, ejecuta ambos servicios simultáneamente:

```bash
npm run dev
```

Esto iniciará:
- Servidor en `http://localhost:3001`
- Cliente en `http://localhost:3000`

### Ejecución Separada

#### Iniciar solo el servidor:

```bash
npm run start-server
# o
cd server && npm start
```

#### Iniciar solo el cliente:

```bash
npm run start-client
# o
cd client && npm start
```

## 📱 Cómo Jugar

1. Abre `http://localhost:3000` en tu navegador móvil o de escritorio
2. Ingresa tu nombre
3. Crea una sala (serás el host) o únete con un código
4. Comparte el código de 6 dígitos con tus amigos
5. El host inicia el juego cuando todos estén listos
6. ¡Disfruta jugando!

## 🔧 Solución de Problemas

### Error: "Puerto 3000 ya en uso"

Si el puerto 3000 está ocupado:

```bash
# En Linux/Mac
kill -9 $(lsof -ti:3000)

# En Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

O cambia el puerto del cliente editando el script en `client/package.json`.

### Error: "Puerto 3001 ya en uso"

Cambia el puerto en `server/.env` y actualiza `REACT_APP_SERVER_URL` en `client/.env`.

### Error: "Cannot connect to server"

1. Verifica que el servidor esté corriendo en el puerto correcto
2. Revisa la consola del servidor para ver si hay errores
3. Comprueba que `REACT_APP_SERVER_URL` apunte a la URL correcta
4. Desactiva temporalmente el firewall/antivirus

### Error al instalar dependencias

Si hay problemas con `node-gyp` o compilación:

```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules
rm -rf client/node_modules server/node_modules

# Reinstalar
npm run install-all
```

## 🌐 Despliegue en Producción

### Backend (Heroku)

```bash
cd server
heroku create your-app-name
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

No olvides configurar las variables de entorno en Heroku:

```bash
heroku config:set CLIENT_URL=https://your-client-url.vercel.app
```

### Frontend (Vercel)

```bash
cd client
npm run build
vercel --prod
```

O conecta tu repositorio de GitHub con Vercel para despliegue automático.

Actualiza `REACT_APP_SERVER_URL` en Vercel con la URL de tu servidor Heroku.

## 📋 Checklist de Configuración

- [ ] Node.js instalado (v14+)
- [ ] Dependencias del servidor instaladas
- [ ] Dependencias del cliente instaladas
- [ ] Archivo `.env` configurado en server/
- [ ] Servidor corriendo en puerto 3001
- [ ] Cliente corriendo en puerto 3000
- [ ] Navegador abierto en localhost:3000
- [ ] Múltiples dispositivos conectados a la misma red (para pruebas locales)

## 🎉 ¡Listo!

Ahora puedes empezar a jugar Word Impostor con tus amigos. ¡Diviértete! 🎭

---

**Tip**: Para jugar con amigos en la misma red local, usa la IP local de tu computadora en lugar de localhost (ej: `http://192.168.1.100:3000`)


