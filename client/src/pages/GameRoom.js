import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';
import GameLobby from '../components/GameLobby';
import WordSelection from '../components/WordSelection';
import WordReveal from '../components/WordReveal';
import GamePlay from '../components/GamePlay';
import VotingPhase from '../components/VotingPhase';
import GameOver from '../components/GameOver';

const GameRoom = () => {
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const {
    playerId,
    playerName,
    roomId,
    setRoomId,
    players,
    setPlayers,
    gamePhase,
    setGamePhase,
    gameData,
    setGameData,
    resetGame
  } = useGame();

  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (!playerName) {
      navigate('/');
      return;
    }

    if (urlRoomId) {
      setRoomId(urlRoomId.toUpperCase());
    }
  }, [urlRoomId, playerName, navigate, setRoomId]);

  useEffect(() => {
    if (!socket) return;

    // Eventos de lobby
    socket.on('player-joined', ({ players: newPlayers }) => {
      setPlayers(newPlayers);
    });

    socket.on('player-disconnected', ({ playerName }) => {
      showNotification(`${playerName} se desconectó`);
    });

    socket.on('player-reconnected', ({ playerName }) => {
      showNotification(`${playerName} se reconectó`);
    });

    // Eventos de inicio de juego
    socket.on('game-started', () => {
      setGamePhase('word-selection');
    });

    socket.on('you-are-word-chooser', () => {
      setGameData(prev => ({ ...prev, isWordChooser: true }));
    });

    // Eventos de revelación de palabra
    socket.on('word-reveal', ({ isImpostor, word, message }) => {
      setGamePhase('reveal');
      setGameData(prev => ({
        ...prev,
        isImpostor,
        word: word || null
      }));
      showNotification(message);
    });

    // Eventos de rondas
    socket.on('round-started', ({ round, turnOrder }) => {
      setGamePhase('playing');
      setGameData(prev => ({
        ...prev,
        currentRound: round,
        turnOrder,
        statements: []
      }));
    });

    socket.on('next-turn', ({ currentPlayer }) => {
      setGameData(prev => ({
        ...prev,
        currentPlayer
      }));
    });

    socket.on('statement-added', ({ statement }) => {
      setGameData(prev => ({
        ...prev,
        statements: [...prev.statements, statement]
      }));
    });

    // Eventos de votación
    socket.on('voting-started', ({ players: votingPlayers }) => {
      setGamePhase('voting');
      setPlayers(votingPlayers);
    });

    socket.on('player-ejected', ({ ejectedPlayer }) => {
      showNotification(`${ejectedPlayer.name} fue expulsado. ${ejectedPlayer.wasImpostor ? '¡Era el impostor!' : 'No era el impostor...'}`);
    });

    socket.on('no-ejection', ({ message }) => {
      showNotification(message);
    });

    // Eventos de fin de juego
    socket.on('game-over', ({ winner, word, impostor, message }) => {
      setGamePhase('game-over');
      setGameData(prev => ({
        ...prev,
        winner,
        word,
        impostor
      }));
      showNotification(message);
    });

    socket.on('game-reset', ({ players: newPlayers }) => {
      setPlayers(newPlayers);
      setGamePhase('lobby');
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
    });

    // Eventos de error
    socket.on('error', ({ message }) => {
      showNotification(message);
    });

    socket.on('room-closed', ({ message }) => {
      alert(message);
      resetGame();
      navigate('/');
    });

    socket.on('reconnected', ({ room }) => {
      // Restaurar estado del juego
      setPlayers(room.players);
      setGamePhase(room.phase);
      setGameData(prev => ({
        ...prev,
        word: room.word,
        isImpostor: room.isImpostor,
        isWordChooser: room.isWordChooser,
        currentRound: room.currentRound
      }));
    });

    return () => {
      socket.off('player-joined');
      socket.off('player-disconnected');
      socket.off('player-reconnected');
      socket.off('game-started');
      socket.off('you-are-word-chooser');
      socket.off('word-reveal');
      socket.off('round-started');
      socket.off('next-turn');
      socket.off('statement-added');
      socket.off('voting-started');
      socket.off('player-ejected');
      socket.off('no-ejection');
      socket.off('game-over');
      socket.off('game-reset');
      socket.off('error');
      socket.off('room-closed');
      socket.off('reconnected');
    };
  }, [socket, setPlayers, setGamePhase, setGameData, navigate, resetGame]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 4000);
  };

  const renderGamePhase = () => {
    switch (gamePhase) {
      case 'lobby':
        return <GameLobby />;
      case 'word-selection':
        return <WordSelection />;
      case 'reveal':
        return <WordReveal />;
      case 'playing':
        return <GamePlay />;
      case 'voting':
        return <VotingPhase />;
      case 'game-over':
        return <GameOver />;
      default:
        return <GameLobby />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
            {notification}
          </div>
        </div>
      )}
      
      {renderGamePhase()}
    </div>
  );
};

export default GameRoom;


