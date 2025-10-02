import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const WordReveal = () => {
  const { gameData } = useGame();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (gameData.isImpostor) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="card text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🎭
        </motion.div>

        <h2 className="text-4xl font-bold text-red-600 mb-4">
          ¡Eres el IMPOSTOR!
        </h2>

        <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 mb-6">
          <p className="text-lg text-red-800 font-semibold mb-3">
            Tu misión:
          </p>
          <ul className="text-left text-red-700 space-y-2">
            <li>❌ No conoces la palabra secreta</li>
            <li>👂 Escucha las pistas de los demás</li>
            <li>🎭 Da pistas creíbles sin revelar que no sabes</li>
            <li>🎯 Trata de adivinar la palabra</li>
            <li>🛡️ Evita que te descubran y expulsen</li>
          </ul>
        </div>

        <div className="text-3xl font-bold text-gray-700 mb-2">
          {countdown > 0 ? countdown : '¡Comienza!'}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 10, ease: 'linear' }}
          />
        </div>

        <p className="text-gray-600 mt-4 text-sm">
          Memoriza tu rol. ¡La primera ronda comienza pronto!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="card text-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-8xl mb-6"
      >
        ✨
      </motion.div>

      <h2 className="text-3xl font-bold text-blue-600 mb-4">
        La palabra secreta es:
      </h2>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 mb-6 shadow-2xl"
      >
        <p className="text-5xl font-bold">
          {gameData.word}
        </p>
      </motion.div>

      <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-6 mb-6">
        <p className="text-lg text-blue-800 font-semibold mb-3">
          Tu misión:
        </p>
        <ul className="text-left text-blue-700 space-y-2">
          <li>✅ Memoriza la palabra</li>
          <li>💬 Da pistas que describan la palabra</li>
          <li>🤐 No la digas directamente</li>
          <li>🕵️ Identifica al impostor</li>
          <li>🗳️ Vota para expulsarlo</li>
        </ul>
      </div>

      <div className="text-3xl font-bold text-gray-700 mb-2">
        {countdown > 0 ? countdown : '¡Comienza!'}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-blue-500"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 10, ease: 'linear' }}
        />
      </div>

      <p className="text-gray-600 mt-4 text-sm">
        Memoriza bien la palabra. ¡La primera ronda comienza pronto!
      </p>
    </motion.div>
  );
};

export default WordReveal;


