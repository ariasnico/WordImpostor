import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

const WordSelection = () => {
  const { socket } = useSocket();
  const { playerId, roomId, gameData } = useGame();
  const [word, setWord] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!word.trim() || word.trim().length < 2) {
      alert('Por favor ingresa una palabra válida (mínimo 2 caracteres)');
      return;
    }

    socket.emit('submit-word', {
      roomId,
      playerId,
      word: word.trim()
    });

    setSubmitted(true);
  };

  if (!gameData.isWordChooser) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center"
      >
        <div className="mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            ⏳
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Esperando palabra secreta...
          </h2>
          <p className="text-gray-600">
            Uno de los jugadores está eligiendo la palabra secreta
          </p>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          <p className="text-sm">
            💡 Pronto recibirás la palabra o descubrirás que eres el impostor
          </p>
        </div>
      </motion.div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center"
      >
        <div className="mb-6">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            ✅
          </motion.div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            ¡Palabra enviada!
          </h2>
          <p className="text-gray-600">
            La palabra secreta es: <span className="font-bold text-xl">"{word}"</span>
          </p>
        </div>

        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
          <p className="text-sm">
            Esperando que todos vean sus roles...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          className="text-6xl mb-4"
        >
          🎯
        </motion.div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
          ¡Elige la Palabra Secreta!
        </h2>
        <p className="text-gray-600">
          Tú eres quien elige la palabra para esta partida
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-lg font-semibold mb-2">
          Palabra Secreta
        </label>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="input-field"
          placeholder="ej: elefante, tienda de café..."
          maxLength={50}
          autoComplete="off"
          autoFocus
        />
        <p className="text-sm text-gray-500 mt-2">
          {word.length}/50 caracteres
        </p>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded mb-6">
        <p className="font-semibold mb-2">📝 Instrucciones:</p>
        <ul className="text-sm space-y-1">
          <li>• Elige un sustantivo (1-2 palabras)</li>
          <li>• Debe ser adivinable por pistas</li>
          <li>• No demasiado obvio ni imposible</li>
          <li>• Ejemplos: "montaña", "película", "café"</li>
        </ul>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!word.trim() || word.trim().length < 2}
        className="btn-primary w-full"
      >
        ✅ Confirmar Palabra
      </button>
    </motion.div>
  );
};

export default WordSelection;


