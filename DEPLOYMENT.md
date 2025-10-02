# 🌐 Guía de Despliegue - Word Impostor

Esta guía te ayudará a desplegar Word Impostor en producción usando servicios gratuitos.

## 🎯 Arquitectura de Despliegue

- **Backend (Servidor)**: Heroku o Railway
- **Frontend (Cliente)**: Vercel o Netlify

## 📦 Opción 1: Heroku (Backend) + Vercel (Frontend)

### Backend en Heroku

1. **Crear cuenta en Heroku**
   - Visita [heroku.com](https://heroku.com) y crea una cuenta

2. **Instalar Heroku CLI**
   ```bash
   # En Linux/Mac
   curl https://cli-assets.heroku.com/install.sh | sh
   
   # En Windows
   # Descarga desde https://devcenter.heroku.com/articles/heroku-cli
   ```

3. **Login y crear app**
   ```bash
   heroku login
   cd server
   git init
   heroku create word-impostor-server
   ```

4. **Configurar variables de entorno**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://tu-app.vercel.app
   ```

5. **Desplegar**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Verificar**
   ```bash
   heroku logs --tail
   heroku open
   ```

### Frontend en Vercel

1. **Crear cuenta en Vercel**
   - Visita [vercel.com](https://vercel.com) y crea una cuenta
   - Conecta tu cuenta de GitHub

2. **Instalar Vercel CLI** (opcional)
   ```bash
   npm install -g vercel
   ```

3. **Configurar el proyecto**
   - En el dashboard de Vercel, haz clic en "New Project"
   - Importa tu repositorio de GitHub
   - Framework Preset: **Create React App**
   - Root Directory: **client**

4. **Configurar variables de entorno**
   - En Vercel Dashboard → Settings → Environment Variables
   - Agregar: `REACT_APP_SERVER_URL` = `https://tu-app-heroku.herokuapp.com`

5. **Desplegar**
   - Vercel desplegará automáticamente desde GitHub
   - O manualmente:
   ```bash
   cd client
   vercel --prod
   ```

6. **Actualizar URL en Heroku**
   ```bash
   heroku config:set CLIENT_URL=https://tu-app.vercel.app
   ```

## 🚂 Opción 2: Railway (Backend) + Netlify (Frontend)

### Backend en Railway

1. **Crear cuenta en Railway**
   - Visita [railway.app](https://railway.app)

2. **Crear nuevo proyecto**
   - New Project → Deploy from GitHub repo
   - Selecciona tu repositorio
   - Root Directory: **server**

3. **Configurar variables de entorno**
   ```
   NODE_ENV=production
   PORT=3001
   CLIENT_URL=https://tu-app.netlify.app
   ```

4. **Desplegar**
   - Railway desplegará automáticamente

### Frontend en Netlify

1. **Crear cuenta en Netlify**
   - Visita [netlify.com](https://netlify.com)

2. **Nuevo sitio desde Git**
   - New site from Git → GitHub
   - Selecciona tu repositorio

3. **Configuración de build**
   ```
   Base directory: client
   Build command: npm run build
   Publish directory: client/build
   ```

4. **Variables de entorno**
   - Site settings → Build & deploy → Environment
   - Agregar: `REACT_APP_SERVER_URL` = `https://tu-app.railway.app`

5. **Desplegar**
   - Netlify desplegará automáticamente

## 🐳 Opción 3: Docker

### Dockerfile para el servidor

Crear `server/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

### Dockerfile para el cliente

Crear `client/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Crear `docker-compose.yml` en la raíz:

```yaml
version: '3.8'

services:
  server:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - CLIENT_URL=http://localhost:3000

  client:
    build: ./client
    ports:
      - "3000:80"
    depends_on:
      - server
```

Ejecutar:
```bash
docker-compose up -d
```

## 🔧 Configuración Post-Despliegue

### 1. Verificar CORS

Asegúrate de que el servidor permita peticiones desde el dominio del cliente:

```javascript
// server/server.js
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});
```

### 2. HTTPS

- Heroku y Railway proporcionan HTTPS automáticamente
- Vercel y Netlify también
- Asegúrate de usar URLs HTTPS en las variables de entorno

### 3. Dominios Personalizados

#### Heroku
```bash
heroku domains:add www.tu-dominio.com
```

#### Vercel
- Dashboard → Settings → Domains → Add

## 🧪 Testing en Producción

1. **Smoke Test**
   - Abre la URL del cliente
   - Crea una sala
   - Únete desde otro dispositivo
   - Juega una partida completa

2. **Monitoreo**
   - Heroku: `heroku logs --tail`
   - Vercel: Dashboard → Deployments → Logs
   - Railway: Dashboard → Logs

## ⚡ Optimizaciones

### Caché

Agregar headers de caché en el servidor:

```javascript
app.use(express.static('public', {
  maxAge: '1d'
}));
```

### Compresión

```bash
cd server
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### CDN

- Vercel y Netlify tienen CDN integrado
- Para Heroku, considera usar Cloudflare

## 🔒 Seguridad

1. **Variables de Entorno**
   - Nunca subas archivos `.env` al repositorio
   - Usa variables de entorno de la plataforma

2. **Rate Limiting**
   ```bash
   cd server
   npm install express-rate-limit
   ```

3. **Helmet.js**
   ```bash
   npm install helmet
   ```

## 📊 Monitoreo y Analytics

### Opciones Gratuitas

- **Sentry**: Tracking de errores
- **LogRocket**: Session replay
- **Google Analytics**: Analytics básico

## 🆘 Solución de Problemas

### Error: "WebSocket connection failed"

- Verifica que ambos servicios usen HTTPS
- Revisa la configuración de CORS
- Comprueba las variables de entorno

### Error: "Application Error" en Heroku

```bash
heroku logs --tail
```

Común: Falta el archivo `Procfile` o puerto incorrecto

### Build fallido en Vercel

- Revisa que `REACT_APP_SERVER_URL` esté configurado
- Verifica los logs de build
- Asegúrate de que `client/` tenga todas las dependencias

## 📝 Checklist de Despliegue

- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] Variables de entorno configuradas
- [ ] CORS configurado correctamente
- [ ] WebSockets funcionando
- [ ] Probado en múltiples dispositivos
- [ ] HTTPS habilitado
- [ ] Logs monitoreados
- [ ] Dominio personalizado (opcional)

## 🎉 ¡Listo!

Tu aplicación Word Impostor ahora está en producción. Comparte la URL con tus amigos y disfruta jugando.

---

**Nota**: Los servicios gratuitos pueden tener limitaciones:
- Heroku: Duerme después de 30 min de inactividad
- Railway: 500 horas gratis/mes
- Vercel: 100GB bandwidth/mes
- Netlify: 100GB bandwidth/mes

Para uso intensivo, considera planes pagos.


