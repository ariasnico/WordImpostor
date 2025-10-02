import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe usarse dentro de un GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [playerId] = useState(() => {
    // Usar sessionStorage en lugar de localStorage para que cada pestaña tenga su propio ID
    const stored = sessionStorage.getItem('playerId');
    if (stored) return stored;
    const newId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('playerId', newId);
    return newId;
  });

  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('playerName') || '';
  });

  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState([]);
  const [gamePhase, setGamePhase] = useState('home'); // home, lobby, word-selection, reveal, playing, voting, game-over
  const [isHost, setIsHost] = useState(false);
  const [gameData, setGameData] = useState({
    word: null,
    isImpostor: false,
    isWordChooser: false,
    currentRound: 0,
    turnOrder: [],
    currentPlayer: null,
    statements: [],
    winner: null
  });

  const updatePlayerName = (name) => {
    setPlayerName(name);
    localStorage.setItem('playerName', name);
  };

  const resetGame = () => {
    setRoomId('');
    setPlayers([]);
    setGamePhase('home');
    setIsHost(false);
    setGameData({
      word: null,
      isImpostor: false,
      isWordChooser: false,
      currentRound: 0,
      turnOrder: [],
      currentPlayer: null,
      statements: [],
      winner: null
    });
  };

  return (
    <GameContext.Provider
      value={{
        playerId,
        playerName,
        updatePlayerName,
        roomId,
        setRoomId,
        players,
        setPlayers,
        gamePhase,
        setGamePhase,
        isHost,
        setIsHost,
        gameData,
        setGameData,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};


