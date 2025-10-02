import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const { playerId, playerName, updatePlayerName, setRoomId, setIsHost } = useGame();
  const [name, setName] = useState(playerName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!connected) {
      setError('No hay conexión con el servidor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/create-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostId: playerId,
          hostName: name.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        updatePlayerName(name.trim());
        setRoomId(data.roomId);
        setIsHost(true);
        
        // Unirse a la sala via Socket.io
        socket.emit('join-room', {
          roomId: data.roomId,
          playerId,
          playerName: name.trim()
        });

        navigate(`/room/${data.roomId}`);
      } else {
        setError(data.error || 'Error al crear la sala');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = () => {
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    updatePlayerName(name.trim());
    navigate('/join');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="text-center mb-8">
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2"
        >
          🎭 Word Impostor
        </motion.h1>
        <p className="text-gray-600 text-lg">
          Juego de deducción social y palabras
        </p>
      </div>

      {!connected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p className="font-bold">Conectando al servidor...</p>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
        >
          <p>{error}</p>
        </motion.div>
      )}

      <div className="mb-6">
        <label htmlFor="playerName" className="block text-gray-700 text-lg font-semibold mb-2">
          Tu nombre
        </label>
        <input
          id="playerName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
          className="input-field"
          placeholder="Ingresa tu nombre"
          maxLength={20}
          autoComplete="off"
          disabled={loading}
        />
      </div>

      <div className="space-y-4">
        <button
          onClick={handleCreateRoom}
          disabled={loading || !connected}
          className="btn-primary w-full"
        >
          {loading ? '⏳ Creando...' : '🎮 Crear Sala'}
        </button>

        <button
          onClick={handleJoinRoom}
          disabled={loading || !connected}
          className="btn-secondary w-full"
        >
          🚪 Unirse a Sala
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📱 Cómo jugar:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 2-10 jugadores en sus móviles</li>
          <li>• Un jugador es el <span className="text-red-600 font-bold">Impostor</span></li>
          <li>• Los demás reciben una palabra secreta</li>
          <li>• Da pistas sin revelar la palabra</li>
          <li>• Vota para expulsar al impostor</li>
        </ul>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        ID de jugador: {playerId.substring(0, 15)}...
      </div>
    </motion.div>
  );
};

export default Home;


