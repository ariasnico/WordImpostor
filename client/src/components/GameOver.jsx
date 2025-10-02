import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

const GameOver = () => {
  const { socket } = useSocket();
  const { roomId, gameData } = useGame();
  const [confetti, setConfetti] = useState([]);

  const isWinner = gameData.winner === 'crew' && !gameData.isImpostor;
  const isImpostorWin = gameData.winner === 'impostor';

  useEffect(() => {
    // Generar confetti si ganaste
    if (isWinner || (isImpostorWin && gameData.isImpostor)) {
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)]
      }));
      setConfetti(newConfetti);
    }
  }, [isWinner, isImpostorWin, gameData.isImpostor]);

  const handleNewGame = () => {
    socket.emit('new-game', { roomId });
  };

  return (
    <div className="card relative overflow-hidden">
      {/* Confetti */}
      {(isWinner || (isImpostorWin && gameData.isImpostor)) && (
        <div className="absolute inset-0 pointer-events-none">
          {confetti.map((item) => (
            <motion.div
              key={item.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${item.left}%`,
                top: '-10px',
                backgroundColor: item.color
              }}
              animate={{
                y: ['0vh', '110vh'],
                rotate: [0, 720],
                opacity: [1, 0]
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      )}

      <div className="text-center relative z-10">
        {/* Victoria de Crewmates */}
        {gameData.winner === 'crew' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-8xl mb-6"
            >
              {gameData.isImpostor ? '😭' : '🎉'}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-4xl font-bold mb-4 ${
                gameData.isImpostor ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {gameData.isImpostor ? '¡Fuiste Descubierto!' : '¡Victoria de los Crewmates!'}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-100 border-2 border-blue-500 rounded-xl p-6 mb-6"
            >
              <p className="text-lg text-blue-800 mb-3">
                El impostor era: <span className="font-bold text-2xl">{gameData.impostor?.name}</span>
              </p>
              <p className="text-lg text-blue-800">
                La palabra secreta era: <span className="font-bold text-2xl">"{gameData.word}"</span>
              </p>
            </motion.div>

            {gameData.isImpostor ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                <p className="font-semibold">
                  Los crewmates te identificaron y expulsaron. ¡Mejor suerte la próxima vez!
                </p>
              </div>
            ) : (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6">
                <p className="font-semibold">
                  ¡Excelente trabajo! Identificaron y expulsaron al impostor.
                </p>
              </div>
            )}
          </>
        )}

        {/* Victoria del Impostor */}
        {gameData.winner === 'impostor' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-8xl mb-6"
            >
              {gameData.isImpostor ? '🎭🎉' : '😱'}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-4xl font-bold mb-4 ${
                gameData.isImpostor ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              {gameData.isImpostor ? '¡Victoria del Impostor!' : '¡El Impostor Ganó!'}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-red-100 border-2 border-red-500 rounded-xl p-6 mb-6"
            >
              <p className="text-lg text-red-800 mb-3">
                El impostor era: <span className="font-bold text-2xl">{gameData.impostor?.name}</span>
              </p>
              <p className="text-lg text-red-800">
                La palabra secreta era: <span className="font-bold text-2xl">"{gameData.word}"</span>
              </p>
            </motion.div>

            {gameData.isImpostor ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                <p className="font-semibold">
                  ¡Increíble! Lograste sobrevivir y engañar a todos hasta el final.
                </p>
              </div>
            ) : (
              <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 rounded mb-6">
                <p className="font-semibold">
                  El impostor logró sobrevivir hasta quedar solo 2 jugadores. No pudieron identificarlo a tiempo.
                </p>
              </div>
            )}
          </>
        )}

        {/* Estadísticas del juego */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-100 rounded-xl p-6 mb-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Resumen del Juego</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3">
              <p className="text-gray-600">Rondas jugadas</p>
              <p className="text-2xl font-bold text-blue-600">{gameData.currentRound}</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-gray-600">Tu rol</p>
              <p className="text-2xl font-bold text-purple-600">
                {gameData.isImpostor ? '🎭 Impostor' : '✨ Crewmate'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Botones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={handleNewGame}
            className="btn-primary w-full"
          >
            🔄 Jugar de Nuevo
          </button>

          <p className="text-sm text-gray-600">
            El juego se reiniciará con los mismos jugadores
          </p>
        </motion.div>

        {/* Mensaje motivacional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg"
        >
          <p className="text-sm text-gray-700 italic">
            {gameData.isImpostor
              ? '"Un buen impostor sabe cuándo hablar y cuándo escuchar." 🎭'
              : '"La confianza es clave, pero la observación es fundamental." 🔍'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default GameOver;


