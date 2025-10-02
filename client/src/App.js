import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { GameProvider } from './context/GameContext';
import Home from './pages/Home';
import JoinRoom from './pages/JoinRoom';
import GameRoom from './pages/GameRoom';

function App() {
  return (
    <Router>
      <SocketProvider>
        <GameProvider>
          <div className="min-h-screen flex items-center justify-center p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/join" element={<JoinRoom />} />
              <Route path="/room/:roomId" element={<GameRoom />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </GameProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;


