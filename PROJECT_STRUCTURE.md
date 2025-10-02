# 📂 Estructura del Proyecto - Word Impostor

```
WordImpostor/
│
├── 📄 README.md                    # Documentación principal
├── 📄 SETUP.md                     # Guía de configuración
├── 📄 DEPLOYMENT.md                # Guía de despliegue
├── 📄 CONTRIBUTING.md              # Guía para contribuidores
├── 📄 PROJECT_STRUCTURE.md         # Este archivo
├── 📄 LICENSE                      # Licencia MIT
├── 📄 package.json                 # Scripts del proyecto raíz
├── 📄 .gitignore                   # Archivos ignorados por Git
├── 📄 vercel.json                  # Configuración de Vercel
├── 🚀 START.sh                     # Script de inicio (Linux/Mac)
└── 🚀 START.bat                    # Script de inicio (Windows)
│
├── 📁 server/                      # BACKEND (Node.js + Express + Socket.io)
│   ├── 📄 server.js               # Servidor principal con lógica del juego
│   ├── 📄 package.json            # Dependencias del servidor
│   ├── 📄 .env                    # Variables de entorno (no en Git)
│   ├── 📄 .env.example            # Plantilla de variables de entorno
│   ├── 📄 .gitignore              # Ignorar node_modules, .env, etc.
│   └── 📄 Procfile                # Configuración para Heroku
│
└── 📁 client/                      # FRONTEND (React + Tailwind + Socket.io Client)
    ├── 📁 public/
    │   ├── 📄 index.html          # HTML principal
    │   ├── 📄 manifest.json       # PWA manifest
    │   └── 📄 robots.txt          # SEO
    │
    ├── 📁 src/
    │   ├── 📁 components/         # Componentes del juego
    │   │   ├── 🎮 GameLobby.jsx     # Lobby de espera
    │   │   ├── ✏️ WordSelection.jsx # Selección de palabra secreta
    │   │   ├── 👁️ WordReveal.jsx    # Revelación de palabra/rol
    │   │   ├── 🎯 GamePlay.jsx      # Fase de juego (turnos)
    │   │   ├── 🗳️ VotingPhase.jsx   # Fase de votación
    │   │   └── 🏆 GameOver.jsx      # Pantalla de fin de juego
    │   │
    │   ├── 📁 context/            # Contextos de React
    │   │   ├── 🔌 SocketContext.js  # Gestión de Socket.io
    │   │   └── 🎮 GameContext.js    # Estado global del juego
    │   │
    │   ├── 📁 pages/              # Páginas principales
    │   │   ├── 🏠 Home.js           # Página de inicio
    │   │   ├── 🚪 JoinRoom.js       # Unirse a sala
    │   │   └── 🎮 GameRoom.js       # Sala de juego (orquestador)
    │   │
    │   ├── 📄 App.js              # Componente principal + Router
    │   ├── 📄 index.js            # Punto de entrada
    │   └── 🎨 index.css           # Estilos globales + Tailwind
    │
    ├── 📄 package.json            # Dependencias del cliente
    ├── 📄 .gitignore              # Ignorar node_modules, build, etc.
    ├── 📄 .env                    # Variables de entorno (no en Git)
    ├── 🎨 tailwind.config.js      # Configuración de Tailwind CSS
    └── 🎨 postcss.config.js       # Configuración de PostCSS
```

## 🗂️ Descripción de Archivos Clave

### Backend (`server/`)

#### `server.js` (Principal)
Contiene toda la lógica del juego:
- **Gestión de salas**: Crear, unirse, validar
- **Socket.io eventos**: join-room, start-game, submit-word, submit-statement, cast-vote, new-game
- **Lógica de juego**: 
  - Asignación aleatoria de impostor
  - Selección de word chooser
  - Manejo de turnos y rondas
  - Sistema de votación
  - Condiciones de victoria
- **Reconexión**: Manejo de desconexiones y reconexiones
- **Almacenamiento en memoria**: Map de salas activas

### Frontend (`client/src/`)

#### Contextos (`context/`)

**SocketContext.js**
- Conexión persistente con Socket.io
- Reconexión automática
- Estado de conexión

**GameContext.js**
- Estado global del juego
- Información del jugador (ID, nombre)
- Datos de la sala (roomId, players, gamePhase)
- Datos del juego (word, isImpostor, statements, etc.)

#### Páginas (`pages/`)

**Home.js**
- Pantalla de bienvenida
- Crear sala (host)
- Unirse a sala
- Input de nombre de jugador

**JoinRoom.js**
- Input de código de sala (6 dígitos)
- Validación de sala existente
- Conexión via Socket.io

**GameRoom.js**
- Orquestador principal
- Escucha eventos de Socket.io
- Renderiza componente según fase del juego
- Gestión de notificaciones

#### Componentes (`components/`)

**GameLobby.jsx**
- Lista de jugadores
- Código QR para compartir
- Botón de inicio (solo host)
- Estado de jugadores (conectado/desconectado)

**WordSelection.jsx**
- Input de palabra secreta (word chooser)
- Pantalla de espera (otros jugadores)
- Validación de palabra

**WordReveal.jsx**
- Vista diferenciada:
  - Impostor: "¡Eres el IMPOSTOR!"
  - Crewmates: "La palabra es: [WORD]"
- Countdown de 10 segundos
- Barra de progreso

**GamePlay.jsx**
- Turno actual destacado
- Input de declaración (jugador en turno)
- Timer de 30 segundos
- Feed de declaraciones previas
- Orden de turnos

**VotingPhase.jsx**
- Lista de jugadores votables
- Confirmación de voto
- Timer de 20 segundos
- Feedback visual

**GameOver.jsx**
- Pantalla de victoria/derrota
- Revelación de impostor
- Palabra secreta revelada
- Estadísticas
- Botón de nuevo juego
- Animación de confetti (ganadores)

## 🎨 Estilos y UI

### Tailwind CSS
- Configurado en `tailwind.config.js`
- Colores personalizados: `crew`, `impostor`
- Animaciones: `fade-in`, `bounce-slow`

### Componentes CSS Personalizados
En `index.css`:
- `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.card`, `.input-field`, `.player-card`
- `.timer-bar`, `.confetti`

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px+ (móvil), 768px+ (tablet), 1024px+ (desktop)
- Touch-friendly: Botones grandes (min 44x44px)
- Sin hover states (mejor para touch)

## 🔌 Flujo de Comunicación

### Crear Sala
```
Cliente → POST /create-room → Servidor
Servidor → Genera roomId → Responde con roomId
Cliente → Socket: join-room → Servidor
Servidor → Broadcast: player-joined → Todos
```

### Iniciar Juego
```
Host → Socket: start-game → Servidor
Servidor → Asigna roles (impostor, word chooser)
Servidor → Socket: game-started → Todos
Servidor → Socket: you-are-word-chooser → Word Chooser
```

### Revelar Palabra
```
Word Chooser → Socket: submit-word → Servidor
Servidor → Socket: word-reveal (con word) → Crewmates
Servidor → Socket: word-reveal (sin word) → Impostor
Servidor → Después de 10s → Inicia ronda 1
```

### Jugar Ronda
```
Servidor → Socket: round-started → Todos
Servidor → Socket: next-turn → Todos (jugador actual)
Jugador → Socket: submit-statement → Servidor
Servidor → Siguiente turno o fin de ronda
Servidor → Socket: statements-revealed → Todos
```

### Votar
```
Servidor → Socket: voting-started → Todos
Jugador → Socket: cast-vote → Servidor
Servidor → Procesa votos cuando todos votaron
Servidor → Socket: player-ejected → Todos
Servidor → Verifica condiciones de victoria
```

### Fin de Juego
```
Servidor → Socket: game-over → Todos
Jugador → Socket: new-game → Servidor
Servidor → Socket: game-reset → Todos
```

## 🧩 Dependencias Principales

### Backend
- `express`: ^4.18.2 - Framework web
- `socket.io`: ^4.6.1 - WebSockets
- `cors`: ^2.8.5 - CORS middleware
- `dotenv`: ^16.0.3 - Variables de entorno
- `nanoid`: ^3.3.6 - Generador de IDs

### Frontend
- `react`: ^18.2.0 - UI library
- `react-dom`: ^18.2.0 - React DOM
- `react-router-dom`: ^6.11.1 - Routing
- `socket.io-client`: ^4.6.1 - Socket.io cliente
- `framer-motion`: ^10.12.16 - Animaciones
- `qrcode.react`: ^3.1.0 - Códigos QR
- `tailwindcss`: ^3.3.2 - CSS framework

## 📊 Estado del Juego (Estructura de Datos)

### Room (servidor)
```javascript
{
  roomId: String,
  hostId: String,
  players: [{
    id: String,
    name: String,
    role: 'crew' | 'impostor',
    alive: Boolean,
    disconnected: Boolean,
    socketId: String
  }],
  gameStarted: Boolean,
  word: String,
  wordChooser: String (playerId),
  impostor: String (playerId),
  currentRound: Number,
  turnOrder: [String] (playerIds),
  currentTurnIndex: Number,
  statements: [{
    playerId: String,
    playerName: String,
    statement: String,
    round: Number
  }],
  votes: Map<playerId, targetId>,
  phase: 'lobby' | 'word-selection' | 'reveal' | 'playing' | 'voting' | 'game-over',
  phaseStartTime: Number
}
```

### GameData (cliente)
```javascript
{
  word: String,
  isImpostor: Boolean,
  isWordChooser: Boolean,
  currentRound: Number,
  turnOrder: [{id: String, name: String}],
  currentPlayer: {id: String, name: String},
  statements: [{playerName: String, statement: String}],
  winner: 'crew' | 'impostor',
  impostor: {id: String, name: String}
}
```

## 🔒 Seguridad

- Información sensible (palabra, roles) enviada solo a jugadores específicos
- Validación de entrada en servidor
- CORS configurado
- Rate limiting recomendado para producción
- Sanitización de inputs

## 🚀 Performance

- Almacenamiento en memoria (rápido, pero se pierde al reiniciar)
- WebSockets para comunicación en tiempo real (baja latencia)
- React Context para estado global (evita prop drilling)
- Lazy loading de componentes (opcional)
- Compresión de assets en producción

## 🎯 Próximas Mejoras Sugeridas

1. **Persistencia**: Base de datos (PostgreSQL, MongoDB)
2. **Autenticación**: Sistema de cuentas de usuario
3. **Estadísticas**: Historial de partidas, rankings
4. **Chat**: Mensajería en tiempo real
5. **PWA**: Instalable en móviles
6. **Tests**: Jest + React Testing Library
7. **I18n**: Soporte multiidioma
8. **Modo oscuro**: Toggle de tema
9. **Sonidos**: Efectos de audio
10. **Tutorial**: Onboarding interactivo

---

📝 **Nota**: Esta estructura está diseñada para ser modular y escalable. Cada componente tiene una responsabilidad única y clara.


