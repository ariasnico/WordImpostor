const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { customAlphabet } = require('nanoid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configuración CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Generador de códigos de sala
const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

// Almacenamiento en memoria de las salas de juego
const rooms = new Map();

// Estructura de una sala
function createRoom(hostId, hostName) {
  return {
    roomId: nanoid(),
    hostId,
    players: [{
      id: hostId,
      name: hostName,
      role: null,
      alive: true,
      disconnected: false,
      socketId: null
    }],
    gameStarted: false,
    word: null,
    wordChooser: null,
    impostor: null,
    currentRound: 0,
    turnOrder: [],
    currentTurnIndex: 0,
    statements: [],
    votes: new Map(),
    phase: 'lobby', // lobby, word-selection, reveal, playing, voting, game-over
    roundTimer: null,
    phaseStartTime: null
  };
}

// Utilidad para seleccionar elementos aleatorios
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Utilidad para mezclar array (Fisher-Yates)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Rutas HTTP
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/create-room', (req, res) => {
  const { hostId, hostName } = req.body;
  
  if (!hostId || !hostName) {
    return res.status(400).json({ error: 'Host ID and name required' });
  }

  const room = createRoom(hostId, hostName);
  rooms.set(room.roomId, room);
  
  res.json({ roomId: room.roomId });
});

app.get('/room/:id', (req, res) => {
  const room = rooms.get(req.params.id.toUpperCase());
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json({ 
    exists: true, 
    playerCount: room.players.length,
    gameStarted: room.gameStarted
  });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join-room', ({ roomId, playerId, playerName }) => {
    const room = rooms.get(roomId.toUpperCase());
    
    if (!room) {
      socket.emit('error', { message: 'Sala no encontrada' });
      return;
    }

    if (room.gameStarted) {
      // Permitir reconexión
      const existingPlayer = room.players.find(p => p.id === playerId);
      if (existingPlayer) {
        existingPlayer.disconnected = false;
        existingPlayer.socketId = socket.id;
        socket.join(roomId);
        
        // Enviar estado actual del juego al jugador reconectado
        socket.emit('reconnected', {
          room: getSafeRoomData(room, playerId),
          playerId
        });
        
        io.to(roomId).emit('player-reconnected', {
          playerId: existingPlayer.id,
          playerName: existingPlayer.name
        });
      } else {
        socket.emit('error', { message: 'El juego ya comenzó' });
      }
      return;
    }

    // Verificar si el jugador ya está en la sala
    const existingPlayer = room.players.find(p => p.id === playerId);
    if (existingPlayer) {
      existingPlayer.socketId = socket.id;
      existingPlayer.disconnected = false;
    } else {
      if (room.players.length >= 10) {
        socket.emit('error', { message: 'Sala llena (máximo 10 jugadores)' });
        return;
      }

      room.players.push({
        id: playerId,
        name: playerName,
        role: null,
        alive: true,
        disconnected: false,
        socketId: socket.id
      });
    }

    socket.join(roomId);
    
    io.to(roomId).emit('player-joined', {
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        disconnected: p.disconnected
      }))
    });
  });

  socket.on('start-game', ({ roomId, hostId }) => {
    const room = rooms.get(roomId);
    
    if (!room || room.hostId !== hostId) {
      socket.emit('error', { message: 'No autorizado' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('error', { message: 'Mínimo 2 jugadores requeridos' });
      return;
    }

    // Asignar roles
    const alivePlayers = room.players.filter(p => p.alive && !p.disconnected);
    const impostorIndex = Math.floor(Math.random() * alivePlayers.length);
    room.impostor = alivePlayers[impostorIndex].id;
    
    alivePlayers.forEach(player => {
      player.role = player.id === room.impostor ? 'impostor' : 'crew';
    });

    // Seleccionar el Word Chooser (debe ser un crewmate)
    const crewmates = alivePlayers.filter(p => p.role === 'crew');
    room.wordChooser = getRandomElement(crewmates).id;

    room.gameStarted = true;
    room.phase = 'word-selection';
    room.phaseStartTime = Date.now();

    // Notificar a todos que el juego comenzó
    io.to(roomId).emit('game-started', {
      phase: 'word-selection'
    });

    // Notificar al Word Chooser
    const chooserPlayer = room.players.find(p => p.id === room.wordChooser);
    if (chooserPlayer) {
      io.to(chooserPlayer.socketId).emit('you-are-word-chooser', {
        message: 'Elige una palabra secreta (sustantivo, 1-2 palabras)'
      });
    }
  });

  socket.on('submit-word', ({ roomId, playerId, word }) => {
    const room = rooms.get(roomId);
    
    if (!room || room.wordChooser !== playerId) {
      socket.emit('error', { message: 'No autorizado' });
      return;
    }

    if (!word || word.trim().length === 0 || word.length > 50) {
      socket.emit('error', { message: 'Palabra inválida' });
      return;
    }

    room.word = word.trim();
    room.phase = 'reveal';
    room.phaseStartTime = Date.now();

    // Revelar la palabra a cada jugador según su rol
    room.players.forEach(player => {
      if (!player.socketId) return;
      
      if (player.role === 'impostor') {
        io.to(player.socketId).emit('word-reveal', {
          isImpostor: true,
          message: '¡Eres el IMPOSTOR! Adivina la palabra escuchando a los demás. ¡Disimula!'
        });
      } else {
        io.to(player.socketId).emit('word-reveal', {
          isImpostor: false,
          word: room.word,
          message: `La palabra secreta es: ${room.word}`
        });
      }
    });

    // Después de 10 segundos, iniciar la primera ronda
    setTimeout(() => {
      startNewRound(room);
    }, 10000);
  });

  socket.on('submit-statement', ({ roomId, playerId, statement }) => {
    const room = rooms.get(roomId);
    
    if (!room || room.phase !== 'playing') {
      socket.emit('error', { message: 'Fase de juego incorrecta' });
      return;
    }

    if (!statement || statement.trim().length === 0 || statement.length > 100) {
      socket.emit('error', { message: 'Declaración inválida' });
      return;
    }

    const currentPlayer = room.turnOrder[room.currentTurnIndex];
    if (currentPlayer !== playerId) {
      socket.emit('error', { message: 'No es tu turno' });
      return;
    }

    const newStatement = {
      playerId,
      playerName: room.players.find(p => p.id === playerId).name,
      statement: statement.trim(),
      round: room.currentRound
    };
    
    room.statements.push(newStatement);

    // Revelar la pista inmediatamente a todos
    io.to(roomId).emit('statement-added', {
      statement: newStatement
    });

    room.currentTurnIndex++;

    // Si todos han hablado en esta ronda
    if (room.currentTurnIndex >= room.turnOrder.length) {
      // Después de 3 segundos, iniciar votación
      setTimeout(() => {
        startVotingPhase(room);
      }, 3000);
    } else {
      // Siguiente turno
      const nextPlayer = room.players.find(p => p.id === room.turnOrder[room.currentTurnIndex]);
      io.to(roomId).emit('next-turn', {
        currentPlayer: {
          id: nextPlayer.id,
          name: nextPlayer.name
        },
        turnIndex: room.currentTurnIndex,
        totalPlayers: room.turnOrder.length
      });
    }
  });

  socket.on('cast-vote', ({ roomId, playerId, targetId }) => {
    const room = rooms.get(roomId);
    
    if (!room || room.phase !== 'voting') {
      socket.emit('error', { message: 'Fase de votación incorrecta' });
      return;
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.alive) {
      socket.emit('error', { message: 'No puedes votar' });
      return;
    }

    room.votes.set(playerId, targetId);

    // Verificar si todos han votado
    const alivePlayers = room.players.filter(p => p.alive && !p.disconnected);
    if (room.votes.size >= alivePlayers.length) {
      processVotes(room);
    }
  });

  socket.on('new-game', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    // Reiniciar el juego
    room.gameStarted = false;
    room.word = null;
    room.wordChooser = null;
    room.impostor = null;
    room.currentRound = 0;
    room.turnOrder = [];
    room.currentTurnIndex = 0;
    room.statements = [];
    room.votes = new Map();
    room.phase = 'lobby';
    
    room.players.forEach(p => {
      p.role = null;
      p.alive = true;
    });

    io.to(roomId).emit('game-reset', {
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        disconnected: p.disconnected
      }))
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    
    // Buscar al jugador en todas las salas
    for (const [roomId, room] of rooms.entries()) {
      const player = room.players.find(p => p.socketId === socket.id);
      if (player) {
        player.disconnected = true;
        
        io.to(roomId).emit('player-disconnected', {
          playerId: player.id,
          playerName: player.name
        });

        // Si el juego no ha comenzado y el host se desconecta, eliminar la sala
        if (!room.gameStarted && player.id === room.hostId) {
          rooms.delete(roomId);
          io.to(roomId).emit('room-closed', { message: 'El host cerró la sala' });
        }
      }
    }
  });
});

// Funciones auxiliares del juego
function startNewRound(room) {
  room.currentRound++;
  room.phase = 'playing';
  room.phaseStartTime = Date.now();
  room.currentTurnIndex = 0;
  
  // Generar orden aleatorio de jugadores vivos
  const alivePlayers = room.players.filter(p => p.alive && !p.disconnected);
  room.turnOrder = shuffleArray(alivePlayers.map(p => p.id));

  io.to(room.roomId).emit('round-started', {
    round: room.currentRound,
    turnOrder: room.turnOrder.map(id => {
      const player = room.players.find(p => p.id === id);
      return { id: player.id, name: player.name };
    })
  });

  // Iniciar el primer turno
  const firstPlayer = room.players.find(p => p.id === room.turnOrder[0]);
  io.to(room.roomId).emit('next-turn', {
    currentPlayer: {
      id: firstPlayer.id,
      name: firstPlayer.name
    },
    turnIndex: 0,
    totalPlayers: room.turnOrder.length
  });
}

function startVotingPhase(room) {
  room.phase = 'voting';
  room.phaseStartTime = Date.now();
  room.votes.clear();

  const alivePlayers = room.players.filter(p => p.alive && !p.disconnected);
  
  io.to(room.roomId).emit('voting-started', {
    players: alivePlayers.map(p => ({
      id: p.id,
      name: p.name
    }))
  });

  // Auto-procesar votos después de 20 segundos si no todos votaron
  setTimeout(() => {
    if (room.phase === 'voting') {
      processVotes(room);
    }
  }, 20000);
}

function processVotes(room) {
  const voteCounts = new Map();
  
  room.votes.forEach((targetId) => {
    voteCounts.set(targetId, (voteCounts.get(targetId) || 0) + 1);
  });

  // Encontrar el jugador con más votos
  let maxVotes = 0;
  let ejectedId = null;
  let isTie = false;

  voteCounts.forEach((count, playerId) => {
    if (count > maxVotes) {
      maxVotes = count;
      ejectedId = playerId;
      isTie = false;
    } else if (count === maxVotes && maxVotes > 0) {
      isTie = true;
    }
  });

  if (isTie || !ejectedId) {
    io.to(room.roomId).emit('no-ejection', {
      message: 'Empate en los votos. Nadie fue expulsado.'
    });
    
    setTimeout(() => {
      checkWinConditions(room);
    }, 3000);
    return;
  }

  const ejectedPlayer = room.players.find(p => p.id === ejectedId);
  ejectedPlayer.alive = false;

  const wasImpostor = ejectedId === room.impostor;

  io.to(room.roomId).emit('player-ejected', {
    ejectedPlayer: {
      id: ejectedPlayer.id,
      name: ejectedPlayer.name,
      wasImpostor
    },
    voteResults: Array.from(voteCounts.entries()).map(([id, count]) => ({
      playerId: id,
      playerName: room.players.find(p => p.id === id).name,
      votes: count
    }))
  });

  setTimeout(() => {
    checkWinConditions(room);
  }, 5000);
}

function checkWinConditions(room) {
  const alivePlayers = room.players.filter(p => p.alive && !p.disconnected);
  const impostorAlive = alivePlayers.some(p => p.id === room.impostor);

  if (!impostorAlive) {
    // Crewmates ganan
    room.phase = 'game-over';
    io.to(room.roomId).emit('game-over', {
      winner: 'crew',
      word: room.word,
      impostor: {
        id: room.impostor,
        name: room.players.find(p => p.id === room.impostor).name
      },
      message: '¡Los Crewmates ganaron! El Impostor fue expulsado.'
    });
  } else if (alivePlayers.length <= 2) {
    // Impostor gana (1v1 o menos)
    room.phase = 'game-over';
    io.to(room.roomId).emit('game-over', {
      winner: 'impostor',
      word: room.word,
      impostor: {
        id: room.impostor,
        name: room.players.find(p => p.id === room.impostor).name
      },
      message: '¡El Impostor ganó! Solo quedan 2 jugadores o menos.'
    });
  } else {
    // Continuar con siguiente ronda
    setTimeout(() => {
      startNewRound(room);
    }, 3000);
  }
}

function getSafeRoomData(room, playerId) {
  const player = room.players.find(p => p.id === playerId);
  
  return {
    roomId: room.roomId,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      alive: p.alive,
      disconnected: p.disconnected
    })),
    phase: room.phase,
    currentRound: room.currentRound,
    isImpostor: player?.role === 'impostor',
    word: player?.role === 'crew' ? room.word : null,
    isWordChooser: player?.id === room.wordChooser
  };
}

// Limpiar salas inactivas cada hora
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  for (const [roomId, room] of rooms.entries()) {
    if (now - room.phaseStartTime > oneHour) {
      rooms.delete(roomId);
      io.to(roomId).emit('room-closed', { message: 'Sala cerrada por inactividad' });
    }
  }
}, 60 * 60 * 1000);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});


