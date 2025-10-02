# 🎭 Word Impostor

**Word Impostor** es un juego multijugador de deducción social y asociación de palabras inspirado en Among Us. Diseñado para 2-10 jugadores en dispositivos móviles a través del navegador web.

## 📱 Características

- ✨ **Totalmente responsive** - Optimizado para móviles (iOS/Android)
- 🎮 **Multijugador en tiempo real** - Usando Socket.io
- 🎭 **Deducción social** - Identifica al impostor mediante pistas
- 📊 **Fácil de jugar** - Une con un código de 6 dígitos
- 🔄 **Reconexión automática** - Manejo gracioso de desconexiones

## 🎯 Cómo Jugar

### Mecánica del Juego

1. **Lobby**: El host crea una sala y comparte el código con los jugadores
2. **Asignación de roles**: 
   - Un jugador es el **Impostor** (no conoce la palabra)
   - Los demás son **Crewmates** (reciben la palabra secreta)
3. **Selección de palabra**: Un Crewmate elige la palabra secreta
4. **Rondas de pistas**: Cada jugador da una pista sobre la palabra
5. **Votación**: Todos votan para expulsar al sospechoso
6. **Victoria**:
   - **Crewmates ganan** si expulsan al impostor
   - **Impostor gana** si sobrevive hasta quedar 1v1

### Roles

- **👥 Crewmates**: Conocen la palabra secreta y deben dar pistas para identificar al impostor
- **🎭 Impostor**: No conoce la palabra y debe fingir que sí mientras intenta adivinarla

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn

### Configuración del Servidor

```bash
cd server
npm install
cp .env.example .env
# Edita .env si es necesario
npm start
```

El servidor se ejecutará en `http://localhost:3001`

### Configuración del Cliente

```bash
cd client
npm install
npm start
```

El cliente se ejecutará en `http://localhost:3000`

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Socket.io** - Comunicación en tiempo real
- **nanoid** - Generación de códigos de sala

### Frontend
- **React** - Librería de UI
- **React Router** - Navegación
- **Socket.io Client** - Cliente WebSocket
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **QRCode.react** - Generación de códigos QR

## 📁 Estructura del Proyecto

```
WordImpostor/
├── client/                 # Frontend React
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   └── src/
│       ├── components/     # Componentes del juego
│       │   ├── GameLobby.jsx
│       │   ├── WordSelection.jsx
│       │   ├── WordReveal.jsx
│       │   ├── GamePlay.jsx
│       │   ├── VotingPhase.jsx
│       │   └── GameOver.jsx
│       ├── context/        # Contextos React
│       │   ├── SocketContext.js
│       │   └── GameContext.js
│       ├── pages/          # Páginas principales
│       │   ├── Home.js
│       │   ├── JoinRoom.js
│       │   └── GameRoom.js
│       ├── App.js
│       ├── index.js
│       └── index.css
├── server/                 # Backend Node.js
│   ├── server.js          # Servidor principal
│   └── package.json
└── README.md
```

## 🎮 Eventos de Socket.io

### Eventos del Cliente → Servidor
- `join-room` - Unirse a una sala
- `start-game` - Iniciar el juego (solo host)
- `submit-word` - Enviar palabra secreta (word chooser)
- `submit-statement` - Enviar pista del turno
- `cast-vote` - Votar para expulsar
- `new-game` - Reiniciar juego

### Eventos del Servidor → Cliente
- `player-joined` - Jugador se unió
- `player-disconnected` - Jugador se desconectó
- `game-started` - Juego iniciado
- `word-reveal` - Revelar palabra/rol
- `round-started` - Nueva ronda
- `next-turn` - Siguiente turno
- `voting-started` - Iniciar votación
- `player-ejected` - Jugador expulsado
- `game-over` - Fin del juego
- `error` - Error

## 🌐 Despliegue

### Heroku (Servidor)

```bash
cd server
heroku create word-impostor-server
git push heroku main
```

### Vercel (Cliente)

```bash
cd client
vercel
```

Recuerda actualizar las variables de entorno:
- En el cliente: `REACT_APP_SERVER_URL`
- En el servidor: `CLIENT_URL`, `PORT`

## 🎨 Personalización

### Estilos
Los estilos están en `client/src/index.css` usando Tailwind CSS. Puedes modificar:
- Colores del tema en `tailwind.config.js`
- Animaciones personalizadas
- Componentes de UI

### Lógica del Juego
La lógica principal está en `server/server.js`:
- Modificar tiempos de espera
- Ajustar límites de jugadores
- Cambiar mecánicas de votación

## 🐛 Solución de Problemas

### El servidor no se conecta
- Verifica que el puerto 3001 esté disponible
- Revisa la configuración de CORS en `server.js`
- Comprueba las variables de entorno

### Los jugadores no pueden unirse
- Verifica que el código de sala sea correcto (6 caracteres)
- Asegúrate de que el servidor esté corriendo
- Comprueba la conexión de red

### Problemas de reconexión
- Los jugadores tienen 2 minutos para reconectarse
- Usa el mismo ID de jugador (almacenado en localStorage)

## 📝 Licencia

MIT License - Siéntete libre de usar y modificar este proyecto

## 👨‍💻 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🎉 Créditos

Inspirado en juegos de deducción social como Among Us y Spyfall.

## 📞 Soporte

Para reportar bugs o sugerir mejoras, abre un issue en el repositorio.

---

**¡Disfruta jugando Word Impostor! 🎭✨**


