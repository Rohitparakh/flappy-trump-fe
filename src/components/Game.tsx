
import React, { useEffect } from 'react';
import { useGameStore } from '@/lib/gameStore';
import Bird from './Bird';
import Pipe from './Pipe';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import Leaderboard from './Leaderboard';
import { Button } from '@/components/ui/button';

const GAME_WIDTH = 320;
const GAME_HEIGHT = 600;
const PIPE_GAP = 150;

const Game: React.FC = () => {
  const { 
    gameStarted, 
    gameOver, 
    pipes, 
    score, 
    addPipe, 
    movePipes, 
    resetGame 
  } = useGameStore();
  
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  
  // Generate pipes at regular intervals
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const pipeInterval = setInterval(() => {
      addPipe();
    }, 2500);
    
    return () => clearInterval(pipeInterval);
  }, [gameStarted, gameOver, addPipe]);
  
  // Move pipes at regular intervals
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gameInterval = setInterval(() => {
      movePipes();
    }, 24);
    
    return () => clearInterval(gameInterval);
  }, [gameStarted, gameOver, movePipes]);
  
  // Game UI controls
  const toggleLeaderboard = () => {
    if (gameStarted && !gameOver) {
      resetGame();
    }
    setShowLeaderboard(!showLeaderboard);
  };
  
  return (
    <div className="game-container relative" style={{ width: GAME_WIDTH }}>
      {/* Static Pixelated Background with vibrant colors */}
      <div 
        className="sky absolute w-full h-full z-0" 
        style={{ 
          backgroundColor: '#2a0a38',
          backgroundImage: `
            linear-gradient(180deg, rgba(80, 20, 100, 0.9) 0%, rgba(40, 10, 60, 0.8) 100%),
            repeating-linear-gradient(90deg, rgba(255, 50, 150, 0.15) 0px, rgba(255, 50, 150, 0.15) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(180deg, rgba(255, 50, 150, 0.15) 0px, rgba(255, 50, 150, 0.15) 1px, transparent 1px, transparent 20px)
          `,
        }}
      >
        {/* Pixelated grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Horizontal lines fading into distance */}
        <div className="absolute inset-x-0 bottom-0 h-full" style={{
          perspective: '500px',
          perspectiveOrigin: 'center bottom'
        }}>
          <div className="absolute inset-x-0 bottom-0 h-[300px]" style={{
            backgroundImage: `
              repeating-linear-gradient(180deg, rgba(255, 100, 255, 0.2) 0px, rgba(255, 100, 255, 0.2) 2px, transparent 2px, transparent 40px)
            `,
            transform: 'rotateX(70deg)',
            transformOrigin: 'bottom center',
            height: '100%'
          }}></div>
          
          {/* Pixelated blocks - static, not moving */}
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-sm"
                style={{
                  width: `${Math.floor(Math.random() * 8) + 4}px`,
                  height: `${Math.floor(Math.random() * 8) + 4}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  backgroundColor: i % 3 === 0 ? '#FF50FF' : i % 3 === 1 ? '#50FFFF' : '#FF5050'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Game elements */}
      {gameStarted && (
        <>
          <Bird />
          {pipes.map((pipe, index) => (
            <Pipe 
              key={index} 
              x={pipe.x} 
              height={pipe.height} 
              pipeGap={PIPE_GAP}
              gameHeight={GAME_HEIGHT}
            />
          ))}
        </>
      )}
      
      {/* Ground */}
      <div 
        className="ground absolute bottom-0 w-full h-16 z-30"
        style={{ 
          backgroundColor: '#300a45',
          backgroundImage: `
            linear-gradient(0deg, #3a0a55 0%, #2a0840 100%),
            linear-gradient(90deg, rgba(255, 0, 255, 0.2) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255, 0, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 10px 10px, 10px 10px',
          borderTop: '2px solid #FF00FF'
        }}
      ></div>
      
      {/* Score Display */}
      {gameStarted && !gameOver && (
        <div className="absolute top-5 left-0 right-0 text-center">
          <span className="text-4xl font-bold text-pink-400 drop-shadow-md" style={{ textShadow: '2px 2px 0 #000' }}>{score}</span>
        </div>
      )}
      
      {/* Game UI */}
      {!gameStarted && !gameOver && !showLeaderboard && <StartScreen />}
      {gameOver && <GameOverScreen />}
      {!gameStarted && !gameOver && showLeaderboard && <Leaderboard onClose={toggleLeaderboard} />}
      
      {/* Leaderboard Button (only visible on start screen, not during gameplay) */}
      {!gameStarted && !gameOver && !showLeaderboard && (
        <Button
          onClick={toggleLeaderboard}
          className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white"
        >
          Leaderboard
        </Button>
      )}
    </div>
  );
};

export default Game;
