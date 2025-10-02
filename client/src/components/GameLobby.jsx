import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

const GameLobby = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { playerId, roomId, players, isHost } = useGame();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStartGame = () => {
    if (players.length < 2) {
      alert('Se necesitan al menos 2 jugadores para comenzar');
      return;
    }

    socket.emit('start-game', {
      roomId,
      hostId: playerId
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    navigate('/');
  };

  const roomUrl = `${window.location.origin}/room/${roomId}`;

  const getPlayerEmoji = (index) => {
    const emojis = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍🔬', '👩‍🔬'];
    return emojis[index % emojis.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎮 Sala de Juego
        </h1>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg text-2xl font-mono font-bold tracking-wider shadow-lg">
            {roomId}
          </div>
          <button
            onClick={handleCopyCode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all active:scale-95"
          >
            {copied ? '✓ Copiado' : '📋 Copiar'}
          </button>
        </div>
        
        <button
          onClick={() => setShowQR(!showQR)}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          {showQR ? '🔼 Ocultar QR' : '📱 Mostrar código QR'}
        </button>

        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-white rounded-lg inline-block"
          >
            <QRCodeSVG value={roomUrl} size={200} />
            <p className="text-sm text-gray-600 mt-2">Escanea para unirte</p>
          </motion.div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-between">
          <span>👥 Jugadores ({players.length}/10)</span>
          {isHost && <span className="text-sm text-blue-600">👑 Host</span>}
        </h2>
        
        <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`player-card ${player.disconnected ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getPlayerEmoji(index)}</span>
                <div className="flex-1">
                  <p className="font-bold text-lg">{player.name}</p>
                  {player.disconnected && (
                    <p className="text-xs text-white/80">Desconectado</p>
                  )}
                </div>
                {player.id === playerId && (
                  <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-semibold">
                    Tú
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {isHost ? (
        <button
          onClick={handleStartGame}
          disabled={players.length < 2}
          className="btn-primary w-full mb-3"
        >
          {players.length < 2 ? '⏳ Esperando jugadores...' : '🚀 Iniciar Juego'}
        </button>
      ) : (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-3 rounded">
          <p className="font-semibold">⏳ Esperando que el host inicie el juego...</p>
        </div>
      )}

      <button
        onClick={handleLeave}
        className="btn-secondary w-full"
      >
        🚪 Salir de la Sala
      </button>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-700 font-semibold mb-2">💡 Consejos:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Comparte el código con tus amigos</li>
          <li>• Mínimo 2 jugadores, máximo 10</li>
          <li>• Todos deben estar en sus móviles listos</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default GameLobby;


