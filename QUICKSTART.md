# ⚡ Inicio Rápido - Word Impostor

¿Primera vez aquí? Esta guía te ayudará a ejecutar el juego en **menos de 5 minutos**.

## 🎯 Requisitos Previos

- ✅ Node.js v14+ instalado ([Descargar aquí](https://nodejs.org/))
- ✅ npm (viene con Node.js)
- ✅ Conexión a internet

## 🚀 Opción 1: Script Automático (Más Fácil)

### Linux/Mac

```bash
cd WordImpostor
./START.sh
```

Si recibes un error de permisos:
```bash
chmod +x START.sh
./START.sh
```

### Windows

Doble clic en `START.bat` o ejecuta en terminal:

```cmd
START.bat
```

¡Listo! El script instalará las dependencias (si es necesario) e iniciará automáticamente el servidor y el cliente.

## 🎮 Opción 2: Manual (Más Control)

### Paso 1: Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm run install-all

# O manualmente
cd server && npm install
cd ../client && npm install
```

### Paso 2: Iniciar Servidor

En una terminal:

```bash
cd server
npm start
```

Deberías ver: `Servidor escuchando en puerto 3001`

### Paso 3: Iniciar Cliente

En otra terminal:

```bash
cd client
npm start
```

El navegador se abrirá automáticamente en `http://localhost:3000`

## 📱 Cómo Jugar

1. **Abre el navegador** en `http://localhost:3000`

2. **Ingresa tu nombre** y haz clic en:
   - **"Crear Sala"** → Serás el host
   - **"Unirse a Sala"** → Ingresa el código de 6 dígitos

3. **Comparte el código** con tus amigos (aparece en la parte superior)

4. **El host inicia el juego** cuando todos estén listos (mínimo 2 jugadores)

5. **Sigue las instrucciones en pantalla**:
   - Un jugador elige la palabra secreta
   - Todos ven sus roles (Crewmate o Impostor)
   - Cada uno da pistas en su turno
   - Voten al sospechoso
   - ¡Ganen!

## 🌐 Jugar en Red Local (Móviles)

Para jugar con amigos en tu misma WiFi:

### Encuentra tu IP local

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# O
hostname -I
```

**Windows:**
```cmd
ipconfig
```

Busca algo como: `192.168.1.100`

### Comparte la URL

En lugar de `localhost:3000`, comparte:
```
http://192.168.1.100:3000
```

Tus amigos podrán unirse desde sus móviles escaneando el código QR o ingresando la URL.

## 🔧 Solución de Problemas Rápida

### "Puerto en uso"

**Puerto 3000 ocupado:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Puerto 3001 ocupado:**
- Cambia el puerto en `server/.env`:
  ```
  PORT=3002
  ```
- Actualiza `client/.env`:
  ```
  REACT_APP_SERVER_URL=http://localhost:3002
  ```

### "Cannot connect to server"

1. Verifica que el servidor esté corriendo (deberías ver el mensaje en la terminal)
2. Verifica la URL en `client/.env`
3. Recarga la página del navegador

### "Dependencias no instaladas"

```bash
# Limpiar todo y reinstalar
rm -rf client/node_modules server/node_modules
npm run install-all
```

### Error en Windows con permisos

Ejecuta PowerShell como administrador y luego:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 📚 Más Información

- 📖 **README.md** - Documentación completa
- ⚙️ **SETUP.md** - Configuración detallada
- 🚀 **DEPLOYMENT.md** - Desplegar en producción
- 📂 **PROJECT_STRUCTURE.md** - Estructura del código
- 🤝 **CONTRIBUTING.md** - Cómo contribuir

## 🎉 ¡A Jugar!

Una vez que todo esté corriendo:
- **Cliente**: http://localhost:3000
- **Servidor**: http://localhost:3001

Abre el cliente en múltiples pestañas o dispositivos para probar el juego multijugador.

## 💡 Tips

1. **Prueba con múltiples pestañas** en el mismo navegador para simular múltiples jugadores
2. **Usa Chrome DevTools** (F12) → Toggle device toolbar (Ctrl+Shift+M) para simular móviles
3. **Mínimo 2 jugadores** para empezar
4. **El impostor** no conoce la palabra, ¡debe adivinarla!
5. **Los crewmates** deben dar pistas sutiles sin revelar la palabra directamente

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona:
1. Lee los mensajes de error en la terminal
2. Revisa la consola del navegador (F12)
3. Consulta SETUP.md para más detalles
4. Abre un issue en GitHub

---

**¡Disfruta jugando Word Impostor! 🎭✨**


