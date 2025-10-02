# ✅ Checklist de Verificación - Word Impostor

Usa esta lista para verificar que todo esté correctamente instalado y funcionando.

## 📦 Archivos del Proyecto

### Backend (server/)
- [x] server.js - Servidor principal
- [x] package.json - Dependencias
- [x] Procfile - Config Heroku
- [ ] node_modules/ - (se crea al instalar)
- [ ] .env - (se crea automáticamente o manualmente)

### Frontend (client/)
- [x] src/App.js - Aplicación principal
- [x] src/index.js - Punto de entrada
- [x] src/index.css - Estilos
- [x] package.json - Dependencias
- [x] tailwind.config.js - Config Tailwind
- [ ] node_modules/ - (se crea al instalar)
- [ ] build/ - (se crea con npm run build)

### Componentes
- [x] GameLobby.jsx - Sala de espera
- [x] WordSelection.jsx - Selección de palabra
- [x] WordReveal.jsx - Revelación
- [x] GamePlay.jsx - Juego
- [x] VotingPhase.jsx - Votación
- [x] GameOver.jsx - Fin del juego

### Context
- [x] SocketContext.js - Socket.io
- [x] GameContext.js - Estado del juego

### Pages
- [x] Home.js - Inicio
- [x] JoinRoom.js - Unirse
- [x] GameRoom.js - Sala de juego

### Documentación
- [x] README.md
- [x] QUICKSTART.md
- [x] SETUP.md
- [x] DEPLOYMENT.md
- [x] PROJECT_STRUCTURE.md
- [x] CONTRIBUTING.md
- [x] LEEME.txt
- [x] CHECKLIST.md (este archivo)

### Scripts
- [x] START.sh (Linux/Mac)
- [x] START.bat (Windows)

## 🔧 Instalación

### 1. Node.js Instalado
```bash
node --version
# Debe mostrar v14.0.0 o superior
```
- [ ] Node.js v14+
- [ ] npm incluido

### 2. Dependencias del Servidor
```bash
cd server
npm install
```
Verifica que se creó `server/node_modules/`
- [ ] express instalado
- [ ] socket.io instalado
- [ ] Todas las dependencias instaladas

### 3. Dependencias del Cliente
```bash
cd client
npm install
```
Verifica que se creó `client/node_modules/`
- [ ] react instalado
- [ ] socket.io-client instalado
- [ ] tailwindcss instalado
- [ ] Todas las dependencias instaladas

### 4. Configuración
- [ ] Archivo `server/.env` existe (o se creará automáticamente)
- [ ] Puerto 3001 libre para el servidor
- [ ] Puerto 3000 libre para el cliente

## 🚀 Ejecución

### Servidor
```bash
cd server
npm start
```
Deberías ver:
```
Servidor escuchando en puerto 3001
```
- [ ] Servidor iniciado sin errores
- [ ] Mensaje "Servidor escuchando" visible

### Cliente
```bash
cd client
npm start
```
Deberías ver:
```
Compiled successfully!
```
Y el navegador debe abrirse en `http://localhost:3000`
- [ ] Cliente compilado sin errores
- [ ] Navegador abrió automáticamente
- [ ] Página visible sin errores 404

## 🎮 Funcionalidad

### Pantalla de Inicio
- [ ] Input de nombre funciona
- [ ] Botón "Crear Sala" habilitado
- [ ] Botón "Unirse a Sala" habilitado
- [ ] No hay errores en consola (F12)

### Crear Sala
1. Ingresa un nombre
2. Haz clic en "Crear Sala"
- [ ] Se crea la sala
- [ ] Se muestra código de 6 dígitos
- [ ] Apareces en la lista de jugadores
- [ ] Botón "Iniciar Juego" visible (deshabilitado si solo hay 1 jugador)

### Unirse a Sala
Abre otra pestaña o dispositivo:
1. Ingresa un nombre diferente
2. Haz clic en "Unirse a Sala"
3. Ingresa el código de la sala
- [ ] Se une a la sala correctamente
- [ ] Aparece en la lista de jugadores
- [ ] El host ve al nuevo jugador

### Iniciar Juego
Con al menos 2 jugadores:
1. El host hace clic en "Iniciar Juego"
- [ ] El juego inicia
- [ ] Todos los jugadores ven la transición
- [ ] Un jugador es elegido como Word Chooser

### Selección de Palabra
El Word Chooser:
1. Ve el input para la palabra
2. Ingresa una palabra (ej: "elefante")
3. Envía
- [ ] Palabra aceptada
- [ ] Todos los jugadores reciben su rol
- [ ] Crewmates ven la palabra
- [ ] Impostor ve mensaje de impostor

### Revelación
- [ ] Countdown de 10 segundos funciona
- [ ] Crewmates ven la palabra claramente
- [ ] Impostor ve su mensaje
- [ ] Transición a la primera ronda

### Ronda de Juego
- [ ] Orden aleatorio de jugadores mostrado
- [ ] Turno actual destacado
- [ ] Input aparece para el jugador en turno
- [ ] Timer de 30 segundos funciona
- [ ] Declaración se envía correctamente
- [ ] Siguiente jugador recibe su turno
- [ ] Al finalizar la ronda, se muestran todas las declaraciones

### Votación
- [ ] Fase de votación inicia
- [ ] Lista de jugadores votables
- [ ] Timer de 20 segundos funciona
- [ ] Voto se registra
- [ ] Confirmación de voto aparece
- [ ] Se procesa el resultado
- [ ] Jugador expulsado es anunciado
- [ ] Se revela si era impostor o no

### Fin de Juego
Continúa hasta que:
- [ ] Impostor es expulsado (Crewmates ganan)
- [ ] O quedan solo 2 jugadores (Impostor gana)
- [ ] Pantalla de victoria/derrota
- [ ] Se revela el impostor
- [ ] Se revela la palabra
- [ ] Botón "Jugar de Nuevo" funciona
- [ ] El juego se reinicia al lobby

## 🌐 Conexión

### WebSocket
- [ ] Conexión Socket.io establecida
- [ ] Mensajes en tiempo real funcionan
- [ ] Reconexión automática (desconecta WiFi y reconecta)

### Múltiples Dispositivos
- [ ] Abrir en 2+ pestañas funciona
- [ ] Abrir en 2+ dispositivos funciona
- [ ] Sincronización en tiempo real
- [ ] No hay lag notable

## 📱 Responsive

Prueba en diferentes tamaños:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile pequeño (320x568)

Verifica:
- [ ] No hay scroll horizontal
- [ ] Botones son táctiles (mínimo 44x44px)
- [ ] Texto legible (mínimo 16px)
- [ ] Inputs funcionan bien en móvil
- [ ] QR code se muestra correctamente

## 🐛 Consola

Abre DevTools (F12):
- [ ] No hay errores en consola (rojo)
- [ ] No hay warnings críticos
- [ ] Network muestra conexión WebSocket activa
- [ ] No hay errores 404

## ⚡ Rendimiento

- [ ] Página carga en menos de 3 segundos
- [ ] Transiciones son fluidas
- [ ] No hay congelamiento de UI
- [ ] Animaciones se ven bien

## 🔒 Seguridad

- [ ] Crewmates NO ven quién es el impostor
- [ ] Impostor NO ve la palabra secreta
- [ ] Votos son secretos hasta el conteo
- [ ] No se puede hacer trampa desde DevTools

## 🎨 UI/UX

- [ ] Colores son agradables
- [ ] Texto es legible
- [ ] Botones son obvios
- [ ] Feedback visual en acciones
- [ ] Notificaciones aparecen
- [ ] Animaciones no son molestas

## 📊 Resumen Final

Total de checks completados: _____ / _____

### Estado General
- [ ] 🟢 Todo funciona perfectamente
- [ ] 🟡 Funciona con problemas menores
- [ ] 🔴 Hay errores críticos

### Problemas Encontrados
(Lista aquí cualquier problema)

1. 
2. 
3. 

### Próximos Pasos
- [ ] Jugar una partida completa de prueba
- [ ] Probar con 5+ jugadores
- [ ] Probar reconexión
- [ ] Probar en dispositivos móviles reales

---

## 🆘 Si Algo No Funciona

1. **Lee QUICKSTART.md** para soluciones rápidas
2. **Revisa la consola** del navegador y terminal
3. **Reinstala dependencias**:
   ```bash
   rm -rf client/node_modules server/node_modules
   npm run install-all
   ```
4. **Consulta SETUP.md** para configuración detallada

---

**¡Marca todos los checks antes de considerar el proyecto completo!** ✅


