import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

const JoinRoom = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { playerId, playerName, setRoomId } = useGame();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!code.trim()) {
      setError('Por favor ingresa el código de la sala');
      return;
    }

    if (!playerName) {
      setError('Nombre de jugador no configurado');
      navigate('/');
      return;
    }

    setLoading(true);
    setError('');

    const roomCode = code.trim().toUpperCase();

    try {
      // Verificar que la sala existe
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:3001'}/room/${roomCode}`);
      const data = await response.json();

      if (response.ok) {
        setRoomId(roomCode);
        
        // Unirse a la sala via Socket.io
        socket.emit('join-room', {
          roomId: roomCode,
          playerId,
          playerName
        });

        navigate(`/room/${roomCode}`);
      } else {
        setError(data.error || 'Sala no encontrada');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
      >
        ← Volver
      </button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🚪 Unirse a Sala
        </h1>
        <p className="text-gray-600">
          Ingresa el código de la sala para unirte
        </p>
      </div>

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
        <label htmlFor="roomCode" className="block text-gray-700 text-lg font-semibold mb-2">
          Código de Sala
        </label>
        <input
          id="roomCode"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          className="input-field text-center text-2xl tracking-widest font-mono"
          placeholder="ABC123"
          maxLength={6}
          autoComplete="off"
          disabled={loading}
        />
      </div>

      <button
        onClick={handleJoin}
        disabled={loading || !code.trim()}
        className="btn-primary w-full"
      >
        {loading ? '⏳ Uniéndose...' : '✅ Unirse al Juego'}
      </button>

      <div className="mt-6 text-center text-gray-600">
        <p className="text-sm">
          Jugando como: <span className="font-bold">{playerName}</span>
        </p>
      </div>
    </motion.div>
  );
};

export default JoinRoom;


