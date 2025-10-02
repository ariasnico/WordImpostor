import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

const GamePlay = () => {
  const { socket } = useSocket();
  const { playerId, roomId, gameData } = useGame();
  const [statement, setStatement] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [showInput, setShowInput] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isMyTurn = gameData.currentPlayer?.id === playerId;

  useEffect(() => {
    // Reset cuando cambia el jugador actual
    setSubmitted(false);
    setStatement('');
    setShowInput(false);
  }, [gameData.currentPlayer]);

  useEffect(() => {
    if (isMyTurn && !submitted) {
      setShowInput(true);
      setTimeLeft(30);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-submit si se acaba el tiempo
            if (!submitted && statement.trim()) {
              handleSubmit();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMyTurn, submitted, gameData.currentPlayer]);

  const handleSubmit = () => {
    const statementText = statement.trim() || '...';
    
    socket.emit('submit-statement', {
      roomId,
      playerId,
      statement: statementText
    });

    setSubmitted(true);
    setShowInput(false);
  };

  const currentPlayerIndex = gameData.turnOrder?.findIndex(p => p.id === gameData.currentPlayer?.id) || 0;
  const totalPlayers = gameData.turnOrder?.length || 0;

  return (
    <div className="card">
      {/* Header con información de ronda */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎮 Ronda {gameData.currentRound}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
            Turno {currentPlayerIndex + 1} de {totalPlayers}
          </div>
        </div>

        {!gameData.isImpostor && gameData.word && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg inline-block mb-2">
            <p className="text-sm">Palabra: <span className="font-bold text-lg">{gameData.word}</span></p>
          </div>
        )}

        {gameData.isImpostor && (
          <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-4 py-2 rounded-lg inline-block mb-2">
            <p className="text-sm font-bold">🎭 Eres el impostor</p>
          </div>
        )}
      </div>

      {/* Turno actual */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-4 text-center">
          <p className="text-sm mb-1">Turno de:</p>
          <p className="text-2xl font-bold">{gameData.currentPlayer?.name || '...'}</p>
        </div>
      </div>

      {/* Input de declaración (solo para el jugador en turno) */}
      <AnimatePresence>
        {isMyTurn && showInput && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-semibold mb-2">
                ⏰ ¡Es tu turno! Da una pista sobre la palabra
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-yellow-700">{timeLeft}s</span>
                <div className="flex-1 mx-4 bg-yellow-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-yellow-600"
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full p-4 text-lg border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              placeholder={gameData.isImpostor 
                ? "Da una pista que parezca que conoces la palabra..." 
                : "Describe la palabra sin decirla directamente..."}
              rows={3}
              maxLength={100}
              autoFocus
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">{statement.length}/100</span>
              <button
                onClick={handleSubmit}
                disabled={timeLeft === 0}
                className="btn-primary"
              >
                ✅ Enviar Pista
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Esperando turno */}
      {!isMyTurn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-6"
        >
          <p className="font-semibold">
            👀 Esperando que {gameData.currentPlayer?.name} dé su pista...
          </p>
        </motion.div>
      )}

      {/* Ya enviado */}
      {isMyTurn && submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6"
        >
          <p className="font-semibold">
            ✅ Pista enviada: "{statement}"
          </p>
        </motion.div>
      )}

      {/* Declaraciones previas de esta ronda */}
      {gameData.statements && gameData.statements.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            💬 Pistas hasta ahora:
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
            {gameData.statements.map((stmt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-100 rounded-lg p-3"
              >
                <p className="font-semibold text-gray-800">{stmt.playerName}:</p>
                <p className="text-gray-700 italic">"{stmt.statement}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Orden de turnos */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm font-semibold text-gray-700 mb-2">📋 Orden de turnos:</p>
        <div className="flex flex-wrap gap-2">
          {gameData.turnOrder?.map((player, index) => (
            <div
              key={player.id}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                player.id === gameData.currentPlayer?.id
                  ? 'bg-blue-600 text-white'
                  : index < currentPlayerIndex
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {index + 1}. {player.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePlay;


