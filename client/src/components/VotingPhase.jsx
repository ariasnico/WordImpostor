import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

const VotingPhase = () => {
  const { socket } = useSocket();
  const { playerId, roomId, players } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [voted, setVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = (targetId) => {
    if (voted) return;
    setSelectedPlayer(targetId);
    setShowConfirm(true);
  };

  const confirmVote = () => {
    socket.emit('cast-vote', {
      roomId,
      playerId,
      targetId: selectedPlayer
    });

    setVoted(true);
    setShowConfirm(false);
  };

  const cancelVote = () => {
    setSelectedPlayer(null);
    setShowConfirm(false);
  };

  const getPlayerEmoji = (index) => {
    const emojis = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍🔬', '👩‍🔬'];
    return emojis[index % emojis.length];
  };

  return (
    <div className="card">
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl mb-4"
        >
          🗳️
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Fase de Votación
        </h2>
        <p className="text-gray-600">
          Vota para expulsar a quien creas que es el impostor
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-3xl font-bold text-red-600">{timeLeft}s</span>
          <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500"
              style={{ width: `${(timeLeft / 20) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {voted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded text-center"
        >
          <div className="text-5xl mb-3">✅</div>
          <p className="text-xl font-bold">¡Voto emitido!</p>
          <p className="text-sm mt-2">Esperando que todos voten...</p>
        </motion.div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Selecciona a quién expulsar:
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto hide-scrollbar">
              {players.map((player, index) => (
                <motion.button
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleVote(player.id)}
                  className={`w-full p-4 rounded-lg flex items-center justify-between transition-all active:scale-95 ${
                    selectedPlayer === player.id
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : player.id === playerId
                      ? 'bg-yellow-100 border-2 border-yellow-500 text-yellow-800'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                  disabled={voted}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getPlayerEmoji(index)}</span>
                    <div className="text-left">
                      <p className="font-bold text-lg">{player.name}</p>
                      {player.id === playerId && (
                        <p className="text-xs">⚠️ Votarte a ti mismo es arriesgado</p>
                      )}
                    </div>
                  </div>
                  {selectedPlayer === player.id && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-2xl"
                    >
                      ☑️
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
            <p className="text-sm">
              💡 <strong>Consejo:</strong> Piensa en quién dio las pistas más sospechosas o fuera de lugar
            </p>
          </div>
        </>
      )}

      {/* Modal de confirmación */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={cancelVote}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Confirmar Voto
              </h3>
              <p className="text-gray-600">
                ¿Votar para expulsar a{' '}
                <span className="font-bold">
                  {players.find(p => p.id === selectedPlayer)?.name}
                </span>
                ?
              </p>
              {selectedPlayer === playerId && (
                <p className="text-red-600 font-semibold mt-2 text-sm">
                  ⚠️ ¡Estás votando por ti mismo!
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelVote}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={confirmVote}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default VotingPhase;


